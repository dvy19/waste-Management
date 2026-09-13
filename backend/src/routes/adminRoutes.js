const express = require("express");

const router = express.Router();

const {createCentres , getCentres , getCentreById, createItem , getSalesItems}=require('../controllers/AdminControllers');

const upload=require('../middleware/upload')

router.post('/create-centre' , upload.single("image") , createCentres)
router.get('/get-centres' , getCentres)

router.post('/create-item' , upload.single("image") , createItem)
router.get('/get-sales-items' , getSalesItems)
router.get('/get-single-centre/:id' , getCentreById)

module.exports=router