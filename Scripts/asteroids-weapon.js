/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.weapon');

ASTEROIDS.weapon = (function () {
    // private variables
    var weapon,
        Bullet = ASTEROIDS.Bullet,
        bulletsFired = [],
        type = 'single',
        fireSound = document.getElementById('laserSound');
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
        fire: function (playerData, rotation) {
            if (type === 'single') {
                this.playFireSound(1);
                bulletsFired.push(new Bullet(playerData, rotation, 0));
            } else if (type === 'double') {
                this.playFireSound(2);
                bulletsFired.push(new Bullet(playerData, rotation, 2));
                bulletsFired.push(new Bullet(playerData, rotation, -2));
            } else if (type === 'rear') {
                this.playFireSound(2);
                bulletsFired.push(new Bullet(playerData, rotation + 180, 0));
                bulletsFired.push(new Bullet(playerData, rotation, 0));
            } else if (type === 'spread') {
                this.playFireSound(3);
                bulletsFired.push(new Bullet(playerData, rotation, 0));
                bulletsFired.push(new Bullet(playerData, rotation + 45, 0));
                bulletsFired.push(new Bullet(playerData, rotation - 45, 0));
            }
        },
        getBulletsFired: function () {
            return bulletsFired;
        }
        
    };
    return weapon;
}());