const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const Project = require('../models/Project');
// const Comment = require('../models/Comment');
const commentController = {};

// const calculateCommentConut = async (postId) => {
//     const commentCount = await Comment.countDocuments({
//         post: postId,
//         isDeleted: false,
//     });
//     await Post.findByIdAndUpdate(postId, {commentCount})
// }

// commentController.createNewComment= catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     let {content,postId} = req.body;

//     const post= await Post.findById(postId);
//     if(!post) throw new AppError(400,"Post not found", "Create New comment error");

//     let comment= await Comment.create({
//         post: postId,
//         author:currentUserId,
//         content
//     })

//     await calculateCommentConut(postId);
//     comment = await comment.populate("author")

//     return sendResponse(res,200,true,comment,null,"Create New comment Success")

// });

// commentController.getSingleComment = catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     const commentId =req.params.id;

//     let comment= await Comment.findById(commentId);
//     if(!comment) throw new AppError(400,"Comment not found","Get single Comment Error");

//     return sendResponse(res,200,true,comment,null,"Get Post successful");
// });

// commentController.updateSingleComment = catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     const commentId =req.params.id;
//     const {content} = req.body;

//     const comment = await Comment.findByIdAndUpdate(
//         {_id: commentId, author: currentUserId},
//         {content},
//         {next: true}
//     );
//     if(!comment) throw new AppError(400,"Comment not found or User not authorized","Update Comment Error");
//     return sendResponse(res,200,true,comment,null,"update Post successful");
// });

// commentController.deleteingleComment = catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     const commentId =req.params.id;

//     const comment = await Comment.findByIdAndDelete(
//         {_id: commentId, author: currentUserId},
//     );
//     if(!comment) throw new AppError(400,"comment not found or User not authorized","Delete comment Error ")
//     await calculateCommentConut(comment.post);

//     return sendResponse(res,200,true,comment,null,"Delete Post successful");
// });
module.exports = commentController;
