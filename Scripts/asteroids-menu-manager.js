/*jslint node: true */
'use strict';

// global object
var ASTEROIDS = ASTEROIDS || {};

// Create gameboard namespace
ASTEROIDS.namespace('ASTEROIDS.menu');

ASTEROIDS.menu.selectSound = document.getElementById('menu-select');
ASTEROIDS.menu.scoreClearedSound = document.getElementById('score-cleared-sound');

$(".menu-button").on('mouseover', function () {
    ASTEROIDS.menu.selectSound.play();
});

$("#new-game").on('click', function () {
    $('#main-menu').hide();
    ASTEROIDS.gameBoard.start();
});

$("#resume-game").on('click', function () {
    $('#pause-menu').hide();
    ASTEROIDS.gameBoard.resume();
});

$("#exit-game").on('click', function () {
    $('#pause-menu').hide();
    ASTEROIDS.gameBoard.gameOver();
});

$("#reset-scores").on('click', function () {
    $("#scores-cleared").text("Cleared!");
    $("#scores-cleared").show().fadeOut(500);
    ASTEROIDS.scoreManager.clearHighScore();
    ASTEROIDS.menu.scoreClearedSound.play();
});

ASTEROIDS.menu.startMenu = {
    show: function () {
        $("#main-menu").show();
    }
};

ASTEROIDS.menu.pauseMenu = {
    show: function () {
        $("#pause-menu").show();
    }
}

ASTEROIDS.menu.gameOver = {
    show: function (finalScore, enemiesKilled, isHighScore, isWin) {
        var scoreMessage = "",
            gameEndMessage = "";

        if (isHighScore === true) {
            scoreMessage = "New high score!: " + finalScore;
            $("#game-over-score").fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
        } else {
            scoreMessage = "Final score: " + finalScore;
        }

        if (isWin === true) {
            gameEndMessage = "YOU WIN!";
        } else {
            gameEndMessage = "GAME OVER";
        }

        $("#game-end-message").text(gameEndMessage);
        $("#game-over-score").text(scoreMessage);
        $("#game-over-enemies-killed").text("Enemies killed: " + enemiesKilled);
        $("#game-over").show();

        setTimeout(function () { $("#game-over").fadeOut(ASTEROIDS.menu.startMenu.show)}, 4000);
    }
}

ASTEROIDS.menu.waveTransition = {
    show: function (wave, deathBonus, seconds) {
        var waveTransition = $("#wave-transition");
        waveTransition.empty();
        waveTransition.fadeIn(1000);
        waveTransition.append("<p class=\"game-over-text\">WAVE " + wave + "</p>");

        if (deathBonus && deathBonus > -1) {
            waveTransition.append("<p class=\"game-over-text\">No death bonus: " + deathBonus + "</p>").fadeIn(300);
        }

        if (seconds && seconds > 0) {
            waveTransition.append("<p class=\"game-over-text\">Fast clear bonus: 100 * " + seconds + " = " + (100 * seconds).toString() + "</p>").fadeIn(300);
        }

        setTimeout(function () { $("#wave-transition").fadeOut(ASTEROIDS.gameBoard.waveStart) }, 5000);
    }
}