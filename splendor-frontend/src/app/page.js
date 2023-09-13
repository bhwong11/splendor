import styles from './page.module.css'
import CreatePost from './posts/[id]/createPost'


const getAllRooms = async ()=>{
  const res = await fetch(
    'http://localhost:5050/api/rooms/getAll',
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
    </main>
  )
}
