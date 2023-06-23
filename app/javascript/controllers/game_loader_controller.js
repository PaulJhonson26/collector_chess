import { Controller } from "@hotwired/stimulus"
import { createAllMovesObject } from "chess_moves"

let Moves;
let fMoves;
////Features to add
/// click on move and get all games played(json file has game link), just add array games
export default class extends Controller {
  static targets = ["collectedMoves", "lockedMoves","gamesStatsMinor", "gamesStatsMajor", "username", "checks", "mates", "regulars",
                    "takes", "loading", "pawns", "knights", "bishops", "rooks", "queens", "kings", "promotions",
                  "sortMethod"]

  connect() {
    Moves = {}
  }
  sort(e = null) {
    if(e != null){e.preventDefault()}

    const sortedMoves = this.#sortObject(fMoves, this.sortMethodTarget.value)
    this.collectedMovesTarget.innerHTML = "";
    this.lockedMovesTarget.innerHTML = "";
    this.#createCards(sortedMoves)

  }
  filter() {
    this.collectedMovesTarget.innerHTML = "";
    this.lockedMovesTarget.innerHTML = "";
    console.log("Checks ",this.checksTarget.checked)
    console.log("Mates ",this.matesTarget.checked)
    console.log("Regulars ",this.regularsTarget.checked)
    let filteredMoves = {}
    for (const [key, value] of Object.entries(Moves)) {
      if (this.checksTarget.checked == true){
        if(key.substring(key.length-1, key.length) == "+"){
          filteredMoves[key] = value
        }

      }
      if (this.matesTarget.checked == true){
        if(key.substring(key.length-1, key.length) == "#"){
          filteredMoves[key] = value
        }
      }
      if (this.regularsTarget.checked == true){
        if(key.substring(key.length-1, key.length) != "#" && key.substring(key.length-1, key.length) != "+"){
          filteredMoves[key] = value
        }
      }
    }
    console.log(filteredMoves)
    /// filtering checks
    filteredMoves = this.#filterTakes(filteredMoves)
    filteredMoves = this.#filterPawns(filteredMoves)
    filteredMoves = this.#filterKnights(filteredMoves)
    filteredMoves = this.#filterBishops(filteredMoves)
    filteredMoves = this.#filterRooks(filteredMoves)
    filteredMoves = this.#filterQueens(filteredMoves)
    filteredMoves = this.#filterKings(filteredMoves)
    filteredMoves = this.#filterPromotions(filteredMoves)
    this.#createCards(filteredMoves)
    fMoves = filteredMoves
    this.sort()



  }
  submit(e) {
    this.loadingTarget.classList.toggle("d-none")
    e.preventDefault();
    const user = this.usernameTarget.value
    this.usernameTarget.value = user
    console.log(user)

    const token = 'lip_tBb1t8gdHDGhWMlrmd7i';
    const allMovesObject = createAllMovesObject()

    const url = `https://lichess.org/api/games/user/${user}`;
    const headers = {
      Authorization:  `Bearer ${token}`,
    };

    fetch(url, { headers })
      .then(res => res.text())
      .then(data => {
        console.log(data)
        let games = data.split(/\n\n\n/)

        games.forEach((game, i) => {
          let style = ""
            console.log(i, game)
            if (game != "" && game != undefined) {
              let parsedGame = JSON.parse(parser.pgn2json(game));
              // let movesString = ""
              parsedGame.moves.forEach(move => {
                // movesString = `${movesString} ${move}, `
                allMovesObject[move] += 1;
              });
            }
        })
        //const sortedMoves = allMovesObject
        Moves = allMovesObject
        const sortedMoves = this.#sortObject(allMovesObject, "tpd")

        //adding stats to page
        let allPlayed = this.#pMovesPlayed(sortedMoves)
        let matesPlayed = this.#pMatesPlayed(sortedMoves)
        let checksPlayed = this.#pChecksPlayed(sortedMoves)
        let simplePlayed = this.#pSimplePlayed(sortedMoves)

        this.#createStats(allPlayed, matesPlayed, checksPlayed, simplePlayed)
        this.loadingTarget.classList.toggle("d-none")
        this.filter()




        // var json = parser.pgn2json(data);
        // console.log(json)
      });
  }

