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

const express = require('express');
const controller = require('./order.controller');
const middlewares = require('./order.middlewares');
const shared_middlewares = require('../shared.middlewares');

let router = new express.Router();

// create a new order
router.post('/', middlewares.verify_order_exists, controller.create_order);

// get order(s)
router.get('/', shared_middlewares.verify_query_params(['companyName', 'customerAddress']), controller.get_order);

// delete an order by orderId. orderId is required
router.delete('/', shared_middlewares.verify_query_params(['orderId']), controller.delete_order);

// get the sorted list of orders by the number of orders placed for each type of orderedItem
router.get('/sorted', controller.sort_by_ordered_item);


module.exports = router;