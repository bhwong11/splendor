import CreateUser from "@/app/(components)/CreateUser"
import UpdateUser from "@/app/(components)/UpdateUser"

const RoomPage = async ({params})=>{
  console.log(params.roomNumber)

  return (
      <div>
          <h1>Room</h1>
          <h3>{params.roomNumber}</h3>
          <p>{roomData.body}</p>

      </div>
  )
}

export default RoomPage