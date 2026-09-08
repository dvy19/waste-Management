
const express=require("express")

const router=express.Router

const {createItemReq , getItemReq , getItemById}=require('../controllers/ItemController')

router.post('/create-item' , createItemReq)

router.get('/get-item' , getItemReq)

router.get('/get-item-id/:trackingId' , getItemById)

module.exports=router

