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
        function (err, user) {
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

            return res.status(200).json({
                message: "Order created successfully.",
                user: user
            });
        });
};


/**
 * Gets an order.
 * @param req: the request object, contains a query param .
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
            } else if (!found_orders) {
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
