const User = require('../model/User');
const UserDetails = require('../model/User');


const firebaseLogin = async (req, res) => {
    try {
        const firebaseUid = req.firebaseUser.uid;
        const phoneNumber = req.firebaseUser.phone_number;
        const userId = req.user.userId;

        const userDetails = await UserDetails.findOneAndUpdate(
            { user: userId },
            {
                firebaseUid,
                phoneNumber
            },
            { new: true }
        );

        if (!userDetails) {
            return res.status(404).json({
                message: "User profile not found"
            });
        }

        return res.status(200).json({
            message: "Phone verified successfully",
            phoneNumber: userDetails.phoneNumber
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Phone verification failed"
        });
    }
};

module.exports=firebaseLogin