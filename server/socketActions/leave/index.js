const leaveActions =async ({
  io,
  socket,
  activeRooms
})=>{
  socket.on('disconnecting', () => {
    console.log('disconnecting',socket.id);
    console.log('disconnecting room',socket.rooms);
    console.log(socket.rooms);
    const [socketId,room]=socket.rooms
    if(activeRooms[room]){
      activeRooms[room].users=activeRooms[room]?.users?.map((user)=>(
        user.socketId===socketId?{
          ...user,
          active:false
        }:{
          ...user
        }
      ))
    }
    io.sockets.in(room).emit('user-left',activeRooms[room])
  });
}

export default leaveActions