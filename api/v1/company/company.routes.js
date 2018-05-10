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
const controller = require('./company.controller');
const middlewares = require('./company.middlewares');
const shared_middlewares = require('../shared.middlewares');

let router = new express.Router();

// get company info
router.get('/', shared_middlewares.verify_query_params(['address']), controller.get_company);

// get all orders of a company
router.get('/orders', shared_middlewares.verify_query_params(['address']), controller.get_company_orders);

// Get the amount of money paid by a company
router.get('/money_paid', shared_middlewares.verify_query_params(['address']), controller.get_company_money_paid);

// Get all companies that bought a certain orderItem
router.get('/specific_item', shared_middlewares.verify_query_params(['orderedItem']), controller.get_companies_by_order);

// update company info
router.put('/', shared_middlewares.verify_query_params(['address']), middlewares.verify_company_exists, controller.update_company);

// delete company
router.delete('/', shared_middlewares.verify_query_params(['address']), controller.delete_company);




module.exports = router;