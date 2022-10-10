const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
// const Post = require('../models/Post');
const User = require('../models/User');
// const Comment = require('../models/Comment');
const Team = require('../models/Team');
const postController = {};

// const calculatePostConut = async (userId) => {
//     const postCount = await Post.countDocuments({
//         author: userId,
//         isDeleted: false,
//     });
//     await User.findByIdAndUpdate(userId, {postCount})
// }


// postController.createNewPost= catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     let {content,image} = req.body;

//     let post= await Post.create({
//         content,
//         image,
//         author: currentUserId,
//     })

//     await calculatePostConut(currentUserId);
//     post = await post.populate("author")

//     return sendResponse(res,200,true,post,null,"Create New Post Success")

// });

// postController.getPosts = catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     const userId = req.params.userId;
//     let { page, limit} = {...req.query};
//     let user= await User.findById(userId);
//     if(!user) throw new AppError(400,"User not found","Get Posts Error");

//     page = parseInt(page) || 1;
//     limit = parseInt(limit) || 10;

//     let userFriendIds = await Friend.find({
//         $or:[{ from: userId},{ to: userId}],
//         status:"accepted"
//     })
//     if (userFriendIds.length && userFriendIds) {
//         userFriendIds = userFriendIds.map((friend) =>{
//             if (friend.from._id.equals(userId)) return friend.to;
//             return friend.from;
//         })
//     } else {
//         userFriendIds =[]
//     }
//     userFriendIds = [...userFriendIds, userId];

//     const filterCondition = [{isDeleted: false} ,{ author: {$in: userFriendIds}}];

//     const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

//     const count = await Post.countDocuments(filterCrileria);
//     const totalPages = Math.ceil(count / limit);
//     const offset = limit * (page - 1);

//     let posts = await Post.find(filterCrileria).sort({createdAt: -1 }).skip(offset).limit(limit).populate("author");

//     return sendResponse(res,200,true,{posts,totalPages,count},null,"Get Current User successful");
// });


// postController.getSinglePost = catchAsync( async (req, res, next) => {
//     const currentUserId = req.userId;
//     const postId =req.params.id;

//     let post= await Post.findById(postId);
//     if(!post) throw new AppError(400,"Post not found","Get Single Post Error");

//     post = post.toJSON();
//     post.comments = await Comment.find({post: post._id}).populate("author")

//     return sendResponse(res,200,true,post,null,"Get Single Post successful");
// });

// postController.getCommentsOfPost = catchAsync(async (req, res, next) => {
//     const postId = req.params.userId;
//     page = parseInt(req.query.page) || 1;
//     limit = parseInt(req.query.limit) || 10;

//     const post= await Post.findById(postId);
//     if(!post) throw new AppError(400,"Post not found","Get Comments Error");


//     const count = await Comment.countDocuments({post: postId});
//     const totalPages = Math.ceil(count / limit);
//     const offset = limit * (page - 1);

//     const comments = await Comment.find({post: postId}).sort({createdAt: -1 }).skip(offset).limit(limit).populate("author");

//     return sendResponse(res,200,true,{comments,totalPages,count},null,"Get Comments successful");
// });

// postController.updateSinglePost = catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     const postId =req.params.id;


//     let post= await Post.findById(postId);
//     if(!post) throw new AppError(400,"Post not found","Update Post Error");
//     if(!post.author.equals(currentUserId)) 
//         throw new AppError(400,"Only author can edit post" , "Update Post Error");

//     const allows = [
//     "content",
//     "image",]

//     allows.forEach((field) =>{
//         if(req.body[field] !== undefined){
//             post[field] = req.body[field];
//         }
//     })
//     await post.save();

//     return sendResponse(res,200,true,post,null,"update Post successful");
// });

// postController.deleteinglePost = catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     const postId =req.params.id;

//     const post = await Post.findOneAndUpdate(
//         {_id: postId, author: currentUserId},
//         {isDeleted: true},
//         {new: true}
//     )
//     if(!post) throw new AppError(400,"post not found or User not authorized","Delete Post Error ")
//     await calculatePostConut(currentUserId);

//     return sendResponse(res,200,true,post,null,"update Post successful");
// });



module.exports = postController;
