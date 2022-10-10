const taskController = require("../controllers/task.controller");
const authentication = require("../middlewares/authentication");
const express = require('express');
const {body,param} = require("express-validator");
const validators = require('../middlewares/validators');
const router = express.Router();


// router.post('/',
//     authentication.loginRequired,
//     validators.validate([
//         body("comment","Missing comment").exists().notEmpty(),
//         body("postId","Missing postId").exists().isString().custom(validators.checkObjectId )
//     ]),
//     commentController.createNewComment
// );

// router.put('/:id', authentication.loginRequired ,validators.validate([
//         param("id").exists().isString().custom(validators.checkObjectId ),
//         body("comment","Missing comment").exists().notEmpty(),
//     ]),
//     commentController.updateSingleComment
// );

// router.delete('/:id', authentication.loginRequired ,validators.validate([
//     param("id").exists().isString().custom(validators.checkObjectId )
// ]),commentController.deleteingleComment);

// router.get('/:id', authentication.loginRequired ,validators.validate([
//     param("id").exists().isString().custom(validators.checkObjectId )
// ]),commentController.getSingleComment);


module.exports= router