
const express=require("express")

const router=express.Router()

const upload=require('../middleware/upload')

const {createItemReq , getUserCoupons ,getItemReq,getAllUserItems , getItemById , analyzeWasteImage , getUserStats , createCoupons , checkCoupon}=require('../controllers/ItemController')
const authMiddleware = require("../middleware/authMiddleware")

router.post('/create-item' , upload.single("image") , authMiddleware , createItemReq)

router.get('/get-items' , authMiddleware, getItemReq)

router.get('/get-user-items',authMiddleware, getAllUserItems)

router.post('/create-coupons' , authMiddleware , createCoupons)
router.get('/get-user-coupons'  , authMiddleware , getUserCoupons)

router.post('/check-coupon' , authMiddleware , checkCoupon)

router.post('/get-item-id/:trackingId' ,authMiddleware, getItemById)

router.get('/get-user-stats' , authMiddleware,getUserStats)

router.post(
    "/analyze-waste",
    upload.single("image"),
    analyzeWasteImage
);

module.exports=router

