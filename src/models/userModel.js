const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "Email is required for creating a user"],
        trim: true,
        lowercase: true,
        unique: true
    },

    name: {
        type: String,
        required: [true, "Name is required for creating a user"],
        trim: true
    },

    password: {
        type: String,
        required: [true, "Password is required for creating a user"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    }

}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {

    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {

    return await bcrypt.compare(
        enteredPassword,
        this.password
    );

};

const User = mongoose.model('User', userSchema);

module.exports = User;