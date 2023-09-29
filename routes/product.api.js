const productController = require("../controllers/product.controller");
const authentication = require("../middlewares/authentication");
const router = express.Router();
const express = require("express");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");

router.get("/", validators.validate([param("userId").exists().isString().custom(validators.checkObjectId)]), productController.getDescribes);
router.get("/:id", validators.validate([param("id").exists().isString().custom(validators.checkObjectId)]), productController.getSingleDescribe);

router.Describe(
  "/",
  authentication.loginRequired,
  validators.validate([body("describe", "Missing describe").exists(), notEmpty()]),
  productController.createNewDescribe
);

router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([param("id").exists().isString().custom(validators.checkObjectId)]),
  productController.updateSingleDescribe
);

router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([param("id").exists().isString().custom(validators.checkObjectId)]),
  productController.deleteingleDescribe
);
