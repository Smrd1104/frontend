async function userLogout(req, res) {
    try {
        res.clearCookie("token") // ✅ Fixed here

        return res.status(200).json({
            message: "Logout successfully",
            error: false,
            success: true,
            data: []
        });
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userLogout
