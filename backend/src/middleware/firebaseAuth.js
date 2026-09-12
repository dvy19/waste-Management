const admin = require("../config/firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Firebase token required",
            });
        }

        const token = authHeader.split("Bearer ")[1];

        const decodedToken = await admin.auth().verifyIdToken(token);

        req.firebaseUser = decodedToken;

        next();

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            message: "Invalid or expired Firebase token",
        });
    }
};

module.exports = verifyFirebaseToken;