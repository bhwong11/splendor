const turnActions =async ({
  io,
  socket,
  activeRooms
})=>{
  socket.on('start-game',(obj)=>{
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
    console.log('start-game',obj,activeRooms[obj?.room])
    if(!activeRooms[obj?.room]){
      io.to(socket.id).emit('load-error',{
        message:'room-does-not-exist'
      })
    }
    activeRooms[obj?.room].gameOver = false
    activeRooms[obj?.room].board = obj.board
    activeRooms[obj?.room].turnPlayer = activeRooms[obj?.room]?.users?.[0]
    activeRooms[obj?.room].turn = 1
    activeRooms[obj?.room].gameActive = true
    activeRooms[obj?.room].users= activeRooms[obj?.room].users.map((user)=>({
      ...user,
      ...emptyUserAssets
    }))
    io.sockets.in(obj?.room).emit('game-board',obj.board)
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room].users)
    io.sockets.in(obj?.room).emit('turn-update',{
      turn:1,
      turnPlayer: activeRooms[obj?.room].turnPlayer
    })
  })
  socket.on('next-turn',(obj)=>{
    if(!activeRooms[obj?.room]){
      io.to(socket.id).emit('load-error',{
        message:'room-does-not-exist'
      })
    }
    const turn = activeRooms[obj?.room].turn
    const players = activeRooms[obj?.room]?.users
    const turnPlayerIndex = (turn) % players.length
    activeRooms[obj?.room].turn+=1
    const turnPlayer = activeRooms[obj?.room]?.users[turnPlayerIndex]
    io.sockets.in(obj?.room).emit('turn-update',{
      turn:activeRooms[obj?.room].turn,
      turnPlayer
    })
  })
}

export default turnActions