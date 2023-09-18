import styles from './page.module.css'
import CreatePost from './posts/[id]/createPost'
import CreateRoom from './(components)/CreateRoom'
import EnterRoom from './(components)/EnterRoom'


const getAllRooms = async ()=>{
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/getAll`,
    {cache:'no-store'}
  )
  const allRooms = await res.json()
  return allRooms
}

export default async function Home() {
  const allRooms = await getAllRooms()
  return (
    <main className={styles.main}>
      <h1 className={styles.test}>test</h1>
      <div>
        {allRooms?.map(room=>(
          <p>room number{room.roomNumber}</p>
        ))}
      </div>
      <CreatePost/>
      <CreateRoom/>
      <EnterRoom/>
    </main>
  )
}
