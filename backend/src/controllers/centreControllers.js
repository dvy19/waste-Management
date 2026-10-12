const Centre=require("../model/center")


const centreDetails=async(req,res)=>{

    try{

        const user=req.user.userId;

        const coordinates = JSON.parse(req.body.coordinates);


        const{
            name,
            owner,
            timing,
            address,
            description,
            category,
            established,
            
        } = req.body;

        let image=null;

        if (req.file) {
                    image = await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            {
                                folder: "ngo-app/centre-profiles",
                                resource_type: "image"
                            },
                            (error, result) => {
        
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result.secure_url);
                                }
        
                            }
                        );
        
                        stream.end(req.file.buffer);
                    });
                }


        const centre=await Centre.create({
            name,
            owner,
            timing,
            coordinates,
            address,
            description,
            category,
            established,
            user,
            image
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

const getMyCentre=async(req,res)=>{

    try{

        const user=req.user.userId;

        const centre=await Centre.findOne({user:user})

        res.status(200).json(
            {
                message:"centre rendered",
                centre

            }
        )
    }

    catch(err){
        res.status(500).json(err)

        console.log(err)
    }
}
module.exports={centreDetails , getCentres , getCentreById , getMyCentre}