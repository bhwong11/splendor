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
    // await fetch("")
    socket = io("http://localhost:5050")
    console.log('init')
    socket.emit('join-room',{
      room:'room-1',
      username:''
    })
  }
  useEffect(()=>{
    socketInitializer()
    socket.on("receive-message", (data) => {
      console.log('recive',data)
      setAllMessages((pre) => [...pre, data]);
    });
    return () => {
      socket.disconnect();
    };
  },[])

  const createRoom = async ({
    roomNumber=null,
    users=[],
    refresh=()=>{}
  }={})=>{
    //put this in helper func
    if(!roomNumber && !roomNumber===0) return
    const newRoom = await fetch('http://localhost:5050/api/rooms/create',{
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
    rooms = [],
    refresh=()=>{}
  }={})=>{
    if(!username) return
    //put this in helper func
    const newUser = await fetch('http://localhost:5050/api/users/create',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        rooms
      })
    })
    console.log('new User',newUser)
    refresh()
  }
  
  const getRandomRoom = async ()=>{
    const res = await fetch('http://localhost:5050/api/rooms/getAll')
    const latestRooms = await res.json()
    const randomNum02 = Math.floor(Math.random()*3)
    setRandomRoomNumber(latestRooms[randomNum02]?.roomNumber)
  }

  return(
    <>
    <h2>{randomRoomNumber}</h2>
    <button onClick={()=>{
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
      <label for="number">room number</label>
      <input 
        name="number"
        type="text"
        value={roomNumber}
        onChange={e=>setRoomNumber(e.target.value)}
      />
    </div>
    <button type="submit">
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
        refresh:()=>router.refresh()
      })
    }}>
      <label for="username">username</label>
      <input 
        name="username"
        type="text"
        value={username}
        onChange={e=>setUsername(e.target.value)}
      />
      <label for="roomNumber">roomNumber</label>
      <input 
        name="roomNumber"
        type="text"
        value={roomNumber}
        onChange={e=>setRoomNumber(e.target.value)}
      />
      <button type="submit">
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
      <label for="username">username</label>
      <input 
        name="username"
        type="text"
        value={username}
        onChange={e=>setUsername(e.target.value)}
      />
      <label for="message">message</label>
      <input 
        name="message"
        type="text"
        value={message}
        onChange={e=>setMessage(e.target.value)}
      />
      <button type="submit">
        send
      </button>
    </form>
    </>
  )
};