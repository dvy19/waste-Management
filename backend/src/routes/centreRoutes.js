const express=require("express")

const router=express.Router()

const {centreDetails , getCentreById , getCentres}=require("../controllers/centreControllers")
const authMiddleware=require("../middleware/authMiddleware")

const upload=require("../middleware/upload")

router.post("/centre-create" , upload.single("image"),  authMiddleware, centreDetails)

router.get("/get-centres" , getCentres)

router.get("/get-single-centre/:id" , getCentreById)

module.exports=router