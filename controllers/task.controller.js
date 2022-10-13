const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User.js');
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
    let {name,description,due,projectId} = req.body;

    const project= await Project.findById(projectId);
    if(!project) throw new AppError(400,"Project not found", "Create New task error");

    let task= await Task.create({
        project: projectId,
        assigner:currentUserId,
        name,description,due
    })

    await calculateTaskConut(projectId);
    task = await task.populate("assigner")

    return sendResponse(res,200,true,task,null,"Create New task Success")

});

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
        {assignee:[]}
    );
    // task = await task.save();
    return sendResponse(res,200,true,task,null,"assign tasks to user");
})



taskController.updateSingleTask = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const taskId =req.params.id;
    const {name,description,due} = req.body;

    const task = await Task.findByIdAndUpdate(
        {_id: taskId, assigner: currentUserId},
        {name,description,due},
        {next: true}
    );
    if(!task) throw new AppError(400,"task not found or User not authorized","Update task Error");
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
module.exports = taskController;
