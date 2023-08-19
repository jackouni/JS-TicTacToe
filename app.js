const gamePlay = (function(){ // Controls the flow of events and stores the state of the game.
    let board = [
        ['X', 'Y', 'O'],
        ['O', 'X', 'O'],
        ['Y', 'X', 'X']
    ] ;
    return { board }
})() ;

const gameLogic = (function() { // Performs the logic necessary to make changes to the game.

})() ; 

const gameBoard = (function(){ // Controls the elements and display rendering of the board.

    function render() {
        let board = document.getElementById('board') ;
        document.querySelectorAll('.board-tile').forEach(tile => tile.remove());

        for (let row = 0 ; row < gamePlay.board.length ; row++ ) {
            for (let column = 0 ; column < gamePlay.board[row].length ; column++) {
                let boardTile = document.createElement('div') ;
                boardTile.className = 'board-tile'
                boardTile.innerText = gamePlay.board[row][column] ; 
                board.appendChild(boardTile)
            }
        }
    }
    return { render } ;
})() ;

const PlayerFactory = function(name, marker) {
    function getName() { return name } ; 
    function getMarker() { return marker } ;

    return { getName, getMarker } ;
}



