const userModel = require("../Models/userModel");


const UserController = {
    getUserTOCHAT: async (req, res, next) => {
        try {
        const users = await userModel.find({ _id: { $ne: req.user._id } });
        return res.status(200).json({
            success: true,
            data: users,
        });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            }); 
        }
    },

}

module.exports = UserController;
