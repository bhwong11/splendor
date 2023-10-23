const getAllRooms = async ()=>{
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/getAll`,
    {cache:'no-store'}
  )
  const allRooms = await res.json()
  return allRooms
}

const AllRooms = async ()=>{
    const allRooms = await getAllRooms()
    console.log('alll',allRooms)
    return (
      <div className="mt-5">
        <h2 className="pb-2">all rooms</h2>
        <div className="all-rooms h-24 overflow-y-scroll border-2 border-cyan-500 p-2 rounded">
          {allRooms?.map(room=>(
            <p key={`room-${room.roomNumber}`}><a href={`/rooms/${room.roomNumber}/`} className="btn-link">
              room number: {room.roomNumber}
            </a></p>
          ))}
        </div>
      </div>
    )
}

export default AllRooms