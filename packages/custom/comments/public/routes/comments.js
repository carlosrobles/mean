'use strict';

angular.module('mean.comments').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.state('manage comments', {
            url: '/comments/manage',
            templateUrl: 'comments/views/manage.html'
        });
    }
]);
