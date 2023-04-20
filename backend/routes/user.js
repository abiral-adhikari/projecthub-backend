const express = require('express');
//Importing the authorization function from middleware 
const {ReqAuth}= require("../middleware/auth.js")

//Importign the functions from the controllers
const {SignUp,Login}=require('../controllers/UserController.js');
const{CreateProfile,UpdateProfile,GetName}=require('../controllers/ProfileController.js');
const router=express.Router();//Creating instance of router

router.post('/signup',SignUp);
router.get('/login',Login);

//WE call reqAuth before Profile to authenticate user access to profile
router.use(ReqAuth);
router.post('/createprofile',CreateProfile);
router.patch('/updateprofile',UpdateProfile);
router.get('/getname/:userid',GetName);
module.exports = router;