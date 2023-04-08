const {User,Profile}=require("../models/user.js");
const bcrypt= require("bcrypt")
const validator=require("validator")
const jwt =require("jsonwebtoken")
const {ReqAuth,getuserid} = require("../middleware/auth.js")

const CreateProfile= async(req, res) => {
    const {firstname,lastname,gender,phonenumber,dob,gitlink}= req.body 
    try{
        //getting id of session user from getid function of middleware
        const _id = getuserid(req,res)
        
        //finding user with given id
        const user = await User.findOne({_id});

        if(!firstname || !lastname || !phonenumber || !gitlink){
            throw Error("You must provide a firstname,lastname,phonenumber and gitlink compulsarily")
        }

        const profileexists= await Profile.findOne({_id})//use findone to give null value if only find is used we get null array difficult to use with if
        if(profileexists){
            throw Error("Profile already exists");
        }
        
        //CREATING new profile using user found with session id 
        const createprofile= await Profile.create({
            _id:user._id,
            email:user.email,
            firstname:firstname,
            lastname:lastname,
            gender:gender,
            phonenumber:phonenumber,
            dob:dob,
            gitlink:gitlink
        })
    res.status(200).json(createprofile)
    }catch(error){
        res.status(404).json({error:error.message})
    }
}

const UpdateProfile = async(req,res)=>{
    const {firstname,lastname,gender,phonenumber,dob,gitlink}= req.body 
    try{
        //getting id of session user from getid function of middleware
        const _id = getid(req,res)
        
        //finding profile with given id
        const upadateprofile = await Profile.findOneAndUpdate({_id:_id},req.body);
        const newprofile = await Profile.findOne({_id:_id})
        res.status(200).json(newprofile)
    }catch(error)
    {
        res.status(404).json({error:error.message})
    }
    }

module.exports ={CreateProfile,UpdateProfile};