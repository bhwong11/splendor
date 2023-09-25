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
    user.cards.push(obj?.newCard)
    activeRooms[obj?.room].board = {
      ...activeRooms[obj?.room].board,
      cardsLv1:obj.cardsLv1,
      cardsLv2:obj.cardsLv2,
      cardsLv3:obj.cardsLv3,
    }
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
    io.sockets.in(obj?.room).emit('board-cards-update',obj)
  })

  socket.on('reserve-card',(obj)=>{
    console.log('reserve-card')
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    user.reserveCards.push(obj?.card)
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
  })

  socket.on('buy-reserve-card',(obj)=>{
    console.log('buy-reserve-card')
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    user.reserveCards= user.reserveCards.filter(c=>c.id!==obj.card)
    user.cards.push(obj?.card)
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
  })

}

export default gameActions