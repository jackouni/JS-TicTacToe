const gamePlay = (function(){ // Controls the flow of events and stores the state of the game.

    let _turnCount = 1 ; // What turn is the round on?
    let _roundCount = 1 ; // What round is the game on?

    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ] ;

    let players = [] ; 

    return { board, players, _turnCount }
})() ;

const gameLogic = (function() { // Performs the logic necessary to make changes to the game.
    
    const _Player = function(name, marker) {
        function getName() { return name } ; 
        function getMarker() { return marker } ;
    
        return { getName, getMarker } ;
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

    function whosTurnIsIt() {
        let playerTurn = null

        gamePlay._turnCount % 2 === 0 ? playerTurn = gamePlay.players[1] : playerTurn = gamePlay.players[0] ;

        gamePlay._turnCount++
        return playerTurn
    }

    function evaluateWin() {

    }

    return { createPlayer, whosTurnIsIt, evaluateWin }
})() ; 

const gameDisplay = (function(){ // Controls the elements and rendering of the game in browser.

    function renderBoard() {
        let board = document.getElementById('board') ;
        document.querySelectorAll('.board-tile').forEach(tile => tile.remove()) ;

        for (let row = 0 ; row < gamePlay.board.length ; row++ ) {
            for (let column = 0 ; column < gamePlay.board[row].length ; column++) {
                let boardTile = document.createElement('div') ;
                boardTile.className = 'board-tile' ;
                boardTile.innerText = gamePlay.board[row][column] ; 

                boardTile.addEventListener('click', function(event) {
                    if (event.target.innerText === '') {
                        event.target.innerText = gameLogic.whosTurnIsIt().getMarker()
                    }
                }) ;

                board.appendChild(boardTile) ;
            }
        }
    }
    return { renderBoard } ;
})() ;

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault()
    gameLogic.createPlayer()
})



