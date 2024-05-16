const express = require("express");
const UserRouter = express.Router();
const UserController = require("../Controllers/userController");
const authenticateToken = require('../MiddleWare/auth');

UserRouter.get("/api/User/GetUserChat",authenticateToken, UserController.getUserTOCHAT);

module.exports = UserRouter;