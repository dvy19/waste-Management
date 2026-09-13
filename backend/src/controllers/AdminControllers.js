
const {Centres , SaleItem}=require('../model/adminDetails')
const cloudinary=require('../config/cloudinary')

const createCentres=async(req,res)=>{


    try{

        const{name, city, pinCode, address, about, contact, owner , material} = req.body;

        const coordinates = JSON.parse(req.body.coordinates);

        //console.log(req.file)

        let profileImage = null;
                if (req.file) {
                    profileImage = await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            {
                                folder: "waste-app/centre",
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

        //console.log(profileImage)


        const existingCentre = await Centres.findOne({
            name,
            owner
        });

        if (existingCentre) {
            return res.status(409).json({
                message: "Centre already exists for this owner"
            });
        }
        const centre=await Centres.create({
            name,
            material,
            address,
            pinCode,
            address,
            image:profileImage,
            coordinates,
            city,
            contact,
            owner
        })


        res.status(201).json({
            message:"centre created",
            centre
        })


    }

    catch(err){
        console.log(`${err}`)

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getCentres=async(req,res)=>{

    try{

        const centres=await Centres.find()

        res.status(200).json({
            message:"all centres",
            centres
        })
    }
     catch(err){
        console.log(`${err}`)

        res.status(500).json({
            message: "Server error"
        });
    }

}


const getCentreById=async(req,res)=>{

    try{

        const id=req.params.id;

        const centre=await Centres.findOne({_id:id})

        res.status(201).json({
            message:"centre rendered",
            centre

        })
    }
     catch(err){
        console.log(`${err}`)

        res.status(500).json({
            message: "Server error"
        });
    }

}


const createItem=async(req,res)=>{

    try{

        const{name,price,quantity, manufacturer, about,tag , materials}=req.body;

        //console.log(req.file)
        let image = null;
        if (req.file) {
            image = await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            {
                                folder: "waste-app/salesItem",
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

        //console.log(image)

        const saleItem=await SaleItem.create({

            name,
            price,
            quantity,
            manufacturer,
            about,
            tag,
            materials,
            image:image
        })

        res.status(200).json({
            message:"item created",
            saleItem
        })
    }
    catch(err){
        console.log(`${err}`)

        res.status(500).json({
            message: "Server error"
        });
    }
}


const getSalesItems=async(req,res)=>{

    try{

        const items=await SaleItem.find()

        res.status(200).json({
            message:"all items rendered",
            items
        })
    }
    catch(err){
        console.log(`${err}`)

        res.status(500).json({
            message: "Server error"
        });
    }
}
module.exports={createCentres , getCentres , getCentreById , createItem , getSalesItems}