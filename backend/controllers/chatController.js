const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel.js');
const User = require("../models/userModel.js");
const accessChat = asyncHandler(async (req,res)=>{
    const {userId} = req.body;
    if(!userId){
        res.status(404).send({msg:"UserId not exist in params"})
    }
    var isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate('users','-password').populate('latestMessage');
    isChat = await User.populate(isChat,{
        path:'latestMessage.sender',
        select:'name email pic',
    })
    if(isChat.length > 0){
        res.send(isChat[0])
    }else{
        try {
            var chatData = await Chat.create({
                isGroupChat:false,
                chatName:'sender',
                users:[req.user._id,userId]
            })
            const findChat = await Chat.findOne({_id:chatData.id}).populate('users','-password')
            res.status(200).send(findChat)   
        } catch (error) {
            res.status(400)
            throw new Error(error)
        }
    }
})
const fetchChats = asyncHandler(async (req,res) =>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate('users','-password')
        .populate('groupAdmin','-password')
        .populate('latestMessage')
        .sort({updatedAt: -1})
        .then(async (results) => {
             results = await User.populate(results,{
                path:'latestMessage.sender',
                select:'name email pic',
            })
            res.status(200)
            res.send(results)
        })
    } catch (error) {
        res.status(404)
        throw new Error(error)
    }
})
const groupChat = asyncHandler(async (req,res)=>{
    if(!req.body.name || !req.body.users){
        res.status(404).send("Please fill all the fields")
    }
    var users = JSON.parse(req.body.users)
    if(users.length < 2){
        res.status(404).send("Please add more than two user")
    }
    users.push(req.user)
    try {
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        });
        const findGroupChat = await Chat.find({_id: groupChat._id})
        .populate('users','-password')
        .populate('groupAdmin','-password');
        res.status(200).send(findGroupChat)
    } catch (error) {
        res.status(404)
        throw new Error(error)
    }

})
const renameGroup = asyncHandler(async (req, res) => {
    const {chatId , chatName} = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId,{
        chatName:chatName
    },{new:true})
    .populate('users','-password')
    .populate('groupAdmin','-password');
    if(updatedChat){
        res.status(200).send(updatedChat);
    }else{
        res.status(404).send({msg:"Error while updating group chat name"})
    }
})
const addToGroup = asyncHandler(async (req,res) =>{
    const {chatId,userId} = req.body
    const updatedChat = await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId}
    },{new:true})
    .populate('users','-password')
    .populate('groupAdmin','-password');
    if(updatedChat){
        res.status(200).send(updatedChat);
    }else{
        res.status(404).send({msg:"Error while updating group chat name"})
    }
})
const removeFromGroup = asyncHandler(async (req,res) =>{
    const {chatId,userId} = req.body
    const updatedChat = await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId}
    },{new:true})
    .populate('users','-password')
    .populate('groupAdmin','-password');
    if(updatedChat){
        res.status(200).send(updatedChat);
    }else{
        res.status(404).send({msg:"Error while updating group chat name"})
    }
})
module.exports = {accessChat,fetchChats,groupChat,renameGroup,addToGroup,removeFromGroup}