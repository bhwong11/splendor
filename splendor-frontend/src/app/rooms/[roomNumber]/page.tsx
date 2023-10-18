import CreateUser from "@/app/(components)/CreateUser"
import UpdateUser from "@/app/(components)/UpdateUser"
import { getRoom } from "@/api"
import { lemon } from "@/app/layout"


const RoomPage = async ({params})=>{
  console.log(params.roomNumber)
  const room = await getRoom({roomNumber:params.roomNumber,revalidateSeconds:3600})

  return (
      <div className="
        flex
        flex-col
        items-center
        pt-5
        border-4
        rounded-lg
        border-pink-700
        bg-gradient-to-b
        from-pink-200
        to-white
        h-screen
      ">
          <h1 className={lemon.className}>New Room: {room.roomNumber}</h1>
          <CreateUser existingRoomNumber={room.roomNumber} className="pt-5"/>
          <UpdateUser existingRoomNumber={room.roomNumber} className="pt-5"/>
      </div>
  )
}

export default RoomPage