  #createStats(allPlayed, matesPlayed, checksPlayed, simplePlayed){
    const template = document.querySelector("#statBox")
    allPlayed.forEach((Piece, index) => {
      const minorStatsContainer = this.gamesStatsMinorTarget
      const majorStatsContainer = this.gamesStatsMajorTarget
      const clone = template.content.cloneNode(true);
      const matesBar = clone.querySelector(".stats-mates")
      const checksBar = clone.querySelector(".stats-checks")
      const simpleBar = clone.querySelector(".stats-normal")

      let matesProgression = 100*matesPlayed[index][0]/(matesPlayed[index][0]+matesPlayed[index][1])
      let checksProgression = 100*checksPlayed[index][0]/(checksPlayed[index][0]+checksPlayed[index][1])
      let simpleProgression = 100*simplePlayed[index][0]/(simplePlayed[index][0]+simplePlayed[index][1])

      matesBar.style.width = `${matesProgression}%`
      checksBar.style.width = `${checksProgression}%`
      simpleBar.style.width = `${simpleProgression}%`
      //      index < 3 ?  minorStatsContainer.appendChild(clone) : majorStatsContainer.appendChild(clone)
      if(index<3){
        minorStatsContainer.appendChild(clone)
      }
      else {
        majorStatsContainer.appendChild(clone)
      }

    });
  }
  #createCards(allMovesObject){
    const sortedMoves = this.#sortObject(allMovesObject, "tpd")
    const mostMovesCount = sortedMoves[Object.keys(sortedMoves)[0]];

    let count = 0

    const template = document.querySelector("#template-move");

    for (const [key, value] of Object.entries(allMovesObject)) {
      const clone = template.content.cloneNode(true);
      const collectedMoves = document.querySelector("#collected-moves")
      const lockedMoves = document.querySelector("#locked-moves")
      let rgb = this.#RGBCalc(mostMovesCount, value)

      let h4 = clone.querySelector(".card-move-notation")
      let p = clone.querySelector(".card-move-count")
      let div = clone.querySelector("div")

      h4.textContent = key
      h4.style.color = `rgb(${rgb[3]},${rgb[3]},${rgb[3]})`

      p.textContent = value
      p.style.color = `rgb(${rgb[3]},${rgb[3]},${rgb[3]})`


      div.style.backgroundColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
      if(value > 0){
        collectedMoves.appendChild(clone);
      }
      else{
        lockedMoves.appendChild(clone)
      }
      // const moveTag = `<p>${count+1}- ${key}: ${value} </p>`
      // this.gamesMovesTarget.insertAdjacentHTML("beforeend", moveTag)
      count+=1;

    }
  }
  #filterPawns(filteredMoves){
    if(this.pawnsTarget.checked){
      return filteredMoves
    }
    else {
      let noTakesMoves = {}
      for (const [key, value] of Object.entries(filteredMoves)) {
        if(key.substring(0,1) != key.substring(0,1).toLowerCase()){
          noTakesMoves[key] = value
        }
      }
      return noTakesMoves
    }
  }
  #filterKnights(filteredMoves){
    if(this.knightsTarget.checked){
      return filteredMoves
    }
    else {
      let noTakesMoves = {}
      for (const [key, value] of Object.entries(filteredMoves)) {
        if(key.substring(0,1) != "N"){
          noTakesMoves[key] = value
        }
      }
      return noTakesMoves
    }
  }
  #filterBishops(filteredMoves){
    if(this.bishopsTarget.checked){
      return filteredMoves
    }
    else {
      let noTakesMoves = {}
      for (const [key, value] of Object.entries(filteredMoves)) {
        if(key.substring(0,1) != "B"){
          noTakesMoves[key] = value
        }
      }
      return noTakesMoves
    }
  }
  #filterRooks(filteredMoves){
    if(this.rooksTarget.checked){
      return filteredMoves
    }
    else {
      let noTakesMoves = {}
      for (const [key, value] of Object.entries(filteredMoves)) {
        if(key.substring(0,1) != "R"){
          noTakesMoves[key] = value
        }
      }
      return noTakesMoves
    }
  }
  #filterQueens(filteredMoves){
    if(this.queensTarget.checked){
      return filteredMoves
    }
    else {
      let noTakesMoves = {}
      for (const [key, value] of Object.entries(filteredMoves)) {
        if(key.substring(0,1) != "Q"){
          noTakesMoves[key] = value
        }
      }
      return noTakesMoves
    }
  }

  #filterKings(filteredMoves){
    if(this.kingsTarget.checked){
      return filteredMoves
    }
    else {
      let noTakesMoves = {}
      for (const [key, value] of Object.entries(filteredMoves)) {
        if(key.substring(0,1) != "K" && !key.includes("O") ){
          noTakesMoves[key] = value
        }
      }
      return noTakesMoves
    }
  }
  #filterPromotions(filteredMoves){
    if(this.promotionsTarget.checked){
      return filteredMoves
    }
    else {
      let noTakesMoves = {}
      for (const [key, value] of Object.entries(filteredMoves)) {
        if(!key.includes("=") ){
          noTakesMoves[key] = value
        }
      }
      return noTakesMoves
    }
  }


  #filterTakes(filteredMoves){
    if(this.takesTarget.checked){
      return filteredMoves
    }
    else {
      let noTakesMoves = {}
      for (const [key, value] of Object.entries(filteredMoves)) {
        if(!key.includes("x")){
          noTakesMoves[key] = value
        }
      }
      return noTakesMoves
    }
  }

  #sortObject(object, sortMethod){
    let sortedMoves = null;
    switch(sortMethod){
      case "tpd":
         sortedMoves = Object.entries(object)
              .sort((a, b) => b[1] - a[1]) // Sort in descending order of values
              .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
              }, {});
        return sortedMoves
        break;
      case "tpa":
         sortedMoves = Object.entries(object)
              .sort((a, b) => a[1] - b[1]) // Sort in ascending order of values
              .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
              }, {});
        return sortedMoves
        break;
      case "alphabetical":
        return object
        break;
    }
  }
  #RGBCalc(mostMovesCount, value){
    let ratio = 255/(Math.cbrt(mostMovesCount))
    let R = 255 - Math.sqrt(value)*ratio
    let G = 255 - Math.sqrt(value)*ratio + 50
    let B = 255 - Math.sqrt(value)*ratio

    let text =0
    if( Math.sqrt(value)*ratio < 128) {
      text = 0
    }
    else {
      text = 255
    }
    return [R,G,B,text]

  }

  #pMovesPlayed(sortedMoves){
    let KnightPlayed = 0
    let KnightLocked = 0
    let BishopPlayed = 0
    let BishopLocked = 0
    let RookPlayed = 0
    let RookLocked = 0
    let QueenPlayed = 0
    let QueenLocked = 0
    let KingPlayed = 0
    let KingLocked = 0
    let PawnPlayed = 0
    let PawnLocked = 0


    for (const [key, value] of Object.entries(sortedMoves)) {
      if(value > 0){
        switch(key.substring(0,1)){
          case "N":
            KnightPlayed +=1
            break
          case "B":
            BishopPlayed +=1
            break
          case "R":
            RookPlayed +=1
            break
          case "Q":
            QueenPlayed +=1
            break
          case "K":
            KingPlayed +=1
            break
          default:
            PawnPlayed +=1
        }
      }
      else {
        switch(key.substring(0,1)){
          case "N":
            KnightLocked +=1
            break
          case "B":
            BishopLocked +=1
            break
          case "R":
            RookLocked +=1
            break
          case "Q":
            QueenLocked +=1
            break
          case "K":
            KingLocked +=1
            break
          default:
            PawnLocked +=1
        }
      }
    }
    return [[PawnPlayed, PawnLocked], [KnightPlayed, KnightLocked], [BishopPlayed, BishopLocked], [RookPlayed, RookLocked], [QueenPlayed, QueenLocked], [KingPlayed, KingLocked]]
  }

  #pMatesPlayed(sortedMoves){
    let KnightPlayed = 0
    let KnightLocked = 0
    let BishopPlayed = 0
    let BishopLocked = 0
    let RookPlayed = 0
    let RookLocked = 0
    let QueenPlayed = 0
    let QueenLocked = 0
    let KingPlayed = 0
    let KingLocked = 0
    let PawnPlayed = 0
    let PawnLocked = 0

    for (const [key, value] of Object.entries(sortedMoves)) {
      if(key.substring(key.length-1, key.length) == "#") {
        if(value > 0){
        switch(key.substring(0,1)){
          case "N":
            KnightPlayed +=1
            break
          case "B":
            BishopPlayed +=1
            break
          case "R":
            RookPlayed +=1
            break
          case "Q":
            QueenPlayed +=1
            break
          case "K":
            KingPlayed +=1
            break
          default:
            PawnPlayed +=1
        }
      }
      else {
        switch(key.substring(0,1)){
          case "N":
            KnightLocked +=1
            break
          case "B":
            BishopLocked +=1
            break
          case "R":
            RookLocked +=1
            break
          case "Q":
            QueenLocked +=1
            break
          case "K":
            KingLocked +=1
            break
          default:
            PawnLocked +=1
        }
      }
      }
    }
    return [[PawnPlayed, PawnLocked], [KnightPlayed, KnightLocked], [BishopPlayed, BishopLocked], [RookPlayed, RookLocked], [QueenPlayed, QueenLocked], [KingPlayed, KingLocked]]
  }

  #pChecksPlayed(sortedMoves){
    let KnightPlayed = 0
    let KnightLocked = 0
    let BishopPlayed = 0
    let BishopLocked = 0
    let RookPlayed = 0
    let RookLocked = 0
    let QueenPlayed = 0
    let QueenLocked = 0
    let KingPlayed = 0
    let KingLocked = 0
    let PawnPlayed = 0
    let PawnLocked = 0

    for (const [key, value] of Object.entries(sortedMoves)) {
      if(key.substring(key.length-1, key.length) == "+") {
        if(value > 0){
        switch(key.substring(0,1)){
          case "N":
            KnightPlayed +=1
            break
          case "B":
            BishopPlayed +=1
            break
          case "R":
            RookPlayed +=1
            break
          case "Q":
            QueenPlayed +=1
            break
          case "K":
            KingPlayed +=1
            break
          default:
            PawnPlayed +=1
        }
      }
      else {
        switch(key.substring(0,1)){
          case "N":
            KnightLocked +=1
            break
          case "B":
            BishopLocked +=1
            break
          case "R":
            RookLocked +=1
            break
          case "Q":
            QueenLocked +=1
            break
          case "K":
            KingLocked +=1
            break
          default:
            PawnLocked +=1
        }
      }
      }
    }
    return [[PawnPlayed, PawnLocked], [KnightPlayed, KnightLocked], [BishopPlayed, BishopLocked], [RookPlayed, RookLocked], [QueenPlayed, QueenLocked], [KingPlayed, KingLocked]]
  }

  #pSimplePlayed(sortedMoves){
    let KnightPlayed = 0
    let KnightLocked = 0
    let BishopPlayed = 0
    let BishopLocked = 0
    let RookPlayed = 0
    let RookLocked = 0
    let QueenPlayed = 0
    let QueenLocked = 0
    let KingPlayed = 0
    let KingLocked = 0
    let PawnPlayed = 0
    let PawnLocked = 0
    for (const [key, value] of Object.entries(sortedMoves)) {
      if(key.substring(key.length-1, key.length) != "#" && key.substring(key.length-1, key.length) != "+") {
        if(value > 0){
          switch(key.substring(0,1)){
            case "N":
              KnightPlayed +=1
              break
            case "B":
              BishopPlayed +=1
              break
            case "R":
              RookPlayed +=1
              break
            case "Q":
              QueenPlayed +=1
              break
            case "K":
              KingPlayed +=1
              break
            default:
              PawnPlayed +=1
          }
        }
        else {
          switch(key.substring(0,1)){
            case "N":
              KnightLocked +=1
              break
            case "B":
              BishopLocked +=1
              break
            case "R":
              RookLocked +=1
              break
            case "Q":
              QueenLocked +=1
              break
            case "K":
              KingLocked +=1
              break
            default:
              PawnLocked +=1
          }
        }
        }

      }
      return [[PawnPlayed, PawnLocked], [KnightPlayed, KnightLocked], [BishopPlayed, BishopLocked], [RookPlayed, RookLocked], [QueenPlayed, QueenLocked], [KingPlayed, KingLocked]]
    }

}
