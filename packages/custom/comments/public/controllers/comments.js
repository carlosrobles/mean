'use strict';

angular.module('mean.comments').controller('CommentsController', ['$scope', 'MeanUser', '$stateParams', 'Global',
    'CommentsResource', 'CommentsListResource',
    function ($scope, MeanUser, $stateParams, Global, CommentsResource, CommentsListResource) {

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

                    if (!$scope.comments || $scope.comments.length === 0) {
                        $scope.comments = [];
                    }
                    $scope.comments.push(data);


                    self.content = '';
                })
        };
        
        $scope.find = function (article) {
            CommentsListResource.query({
                articleId: article._id
            }, function (comments) {
                $scope.comments = comments;
            });
        };

        $scope.$watch('article', function () {
          if(!!$scope.article)
            $scope.find( $scope.article);
        }, false);


    }
]);
