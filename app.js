const gamePlay = (function(){

})() ;

const gameBoard = (function(){
    let currentBoard = [
        ['X', 'O', 'O'],
        ['', 'X', 'X'],
        ['X', '', 'O']
    ] ;

    function render() {
        let board = document.getElementById('board') ;
        document.querySelectorAll('.board-tile').forEach(tile => tile.remove());

        for (let row = 0 ; row < currentBoard.length ; row++ ) {
            for (let column = 0 ; column < currentBoard[row].length ; column++) {
                let boardTile = document.createElement('div') ;
                boardTile.className = 'board-tile'
                boardTile.innerText = currentBoard[row][column] ; 
                board.appendChild(boardTile)
            }
        }
    }
    return { currentBoard, render } ;
})() ;

const PlayerFactory = function(name, marker) {
    function getName() { return name } ; 
    function getMarker() { return marker } ;

    return { getName, getMarker } ;
}


