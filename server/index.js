import express from "express";
import cors from "cors";
import "express-async-errors";
import rooms from "./routes/rooms.js";
import users from "./routes/users.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io"
import mongoose from "mongoose";
import joinActions from "./socketActions/join/index.js";
import leaveActions from "./socketActions/leave/index.js";
import turnActions from "./socketActions/turns/index.js";
import gameActions from "./socketActions/gamePlay/index.js";

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
app.use("/api/rooms", rooms);
app.use("/api/users", users);

// Global error handling
app.use((err, _req, res) => {
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
  gameActions({
    io,
    socket,
    activeRooms
  })
  leaveActions({
    io,
    socket,
    activeRooms
  })

  socket.on('disconnect', () => {
    console.log('disconnecting ID',socket.id);
  });
});


// start the Express server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});