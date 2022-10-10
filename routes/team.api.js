const teamController = require("../controllers/team.controller");
const authentication = require("../middlewares/authentication");
const express = require('express');
const {body,param} = require("express-validator");
const validators = require('../middlewares/validators');
const router = express.Router();


// router.get("/user/:userId",validators.validate([
//     param("userId").exists().isString().custom(validators.checkObjectId )
// ]),postController.getPosts);


// router.post(
//     '/',
//     authentication.loginRequired,
//     validators.validate([body("comment","Missing comment").exists(),notEmpty()]),
//     postController.createNewPost,
//     );


// router.get('/:id', authentication.loginRequired ,validators.validate([
//     param("id").exists().isString().custom(validators.checkObjectId )
// ]),postController.getSinglePost);

// router.put('/:id', authentication.loginRequired ,validators.validate([
//     param("id").exists().isString().custom(validators.checkObjectId )
// ]),postController.updateSinglePost);

// router.delete('/:id', authentication.loginRequired ,validators.validate([
//     param("id").exists().isString().custom(validators.checkObjectId )
// ]),postController.deleteinglePost);

// router.get('/:id/comments', authentication.loginRequired ,validators.validate([
//     param("id").exists().isString().custom(validators.checkObjectId )
// ]),postController.getCommentsOfPost);


module.exports= router