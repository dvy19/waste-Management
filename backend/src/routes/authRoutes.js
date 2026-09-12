const express = require("express");

const router = express.Router();

const authMiddleware=require('../middleware/authMiddleware')

const {
    register,
    login,
    createProfile
} = require("../controllers/UserControllers");

router.post("/register", register);

router.post("/login", login);

router.post("/create-profile", authMiddleware , createProfile);

module.exports = router;