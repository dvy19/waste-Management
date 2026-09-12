const express = require("express");

const router = express.Router();

const authMiddleware=require('../middleware/authMiddleware')

const {
    register,
    login,
    createProfile,
    getProfile
} = require("../controllers/UserControllers");


const {
    firebaseLogin
} = require("../controllers/firebaseController");

const verifyFirebaseToken = require("../middleware/firebaseAuth");

router.post(
    "/firebase-login",
    authMiddleware,
    verifyFirebaseToken,
    firebaseLogin
);

router.post("/register", register);

router.post("/login", login);

router.post("/create-profile", authMiddleware , createProfile);
router.get('/get-profile' , authMiddleware , getProfile)

module.exports = router;