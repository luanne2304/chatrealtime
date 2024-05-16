const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        members: {type: Array},
    }
);
const roomModel = mongoose.model("rooms", roomSchema);

module.exports = roomModel;