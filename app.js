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
        _turnCount += 1
    }
    function roundCountIncrement() {
        _roundCount += 1
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

    function getBoard() {
        return board
    }

    function resetPlayers() {
        while (players.length !== 0) players.pop() ; 
    }

    function changeBoard(row, column, marker) {
        board[row][column] = `${marker}`
    }

    function newRound() {
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ] ;
        _turnCount = 0 ; 
        gameDisplay.renderBoard()
        gameDisplay.renderScoreCounter()
        console.log('gamePlay.newRound() invoked')
    }

    function newGame() {
        console.log('gamePlay.newGame() invoked')
        _roundCount = 0 ;
        resetPlayers()
        gameDisplay.renderForm(true, '') 
    }

    return { 
        board, getBoard, getPlayers, newRound, changeBoard, newGame,
        getTurnCount, getRoundCount, roundCountIncrement, turnCountIncrement, resetPlayers
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
            if (gamePlay.getPlayers().length === 0){ // Is it the 1st or 2nd player??
                let name = document.getElementById('name').value;
                let marker = document.querySelector('input[name="marker"]:checked').value;
                let newPlayer = _Player(name, marker) ; 
                gamePlay.getPlayers().push(newPlayer)
                console.log('new player created')
            } else {
                let name = document.getElementById('name').value;
                let player1Marker = gamePlay.getPlayers()[0].getMarker()
                let marker = null
                player1Marker === 'X' ? marker = 'O' : marker = 'X' ; 
                let newPlayer = _Player(name, marker) ; 
                gamePlay.getPlayers().push(newPlayer)
                console.log('new player created')
            }

            if (gamePlay.getPlayers().length === 1) { // Logic for re-rendering the form for Player 2 and removing form
                console.log('re-rendering form')
                let player1Marker = gamePlay.getPlayers()[0].getMarker()
                let marker = null
                player1Marker === 'X' ? marker = 'O' : marker = 'X' ; 
                gameDisplay.renderForm(false, marker)
            } else gameDisplay.removeForm()

        } else console.log('ERROR: Only 2 players can be created.')
    }

    function whosTurnItIs() { // Logic to figure out which player's turn it is (alternates who goes 1st each round)
        let playerTurn = null
        if (gamePlay.getRoundCount() === 1 || gamePlay.getRoundCount() === 3) {
            gamePlay.getTurnCount() % 2 === 0 ? playerTurn = gamePlay.getPlayers()[1] : playerTurn = gamePlay.getPlayers()[0] ;
            return playerTurn
        } else {
            gamePlay.getTurnCount() % 2 === 0 ? playerTurn = gamePlay.getPlayers()[0] : playerTurn = gamePlay.getPlayers()[1] ;
            return playerTurn
        }

    }

    function evaluateGameWin() { // Evaluate if the game is over - Someone wins or it's a tie
        console.log('evaluateGameWin() invoked')
        let player1 = gamePlay.getPlayers()[0] ;
        let player2 = gamePlay.getPlayers()[1] ;

        if (gamePlay.getRoundCount() === 3 || player1.getWins() === 2 || player2.getWins() === 2) {            
            if (player1.getWins() > player2.getWins()) {
                console.log(`${player1.getName()} wins the game!`)
                gameDisplay.renderWinMessage(player1.getName())
                gamePlay.resetPlayers()
            } else if (player1.getWins() < player2.getWins()) {
                console.log(`${player2.getName()} wins the game!`)
                gameDisplay.renderWinMessage(player2.getName())
                gamePlay.resetPlayers()
            } else {
                console.log("Tie Game... No on wins, no one loses.")
                gameDisplay.renderTieGameMessage()
                gamePlay.resetPlayers()
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
        document.getElementById('main-game').style.display = 'flex'
        document.querySelectorAll('.board-tile').forEach(tile => tile.remove()) ;

        for (let row = 0 ; row < gamePlay.getBoard().length ; row++ ) {
            for (let column = 0 ; column < gamePlay.getBoard()[row].length ; column++) {
                let boardTile = document.createElement('div') ;
                boardTile.className = 'board-tile' ;
                boardTile.innerText = gamePlay.getBoard()[row][column] ; 
                boardTile.row = row
                boardTile.column = column
                if (boardTile.row === 0 || boardTile.row === 1) {
                    boardTile.style.borderBottom = 'solid black 2px'
                }
                if (boardTile.column === 1) {
                    boardTile.style.borderRight = 'solid black 2px'
                    boardTile.style.borderLeft = 'solid black 2px'
                }

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
        player1Name = gamePlay.getPlayers()[0].getName() ;
        player2Name = gamePlay.getPlayers()[1].getName() ;


        if (gamePlay.getPlayers().length === 0) {
            return
        } else {
            if (gamePlay.getPlayers()[0].getWins() > 0) {
                player1.innerText = `${player1Name} : ${gamePlay.getPlayers()[0].getWins()}`
            } else {
                player1.innerText = `${player1Name} : `
            }

            if (gamePlay.getPlayers()[1].getWins() > 0) {
                player2.innerText = `${player2Name} : ${gamePlay.getPlayers()[1].getWins()}`
            } else {
                player2.innerText = `${player2Name} : `
            }

            let playersTurn = gameLogic.whosTurnItIs().getName()
            document.getElementById('whos-turn').innerText = `${playersTurn}'s turn...`
        }
    }

    const removeMainGame = () => document.getElementById('main-game').style.display = 'none'

    function renderWinMessage(winner) {
        document.getElementById('main-game').style.display = 'none'
        document.getElementById('main-game').setAttribute('open', 'false')
        document.getElementById('end-game-card').style.display = 'flex'
        document.getElementById('end-game-card').setAttribute('open', 'true')
        document.getElementById('score-msg').innerText = `${winner.toUpperCase()} - WINS THE GAME!`
    }

    function renderTieGameMessage() {
        document.getElementById('main-game').style.display = 'none'
        document.getElementById('main-game').setAttribute('open', 'false')
        document.getElementById('end-game-card').style.display = 'flex'
        document.getElementById('end-game-card').setAttribute('open', 'true')
        document.getElementById('score-msg').innerText = "TIE GAME"
    }

    const removeWinMessage = () => {
        document.getElementById('end-game-card').style.display = 'none'
        document.getElementById('end-game-card').setAttribute('open', 'false')
    }

    function renderForm(player1Form, marker) {
        if ( player1Form ) { // Is this the form for player 1 or 2??
            document.getElementById('start-game-card').style.display = 'flex'
            document.getElementById('start-game-card').setAttribute('open', 'true')
            document.getElementById('marker-container').style.display = 'flex'
            document.getElementById('player2-marker-msg').style.display = 'none'
            document.getElementById('player2-marker-msg').innerText = 'Player 2, your marker is 👉 '
        } else {
            document.getElementById('marker-container').style.display = 'none'
            document.getElementById('player2-marker-msg').style.display = 'block'
            document.getElementById('player2-marker-msg').innerText += ` ${marker}`
        }
    }
    
    function removeForm() { 
        document.getElementById('start-game-card').style.display = 'none' 
        document.getElementById('start-game-card').setAttribute('open', 'false')
        document.getElementById('main-game').setAttribute('open', 'true')
        document.getElementById('main-game').style.display = 'flex'
        gamePlay.newRound() ;
    }

    return { renderBoard, renderScoreCounter, renderWinMessage, renderForm, removeForm, removeWinMessage, removeMainGame, renderTieGameMessage } ;
})() ;

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault()
    gameLogic.createPlayer()
})

document.getElementById('play-again-btn').addEventListener('click', () => {
    gameDisplay.removeWinMessage()
    gamePlay.newGame()
})


gamePlay.newGame()