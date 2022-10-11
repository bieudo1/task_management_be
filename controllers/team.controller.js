const mongoose = require('mongoose');
const { sendResponse, AppError,catchAsync}=require("../helpers/utils.js");
const File = require('../models/File');
const User = require('../models/User');
const friendController = {};


// const calculateFriendtConut = async (userId) => {
//     const friendCount = await Friend.countDocuments({
//         $or: [{ from: userId}, { to:userId }],
//         status: "accepted",
//     });
//     await User.findByIdAndUpdate(userId, {friendCount: friendCount});
// }

// friendController.sendFriendRequest = catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     const toUserId = req.body.to;

//     let user= await User.findById(toUserId);
//     if(!user) throw new AppError(400,"User not found","Send Friend Request Error");

//     let friend = await Friend.findOne({
//         $or: [
//             { from: toUserId, to:currentUserId},
//             { from: currentUserId, to:toUserId },
//         ],
//     });

//     if(!friend){
//         friend = new Friend.create({
//             from: currentUserId,
//             to:toUserId,
//             status: "pending",
//         });
//         return sendResponse(res,200,true,friend,null,"request has ben sent");
//     }else{
//         switch(friend.status) {
//             case "pending":
//                 if (friend.fromm.equals(currentUserId)){
//                     throw new AppError(400, "you have already sent a request to this user","Add Friend Error");
//                 } else {
//                     throw new AppError(400, "you have received a request from this user","Add Friend Error");
//                 }
//             case "accepted":
//                 throw new AppError(400, "Users are already friend ","Add Friend Error");
//             case "diclined":
//                 friend.fromm = currentUserId;
//                 friend.to = toUserId;
//                 friend.status = "pending";
//                 await friend.save();
//                 return sendResponse(res,200,true,friend,null,"request has ben sent");
//             default:
//                 throw new AppError(400, "Frined Status undefined ","Add Friend Error");
//         }
//     }

// });

// friendController.getReceivedFriendRequestList = catchAsync(async (req, res, next) => {
//     let (page, limit,...filter) = {...req.query};
//     const currentUserId = req.userId;


//     const friendList = await Friend.find({
//         to: currentUserId,
//         status: "pending",
//     });

//     const friendIDs = friendList.map((friend) => {
//         if(friend.from._id.equals(currentUserId)) return friend.to;
//         return friend.from;
//     });

//     const filterCondition = [ {_id: {$in: friendIDs} }];
//     if(filter.name) {
//         filterCondition.push({
//             ["name"]: {$regex: filter.name, $options: "i"},
//         });
//     }
//     const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

//     page = parseInt(page) || 1;
//     limit = parseInt(limit) || 10;

//     const count = await User.countDocuments(filterCrileria);
//     const totalPages = Math.ceil(count / limit);
//     const offset = limit * (page - 1);

//     let users = await Friend.find(filterCrileria).sort({createdAt: -1 }).skip(offset).limit(limit);
    
//     const userWithFriendship = users.map((user) => {
//         let temp = user.toJSON();
//         temp.friendship = friendList.find((friendship) => {
//             if(friendship.from.equals(user._id) || friendship.to.equals(user._id)){
//                 return { status: friendship.status};
//             }
//             return false;
//         });
//         return temp;
//     });
    
//     return sendResponse(res,200,true,{users:userWithFriendship, totalPages, count},null,"React Friend Request successfully")

// });

// friendController.getSentFriendRequestList =catchAsync(async (req, res, next) => {
//     let (page, limit,...filter) = {...req.query};
//     const currentUserId = req.userId;


//     const friendList = await Friend.find({
//         from: currentUserId,
//         status: "pending",
//     });

//     const friendIDs = friendList.map((friend) => {
//         if(friend.from._id.equals(currentUserId)) return friend.to;
//         return friend.from;
//     });

//     const filterCondition = [ {_id: {$in: friendIDs} }];
//     if(filter.name) {
//         filterCondition.push({
//             ["name"]: {$regex: filter.name, $options: "i"},
//         });
//     }
//     const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

