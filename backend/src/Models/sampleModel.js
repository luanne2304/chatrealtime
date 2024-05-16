const mongoose = require("mongoose");

const sampleSchema = new mongoose.Schema(
    {
        type1: {type: String, required: true, default: 'type1'},
        address: {
            city: { type: String, required: true },
            city_code: { type: Number, required: true },
            district: { type: String, required: true },
            district_code: { type: Number, required: true },
            ward: { type: String, required: true },
            ward_code: { type: Number, required: true },
            streetnumber: { type: String, required: true },
        },
        tag: {
            skill: [{ type: String , required: true}],
            exp: [{ type: String , required: true }]
        },
        id_User:{ type: mongoose.Schema.Types.ObjectId, required: true , ref:"users"}
    },{
        timestamps: true,
    }
);
const sampleModel = mongoose.model("samples", sampleSchema);

module.exports = sampleModel;