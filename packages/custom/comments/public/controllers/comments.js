'use strict';

angular.module('mean.comments').controller('CommentsController', ['$scope', 'MeanUser', '$stateParams', 'Global',
    'CommentsResource', 'CommentsByArticleResource',
    function ($scope, MeanUser, $stateParams, Global, CommentsResource, CommentsByArticleResource) {

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
                    comment.content = "Your comment is pending of moderation by the administrator";
                    $scope.comments.push(data);


                    self.content = '';
                })
        };

        $scope.find = function (article) {

            var params = {};//All articles, all statuses
            var resource;

            if (!!article && !!article._id) { //with article

                resource = CommentsByArticleResource;

                    //Admin or any user.
                    //Even if its admin, in post page only show public (as per requirements)
                    params = {
                        articleId: article._id,
                        status: "public"
                    };

            } else { //no article specified

                resource = CommentsResource;

                if (MeanUser.isAdmin) { //Admin, all articles
                        params = {};
                }
                else {//any user all articles. This wont happen
                    params = {
                        status: "public"
                    };
                 }
            }
            resource.query(params, function (comments) {
                $scope.comments = comments;
            });
        };

        $scope.$watch('article', function () {
            if (!!$scope.article)
                $scope.find($scope.article);
        }, false);


    }
]);
