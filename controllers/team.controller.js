const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const Team = require('../models/Team');
const User = require('../models/User');
const teamController = {};



teamController.createNewTeam = catchAsync(async (req, res, next) => {
    let {name,manager,workers} = req.body;

    console.log(workers)

    let team= await Team.create({
        name,
        manager,
        workers,
    })
    if(manager){
    await User.findByIdAndUpdate(
        { _id: manager},
        {team:team._id}
    )}

    if(workers.length !==0 ){
    workers.forEach(async (worker) =>
        await User.findByIdAndUpdate(
            { _id: worker},
            {team:team._id}
            )
        )}

    team = await team.populate("manager")

    return sendResponse(res,200,true,{team},null,"Create New team Success")
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
    const teamId =req.params.id;

    let team= await Team.findById(teamId);
    if(!team) throw new AppError(400,"team not found","Update team Error");
    
    const allows = [
        "name",
        "workers",
        "manager"]

        allows.forEach((field) =>{
            if(req.body[field] !== undefined){
                team[field] = req.body[field];
                if(req.body["workers"].length !==0 ){
                    req.body["workers"].forEach(async (worker) =>
                        await User.findByIdAndUpdate(
                            { _id: worker},
                            {team:team._id}
                            )
                        )}
            }
        })
        await team.save();
        await team.populate("workers")
        await team.populate("manager");
    if(!team) throw new AppError(400,"team not found or User not authorized","Update team Error");
    return sendResponse(res,200,true,team,null,"update Team successful");
})


teamController.deleteSingleTeam = catchAsync(async (req, res, next) => {
    const teamId =req.params.id;

    await User.findByIdAndUpdate(
        { _id: team.manager},
        {team:""}
    )
    team.workers.forEach(async (worker) =>
        await User.findByIdAndUpdate(
            { _id: worker},
            {team:""}
            )
        )
    const team = await Team.findOneAndUpdate(
        {_id: teamId},
        {isDeleted: true},
        {new: true}
    );
    if(!team) throw new AppError(400,"team not found or User not authorized","Delete team Error ")


    return sendResponse(res,200,true,team,null,"Delete Team successful");
})


module.exports = teamController;
