        console.log(totalpointdata)
        const completepointdata= await Assignment.aggregate([
                {$match:{_id:projectid}},
                {$project:{"list":1}},
                {$unwind:"$list"},
                {$match:{"list.tag":"Complete"}},
                {
                    /* There are no matching documents in the Assignment collection
                     where the list.assignedto field is not null: If there are no documents 
                     in the Assignment collection where the list.assignedto field is not null, then the $group stage 
                     in the aggregation pipeline will not create any new groups, and the resulting array will be empty.
                    */
                     $group:{
                        _id:"$list.assignedto",
                        sum:{$sum:"$list.point"}
                    }
                }
            ])
        console.log(completepointdata)
        
        const output={
            "complete":completepointdata,
            "total":totalpointdata
        }



const UserProgress=async(req,res)=>{
    userid=getuserid(req,res);
    try{
        const totalpointdata=await Assignment.aggregate([
            {$unwind:"$list"},
            {$match:{"list.$.assignedto":userid}},
            // {
            //     $group:{
            //         _id:"_id",
            //         totalPoints:{$sum:"list.point"},
            //         completedPoints:{$sum: { $cond: [{ $eq: ["$list.tag", "Complete"] }, "$list.point", 0] } }
            //     }
            // }
        ])
            res.status(200).json(totalpointdata)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

