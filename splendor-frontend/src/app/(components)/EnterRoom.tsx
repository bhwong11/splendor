'use client';
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser"
import classNames from "classnames";
import { lemon } from "../layout";


export default function EnterRoom({
  existingRoomNumber
}:{
  existingRoomNumber?:number | string
}){
  return(
    <div>
      <h2 className={classNames(lemon.className)}>Enter Room</h2>
      <CreateUser existingRoomNumber={existingRoomNumber}/>
      <UpdateUser existingRoomNumber={existingRoomNumber}/>
    </div>
  )
};