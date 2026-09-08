const express = require("express");

const router = express.Router();

const {
    register,
    login,
    createProfile
} = require("../controllers/UserControllers");

router.post("/register", register);

router.post("/login", login);

router.post("/create-profile", createProfile);

module.exports = router;