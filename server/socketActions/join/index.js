import RoomModel from "../../models/RoomModel.js"

const joinActions =async ({
  io,
  socket,
  activeRooms
})=>{
  socket.on('join-room',async (obj)=>{
    console.log('join room user',socket.id,obj)
    let roomInDB
    try{
      roomInDB = await RoomModel.findOne({roomNumber:obj?.room})
    }catch(err){
      console.log('error in room',err)
    }
    if(!roomInDB){
      socket.broadcast.to(socket.id).emit('no-room',{
        message:'room not found'
      })
    }

    const existingUser = activeRooms[obj?.room]?.find(user=>user.username===obj.username)

    if(existingUser){
      if(existingUser.active){
        socket.broadcast.to(socket.id).emit('load-error',{
          message:'user-already-exist'
        })
        return
      }
      existingUser.socketId = socket.id
      existingUser.active = true
    }

    if(obj?.room && obj?.username){
      console.log('user',obj)
      socket.join(obj?.room)
      if(!activeRooms[obj?.room]){
        activeRooms[obj?.room] = []
      }
      if(!existingUser){
        activeRooms[obj?.room].push({
          username:obj?.username,
          socketId:socket.id,
          active:true
        })
      }
      console.log('active rooms',activeRooms)
      io.sockets.in(obj?.room).emit('user-joined',activeRooms[obj?.room])
    }
    console.log('rooms',socket.rooms)
  })
}

export default joinActions