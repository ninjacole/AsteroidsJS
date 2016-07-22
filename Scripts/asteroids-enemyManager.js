/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.enemyManager');

ASTEROIDS.enemyManager = function (getCurrentWave, isTransition) {
    var enemyManager = {},
        Enemy = ASTEROIDS.enemy,
        that = this,
        lastEnemySpawnedTime = Date.now(),
        enemyCounter = 0,
        enemyPeriodicity = 15000 / getCurrentWave(),
        maxEnemies = getCurrentWave() * 3,
        enemiesKilled = 0,
        isTimerReady = function () {
            return Date.now() - lastEnemySpawnedTime > (15000 / (getCurrentWave()));
        },
        isLessThanMaxSpawned = function () {
            return enemyCounter < maxEnemies;
        };
    
    that.canSpawnEnemy = function () {
        return isTimerReady() && isLessThanMaxSpawned() && isTransition() === false;
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
    
    that.getEnemiesKilled = function () {
        return enemiesKilled;
    };
    
    that.enemyKilled = function () {
        enemiesKilled += 1;
    };
};