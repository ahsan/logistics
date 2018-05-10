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

const Company = require('./company.model');
const Order = require('../order/order.model');
const winston = require('../../../config/winston');

/**
 * Gets a company by name.
 * @param req: the request object, its query contains the company name.
 * @param res: the response object
 * @return response code, message and company.
 */
exports.get_company = function (req, res) {
    Company.findOne(
        req.mongoose_query,
        {_id: 0, __v: 0, updatedAt:0, createdAt:0}, // user doesnt care about these fields
        function(err, found_company) {
            if(err) {
                winston.error(`Encountered an error while querying a customer company: ${JSON.stringify(err)}`);
                return res.status(500).json({
                    message: err.message,
                    company: null
                });
            } else if (found_company == null) {
                return res.status(400).json({
                    message: `Could not find a customer company with the given query parameters`,
                    company: null
                });
            } else {
                return res.status(200).json({
                    message: `Found customer company successfully.`,
                    company: found_company
                });
            }
    });
};

/**
 * Gets all orders by company
 * @param req: the request object, its query contains the company name.
 * @param res: the response object
 * @return response code, message and company.
 */
exports.get_company_orders = function (req, res) {

    Company.findOne(req.mongoose_query)
        .populate('orders')
        .exec()
        .then(function(found_company){
            if (found_company == null) {
                return res.status(400).json({
                    message: `Could not find a customer company with the given query parameters`,
                    orders: null
                });
            } else {
                return res.status(200).json({
                    message: `Found customer company successfully.`,
                    orders: found_company.orders
                });
            }
        })
        .catch(function(err) {
            winston.error(`Encountered an error while querying a customer company for orders: ${JSON.stringify(err)}`);
            return res.status(500).json({
                message: err.message,
                orders: null
            });
        });
};




/**
 * Gets the amount of money paid by a company.
 * @param req: the request object, its query contains the company name.
 * @param res: the response object
 * @return response code, message and company.
 */
exports.get_company_money_paid = function (req, res) {

    // get all the orders of this company
    Company.findOne(req.mongoose_query)
        .populate('orders')
        .exec()
        .then(function(found_company){
            if (found_company == null) {
                return res.status(400).json({
                    message: `Could not find a customer company with the given query parameters`,
                    money_paid: null
                });
            } else {
                let orders = found_company.orders;
                let return_dict = {};

                orders.forEach(order => {
                    if(return_dict[order.currency] == null){
                        return_dict[order.currency] = order.price;
                    } else {
                        return_dict[order.currency] += order.price;
                    }
                });

                return res.status(200).json({
                    message: `Calculated the money paid by customer company successfully.`,
                    money_paid: return_dict
                });
            }
        })
        .catch(function(err) {
            winston.error(`Encountered an error while querying a customer company for orders: ${JSON.stringify(err)}`);
            return res.status(500).json({
                message: err.message,
                money_paid: null
            });
        });
};

/**
 * Gets all companies that ordered a specific orderedItem.
 * @param req: the request object, its query contains the company name.
 * @param res: the response object
 * @return response code, message and company.
 */
exports.get_companies_by_order = function (req, res) {
    Order.find(
        req.mongoose_query,
        'companyName', // only return company names
        function(err, found_orders) {
            if(err) {
                winston.error(`Encountered an error while querying for customer  companies: ${JSON.stringify(err)}`);
                return res.status(500).json({
                    message: err.message,
                    companies: null
                });
            } else if (found_orders == null) {
                return res.status(400).json({
                    message: `Could not find a customer company with the given query parameters`,
                    companies: null
                });
            } else {
                let return_companies = new Set();

                found_orders.forEach(order => {
                    winston.debug(`adding ${order.companyName}`);
                    return_companies.add(order.companyName);
                });

                return res.status(200).json({
                    message: `Found all the customer company(s) successfully that ordered the provided item.`,
                    companies: Array.from(return_companies)
                });
            }
    });
};


/**
 * Updates a company by name.
 * @param req: the request object, its query contains the company name.
 * @param res: the response object
 * @return response code, message and company.
 */
exports.update_company = function (req, res) {
    // if(req.body.company.name == null) {
    //     return res.status(500).json({
    //         message: `The company object must have a name field.`,
    //         company: null
    //     });
    // }
    // let mongoose_query = {'name': req.body.company.name};

    Company.findOneAndUpdate(
        req.mongoose_query,
        {$set: req.body.company},
        {new: true},
        function(err, updated_company) {
            if(err) {
                winston.error(`Encountered an error while updating a customer company: ${JSON.stringify(err)}`);
                return res.status(500).json({
                    message: err.message,
                    company: null
                });
            } else if (updated_company == null) {
                return res.status(400).json({
                    message: `Could not find a customer company with the given query parameters`,
                    company: null
                });
            } else {
                return res.status(200).json({
                    message: `Updated customer company successfully.`,
                    company: updated_company
                });
            }
    });
};


/**
 * Deletes a company.
 * @param req: the request object
 * @param res: the response object
 * @return response code, message and deleted company.
 */
exports.delete_company = function (req, res) {
    Company.findOneAndRemove(
        req.mongoose_query,
        function(err, deleted_company) {
            if(err) {
                winston.error(`Encountered an error while deleting a customer company: ${JSON.stringify(err)}`);
                return res.status(500).json({
                    message: err.message,
                    company: null
                });
            } else if (!deleted_company) {
                return res.status(400).json({
                    message: `Could not find a customer  company with the given query parameters`,
                    company: null
                });
            } else {
                return res.status(200).json({
                    message: `Deleted customer company successfully.`,
                    order: deleted_company
                });
            }
    });
};


