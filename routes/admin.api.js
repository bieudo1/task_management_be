const express = require("express");
const adminController = require("../controllers/admin.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
const router = express.Router();

// READ
router.get("/admin", authentication.loginRequired, adminController.getCurrentAdmin);

// UPDATE
router.put(
  "/admin",
  authentication.loginRequired,
  validators.validate([param("id").exists().isString().custom(validators.checkObjectId)]),
  adminController.updatePorfile
);

router.put(
  "/admin/:id/password",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("newPassword ", "Invalid new password").exists(),
    body("currentPassword", "Invalid current password").exists(),
  ]),
  adminController.changePassword
);
module.exports = router;
