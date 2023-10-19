import CreateRoom from './(components)/CreateRoom'
import EnterRoom from './(components)/EnterRoom'
import { redirect } from 'next/navigation'
import classNames from "classnames";
import { lemon, noto_emoji } from './layout';
import AllRoomsWrapper from './(components)/AllRoomsWrapper';
import AllRooms from './(components)/AllRooms';

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
    <main className="
      flex
      flex-col
      items-center
      border-4
      border-pink-700
      bg-gradient-to-b
      from-pink-200
      to-white
      rounded-lg
    ">
      <h1 className={classNames(lemon.className,"text-center mt-5 text-yellow-600")}>
        <span className={classNames(noto_emoji.className,"text-cyan-500")}>🍬🍫🍭</span>
        Splendor Candy
        <span className={classNames(noto_emoji.className,"text-cyan-500")}>🍬🍫🍭</span>
      </h1>
      <div className="p-5 w-72 sm:w-96">
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
        <AllRooms/>
      </div>
    </main>
  )
}
