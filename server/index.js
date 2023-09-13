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
io.on('connection', async (socket) => {
  console.log('a user connected');

  // console.log('res',results)
  //dynamically generate room value
  socket.on('join-room',(obj)=>{
    console.log('join room')
    if(obj?.room){
      socket.join(obj?.room)
    }
  })
    //test
  let collection = db.collection("posts");
  let results = await collection.aggregate([
    {"$project": {"author": 1, "title": 1, "tags": 1, "date": 1}},
    {"$sort": {"date": -1}},
    {"$limit": 3}
  ]).toArray();
  socket.on("send-message",(obj)=>{
    console.log('send',obj)
    // io.emit('receive-message',obj)
    io.sockets.in('room-1').emit('receive-message',obj)
    // socket.to("room-1").emit('receive-message',obj)
  })
});


// start the Express server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});