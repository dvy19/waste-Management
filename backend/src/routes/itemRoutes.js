
const express=require("express")

const router=express.Router()

const upload=require('../middleware/upload')

const {createItemReq , getItemReq , getItemById , analyzeWasteImage , getUserStats}=require('../controllers/ItemController')

router.post('/create-item' , createItemReq)

router.get('/get-item' , getItemReq)

router.get('/get-item-id/:trackingId' , getItemById)

router.get('/get-user-stats' , getUserStats)

router.post(
    "/analyze-waste",
    upload.single("image"),
    analyzeWasteImage
);

module.exports=router

