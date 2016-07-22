/*jslint node: true */
'use strict';

// global object
var ASTEROIDS = ASTEROIDS || {};

// Create gameboard namespace
ASTEROIDS.namespace('ASTEROIDS.menu');

ASTEROIDS.menu.selectSound = document.getElementById('menu-select');

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
    show: function (finalScore, enemiesKilled, isHighScore) {
        var scoreMessage = "";
        if (isHighScore === true) {
            scoreMessage = "New high score!: " + finalScore;
            $("#game-over-score").fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
        } else {
            scoreMessage = "Final score: " + finalScore;
        }
        $("#game-over-score").text(scoreMessage);
        $("#game-over-enemies-killed").text("Enemies killed: " + enemiesKilled);
        $("#game-over").show();
        setTimeout(function () { $("#game-over").fadeOut(ASTEROIDS.menu.startMenu.show)}, 4000);
    }
}

ASTEROIDS.menu.waveTransition = {
    show: function (wave) {
        $("#wave-transition").show();
        $("#wave-element").text("WAVE " + wave);
        setTimeout(function () { $("#wave-transition").fadeOut(ASTEROIDS.gameBoard.waveStart) }, 5000);
    }
}

