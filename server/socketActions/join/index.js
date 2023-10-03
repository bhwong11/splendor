import RoomModel from "../../models/RoomModel.js"

const userLimit = 4

const emptyUserAssets = {
  tokens:{
    white:0,
    blue:0,
    green:0,
    red:0,
    black:0,
    gold: 0
  },
  cards:[],
  reservedCards:[],
  nobles:[]
}

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
    if((activeRooms[obj?.room]?.users?.length || 0) > userLimit){
      io.to(socket.id).emit('load-error',{
        message:'room is full'
      })
      return
    }

    if(!roomInDB){
      io.to(socket.id).emit('load-error',{
        message:'room not found'
      })
      return
    }

    const existingUser = activeRooms[obj?.room]?.users?.find(user=>user.username===obj.username)

    if(existingUser){
      if(existingUser.active){
        io.to(socket.id).emit('load-error',{
          message:'user already exist'
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

        activeRooms[obj?.room] = {
          users:[]
        }
      }
      if(!existingUser){
        console.log('no existon',activeRooms[obj?.room])
        activeRooms[obj?.room].users?.push({
          username:obj?.username,
          socketId:socket.id,
          active:true,
          ...emptyUserAssets
        })
      }
      console.log('active rooms',activeRooms)
      io.sockets.in(obj?.room).emit('user-joined',activeRooms[obj?.room])
      if(activeRooms[obj?.room].gameActive){
        io.sockets.in(obj?.room).emit('game-board',activeRooms[obj?.room].board)
        io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room].users)
        io.sockets.in(obj?.room).emit('turn-update',{
          turn:activeRooms[obj?.room].turn,
          turnPlayer: activeRooms[obj?.room].turnPlayer
        })
      }
    }
    console.log('rooms',socket.rooms)
  })
}

export default joinActions