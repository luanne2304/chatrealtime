const mongoose = require("mongoose");

const messSchema = new mongoose.Schema(
    {
        room_ID: {type: mongoose.Schema.Types.ObjectId,  required: true , ref:"rooms"},
        sender_id: {type: mongoose.Schema.Types.ObjectId,  required: true , ref:"users"},
        content: {type: String, required: true},
        block: {type: Number},
    },{
        timestamps: true,
    }
);
const messModel = mongoose.model("messes", messSchema);

module.exports = messModel;