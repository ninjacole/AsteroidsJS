/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.enemyManager');

ASTEROIDS.enemyManager = function (getCurrentWave) {
    var enemyManager = {},
        Enemy = ASTEROIDS.enemy,
        that = this,
        lastEnemySpawnedTime = Date.now(),
        enemyCounter = 0,
        enemyPeriodicity = 15000 / getCurrentWave(),
        maxEnemies = getCurrentWave() * 3,
        isTimerReady = function () {
            return Date.now() - lastEnemySpawnedTime > (15000 / (getCurrentWave()));
        },
        isLessThanMaxSpawned = function () {
            return enemyCounter < maxEnemies;
        };
    
    that.canSpawnEnemy = function () {
        return isTimerReady() && isLessThanMaxSpawned();
    };
    
    that.createEnemy = function () {
        enemyCounter += 1;
        lastEnemySpawnedTime = Date.now();
        return new Enemy();
    };
    
    that.reset = function () {
        enemyPeriodicity = 15000 / getCurrentWave();
        maxEnemies = getCurrentWave() * 3;
        enemyCounter = 0;
        lastEnemySpawnedTime = Date.now();
    };
};