const projectController = require("../controllers/project.controller");
const authentication = require("../middlewares/authentication");
const express = require('express');
const {body,param} = require("express-validator");
const validators = require('../middlewares/validators');
const router = express.Router();



// router.post(
//     '/',
//     authentication.loginRequired,
//     validators.validate([
//         body("targetType","Invalid targetType").exists(),isIn("Post","Comment"),
//         body("targetId","Invalid targetId").exists().custom(validators.checkObjectId ),
//         body("emoji","Invalid emoji").exists(),isIn("like","dislike"),
// ]),
// reactionController.saveReaction,
// );

module.exports= router