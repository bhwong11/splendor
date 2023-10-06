import CreateUser from "@/app/(components)/CreateUser"
import UpdateUser from "@/app/(components)/UpdateUser"
import { getRoom } from "@/api"


const RoomPage = async ({params})=>{
  console.log(params.roomNumber)
  const room = await getRoom({roomNumber:params.roomNumber,revalidateSeconds:3600})

  return (
      <div>
          <h1>New Room</h1>
          <h3>{room.roomNumber}</h3>
          <CreateUser existingRoomNumber={room.roomNumber}/>
          <UpdateUser existingRoomNumber={room.roomNumber}/>
      </div>
  )
}

export default RoomPage