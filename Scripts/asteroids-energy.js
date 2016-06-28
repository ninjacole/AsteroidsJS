/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.energy');

ASTEROIDS.energy = (function () {
    var utils = ASTEROIDS.utils,
        max = 100,
        min = 0,
        current = 100,
        regenRate = 0.2,
        isRegenerating = true,
        lastDrained = utils.getCurrentTime(),
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
                lastDrained = utils.getCurrentTime();
            }
        },
        getAvailable: function () {
            return current;
        },
        canRegen: function () {
            return utils.getCurrentTime() - lastDrained > regenCooldown;
        },
        update: function () {
            if (this.canRegen()) {
                this.regenerate();
            }
        }
    };
    return energy;
}());