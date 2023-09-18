interface Card{
    id:number,
    gem:string,
    picture: string,
    level:number,
    victoryPoints:number,
    price:{
      white?:number,
      blue?:number,
      green?:number,
      red?:number,
      black?:number
    }
}
const shuffleCards = (cards:Card[]=[])=>{

}