//     page = parseInt(page) || 1;
//     limit = parseInt(limit) || 10;

//     const count = await User.countDocuments(filterCrileria);
//     const totalPages = Math.ceil(count / limit);
//     const offset = limit * (page - 1);

//     let users = await Friend.find(filterCrileria).sort({createdAt: -1 }).skip(offset).limit(limit);
    
//     const userWithFriendship = users.map((user) => {
//         let temp = user.toJSON();
//         temp.friendship = friendList.find((friendship) => {
//             if(friendship.from.equals(user._id) || friendship.to.equals(user._id)){
//                 return { status: friendship.status};
//             }
//             return false;
//         });
//         return temp;
//     });
    
//     return sendResponse(res,200,true,{users:userWithFriendship, totalPages, count},null,"React Friend Request successfully")

// });

// friendController.getFriendList =  catchAsync(async (req, res, next) => {
//     let (page, limit,...filter) = {...req.query};
//     const currentUserId = req.userId;


//     const friendList = await Friend.find({
//         $of: [{from: currentUserId, to: currentUserId},],
//         status: "accepted",
//     });

//     const friendIDs = friendList.map((friend) => {
//         if(friend.from._id.equals(currentUserId)) return friend.to;
//         return friend.from;
//     });

//     const filterCondition = [ {_id: {$in: friendIDs} }];
//     if(filter.name) {
//         filterCondition.push({
//             ["name"]: {$regex: filter.name, $options: "i"},
//         });
//     }
//     const filterCrileria = filterCondition.length ? { $and: filterCondition}: {};

//     page = parseInt(page) || 1;
//     limit = parseInt(limit) || 10;

//     const count = await User.countDocuments(filterCrileria);
//     const totalPages = Math.ceil(count / limit);
//     const offset = limit * (page - 1);

//     let users = await Friend.find(filterCrileria).sort({createdAt: -1 }).skip(offset).limit(limit);
    
//     const userWithFriendship = users.map((user) => {
//         let temp = user.toJSON();
//         temp.friendship = friendList.find((friendship) => {
//             if(friendship.from.equals(user._id) || friendship.to.equals(user._id)){
//                 return { status: friendship.status};
//             }
//             return false;
//         });
//         return temp;
//     });
    
//     return sendResponse(res,200,true,{users:userWithFriendship, totalPages, count},null,"React Friend Request successfully")

// });

// friendController.reactFriendRequest = catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     const {status} = req.body;
//     const fromUserId = req.params.userId;


//     const friend = await Friend.findOne({
//         from: fromUserId,
//         to:currentUserId,
//         status: "pending",
//     });

//     if(!friend) throw new AppError(400,"Friend Request not found","Cancel Request Error");

//     friend.status= status;
//     await friend.save();

//     if(status === "accepted") {
//         await calculateFriendtConut(currentUserId);
//         await calculateFriendtConut(fromUserId);
//     }

//     return sendResponse(res,200,true,friend,null,"React Friend Request successfully")

// });

// friendController.cancelFriendRequest =catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     const toUserId = req.body.to;


//     const friend = await Friend.findOne({
//         from: currentUserId,
//             to:toUserId,
//             status: "pending",
//     })

//     if(!friend) throw new AppError(400,"Friend Request not found","Cancel Request Error");

//     await friend.delete();

//     return sendResponse(res,200,true,friend,null,"Friend has been cancelled")

// });

// friendController.removeFriend = catchAsync(async (req, res, next) => {
//     const currentUserId = req.userId;
//     const friendId = req.params.userId;


//     const friend = await Friend.findOne({
//         $of: [
//             {from: friendId, to: currentUserId},
//             { from: currentUserId, to: friendId },
//         ],
//         status: "accepted",
//     });

//     if(!friend) throw new AppError(400,"Friend Request not found","Remove Friend Error");

//     await friend.delete();
//     await calculateFriendtConut(currentUserId);
//     await calculateFriendtConut(fromUserId);

//     return sendResponse(res,200,true,friend,null,"Friend has been remove")

// });

module.exports = friendController;
