const mongoose = require("mongoose");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");
const News = require("../models/News");

newsController.createNews = catchAsync(async (req, res, next) => {
  let { content, title, language } = req.body;

  let news = await News.create({
    title,
    content,
    language,
  });
  news = await News.populate("classify");

  return sendResponse(res, 200, true, news, null, "Create News Success");
});

newsController.getNews = catchAsync(async (req, res, next) => {
  let { page, limit, language, ...filter } = { ...req.query };

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const filterCondition = [{ isDeleted: false }, { language: { $ne: language } }];
  if (filter.name) {
    filterCondition.push({ name: { $regex: filter.name, $options: "i" } });
  }
  if (filter.classify) {
    filterCondition.push({ classify: { $regex: filter.classify, $options: "i" } });
  }
  const filterCrileria = filterCondition.length ? { $and: filterCondition } : {};

  const count = await News.countDocuments(filterCrileria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let news = await News.find(filterCrileria).sort({ createdAt: -1 }).skip(offset).limit(limit);

  return sendResponse(res, 200, true, { news, totalPages, count }, null, "Get Current News successful");
});

newsController.getSingNews = catchAsync(async (req, res, next) => {
  const newsId = req.params.id;
  let news = await News.findById(newsId).populate("classify");
  if (!news) throw new AppError(400, "News not found", "Get Single News Error");

  news = news.toJSON();
  return sendResponse(res, 200, true, news, null, "Get Single News successful");
});

newsController.getCommentsOfNews = catchAsync(async (req, res, next) => {
  const newsId = req.params.userId;
  page = parseInt(req.query.page) || 1;
  limit = parseInt(req.query.limit) || 10;

  const news = await News.findById(newsId);
  if (!news) throw new AppError(400, "News not found", "Get Comments Error");

  const count = await Comment.countDocuments({ news: newsId });
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const comments = await Comment.find({ news: newsId }).sort({ createdAt: -1 }).skip(offset).limit(limit).populate("classify");

  return sendResponse(res, 200, true, { comments, totalPages, count }, null, "Get Comments successful");
});

newsController.updateSingleNews = catchAsync(async (req, res, next) => {
  const newsId = req.params.id;
  let news = await News.findById(newsId);
  if (!news) throw new AppError(400, "News not found", "Update News Error");

  const allows = ["content", "title"];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      news[field] = req.body[field];
    }
  });
  await news.save();

  return sendResponse(res, 200, true, news, null, "update News successful");
});

newsController.deleteingleNews = catchAsync(async (req, res, next) => {
  const newsId = req.params.id;

  const news = await News.findOneAndUpdate({ _id: newsId }, { isDeleted: true }, { new: true });
  if (!news) throw new AppError(400, "News not found or User not authorized", "Delete News Error ");
  await calculateNewsConut(currentUserId);

  return sendResponse(res, 200, true, news, null, "update News successful");
});
module.exports = newsController;
