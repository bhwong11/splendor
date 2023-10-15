import UserModel from "../../models/UserModel.js"

const gameActions =async ({
  io,
  socket,
  activeRooms
})=>{
  socket.on('clear-user',obj=>{
    if(!activeRooms[obj?.room]){
      io.to(socket.id).emit('load-error',{
        message:'room does not exist'
      })
    }
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
    if(!activeRooms[obj?.room]){
      io.to(socket.id).emit('load-error',{
        message:'room-does-not-exist'
      })
    }
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    if(!user) return
    user.tokens = obj?.userTokens
    activeRooms[obj?.room].board.tokens = obj.boardTokens
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
    io.sockets.in(obj?.room).emit('token-taken',obj.boardTokens)
  })

  socket.on('update-cards',(obj)=>{
    console.log('update-cards')
    if(!activeRooms[obj?.room]){
      io.to(socket.id).emit('load-error',{
        message:'room-does-not-exist'
      })
    }
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    if(obj?.addToUser){
      user.cards=[...user.cards,obj?.newCard]
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
    console.log('reserve-card',obj)
    if(!activeRooms[obj?.room]){
      io.to(socket.id).emit('load-error',{
        message:'room-does-not-exist'
      })
    }
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    user.reservedCards=[...user.reservedCards,obj.card]
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
  })

  socket.on('buy-reserve-card',(obj)=>{
    console.log('buy-reserve-card')
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    user.reservedCards= user.reservedCards.filter(c=>c.id!==obj.card.id)
    user.cards=[...user.cards,obj?.newCard]
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
  })

  socket.on('noble-change',(obj)=>{
    console.log('noble-change')
    if(!activeRooms[obj?.room]){
      io.to(socket.id).emit('load-error',{
        message:'room-does-not-exist'
      })
    }
    const user = activeRooms[obj?.room]?.users?.find(user=>user.username===obj?.username)
    user.nobles= obj?.userNobles
    activeRooms[obj?.room].board = {
      ...activeRooms[obj?.room].board,
      nobles:obj.nobles
    }
    io.sockets.in(obj?.room).emit('players-update',activeRooms[obj?.room]?.users)
    io.sockets.in(obj?.room).emit('noble-change',obj)
  })

  socket.on('winner', async (obj)=>{
    console.log('winner',obj)
    if(!activeRooms[obj?.room]?.gameOver){
      activeRooms[obj?.room].gameOver = true
      for(let user of obj.playerPoints){
        console.log('updating',user)
        const udpatedUser = await UserModel.findOneAndUpdate(
          {username:user.username}, 
          { $inc: {
            ...(user.victor?{wins: 1}:{}),
            victoryPoints:user.victoryPoints
          } },
          { new: true }
        )
        console.log('updated',udpatedUser)
      }
    }
  })

}

export default gameActions