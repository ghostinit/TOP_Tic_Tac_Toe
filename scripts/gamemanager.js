const createPlayer = function (id) {
    let name = "Player " + id;
    let score = 0;
    return {
        getPlayerName() {
            return name;
        },
        setPlayerName(newName) {
            name = newName;
        },
        getPlayerId() {
            return id;
        },
        incrementScore() {
            score += 1;
        },
        getScore() {
            return score;
        },
        resetScore() {
            score = 0;
        }
    }
}


const GameManager = (
    function () {
        const players = [createPlayer(1), createPlayer(2)];
        const board = GameBoard;

        let gameOver = false;
        let gameActive = false;
        let playerTurn = 1;
        let lastWinner = 0;
        let lastWinningPattern = [];
        let playAgainstComputer = false;

        // GETTER AND SETTER METHODS
        const setPlayAgainstComputer = (value) => {
            console.log(`setting play against computer mode: ${value}`)
            playAgainstComputer = value;
        };

        const isComputerOpponent = () => {
            return playAgainstComputer;
        }

        const isGameActive = () => {
            return gameActive;
        };

        const resetGameActive = () => {
            gameActive = false;
        };

        const setGameActive = () => {
            gameActive = true;
        };

        const isGameOver = () => {
            return gameOver;
        };

        const setGameOver = () => {
            gameOver = true;
        };

        const resetGameOver = () => {
            gameOver = false;
        };

        const getLastWinner = () => {
            return lastWinner - 1;
        };

        const getWinningPattern = () => {
            return lastWinningPattern;
        };

        const makeMove = (coord) => {
            // Coords come is as '0-1' -> 'ROW-COL'
            // Split on '-' to get rowId and colId
            const coords = coord.split('-');
            const rowId = coords[0];
            const colId = coords[1];

            // Send the move to gameboard
            const isValidMove = board.playerMove(playerTurn, rowId, colId);

            if (isValidMove) {
                // If the move was valid see if there was a winner or stalemate
                const winResults = board.checkForWinner();

                // Stalemate, game over but no winner
                if (winResults.winner === -1) {
                    // No winner
                    gameOver = true;
                    gameActive = false;
                    lastWinner = 0;

                    // Game still in progress, do nothing
                    // but leave for future possible functionality
                } else if (winResults.winner === 0) {
                    // Game can continue

                    // Remaining possible values are 1 & 2
                } else {
                    // Set gameover vars
                    gameOver = true;
                    gameActive = false;
                    lastWinner = winResults.winner;
                    players[lastWinner - 1].incrementScore();
                    lastWinningPattern = winResults.pattern;
                }
                // Toggle player turn
                // playerTurn is either 1 or 2
                // So if playerTurn is 1, the result will be 2
                // if playerTurn is 2, result will be 1
                playerTurn = 3 - playerTurn;
            }
            return isValidMove;
        };


        const getCellValue = (rowId, colId) => {
            return board.getCellValue(rowId, colId);
        };

        const whosTurnIsIt = () => {
            // Subtract 1 from player turn for use as
            // indices of arrays in the UImanager object
            return { id: (playerTurn - 1), playerName: players[playerTurn - 1].getPlayerName() };
        };

        const resetGameBoard = () => {
            board.resetBoard();
        }

        return {
            players,
            setPlayAgainstComputer,
            isComputerOpponent,
            isGameActive,
            resetGameActive,
            setGameActive,
            isGameOver,
            setGameOver,
            resetGameOver,
            getLastWinner,
            getWinningPattern,
            makeMove,
            getCellValue,
            whosTurnIsIt,
            resetGameBoard,
        }
    }
)();