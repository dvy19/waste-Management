const Item=require("../model/Item")
const { UserDetails , UserStats , CouponSchema } = require("../model/User")
const { analyzeImage } = require("../service/geminiService");




const crypto = require("crypto");

const {getIO}=require('../../socket')

const getUserStats=async(req,res)=>{

    try{

        const user=req.user.userId;

        const stats=await UserStats.findOne({user})

        res.status(200).json({
            message:"user stats render",
            stats
        })
    }
    catch(err){
        console.log(`${err}`)
    }
}

const createItemReq = async (req, res) => {
    
    try {

        //console.log(req.body)

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

    
       const userStats = await UserStats.findOne({ user: userProfile.user });

        if (userStats) {
            userStats.itemsAdded += quantity;
            userStats.points += quantity * 10;

            await userStats.save();
        } else {
            await UserStats.create({
                user: userProfile.user,
                itemsAdded: quantity,
                points: quantity * 10
            });
        }

        let coupon=null;

        if(userStats.points>=500){

                const couponId =
                    "CC-" + crypto.randomBytes(2).toString("hex").toUpperCase();

                coupon=await CouponSchema.create({
                user:user,
                discount:20,
                isUsed:false,
                code:couponId
            })

            userStats.points -= 500;

            await userStats.save();

            }

         

        
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
        /*

        const io=getIO()

        io.to(`admin_${adminId}`).emit("newItemRequest" , {

            message:"new item req received",
            item


        })
            */

        res.status(201).json({
            message: "Item request created",
            trackingId: item.trackingId,
            item,
            coupon:coupon
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllUserItems=async(req,res)=>{

    try{
        const user=req.user.userId;

        const userProfile=await UserDetails.findOne({user:user})

        const {status}=req.query;

        const filter={
            user:userProfile._id
        }

        if(status){
            filter.status=status
        }

        const items=await Item.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            message:"all items rendered",
            items
        })
    }
    catch(err){
        console.log(`${err}`)
    }
}
/*
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
*/

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


const analyzeWasteImage = async (req, res) => {
    try {
        const image = req.file;

        if (!image) {
            return res.status(400).json({
                message: "Image is required"
            });
        }

        const result = await analyzeImage(
            image.buffer,
            image.mimetype
        );

        res.status(200).json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to analyze image"
        });
    }
};



module.exports={createItemReq ,  getItemById  , analyzeWasteImage , getUserStats , getAllUserItems}