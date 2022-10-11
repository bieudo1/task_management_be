const teamController = require("../controllers/team.controller");
const authentication = require("../middlewares/authentication");
const express = require('express');
const {body,param} = require("express-validator");
const validators = require('../middlewares/validators');
const router = express.Router();


// router.post(
//     '/requests',
//     authentication.loginRequired,
//     validators.validate([
//         body("id").exists().isString().custom(validators.checkObjectId )
//     ]),
//     friendController.sendFriendRequest,
// );

// router.get(
//     '/requests/incoming',
//     authentication.loginRequired,
//     friendController.getReceivedFriendRequestList,
// );

// router.get(
//     '/requests/outcoming',
//     authentication.loginRequired,
//     friendController.getSentFriendRequestList,
// );

// router.get(
//     '/',
//     authentication.loginRequired,
//     friendController.getFriendList,
// );

// router.put(
//     '/requests/:userId',
//     authentication.loginRequired,
//     validators.validate([
//         body("status").exists().isString().isIn(["accepted","declined"]),
//         param("userId").exists().isString().custom(validators.checkObjectId ),
//     ]),
//     friendController.reactFriendRequest,
// );

// router.delete(
//     '/requests/:userId',
//     authentication.loginRequired,
//     validators.validate([
//     param("userId").exists().isString().custom(validators.checkObjectId ),
//     ]),
//     friendController.cancelFriendRequest,
// );

// router.delete(
//     '/:userId',
//     authentication.loginRequired,
//     validators.validate([
//     param("userId").exists().isString().custom(validators.checkObjectId ),
//     ]),
//     friendController.removeFriend,
// );

module.exports= router