const mongoose = require("mongoose");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");
const Product = require("../models/Product");
const productController = {};

productController.createNewProduct = catchAsync(async (req, res, next) => {
  let { productname, describe, price, size, classify, image, language } = req.body;
  let product = await Product.create({
    productname,
    describe,
    price,
    size,
    classify,
    image,
    language,
  });
  product = await Product.populate("classify");
  return sendResponse(res, 200, true, product, null, "Create New Product Success");
});

productController.getProducts = catchAsync(async (req, res, next) => {
  let { page, limit, language, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterCondition = [{ isDeleted: false }, { language: { $ne: language } }];
  if (filter.classify) {
    filterCondition.push({ classify: { $in: filter.classify } });
  }
  const filterCrileria = filterCondition.length ? { $and: filterCondition } : {};

  const count = await Product.countDocuments(filterCrileria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let products = await Product.find(filterCrileria).sort({ createdAt: -1 }).skip(offset).limit(limit).populate("classify");

  return sendResponse(res, 200, true, { products, totalPages, count }, null, "Get Current User successful");
});

productController.getSingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  let product = await Product.findById(productId).populate("classify");
  if (!product) throw new AppError(400, "Product not found", "Get Single Product Error");

  product = Product.toJSON();
  return sendResponse(res, 200, true, product, null, "Get Single Product successful");
});

productController.updateSingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  let product = await Product.findById(productId);
  if (!product) throw new AppError(400, "Product not found", "Update Product Error");

  const allows = ["productname", "describe", "price", "size", "classify", "image"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });
  await product.save();

  return sendResponse(res, 200, true, product, null, "update Product successful");
});

productController.deleteingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findOneAndUpdate({ _id: productId }, { isDeleted: true }, { new: true });
  if (!product) throw new AppError(400, "Product not found or User not authorized", "Delete Product Error ");
  return sendResponse(res, 200, true, product, null, "update Product successful");
});

module.exports = productController;
