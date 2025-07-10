// Module function for controlling
// and monitoring the gameboard
const GameBoard = (
    function () {
        // Board setup as 2D array -> board[rows][cols]
        // 0 = spot open
        // 1 = occupied by player 1
        // 2 = occupied by player 2
        let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        // Coordinates of all possible winning patterns
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

        // Print to board to console for easy viewing
        const printBoard = () => {
            board.forEach((row) => {
                console.log(row.join(' '));
            });

        };

        // Reset the board to open
        const resetBoard = () => {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    board[i][j] = 0;
                }
            }
        };

        // Get the values of specific cell in the board
        const getCellValue = (rowId, colId) => {
            return board[rowId][colId];
        }

        // Log the playermove
        // Returns true if the move was valid, false if not
        const playerMove = (playerId, rowId, colId) => {
            // Only player IDs of 1 and 2 are accepted
            if ((playerId === 1) || (playerId === 2)) {
                // Verify the selected spot is empty
                if (board[rowId][colId] === 0) {
                    board[rowId][colId] = playerId;
                    console.log(`Player ${playerId} move applied at [${rowId}][${colId}]`);
                    return true;
                } else {
                    // Log error to console and return false
                    console.log('Invalid move, spot already occupied')
                    return false;
                }
            } else {
                // Log invalid player ID to console and return false
                console.log(`Invalid playerId: ${playerId}. Can only be 1 or 2`);
                return false
            }
        }

        // Checks to see if anyone has won the game
        // returns { winningPlayerId, winningPattern }
        // For winningPlayerId
        // -1 = board is full, stalemate
        //  0 = game can continue
        //  1 = player 1 has emerged victorious
        //  2 = player 2 has conquered all
        //
        // Winning patterns
        // -1 = No one has won, no pattern
        // 0 - 7 = the pattern that won, used by display logic to show winning combo
        const checkForWinner = () => {
            // Initial values for return props
            let winningPlayerId = -1;
            let winningPattern = -1;
            // Iterate through each player
            for (let checkPlayerId = 1; checkPlayerId < 3; checkPlayerId++) {
                // Iterate through each pattern
                for (let patternId = 0; patternId < winningPatterns.length; patternId++) {
                    // Grab the coordinates of the pattern
                    const coord0 = winningPatterns[patternId][0];
                    const coord1 = winningPatterns[patternId][1];
                    const coord2 = winningPatterns[patternId][2];

                    // See if all of those coordinates match the current player
                    if (
                        (board[coord0[0]][coord0[1]] === checkPlayerId) &&
                        (board[coord1[0]][coord1[1]] === checkPlayerId) &&
                        (board[coord2[0]][coord2[1]] === checkPlayerId)
                    ) {
                        // Set values for return if winner found
                        winningPlayerId = checkPlayerId;
                        winningPattern = patternId;
                    }
                    // Break inner For loop if winner found
                    if (winningPlayerId !== -1) {
                        break;
                    }
                }
                // Break outer for loop if winner found
                if (winningPlayerId !== -1) {
                    break;
                }
            }
            // If no winner was discovered, see if the board is full
            // If 0 exists anywhere on the board, the game may continue
            if (winningPlayerId === -1) {
                for (let i = 0; i < board.length; i++) {
                    if (board[i].includes(0)) {
                        winningPlayerId = 0;
                        break;
                    }
                }

            }
            return { winner: winningPlayerId, pattern: winningPatterns[winningPattern] };
        }
        return {
            printBoard,
            resetBoard,
            getCellValue,
            playerMove,
            checkForWinner,
        }
    }

)();
