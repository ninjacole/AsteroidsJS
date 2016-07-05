/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.weapon');

ASTEROIDS.weapon = (function () {
    // private variables
    var weapon,
        Bullet = ASTEROIDS.Bullet,
        EnemyBullet = ASTEROIDS.EnemyBullet,
        bulletsFired = [],
        enemyBulletsFired = [],
        type = 'single',
        fireSound = document.getElementById('laserSound'),
        enemyFireSound = document.getElementById('enemy-shoot');
    // public api
    weapon = {
        setType: function (value) {
            type = value;
        },
        getType: function () {
            return type;
        },
        playFireSound: function (times) {
            var i;
            for (i = 0; i < times; i += 1) {
                fireSound.currentTime = 0;
                fireSound.play();
            }
        },
        fire: function (playerData, rearGun) {
            if (type === 'single') {
                this.playFireSound(1);
                bulletsFired.push(new Bullet(playerData.centerBulletPoint, playerData.vx, playerData.vy, playerData.rotation));
            } else if (type === 'double') {
                this.playFireSound(2);
                bulletsFired.push(new Bullet(playerData.rightBulletPoint, playerData.vx, playerData.vy, playerData.rotation));
                bulletsFired.push(new Bullet(playerData.leftBulletPoint,  playerData.vx, playerData.vy, playerData.rotation));
            } else if (type === 'spread') {
                this.playFireSound(3);
                bulletsFired.push(new Bullet(playerData.rightBulletPoint, playerData.vx, playerData.vy, playerData.rotation));
                bulletsFired.push(new Bullet(playerData.centerBulletPoint, playerData.vx, playerData.vy, playerData.rotation));
                bulletsFired.push(new Bullet(playerData.leftBulletPoint, playerData.vx, playerData.vy, playerData.rotation));
            }
        },
        getBulletsFired: function () {
            return bulletsFired;
        },
        getEnemyBulletsFired: function () {
            return enemyBulletsFired;
        },
        resetEnemyBulletsFired: function () {
            enemyBulletsFired.splice(0, enemyBulletsFired.length);
        },
        fireEnemyBullet: function (x, y, playerx, playery) {
            enemyFireSound.play();
            enemyBulletsFired.push(new EnemyBullet(x, y, playerx, playery));
        }
    };
    return weapon;
}());