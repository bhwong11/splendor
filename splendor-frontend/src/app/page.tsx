// import styles from './page.module.css'
import CreatePost from './posts/[id]/createPost'
import CreateRoom from './(components)/CreateRoom'
import EnterRoom from './(components)/EnterRoom'
import { redirect } from 'next/navigation'


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
  async function goToScorePage(formData) {
    'use server'
    console.log('E!!!',formData)
    redirect(`/${formData.get('username')}`)
  }

  return (
    <main className=''>
      <h1 className=''>test</h1>
      <div>
        {allRooms?.map(room=>(
          <p>room number{room.roomNumber}</p>
        ))}
      </div>
      {/* <CreatePost/> */}
      <CreateRoom/>
      <EnterRoom/>
      <form action={goToScorePage}>
        <label htmlFor="username">See Wins: username</label>
        <input 
          name="username"
          type="text"
        />
        <button type="submit">
          See Wins
        </button>
      </form>
    </main>
  )
}
