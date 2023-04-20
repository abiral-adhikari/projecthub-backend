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
        const {projectid}=req.params;
        const userid=getuserid(req,res);
        const projectcheck=await Project.findOne({"members._id":userid},{"_id":projectid})
        if(projectcheck){
            if(projectcheck.createdby==userid){
                res.status(200).json(projectcheck)
            }else{
                const projectdetails = await Project.findOne({_id:projectid},{code:0})
                res.status(200).json(projectdetails)
                }
            }
        else{
            throw Error("You are not memeber of the project")
        }
    }catch(error){
        res.status(404).json({error: error.message})
    }
}


//join project with project code
const JoinProject = async(req,res)=>{
    const {code} = req.body//use same variable name as body
    const user_id=getuserid(req,res);
    try{
        const projectmatch = await Project.findOne({'code':code});
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



//Set designation for one project members
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
            {new:true}//new = true is necesssary for changed response
        )
         res.status(200).json(setdesignation)
    }
    catch(error){
        res.status(400).json({error:error.message})
     }
}


//function to get all project details that person is member of 
const getAllProjects=async(req,res)=>{
    const user_id=getuserid(req,res)
    try{
    // using "field name":0 in query omits field in the resulting query object
    const count = await Project.count({"members._id":user_id})
        if(count==0){
            throw Error('You have not joined/ created any project')
        }
        const projectmatch= await Project.find({"members._id":user_id},{'code':0})
        res.status(200).json(projectmatch)
    }catch(error){
        res.status(400).json({error:error.message})
    }

}

const SetDeadline = async(req,res)=>{
    const {projectid}=req.params//id is the object id of profile/user 
    const {deadline}=req.body;
    const userid=getuserid(req,res)
    try{
        /*Checking if use of '' for property name to avoid unexpected token error
          with findOne if findOne({id:id},{name:name}) works as or while findOne({id:id,name:name}) works as and
        */
        const projectcheck= await Project.findOne({'_id':projectid,'createdby':userid})
        if (!deadline){
            throw Error("Enter the deadline for the update")
        }
        if (!projectcheck){
            throw Error("No such project created by you")
        }
        const setdeadline= await Project.findOneAndUpdate(
            {'_id':projectid,'createdby':userid},
            {"deadline":deadline},
            {new:true})
         res.status(200).json({"deadline":setdeadline})
    }
    catch(error){
        res.status(404).json({error:error.message})
    }
}
module.exports={
    CreateProject,
    JoinProject,
    ViewProject,
    SetDesignation,
    getAllProjects,
    SetDeadline
}