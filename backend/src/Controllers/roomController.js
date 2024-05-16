const roomModel = require("../Models/roomModel");


const RoomController = {
    getRoombyUser: async (req, res, next) => {
        try {
        const rooms = await roomModel.find({ members:{
            $elemMatch: {
                "userID": req.user._id
            }
        }});
        return res.status(200).json({
            success: true,
            data: rooms,
        });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            }); 
        }
    },

}

module.exports = RoomController;
