
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

        const cellValues = ['', 'X', 'O'];
        const controlButtonActions = {
            NONE: 0,
            START: 1,
        }
        let controlBtnAction = controlButtonActions.NONE;

        const setupGame = () => {
            // Add event listeners
            gameGrid.addEventListener('click', (event) => {
                const cell = event.target.closest('.board-cell');
                if (cell) {
                    const cellId = cell.id;
                    console.log(`Cell: ${cellId} clicked`);
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
            });

            btnEditP2Name.addEventListener('click', () => {
                console.log('Edit Player 2 Name Button Clicked');
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
                // Hide control button
                btnGameControl.classList.add('hide-element');
                manager.resetGameBoard();
                const currentTurn = manager.whosTurnIsIt();
                UIMessage.textContent = `${currentTurn.playerName}'s Turn!`;
                playerDisplay[currentTurn.id].classList.add('player-turn-active')
            }
        };

        const updateGameBoard = () => {
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    const cellValue = manager.getCellValue(i, j);
                    const cellToUpdate = document.querySelector(`[id="${i}-${j}"]`);
                    cellToUpdate.textContent = cellValues[cellValue];
                }
            }
        };

        return {
            setupGame,
        };
    }
)();

UIManager.setupGame();

