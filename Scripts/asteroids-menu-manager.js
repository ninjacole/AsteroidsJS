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

$("#high-scores").on('click', function () {
    $('#main-menu').hide();
    ASTEROIDS.menu.highScores.show()
});

$("#back-to-main-menu").on('click', function () {
    $('#high-scores-menu').hide();
    ASTEROIDS.menu.startMenu.show();
});

ASTEROIDS.menu.startMenu = {
    show: function () {
        $("#main-menu").show();
    }
};

ASTEROIDS.menu.highScores = {
    show: function () {
        var scoreManager = new ASTEROIDS.ScoreManager(),
            scores = scoreManager.getScores(),
            i;
        $("#high-scores-list").empty();
        for (i = 0; i < scores.length; i += 1) {
            $("#high-scores-list").append("<tr><td>" + scores[i].name + "</td><td>" + scores[i].value + "</td></tr>");
        }
        $("#high-scores-menu").show();
    }
}

ASTEROIDS.menu.GameOver = function (finalScore, enemiesKilled, callback) {
    var that = this,
        canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
        duration = 4000,
        startTime = Date.now();
    
    that.draw = function () {
        if (Date.now() - startTime < duration) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.save();
            context.fillStyle = 'white';
            context.font = '80px consolas';
            context.textAlign = 'center';
            context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 90);
            context.fillText("Final score: " + finalScore, canvas.width / 2, canvas.height / 2);
            context.fillText("Enemies killed: " + enemiesKilled, canvas.width / 2, canvas.height / 2 + 90);
            context.restore();
        } else {
            callback();
        }
    };
};



ASTEROIDS.menu.WaveTransition = function (wave, callback) {
    var canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
        transitionStart = Date.now(),
        transitionLength = 3000,
        that = this;
    
    that.waveTransition = function () {
        if (Date.now() - transitionStart < transitionLength) {
            context.save();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'white';
            context.font = "80px Consolas";
            context.textAlign = "center";
            context.fillText("LEVEL " + wave, canvas.width / 2, canvas.height / 2);
            context.restore();
        } else {
            callback();
        }
    };
};

ASTEROIDS.menu.PauseMenu = function (pausedItems, pauseMenuItemChosenCallback, resumeCallback) {
    var key = ASTEROIDS.key,
        canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
        selectedPauseItem = 0,
        i,
        canDown = false,
        canUp = false,
        canResume = false,
        that = this;
    
    that.drawPauseMenu = function () {
        var newSelectedPauseItem;
        context.save();
        context.font = "50px Consolas";
        context.textAlign = "center";
        context.fillStyle = 'white';
        context.fillText("GAME PAUSED", canvas.width / 2, 100);
        for (i = 0; i < pausedItems.length; i += 1) {
            if (i === selectedPauseItem) {
                context.fillStyle = 'blue';
            } else {
                context.fillStyle = 'white';
            }
            context.fillText(pausedItems[i], canvas.width / 2, (i + 2) * 100);
        }
        context.restore();
        
        if (key.isDown(key.ENTER.keyCode)) {
            pauseMenuItemChosenCallback(selectedPauseItem);
        }
        if (key.isDown(key.DOWN.keyCode)) {
            if (canDown) {
                ASTEROIDS.menu.selectSound.play();
                canDown = false;
                newSelectedPauseItem = selectedPauseItem + 1;
                if (newSelectedPauseItem === pausedItems.length) {
                    selectedPauseItem = 0;
                } else {
                    selectedPauseItem = newSelectedPauseItem;
                }
            }
        } else {
            canDown = true;
        }
        
        if (key.isDown(key.UP.keyCode)) {
            if (canUp) {
                ASTEROIDS.menu.selectSound.play();
                canUp = false;
                newSelectedPauseItem = selectedPauseItem - 1;
                if (newSelectedPauseItem === -1) {
                    selectedPauseItem = pausedItems.length - 1;
                } else {
                    selectedPauseItem = newSelectedPauseItem;
                }
            }
        } else {
            canUp = true;
        }
        
        if (key.isDown(key.ESC.keyCode)) {
            if (canResume) {
                resumeCallback();
            }
        } else {
            canResume = true;
        }
    };
};