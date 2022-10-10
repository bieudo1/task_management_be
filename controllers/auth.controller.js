const { sendResponse, AppError, catchAsync}=require("../helpers/utils.js");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authController = {};


authController.loginWithEmail = catchAsync( async (req, res, next) => {
    let {email,password } = req.body;
    let user = await User.findOne({ email }, "+password");
    if (!user) throw new AppError(400,"Invalid Credentials","login Error");
        const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) throw new AppError(400,"Wrong Password","login Error");
        const accessToken = await user.generateToken();
        sendResponse(res,200,true,{user,accessToken},null,"Login Successful")
});
module.exports = authController;
