import { Controller } from "@hotwired/stimulus"
import { createAllMovesObject } from "chess_moves"

let Moves;

export default class extends Controller {
  static targets = ["gamesMoves", "gamesStats", "username", "checks", "mates", "regulars"]

  connect() {
    Moves = {}
  }
  filter(e) {

    e.preventDefault();
    this.gamesMovesTarget.innerHTML = "";
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
    this.#createCards(filteredMoves)

  }
  submit(e) {
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
        const sortedMoves = this.#sortObject(allMovesObject)

        //adding stats to page
        this.#pMovesPlayed(sortedMoves)
        this.#pMatesPlayed(sortedMoves)
        this.#pSimplePlayed(sortedMoves)

        this.#createCards(allMovesObject)



        // var json = parser.pgn2json(data);
        // console.log(json)
      });
  }

  #createCards(allMovesObject){
    const sortedMoves = this.#sortObject(allMovesObject)
    const mostMovesCount = sortedMoves[Object.keys(sortedMoves)[0]];

    let count = 0

    const template = document.querySelector("#template-move");

    for (const [key, value] of Object.entries(allMovesObject)) {
      const clone = template.content.cloneNode(true);
      const movesContainer = document.querySelector("#movesContainer")
      let rgb = this.#RGBCalc(mostMovesCount, value)

      let h4 = clone.querySelector(".card-move-notation")
      let p = clone.querySelector(".card-move-count")
      let div = clone.querySelector("div")

      h4.textContent = key
      h4.style.color = `rgb(${rgb[3]},${rgb[3]},${rgb[3]})`

      p.textContent = value
      p.style.color = `rgb(${rgb[3]},${rgb[3]},${rgb[3]})`


      div.style.backgroundColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
      movesContainer.appendChild(clone);
      // const moveTag = `<p>${count+1}- ${key}: ${value} </p>`
      // this.gamesMovesTarget.insertAdjacentHTML("beforeend", moveTag)
      count+=1;

    }
  }

  #sortObject(object){
    const sortedMoves = Object.entries(object)
          .sort((a, b) => b[1] - a[1]) // Sort in descending order of values
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});
    return sortedMoves
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
    let playedCount = 0
    let notPlayedCount = 0
    for (const [key, value] of Object.entries(sortedMoves)) {

      if(value > 0){
        playedCount += 1;
      }
      else {
        notPlayedCount += 1;
      }
    }
    const percentageTag = `<p>${(100*playedCount/(playedCount+notPlayedCount)).toFixed(2)}% of Moves Complete</p>`
    document.querySelector(".statsContainer").insertAdjacentHTML("beforeend", percentageTag)
  }

  #pMatesPlayed(sortedMoves){
    let playedCount = 0
    let notPlayedCount = 0
    for (const [key, value] of Object.entries(sortedMoves)) {

      if(key.substring(key.length-1, key.length) == "#") {
        if(value > 0 ){
          playedCount += 1;
        }
        else {
          notPlayedCount += 1;
        }
      }
    }
    const percentageTag = `<p>${(100*playedCount/(playedCount+notPlayedCount)).toFixed(2)}% of Mates Complete</p>`
    document.querySelector(".statsContainer").insertAdjacentHTML("beforeend", percentageTag)
  }

  #pSimplePlayed(sortedMoves){
    let playedCount = 0
    let notPlayedCount = 0
    for (const [key, value] of Object.entries(sortedMoves)) {
      if(key.substring(key.length-1, key.length) != "#" && key.substring(key.length-1, key.length) != "+") {
        if(value > 0 ){
          playedCount += 1;
        }
        else {
          notPlayedCount += 1;
        }
      }
    }
    const percentageTag = `<p>${(100*playedCount/(playedCount+notPlayedCount)).toFixed(2)}% of simple moves Complete</p>`
    document.querySelector(".statsContainer").insertAdjacentHTML("beforeend", percentageTag)
  }
}
