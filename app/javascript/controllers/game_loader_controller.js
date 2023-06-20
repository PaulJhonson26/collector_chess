import { Controller } from "@hotwired/stimulus"
// <% url = 'https://lichess.org/api/games/user/Paul_Jhonson'%>
// <% token = 'lip_f0XJ8aEQjHiL496iJF6z' %>
// <%# game id f22PJAeH %>
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
  static targets = ["gamesMoves"]
  connect() {
    const token = 'lip_tBb1t8gdHDGhWMlrmd7i';
    const url = 'https://lichess.org/api/games/user/Paul_Jhonson';
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
        let count = 0
        for(let i = 0; i<300; i++) {
          if(games[i] != undefined) {
            let game = JSON.parse(parser.pgn2json(games[i]));
            console.log(game)
            console.log(game.constructor.name)
            let movesString = ""
            game.moves.forEach(move => {
              movesString = `${movesString} ${move}, `
            });
            movesString += game.str.Result + "\n\n"
            this.gamesMovesTarget.innerText += i + ": " + movesString
            count+=1;
          }
        }
        // var json = parser.pgn2json(data);
        // console.log(json)
      });
    console.log("please tell me we're here!")
  }
}
