const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED:", decoded);

        // Attach user information
        req.user = decoded;

        next();

    } catch (err) {
        console.log("AUTH ERROR:", err.name);
        console.log("AUTH ERROR MESSAGE:", err.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;