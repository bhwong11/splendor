'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { io } from "socket.io-client";
import { createUser, updateUser } from "@/api";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser"


export default function EnterRoom({
  existingRoomNumber
}:{
  existingRoomNumber?:number | string
}){
  return(
    <div>
      <h2>Enter</h2>
      <CreateUser existingRoomNumber={existingRoomNumber}/>
      <UpdateUser existingRoomNumber={existingRoomNumber}/>
    </div>
  )
};