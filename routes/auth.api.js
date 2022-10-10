const express = require('express');
const authController = require('../controllers/auth.controller');
const validators = require('../middlewares/validators');
const {body} = require("express-validator");
const router = express.Router();


/* @route Post /auth/login
    @descripton log in with username and password
    @body {email , password}
    @access public
*/
router.post('/login', 
validators.validate([
    body("email","Invalid email").exists().isEmail().normalizeEmail({ gmail_remove_dots: false }),
    body("password","Invalid password").exists().notEmpty(),
]),
authController.loginWithEmail);

module.exports= router
