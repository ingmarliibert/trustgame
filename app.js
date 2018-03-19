var simulateMove = function (playerMove, characterMove) {
    if (playerMove === 0 && characterMove === 0) {
        return [0, 0]
    } else if (playerMove === 1 && characterMove === 1) {
        return [2, 2]
    } else if (playerMove === 1 && characterMove === 0) {
        return [-1, 3]
    } else if (playerMove === 0 && characterMove === 1) {
        return [3, -1]
    }
};

var getCharacterMove = function (characterType, lastPlayerMove, numberOfMove, hasPlayerCheated) {
    switch (characterType) {
        case "always cooperate":
            return 1;
        case "always cheat":
            return 0;
        case "copycat":
            return Number(lastPlayerMove);
        case "grudger":
            return Number(!hasPlayerCheated);
        case "detective": {
            if (numberOfMove === 0 || numberOfMove === 2 || numberOfMove === 3) return 1;
            if (numberOfMove === 1) return 0;
            if (!hasPlayerCheated) return 0;
            if (hasPlayerCheated) return Number(lastPlayerMove)
        }
    }
};

var simulateGame = function (moves) {
    var playerMove, enemyMove, lastPlayerMove, hasPlayerCheated, enemy, enemyMoves, playerMoveNumber, score;

    var enemiesList = ["copycat", "always cheat", "always cooperate", "grudger", "detective"];
    var enemiesMoves = [5, 4, 4, 5, 7];

    playerMoveNumber = 0;
    score = 0;
    lastPlayerMove = 1;
    for (var i = 0; i < enemiesList.length; i++) {
        enemy = enemiesList[i];
        enemyMoves = enemiesMoves[i];
        hasPlayerCheated = false;

        for (var j = 0; j < enemyMoves; j++) {
            playerMove = moves[playerMoveNumber++];
            enemyMove = getCharacterMove(enemy, lastPlayerMove, j, hasPlayerCheated);

            if (enemy === "detective") {
                if (j <= 3) hasPlayerCheated = hasPlayerCheated || !Boolean(playerMove);
            } else hasPlayerCheated = hasPlayerCheated || !Boolean(playerMove);

            lastPlayerMove = playerMove;
            score += simulateMove(playerMove, enemyMove)[0];
        }
    }

    return score;
};

var getInput = function (mode) {
    var input = $("#input").val();
    if (mode === "validate") {
        return {score: Number(input.substring(0,2)), moves: input.substring(2).split("").map(Number), originalInput: input}
    } else if (mode === "calculate") {
        return {moves: input.split("").map(Number)}
    }
};

$(window).ready(function () {

    $("#calculate").click(function () {
        var input = getInput("calculate");
        var score = simulateGame(input.moves);
        $("#output").val("Your score is: " + String(score));
        $("#output_div").css("display", "block")
    });

    $("#validate").click(function() {
        var input = getInput("validate");
        $("#output_div").css("display", "block");

        if (input.originalInput.length !== 27) {
            $("#output").val("Your input isn't valid!");
            return;
        }
        var score = simulateGame(input.moves);
        if (score !== input.score) {
            $("#output").val("Your input isn't valid!");
            return;
        }

        $("#output").val("Your input is valid!");
    })

});