const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {User,Profile}= require('../models/user.js');

const ProjectSchema = new Schema({
    title:{
        type :String,
        required : true,
        length:520
    },
    details:String,
    code:{
        type:String,
        required : true,
        unique : true,
    },
    createdby:{
        type:Schema.Types.ObjectId,
        reference:Profile,
        required:true
    },
    deadline:{
        type:Date,
        default:null,
    },
    members:[
        {
            _id:{
            type:Schema.Types.ObjectId,
            reference:Profile
            },
            designation:{
                type:String,
                default:" ",
                length:20
            },
    }]
})

const Project=mongoose.model('Project',ProjectSchema)

module.exports={
    Project
}