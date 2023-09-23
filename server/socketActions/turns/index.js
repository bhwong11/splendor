const turnActions =async ({
  io,
  socket,
  activeRooms
})=>{
  socket.on('start-game',(obj)=>{
    activeRooms[obj?.room]['board']=obj.board
    io.sockets.in(obj?.room).emit('game-board',obj.board)
  })
}

export default joinActions