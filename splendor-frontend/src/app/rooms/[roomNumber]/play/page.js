'use client';

const RoomPage = async ({params})=>{
  console.log(params.roomNumber)

  return (
      <div>
          <h1>Room</h1>
          <h3>{params.roomNumber}</h3>
      </div>
  )
}

export default RoomPage