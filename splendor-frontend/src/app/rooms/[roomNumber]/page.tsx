import CreateUser from "@/app/(components)/CreateUser"
import UpdateUser from "@/app/(components)/UpdateUser"
import { getRoom } from "@/api"
import { lemon,noto_emoji } from "@/app/layout"


const RoomPage = async ({params})=>{
  const room = await getRoom({roomNumber:params.roomNumber,revalidateSeconds:3600})

  return (
      <div className="
        flex
        flex-col
        items-center
        pt-5
        border-4
        rounded-lg
        border-cyan-500
        bg-gradient-to-b
        from-cyan-200
        to-white
        h-screen
      ">
          <h1 className={lemon.className}>
            New Room: {room.roomNumber} <span className={noto_emoji.className}>🧋</span>
          </h1>
          <CreateUser existingRoomNumber={room.roomNumber} className="pt-5"/>
          <UpdateUser existingRoomNumber={room.roomNumber} className="pt-5"/>
      </div>
  )
}

export default RoomPage