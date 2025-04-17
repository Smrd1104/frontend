const userLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        return res.status(200).json({
            message: "Logout successful.",
            success: true,
            error: false
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Something went wrong.",
            success: false,
            error: true
        });
    }
};

module.exports = userLogout;
































// async function userLogout(req, res) {
//     try {
//         res.clearCookie("token") // ✅ Fixed here

//         return res.status(200).json({
//             message: "Logout successfully",
//             error: false,
//             success: true,
//             data: []
//         });
//     } catch (err) {
//         res.json({
//             message: err.message || err,
//             error: true,
//             success: false,
//         });
//     }
// }

// module.exports = userLogout
