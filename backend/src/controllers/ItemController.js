const Item=require("../model/Item")
const { UserDetails } = require("../model/User")


const crypto = require("crypto");

const {getIO}=require('../../socket')

const createItemReq = async (req, res) => {
    
    try {

        const {
            name,
            category,
            quantity,
            weight
        } = req.body;

        const user = req.user.userId;

        const userProfile = await UserDetails.findOne({
            user: user
        });

        if (!userProfile) {
            return res.status(404).json({
                message: "User profile not found"
            });
        }

        const admin = await User.findOne({
            role: "admin"
        });

        const adminId = admin._id;

        
        const trackingId =
            "WM-" + crypto.randomBytes(4).toString("hex").toUpperCase();

        const item = await Item.create({
            user: userProfile._id,
            trackingId,
            name,
            category,
            quantity,
            weight,
            status: "submitted"
        });

        const io=getIO()

        io.to(`admin_${adminId}`).emit("newItemRequest" , {

            message:"new item req received",
            item

        })

        res.status(201).json({
            message: "Item request created",
            trackingId: item.trackingId,
            item
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getItemReq=async(req,res)=>{

    try{

        const item=await Item.find().populate("user")

        res.status(201).json({
            message:"item retreived",
            item
        })
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getItemById=async(req,res)=>{

    try{

        const trackingId=req.params.trackingId;

        const item=await Item.findOne({trackingId})

        res.status(201).json({
            message:"your item retreived",
            item
        })
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }

}

module.exports={createItemReq , getItemReq , getItemById}