const express = require("express");

const router = express.Router();

const {createCentres , getSalesItemById,  getCentres , getCentreById, createItem , getSalesItems}=require('../controllers/AdminControllers');

const {getItemReq}=require('../controllers/ItemController')
const authMiddleware=require('../middleware/authMiddleware')

const upload=require('../middleware/upload')

router.post('/create-centre' , upload.single("image") , createCentres)
router.get('/get-centres' , getCentres)

router.post('/get-sales-item/:id' , getSalesItemById)

router.get('/get-items' , authMiddleware, getItemReq)


router.post('/create-item' , upload.single("image") , createItem)
router.get('/get-sales-items' , getSalesItems)
router.get('/get-single-centre/:id' , getCentreById)

module.exports=router