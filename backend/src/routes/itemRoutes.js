
const express=require("express")

const router=express.Router()

const upload=require('../middleware/upload')

const {createItemReq , getItemReq,getAllUserItems , getItemById , analyzeWasteImage , getUserStats}=require('../controllers/ItemController')
const authMiddleware = require("../middleware/authMiddleware")

router.post('/create-item' , upload.single("image") , authMiddleware , createItemReq)

router.get('/get-items' , authMiddleware, getItemReq)

router.get('/get-user-items',authMiddleware, getAllUserItems)

router.post('/get-item-id/:trackingId' ,authMiddleware, getItemById)

router.get('/get-user-stats' , authMiddleware,getUserStats)

router.post(
    "/analyze-waste",
    upload.single("image"),
    analyzeWasteImage
);

module.exports=router

