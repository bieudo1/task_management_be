const taskController = require("../controllers/task.controller");
const authentication = require("../middlewares/authentication");
const express = require('express');
const {body,param} = require("express-validator");
const validators = require('../middlewares/validators');
const router = express.Router();

/* @route Post /task
    @descripton create new quest
    @body {name,description,due}
    @access login request
*/
router.post('/',
    authentication.loginRequired,
    validators.validate([
        body("name","Missing name").exists().notEmpty(),
        body("description","Missing description").exists().notEmpty(),
        body("projectId","Missing projectId").exists().isString().custom(validators.checkObjectId )
    ]),
    taskController.createNewTask
);

/* @route Put /task/:id
    @descripton update a task
    @body 
    @access login request
*/
router.put('/:id', authentication.loginRequired ,validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId ),
        body("name","Missing name").exists().notEmpty(),
    ]),
    taskController.updateSingleTask
);

/* @route Delete /task/:id
    @descripton delete a task
    @body 
    @access login request
*/
router.delete('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),taskController.deleteingleTask);

/* @route Get /task/:id
    @descripton get task with paginaton
    @body 
    @access login request
*/
router.get('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),taskController.getSingleTask);

/* @route Get /task/page=1&limit=10
    @descripton get tasks with paginaton
    @body 
    @access login request
*/


module.exports= router