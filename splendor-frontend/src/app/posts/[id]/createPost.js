'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { io } from "socket.io-client";

let socket;


export default function CreatePost(){
  const [title,setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [body,setBody] = useState('')
  const [username,setUsername] = useState('')
  const [message,setMessage] = useState('')
  const [allMessages,setAllMessages] = useState([])
  const [randomPostTitle,setRandomPostTitle] = useState('')
  const router = useRouter()

  const socketInitializer = async () =>{
    // await fetch("")
    socket = io("http://localhost:5050")
    socket.emit()
  }
  useEffect(()=>{
    socketInitializer()
    socket.on("receive-message", (data) => {
      setAllMessages((pre) => [...pre, data]);
    });
    return () => {
      socket.disconnect();
    };
  },[])

  const createPost = async ({
    title='',
    body='',
    author='',
    permalink='',
    tags=[],
    comments=[],
    refresh=()=>{}
  }={})=>{
    await fetch('http://localhost:5050/posts/',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body,
        author,
        permalink,
        tags,
        comments
      })
    })
    refresh()
  }
  
  const getRandomPost = async ()=>{
    const res = await fetch('http://localhost:5050/posts/latest')
    const latestPosts = await res.json()
    const randomNum02 = Math.floor(Math.random()*3)
    setRandomPostTitle(latestPosts[randomNum02]?.title)
  }

  return(
    <>
    <h2>{randomPostTitle}</h2>
    <button onClick={()=>{
      getRandomPost()
    }}>
      get Random
    </button>
    <form onSubmit={(e)=>{
      e.preventDefault()
      createPost({
      title,
      author,
      body,
      refresh:()=>router.refresh()
    })}}>
    <div>
      <label for="title">title</label>
      <input 
        name="title"
        type="text"
        value={title}
        onChange={e=>setTitle(e.target.value)}
      />
    </div>
    <div>
      <label for="author">author</label>
      <input 
        name="author"
        type="text"
        value={author}
        onChange={e=>setAuthor(e.target.value)}
      />
    </div>
    <div>
      <label for="body">body</label>
      <textarea
        name="body"
        onChange={e=>setBody(e.target.value)}
        value={body}
      />
    </div>
    <button type="submit">
      create
    </button>
    </form>

    <form onSubmit={()=>{
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