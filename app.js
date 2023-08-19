const gamePlay = (function(){ // Controls the flow of events and stores the state of the game.

    let _turnCount = 1 ; // What turn is the round on?
    let _roundCount = 1 ; // What round is the game on?

    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ] ;

    let players = [] ; 

    function getBoard() {
        return board
    }

    function newRound() {
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ] ;
        
        gameDisplay.renderBoard()
    }

    function newGame() {

    }

    return { board, getBoard, players, _turnCount, _roundCount, newRound, newGame }
})() ;



const gameLogic = (function() { // Performs the logic necessary to make changes to the game.

    const _Player = function(name, marker) {
        function getName() { return name } ; 
        function getMarker() { return marker } ;
        let wins = 0 ;
    
        return { getName, getMarker, wins } ;
    }

    function createPlayer() {
        if (gamePlay.players.length < 2) { // Makes sure we don't create more then 2 players
            let name = document.getElementById('name').value;
            let marker = document.querySelector('input[name="marker"]:checked').value;
            let player = _Player(name, marker) ; 
            gamePlay.players.push(player)
            console.log('new player created')

            if (gamePlay.players.length === 1) { // Re-renders the form for player 2 (1st marker taken = no more options)
                // re-renderForm() for player 2
                console.log('re-rendering form')
            } else { console.log('removing form') // removes form entirely and commences the game
            }

        } else console.log('error')
    }

    function whosTurnItIs() {
        let playerTurn = null

        gamePlay._turnCount % 2 === 0 ? playerTurn = gamePlay.players[1] : playerTurn = gamePlay.players[0] ;
        return playerTurn
    }

    function evaluateRoundWin() {
        function getWinningPositions() { // Retrieves the specific win positions from current board.
            return [
                [ gamePlay.getBoard()[0][0], gamePlay.getBoard()[0][1], gamePlay.getBoard()[0][2] ],
                [ gamePlay.getBoard()[1][0], gamePlay.getBoard()[1][1], gamePlay.getBoard()[1][2] ],
                [ gamePlay.getBoard()[2][0], gamePlay.getBoard()[2][1], gamePlay.getBoard()[2][2] ],
                [ gamePlay.getBoard()[0][0], gamePlay.getBoard()[1][0], gamePlay.getBoard()[2][0] ],
                [ gamePlay.getBoard()[0][1], gamePlay.getBoard()[1][1], gamePlay.getBoard()[2][1] ],
                [ gamePlay.getBoard()[0][2], gamePlay.getBoard()[1][2], gamePlay.getBoard()[2][2] ],
                [ gamePlay.getBoard()[0][0], gamePlay.getBoard()[1][1], gamePlay.getBoard()[2][2] ],
                [ gamePlay.getBoard()[0][2], gamePlay.getBoard()[1][1], gamePlay.getBoard()[2][0] ]
            ]
         } ;

         if (gamePlay._turnCount === 10) {
            gamePlay.newRound()
            return 
         }

         for (let i = 0 ; i < getWinningPositions().length ; i++) {
            if (getWinningPositions()[i].join() == [ "X", "X", "X" ].join()){
                console.log('Player X wins') ;
                whosTurnItIs().wins += 1 ;
                break
            }
            if (getWinningPositions()[i].join() == ["O", "O", "O"].join()) {
                console.log('Player O wins') ;
                whosTurnItIs().wins += 1 ;
                break
            }
        }
    }

    return { createPlayer, whosTurnItIs, evaluateRoundWin  }
})() ; 



const gameDisplay = (function(){ // Controls the elements and rendering of the game in browser.

    function renderBoard() {
        let board = document.getElementById('board') ;
        document.querySelectorAll('.board-tile').forEach(tile => tile.remove()) ;

        for (let row = 0 ; row < gamePlay.getBoard().length ; row++ ) {
            for (let column = 0 ; column < gamePlay.getBoard()[row].length ; column++) {
                let boardTile = document.createElement('div') ;
                boardTile.className = 'board-tile' ;
                boardTile.innerText = gamePlay.getBoard()[row][column] ; 
                boardTile.row = row
                boardTile.column = column

                boardTile.addEventListener('click', function(event) {
                    if (event.target.innerText === '') {
                        event.target.innerText = gameLogic.whosTurnItIs().getMarker()
                        gamePlay.board[event.target.row][event.target.column] = gameLogic.whosTurnItIs().getMarker()
                        gamePlay._turnCount++
                        gameLogic.evaluateRoundWin()
                    }
                }) ;

                board.appendChild(boardTile) ;
            }
        }
    }
    return { renderBoard } ;
})() ;

gameDisplay.renderBoard()

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault()
    gameLogic.createPlayer()
})



