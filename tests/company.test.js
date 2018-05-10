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

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../app');
const api_ver_prefix = '/v1'
const sample_companies = require('./company.samples');
const Order = require('../api/v1/order/order.model');
const Company = require('../api/v1/company/company.model');
const winston = require('../config/winston');

chai.use(chaiHttp);

// Wait for the server to get up
before(function (done) {
    app.on("appStarted", function () {
        done();
    });
});

/**
 * Unit Tests for /company endpoint
 */
describe('Order', function () {

    /**
     * GET tests
     */
    describe('GET', function(){
        winston.debug('inside the get tests');
        // Seed the database
        beforeEach(function (done) {
            Company.remove({}).exec().then(function() {
                winston.debug('Companies collection emptied.');

                Company.create(sample_companies, function(err, orders_created){
                    if(err) {
                        winston.error(`Encountered an error while seeding the database: ${JSON.stringify(err)}.`);
                    }
                    done();
                });
            }).catch(function(err){
                    winston.error(`Encountered an error while seeding the database: ${JSON.stringify(err)}.`);
                    done();
            });
        });

        it('should get company info by company name', function (done) {
            chai.request(app)
                .get(`${api_ver_prefix}/company?name=${sample_companies[0].name}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.message.should.be.a('string');
                    res.body.company.should.be.a('object');
                    // should.equal(res.body.order.length, 2);
                    done();
                });
        });


        it('should not get company info for non existent company name', function (done) {
            chai.request(app)
                .get(`${api_ver_prefix}/company?name=non_exitent_name`)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.message.should.be.a('string');
                    should.equal(res.body.company, null);
                    done();
                });
        });

        it('should get all orders of a company', function (done) {
            chai.request(app)
                .get(`${api_ver_prefix}/company/orders?name=${sample_companies[0].name}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.message.should.be.a('string');
                    should.equal(res.body.company.orders.length, 0);
                    done();
                });
        });

    });
});