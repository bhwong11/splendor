'use client'
import React, { useState, useMemo } from "react";
import { SocketUser } from "../lib";
import { 
  determineVictoryPoints,
  createCardGemMap,
  createCardsByGem,
  Card,
  gemColorMap
} from "@/app/lib";
import { useUserStore} from "@/zustand";
import classNames from "classnames";
import GameCard from "./GameCard";
import { lemon,noto_emoji } from "../layout";


type ModalProps = {
  playerAssets: SocketUser,
  roomNumber: number
}
const Modal = ({playerAssets,roomNumber}:ModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const username = useUserStore(state=>state.username)
  const [visibleAssets,setVisibleAssets]=useState<{
    cards: boolean
    nobles: boolean
    reservedCards:boolean
  }>({
    cards:false,
    nobles:false,
    reservedCards:false
  })

  const cardGemMap = useMemo(
    ()=>createCardGemMap(playerAssets.cards)
    ,[playerAssets.cards.length]
  )
  const cardsByGemMap = useMemo(
    ()=>createCardsByGem(playerAssets.cards)
    ,[playerAssets.cards.length]
  )

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
        {playerAssets.username===username?
        `${playerAssets.username} (your)`:
        playerAssets.username} Assets
      </button>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 bg-gray-500 bg-opacity-75">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="rounded-lg shadow-lg relative flex flex-col w-full border-2 border-cyan-500 bg-cyan-100">
                <div className="flex items-center justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className={lemon.className}>
                    Assets: {playerAssets.username}
                  </h3>
                  <button
                    className="btn bg-transparent hover:bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 w-6 text-xl block">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <p className="font-optima font-bold">Victory Points: {victoryPoints}</p>

                  <div className="flex flex-wrap">
                    <span className={classNames(lemon.className)}>tokens: </span>
                    {Object.keys(playerAssets.tokens).map(color=>(
                    <div className={gemColorMap[color].textColor} key={`tokens-${color}`}>
                      <span className={classNames(noto_emoji.className)}>
                        &nbsp;💎:&nbsp;
                      </span>
                      <span className={classNames(lemon.className)}>
                        {playerAssets.tokens[color]}
                      </span>
                    </div>
                  ))}
                  </div>

                  <div className="flex flex-wrap pb-1">
                    <span className={classNames(lemon.className)}>Card Gems: </span>
                    {Object.keys(cardGemMap).map(color=>(
                    <div className={gemColorMap[color].textColor}  key={`cards-gem-${color}`}>
                      <span className={classNames(noto_emoji.className)}>
                        &nbsp;💎:&nbsp;
                      </span>
                      <span className={classNames(lemon.className)}>
                        {cardGemMap[color]}
                      </span>
                    </div>
                  ))}
                  </div>


                  <div className="flex flex-wrap gap-1 pb-2">
                    <button 
                      className={classNames("btn-link pr-2",{
                        "text-purple-700":visibleAssets['nobles'],
                        "text-pink-700":!visibleAssets['nobles']
                      })}
                      onClick={
                        ()=>setVisibleAssets(prev=>({...prev,nobles:!prev.nobles}))
                      }
                    >
                      nobles {visibleAssets['nobles']?"hide":"show"}
                    </button>
                    <button 
                      className={classNames("btn-link pr-2",{
                        "text-purple-700":visibleAssets['cards'],
                        "text-pink-700":!visibleAssets['cards']
                      })}
                      onClick={
                        ()=>setVisibleAssets(prev=>({...prev,cards:!prev.cards}))
                      }
                    >
                      cards {visibleAssets['cards']?"hide":"show"}
                    </button>
                    <button 
                      className={classNames("btn-link",{
                        "text-purple-700":visibleAssets['reservedCards'],
                        "text-pink-700":!visibleAssets['reservedCards']
                      })}
                      onClick={
                        ()=>setVisibleAssets(prev=>({...prev,reservedCards:!prev.reservedCards}))
                      }
                    >
                      reserved cards {visibleAssets['reservedCards']?"hide":"show"}
                    </button>
                  </div>


                  <div className="visible-assets">
                    {visibleAssets['nobles'] && (
                    <div>
                      <span>nobles:</span>
                        <div>
                        {playerAssets.nobles.map(noble=>(
                            <GameCard 
                              key={`noble-${noble.id}`}
                              card={noble}
                              staticCard={true}
                              roomNumber={roomNumber}
                              className="mt-2 mx-2"
                            />
                          ))}
                          </div>
                    </div>
                    )}

                    { visibleAssets['cards'] && (
                      <div>
                        <span>cards:</span>
                        <div className="flex gap-2">
                          {Object.keys(cardsByGemMap).map((gemColor)=>(
                            <div className="flex flex-col" key={`cards-gem-${gemColor}`}>
                              <h3>{gemColor}</h3>
                              {cardsByGemMap[gemColor]?.map((card:Card)=>(
                                <GameCard 
                                  key={`card-${card.id}`}
                                  card={card}
                                  staticCard={true}
                                  roomNumber={roomNumber}
                                  className="mt-2"
                                />
                              ))}
                            </div>
                          )
                        )}
                      </div>
                      </div>)}

                    { visibleAssets['reservedCards'] &&
                      (
                      <div>
                        <span>reserved cards:</span>
                        <div className="flex">
                          {playerAssets.reservedCards?.map(card=>(
                            <GameCard 
                              key={`card-${card.id}`}
                              card={card}
                              staticCard={false}
                              roomNumber={roomNumber}
                              className="mt-2 mx-2"
                            />
                          ))}
                        </div>
                      </div>)}

                    </div>

                  
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
