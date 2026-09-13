const express = require("express");

const router = express.Router();

const authMiddleware=require('../middleware/authMiddleware')

const {
    register,
    login,
    createProfile,
    getProfile
} = require("../controllers/UserControllers");


const upload=require('../middleware/upload')



router.post("/register", register);

router.post("/login", login);

router.post("/create-profile", upload.single("profile"), authMiddleware , createProfile);
router.get('/get-profile' , authMiddleware , getProfile)

module.exports = router;