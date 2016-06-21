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
        Powerup = ASTEROIDS.Powerup,
        Asteroid = ASTEROIDS.Asteroid,
        asteroids = [],
        powerups = [],
        powerupMessage = ASTEROIDS.PowerupMessage,
        //---------------- Private properties
        bulletsFired = weapon.getBulletsFired(),
        gameBoard,
        currentWave = 1,
        totalWaves = 10,
        fps = 50,
        intervalId = 0,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        splitAsteroid = function (asteroid, bulletVX, bulletVY) {
            var config1 = {},
                config2 = {},
                afterVX1,
                afterVY1,
                afterVX2,
                afterVY2,
                asteroid1,
                asteroid2,
                randAngleX1,
                randAngleX2,
                randAngleY1,
                randAngleY2;
            
            randAngleX1 = Math.random() * 180;
            randAngleX2 = Math.random() * 180;
            randAngleY1 = Math.random() * 180;
            randAngleY2 = Math.random() * 180;
            
            afterVX1 = Math.sin((Math.PI / 180) * (180 - randAngleX1)) + bulletVX * 0.25;
            afterVX2 = Math.sin((Math.PI / 180) * (180 + randAngleX2)) + bulletVX * 0.25;
            
            afterVY1 = Math.cos((Math.PI / 180) * (180 - randAngleY1)) + bulletVY * 0.25;
            afterVY2 = Math.cos((Math.PI / 180) * (180 + randAngleY2)) + bulletVY * 0.25;

            
            if (afterVX1 > 20) {
                afterVX1 = 20;
            } else if (afterVX1 < -20) {
                afterVX1 = -20;
            }
            if (afterVX2 > 20) {
                afterVX2 = 20;
            } else if (afterVX2 < -20) {
                afterVX2 = -20;
            }
            
            if (afterVY1 > 20) {
                afterVY1 = 20;
            } else if (afterVY1 < -20) {
                afterVY1 = -20;
            }
            if (afterVY1 > 20) {
                afterVY1 = 20;
            } else if (afterVY1 < -20) {
                afterVY1 = -20;
            }
            config1 = {
                x: asteroid.getX() + 8,
                y: asteroid.getY() + 8,
                vx: afterVX1,
                vy: afterVY1,
                spinFactor: 2,
                size: asteroid.getSize() - 1
            };
            config2 = {
                x: asteroid.getX() - 8,
                y: asteroid.getY() - 8,
                vx: afterVX2,
                vy: afterVY2,
                spinFactor: 2,
                size: asteroid.getSize() - 1
            };
            asteroid1 = new Asteroid(config1);
            asteroid2 = new Asteroid(config2);

            asteroids.push(asteroid1);
            asteroids.push(asteroid2);
        },
        detectBulletAsteroidCollision = function () {
            var i,
                j,
                dx,
                dy,
                distance,
                randx,
                randy,
                asterAfterx,
                asterAftery,
                asteroidsToSplit = [],
                asteroidsToRemove = [],
                bulletsToRemove = [];
            
            for (i = 0; i < asteroids.length; i += 1) {
                for (j = 0; j < bulletsFired.length; j += 1) {
                    dx = asteroids[i].getX() - bulletsFired[j].getX();
                    dy = asteroids[i].getY() - bulletsFired[j].getY();
                    distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < asteroids[i].getWidth()) {
                        asteroids[i].playSound();
                        if (asteroids[i].getSize() > 1) {
                            splitAsteroid(asteroids[i], bulletsFired[j].getVX(), bulletsFired[j].getVY());
                        } else {
                            powers.push(new Powerup())
                        }
                        asteroids.splice(i, 1);
                        bulletsFired.splice(j, 1);
                    }
                }
            }
        };
    
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
            detectBulletAsteroidCollision();
        },
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
