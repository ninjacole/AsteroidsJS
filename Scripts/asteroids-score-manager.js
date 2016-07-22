/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.ScoreManager');


ASTEROIDS.ScoreManager = function () {
    var that = this,
        storage = localStorage,
        highscores = 'highscores';


    that.getScores = function () {
        if (!storage.getItem(highscores)) {
            return [];
        } else {
            return JSON.parse(storage.getItem(highscores));
        }
    };

    that.isHighScore = function (score) {
        var scores = that.getScores(),
            i,
            isHighScore;
        if (scores.length === 0) {
            return true;
        }

        for (i = 0; i < scores.length; scores += 1) {
            if (score > scores[i].value) {
                return true;
            }
        }
        return false;
    };

    that.addHighScore = function (score, name) {
        var scores = that.getScores();
        scores.push({ name: name, value: score });
        scores.sort(function (a, b) { return b.value - a.value; });
        scores = scores.splice(0, 9);
        storage.setItem(highscores, JSON.stringify(scores));
    };

    that.clearScores = function () {
        storage.clear();
    };
};