'use strict';

(function () {


    describe('Test test case', function () {
        it('1 should be equals to 1', function () {
            expect(1).toBe(1);
        });
    });


    // Articles Controller Spec
    describe('MEAN controllers', function () {
        describe('CommentsController', function () {
            // The $resource service augments the response object with methods for updating and deleting the resource.
            // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
            // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
            // When the toEqualData matcher compares two objects, it takes only object properties into
            // account and ignores methods.
            beforeEach(function () {
                jasmine.addMatchers({
                    toEqualData: function () {
                        return {
                            compare: function (actual, expected) {
                                return {
                                    pass: angular.equals(actual, expected)
                                };
                            }
                        };
                    }
                });
            });

            beforeEach(function () {
                module('mean');
                module('mean.system');
                module('mean.articles');
                module('mean.comments');
                module('ngMockE2E');
            });

// Initialize the controller and a mock scope
            var CommentsController,
                scope,
                $httpBackend,
                $stateParams,
                $location;


// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
// This allows us to inject a service but then attach it to a variable
// with the same name as the service.
            beforeEach(inject(function ($controller, $rootScope, _$location_,
                                        _$stateParams_, _$httpBackend_, $location) {

                scope = $rootScope.$new();

                CommentsController = $controller('CommentsController', {
                    $scope: scope
                });

                $stateParams = _$stateParams_;

                $httpBackend = _$httpBackend_;

                $location = _$location_;


            }));

            // fixture expected POST data
            var articleData = {
                _id: "1234"
            };

            var postCommentData = {
                article: articleData._id,
                content: 'MEAN rocks!', user: 0
            };


            // fixture expected response data
            var responseCommentData = {
                article: articleData,
                _id: '525cf20451979dea2c000001',
                content: 'MEAN rocks!', user: 0

            };

            it('$scope.create() with valid form data should send a POST request ' +
            'with the form input values and then ' +
            'form is reset', function () {


                scope.content = 'MEAN rocks!';

                $httpBackend.when('GET', '/api/users/me').respond(200, {
                    status: "success"
                });


                // test post request is sent
                $httpBackend.expectPOST('api\/comments', function () {
                    return postCommentData
                }).respond(responseCommentData);

                // Run controller
                scope.create(scope.content, articleData);

                $httpBackend.when('GET', 'system/views/index.html').respond(200, {
                    status: "success"
                });

                $httpBackend.flush();

                // test form input(s) are reset
                expect(scope.content).toEqual('');

            });


            ////////////////////////////////////////////////////////////////



            it('$scope.find() should create an array with at least one comment object ' +
            'fetched from XHR', function() {


                $httpBackend.when('GET', '/api/users/me').respond(200, {
                    status: "success"
                });

                // test expected GET request
                $httpBackend.expectGET('api\/comments/article/1234').respond([responseCommentData]);
                

                scope.article = articleData;

                $httpBackend.when('GET', 'system/views/index.html').respond(200, {
                    status: "success"
                });
                
                $httpBackend.flush();

                // test scope value
                expect(scope.comments).toEqualData([responseCommentData]);

            });
        })
    }); //Mean controlers

}());






/*



 it('$scope.update(true) should update a valid article', inject(function(Articles) {

 // fixture rideshare
 var putArticleData = function() {
 return {
 _id: '525a8422f6d0f87f0e407a33',
 title: 'An Article about MEAN',
 to: 'MEAN is great!'
 };
 };

 // mock article object from form
 var article = new Articles(putArticleData());

 // mock article in scope
 scope.article = article;

 // test PUT happens correctly
 $httpBackend.expectPUT(/api\/articles\/([0-9a-fA-F]{24})$/).respond();

 // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
 //$httpBackend.expectPUT(/articles\/([0-9a-fA-F]{24})$/, putArticleData()).respond();
 [>
 Error: Expected PUT /articles\/([0-9a-fA-F]{24})$/ with different data
 EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","title":"An Article about MEAN","to":"MEAN is great!"}
 GOT:      {"_id":"525a8422f6d0f87f0e407a33","title":"An Article about MEAN","to":"MEAN is great!","updated":[1383534772975]}
 <]

 // run controller
 scope.update(true);
 $httpBackend.flush();

 // test URL location to new object
 expect($location.path()).toBe('/articles/' + putArticleData()._id);

 }));

 */