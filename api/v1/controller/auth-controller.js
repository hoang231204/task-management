const User = require('../model/user-model');
const Session = require('../model/session-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL = '14d'
module.exports.register = async (req, res) =>{
    try{
        const { username, fullName, email, password } = req.body;
        //KIỂM TRA TỒN TẠI
        const existingUser = await User.findOne({ username })
        if(existingUser){
            return res.status(400).json({ message: 'Username already exists' })
        }
        //MÃ HÓA MẬT KHẨU
        const hashedPassword = await bcrypt.hash(password, 10)
        //TẠO USER MỚI
        const newUser = new User({
            username: username,
            fullName: fullName,
            email: email,
            hashedPassword: hashedPassword
        })
        await newUser.save()
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message })
    }
}