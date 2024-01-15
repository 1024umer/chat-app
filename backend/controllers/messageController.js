const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel.js');
const User = require("../models/userModel.js");
const Message = require("../models/messageModel.js");

const sendMessage = asyncHandler(async (req,res)=>{
    const {content, chatId} = req.body
    if(!content || !chatId){
        res.status(404)
        throw new Error('Invalid data passed to request')
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
    try {
        var message = await Message.create(newMessage);
        message = await message.populate('sender','name pic');
        message = await message.populate('chat');
        message = await User.populate(message,{
            path:'chat.users',
            select:'name pic email',
        })
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message,
        })
        res.send(message);
    } catch (error) {
        res.status(400)
        throw new Error(error)        
    }
})
const allMessages = asyncHandler(async (req,res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId}).populate('sender','name pic email').populate('chat');
        res.json(messages)
    } catch (error) {
        res.status(404)
        throw new Error(error)
    }
})
module.exports = {sendMessage,allMessages}