'use strict';

angular.module('mean.comments').controller('CommentsController', ['$scope', 'MeanUser', '$stateParams', 'Global', 'CommentsResource',
    function ($scope, MeanUser, $stateParams, Global, CommentsResource) {

        $scope.create = function (content, article) {

            var comment = new CommentsResource({
                content: content,
                article: article._id,
                user: ((MeanUser.user) ? MeanUser.user._id : null)
            });

            var self = this;

            comment.$save()
                .then(
                function (data) {

                    if (!$scope.article.comments || $scope.article.comments.length === 0) {
                        $scope.article.comments = [];
                    }
                    $scope.article.comments.push(data);


                    self.content = '';
                })
        };


    }
]);
