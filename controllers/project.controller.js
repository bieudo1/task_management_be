const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const User = require('../models/User');
const Task = require('../models/Task');
const Project = require('../models/Project');
const projectController = {};

// const calculateProjectConut = async (userId) => {
//     const postCount = await Post.countDocuments({
//         author: userId,
//         isDeleted: false,
//     });
//     await User.findByIdAndUpdate(userId, {postCount})
// }

//Create New Project
projectController.createNewProject= catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    let {name,description} = req.body;
    console.log(currentUserId)
    let project= await Project.create({
        name,
        description,
        assigner: currentUserId,
    })

    // await calculateProjectConut(currentUserId);
    project = await project.populate("assigner");

    return sendResponse(res,200,true,project,null,"Create New Project Success")

});

projectController.getProjects = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const userId = req.params.userId;
    let { page, limit,...filter } = {...req.query};
    let user= await User.findById(userId);
    if(!user) throw new AppError(400,"User not found","Get Posts Error");

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;


    const filterCondition = [{isDeleted: false} ,{ assigner: userId}];
     if(filter.name) {
         filterCondition.push({name: {$regex: filter.name, $options: "i"},})
     }

    const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

    const count = await Project.countDocuments(filterCrileria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    let projects = await Project.find(filterCrileria).sort({createdAt: -1 }).skip(offset).limit(limit).populate("assigner");

    return sendResponse(res,200,true,{projects,totalPages,count},null,"Get Current User successful");
});


projectController.getSingleProject = catchAsync( async (req, res, next) => {
    const currentUserId = req.userId;
    const projectId =req.params.id;

    let project= await Project.findById(projectId);
    if(!project) throw new AppError(400,"Project not found","Get Single Project Error");

    // project = project.toJSON();
    // project.comments = await Comment.find({project: project._id}).populate("assigner")

    return sendResponse(res,200,true,project,null,"Get Single Project successful");
});

projectController.getTaskOfProject = catchAsync(async (req, res, next) => {
    const projectId = req.params.id;
    console.log(projectId)
    page = parseInt(req.query.page) || 1;
    limit = parseInt(req.query.limit) || 10;

    const project= await Project.findById(projectId);
    if(!project) throw new AppError(400,"Project not found","Get Comments Error");


    const count = await Task.countDocuments({project: projectId});
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const tasks = await Task.find({project: projectId}).sort({createdAt: -1 }).skip(offset).limit(limit).populate("assigner");

    return sendResponse(res,200,true,{tasks,totalPages,count},null,"Get tasks successful");
});

projectController.updateSingleProject = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const projectId =req.params.id;


    let project= await Project.findById(projectId);
    if(!project) throw new AppError(400,"Project not found","Update Project Error");
    if(!project.assigner.equals(currentUserId)) 
        throw new AppError(400,"Only assigner can edit project" , "Update Project Error");

    const allows = [
    "name",
    "description",]

    allows.forEach((field) =>{
        if(req.body[field] !== undefined){
            project[field] = req.body[field];
        }
    })
    await project.save();

    return sendResponse(res,200,true,project,null,"update Project successful");
});

projectController.deleteinglepPoject = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const projectId =req.params.id;

    const project = await Project.findOneAndUpdate(
        {_id: projectId, assigner: currentUserId},
        {isDeleted: true},
        {new: true}
    )
    if(!project) throw new AppError(400,"project not found or User not authorized","Delete Project Error ")
    // await calculateProjectConut(currentUserId);

    return sendResponse(res,200,true,project,null,"update Project successful");
});



module.exports = projectController;
