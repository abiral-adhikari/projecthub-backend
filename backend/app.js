const express = require('express');//import express module 
const dbConnect=require('./database/database.js');
const app =express();//creating express app
dbConnect();
/*Port number selection 
IF defined in the port environment variable 
Else if not defined ie null ,0 or false will select the port number 8000
and store it in PORT const
*/
const PORT = process.env.PORT||5000;

//port listening to info
const listen=() => {
    app.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`);
})}

//middleware for additonal request info
const middleware=()=>{
    app.use(express.json());
    app.use((req, res,next) => {
        console.log(`${req.path} and ${req.method}`);
        next();
    })
}    

/*functions to listen ,middle ware and database connections
  that are called when app is imported
*/
listen();
middleware();

module.exports =app;
