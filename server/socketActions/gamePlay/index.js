const gameActions =async ({
  io,
  socket,
  activeRooms
})=>{
  socket.on('update-tokens',(obj)=>{
    console.log('update-tokens')
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    user.tokens = obj?.userTokens
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
    io.sockets.in(obj?.room).emit('token-taken',obj.boardTokens)
  })

  socket.on('update-cards',(obj)=>{
    console.log('update-cards')
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    user.cards = obj?.newCard
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
    io.sockets.in(obj?.room).emit('board-cards-update',obj)
  })

}

export default gameActions