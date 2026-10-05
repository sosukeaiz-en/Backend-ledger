const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

function registerUser(req, res) {
    const { email, name, password } = req.body;

    const user = new userModel({
        email,
        name,
        password
    });

    user.save()
        .then(() => {
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 3600000
            });

            res.status(201).json({
                message: "User registered successfully",
                token
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err.message
            });
        });
}

module.exports = {
    registerUser
};
