const fileController = require("../controllers/file.controller");
const authentication = require("../middlewares/authentication");
const express = require('express');
const {body,param} = require("express-validator");
const validators = require('../middlewares/validators');
const router = express.Router();


/* @route Post /projects
    @descripton create new quest
    @body {name,description,due}
    @access login request
*/
router.post(
    '/',
    authentication.loginRequired,
    validators.validate([
        body("targetType","Invalid targetType").exists().isIn("Project","Task"),
        body("targetId","Invalid targetId").exists().custom(validators.checkObjectId ),
        body("link","Invalid link").exists().notEmpty(),
]),
fileController.createNewFile
);


router.delete('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),fileController.deleteingleFile);

module.exports= router