'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { io } from "socket.io-client";

let socket;


export default function CreatePost(){
  const [roomNumber,setRoomNumber] = useState('')
  const [username,setUsername] = useState('')
  const [message,setMessage] = useState('')
  const [allMessages,setAllMessages] = useState([])
  const [randomRoomNumber,setRandomRoomNumber] = useState('')
  const router = useRouter()

  const socketInitializer = async () =>{
    socket = io(process.env.NEXT_PUBLIC_API_URL)
    console.log('init')
    socket.emit('join-room',{
      room:'room-1',
      username:''
    })
  }
  useEffect(()=>{
    // socketInitializer()
    // socket.on("receive-message", (data) => {
    //   console.log('recive',data)
    //   setAllMessages((pre) => [...pre, data]);
    // });
    // return () => {
    //   socket.disconnect();
    // };
  },[])

  const createRoom = async ({
    roomNumber=null,
    users=[],
    refresh=()=>{}
  }={})=>{
    //put this in helper func
    if(!roomNumber && !roomNumber===0) return
    const newRoom = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/create`,{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomNumber,
          users
        })
    })
    console.log('new room',newRoom)
    setRoomNumber('')
    refresh()
  }

  const createUser = async ({
    username='',
    roomNumber,
    refresh=()=>{}
  }={})=>{
    if(!username) return
    //put this in helper func
    const newUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/create`,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        roomNumber
      })
    })
    console.log('new User',newUser)
    refresh()
  }
  
  const getRandomRoom = async ()=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/getAll`)
    const latestRooms = await res.json()
    const randomNum02 = Math.floor(Math.random()*3)
    setRandomRoomNumber(latestRooms[randomNum02]?.roomNumber)
  }

  return(
    <>
    <h2>{randomRoomNumber}</h2>
    <button className="btn" onClick={()=>{
      getRandomRoom()
    }}>
      get Random room
    </button>
    <form onSubmit={(e)=>{
      e.preventDefault()
      console.log('create room')
      createRoom({
        roomNumber,
        refresh:()=>router.refresh()
      })
    }}>
    <div>
      <label htmlhtmlFor="number">room number</label>
      <input 
        name="number"
        type="text"
        value={roomNumber}
        onChange={e=>setRoomNumber(e.target.value)}
      />
    </div>
    <button className="btn" type="submit">
      create
    </button>
    </form>
    {allMessages?.map(m=>(
      <>
        <div>
          {m.username}
        </div>
        <div>
          {m.message}
        </div>
      </>
    ))}
  
    <form onSubmit={(e)=>{
      e.preventDefault();
      console.log('creating room')

      createUser({
        username,
        roomNumber,
        refresh:()=>router.refresh()
      })
    }}>
      <label htmlFor="username">username</label>
      <input 
        name="username"
        type="text"
        value={username}
        onChange={e=>setUsername(e.target.value)}
      />
      <label htmlFor="roomNumber">roomNumber</label>
      <input 
        name="roomNumber"
        type="text"
        value={roomNumber}
        onChange={e=>setRoomNumber(e.target.value)}
      />
      <button className="btn" type="submit">
        send
      </button>
    </form>


    <form onSubmit={(e)=>{
      e.preventDefault();

      console.log("emitted");

      socket.emit("send-message", {
        username,
        message
      });
      setMessage("");
    }}>
      <label htmlFor="username">username</label>
      <input 
        name="username"
        type="text"
        value={username}
        onChange={e=>setUsername(e.target.value)}
      />
      <label htmlFor="message">message</label>
      <input 
        name="message"
        type="text"
        value={message}
        onChange={e=>setMessage(e.target.value)}
      />
      <button className="btn" type="submit">
        send
      </button>
    </form>
    </>
  )
};