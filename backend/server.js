/*Require .env module and
attach environment variables to process.env from .env file
*/
require('dotenv').config();
const http = require('http');//import http module
const app=require('./app');
const express = require('express');
const path = require('path');

const userroute=require('./routes/user.js')
const projectroute=require('./routes/project.js')
const discussionroute=require('./routes/discussion.js')
const assignmentroute=require('./routes/todo.js')
const resourceroute=require('./routes/resource.js')
//route handling for js
app.use('/api/user',userroute)
app.use('/api/project',projectroute)
app.use('/api/chat',discussionroute)
app.use('/api/todo',assignmentroute)
app.use("/api/resource",resourceroute)

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Serve the index.html file for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});
