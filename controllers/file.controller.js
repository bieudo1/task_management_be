const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const File = require('../models/File');
const Project = require('../models/Project');
const Task = require('../models/Task');
const fileController = {};

fileController.createNewFile = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const {projectId,taskId,FileUrl} = req.body

    const project= await Project.findById({_id: projectId});
    if(!project) throw new AppError(400,`${targetType} not found`, "Create Reaction error");

    const file = await File.create({projectId,taskId, author:currentUserId,FileUrl});

    await Project.findByIdAndUpdate(
        {_id: projectId},
        {$push:{file:file._id}},
        )
    const task = await Task.findByIdAndUpdate(
        {_id: taskId},
        {$push:{file:file._id}},
        )

    return sendResponse(res,200,true,{file,task},null,"Save file Successful")

});

fileController.getfiles = catchAsync(async (req, res, next) => {
    const projectId = req.params.id

    let { page, limit,...filter } = {...req.query};

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;


    const filterCondition = [{isDeleted: false},{projectId:projectId}];

    if(filter.name) {
        filterCondition.push({name: {$regex: filter.name, $options: "i"},})
    }

    const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};
    console.log(filterCrileria)

    const count = await File.countDocuments(filterCrileria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    let files = await File.find(filterCrileria).sort({createdAt: -1 }).skip(offset).limit(limit).populate("author");

    return sendResponse(res,200,true,{files,totalPages,count},null,"Get Current file successful");
});


fileController.deleteingleFile = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const fileId =req.params.id;

    const file = await File.findOneAndDelete(
        {_id: fileId, assigner: currentUserId},
        {new: true}
    );
    if(!file) throw new AppError(400,"file not found or User not authorized","Delete file Error ")
    
    const targetObject= await mongoose.model(targetType).findByIdAndUpdate(    
        {_id: targetId},
        {$pull:{file:fileId}},
        {new: true});
    if(!targetObject) throw new AppError(400,`${targetType} not found`, "Create Reaction error");
   
    await calculatefileConut(file.project);

    return sendResponse(res,200,true,file,null,"Delete Post successful");
});


module.exports = fileController;
