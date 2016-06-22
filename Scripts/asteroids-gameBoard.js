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
        PowerupMessage = ASTEROIDS.PowerupMessage,
        powerupTypes = ASTEROIDS.powerupTypes,
        key = ASTEROIDS.key,
        asteroids = [],
        powerups = [],
        powerupMessages = [],
        //---------------- Private properties
        bulletsFired = weapon.getBulletsFired(),
        gameBoard,
        currentWave = 1,
        totalWaves = 10,
        fps = 50,
        intervalId = 0,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        bgPic = document.getElementById('bgpic'),
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
            asteroid1 = new Asteroid(config1, asteroid.getImg());
            asteroid2 = new Asteroid(config2, asteroid.getImg());

            asteroids.push(asteroid1);
            asteroids.push(asteroid2);
        },
        detectPowerupPlayerCollision = function () {
            var i,
                distance,
                dx,
                dy,
                message,
                type;
            for (i = 0; i < powerups.length; i += 1) {
                dx = powerups[i].getX() - player.getX();
                dy = powerups[i].getY() - player.getY();
                distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < powerups[i].getRadius() + player.getHeight()) {
                    player.gainPowerup(powerups[i]);
                    type = powerups[i].getType();
                    if (type === powerupTypes.SPEED) {
                        message = "Speed+! Current speed is " + player.getAccelerationCoefficient().toFixed(1) * 10;
                    } else if (type === powerupTypes.DOUBLE) {
                        message = "Double gun!";
                    } else if (type === powerupTypes.REAR) {
                        message = "Rear gun!";
                    } else if (type === powerupTypes.SPREAD) {
                        message = "Spread gun!";
                    } else if (type === powerupTypes.FIRE_RATE) {
                        message = "Fire rate+! Current fire delay is " + player.getFireRate();
                    }
                    powerupMessages.push(new PowerupMessage(powerups[i].getX(), powerups[i].getY(), message));
                    powerups.splice(i, 1);
                }
            }
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
                asterAftery;
            
            for (i = 0; i < asteroids.length; i += 1) {
                for (j = 0; j < bulletsFired.length; j += 1) {
                    dx = asteroids[i].getCenterX() - bulletsFired[j].getCenterX();
                    dy = asteroids[i].getCenterY() - bulletsFired[j].getCenterY();
                    distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= asteroids[i].getWidth() / 2 + bulletsFired[j].getWidth() / 2) {
                        asteroids[i].playSound();
                        if (asteroids[i].getSize() > 1) {
                            splitAsteroid(asteroids[i], bulletsFired[j].getVX(), bulletsFired[j].getVY());
                        } else {
                            if (Math.random() > 0.7) {
                                powerups.push(new Powerup(asteroids[i].getX(), asteroids[i].getY()));
                            }
                        }
                        asteroids.splice(i, 1);
                        bulletsFired.splice(j, 1);
                        break;
                    }
                }
            }
        };
    
    // public properties
    gameBoard = {
        updateAll: function () {
            if (key.isDown(key.DOWN)) {
                this.spawnAsteroids();
            }
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
            
            for (i = 0; i < powerups.length; i += 1) {
                powerups[i].draw();
            }
            
            detectBulletAsteroidCollision();
            detectPowerupPlayerCollision();
        },
        drawAll: function () {
            var i, j;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.save();
            context.drawImage(bgPic, 0, 0);
            context.restore();
            
            
            
            player.draw();
            
            for (i = 0; i < bulletsFired.length; i += 1) {
                bulletsFired[i].draw();
            }
            
            for (i = 0; i < asteroids.length; i += 1) {
                asteroids[i].draw();
            }
            for (i = 0; i < powerups.length; i += 1) {
                powerups[i].draw();
            }
            for (i = 0; i < powerupMessages.length; i += 1) {
                powerupMessages[i].draw();
                if (powerupMessages[i].timeExpired()) {
                    powerupMessages.splice(i, 1);
                }
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
