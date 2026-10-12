
const { SaleItem}=require('../model/adminDetails')
const cloudinary=require('../config/cloudinary')



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


const getSalesItemById=async(req,res)=>{

    try{

        const id=req.params.id;
        console.log(id)

        const item=await SaleItem.findOne({_id:id})

        console.log(item)

        res.status(200).json({
            message:"item rendered",
            item
        })

    }
    catch(err){
        console.log(`${err}`)

        res.status(500).json({
            message: "Server error"
        });
    }
}
module.exports={ createItem , getSalesItems , getSalesItemById}