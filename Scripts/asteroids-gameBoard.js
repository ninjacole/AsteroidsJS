/*jslint node: true */
'use strict';

// global object
var ASTEROIDS = ASTEROIDS || {};

// Create gameboard namespace
ASTEROIDS.namespace('ASTEROIDS.gameBoard');

ASTEROIDS.gameBoard = (function () {
    // Dependencies
    var player = ASTEROIDS.player,
        weapon = ASTEROIDS.weapon,
        powerup = ASTEROIDS.Powerup,
        Asteroid = ASTEROIDS.Asteroid,
        asteroids = [],
        powerupMessage = ASTEROIDS.PowerupMessage,
        //---------------- Private properties
        bulletsFired = weapon.getBulletsFired(),
        gameBoard,
        currentWave = 1,
        totalWaves = 10,
        fps = 50,
        intervalId = 0,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d');
    
    // public properties
    gameBoard = {
        updateAll: function () {
            player.update();
            var i;
            for (i = 0; i < bulletsFired.length; i += 1) {
                if (bulletsFired[i].canTravel()) {
                    bulletsFired[i].update();
                } else {
                    bulletsFired.splice(i, 1);
                }
            }
            
            for (i = 0; i < asteroids.length; i += 1) {
                asteroids[i].update();
            }
//            if (asteroids_game.powerups.length < 5) {
//                var rand = Math.random() * 1000;
//                if (rand > 998) {
//                    var randAbilityNum = Math.random() * 15;
//                    var randAbility = "";
//                    if (randAbilityNum < 3) {
//                        randAbility = 'speed';
//                    } else if (randAbilityNum >= 3 && randAbilityNum < 6) {
//                        randAbility = 'double';
//                    } else if (randAbilityNum >= 6 && randAbilityNum < 10) {
//                        randAbility = 'rear'
//                    } else if (randAbilityNum >= 10 && randAbility < 15) {
//                        randAbility = 'spread'
//                    }
//                    asteroids_game.powerups.push(new asteroids_game.powerup(context, Math.random() * canvas.width, Math.random() * canvas.height, randAbility));
//                }
//            }
//
//            for (var i = 0; i < asteroids_game.powerupMessages.length; i++) {
//                if (asteroids_game.powerupMessages[i].duration < asteroids_game.powerupMessages[i].runningTime) {
//                    asteroids_game.powerupMessages.splice(i, 1);
//                }
//            }
//

//
//            for (var i = 0; i < asteroids_game.asteroids.length; i++) {
//                for (var j = 0; j < asteroids_game.bullets.length; j++) {
//                    var dx = asteroids_game.asteroids[i].x - asteroids_game.bullets[j].x;
//                    var dy = asteroids_game.asteroids[i].y - asteroids_game.bullets[j].y;
//
//                    var distance = Math.sqrt(dx * dx + dy * dy);
//                    if (distance < asteroids_game.asteroids[i].width) {
//                        asteroids_game.asteroids[i].explosionSound.play();
//                        if (asteroids_game.asteroids[i].size > 1) {
//                            var randy = Math.random() > .5 ? -1 : 1;
//                            var randx = Math.random() > .5 ? -1 : 1;
//                            var asterAfterx = asteroids_game.asteroids[i].vx + randx;
//                            var asterAftery = asteroids_game.asteroids[i].vy + randy;
//
//                            asteroids_game.asteroids.push(new asteroids_game.asteroid(
//                            asteroids_game.asteroids[i].x + 8,
//                            asteroids_game.asteroids[i].y + 8,
//                            asterAfterx,
//                            asterAftery,
//                            2,
//                            asteroids_game.asteroids[i].size - 1))
//
//                            asteroids_game.asteroids.push(new asteroids_game.asteroid(
//                            asteroids_game.asteroids[i].x - 8,
//                            asteroids_game.asteroids[i].y - 8,
//                            asterAfterx,
//                            asterAftery,
//                            2,
//                            asteroids_game.asteroids[i].size - 1))
//                        }
//                        asteroids_game.asteroids.splice(i, 1);
//                        asteroids_game.bullets.splice(j, 1);
//                        break;
//                    }
//                }
//            }
        },
        drawAll: function () {
            var i;
            context.clearRect(0, 0, canvas.width, canvas.height);
            player.draw();
            
            for (i = 0; i < bulletsFired.length; i += 1) {
                bulletsFired[i].draw();
            }
            
//            for (var i = 0; i < asteroids_game.bullets.length; i++) {
//                asteroids_game.bullets[i].draw();
//            }
//            for (var i = 0; i < asteroids_game.powerups.length; i++) {
//                asteroids_game.powerups[i].draw();
//            }
//            for (var i = 0; i < asteroids_game.powerupMessages.length; i++) {
//                asteroids_game.powerupMessages[i].draw();
//            }
            for (i = 0; i < asteroids.length; i += 1) {
                asteroids[i].draw();
            }
        },
        spawnAsteroids: function () {
            var asteroidCount = currentWave * 5 - 2,
                velCox,
                velCoy,
                x,
                y,
                vx,
                vy,
                spinFactor,
                size,
                config,
                i;
            
            for (i = 0; i < asteroidCount; i += 1) {
                velCox = Math.random() < 0.5 ? -1 : 1;
                velCoy = Math.random() < 0.5 ? -1 : 1;
                x = Math.random() * canvas.width;
                y = Math.random() * canvas.height;
                vx = Math.ceil(Math.random() * 5 * velCox);
                vy = Math.ceil(Math.random() * 5 * velCoy);
                spinFactor = Math.ceil(Math.random() * 4);
                size = Math.ceil(Math.random() * 6);
                config = {
                    x: x,
                    y: y,
                    vx: vx,
                    vy: vy,
                    spinFactor: spinFactor,
                    size: size
                };
                asteroids.push(new Asteroid(config));
            }
        },
        loop: (function () {
            var loops = 0,
                skipTicks = 1000 / fps,
                maxFrameSkip = 10,
                nextGameTick = new Date().getTime();
            return function () {
                loops = 0;
                
                while (new Date().getTime() > nextGameTick && loops < maxFrameSkip) {
                    ASTEROIDS.gameBoard.updateAll();
                    nextGameTick += skipTicks;
                    loops += 1;
                }
                if (loops) {
                    ASTEROIDS.gameBoard.drawAll();
                }
            };
        }()),
        start: function () {
            this.spawnAsteroids();
            intervalId = setInterval(this.loop, 0);
        },
        stop: function () {
            
        }
    };
    return gameBoard;
    
}());
