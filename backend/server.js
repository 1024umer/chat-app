const express = require('express')
const  chats  = require('./data/data')
const connectDB = require('./config/db')
const dotenv = require('dotenv').config()
const colors = require('colors');
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const {notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path'); 
connectDB();

const app = express()

port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
// app.get('/',(req,res)=>{
//     res.send('Api is running')
// })
app.get('/api/chats/:id',(req,res)=>{
    const singleChat = chats.find((c)=>c._id === req.params.id)
    res.send(singleChat)
})

app.use('/api/users',userRoutes)
app.use('/api/chats',chatRoutes)
app.use('/api/messages',messageRoutes)

// Deployement
const __dirname1 = path.resolve();
if(process.env.NODE_ENV == 'production'){
  app.use(express.static(path.join(__dirname1,'frontend/build')))
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname1,'fontend','build','index.html'))
  })
} else{
  app.get('/',(req,res)=>{
    res.send('Api is running successfully')
  })
}
// Deployment end here
app.use(notFound)
app.use(errorHandler)
const server = app.listen(port,console.log(`Server is started on ${port}`.yellow.bold.underline))
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });