/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.energy');

ASTEROIDS.energy = (function () {
    var max = 25,
        min = 0,
        current = 25,
        regenRate = 0.05,
        isRegenerating = true,
        lastDrained = Date.now(),
        regenCooldown = 1000,
        energy;
    
    energy = {
        regenerate: function () {
            if (!this.isAtMaximum()) {
                current += regenRate;
                isRegenerating = true;
            }
        },
        isAtMaximum: function () {
            return current >= max;
        },
        isAvailable: function (value) {
            return value < current;
        },
        consume: function (value) {
            if (this.isAvailable(value)) {
                current -= value;
                lastDrained = Date.now();
            }
        },
        getAvailable: function () {
            return current;
        },
        canRegen: function () {
            return Date.now() - lastDrained > regenCooldown;
        },
        update: function () {
            if (this.canRegen()) {
                this.regenerate();
            }
        }
    };
    return energy;
}());