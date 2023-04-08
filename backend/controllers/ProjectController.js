const{Project} =require('../models/project')
const{Profile}= require('../models/user')
const shortid = require('shortid');
const{getuserid} = require('../middleware/auth.js')



const CreateProject= async (req,res)=>{
    const{title,details,deadline}=req.body
    try{
        const _id=getuserid(req,res)
        
        // checking the title name of the project is unique or not
        const project=await Project.findOne({title})
        if(project){
            throw Error("Project with same name exists already")
        }

        //LOOP TO keep generating project code till unique
           // Generate a 6-character alphanumeric code
           while(true){ 
           var projectcode = shortid.generate();
           const projectcheck= await Project.findOne({code:projectcode});
            if(!projectcheck){break;}
           }

        const user=await Profile.findOne({_id:_id})
        const fullname=`${user.firstname} ${user.lastname}`
        
        const createProject=await Project.create({
            title:title,
            details:details,
            deadline:deadline,
            createdby:_id,
            code:projectcode,
            members:[{_id:_id}]
        })
        
        res.status(200).json(createProject)

    }catch(error){
        res.status(404).json({error: error.message})
    }
}

//function to view project details
const ViewProject = async(req,res)=>{
    try{
        const project_id =req.params;
        const user_id=getuserid(req,res);

        const projectowner= await Project.findOne({createdby:user_id})
        const projectmember_id=await Project.findOne({member:user_id})
        if(projectcheck){
            res.status(200).json(projectowner)
        }
    }catch(error){
        res.status(404).json({error: error.message})
    }
}

const DeleteProject = async(req,res)=>{
}

const JoinProject = async(req,res)=>{
    const {code} = req.body//use same variable name as body
    const user_id=getuserid(req,res);
    try{
        const projectmatch = await Project.findOne({code:code});
        if(!projectmatch){
            throw Error("Project Code is not valid ")
        }
        const membermatch= await Project.findOne({'members._id':user_id});
        if(membermatch){
            throw Error("Already a  member of the project can't join again")
        }else
        {
            const addmember = await Project.findOneAndUpdate(
                {code:code},
                {$push:{members:{_id:user_id}}}
            )
            res.status(200).json({msg:`user of id ${user_id} added successfully to project of code ${code} `})
        }
    }catch(error){
        res.status(404).json({error: error.message})
    }
}


const SetDesignation = async(req,res)=>{
    const {projectid,memberid}=req.params//id is the object id of profile/user 
    const {designation}=req.body;//designattion is string designation obtained from user
    const user_id =getuserid(req,res);//getting user id to check if admin or not
    try{
        /*Checking if use of '' for property name to avoid unexpected token error
          with findOne if findOne({id:id},{name:name}) works as or while findOne({id:id,name:name}) works as and
        */
        const projectcheck= await Project.findOne({'_id':projectid,'members._id':memberid})
        
        if (!designation){
            throw Error("Enter the designation for the update")
        }
        if (!projectcheck){
            throw Error("No such project with provided members")
        };
        const setdesignation = await Project.findOneAndUpdate(
            //herer 'members._id' is valid but it updating no so using $set
            {'_id':projectid,'members._id':memberid},
            //use $set operator updating members.designation .$ gives index of object
            {$set:{"members.$.designation":designation}},
            {new:true}
        )
         res.status(200).json(setdesignation)
    }
    catch(error){
        res.status(400).json({error:error.message})
     }
}

module.exports={
    CreateProject,
    JoinProject,
    DeleteProject,
    ViewProject,
    SetDesignation
}