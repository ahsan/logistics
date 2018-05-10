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
const sample_orders = require('./order.samples');
const Order = require('../api/v1/order/order.model');
const winston = require('../config/winston');

chai.use(chaiHttp);

/**
 * Unit Tests for /order endpoint
 */
describe('Order', function () {


    /**
     * POST tests
     */
    describe('POST', function() {

        // Seed the database
        beforeEach(function (done) {
            Order.remove({}).exec().then(function() {
                    winston.debug('Orders collection emptied.');
                    done();
            }).catch(function(err){
                    winston.error(`Encountered an error while seeding the database: ${JSON.stringify(err)}.`);
            });
        });

        it('should make an order in the db', function (done) {
            chai.request(app)
                .post(`${api_ver_prefix}/order`)
                .send({
                    order: sample_orders[0]
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.message.should.be.a('string');
                    res.body.order.should.be.a('object');
                    done();
                });
        });

        it('should return an error due to incomplete keys', function (done) {
            let order_data = Object.assign({}, sample_orders[0]);
            delete order_data.orderId;

            chai.request(app)
                .post(`${api_ver_prefix}/order`)
                .send({
                    order: order_data
                })
                .end(function (err, res) {

                    res.should.have.status(400);
                    res.body.message.should.be.a('string');
                    should.equal(res.body.order, null);
                    done();
                });
        });

        it('should return an error due to duplicate key', function (done) {
            let order_data = Object.assign({}, sample_orders[0]);

            chai.request(app)
                .post(`${api_ver_prefix}/order`)
                .send({
                    order: sample_orders[0]
                })
                .end(function (err, res) {

                    chai.request(app)
                        .post(`${api_ver_prefix}/order`)
                        .send({
                            order: sample_orders[0]
                        })
                        .end(function (err, res) {

                            res.should.have.status(400);
                            res.body.message.should.be.a('string');
                            should.equal(res.body.order, null);
                            done();
                        });
                });
        });

    });



    /**
     * GET tests
     */
    describe('GET', function(){

        // Seed the database
        beforeEach(function (done) {
            Order.remove({}).exec().then(function() {
                winston.debug('Orders collection emptied.');

                Order.create(sample_orders, function(err, orders_created){
                    if(err) {
                        winston.error(`Encountered an error while seeding the database: ${JSON.stringify(err)}.`);
                    }
                    done();
                });
            }).catch(function(err){
                    winston.error(`Encountered an error while seeding the database: ${JSON.stringify(err)}.`);
            });
        });

        it('should get orders by company name', function (done) {
            chai.request(app)
                .get(`${api_ver_prefix}/order?companyName=${sample_orders[0].companyName}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.message.should.be.a('string');
                    res.body.order.should.be.a('array');
                    should.equal(res.body.order.length, 2);
                    done();
                });
        });

        it('should get orders by customer address', function (done) {
            chai.request(app)
                .get(`${api_ver_prefix}/order?customerAddress=${sample_orders[2].customerAddress}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.message.should.be.a('string');
                    res.body.order.should.be.a('array');
                    should.equal(res.body.order.length, 3);
                    done();
                });
        });

        it('should not get orders by non existent company name', function (done) {
            chai.request(app)
                .get(`${api_ver_prefix}/order?companyName=the non existent company name that doesnt exist in the db`)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.message.should.be.a('string');
                    should.equal(res.body.order, null);
                    done();
                });
        });

        it('should not get orders by non existent customer address', function (done) {
            chai.request(app)
                .get(`${api_ver_prefix}/order?customerAddress=the non existent address that doesnt exist in the db`)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.message.should.be.a('string');
                    should.equal(res.body.order, null);
                    done();
                });
        });

        it('should get the sorted order of orderedItems', function (done) {
            chai.request(app)
                .get(`${api_ver_prefix}/order/sorted`)
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.message.should.be.a('string');
                    res.body.orders.should.be.a('array');
                    should.equal(res.body.orders.length, 3);

                    should.equal(res.body.orders[0].item_name, 'Thing2');
                    should.equal(res.body.orders[0].times_ordered, 3);

                    should.equal(res.body.orders[1].item_name, 'Thing3');
                    should.equal(res.body.orders[1].times_ordered, 2);

                    should.equal(res.body.orders[2].item_name, 'That thing');
                    should.equal(res.body.orders[2].times_ordered, 1);

                    done();
                });
        });

    });


    /**
     * DELETE tests
     */
    describe('DELETE', function(){

        // Seed the database
        beforeEach(function (done) {
            Order.remove({}).exec().then(function() {
                winston.debug('Orders collection emptied.');

                Order.create(sample_orders, function(err, orders_created){
                    if(err) {
                        winston.error(`Encountered an error while seeding the database: ${JSON.stringify(err)}.`);
                    }
                    done();
                });
            }).catch(function(err){
                    winston.error(`Encountered an error while seeding the database: ${JSON.stringify(err)}.`);
            });
        });

        it('should delete an order by orderId', function (done) {
            chai.request(app)
                .del(`${api_ver_prefix}/order?orderId=${sample_orders[0].orderId}`)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.message.should.be.a('string');
                    res.body.order.should.be.a('object');

                    done();
                });
        });

        it('should not delete an order by non-existent orderId', function (done) {
            chai.request(app)
                .del(`${api_ver_prefix}/order?orderId=12345678`)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.message.should.be.a('string');
                    should.equal(res.body.order, null);

                    done();
                });
        });
    });

});