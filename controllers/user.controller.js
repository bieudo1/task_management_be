const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Team = require('../models/Team');
const Task = require('../models/Task');
const userController = {};

function pad(n) {
    return n.toString().length == 1 ? '0' + n : n;
  }
  
  function getCount(arr) {
    var obj = {};
    for (var i = 0, l = arr.length; i < l; i++) {
      var thisDate = arr[i].doneAt;
      var day = pad(thisDate.getDate());
      var month = pad(thisDate.getMonth() + 1);
      var year = thisDate.getFullYear();
      var key = [year, day, month].join('-');
      obj[key] = obj[key] || 0;
      obj[key]++;
    }
    return obj;
  }

// thêm managerId và phone
userController.register = catchAsync( async (req, res, next) => {
    let {name,email,password,position,phone1,phone2,teamId } = req.body;
    let user = await User.findOne({ email });
    if (user) throw new AppError(400,"User already","Registration Error");
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password,salt);
    user= await User.create({name,email,password,position,teamId,phone1,phone2})
    user = await User.findById(user._id).populate("team")
    let team = await Team.findByIdAndUpdate(
        {_id: teamId},
        {$push:{workers:user._id}},
        {new: true}
    );

    sendResponse(res,200,true,{user,team},null,"Create User  Success")
});

userController.getUsers = catchAsync(async (req, res, next) => {

    let { page, limit,...filter } = {...req.query};

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filterCondition = [{isDeleted: false,position:{$ne:"Ceo"}}];

    if(filter.name) {
        filterCondition.push({name: {$regex: filter.name, $options: "i"},})
    }

    const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

    const count = await User.countDocuments(filterCrileria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    let users = await User.find(filterCrileria).sort({createdAt: -1 }).skip(offset).limit(limit).populate("team");
    // let teams = await Team.find().populate("manager").populate("workers");

    return sendResponse(res,200,true,{users,totalPages,count},null,"Get Current User successful");
});

userController.getCurrentUser = catchAsync( async (req, res, next) => {
    const currentUserId = req.userId;
    const user= await User.findById(currentUserId).populate("team");
    if(!user) throw new AppError(400,"User not found","Get Current User Error");
    return sendResponse(res,200,true,{user},null,"Get Current User successful");
});

userController.getCurrentUserAdmin = catchAsync( async (req, res, next) => {
    const {watchDate} = req.query
    const date = new Date()
    const date1 = new Date()
    date.getDate()
    date1.setDate(date.getDate() - watchDate);
    const status = await Task.find({
        $and:[
            {doneAt:{$lte:date}},{doneAt:{$gte:date1}}
        ]
    })

    const outOfDate = status.filter((statu) => statu.doneAt.getTime() > statu.dueAt.getTime())
    const countOutOfDate = getCount(outOfDate)
    const onTime = status.filter((statu) => statu.doneAt.getTime() <= statu.dueAt.getTime())
    const countOnTime= getCount(onTime)
    
    const projectCount = await Project.countDocuments({
        isDeleted: false
    });
    const teamCount = await Team.countDocuments({
        isDeleted: false,
    });
    const userCount = await User.countDocuments({
        isDeleted: false,
        position: {$ne: 'Ceo'}
    });
    const countTaskStatusArchive = await Task.countDocuments({
        isDeleted: false,status:{$eq:"archive"}
    });
    const countTaskStatusWorking  = await Task.countDocuments({
        isDeleted: false,status:{$eq:"working"}
    });
    const countTaskStatusReview  = await Task.countDocuments({
        isDeleted: false,status:{$eq:"review"}
    });
    const countTaskStatusDone  = await Task.countDocuments({
        isDeleted: false,status:{$eq:"done"}
    });
    const countTaskStatusRework  = await Task.countDocuments({
        isDeleted: false,status:{$eq:"rework"}
    });
    const totalTask = countTaskStatusArchive + countTaskStatusWorking + countTaskStatusReview + countTaskStatusDone + countTaskStatusDone
    const taskCount = {
        countTaskStatusArchive,countTaskStatusWorking,
        countTaskStatusReview,countTaskStatusDone,
        countTaskStatusRework,totalTask
    }
    return sendResponse(res,200,true,{userCount,teamCount,projectCount,taskCount,countOutOfDate,countOnTime},null,"Get Current User successful");
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
    console.log(userId)
    console.log(currentUserId)
    if(currentUserId !== userId) throw new AppError(400,"Permission required","Update User Error");

    let user= await User.findById(userId);
    if(!user) throw new AppError(400,"User not found","Update User Error");

    const allows = [
    "name",
    "avatarUrl",
    "email",
    "phone1",
    "phone2",
    ]
    allows.forEach((field) =>{
        if(req.body[field] !== undefined){
            user[field] = req.body[field];
        }
    })
    await user.save();

    return sendResponse(res,200,true,user,null,"update User successful");
});

userController.deleteingleUser = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const userId =req.params.id;

    const user = await User.findOneAndUpdate(
        {_id: userId},
        {isDeleted: true},
        {new: true}
    )
    if(!user) throw new AppError(400,"user not found or User not authorized","Delete user Error ")

    return sendResponse(res,200,true,user,null,"update user successful");
});



module.exports = userController;
