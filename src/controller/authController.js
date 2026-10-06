const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
    try {
        const { email, name, password } = req.body;

        const user = new userModel({
            email,
            name,
            password
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "default_secret",
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
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000
        });

        res.status(200).json({
            message: "User logged in successfully",
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    registerUser,
    loginUser
};
