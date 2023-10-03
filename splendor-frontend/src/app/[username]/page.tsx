import { getUser } from "@/api"


const UserScorePage = async ({params})=>{
  console.log(params.roomNumber)
  const user = await getUser({username:params.username})
  console.log('room',user)

  return (
      <div>
          <h1>New Room</h1>
          <h3>{user.username}</h3>
          <h3>{user.wins}</h3>
      </div>
  )
}

export default UserScorePage