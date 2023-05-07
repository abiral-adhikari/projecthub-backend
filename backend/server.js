/*Require .env module and
attach environment variables to process.env from .env file
*/
require('dotenv').config();
const http = require('http');//import http module
const app=require('./app');
const express = require('express');
const path = require('path');
//for every page there is different 
const userroute=require('./routes/user.js')
const projectroute=require('./routes/project.js')
const discussionroute=require('./routes/discussion.js')
const assignmentroute=require('./routes/todo.js')
const resourceroute=require('./routes/resource.js')

// Set up your API routes here
//route handling for 
app.use('/api/user',userroute)
app.use('/api/project',projectroute)
app.use('/api/chat',discussionroute)
app.use('/api/todo',assignmentroute)
app.use('/api/resource',resourceroute)

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all route to serve the React app's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});