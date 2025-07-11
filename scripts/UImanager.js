
const UIManager = (
    function () {
        const manager = GameManager;

        // BUTTONS
        const btnGameControl = document.querySelector('#btn-game-control');
        const btnEditP1Name = document.querySelector('#btn-edit-player1-name');
        const btnEditP2Name = document.querySelector('#btn-edit-player2-name');
        const btnResetScores = document.querySelector('#btn-reset-scores');
        const btnCloseUpdateName = document.querySelector('.close-button');
        const btnCloseResultModal = document.querySelector('#btn-close-game-result-modal');
        const btnsThemeButtons = Array.from(document.querySelectorAll('.btn-theme-select'));

        // OTHER INPUTS
        const togPlayAgainstComputer = document.querySelector('.computer-toggle');
        const computerToggleSwitch = document.querySelector('#computer-toggle-switch');

        // PLAYER ELEMENTS
        const playerNames = [document.querySelector('#player1-name'), document.querySelector('#player2-name')];
        const playerScores = [document.querySelector('#player1-score'), document.querySelector('#player2-score')];
        const playerDisplay = [document.querySelector('#player1-display'), document.querySelector('#player2-display')];

        // MODAL ELEMENTS
        const updateNameModal = document.querySelector('#update-name-modal');
        const updateNameButton = document.querySelector('#submit-new-name-button');
        const updateNameForm = document.querySelector('#update-player-name-form');
        const gameResultModal = document.querySelector('#game-result-modal');
        const gameResultMessage = document.querySelector('.modal-message');

        // MAIN ELEMENTS
        const gameGrid = document.querySelector('.board');
        const UIMessage = document.querySelector('#UI-message');
        const attribLink = document.querySelector('#attrib-link');

        // CELL VALUES BASED ON THEME AND STATE
        const cellValues = ['', 'X', 'O'];

        // ENUM SIMULATER IN CASE 'START' BUTTON NEEDS ADDITIONAL FUNCTIONALITY
        const controlButtonActions = {
            NONE: 0,
            START: 1,

        }

        // Background image attributions
        const themeIds = {
            forest: 0,
            beach: 1,
            city: 2
        }
        let currentThemeId = themeIds.forest;
        const attributions = [
            { 'attrib': 'Background image by wirestock on freepik.com', 'link': 'https://www.freepik.com/author/wirestock' },
            { 'attrib': 'Background image mrsiraphol on freepik.com', 'link': 'https://www.freepik.com/author/mrsiraphol' },
            { 'attrib': 'Background image evening_tao on freepik.com', 'link': 'https://www.freepik.com/author/evening-tao' }];

        // MODULE VARS
        let controlBtnAction = controlButtonActions.NONE;
        let updatingNameFor = 0;

        // setupGame is the only method called from the
        // global context
        // sets up event listeners and prepares UI to start the game
        const setupGame = () => {
            // Add event listeners

            // Set theme
            btnsThemeButtons.forEach((btn) => {
                btn.addEventListener('click', (event) => {
                    const btn = event.target.closest('.btn-theme-select');
                    if (btn) {
                        const newTheme = btn.id;
                        const root = document.documentElement;
                        root.className = newTheme;
                        currentThemeId = themeIds[newTheme];
                        setAttribution();
                    }
                });
            })

            gameGrid.addEventListener('click', (event) => {
                // Grabs id when cell is clicked
                const cell = event.target.closest('.board-cell');
                if (cell) {
                    const cellId = cell.id;
                    // If the gameActive = false then
                    // all calls to makeMove will be ignored
                    makeMove(cellId);
                }
            });

            btnGameControl.addEventListener('click', () => {
                // Set this up so that the control button
                // could have expanded funtionality
                // but as of now not needed
                if (controlBtnAction === controlButtonActions.START) {
                    startGame();
                }
            });

            btnEditP1Name.addEventListener('click', () => {
                // set 'updatingNameFor' so that
                // the update player name modal
                // knows which name to update
                updatingNameFor = 0;
                updateNameModal.classList.add('show');
            });

            btnEditP2Name.addEventListener('click', () => {
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

            // listener on submit button on update player name form
            updateNameButton.addEventListener('click', (event) => {
                event.preventDefault();
                const isValid = updateNameForm.reportValidity();
                if (isValid) {
                    // Get the new name and reset input field
                    const newName = document.querySelector('#new-player-name').value;
                    document.querySelector('#new-player-name').value = '';

                    // Set the appropiate player name, update the display and close the modal
                    manager.players[updatingNameFor].setPlayerName(newName);
                    playerNames[updatingNameFor].textContent = manager.players[updatingNameFor].getPlayerName();
                    updateNameModal.classList.remove('show');
                }
            });

            computerToggleSwitch.addEventListener('click', () => {
                // Toggle whether or not to play against the computer
                const newValue = togPlayAgainstComputer.checked;
                manager.setPlayAgainstComputer(newValue);
            })

            btnCloseResultModal.addEventListener('click', (event) => {
                // Close the game result modal
                event.preventDefault();
                gameResultModal.classList.remove('show');
            })

            btnResetScores.addEventListener('click', () => {
                // Reset scores then update UI
                for (let i = 0; i < 2; i++) {
                    manager.players[i].resetScore();
                }
                updatePlayerScores();
            })


            // Prepare the UI for the game

            // Set UI message
            UIMessage.textContent = "Click Start to Play!";

            // Set attrib link
            setAttribution();

            // Set control button text
            btnGameControl.textContent = "START";
            controlBtnAction = controlButtonActions.START;
            updateGameBoard();
        };

        const setAttribution = () => {
            attribLink.textContent = attributions[currentThemeId]['attrib'];
            attribLink.setAttribute('href', attributions[currentThemeId]['link']);
        };

        const startGame = () => {
            if (!manager.isGameActive()) {
                // Set game to active
                manager.setGameActive();
                manager.resetGameOver();

                // Hide control buttons
                btnGameControl.classList.add('hide-element');
                btnResetScores.classList.add('hide-element');

                // Clear board of previous game 
                manager.resetGameBoard();

                // Reset Player area display
                playerDisplay[0].classList.remove('game-winner')
                playerDisplay[1].classList.remove('game-winner')

                // Show whos turn it is, remove winning cell highlighting
                // and update board
                updatePlayerTurn();
                removeWinningCells();
                updateGameBoard();
            }
        };

        // Pass the coord down to the GameManager object and process result
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
                // Get whos turn it is
                const currentTurn = manager.whosTurnIsIt();
                // Update UI Message
                UIMessage.textContent = `${currentTurn.playerName}'s Turn!`;
                // Set player display to show whos turn it is
                playerDisplay[currentTurn.id].classList.add('player-turn-active')
                playerDisplay[1 - currentTurn.id].classList.remove('player-turn-active');
                // If user is playing against computer, have computer make its move
                if (currentTurn.id === 1 && manager.isComputerOpponent()) {
                    makeComputerMove();
                }
            } else {
                // Game is over, wrap it up!
                wrapUpGame();
            }

        };

        const makeComputerMove = () => {
            // Randomly choose cells until
            // an open spot is found
            let computerMoveValid = false;
            let rowId;
            let colId;
            while (!computerMoveValid) {
                rowId = Math.floor(Math.random() * 3);
                colId = Math.floor(Math.random() * 3);
                if (manager.getCellValue(rowId, colId) === 0) {
                    computerMoveValid = true;
                }
            }
            // Simulate same format that comes from clicking on a cell
            makeMove(`${rowId}-${colId}`);
        };

        const wrapUpGame = () => {
            // Show game control buttons
            btnGameControl.classList.remove('hide-element');
            btnResetScores.classList.remove('hide-element');

            // Remove styling for showing whos turn it is
            playerDisplay[0].classList.remove('player-turn-active');
            playerDisplay[1].classList.remove('player-turn-active');


            let UIMessageText;
            if (manager.isGameOver()) {
                // Get who won the game
                const lastWinner = manager.getLastWinnerIndex();

                // -1 = stalemate
                // 0 or 1 = a playerId
                if (lastWinner > -1) {
                    UIMessageText = `GAME OVER! ${manager.players[lastWinner].getPlayerName()} Won. Press Start to Play Again`;
                    // Style the winners display area
                    playerDisplay[lastWinner].classList.add('game-winner');
                    // Update the scores
                    updatePlayerScores();

                    // Get the cells that won the game and style them
                    manager.getWinningPattern().forEach((item) => {
                        const cellId = item.join('-');
                        const cellToUpdate = document.querySelector(`[id="${cellId}"]`);
                        cellToUpdate.classList.add('winning-cell');
                    });
                } else {
                    UIMessageText = `GAME OVER! STALEMATE. Press Start to Play Again`;
                }
                // Set UI message to both main page and game result modal
                // then show the game result modal
                UIMessage.textContent = UIMessageText;
                gameResultMessage.textContent = UIMessageText;
                gameResultModal.classList.add('show');
            }
        }

        const removeWinningCells = () => {
            // Remove 'winning-cell' from all divs
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    const cellToUpdate = document.querySelector(`[id="${i}-${j}"]`);
                    cellToUpdate.classList.remove('winning-cell');
                    cellToUpdate.classList.remove('player1-occupied');
                    cellToUpdate.classList.remove('player2-occupied');
                }
            }
        }

        const updateGameBoard = () => {
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    // Get the status of the current cell
                    const cellValue = manager.getCellValue(i, j);
                    // Get reference to the cell
                    const cellToUpdate = document.querySelector(`[id="${i}-${j}"]`);
                    // Set the display
                    cellToUpdate.textContent = cellValues[cellValue];
                    // If no one has picked the cell yet, highlight it
                    if (cellValue === 0) {
                        cellToUpdate.classList.add('cell-available');
                    } else {
                        cellToUpdate.classList.remove('cell-available');
                        if (cellValue === 1) {
                            cellToUpdate.classList.add('player1-occupied');
                        } else if (cellValue === 2) {
                            cellToUpdate.classList.add('player2-occupied');
                        }
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

