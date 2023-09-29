const postController = require("../controllers/post.controller");
const authentication = require("../middlewares/authentication");
const router = express.Router();
const express = require("express");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");

router.get("/", validators.validate([param("userId").exists().isString().custom(validators.checkObjectId)]), postController.getPosts);
router.get("/:id", validators.validate([param("id").exists().isString().custom(validators.checkObjectId)]), postController.getSinglePost);

router.post(
  "/",
  authentication.loginRequired,
  validators.validate([body("comment", "Missing comment").exists(), notEmpty()]),
  postController.createNewPost
);

router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([param("id").exists().isString().custom(validators.checkObjectId)]),
  postController.updateSinglePost
);

router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([param("id").exists().isString().custom(validators.checkObjectId)]),
  postController.deleteinglePost
);
