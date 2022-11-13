const express = require('express');
const userController = require('../controllers/user.controller');
const {body,param} = require("express-validator");
const validators = require('../middlewares/validators');
const authentication = require('../middlewares/authentication');
const router = express.Router();

/* @route Post /users
    @descripton Reginster new user
    @body {name,email , password}
    @access public
*/
router.post('/', 
validators.validate([
    body("name","Invalid name").exists().notEmpty(),
    body("email","Invalid email").exists().isEmail().normalizeEmail({ gmail_remove_dots: false }),
    body("password","Invalid password").exists().notEmpty(),
]),
userController.register);

/* @route Get /users/page=1&limit=10
    @descripton get users with paginaton
    @body 
    @access login request
*/
router.get('/',authentication.loginRequired ,userController.getUsers);

/* @route Get /users/me
    @descripton get current user info
    @body 
    @access login request
*/
router.get('/me',authentication.loginRequired , userController.getCurrentUser);

/* @route Get /users/admin
    @descripton get current user info
    @body 
    @access login request
*/
router.get('/admin',authentication.loginRequired , userController.getCurrentUserAdmin);

/* @route Get /users/:id
    @descripton get users profile
    @body
    @access login request
*/
router.get('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),userController.getSingleUsers);


/* @route Put /users/:id
    @descripton Update user profile
    @body {"name",
    "avatarUrl",
    "role",
    "team",
    "imageUrl",
    "phone1",
    "phone2",
    "manager",}
    @access login request
*/
router.put('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),userController.updatePorfile);

router.delete('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),userController.deleteingleUser);
module.exports = router;
