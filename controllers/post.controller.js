const mongoose = require("mongoose");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");
const Post = require("../models/Post");
const postController = {};

postController.createNewPost = catchAsync(async (req, res, next) => {
  let { content, image, language } = req.body;
  let post = await Post.create({
    content,
    image,
    language,
  });
  post = await post.populate("classify");
  return sendResponse(res, 200, true, post, null, "Create New Post Success");
});

postController.getPosts = catchAsync(async (req, res, next) => {
  let { page, limit, language, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterCondition = [{ isDeleted: false }, { language: { $ne: language } }];
  if (filter.classify) {
    filterCondition.push({ classify: { $in: filter.classify } });
  }
  const filterCrileria = filterCondition.length ? { $and: filterCondition } : {};

  const count = await Post.countDocuments(filterCrileria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let posts = await Post.find(filterCrileria).sort({ createdAt: -1 }).skip(offset).limit(limit).populate("classify");

  return sendResponse(res, 200, true, { posts, totalPages, count }, null, "Get Current User successful");
});

postController.getSinglePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  let post = await Post.findById(postId).populate("classify");
  if (!post) throw new AppError(400, "Post not found", "Get Single Post Error");

  post = post.toJSON();
  return sendResponse(res, 200, true, post, null, "Get Single Post successful");
});

postController.updateSinglePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  let post = await Post.findById(postId);
  if (!post) throw new AppError(400, "Post not found", "Update Post Error");

  const allows = ["content", "image"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field];
    }
  });
  await post.save();

  return sendResponse(res, 200, true, post, null, "update Post successful");
});

postController.deleteinglePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findOneAndUpdate({ _id: postId }, { isDeleted: true }, { new: true });
  if (!post) throw new AppError(400, "post not found or User not authorized", "Delete Post Error ");
  return sendResponse(res, 200, true, post, null, "update Post successful");
});

module.exports = postController;
