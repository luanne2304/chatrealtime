const express = require("express");
const RoomRouter = express.Router();
const RoomController = require("../Controllers/roomController");
const authenticateToken = require('../MiddleWare/auth');

RoomRouter.get("/api/Room/getRoombyUser",authenticateToken, RoomController.getRoombyUser);

module.exports = RoomRouter;