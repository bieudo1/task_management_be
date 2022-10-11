const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const File = require('../models/File');
// const Comment = require('../models/Comment');
// const Reaction = require('../models/Reaction');
const fileController = {};

fileController.createNewFile = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const {name,targetType,targetId,link} = req.body

    const targetObject= await mongoose.model(targetType).findById(targetId);
    if(!targetObject) throw new AppError(400,`${targetType} not found`, "Create Reaction error");

    const file = await File.create({name,targetId, targetType, author:currentUserId,link,});

    return sendResponse(res,200,true,file,null,"Save file Successful")

});


fileController.deleteingleFile = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const fileId =req.params.id;

    const file = await File.findOneAndDelete(
        {_id: fileId, assigner: currentUserId},
        {new: true}
    );
    if(!file) throw new AppError(400,"file not found or User not authorized","Delete file Error ")
    await calculatefileConut(file.project);

    return sendResponse(res,200,true,file,null,"Delete Post successful");
});


module.exports = fileController;
