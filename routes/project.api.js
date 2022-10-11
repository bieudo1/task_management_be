const projectController = require("../controllers/project.controller");
const authentication = require("../middlewares/authentication");
const express = require('express');
const {body,param} = require("express-validator");
const validators = require('../middlewares/validators');
const router = express.Router();


router.get('/user/:userId',validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId )
]),projectController.getProjects);


router.post('/',authentication.loginRequired,
    validators.validate([
        body("name","Missing name").exists().notEmpty(),
        body("description","Missing description").exists().notEmpty(),
    ]),
    projectController.createNewProject
    );


router.get('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),projectController.getSingleProject);

router.put('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),projectController.updateSingleProject);

router.delete('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),projectController.deleteinglepPoject);

router.get('/:id/task', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),projectController.getTaskOfProject);


module.exports= router