
const UIManager = (
    function () {
        const manager = GameManager;
        const btnGameControl = document.querySelector('#btn-game-control');
        const gameGrid = document.querySelector('.board');
        const playerNames = [document.querySelector('#player1-name'), document.querySelector('#player2-name')];
        const playerScores = [document.querySelector('#player1-score'), document.querySelector('#player2-score')];
        const UIMessage = document.querySelector('#UI-message');
        const btnEditP1Name = document.querySelector('#btn-edit-player1-name');
        const btnEditP2Name = document.querySelector('#btn-edit-player2-name');
        const playerDisplay = [document.querySelector('#player1-display'), document.querySelector('#player2-display')];

        const btnCloseUpdateName = document.querySelector('.close-button');
        const updateNameModal = document.querySelector('#update-name-modal');
        const updateNameButton = document.querySelector('#submit-new-name-button');
        const updateNameForm = document.querySelector('#update-player-name-form');
        const cellValues = ['', 'X', 'O'];
        const controlButtonActions = {
            NONE: 0,
            START: 1,

        }
        let controlBtnAction = controlButtonActions.NONE;
        let updatingNameFor = 0;

        const setupGame = () => {
            // Add event listeners
            gameGrid.addEventListener('click', (event) => {
                const cell = event.target.closest('.board-cell');
                if (cell) {
                    const cellId = cell.id;
                    console.log(`Cell: ${cellId} clicked`);
                    makeMove(cellId);
                }
            });

            btnGameControl.addEventListener('click', () => {
                console.log(`Control button clicked for action: ${controlBtnAction}`);
                if (controlBtnAction === controlButtonActions.START) {
                    console.log('Calling startGame method');
                    startGame();
                }
            });

            btnEditP1Name.addEventListener('click', () => {
                console.log('Edit Player 1 Name Button Clicked');
                updatingNameFor = 0;
                updateNameModal.classList.add('show');
            });

            btnEditP2Name.addEventListener('click', () => {
                console.log('Edit Player 2 Name Button Clicked');
                updatingNameFor = 1;
                updateNameModal.classList.add('show');
            });

            btnCloseUpdateName.addEventListener('click', () => {
                updateNameModal.classList.remove('show');
            });

            updateNameModal.addEventListener('click', (event) => {
                if (event.target == updateNameModal) {
                    updateNameModal.classList.remove('show');
                }
            });

            updateNameButton.addEventListener('click', (event) => {
                event.preventDefault();
                const isValid = updateNameForm.reportValidity();
                if (isValid) {
                    const newName = document.querySelector('#new-player-name').value;
                    document.querySelector('#new-player-name').value = '';
                    manager.players[updatingNameFor].setPlayerName(newName);
                    playerNames[updatingNameFor].textContent = manager.players[updatingNameFor].getPlayerName();
                    updateNameModal.classList.remove('show');
                }
            });

            // Set UI message
            UIMessage.textContent = "Click Start to Play!";

            // Set control button text
            btnGameControl.textContent = "START";
            controlBtnAction = controlButtonActions.START;
            updateGameBoard();
        };

        const startGame = () => {
            if (!manager.isGameActive()) {
                console.log('STARTING GAME');
                // Set game to active
                manager.setGameActive();
                manager.resetGameOver();
                // Hide control button
                btnGameControl.classList.add('hide-element');
                manager.resetGameBoard();

                playerDisplay[0].classList.remove('game-winner')
                playerDisplay[1].classList.remove('game-winner')
                updatePlayerTurn();
                removeWinningCells();
                updateGameBoard();
            }
        };

        const makeMove = (coord) => {
            if (manager.isGameActive()) {
                const moveWasValid = manager.makeMove(coord);
                if (moveWasValid) {
                    updateGameBoard();
                    updatePlayerTurn();
                }
            }
        };

        const updatePlayerScores = () => {
            for (let i = 0; i <= 1; i++) {
                playerScores[i].textContent = manager.players[i].getScore();
            }
        };

        const updatePlayerTurn = () => {
            if (manager.isGameActive()) {
                const currentTurn = manager.whosTurnIsIt();
                UIMessage.textContent = `${currentTurn.playerName}'s Turn!`;
                playerDisplay[currentTurn.id].classList.add('player-turn-active')
                playerDisplay[1 - currentTurn.id].classList.remove('player-turn-active');
            } else {
                wrapUpGame();
            }

        }



        const wrapUpGame = () => {
            btnGameControl.classList.remove('hide-element');
            playerDisplay[0].classList.remove('player-turn-active')
            playerDisplay[1].classList.remove('player-turn-active')
            if (manager.isGameOver()) {
                const lastWinner = manager.getLastWinner();
                if (lastWinner > -1) {
                    UIMessage.textContent = `GAME OVER! ${manager.players[lastWinner].getPlayerName()} Won. Press Start to Play Again`;
                    playerDisplay[lastWinner].classList.add('game-winner');
                    updatePlayerScores();
                    manager.getWinningPattern().forEach((item) => {
                        const cellId = item.join('-');
                        const cellToUpdate = document.querySelector(`[id="${cellId}"]`);
                        cellToUpdate.classList.add('winning-cell');

                    })
                } else {
                    UIMessage.textContent = `GAME OVER! STALEMATE. Press Start to Play Again`;

                }
            }
        }

        const removeWinningCells = () => {
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    const cellToUpdate = document.querySelector(`[id="${i}-${j}"]`);
                    cellToUpdate.classList.remove('winning-cell');
                }
            }
        }

        const updateGameBoard = () => {
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    const cellValue = manager.getCellValue(i, j);
                    const cellToUpdate = document.querySelector(`[id="${i}-${j}"]`);
                    cellToUpdate.textContent = cellValues[cellValue];
                    if (cellValue === 0) {
                        cellToUpdate.classList.add('cell-available');
                    } else {
                        cellToUpdate.classList.remove('cell-available');
                    }
                }
            }
        };

        return {
            setupGame,
        };
    }
)();

UIManager.setupGame();

