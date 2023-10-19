import CreateRoom from './(components)/CreateRoom'
import EnterRoom from './(components)/EnterRoom'
import { redirect } from 'next/navigation'
import classNames from "classnames";
import { lemon } from './layout';

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
  const goToScorePage = async (formData)=>  {
    'use server'
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
      <CreateRoom/>
      <EnterRoom/>
      <h3 className={classNames(lemon.className)}>See Wins</h3>
      <form className="flex flex-col" action={goToScorePage}>
        <label htmlFor="username" className="font-optima font-bold">
          username:
        </label>
        <input
          name="username"
          type="text"
          required
        />
        <button className="btn mt-2" type="submit">
          See Wins
        </button>
      </form>
    </main>
  )
}
