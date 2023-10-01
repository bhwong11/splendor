const gameActions =async ({
  io,
  socket,
  activeRooms
})=>{
  socket.on('clear-user',obj=>{
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    if(!user) return
    user.tokens={
        white:0,
        blue:0,
        green:0,
        red:0,
        black:0,
        gold: 0
      }
    user.cards=[],
    user.reservedCards=[],
    user.nobles=[]
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
  })

  socket.on('update-tokens',(obj)=>{
    console.log('update-tokens')
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    user.tokens = obj?.userTokens
    activeRooms[obj?.room].board.tokens = obj.boardTokens
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
    io.sockets.in(obj?.room).emit('token-taken',obj.boardTokens)
  })

  socket.on('update-cards',(obj)=>{
    console.log('update-cards')
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    if(obj?.addToUser){
      user.cards.push(obj?.newCard)
    }
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
    user.reservedCards?.push(obj?.card)
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
  })

  socket.on('buy-reserve-card',(obj)=>{
    console.log('buy-reserve-card')
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    user.reservedCards= user.reservedCards.filter(c=>c.id!==obj.card)
    user.cards.push(obj?.card)
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
  })
  socket.on('noble-change',(obj)=>{
    console.log('noble-change')
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    user.nobles= obj?.userNobles
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
    io.sockets.in(obj?.room).emit('noble-change',obj)
  })
  

}

export default gameActions