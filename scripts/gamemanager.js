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
        let gameOver = false;
        let gameActive = false;
        let playerTurn = 1;
        let lastWinner = 0;
        let lastWinningPattern = [];
        let playAgainstComputer = false;

        const board = GameBoard;

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
            const coords = coord.split('-');
            const rowId = coords[0];
            const colId = coords[1];
            const isValidMove = board.playerMove(playerTurn, rowId, colId);
            if (isValidMove) {
                const winResults = board.checkForWinner();
                if (winResults.winner === -1) {
                    // No winner
                    gameOver = true;
                    gameActive = false;
                    lastWinner = 0;
                } else if (winResults.winner === 0) {
                    // Game can continue

                } else {
                    // Somebody won!
                    gameOver = true;
                    gameActive = false;
                    lastWinner = winResults.winner;
                    players[lastWinner - 1].incrementScore();
                    lastWinningPattern = winResults.pattern;
                }
                playerTurn = 3 - playerTurn;
            }
            return isValidMove;
        };


        const getCellValue = (rowId, colId) => {
            return board.getCellValue(rowId, colId);
        };

        const whosTurnIsIt = () => {
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