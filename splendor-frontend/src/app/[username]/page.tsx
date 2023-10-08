import { getUser } from "@/api"
const UserScorePage = async ({params})=>{
  const user = await getUser({username:params.username,revalidateSeconds:1800})

  return (
      <div>
          <h1>Wins</h1>
          <h3>{user.username}</h3>
          <h3>wins: {user.wins}</h3>
          <h3>total vcitory points from all games: {user.victoryPoints}</h3>
      </div>
  )
}

export default UserScorePage