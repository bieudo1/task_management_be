const newsController = require("../controllers/news.controller");
const express = require("express");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const router = express.Router();

/* @route Post /files
    @descripton create new quest
    @body {content,title,projectId,taskId}
    @access login request
*/
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([validators.validate([body("comment", "Missing comment").exists(), notEmpty()])]),
  newsController.createNews
);

router.get("/", newsController.getNews);

router.get("/:id", validators.validate([param("id").exists().isString().custom(validators.checkObjectId)]), newsController.getSingNews);

router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([param("id").exists().isString().custom(validators.checkObjectId)]),
  newsController.updateSingleNews
);

router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([param("id").exists().isString().custom(validators.checkObjectId)]),
  newsController.deleteingleNews
);

module.exports = router;
