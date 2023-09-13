import UserInfo from '../../(components)/userInfo'

const getRoomData = async (id)=>{
    const res = await fetch(
      `http://localhost:5050/api/rooms/${id}`,
      {cache:'no-store'}
    )
    const roomData = await res.json()
    return roomData
}

const RoomPage = async ({params})=>{
    const roomData = await getRoomData(params.id)

    return (
        <div>
            <h1>note page</h1>
            hello
            <h3>{roomData.title}</h3>
            <p>{roomData.body}</p>
            {roomData.users?.map(userData=>(
              <UserInfo
                name={userData.name}
              />
            ))}

        </div>
    )
}

export default RoomPage