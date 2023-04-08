/*Require .env module and
attach environment variables to process.env from .env file
*/
require('dotenv').config();
const http = require('http');//import http module
const app=require('./app');

const userroute=require('./routes/user.js')
const projectroute=require('./routes/project.js')

//route handling for js
app.use('/api/user',userroute)
app.use('/api/project',projectroute)

