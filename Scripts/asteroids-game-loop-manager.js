/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.GameLoopManager');

ASTEROIDS.GameLoopManager = function () {
    var that = this;
	that.lastTime = 0;
	that.gameTick = null;
	that.prevElapsed = 0;
	that.prevElapsed2 = 0;

	that.run = function (gameTick) {
		var prevTick = that.gameTick;
		that.gameTick = gameTick;
		if (this.lastTime === 0) {
			// Once started, the loop never stops.
			// But this function is called to change tick functions.
			// Avoid requesting multiple frames per frame.
			window.requestAnimationFrame(function () { that.tick(); });
			that.lastTime = 0;
		}
	};
	
	that.stop = function () {
		that.run(null);
	};

	that.tick = function () {
        var timeNow, elapsed, smoothElapsed;
		if (that.gameTick !== null) {
			window.requestAnimationFrame(function () { that.tick(); });
		} else {
			that.lastTime = 0;
			return;
		}
		timeNow = Date.now();
		elapsed = timeNow - this.lastTime;
		if (elapsed > 0) {
			if (this.lastTime !== 0) {
				if (elapsed > 1000) {
                    // Cap max elapsed time to 1 second to avoid death spiral
					elapsed = 1000;
                }
				// Hackish fps smoothing
				smoothElapsed = (elapsed + this.prevElapsed + this.prevElapsed2) / 3;
				this.gameTick(0.001 * smoothElapsed);
				this.prevElapsed2 = this.prevElapsed;
				this.prevElapsed = elapsed;
			}
			this.lastTime = timeNow;
		}
	};
};