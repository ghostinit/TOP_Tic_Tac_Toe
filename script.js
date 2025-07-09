const createPlayer = function (name) {
    let score = 0;
    return {
        getPlayerName() {
            return name;
        },

    }
}

const GameBoard = (
    function () {
        let board = [[0, 0, 0], [2, 2, 2], [0, 0, 0]];
        let winningPatterns = [
            [[0, 0], [0, 1], [0, 2]], // Top row
            [[1, 0], [1, 1], [1, 2]], // Middle Row
            [[2, 0], [2, 1], [2, 2]], // Bottom Row
            [[0, 0], [1, 0], [2, 0]], // First column
            [[0, 1], [1, 1], [2, 1]], // 2nd Column
            [[0, 2], [1, 2], [2, 2]], // 3rd Column
            [[0, 0], [1, 1], [2, 2]], // Top Left to Bottom Right
            [[0, 2], [1, 1], [2, 0]], // Top right to bottom left
        ]
        const printBoard = () => {
            board.forEach((row) => {
                console.log(row.join(' '));
            });

        };
        const resetBoard = () => {
            board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        };
        const playerMove = (playerId, rowId, colId) => {
            if ((playerId === 1) || (playerId === 2)) {

                if (board[rowId][colId] === 0) {
                    board[rowId][colId] = playerId;
                    console.log(`Player ${playerId} move applied at [${rowId}][${colId}]`);
                    return true;
                } else {
                    console.log('Invalid move, spot already occupied')
                    return false;
                }
            } else {
                console.log(`Invalid playerId: ${playerId}. Can only be 1 or 2`);
                return false
            }
        }
        const checkForWinner = () => {
            let winningPlayerId = 0;
            let winningPattern = -1;
            for (let checkPlayerId = 1; checkPlayerId < 3; checkPlayerId++) {
                for (let patternId = 0; patternId < winningPatterns.length; patternId++) {
                    // winningPatterns.forEach((pattern) => {
                    const coord0 = winningPatterns[patternId][0];
                    const coord1 = winningPatterns[patternId][1];
                    const coord2 = winningPatterns[patternId][2];
                    // console.log(coord0);
                    if (
                        (board[coord0[0]][coord0[1]] === checkPlayerId) &&
                        (board[coord1[0]][coord1[1]] === checkPlayerId) &&
                        (board[coord2[0]][coord2[1]] === checkPlayerId)
                    ) {
                        winningPlayerId = checkPlayerId;
                        winningPattern = patternId;
                    }
                    if (winningPlayerId !== 0) {
                        break;
                    }
                }
                if (winningPlayerId !== 0) {
                    break;
                }
            }
            return { winnder: winningPlayerId, pattern: winningPattern };
        }
        return {
            printBoard,
            resetBoard,
            playerMove,
            checkForWinner,
        }
    }

)();

// GameBoard.printBoard();
// GameBoard.playerMove(1, 0, 0);
// GameBoard.printBoard();
// GameBoard.playerMove(2, 1, 0);
GameBoard.printBoard();
console.log(GameBoard.checkForWinner());