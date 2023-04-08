const express = require('express');
//Importing the authorization function from middleware 
const {ReqAuth}= require("../middleware/auth.js")

//Importing the fuction from Project Controller
const{CreateProject,JoinProject,SetDesignation}= require("../controllers/ProjectController.js")

const router =express.Router();

router.use(ReqAuth)
router.post('/create',CreateProject);
router.patch('/join',JoinProject);
router.patch('/setdesignation/:projectid/:memberid',SetDesignation)
module.exports = router;