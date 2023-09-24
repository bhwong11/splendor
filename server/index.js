import express from "express";
import cors from "cors";
import "express-async-errors";
import posts from "./routes/posts.js";
import rooms from "./routes/rooms.js";
import users from "./routes/users.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io"
import db from "./db/conn.js";
import mongoose from "mongoose";
import RoomModel from "./models/RoomModel.js";
import joinActions from "./socketActions/join/index.js";
import leaveActions from "./socketActions/leave/index.js";
import turnActions from "./socketActions/turns/index.js";

dotenv.config();

const mongoString = `${process.env.ATLAS_URI}splendor` || "";

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})

const PORT = process.env.PORT || 5050;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Load the /posts routes
app.use("/api/posts", posts);
app.use("/api/rooms", rooms);
app.use("/api/users", users);

// Global error handling
app.use((err, _req, res, next) => {
  console.log('err',err)
  res.status(500).send("Uh oh! An unexpected error occured.")
})

//connection websocket
const activeRooms = {}
io.on('connection', async (socket) => {
  console.log('a user connected');

  joinActions({
    io,
    socket,
    activeRooms
  })
  turnActions({
    io,
    socket,
    activeRooms
  })
  leaveActions({
    io,
    socket,
    activeRooms
  })

  // console.log('res',results)
  // socket.on('join-room',async (obj)=>{
  //   console.log('join room user',socket.id)
  //   let roomInDB
  //   try{
  //     roomInDB = await RoomModel.findOne({roomNumber:obj?.room})
  //   }catch(err){
  //     console.log('error in room',err)
  //   }
  //   if(!roomInDB){
  //     socket.broadcast.to(socket.id).emit('no-room',{
  //       message:'room not found'
  //     })
  //   }

  //   const existingUser = activeRooms[obj?.room]?.find(user=>user.username===obj.username)

  //   if(existingUser){
  //     socket.broadcast.to(socket.id).emit('user-already-exist',{
  //       message:'user-already-exist'
  //     })
  //     return
  //   }

  //   if(obj?.room){
  //     socket.join(obj?.room)
  //     if(activeRooms[obj?.room]){
  //       activeRooms[obj?.room].push({
  //         username:obj?.username,
  //         socketId:socket.id,
  //         active:true
  //       })
  //     }else{
  //       activeRooms[obj?.room] = []
  //     }
  //     io.sockets.in(obj?.room).emit('user-joined',activeRooms[obj?.room])
  //   }
  //   console.log('rooms',socket.rooms)
  // })
  // socket.on("send-message",(obj)=>{
  //   console.log('send',obj)
  //   // io.emit('receive-message',obj)
  //   io.sockets.in('room-1').emit('receive-message',obj)
  //   // socket.to("room-1").emit('receive-message',obj)
  // })


  // socket.on('disconnecting', () => {
  //   console.log('disconnecting',socket.id);
  //   console.log('disconnecting room',socket.rooms);
  //   console.log(socket.rooms);
  //   const [socketId,room]=socket.rooms
  //   if(activeRooms[room]){
  //     activeRooms[room]=activeRooms[room]?.map((user)=>(
  //       user.socketId===socketId?{
  //         ...user,
  //         active:false
  //       }:{
  //         ...user
  //       }
  //     ))
  //   }
  //   io.sockets.in(room).emit('user-left',activeRooms[room])
  // });
  socket.on('disconnect', () => {
    console.log('disconnecting ID',socket.id);
    // io.sockets.in(obj?.room).emit('user-joined',obj)
  });
});


// start the Express server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});