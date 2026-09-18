const express = require("express");

const router = express.Router();

const authMiddleware=require('../middleware/authMiddleware')

const {
    register,
    login,
    createProfile,
    getProfile,
    createOrder,
    getUserOrders,

    getOrderStats
} = require("../controllers/UserControllers");


const upload=require('../middleware/upload')



router.post("/register", register);

router.post("/login", login);

router.post("/create-profile", upload.single("profile"), authMiddleware , createProfile);

router.get('/get-profile' , authMiddleware , getProfile)

router.post('/create-order' , authMiddleware , createOrder)

router.get('/get-user-orders' , authMiddleware , getUserOrders)

router.get('/order-stats' , authMiddleware, getOrderStats)

module.exports = router;