const asyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const registerUser = asyncHandler(async (req,res) =>{
    const {name,email,password,pic} = req.body;
    if(!name || !email || !password){
        res.send(404);
        throw new Error('Please fill all Fields')
    }
    const userExist = await User.findOne({email})
    if(userExist){
        res.send(404);
        throw new Error('User already exist')
    }
    const user = await User.create({
        name,email,password,pic
    })
    if(user){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token:generateToken(user._id)
        });
    }else{
        res.send(404);
        throw new Error('Failed to create user')
    }
})

const authUser = asyncHandler( async (req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email})
    if(user){
        if(await user.matchPassword(password)){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token:generateToken(user._id)
            });
        }else{
            res.status(404).send({msg:'Password is incorrect'})
        }
    }else{
        res.status(404).send({msg: 'User not found'});
    }
})

const allUsers = asyncHandler(async (req,res)=>{
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    }:{}
    
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}})
    res.send(users)
})

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
}
module.exports = {registerUser,authUser,allUsers}