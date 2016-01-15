/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Comment = mongoose.model('Comment'),
    Article = mongoose.model('Article');

var express = require('express');
var controller = require('../controllers/comments'),
    routes = require('../routes/comments'),
    request = require("supertest");


var auth = require("../../../../core/users/authorization");
/**
 * Globals
 */
var user, comment, article, approvedComment;

/**
 * Test Suites
 */
describe('<Unit Test>', function () {
    describe('Model Comment:', function () {
        beforeEach(function (done) {
            this.timeout(10000);
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            user.save(function () {

                article = new Article({

                    title: "test",
                    content: "test",
                    user: user

                });
                article.save(function () {

                    comment = new Comment({
                        content: 'Comment Content',
                        user: user,
                        article: article
                    });

                    approvedComment = new Comment({
                        content: 'Approved Comment',
                        user: user,
                        article: article,
                        status: "public"
                    });
                    done();

                });
            });
        });

        describe('Method Fetch', function () {

            it('should fail with unauthorized(401) if trying to access private comments and user is not admin', function (done) {
                this.timeout(10000);

                var app = express();

                routes(null, app, auth);

                comment.save(function (err, data) {
                    request(app)
                        .get('/api/comments/article/' + article._id)
                        .expect(401)
                        .end(function (err, res) {
                            if (err)
                                return done(err);
                            else
                                done();
                        });
                });
            });

            it('should be able to read at least 2 comments regardless of the status if user is admin', function (done) {
                this.timeout(10000);

                var app = express();

                auth.requiresAdmin = function (req, res, next) {
                    next();
                };

                routes(null, app, auth);

                comment.save(function (err, data) {
                    approvedComment.save(function (err, data) {
                        request(app)
                            .get('/api/comments')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }
                                else {
                                    var result = JSON.parse(JSON.stringify(res.body));
                                    expect(result.length).to.greaterThan(1);
                                    done();
                                }
                            });

                    });
                });
            });

            it('any user should be able to read at least one comment, and the status of everyone is approved', function (done) {
                this.timeout(10000);

                var app = express();

                routes(null, app, auth);

                comment.save(function (err, data) {
                    approvedComment.save(function (err, data) {
                        request(app)
                            .get('/api/comments/article/' + article._id + '/public')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }
                                else {
                                    var result = JSON.parse(JSON.stringify(res.body));
                                    expect(result.length).to.not.equal(0);
                                    for (var i in result) {
                                        expect(result[i].status).to.equal("public");
                                    }
                                    done();
                                }
                            });
                    });
                });
            });

        });
        describe('Method Save', function () {

            it('should be able to save without problems', function (done) {
                this.timeout(10000);

                return comment.save(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.content).to.equal('Comment Content');
                    expect(data.user.length).to.not.equal(0);
                    expect(data.created.length).to.not.equal(0);
                    done();
                });

            });


            it('should be able to show an error when try to save without content', function (done) {
                this.timeout(10000);
                comment.content = '';

                return comment.save(function (err) {
                    expect(err).to.not.be(null);
                    done();
                });
            });


        });

        afterEach(function (done) {
            this.timeout(10000);
            comment.remove(function () {
                approvedComment.remove(function () {
                    article.remove(function () {
                        user.remove(done);
                    });
                });
            });
        });
    });
});
