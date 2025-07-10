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
        const board = GameBoard;

        const isGameActive = () => {
            return gameActive;
        };

        const setGameInactive = () => {
            gameActive = false;
        };

        const setGameActive = () => {
            gameActive = true;
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
            isGameActive,
            setGameInactive,
            setGameActive,
            getCellValue,
            whosTurnIsIt,
            resetGameBoard,
        }
    }
)();