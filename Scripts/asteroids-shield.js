/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.shield');

ASTEROIDS.shield = (function () {
    var energy = ASTEROIDS.energy,
        shield,
        energyConsumption = 0.4,
        upSound = document.getElementById('shield-up'),
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        isActive = false;
        
    shield = {
        draw: function (x, y, radius) {
            context.save();
            context.strokeStyle = 'green';
            context.lineWidth = 5;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.stroke();
            context.closePath();
            context.restore();
        },
        isUp: function () {
            return isActive;
        },
        activate: function (temp) {
            if (temp) {
                upSound.play();
                isActive = true;
            } else {
                if (energy.isAvailable(energyConsumption)) {
                    upSound.play();
                    energy.consume(energyConsumption);
                    isActive = true;
                } else {
                    isActive = false;
                }
            }
        },
        deactivate: function () {
            isActive = false;
        }
    };
    return shield;
}());