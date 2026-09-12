const razorpay = require("../config/razorpay");
const crypto=require("crypto")
const createOrder = async (req, res) => {
    try {

        const { amount } = req.body;

        const options = {
            amount: amount * 100, // INR → paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to create Razorpay order"
        });
    }
};

const verifyPayment = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Payment is authentic

        // TODO:
        // Save payment in MongoDB
        // Update donation/order status
        // Give points if required

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment
};