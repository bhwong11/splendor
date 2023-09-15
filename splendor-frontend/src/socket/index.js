import { io } from "socket.io-client";

const socketInitializeRoom = async (room,username) =>{
  const socket = io(process.env.NEXT_PUBLIC_API_URL)
  socket.on('connect',()=>{
    console.log('init!',socket.id)
  })
  socket.emit('join-room',{
    room,
    username
  })
  socket.on('disconnect', () => {
    socket.emit('disconnect-user', username);
  });
  return socket
}

export {
  socketInitializeRoom
}