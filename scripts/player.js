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
