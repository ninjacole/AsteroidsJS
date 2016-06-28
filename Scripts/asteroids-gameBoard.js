/*jslint node: true */
'use strict';

// global object
var ASTEROIDS = ASTEROIDS || {};

// Create gameboard namespace
ASTEROIDS.namespace('ASTEROIDS.gameBoard');

ASTEROIDS.namespace('ASTEROIDS.gameState');

ASTEROIDS.gameState = {
    WAVE_ACTIVE: 'wave active',
    START_MENU: 'start menu',
    HIGH_SCORE_MENU: 'high score menu',
    WAVE_TRANSITION: 'wave transition',
    GAME_OVER: 'game over'
};

ASTEROIDS.gameBoard = (function () {
    // Dependencies
    var player = ASTEROIDS.player,
        weapon = ASTEROIDS.weapon,
        Powerup = ASTEROIDS.Powerup,
        Asteroid = ASTEROIDS.Asteroid,
        PowerupMessage = ASTEROIDS.PowerupMessage,
        powerupTypes = ASTEROIDS.powerupTypes,
        ScoreMessage = ASTEROIDS.ScoreMessage,
        gameState = ASTEROIDS.gameState,
        Enemy = ASTEROIDS.enemy,
        utils = ASTEROIDS.utils,
        enemyDeathSound = document.getElementById('enemy-death'),
        that = this,
        playerImg = document.getElementById('ship-single'),
        key = ASTEROIDS.key,
        asteroids = [],
        powerups = [],
        powerupMessages = [],
        scoreMessages = [],
        enemies = [],
        //---------------- Private properties
        bulletsFired = weapon.getBulletsFired(),
        enemyBulletsFired = weapon.getEnemyBulletsFired(),
        gameBoard,
        currentWave = 1,
        totalWaves = 10,
        fps = 50,
        intervalId = 0,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        bgPic = document.getElementById('bgpic'),
        playerLives = 4,
        timeBetweenWaves = 5000,
        score = 0,
        enemyPeriodicity = 5000 / currentWave,
        lastEnemySpawned = new Date().getTime(),
        state = gameState.WAVE_ACTIVE,
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
                type,
                x,
                y;
            for (i = 0; i < powerups.length; i += 1) {
                dx = powerups[i].getCenterPoint().x - player.getX();
                dy = powerups[i].getCenterPoint().y - player.getY();
                distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < powerups[i].getWidth() * 0.5 + player.getHeight() * 0.5) {
                    powerups[i].playSound();
                    type = powerups[i].getType();
                    x = powerups[i].getX();
                    y = powerups[i].getY();
                    powerups.splice(i, 1);
                    player.gainPowerup(type);
                    powerupMessages.push(new PowerupMessage(type, x, y));
                    score += 100;
                    scoreMessages.push(new ScoreMessage(100, {x: x, y: y }));
                    break;
                }
            }
        },
        detectAsteroidPlayerCollision = function () {
            var i,
                distance,
                dx,
                dy;
            for (i = 0; i  < asteroids.length; i += 1) {
                dx = asteroids[i].getCenterX() - player.getX();
                dy = asteroids[i].getCenterY() - player.getY();
                distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < asteroids[i].getWidth() * 0.5 + player.getHeight() * 0.5) {
                    playerLives -= 1;
                    player.die();
                    if (playerLives === 0) {
                        state = gameState.GAME_OVER;
                    }
                }
            }
            
            // player enemy bullet collision
            for (i = 0; i  < enemyBulletsFired.length; i += 1) {
                dx = enemyBulletsFired[i].getX() - player.getX();
                dy = enemyBulletsFired[i].getY() - player.getY();
                distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < enemyBulletsFired[i].getRadius() + player.getHeight() * 0.5) {
                    playerLives -= 1;
                    player.die();
                    enemyBulletsFired.splice(i, 1);
                    if (playerLives === 0) {
                        state = gameState.GAME_OVER;
                    }
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
                asterAftery,
                bullvx,
                bullvy;
            
            for (i = 0; i < asteroids.length; i += 1) {
                for (j = 0; j < bulletsFired.length; j += 1) {
                    dx = asteroids[i].getCenterX() - bulletsFired[j].getCenterX();
                    dy = asteroids[i].getCenterY() - bulletsFired[j].getCenterY();
                    distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= asteroids[i].getWidth() / 2 + bulletsFired[j].getRadius()) {
                        bullvx = bulletsFired[j].getVX();
                        bullvy = bulletsFired[j].getVY();
                        bulletsFired.splice(j, 1);
                        asteroids[i].receiveDamage();
                        if (asteroids[i].getHitpoints() === 0) {
                            asteroids[i].playSound();
                            score += 600 / asteroids[i].getSize();
                            scoreMessages.push(new ScoreMessage(600 / asteroids[i].getSize(), {x: asteroids[i].getCenterX(), y: asteroids[i].getCenterY() }));
                            if (asteroids[i].getSize() > 1) {
                                splitAsteroid(asteroids[i], bullvx, bullvy);
                            } else {
                                if (Math.random() > 0.7) {
                                    powerups.push(new Powerup(asteroids[i].getX(), asteroids[i].getY()));
                                }
                            }
                            asteroids.splice(i, 1);
                            if (asteroids.length === 0) {
                                gameBoard.waveEnd();
                            }
                            break;
                        }
                    }
                }
            }
            
            for (i = 0; i < enemies.length; i += 1) {
                for (j = 0; j < bulletsFired.length; j += 1) {
                    dx = enemies[i].getX() - bulletsFired[j].getCenterX();
                    dy = enemies[i].getY() - bulletsFired[j].getCenterY();
                    distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= enemies[i].getWidth() / 2 + bulletsFired[j].getRadius()) {
                        enemies.splice(i, 1);
                        enemyDeathSound.play();
                        bulletsFired.splice(j, 1);
                        break;
                    }
                }
            }
            
            for (i = 0; i < asteroids.length; i += 1) {
                for (j = 0; j < enemyBulletsFired.length; j += 1) {
                    dx = asteroids[i].getCenterX() - enemyBulletsFired[j].getCenterX();
                    dy = asteroids[i].getCenterY() - enemyBulletsFired[j].getCenterY();
                    distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= asteroids[i].getWidth() / 2 + enemyBulletsFired[j].getRadius()) {
                        bullvx = enemyBulletsFired[j].getVX();
                        bullvy = enemyBulletsFired[j].getVY();
                        enemyBulletsFired.splice(j, 1);
                        asteroids[i].receiveDamage();
                        if (asteroids[i].getHitpoints() === 0) {
                            asteroids[i].playSound();
                            if (asteroids[i].getSize() > 1) {
                                splitAsteroid(asteroids[i], bullvx, bullvy);
                            } else {
                                if (Math.random() > 0.7) {
                                    powerups.push(new Powerup(asteroids[i].getX(), asteroids[i].getY()));
                                }
                            }
                            asteroids.splice(i, 1);
                            if (asteroids.length === 0) {
                                gameBoard.waveEnd();
                            }
                            break;
                        }
                    }
                }
            }
        };
    
    // public properties
    gameBoard = {
        updateAll: function () {
            if (state === gameState.WAVE_ACTIVE) {
                if (key.isDown(key.DOWN)) {
                    enemies.push(new Enemy());
                }

                if (player.isAlive()) {
                    player.update();
                }

                var i;
                for (i = 0; i < bulletsFired.length; i += 1) {
                    if (bulletsFired[i].canTravel()) {
                        bulletsFired[i].update();
                    } else {
                        bulletsFired.splice(i, 1);
                    }
                }
                
                for (i = 0; i < enemyBulletsFired.length; i += 1) {
                    if (enemyBulletsFired[i].canTravel()) {
                        enemyBulletsFired[i].update();
                    } else {
                        enemyBulletsFired.splice(i, 1);
                    }
                }

                for (i = 0; i < asteroids.length; i += 1) {
                    asteroids[i].update();
                }
                
                for (i = 0; i < enemies.length; i += 1) {
                    enemies[i].update();
                }
                
                if (new Date().getTime() - lastEnemySpawned > enemyPeriodicity) {
                    this.spawnEnemy();
                }
                detectBulletAsteroidCollision();
                detectPowerupPlayerCollision();
                detectAsteroidPlayerCollision();
            }
        },
        spawnEnemy: function () {
//            if (enemies.length < 3 * currentWave) {
//                enemies.push(new Enemy());
//                lastEnemySpawned = new Date().getTime();
//            }
        },
        drawUI: function () {
            var i;
            context.save();
            context.fillStyle = 'white';
            context.font = "30px Consolas";
            context.fillText("Level: " + currentWave + " Score: " + score, 50, 30);
            context.translate(50, 30);
            for (i = 0; i < playerLives; i += 1) {
                context.drawImage(playerImg, i * 25, 15, 20, 20);
            }
            context.restore();
        },
        drawGameOver: function () {
            context.save();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(bgPic, 0, 0);
            context.fillStyle = 'white';
            context.font = "80px Consolas";
            context.fillText("GAME OVER", canvas.width / 2 - 200, canvas.height / 2);
            context.restore();
            this.drawUI();
        },
        drawAll: function () {
            var i, j;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(bgPic, 0, 0);
            this.drawUI();
            if (state === gameState.WAVE_ACTIVE) {
                if (player.isAlive()) {
                    player.draw();
                }
                for (i = 0; i < powerups.length; i += 1) {
                    if (powerups[i].isExpired()) {
                        powerups.splice(i, 1);
                    } else {
                        powerups[i].draw();
                    }
                }
                for (i = 0; i < enemies.length; i += 1) {
                    enemies[i].draw();
                }
                
                for (i = 0; i < bulletsFired.length; i += 1) {
                    bulletsFired[i].draw();
                }
                
                for (i = 0; i < enemyBulletsFired.length; i += 1) {
                    enemyBulletsFired[i].draw();
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
            } else {
                context.save();
                context.fillStyle = 'white';
                context.font = "80px Consolas";
                context.fillText("LEVEL " + currentWave, canvas.width / 2 - 100, canvas.height / 2 - 100);
                context.restore();
            }
            for (i = 0; i < scoreMessages.length; i += 1) {
                if (scoreMessages[i].timeExpired()) {
                    scoreMessages.splice(i, 1);

                } else {
                    scoreMessages[i].draw();
                }
            }
        },
        spawnAsteroids: function () {
            var asteroidCount = currentWave * 2,
                velCox,
                velCoy,
                x,
                y,
                vx,
                vy,
                spinFactor,
                size,
                config,
                i,
                spawnPoint = utils.getSpawnPoint();
            
            for (i = 0; i < asteroidCount; i += 1) {
                velCox = Math.random() < 0.5 ? -1 : 1;
                velCoy = Math.random() < 0.5 ? -1 : 1;
                x = spawnPoint.x;
                y = spawnPoint.y;
                vx = Math.ceil(Math.random() * 5 * velCox);
                vy = Math.ceil(Math.random() * 5 * velCoy);
                spinFactor = Math.ceil(Math.random() * 4);
                size = 4;
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
                    if (state === gameState.WAVE_ACTIVE) {
                        ASTEROIDS.gameBoard.updateAll();
                    } else if (state === gameState.GAME_OVER) {
                        console.log('todo');
                    }
                    nextGameTick += skipTicks;
                    loops += 1;
                }
                if (loops) {
                    if (state === gameState.GAME_OVER) {
                        ASTEROIDS.gameBoard.drawGameOver();
                    } else {
                        ASTEROIDS.gameBoard.drawAll();
                    }
                }
            };
        }()),
        start: function () {
            this.spawnAsteroids();
            intervalId = setInterval(this.loop, 0);
        },
        stop: function () {
            
        },
        waveEnd: function () {
            currentWave += 1;
            state = gameState.WAVE_TRANSITION;
            player.hide();
            this.stop();
            setTimeout(this.waveBegin, timeBetweenWaves);
        },
        waveBegin: function () {
            state = gameState.WAVE_ACTIVE;
            player.show();
            ASTEROIDS.gameBoard.spawnAsteroids();
        }
    };
    return gameBoard;
}());
