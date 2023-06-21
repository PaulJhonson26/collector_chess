import { Controller } from "@hotwired/stimulus"
import { createAllMovesObject } from "chess_moves"
// <% url = 'https://lichess.org/api/games/user/Paul_Jhonson'%>
// <% token = 'lip_f0XJ8aEQjHiL496iJF6z' %>
// <%#game id f22PJAeH %>
// <%# user id silent633 %>
// <% URI.open(url,'Accept' => 'application/json', 'Authorization' => "Bearer #{token}") do |response| %>
//   <% response.each_line do |line| %>
//     <%= line%>
//   <% end %>
// <% end %>
// let game = parse('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#', {startRule: "game"})
// console.log(JSON.stringify(res, null, 2))
// Connects to data-controller="game-loader"
export default class extends Controller {
  static targets = ["gamesMoves", "gamesStats"]

  connect() {


    const token = 'lip_tBb1t8gdHDGhWMlrmd7i';
    const allMovesObject = createAllMovesObject()
    console.log(allMovesObject["0-0"])
    console.log(allMovesObject)
    const user = "Paul_Jhonson"//"DrNykterstein"
    const url = `https://lichess.org/api/games/user/${user}`;
    const headers = {
      Authorization:  `Bearer ${token}`,
    };

    fetch(url, { headers })
      .then(res => res.text())
      .then(data => {
        console.log(data)
        let games = data.split(/\n\n\n/)
        // console.log("games type: ", games[0].constructor.name)
        // console.log("game[0]: ", games[0])
        // console.log("data type: ", data.constructor.name)
        // console.log("game[0]->Json: ", parser.pgn2json(games[0]))

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
              // movesString +=parsedGame.str.Result
              // if(parsedGame.str.White == user &&parsedGame.str.Result == "1-0") {
              //   movesString += "You won!"
              //   style = "color: green"

              // }
              // else if(parsedGame.str.Black == user &&parsedGame.str.Result == "0-1"){
              //   movesString += "You won!"
              //   style = "color: green"
              // }
              // else {
              //   movesString += "You lost :/"
              //   style = "color: red"
              // }

            }
        })
        const sortedMoves = Object.entries(allMovesObject)
          .sort((a, b) => b[1] - a[1]) // Sort in descending order of values
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});

        console.log(allMovesObject)
        console.log("111111111111111111")
        console.log(sortedMoves)
        console.log("222222222222222222")

        let count = 0
        const template = document.querySelector("#template-move");
        const mostMovesCount = sortedMoves[Object.keys(sortedMoves)[0]];
        for (const [key, value] of Object.entries(sortedMoves)) {
          const clone = template.content.cloneNode(true);
          const movesContainer = document.querySelector("#movesContainer")
          let rgb = this.#RGBCalc(mostMovesCount, value)

          let h4 = clone.querySelector("h4")
          let p = clone.querySelector("p")
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

        this.#pMovesPlayed(sortedMoves)
        this.#pMatesPlayed(sortedMoves)
        this.#pSimplePlayed(sortedMoves)
        // var json = parser.pgn2json(data);
        // console.log(json)
      });
    console.log("please tell me we're here!")
  }

  #RGBCalc(mostMovesCount, value){
    let ratio = 255/(mostMovesCount*2)
    let R = 255 - value*ratio*2
    let G = 255 - value*ratio
    let B = 255 - value*ratio*2

    let text =0
    if( value*ratio*2 < 128) {
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
    this.gamesStatsTarget.insertAdjacentHTML("beforeend", percentageTag)
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
    this.gamesStatsTarget.insertAdjacentHTML("beforeend", percentageTag)
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
    this.gamesStatsTarget.insertAdjacentHTML("beforeend", percentageTag)
  }
}
