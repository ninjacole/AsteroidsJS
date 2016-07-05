/*jslint node: true */
'use strict';

// global object
var ASTEROIDS = ASTEROIDS || {};

// Create gameboard namespace
ASTEROIDS.namespace('ASTEROIDS.pauseMenu');
ASTEROIDS.namespace('ASTEROIDS.WaveTransition');
ASTEROIDS.namespace('ASTEROIDS.gameOverScreen');

ASTEROIDS.gameOverScreen = (function () {
    var gameOverScreen,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        start,
        cb,
        duration = 4000;
    
    gameOverScreen = {
        draw: function () {
            if (Date.now() - start < duration) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.save();
                context.fillStyle = 'white';
                context.font = '80px consolas';
                context.textAlign = 'center';
                context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
                context.restore();
            } else {
                cb();
            }
        },
        configure: function (startTime, callback) {
            start = startTime;
            cb = callback;
        }
    };
    return gameOverScreen;
}());

ASTEROIDS.WaveTransition = function (wave, transitionStart, transitionLength, callback) {
    var canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
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

ASTEROIDS.PauseMenu = function (pausedItems, pauseMenuItemChosenCallback, resumeCallback) {
    var key = ASTEROIDS.key,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
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
        
        if (key.isDown(key.ENTER)) {
            pauseMenuItemChosenCallback(selectedPauseItem);
        }
        if (key.isDown(key.DOWN)) {
            if (canDown) {
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
        
        if (key.isDown(key.UP)) {
            if (canUp) {
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
        
        if (key.isDown(key.ESC)) {
            if (canResume) {
                resumeCallback();
            }
        } else {
            canResume = true;
        }
    };
};