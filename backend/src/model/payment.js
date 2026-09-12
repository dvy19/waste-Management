const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    razorpayOrderId: {
        type: String,
        required: true
    },

    razorpayPaymentId: {
        type: String
    },

    razorpaySignature: {
        type: String
    },

    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);