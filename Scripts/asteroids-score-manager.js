/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.ScoreManager');

ASTEROIDS.scoreManager = {
    getHighScore: function () {
        if (!localStorage.getItem('highscore')) {
            return 0;
        } else {
            return localStorage.getItem('highscore');
        }
    },
    isHighScore: function (score) {
        return score > ASTEROIDS.scoreManager.getHighScore();
    },
    setHighScore: function (score) {
        if (ASTEROIDS.scoreManager.isHighScore(score)) {
            localStorage.setItem('highscore', score);
        }
    },
    clearHighScore: function () {
        localStorage.clear();
    }
};