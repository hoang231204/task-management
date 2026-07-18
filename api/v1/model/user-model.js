const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: { type: String },
    avatarId: { type: String },
    bio: {
        type: String,
        maxlength: 500
    },
    phone: {
        type: String,
        unique: true,
        sparse: true
    },
    deleted:{
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: {
        type: Date,
        expires: 300 
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;