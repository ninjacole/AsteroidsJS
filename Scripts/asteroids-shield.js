/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.shield');

ASTEROIDS.shield = (function () {
    var energy = ASTEROIDS.energy,
        shield,
        energyConsumption = 0.25,
        upSound = document.getElementById('shield-up'),
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        isActive = false,
        isFreeShieldActive = false,
        freeShieldTimer = 2500;
        
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
            return isActive || isFreeShieldActive;
        },
        activate: function () {
            if (energy.isAvailable(energyConsumption)) {
                if (!isActive) {
                    upSound.play();
                }
                energy.consume(energyConsumption);
                isActive = true;
            } else {
                isActive = false;
            }
        },
        deactivate: function () {
            isActive = false;
        },
        freeShield: function () {
            if (!isActive) {
                upSound.play()
            }
            isFreeShieldActive = true;
            setTimeout(function () { isFreeShieldActive = false; }, freeShieldTimer);
        }
    };
    return shield;
}());