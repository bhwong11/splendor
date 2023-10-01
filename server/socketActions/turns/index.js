const turnActions =async ({
  io,
  socket,
  activeRooms
})=>{
  socket.on('start-game',(obj)=>{
    console.log('start-game',obj,activeRooms[obj?.room])
    activeRooms[obj?.room].board = obj.board
    activeRooms[obj?.room].turnPlayer = activeRooms[obj?.room]?.users?.[0]
    activeRooms[obj?.room].turn = 1
    activeRooms[obj?.room].gameActive = true
    io.sockets.in(obj?.room).emit('game-board',obj.board)
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room].users)
    console.log('TURN PLAYER',activeRooms[obj?.room].turnPlayer)
    io.sockets.in(obj?.room).emit('turn-update',{
      turn:0,
      turnPlayer: activeRooms[obj?.room].turnPlayer
    })
  })
  socket.on('next-turn',(obj)=>{
    const turn = activeRooms[obj?.room].turn
    const players = activeRooms[obj?.room]?.users
    const turnPlayerIndex = (turn) % players.length
    activeRooms[obj?.room].turn+=1
    console.log('active room',activeRooms[obj?.room])
    const turnPlayer = activeRooms[obj?.room]?.users[turnPlayerIndex]
    io.sockets.in(obj?.room).emit('turn-update',{
      turn,
      turnPlayer
    })
  })
}

export default turnActions