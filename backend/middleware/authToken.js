const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please login.",
                success: false,
                error: true
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Invalid or expired token. Please login again.",
                    success: false,
                    error: true
                });
            }

            req.userId = decoded._id;
            next();
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
            error: true
        });
    }
}

module.exports = authToken;










