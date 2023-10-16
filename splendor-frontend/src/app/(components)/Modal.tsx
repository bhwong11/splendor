import React, { useState, useMemo } from "react";
import { SocketUser } from "../lib";
import { determineVictoryPoints } from "@/app/lib";
import { useUserStore } from "@/zustand";

type ModalProps = {
  playerAssets:SocketUser
}
const Modal = ({playerAssets}:ModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const username = useUserStore(state=>state.username)

  const victoryPoints = useMemo(()=>determineVictoryPoints(playerAssets),[
    playerAssets.nobles.length,
    playerAssets.cards.length
  ])
  return (
    <>
      <button
        className="btn"
        onClick={() => setShowModal(true)}
      >
        {playerAssets.username===username?'your':playerAssets.username} Assets
      </button>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white border-2 border-blue-700">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">Assets: {playerAssets.username}</h3>
                  <button
                    className="btn bg-transparent hover:bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <p>Victory Points: {victoryPoints}</p>
                  {JSON.stringify(playerAssets)}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
