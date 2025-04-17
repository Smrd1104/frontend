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











// const jwt = require('jsonwebtoken');

// async function authToken(req, res, next) {

//     try {
//         const token = req.cookies?.token

//         console.log('token', token);

//         if (!token) {
//             return res.status(200).json({
//                 message: "please login ...",
//                 error: true,
//                 success: false,
//             })

//         }

//         jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
//             console.log(err)
//             console.log("decoded", decoded) // bar

//             if (err) {
//                 console.log("error auth", err)
//             }

//             req.userId = decoded?._id

//             next()

//         });

//         console.log('token', token);

//     } catch (err) {

//         res.status(400).json({
//             message: err.message || err,
//             data: [],
//             error: true,
//             success: false,
//         })

//     }
// }

// module.exports = authToken