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
    isHighScore: function () {
        return ASTEROIDS.scoreManager.currentScore > ASTEROIDS.scoreManager.getHighScore();
    },
    setHighScore: function () {
        if (ASTEROIDS.scoreManager.isHighScore(ASTEROIDS.scoreManager.currentScore)) {
            localStorage.setItem('highscore', ASTEROIDS.scoreManager.currentScore);
        }
    },
    clearHighScore: function () {
        localStorage.clear();
    },
    currentScore: 0,
    noDeathBonus: function (wave) {
        var bonus = wave * 2500;
        ASTEROIDS.scoreManager.currentScore += bonus;
        return bonus;
    },
    powerupGained: function (position) {
        ASTEROIDS.scoreManager.currentScore += 100;
        ASTEROIDS.scoreManager.scoreMessages.push(new ASTEROIDS.ScoreMessage(100, position));
    },
    enemyKilled: function (position) {
        ASTEROIDS.scoreManager.currentScore += 1000;
        ASTEROIDS.scoreManager.scoreMessages.push(new ASTEROIDS.ScoreMessage(1000, position));
    },
    asteroidDestroyed: function (sizeOfAsteroid, position) {
        var points = 600 / sizeOfAsteroid;
        console.log(sizeOfAsteroid);
        ASTEROIDS.scoreManager.currentScore += points;
        ASTEROIDS.scoreManager.scoreMessages.push(new ASTEROIDS.ScoreMessage(points, position));
    },
    speedBonus: function (waveSeconds) {
        ASTEROIDS.scoreManager.currentScore += waveSeconds * 100;
    },
    scoreMessages: []
};