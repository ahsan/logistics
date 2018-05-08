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

/**
 * Sample orders
 */
module.exports = [
    {
      orderId: 001,
      companyName: 'That Company',
      customerAddress: 'That road in that city',
      orderedItem: 'That thing',
      price: 100,
      currency: 'USD',
    },
    {
      orderId: 002,
      companyName: 'That Company',
      customerAddress: 'That other road in the other city',
      orderedItem: 'Thing2',
      price: 300,
      currency: 'USD',
    },
    {
      orderId: 003,
      companyName: 'Company1',
      customerAddress: '1 Road1 City1',
      orderedItem: 'Thing2',
      price: 1,
      currency: 'USD',
    },
    {
      orderId: 004,
      companyName: 'Company2',
      customerAddress: '2 Road1 City1',
      orderedItem: 'Thing2',
      price: 10,
      currency: 'USD',
    },
    {
      orderId: 005,
      companyName: 'Company2',
      customerAddress: '1 Road1 City1',
      orderedItem: 'Thing3',
      price: 180,
      currency: 'EUR',
    },
    {
      orderId: 006,
      companyName: 'Company2',
      customerAddress: '1 Road1 City1',
      orderedItem: 'Thing3',
      price: 180,
      currency: 'EUR',
    }
];