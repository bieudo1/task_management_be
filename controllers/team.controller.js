const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const Team = require('../models/Team');
const User = require('../models/User');
const teamController = {};



teamController.createNewTeam = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    let {name} = req.body;

    const manager= await User.findById(currentUserId);
    if(!manager) throw new AppError(400,"manager not found", "Create New team error");

    let team= await Team.create({
        name,
        manager:currentUserId
    })

    team = await team.populate("manager")

    return sendResponse(res,200,true,team,null,"Create New team Success")
})

teamController.getTeamList = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    let { page, limit,...filter } = {...req.query};

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;


    const filterCondition = [{isDeleted: false} ];
     if(filter.name) {
         filterCondition.push({name: {$regex: filter.name, $options: "i"},})
     }

    const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

    const count = await Team.countDocuments(filterCrileria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    let teams = await Team.find(filterCrileria).sort({createdAt: -1 }).skip(offset).limit(limit).populate("manager").populate("workers");
    

    return sendResponse(res,200,true,{teams,totalPages,count},null,"Get Current User successful");
})

teamController.getSingleTeam = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const teamId =req.params.id;

    let team= await Team.findById(teamId).populate("workers");
    if(!team) throw new AppError(400,"team.1 not found","Get single team Error");

    return sendResponse(res,200,true,{team},null,"Get Team successful");
})

teamController.updateSingleTeam = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const teamId =req.params.id;
    const {name} = req.body;

    const team = await Team.findByIdAndUpdate(
        {_id: teamId, assigner: currentUserId},
        {name},
        {next: true}
    );
    if(!team) throw new AppError(400,"team not found or User not authorized","Update team Error");
    return sendResponse(res,200,true,team,null,"update Team successful");
})

teamController.putTeamForUser = catchAsync(async (req, res, next) => {
    const teamId = req.params.id;
    const {userId} = req.body;

    let user = await User.findById(userId);
    // console.log(user.team === teamId)
    if(!user || user.team === teamId) throw new AppError(400,"User not found or the user is already on the team","assign teams to user Error ");
    user.team = teamId;
    user = await user.save();

    let team = await Team.findByIdAndUpdate(
        {_id: teamId},
        {$push:{workers:userId}},
        {new: true}
    );
    team = await team.populate("manager")
    team = await team.populate("workers");


    return sendResponse(res,200,true,team,null,"assign teams to user");
})
teamController.deleteUserFomTeam = catchAsync(async (req, res, next) => {
    const teamId = req.params.id;
    const {userId} = req.body;

    let user = await User.findById(userId);
    if(!user || user.team !== teamId) throw new AppError(400,"User not found or the user is not in the team","assign teams to user Error ");
    user.team = " ";
    user = await user.save();

    let team = await Team.findByIdAndUpdate(
        {_id: teamId},
        {$pull:{workers:userId}},
        {new: true}
    );
    team = await team.populate("manager")
    team = await team.populate("workers");
    

    return sendResponse(res,200,true,team,null,"assign teams to user");
})

teamController.deleteSingleTeam = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
    const teamId =req.params.id;

    const team = await Team.findOneAndUpdate(
        {_id: teamId, assigner: currentUserId},
        {isDeleted: true},
        {new: true}
    );
    if(!team) throw new AppError(400,"team not found or User not authorized","Delete team Error ")


    return sendResponse(res,200,true,team,null,"Delete Team successful");
})


module.exports = teamController;
