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

const winston = require('winston');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

// logs directory
const log_directory = 'logs';

// make the directory structure for logs
if (!fs.existsSync(log_directory)) {
  fs.mkdirSync(log_directory);
}
const logs = path.join(log_directory, 'logistics.log');

// set the level depending on the process.env
let log_level = process.env.LOG_LEVEL || 'error';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: logs}),
  ],
  level: log_level,
});

console.log('Winston logger created.');

module.exports = logger;
