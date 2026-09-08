const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Get token from HTTP-only cookie

        //console.log(req.cookies)
        const token = req.cookies.accessToken;

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

        console.log(decoded);

        // Attach decoded user information to request
        req.user = decoded;

        next();

    } 
    catch (err) {
        
        console.log("AUTH ERROR:", err.name);
        console.log("AUTH ERROR MESSAGE:", err.message);
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;