const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User.js');
const Team = require('../models/Team.js');
const moment = require('moment/moment.js');
const taskController = {};

const calculateTaskConut = async (projectId) => {
    const taskCount = await Task.countDocuments({
        project: projectId,
        isDeleted: false,
    });
    await Project.findByIdAndUpdate(projectId, {taskCount})
}

taskController.createNewTask= catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    let {name,assignee,dueAt,projectId,important,urgent} = req.body;
    console.log(name,assignee,dueAt,projectId)
    let project= await Project.findById(projectId);
    if(!project) throw new AppError(400,"Project not found", "Create New task error");

    let task= await Task.create({
        project: projectId,
        assigner:currentUserId,
        assignee,
        important,
        urgent,
        name,dueAt
    })
    await Project.findByIdAndUpdate(
        {_id: projectId},
        {$push:{task:task._id}}
    );

    task = await task.populate("assigner")

    return sendResponse(res,200,true,{task},null,"Create New task Success")

});

taskController.getTasks = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    let { page, limit,...filter } = {...req.query};

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const user = await User.findById(currentUserId)

    console.log(user.team.toString());

    const filterCondition = [{isDeleted: false},{team:user.team.toString()}];
     if(filter.name) {
        filterCondition.push({name: {$regex: filter.name, $options: "i"},})
     }
    
    const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

    const count = await Task.countDocuments(filterCrileria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    let tasks = await Task.find(filterCrileria).sort({createdAt: -1 }).skip(offset).limit(limit).populate("assignee").populate("project");

    return sendResponse(res,200,true,{tasks,totalPages,count},null,"Get Task Lisk");
    
})


taskController.getTasksMine = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;

    const filterCondition = [{isDeleted: false},{assignee:currentUserId,status:{$ne:"archive"}}];
  
    const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

    let tasks = await Task.find(filterCrileria).populate("assignee").populate("project");

    return sendResponse(res,200,true,{tasks},null,"Get Task Mine");
})

taskController.getTaskInProject = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const projectId =req.params.id;

    const filterCondition = [{isDeleted: false},{project:projectId}];
  
    const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

    let tasks = await Task.find(filterCrileria).populate("assignee").populate("project");

    return sendResponse(res,200,true,{tasks},null,"Get Task In project");
})


taskController.getSingleTask = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const taskId =req.params.id;

    let task= await Task.findById(taskId);
    if(!task) throw new AppError(400,"task not found","Get single task Error");

    return sendResponse(res,200,true,task,null,"Get Task successful");
});

taskController.putTasksForUsers = catchAsync(async (req, res, next) => {
    const taskId = req.params.id;
    const {userId} = req.body;

    const user = await User.findById(userId);
    if(!user) throw new AppError(400,"User not found","assign tasks to user Error ");

    let task = await Task.findByIdAndUpdate(
        {_id: taskId},
        {assignee:userId},
        {new: true}
    );
    task = await task.populate("assignee")
    task = await task.populate("assigner");
    return sendResponse(res,200,true,task,null,"assign tasks to user");
})



taskController.deleteUserFromTask = catchAsync(async (req, res, next) => {
    const taskId = req.params.id;
    const {userId} = req.body;

    const user = await User.findById(userId);
    if(!user) throw new AppError(400,"User not found","assign tasks to user Error ");

    let task = await Task.findByIdAndUpdate(
        {_id: taskId},
        {$pull:{assignee:userId}}
    );
    // task = await task.save();
    return sendResponse(res,200,true,task,null,"assign tasks to user");
})



taskController.updateSingleTask = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const taskId =req.params.id;

    let task= await Task.findById(taskId);
    if(!task) throw new AppError(400,"User not found","Update User Error");

    const date = moment(new Date()).format('YYYY-MM-DD');
    const allows = [
        "name",
        "dueAt",
        "urgent",
        "important",
        "assignee",
        "status",
        "progress",
        ] 
        allows.forEach((field) =>{
            if(req.body[field] !== undefined){
                task[field] = req.body[field];
                if(req.body[field] === "review"){
                    task["reviewAt"].push(date);
                }
                if(req.body[field] === "done"){
                    task["doneAt"]=date;
                }
            }
        })
        await task.save();

    return sendResponse(res,200,true,task,null,"update Task successful");
});

taskController.deleteingleTask = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const taskId =req.params.id;

    const task = await Task.findOneAndUpdate(
        {_id: taskId, assigner: currentUserId},
        {isDeleted: true},
        {new: true}
    );
    if(!task) throw new AppError(400,"task not found or User not authorized","Delete task Error ")
    await calculateTaskConut(task.project);

    return sendResponse(res,200,true,task,null,"Delete Task successful");
});

taskController.reviewTask = catchAsync(async (req, res, next) => {
    const taskId =req.params.id;
    const {review} = req.body;

    const task = await Task.findOneAndUpdate(
        {_id: taskId},
        {
            $push:{review:review},
        },
        {new: true}
    );
    if(!task) throw new AppError(400,"task not found or User not authorized","Review task Error ")

    return sendResponse(res,200,true,task,null,"Review Task successful");
});
module.exports = taskController;
