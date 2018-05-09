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


const path = require('path');
const mongoose = require('mongoose');
const async = require('async');
const winston = require('./winston');

/**
 *
 * @param {*} callback - Callback function to be called after configuration.
 */
module.exports = function (callback) {
  async.series(
    [
      // Setup the environment
      function(environment_callback) {

        // Define mongodb address based on the application environment variables
        if (!process.env.MONGO_DB_ADDRESS || process.env.MONGO_DB_ADDRESS === '') {
          winston.error('MongoDB address was not found. Exiting the application.');
          process.exit(1);
        }
        const db_url = process.env.NODE_ENV === 'TEST' ? process.env.MONGO_DB_ADDRESS + process.env.MONGO_DB_TEST : process.env.MONGO_DB_ADDRESS + process.env.MONGO_DB_PROD;

        /**
         * connect to the mongodb
        */

        // on succesful connection
        mongoose.connection.on('connected', function() {
          winston.info('MongoDB connected on: ', db_url);
          environment_callback();
        });

        // if the connection throws an error
        mongoose.connection.on('error', function (err) {
          winston.error('Encountered an error while connecting to MongoDB: ', JSON.stringify(err));
        });

        // on disconnection
        mongoose.connection.on('disconnected', function() {
          winston.error('Mongoose connection disconnected');
        });

        mongoose.connect(db_url).catch( function(err) {
          if(err) {
            winston.error(JSON.stringify(err));
            environment_callback(err);
          }
          // environment_callback();
        });


      }
    ],

    // callback for the async ladder
    function (err) {
      if (err) {
        winston.error('Error while executing the async series: ', JSON.stringify(err));
        return callback(err);
      } else {
        return callback();
      }
    }
  );
};
