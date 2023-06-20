import { Controller } from "@hotwired/stimulus"
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
  static targets = ["gamesMoves"]


  connect() {


    const token = 'lip_tBb1t8gdHDGhWMlrmd7i';
    const allMovesObject = this.#createAllMovesObject()
    console.log(allMovesObject["0-0"])
    console.log(allMovesObject)
    const user = "Paul_Jhonson"
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
        let count = 0
        games.forEach((game, i) => {
          let style = ""
            console.log(i, game)
            if (game != "" && game != undefined) {
              let parsedGame = JSON.parse(parser.pgn2json(game));


              // console.log(game)
              // console.log(game.constructor.name)
              let movesString = ""
             parsedGame.moves.forEach(move => {
                movesString = `${movesString} ${move}, `
                allMovesObject[move] += 1;
              });
              movesString +=parsedGame.str.Result
              if(parsedGame.str.White == "Paul_Jhonson" &&parsedGame.str.Result == "1-0") {
                movesString += "You won!"
                style = "color: green"

              }
              else if(parsedGame.str.Black == "Paul_Jhonson" &&parsedGame.str.Result == "0-1"){
                movesString += "You won!"
                style = "color: green"
              }
              else {
                movesString += "You lost :/"
                style = "color: red"
              }
              const tag = `<p style= "${style}">${i+1}: ${movesString + "\n\n"} </p>`
              this.gamesMovesTarget.insertAdjacentHTML("beforeend", tag)
              count+=1;
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
        for (const [key, value] of Object.entries(sortedMoves)) {
          console.log(`${key}: ${value}`);
        }

        // var json = parser.pgn2json(data);
        // console.log(json)
      });
    console.log("please tell me we're here!")
  }

  #createAllMovesObject(){
    const allSquares = [  "a1","a2","a3","a4","a5","a6","a7","a8",
                          "b1","b2","b3","b4","b5","b6","b7","b8",
                          "c1","c2","c3","c4","c5","c6","c7","c8",
                          "d1","d2","d3","d4","d5","d6","d7","d8",
                          "e1","e2","e3","e4","e5","e6","e7","e8",
                          "f1","f2","f3","f4","f5","f6","f7","f8",
                          "g1","g2","g3","g4","g5","g6","g7","g8",
                          "h1","h2","h3","h4","h5","h6","h7","h8"]

    const pawnMoves = [ "a2","a3","a4","a5","a6","a7",
                        "b2","b3","b4","b5","b6","b7",
                        "c2","c3","c4","c5","c6","c7",
                        "d2","d3","d4","d5","d6","d7",
                        "e2","e3","e4","e5","e6","e7",
                        "f2","f3","f4","f5","f6","f7",
                        "g2","g3","g4","g5","g6","g7",
                        "h2","h3","h4","h5","h6","h7"]

    const knightMoves = [ "Na1","Na2","Na3","Na4","Na5","Na6","Na7","Na8",
                          "Nb1","Nb2","Nb3","Nb4","Nb5","Nb6","Nb7","Nb8",
                          "Nc1","Nc2","Nc3","Nc4","Nc5","Nc6","Nc7","Nc8",
                          "Nd1","Nd2","Nd3","Nd4","Nd5","Nd6","Nd7","Nd8",
                          "Ne1","Ne2","Ne3","Ne4","Ne5","Ne6","Ne7","Ne8",
                          "Nf1","Nf2","Nf3","Nf4","Nf5","Nf6","Nf7","Nf8",
                          "Ng1","Ng2","Ng3","Ng4","Ng5","Ng6","Ng7","Ng8",
                          "Nh1","Nh2","Nh3","Nh4","Nh5","Nh6","Nh7","Nh8"]

    const bishopMoves = [ "Ba1","Ba2","Ba3","Ba4","Ba5","Ba6","Ba7","Ba8",
                          "Bb1","Bb2","Bb3","Bb4","Bb5","Bb6","Bb7","Bb8",
                          "Bc1","Bc2","Bc3","Bc4","Bc5","Bc6","Bc7","Bc8",
                          "Bd1","Bd2","Bd3","Bd4","Bd5","Bd6","Bd7","Bd8",
                          "Be1","Be2","Be3","Be4","Be5","Be6","Be7","Be8",
                          "Bf1","Bf2","Bf3","Bf4","Bf5","Bf6","Bf7","Bf8",
                          "Bg1","Bg2","Bg3","Bg4","Bg5","Bg6","Bg7","Bg8",
                          "Bh1","Bh2","Bh3","Bh4","Bh5","Bh6","Bh7","Bh8"]

    const rookMoves = [ "Ra1","Ra2","Ra3","Ra4","Ra5","Ra6","Ra7","Ra8",
                        "Rb1","Rb2","Rb3","Rb4","Rb5","Rb6","Rb7","Rb8",
                        "Rc1","Rc2","Rc3","Rc4","Rc5","Rc6","Rc7","Rc8",
                        "Rd1","Rd2","Rd3","Rd4","Rd5","Rd6","Rd7","Rd8",
                        "Re1","Re2","Re3","Re4","Re5","Re6","Re7","Re8",
                        "Rf1","Rf2","Rf3","Rf4","Rf5","Rf6","Rf7","Rf8",
                        "Rg1","Rg2","Rg3","Rg4","Rg5","Rg6","Rg7","Rg8",
                        "Rh1","Rh2","Rh3","Rh4","Rh5","Rh6","Rh7","Rh8"]

    const queenMoves = ["Qa1","Qa2","Qa3","Qa4","Qa5","Qa6","Qa7","Qa8",
                        "Qb1","Qb2","Qb3","Qb4","Qb5","Qb6","Qb7","Qb8",
                        "Qc1","Qc2","Qc3","Qc4","Qc5","Qc6","Qc7","Qc8",
                        "Qd1","Qd2","Qd3","Qd4","Qd5","Qd6","Qd7","Qd8",
                        "Qe1","Qe2","Qe3","Qe4","Qe5","Qe6","Qe7","Qe8",
                        "Qf1","Qf2","Qf3","Qf4","Qf5","Qf6","Qf7","Qf8",
                        "Qg1","Qg2","Qg3","Qg4","Qg5","Qg6","Qg7","Qg8",
                        "Qh1","Qh2","Qh3","Qh4","Qh5","Qh6","Qh7","Qh8"]

    const kingMoves = [ "Ka1","Ka2","Ka3","Ka4","Ka5","Ka6","Ka7","Ka8",
                        "Kb1","Kb2","Kb3","Kb4","Kb5","Kb6","Kb7","Kb8",
                        "Kc1","Kc2","Kc3","Kc4","Kc5","Kc6","Kc7","Kc8",
                        "Kd1","Kd2","Kd3","Kd4","Kd5","Kd6","Kd7","Kd8",
                        "Ke1","Ke2","Ke3","Ke4","Ke5","Ke6","Ke7","Ke8",
                        "Kf1","Kf2","Kf3","Kf4","Kf5","Kf6","Kf7","Kf8",
                        "Kg1","Kg2","Kg3","Kg4","Kg5","Kg6","Kg7","Kg8",
                        "Kh1","Kh2","Kh3","Kh4","Kh5","Kh6","Kh7","Kh8"]

    const promotionMoves = ["a1=N","b1=N","c1=N","d1=N","e1=N","f1=N","g1=N","h1=N",
                            "a8=N","b8=N","c8=N","d8=N","e8=N","f8=N","g8=N","h8=N",
                            "a1=B","b1=B","c1=B","d1=B","e1=B","f1=B","g1=B","h1=B",
                            "a8=B","b8=B","c8=B","d8=B","e8=B","f8=B","g8=B","h8=B",
                            "a1=R","b1=R","c1=R","d1=R","e1=R","f1=R","g1=R","h1=R",
                            "a8=R","b8=R","c8=R","d8=R","e8=R","f8=R","g8=R","h8=R",
                            "a1=Q","b1=Q","c1=Q","d1=Q","e1=Q","f1=Q","g1=Q","h1=Q",
                            "a8=Q","b8=Q","c8=Q","d8=Q","e8=Q","f8=Q","g8=Q","h8=Q"]

    const castleMoves = ["0-0", "0-0-0"]

    const allSimpleMoves = pawnMoves.concat(knightMoves).concat(bishopMoves).concat(rookMoves).concat(queenMoves).concat(kingMoves).concat(promotionMoves).concat(castleMoves)
    const allPieceCaptures = knightMoves.concat(bishopMoves).concat(rookMoves).concat(queenMoves).concat(kingMoves)
    const allChecks = []
    const allMates = []
    const allCaptures = []

    pawnMoves.forEach((move) =>{
      allCaptures.push(move +)
    })

    allPieceCaptures.forEach((move) => {
      allCaptures.push(move.substring(0,1) + "x" + x.substring(1, move.length))
    })

    //adding + and # to all the moves we all ready have
    allSimpleMoves.forEach((move) => {
      allChecks.push(`${move}+`)
      allMates.push(`${move}#`)

    });

    const allMoves = allSimpleMoves.concat(allChecks).concat(allMates)

    let allMovesObject = Object.assign({}, ...allMoves.map((move) => ({[move]: 0})));

    return allMovesObject
  }
}
