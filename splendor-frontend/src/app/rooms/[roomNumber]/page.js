import CreateUser from "@/app/(components)/CreateUser"
import UpdateUser from "@/app/(components)/UpdateUser"
import { getRoom } from "@/api"


const RoomPage = async ({params})=>{
  console.log(params.roomNumber)
  const room = await getRoom()

  return (
      <div>
          <h1>Room</h1>
          <h3>{room.roomNumber}</h3>
      </div>
  )
}

export default RoomPage