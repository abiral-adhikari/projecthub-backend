const express = require('express');
//Importing the authorization function from middleware 
const {ReqAuth}= require("../middleware/auth.js")

//Importing the fuction from Project Controller
const{CreateProject,JoinProject,SetDesignation,getAllProjects,ViewProject,SetDeadline}
=require("../controllers/ProjectController.js")

const router =express.Router();

router.use(ReqAuth)
router.post('/create',CreateProject);
router.patch('/join',JoinProject);
router.patch('/setdesignation/:projectid/:memberid',SetDesignation)
router.get('/getall/',getAllProjects)
router.get('/view/:projectid',ViewProject)
router.patch('/setdeadline/:projectid',SetDeadline);
module.exports = router;