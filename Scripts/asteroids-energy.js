/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.energy');

ASTEROIDS.energy = (function () {
    var max = 100,
        min = 0,
        current = 100,
        regenRate = 0.4,
        isRegenerating = true,
        lastDrained = new Date().getTime(),
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
            return current === max;
        },
        isAvailable: function (value) {
            return value < current;
        },
        consume: function (value) {
            if (this.isAvailable(value)) {
                current -= value;
                lastDrained = new Date().getTime();
            }
        },
        getAvailable: function () {
            return current;
        },
        canRegen: function () {
            return new Date().getTime() - lastDrained > regenCooldown;
        },
        update: function () {
            if (this.canRegen()) {
                this.regenerate();
            }
        }
    };
    return energy;
}());