const express = require('express');
const router = express.Router();

// authApi
const authAPI = require("./auth.api");
router.use("/auth", authAPI);

// userApi
const userAPI = require('./user.api');
router.use('/users', userAPI);

// taskApi
const taskAPI = require('./task.api');
router.use('/tasks', taskAPI);

// fileApi
const fileAPI = require('./file.api');
router.use('/files', fileAPI);

// projectApi
const projectAPI = require('./project.api');
router.use('/projects', projectAPI);

// teamApi
const teamAPI = require('./team.api');
router.use('/teams', teamAPI);

module.exports = router;
