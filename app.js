const gamePlay = (function(){ // Stores the current state of the game.

    let _turnCount = 0 ; // How many turns have been taken in current round?
    let _roundCount = 0 ; // How many rounds have been played in current game?

    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ] ;

    let players = [] ; 

    function turnCountIncrement() {
        console.log(`Turn count incremented from 👉 ${_turnCount}` )
        _turnCount += 1
        console.log(`to 👉 ${_turnCount}`)
    }
    function roundCountIncrement() {
        console.log(`Round count incremented from 👉 ${_roundCount}` )
        _roundCount += 1
        console.log(`to 👉 ${_roundCount}`)
        console.log('New round started...')
    }
    function getTurnCount() {
        return _turnCount
    }
    function getRoundCount() {
        return _roundCount
    }

    function getPlayers() {
        return players
    }

    function newRound() {
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ] ;
        _turnCount = 0 ; 
        gameDisplay.renderBoard()
        console.log('gamePlay.newRound() invoked')
    }

    function getBoard() {
        return board
    }

    function changeBoard(row, column, marker) {
        board[row][column] = `${marker}`
    }

    function newGame() {
        console.log('gamePlay.newGame() invoked')
        _roundCount = 0 ;
        while (players.length !== 0) players.pop() ; 
        newRound() ; 
    }

    return { 
        board, getBoard, players, getPlayers, newRound, changeBoard, newGame,
        getTurnCount, getRoundCount, roundCountIncrement, turnCountIncrement
    }
})() ;



const gameLogic = (function() { // Performs the logic necessary to make changes to the game.

    const _Player = function(name, marker) {
        let wins = 0 ;
        function getName() { return name } ; 
        function getMarker() { return marker } ;
        function getWins() { return wins }
        function incrementWins() { wins += 1 }
    
        return { getName, getMarker, getWins, incrementWins } ;
    }

    function createPlayer() {
        if (gamePlay.getPlayers().length < 2) { // Makes sure we don't create more then 2 players
            let name = document.getElementById('name').value;
            let marker = document.querySelector('input[name="marker"]:checked').value;
            let newPlayer = _Player(name, marker) ; 
            gamePlay.getPlayers().push(newPlayer)
            console.log('new player created')

            if (gamePlay.getPlayers().length === 1) { // Re-renders the form for player 2 (1st marker taken = no more options)
                // re-renderForm() for player 2
                console.log('re-rendering form')
            } else {
                console.log('removing form') // removes form entirely and commences the game
            }

        } else console.log('error')
    }

    function whosTurnItIs() { // Logic to figure out which player's turn it is. Alternates who goes first by round
        let playerTurn = null
        if (gamePlay.getRoundCount() === 1 || gamePlay.getRoundCount() === 3) {
            gamePlay.getTurnCount() % 2 === 0 ? playerTurn = gamePlay.getPlayers()[1] : playerTurn = gamePlay.getPlayers()[0] ;
            return playerTurn
        } else {
            gamePlay.getTurnCount() % 2 === 0 ? playerTurn = gamePlay.getPlayers()[0] : playerTurn = gamePlay.getPlayers()[1] ;
            return playerTurn
        }

    }

    function evaluateGameWin() {
        console.log('evaluateGameWin() invoked')
        let player1 = gamePlay.getPlayers()[0] ;
        let player2 = gamePlay.getPlayers()[1] ;

        if (gamePlay.getRoundCount() === 3 || player1.getWins() === 2 || player2.getWins() === 2) {            
            if (player1.getWins() > player2.getWins()) {
                console.log(`${player1.getName()} wins the game!`)
                gameDisplay.renderWinMessage(player1.getName())
                gamePlay.newGame()
            } else if (player1.getWins() < player2.getWins()) {
                console.log(`${player2.getName()} wins the game!`)
                gameDisplay.renderWinMessage(player2.getName())
                gamePlay.newGame()
            } else {
                console.log("Tie Game... No on wins, no one loses.")
                gamePlay.newGame()
            }
        }
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

         for (let i = 0 ; i < getWinningPositions().length ; i++) {
            if (getWinningPositions()[i].join() === [ "X", "X", "X" ].join()){
                console.log('Player X wins the round') ;
                whosTurnItIs().incrementWins()
                gamePlay.newRound()
                gamePlay.roundCountIncrement()
                gameDisplay.renderScoreCounter()
                evaluateGameWin()
                return;
            } else if (getWinningPositions()[i].join() === ["O", "O", "O"].join()) {
                console.log('Player O wins the round') ;
                whosTurnItIs().incrementWins()
                gamePlay.newRound()
                gamePlay.roundCountIncrement()
                gameDisplay.renderScoreCounter()
                evaluateGameWin()

                return;
            }
        }
        gamePlay.turnCountIncrement()
        if (gamePlay.getTurnCount() === 9) {
            console.log('tie game')
            gamePlay.newRound()
            gamePlay.roundCountIncrement()
            evaluateGameWin()
            return; 
         }
    }

    return { createPlayer, whosTurnItIs, evaluateRoundWin }
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
                        gamePlay.changeBoard(row, column, gameLogic.whosTurnItIs().getMarker())
                        gameLogic.evaluateRoundWin()
                    }
                }) ;

                board.appendChild(boardTile) ;
            }
        }
    }

    function renderScoreCounter() {
        player1 = document.getElementById('p1-score') ;
        player2 = document.getElementById('p2-score') ;

        if (gamePlay.getPlayers().length === 0) {
            player1.innerText = `Player 1: `
            player2.innerText = `Player 2: `
            return
        }

        if (gamePlay.getPlayers()[0].getWins() > 0) {
            player1.innerText = `Player 1: ${gamePlay.getPlayers()[0].getWins()}`
        } else {
            player1.innerText = `Player 1: `
        }

        if (gamePlay.getPlayers()[1].getWins() > 0) {
            player2.innerText = `Player 2: ${gamePlay.getPlayers()[1].getWins()}`
        } else {
            player2.innerText = `Player 2: `
        }
    }

    function renderWinMessage(winner) {
        document.getElementById('main-game').style.display = 'none'

        let scoreMsgCard = document.getElementById('end-game-card')
        scoreMsgCard.style.display = 'block'
        document.getElementById('score-msg').innerText = `${winner} WON THE GAME!`
    }

    return { renderBoard, renderScoreCounter, renderWinMessage } ;
})() ;

gameDisplay.renderBoard()

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault()
    gameLogic.createPlayer()
})

document.getElementById('play-again-btn').addEventListener('click', function(event) {
    document.getElementById('main-game').style.display = 'flex'
    document.getElementById('end-game-card').style.display = 'none'
    gameDisplay.renderScoreCounter()
})