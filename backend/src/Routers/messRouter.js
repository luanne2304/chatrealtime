const express = require("express");
const MessRouter = express.Router();
const MessController = require("../Controllers/messController");
const authenticateToken = require('../MiddleWare/auth');
const { upload } = require('../MiddleWare/multer')

MessRouter.post("/api/Mess/sendMess",authenticateToken, MessController.Chat);
MessRouter.get("/api/Mess/getMess",authenticateToken, MessController.GetMess);
MessRouter.post("/api/Mess/sendIMG",authenticateToken,upload, MessController.ChatIMG);

module.exports = MessRouter;