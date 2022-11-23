const teamController = require("../controllers/team.controller");
const authentication = require("../middlewares/authentication");
const express = require('express');
const {body,param} = require("express-validator");
const validators = require('../middlewares/validators');
const router = express.Router();

/* @route Post /teams
    @descripton create New Team
    @body {name}
    @access login request
*/
router.post('/',
    authentication.loginRequired,
    validators.validate([
        body("name","Missing name").exists().notEmpty(),
    ]),
    teamController.createNewTeam
);

/* @route Get/teams
    @descripton get Team List
    @body
    @access login request
*/
router.get('/',
    authentication.loginRequired,
    teamController.getTeamList,
);

/* @route GEt /teams/:id
    @descripton get Single Team
    @body 
    @access login request
*/
router.get('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),teamController.getSingleTeam);

/* @route Put /teams/:id
    @descripton update Single Team
    @body {name}
    @access login request
*/
router.put('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId ),
]),
teamController.updateSingleTeam)

/* @route Put /team/:id/user
    @descripton assign teams to user
    @body {userId}
    @access login request
*/
// router.put('/:id/user', authentication.loginRequired ,validators.validate([
//     param("id").exists().isString().custom(validators.checkObjectId ),
//     body("userId","Invalid targetId").exists().custom(validators.checkObjectId ),
// ]),teamController.putTeamForUser);

// /* @route delete /team/:id/user
//     @descripton assign teams to user
//     @body {userId}
//     @access login request
// */
// router.delete('/:id/user', authentication.loginRequired ,validators.validate([
//     param("id").exists().isString().custom(validators.checkObjectId ),
//     body("userId","Invalid targetId").exists().custom(validators.checkObjectId ),
// ]),teamController.deleteUserFomTeam);

/* @route delete /team/:id/user
    @descripton delete Single Team
    @body 
    @access login request
*/
router.delete('/:id', authentication.loginRequired ,validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId )
]),teamController.deleteSingleTeam);

module.exports= router