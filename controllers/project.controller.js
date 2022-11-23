const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const User = require('../models/User');
const Task = require('../models/Task');
const Project = require('../models/Project');
const projectController = {};


//Create New Project
projectController.createNewProject= catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    let {name,description,teamId,assignee} = req.body;
    console.log(currentUserId)
    let project= await Project.create({
        name,
        description,
        assigner: currentUserId,
        team: teamId,
        assignee
    })

    // await calculateProjectConut(currentUserId);
    project = await project.populate("assigner");
    project = await project.populate("assignee");
    project = await project.populate("task");


    return sendResponse(res,200,true,{project},null,"Create New Project Success")

});

projectController.getProjects = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    let { page, limit,...filter } = {...req.query};

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    
    const user = await User.findById(currentUserId);


    const filterCondition = [{isDeleted: false},{status:{$ne:"archive"}}];
     if(filter.name) {
        filterCondition.push({name: {$regex: filter.name, $options: "i"}})
     }
     if(user.position !== "Ceo"){
        filterCondition.push({team:user.team})
     }
    
    const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

    const count = await Project.countDocuments(filterCrileria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    let projects = await Project.find(filterCrileria).sort({createdAt: -1 }).skip(offset).limit(limit).populate("assigner").populate("file").populate("task").populate("team").populate("assignee");

    return sendResponse(res,200,true,{projects,totalPages,count},null,"Get Current User successful");
});


projectController.getSingleProject = catchAsync( async (req, res, next) => {
    const currentUserId = req.userId;
    const projectId =req.params.id;

    let project= await Project.findById(projectId).populate("task").populate("assigner").populate("file").populate("task").populate("team").populate("assignee");
    if(!project) throw new AppError(400,"Project not found","Get Single Project Error");


    return sendResponse(res,200,true,{project},null,"Get Single Project successful");
});

projectController.getTaskOfProject = catchAsync(async (req, res, next) => {
    const projectId = req.params.id;
    console.log(projectId)
    page = parseInt(req.query.page) || 1;
    limit = parseInt(req.query.limit) || 10;

    const project= await Project.findById(projectId);
    if(!project) throw new AppError(400,"Project not found","Get Comments Error");


    const count = await Project.countDocuments({project: projectId});
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const tasks = await Project.find({project: projectId}).sort({createdAt: -1 }).skip(offset).limit(limit).populate("assigner").populate("file").populate("task").populate("team").populate("assignee");

    return sendResponse(res,200,true,{tasks,totalPages,count},null,"Get tasks successful");
});

projectController.putProjectsForUsers = catchAsync(async (req, res, next) => {
    const projectId = req.params.id;
    const {userId} = req.body;

    const user = await User.findById(userId);
    if(!user) throw new AppError(400,"User not found","assign projects to user Error ");

    let project = await Project.findById({projectId},{assignee:{$en:{userId}}});
    console.log(project);


    //  project = await Project.findByIdAndUpdate(
    //     {_id: projectId},
    //     {assignee:userId},
    //     {new: true}
    // );
    // project = await project.populate("assignee")
    // project = await project.populate("assigner");
    return sendResponse(res,200,true,project,null,"assign projects to user");
});


projectController.updateSingleProject = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const projectId =req.params.id;


    let project= await Project.findById(projectId);
    if(!project) throw new AppError(400,"Project not found","Update Project Error");
    if(!project.assigner.equals(currentUserId)) 
        throw new AppError(400,"Only assigner can edit project" , "Update Project Error");

    const allows = 
    [
    "name",
    "description",
    "assignee",
    "status",
    ]

    allows.forEach((field) =>{
        if(req.body[field] !== undefined){
            project[field] = req.body[field];
        }
    })
    await project.save();
    await project.populate("assignee")
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

    return sendResponse(res,200,true,project,null,"update Project successful");
});



module.exports = projectController;
