'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Post Schema
 */
var CommentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    trim: true,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    index: true
  },
  userName: {
    type: String
  },
  article: {
        type: Schema.ObjectId,
        ref: 'Article',
        index: true
    }
});

/**
 * Validations
 */
CommentSchema.path('content').validate(function(content) {
  return !!content;
}, 'Comment cannot be blank');

/**
 * Statics
 */
CommentSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};
mongoose.model('Comment', CommentSchema);
