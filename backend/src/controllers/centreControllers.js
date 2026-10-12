const Centre=require("../model/center")


const centreDetails=async(req,res)=>{

    try{

        const user=req.user.userId;

        const{
            name,
            owner,
            timing,
            coordinates,
            address,
            description,
            category,
            established
        } = req.body;


        const centre=await Centre.create({
            name,
            owner,
            timing,
            coordinates,
            address,
            description,
            category,
            established,
            user
        })

        res.status(201).json({
            message:"centre is created",
            centre
        })


    }

    catch(err){
        res.status(500).json(err)

        console.log(err)
    }
}


const getCentres=async(req,res)=>{

    try{


        const centres=await Centres.find()

        res.status(200).json({
            message:"centres rendered",
            centres


        })
    }
    catch(err){
        res.status(500).json(err)

        console.log(err)
    }
}

const getCentreById=async(req,res)=>{

    try{

        const id=req.params.id;

        const centre=await Centre.findById({id})

        //const centre=await Centre.findOne({_id:id})
        

        res.status(200).json({
            message:"centre rendered",
            centre
        })
    }
     catch(err){
        res.status(500).json(err)

        console.log(err)
    }
}
module.exports={centreDetails , getCentres , getCentreById}