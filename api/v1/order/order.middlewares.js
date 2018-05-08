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

const winston = require('../../../config/winston');

// checks if the order to be created exists in the POST body
module.exports.verify_order_exists = function(req, res, next) {
  if(!req.body.order){
    return res.status(400).json({
      message: `Request's body does not have the order object.`
    });
  }
  next();
}

// allows get query on specific query strings and if they are
// present in the GET request
module.exports.verify_get_query = function(req, res, next) {
  if(!req.query){
    return res.status(400).json({
      message: `The request does not have a valid query.`
    });
  }

  const valid_queries = ['companyName', 'customerAddress'];
  let query_keys = Object.keys(req.query);
  let mongoose_query = {};

  query_keys.forEach(query_key => {
    if(valid_queries.includes(query_key)) {
      mongoose_query[query_key] = req.query[query_key];
    }
  });

  // respond with error if the mongoose_query object is empty
  if(JSON.stringify(mongoose_query) === JSON.stringify({})) {
    return res.status(400).json({
      message: `The request does not have a valid query. Valid queries are 'companyName' and 'customerAddress'.`
    });
  } else {
    req.mongoose_query = mongoose_query;
    next();
  }
}