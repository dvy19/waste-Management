const Item=require("../model/Item")
const { UserDetails , UserStats , CouponSchema  , User} = require("../model/User")
const { analyzeImage } = require("../service/geminiService");

const cloudinary=require('../config/cloudinary')


const {redisClient} = require('../config/redis')

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

         let image = null;
                if (req.file) {
                    image = await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            {
                                folder: "ngo-app/item-image",
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
  
        const trackingId =
            "WM-" + crypto.randomBytes(4).toString("hex").toUpperCase();

        const item = await Item.create({
            user: userProfile._id,
            trackingId,
            name,
            category,
            quantity,
            weight,
            image:image,
            status: "submitted"
        });
        

        const io=getIO()

        const admin = await User.findOne({ role: "admin" });

        if (admin) {
            io.to(`admin_${admin._id}`).emit("newItemRequest", {
                message: "new item req received",
                item
            });
        }

        res.status(201).json({
            message: "Item request created",
            trackingId: item.trackingId,
            item,
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

const getItemReq=async(req,res)=>{

    try{

        const item=await Item.find().sort({ createdAt: -1 })

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

        const redisKey = `item:${trackingId}`;

        // 1. Check Redis first
        const cachedItem = await redisClient.get(redisKey);

         if (cachedItem) {

            console.log("Item fetched from Redis");

            return res.status(200).json({
                message: "your item retrieved",
                item: JSON.parse(cachedItem)
            });
        }

        console.log("Item fetched from MongoDB");



        //console.log(trackingId)

        const item=await Item.findOne({trackingId})

         await redisClient.set(
            redisKey,
            JSON.stringify(item),
            {
                EX: 600
            }
        );

        //console.log(item)

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

const createCoupons=async(req,res)=>{

    try{

        const user=req.user.userId;

        const userProfile=await  UserDetails.findOne({user})

        const userStats = await UserStats.findOne({ user: userProfile.user });

        let coupon=null;
        if (userStats.points>=500) {

            
            const code =
                "WCC-" + crypto.randomBytes(2).toString("hex").toUpperCase();
            
            coupon=await CouponSchema.create({
                user:userProfile._id,
                discount:20,
                expiredAt: new Date("2026-12-31"),
                isUsed:false,
                code:code
            })

            userStats.points -= 500;
            await userStats.save();
        }
        else{
            return res.status(400).json({
                message:"you must have 500 points to unlock the coupon"
            })
        }

        res.status(200).json({
            message:"coupon created",
            coupon
        })
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getUserCoupons=async(req,res)=>{

    try{
        const user=req.user.userId

        const userProfile=await UserDetails.findOne({user})


        const coupons=await CouponSchema.find({user:userProfile._id})


        res.status(200).json({
            message:"al couponds rendered",
            coupons
        })
    }
     catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
}
const checkCoupon = async (req, res) => {
    try {
        const { code } = req.body;

        const coupon = await CouponSchema.findOne({ code });

        if (!coupon) {
            return res.status(404).json({
                message: "Invalid coupon"
            });
        }

        return res.status(200).json({
            message: "Coupon is valid",
            coupon,
            valid:true
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports={
    createItemReq ,
    getUserCoupons,
    createCoupons, 
    getItemById  , 
    analyzeWasteImage , 
    getUserStats , 
    getAllUserItems , 
    getItemReq , 
    checkCoupon
}