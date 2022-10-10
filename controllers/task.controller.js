const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const Task = require('../models/Task');
// const Comment = require('../models/Comment');
// const Reaction = require('../models/Reaction');
const reactionController = {};

// const calculateReactionConut = async(targetId,targetType) =>{
//     const status = await Reaction.aggregate([
//         {
//             $match:{ targetId: mongoose.Types.ObjectId(targetId)},
//         },
//         {
//             $group:{
//                 _id: "$targetId",
//                 like: {
//                     $sum: { 
//                         $count:[{$eq: ["$emoji","like"]},1,0],
//                     },
//                 },
//                 dislike: {
//                     $sum: { 
//                         $count:[{$eq: ["$emoji","dislike"]},1,0],
//                     },
//                 },
//             },
//         },
//     ]);
//     const reactions = {
//         like: (status[0] && status[0].like || 0),
//         dislike: (status[0] && status[0].dislike || 0),
//     }
//     await mongoose.model(targetType).findByIdAndUpdate(targetId,{reactions});
//     return reactions;
// };

// reactionController.saveReaction = catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     const {targetType,targetId,emoji} = req.body

//     const targetObject= await mongoose.model(targetType).findById(targetId);
//     if(!targetObject) throw new AppError(400,`${targetType} not found`, "Create Reaction error");

//     let reaction = await Reaction.findOne({
//         targetId,
//         targetType,
//         author:currentUserId,
//     });

//     if(!reaction){
//         reaction = await Reaction.create({targetId, targetType, author:currentUserId,emoji,});
//     }else{
//         if(reaction.emoji === emoji){
//             await reaction.delete();
//         }else{
//             reaction.emoji = emoji;
//             await reaction.save();
//         }
//     }

//     const reactions = await calculateReactionConut(targetId,targetType)

//     return sendResponse(res,200,true,reactions,null,"Save reaction Successful")

// });

module.exports = reactionController;
