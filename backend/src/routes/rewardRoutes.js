const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/predict", async (req, res) => {
  try {
    const { category, material, weight_kg, age_years } = req.body;

    console.log(req.body)

    const response = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict`,
      {
        category,
        material,
        weight_kg,
        age_years
      },
      { timeout: 10000 }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "ML prediction error:",
      error.response?.data || error.message
    );

    res.status(502).json({
      message: "Unable to calculate reward points"
    });
  }
});

module.exports = router;