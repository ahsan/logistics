/** This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/> **/

const Order = require('./order.model');
const Company = require('../company/company.model');
const winston = require('../../../config/winston');

/**
 * Creates an order.
 * @param req: the request object, contains the order object in body.
 * @param res: the response object
 * @return response code, message and created order.
 */
exports.create_order = function (req, res) {
    Order.create(
        req.body.order,
        function (err, order) {
            if (err) {
              winston.error(
                `Encountered an error while creating order.
                 Request: ${JSON.stringify(req.body.order)},
                 Error: ${JSON.stringify(err)}`
              );
              return res.status(400).json({
                  message: err.message,
                  order: null
              });
            }
            winston.debug(`Order created`);
            // on creation of an order, add it to the company's orders
            Company.findOneAndUpdate(
                {'name': order.companyName},
                { $push: {orders: order._id}},
                {new: true},
                function(err, updated_company) {
                    if(err) {
                        winston.error(`Order created but encountered an error while updating the company: ${JSON.stringify(err)}`);
                        return res.status(500).json({
                            message: err.message,
                            order: order
                        });
                    } else if (updated_company == null) {
                        // the company does not exist yet, create it
                        winston.debug(`Company does not exist`);
                        Company.create({
                                'name': order.companyName,
                                'orders': [order._id]
                            },
                            function (err, created_company) {
                                if (err) {
                                  winston.error(
                                    `Order created but encountered an error while creating company.
                                     Request: ${JSON.stringify(req.body.order)},
                                     Error: ${JSON.stringify(err)}`
                                  );
                                  return res.status(400).json({
                                    message: `Order created but could not find/create a company with companyName`,
                                    order: order
                                });
                                }
                                return res.status(200).json({
                                    message: "Order created successfully, new company added to the db.",
                                    order: order
                                });
                            });
                    } else {
                        // everything went okay
                        winston.debug(`Company does not exist`);
                        return res.status(200).json({
                            message: "Order created successfully.",
                            order: order
                        });
                    }
                });
        });
};


/**
 * Gets an order.
 * @param req: the request object
 * @param res: the response object
 * @return response code, message and queried order.
 */
exports.get_order = function (req, res) {
    Order.find(
        req.mongoose_query,
        {_id: 0, __v: 0, updatedAt:0, createdAt:0}, // user doesnt care about these fields
        function(err, found_orders) {
            if(err) {
                winston.error(`Encountered an error while querying an order: ${JSON.stringify(err)}`);
                return res.status(500).json({
                    message: err.message,
                    order: null
                });
            } else if (found_orders.length == 0) {
                return res.status(400).json({
                    message: `Could not find an order with the given query parameters`,
                    order: null
                });
            } else {
                return res.status(200).json({
                    message: `Found order(s) successfully.`,
                    order: found_orders
                });
            }
    });
};

/**
 * Deletes an order.
 * @param req: the request object
 * @param res: the response object
 * @return response code, message and queried order.
 */
exports.delete_order = function (req, res) {
    // ToDo: Make this more atomic
    let retMessage = "";
    Order.findOneAndRemove(
        req.mongoose_query,
        function(err, deleted_order) {
            if(err) {
                winston.error(`Encountered an error while deleting an order: ${JSON.stringify(err)}`);
                return res.status(500).json({
                    message: err.message,
                    order: null
                });
            } else if (!deleted_order) {
                return res.status(400).json({
                    message: `Could not find an order with the given query parameters`,
                    order: null
                });
            } else {
                winston.debug(`Order deleted`);
                // on deletion of an order, also remove it from its corresponding company
                Company.findOneAndUpdate(
                    {'name': deleted_order.companyName},
                    {$pull: {orders: deleted_order._id}},
                    {new: true},
                    function(err, updated_company) {
                        if(err) {
                            winston.error(`Deleted the order but encountered an error while updating its company: ${JSON.stringify(err)}`);
                            return res.status(500).json({
                                message: err.message,
                                order: deleted_order
                            });
                        } else if (updated_company == null) {
                            return res.status(500).json({
                                message: `Deleted the order but could not find a company with this companyName.`,
                                order: deleted_order
                            });
                        } else {
                            winston.debug(`Order pulled from the company`);
                            return res.status(200).json({
                                message: `Deleted order successfully.`,
                                order: deleted_order
                            });
                        }
                });
            }
    });


};

exports.sort_by_ordered_item = function(req, res) {
    // Get a list of distinct orderedItems
    Order.distinct('orderedItem', function(err, distinct_items) {
        if(err) {
            winston.error(`Encountered an error while getting the distinct types of orderedItem: ${JSON.stringify(err)}`);
            return res.status(500).json({
                message: err.message
            });
        } else if (distinct_items.length == 0) { // there were no orderedItems in the DB
            return res.status(400).json({
                message: `Could not find any type of ordered item. There aren't any orders placed yet.`
            });
        } else {

            let count_promises = []; // this array will hold all the promises
            let items_count_arr = []; // this array will hold the count results

            // get the counts of each distinct oredered item, asynchronously
            distinct_items.forEach(item => {
                countPromise = Order.count({'orderedItem': item}).exec();
                count_promises.push(countPromise);
                countPromise.then(function(count){
                    items_count_arr.push([item, count]);
                }).catch(function(err){
                    winston.error(`Encountered an error while counting the orders of orderedItem: ${item}.
                    ${JSON.stringify(err)}`);
                });
            });

            Promise.all(count_promises).then(function(){
                // the items_count_arr is complete here, it just needs to be sorted

                // sort the items_count_arr
                items_count_arr.sort(function compare_items(item_a,item_b) {
                    return item_b[1] - item_a[1]; // descending order
                });

                // make the result more presentable
                let return_arr = items_count_arr.map(function(array_item) {
                    return {
                        'item_name': array_item[0],
                        'times_ordered': array_item[1]
                    }
                });

                // respond with the results
                return res.status(200).json({
                    message: `Successfully sorted the ordered items in descneding order.`,
                    orders: return_arr
                });

            }).catch(function(err){
                return res.status(500).json({
                    message: `Encountered an error while getting counts of all the distinct orderedItems: ${JSON.stringify(err)}`
                });
                console.log(err)
            });
        }
    });
};
