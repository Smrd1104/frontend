const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new Error("Email and password are required.");

        const user = await userModel.findOne({ email });
        if (!user) throw new Error("User not found.");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Incorrect password.",
                success: false,
                error: true
            });
        }

        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: "8h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 8 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful.",
            success: true,
            error: false,
            user: { _id: user._id, email: user.email }
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
            error: true
        });
    }
}

module.exports = userSignInController;



// const bcrypt = require("bcryptjs");
// const userModel = require("../../models/userModel");
// const jwt = require('jsonwebtoken');

// async function userSignInController(req, res) {
//     try {
//         const { email, password } = req.body;

//         if (!email) {
//             throw new Error("Please provide email");
//         }
//         if (!password) {
//             throw new Error("Please provide password");
//         }

//         const user = await userModel.findOne({ email });
//         if (!user) {
//             throw new Error("User not found");
//         }

//         const checkPassword = await bcrypt.compare(password, user.password);
//         console.log("checkPassword", checkPassword);

//         if (checkPassword) {
//             const tokenData = {
//                 _id: user.id,
//                 email: user.email,
//             }
//             const token = await jwt.sign(
//                 tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });
//             const tokenOption = {
//                 httpOnly: true,
//                 secure: true,
//             }
//             // Successful login
//             res.cookie("token", token, tokenOption).status(200).json({
//                 message: "Login successful",
//                 error: false,
//                 success: true,
//                 data: token,
//             });
//         } else {
//             throw new Error("Please check password");

//         }



//     } catch (err) {
//         res.json({
//             message: err.message || err,
//             error: true,
//             success: false,
//         });
//     }
// }

// module.exports = userSignInController;
