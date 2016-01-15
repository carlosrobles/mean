'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Comment = mongoose.model('Comment'),
    User = mongoose.model('User');


/**
 * Find Comment by id
 */
exports.comment = function (req, res, next, id) {
    Comment.load(id, function (err, comment) {
        if (err) return next(err);
        if (!comment) return next(new Error('Failed to load Comment ' + id));
        req.comment = comment;
        next();
    });
};


/**
 * Create a Comment
 */
exports.create = function (req, res) {
    var comment = new Comment(req.body);
    //comment.user = req.user;

    comment.save(function (err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot save the comment'
            });
        }
        comment.populate('user', function (err) {
            res.json(comment);
        });

    });
};

/**
 * Update a comment
 */
exports.update = function (req, res) {
    var comment = req.comment;

    comment = _.extend(comment, req.body);

    comment.save(function (err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the comment'
            });
        }
        /*
         Articles.events.publish({
         action: 'updated',
         user: {
         name: req.user.name
         },
         name: article.title,
         url: config.hostname + '/articles/' + article._id
         });
         */
        res.json(comment);
    });
};

/**
 * Delete an Comment
 */
exports.destroy = function (req, res) {
    var comment = req.comment;

    comment.remove(function (err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot delete the comment'
            });
        } else {

            /*  Articles.events.publish({
             action: 'deleted',
             user: {
             name: req.user.name
             },
             name: article.title
             });*/
            res.json(comment);
        }
    });
};


/**
 * Show a comment
 */
exports.show = function (req, res) {
    res.json(req.comment);
};


exports.fetchPublicByArticle = function (req, res) {
    return exports.fetchByArticle(req, res, "public");
}
/**
 * Fetching comments for a post
 */
exports.fetchByArticle = function (req, res, status) {

    var articleId = req.params.articleId;
    var limit = req.query.limit;

    var queryParams = {};

    if (typeof status == 'string') {

        if (!!articleId)
            queryParams = {
                article: articleId,
                status: status
            };
        else  queryParams = {
            status: status
        };
    } else if (!!articleId) {

        queryParams = {
            article: articleId
        };
    }
    var query = Comment.find(queryParams).sort({
        _id: -1
    })
        .populate('user', 'name username');

    if (limit) {
        query.limit(limit);
    }
    query.exec(function (err, comments) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the comments'
            });
        } else {
            res.json(comments);
        }
    });
};
