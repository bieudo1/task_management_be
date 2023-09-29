const express = require("express");
const router = express.Router();

// authApi
const authAPI = require("./auth.api");
router.use("/auth", authAPI);

// adminApi
const userAPI = require("./admin.api");
router.use("/admin", adminAPI);

// postApi
const postAPI = require("./post.api");
router.use("/posts", postAPI);

// productApi
const productAPI = require("./product.api");
router.use("/products", productAPI);

module.exports = router;
