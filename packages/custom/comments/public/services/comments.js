'use strict';

//Comments service used for articles REST endpoint
angular.module('mean.comments').factory('CommentsResource', ['$resource',
    function($resource) {
        return $resource('api/comments/:commentId', {
            commentId: '@_id'
        }, {
            update: {
                method: 'PUT' //I wont implement update, just save for now.
            }
        });
    }
]).factory('CommentsListResource', ['$resource',
    function($resource, status) {
        return $resource('api/comments/article/:articleId/:status', {
            articleId: '@_id', status: status
        },   {
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }
]);