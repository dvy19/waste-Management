
const express=require("express")

const router=express.Router()

const upload=require('../middleware/upload')
const authMiddleware=require('../middleware/authMiddleware')

const {createItemReq , getItemReq , getItemById , analyzeWasteImage , getUserStats}=require('../controllers/ItemController')
const authMiddleware = require("../middleware/authMiddleware")

router.post('/create-item' , authMiddleware , createItemReq)

router.get('/get-item' , authMiddleware, getItemReq)

router.get('/get-item-id/:trackingId' ,authMiddleware, getItemById)

router.get('/get-user-stats' , authMiddleware,getUserStats)

router.post(
    "/analyze-waste",
    upload.single("image"),
    analyzeWasteImage
);

module.exports=router

