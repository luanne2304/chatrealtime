const messModel = require("../Models/messModel");
const { storage } = require('../config/firebase')
const {ref,uploadBytesResumable,getDownloadURL} =require("firebase/storage")
const {v4} =require("uuid")


const MessController = {
    Chat: async (req, res, next) => {
        try {
        const { room, content } = req.body;
        const lastmess =await messModel.findOne({ room_ID: room }).sort({ createdAt: -1 });
        let block
        if(lastmess===null)
            block=1
        else {
            const count =await messModel.countDocuments({room_ID: room , block: lastmess.block });
            if(count>=10)
                block=lastmess.block
            else block=lastmess.block
        }
        const message = new messModel({
            sender_id: req.user._id,
            room_ID:room,
            content,
            block:block,
        });
        await message.save();
        return res.status(200).json({
            success: true,
        });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            }); 
        }
    },

    ChatIMG: async (req, res, next) => {
        try {
            const {  room } = req.body;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded.',
            });
        }
        const file = {
            type: req.file.mimetype,
            buffer: req.file.buffer,
            filename: req.file.originalname,
            }
        const metadata = {
            contentType: file.type,
            }
        const imgref = await ref(storage,`chatrealtime/${file.filename}.${v4()}`)
        const snapshot =await uploadBytesResumable(imgref, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const lastmess =await messModel.findOne({ room_ID: room }).sort({ createdAt: -1 });
        let block
        if(lastmess===null)
            block=1
        else {
            const count =await messModel.countDocuments({room_ID: room , block: lastmess.block });
            if(count>=10)
                block=lastmess.block+1
            else block=lastmess.block
        }

        const message = new messModel({
            sender_id: req.user._id,
            room_ID:room,
            content:downloadURL,
            block:block
        });
        await message.save();
        return res.status(200).json({
            success: true,
            data: downloadURL,
        });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            }); 
        }
    },

    GetMess: async (req, res, next) => {
        try {
            const {room, index}= req.query
            let block=index
            console.log(block)
            if(block==undefined){
    
                const lastmess =await messModel.findOne({ room_ID: room }).sort({ createdAt: -1 });
                if(lastmess!=null){
                    block=lastmess.block
                console.log(block)
                 }
                else{
                    return res.status(200).json({
                        success: true,
                        data: []
                    });
                }
            }
            const Messes =await messModel.find({room_ID:room,block:block}).sort({ createdAt: 1 })
        return res.status(200).json({
            success: true,
            data: Messes,
            index:block
        });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            }); 
        }
    },

}

module.exports = MessController;
