const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Project = require('../models/Project');
const userController = {};

// thêm managerId và phone
userController.register = catchAsync( async (req, res, next) => {
    let {name,email,password,role,imageUrl } = req.body;
    let user = await User.findOne({ email });
    if (user) throw new AppError(400,"User already","Registration Error");
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);
        user= await User.create({name,email,password,role,imageUrl})
        const accessToken = await user.generateToken();
        sendResponse(res,200,true,{user,accessToken},null,"Create User  Success")
});

userController.getUsers = catchAsync(async (req, res, next) => {

    let { page, limit,...filter } = {...req.query};

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filterCondition = [{isDeleted: false}];

    if(filter.name) {
        filterCondition.push({name: {$regex: filter.name, $options: "i"},})
    }

    const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

    const count = await User.countDocuments(filterCrileria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    let users = await User.find(filterCrileria).sort({createdAt: -1 }).skip(offset).limit(limit);

    return sendResponse(res,200,true,{users,totalPages,count},null,"Get Current User successful");
});

userController.getCurrentUser = catchAsync( async (req, res, next) => {
    const currentUserId = req.userId;
    const user= await User.findById(currentUserId);
    if(!user) throw new AppError(400,"User not found","Get Current User Error");
    return sendResponse(res,200,true,user,null,"Get Current User successful");
});

userController.getSingleUsers = catchAsync( async (req, res, next) => {
    const currentUserId = req.userId;
    const userId =req.params.id;

    let user= await User.findById(userId);
    if(!user) throw new AppError(400,"User not found","Get Single User Error");
    let project = await Project.find({assignee:userId,status:{$ne:"archive"}})

    return sendResponse(res,200,true,{user,project:project},null,"Get Single User successful");
});

userController.updatePorfile = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const userId =req.params.id;

    if(currentUserId === userId) throw new AppError(400,"Permission required","Update User Error");

    let user= await User.findById(userId);
    if(!user) throw new AppError(400,"User not found","Update User Error");

    const allows = [
    "name",
    "avatarUrl",
    "role",
    "team",
    "imageUrl",
    "phone1",
    "phone2",
    "manager",
    ]

    allows.forEach((field) =>{
        if(req.body[field] !== undefined){
            user[field] = req.body[field];
        }
    })
    await user.save();

    return sendResponse(res,200,true,user,null,"update User successful");
});



module.exports = userController;
