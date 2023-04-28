const express = require('express');
//Importing the authorization function from middleware 
const {ReqAuth}= require("../middleware/auth.js")
const router =express.Router();
const{CreateAssignment,UpdateAssignment,ProjectProgress,UserProgress, ViewAssignment,ViewSelfAssignment}= require("../controllers/TodoController.js")

// Routes for todo handling
router.use(ReqAuth)
router.patch('/create/:projectid',CreateAssignment)
router.patch('/update/:projectid/:todoid',UpdateAssignment)
router.get('/view/:projectid',ViewAssignment)
router.get('/viewself/:projectid',ViewSelfAssignment)

router.get('/projectprogress/:projectid',ProjectProgress)
router.get('/userprogress',UserProgress)

module.exports = router;