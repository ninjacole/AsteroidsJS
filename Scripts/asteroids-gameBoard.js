/*jslint node: true */
'use strict';

// global object
var ASTEROIDS = ASTEROIDS || {};

// Create gameboard namespace
ASTEROIDS.namespace('ASTEROIDS.gameBoard');

ASTEROIDS.gameBoard = (function () {
    // Dependencies
    var gameBoard,
        player = ASTEROIDS.player,
        weapon = ASTEROIDS.weapon,
        Powerup = ASTEROIDS.Powerup,
        Asteroid = ASTEROIDS.Asteroid,
        PowerupMessage = ASTEROIDS.PowerupMessage,
        powerupTypes = ASTEROIDS.powerupTypes,
        ScoreMessage = ASTEROIDS.ScoreMessage,
        EnemyExplosion = ASTEROIDS.EnemyExplosion,
        Enemy = ASTEROIDS.enemy,
        utils = ASTEROIDS.utils,
        energy = ASTEROIDS.energy,
        shield = ASTEROIDS.shield,
        menu = ASTEROIDS.menu,
        key = ASTEROIDS.key,
        canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
        gameLoopManager = new ASTEROIDS.GameLoopManager(),
        enemyManager,
        //---------------- Private properties
        that = this,
        playerImg = document.getElementById('ship-single'),
        asteroids = [],
        powerups = [],
        powerupMessages = [],
        scoreMessages = [],
        enemies = [],
        enemyExplosions = [],
        bulletsFired = weapon.getBulletsFired(),
        enemyBulletsFired = weapon.getEnemyBulletsFired(),
        currentWave = 0,
        totalWaves = 10,
        score = 0,
        canPause = true,
        i,
        j,
        splitAsteroid = function (size, x, y, bulletVX, bulletVY) {
            var config = {},
                afterVX,
                afterVY,
                randAngleX,
                randAngleY;
            
            for (i = 0; i < 2; i += 1) {
                randAngleX = Math.random() * 180;
                randAngleY = Math.random() * 180;
                
                if (i === 0) {
                    afterVX = Math.sin((Math.PI / 180) * (180 - randAngleX)) + bulletVX * 0.25;
                    afterVY = Math.cos((Math.PI / 180) * (180 - randAngleY)) + bulletVY * 0.25;
                } else {
                    afterVX = Math.sin((Math.PI / 180) * (180 + randAngleX)) + bulletVX * 0.25;
                    afterVY = Math.cos((Math.PI / 180) * (180 + randAngleY)) + bulletVY * 0.25;
                }

                if (afterVX > 20) {
                    afterVX = 20;
                } else if (afterVX < -20) {
                    afterVX = -20;
                }

                if (afterVY > 20) {
                    afterVY = 20;
                } else if (afterVY < -20) {
                    afterVY = -20;
                }

                config = {
                    x: x + (i === 0 ? 8 : -8),
                    y: y + (i === 0 ? 8 : -8),
                    vx: afterVX,
                    vy: afterVY,
                    spinFactor: 2,
                    size: size - 1
                };
                asteroids.push(new Asteroid(config));
            }
        },
        detectPowerupPlayerCollision = function () {
            var distance,
                message,
                type;
            for (i = powerups.length - 1; i >= 0; i -= 1) {
                if (utils.isCircleCollision(player.getCircleCollider(), powerups[i].getCircleCollider())) {
                    powerups[i].playSound();
                    type = powerups[i].getType();
                    player.gainPowerup(type);
                    powerupMessages.push(new PowerupMessage(type, powerups[i].getX(), powerups[i].getY()));
                    score += 100;
                    scoreMessages.push(new ScoreMessage(100, {x: powerups[i].getX(), y: powerups[i].getY() }));
                    powerups.splice(i, 1);
                }
            }
        },
        detectEnemyBulletPlayerCollision = function () {
            // player enemy bullet collision
            if (!shield.isUp()) {
                for (i = enemyBulletsFired.length - 1; i >= 0; i -= 1) {
                    if (utils.isCircleCollision(player.getCircleCollider(), enemyBulletsFired[i].getCircleCollider())) {
                        player.die();
                        enemyBulletsFired.splice(i, 1);
                    }
                }
            }
        },
        detectAsteroidPlayerCollision = function () {
            var distance,
                dx,
                dy;
            if (!shield.isUp()) {
                for (i = asteroids.length - 1; i >= 0; i -= 1) {
                    if (utils.isCircleCollision(player.getCircleCollider(), asteroids[i].getCircleCollider())) {
                        player.die();
                    }
                }
            }
        },
        detectPlayerBulletEnemyCollision = function () {
            // player bullets colliding with enemies
            if (enemies.length > 0 && bulletsFired.length > 0) {
                for (i = enemies.length - 1; i >= 0; i -= 1) {
                    for (j = bulletsFired.length - 1; j >= 0; j -= 1) {
                        if (utils.isCircleCollision(enemies[i].getCircleCollider(), bulletsFired[j].getCircleCollider())) {
                            score += 1000;
                            scoreMessages.push(new ScoreMessage(1000, {x: enemies[i].getX(), y: enemies[i].getY() }));
                            enemyExplosions.push(new EnemyExplosion({x: enemies[i].getCenterX(), y: enemies[i].getCenterY()}));
                            enemies[i].die();
                            enemies.splice(i, 1);
                            bulletsFired.splice(j, 1);
                        }
                    }
                }
            }
        },
        detectEnemyBulletAsteroidCollision = function () {
            var bullvx,
                bullvy,
                x,
                y,
                size;
            
            for (j = enemyBulletsFired.length - 1; j >= 0; j -= 1) {
                for (i = asteroids.length - 1; i >= 0; i -= 1) {
                    if (utils.isCircleCollision(enemyBulletsFired[j].getCircleCollider(), asteroids[i].getCircleCollider())) {
                        bullvx = enemyBulletsFired[j].getVX();
                        bullvy = enemyBulletsFired[j].getVY();
                        enemyBulletsFired.splice(j, 1);
                        asteroids[i].receiveDamage();
                        if (asteroids[i].getHitpoints() === 0) {
                            asteroids[i].playSound();
                            x = asteroids[i].getX();
                            y = asteroids[i].getY();
                            size = asteroids[i].getSize();
                            asteroids.splice(i, 1);
                            if (size > 1) {
                                splitAsteroid(size, x, y, bullvx, bullvy);
                            } else {
                                if (Math.random() > 0.7) {
                                    powerups.push(new Powerup(asteroids[i].getX(), asteroids[i].getY()));
                                }
                            }
                        }
                        break;
                    }
                }
            }
        },
        detectPlayerBulletAsteroidCollision = function () {
            var bullvx,
                bullvy,
                x,
                y,
                size;
            
            for (j = bulletsFired.length - 1; j >= 0; j -= 1) {
                for (i = asteroids.length - 1; i >= 0; i -= 1) {
                    if (utils.isCircleCollision(asteroids[i].getCircleCollider(), bulletsFired[j].getCircleCollider())) {
                        bullvx = bulletsFired[j].getVX();
                        bullvy = bulletsFired[j].getVY();
                        bulletsFired.splice(j, 1);
                        asteroids[i].receiveDamage();
                        if (asteroids[i].getHitpoints() === 0) {
                            asteroids[i].playSound();
                            x = asteroids[i].getX();
                            y = asteroids[i].getY();
                            size = asteroids[i].getSize();
                            score += 600 / size;
                            scoreMessages.push(new ScoreMessage(600 / size, {x: x, y: y }));
                            asteroids.splice(i, 1);
                            if (size > 1) {
                                splitAsteroid(size, x, y, bullvx, bullvy);
                            } else {
                                if (Math.random() > 0.7) {
                                    powerups.push(new Powerup(x, y));
                                }
                            }
                        }
                        break;
                    }
                }
            }
        },
        detectAllCollisions = function () {
            detectAsteroidPlayerCollision();
            detectEnemyBulletAsteroidCollision();
            detectEnemyBulletPlayerCollision();

            detectPlayerBulletAsteroidCollision();
            detectPlayerBulletEnemyCollision();

            detectPowerupPlayerCollision();
        };
    
    // public properties
    gameBoard = {
        updateAll: function () {
            if (player.getLives() === 0) {
                gameBoard.gameOver();
            } else if (asteroids.length === 0 && enemies.length === 0) {
                gameBoard.waveBegin();
            } else {
                detectAllCollisions();

                if (player.isAlive()) {
                    player.update();
                }

                energy.update();

                // Update bullets fired
                for (i = 0; i < bulletsFired.length; i += 1) {
                    if (bulletsFired[i].canTravel()) {
                        bulletsFired[i].update();
                    } else {
                        bulletsFired.splice(i, 1);
                    }
                }

                // Remove powerup messages if they're expired
                for (i = powerupMessages.length - 1; i >= 0; i -= 1) {
                    if (powerupMessages[i].timeExpired()) {
                        powerupMessages.splice(i, 1);
                    }
                }

                // Remove score messages if they're expired
                for (i = scoreMessages.length - 1; i >= 0; i -= 1) {
                    if (scoreMessages[i].timeExpired()) {
                        scoreMessages.splice(i, 1);
                    }
                }

                // Remove enemy bullets if they're done or update them otherwise
                for (i = enemyBulletsFired.length - 1; i >= 0; i -= 1) {
                    if (enemyBulletsFired[i].canTravel()) {
                        enemyBulletsFired[i].update();
                    } else {
                        enemyBulletsFired.splice(i, 1);
                    }
                }

                // Remove powerups if expired
                for (i = powerups.length - 1; i >= 0; i -= 1) {
                    if (powerups[i].isExpired()) {
                        powerups.splice(i, 1);
                    }
                }
                
                for (i = enemyExplosions.length - 1; i >= 0; i -= 1) {
                    if (enemyExplosions[i].timeExpired()) {
                        enemyExplosions.splice(i, 1);
                    }
                }

                for (i = 0; i < asteroids.length; i += 1) {
                    asteroids[i].update();
                }

                for (i = 0; i < enemies.length; i += 1) {
                    enemies[i].update();
                }
                
                if (enemyManager.canSpawnEnemy()) {
                    enemies.push(enemyManager.createEnemy());
                }
            }
        },
        getWave: function () {
            return currentWave;
        },
        drawUI: function () {
            context.save();
            context.fillStyle = 'white';
            context.font = "30px Consolas";
            
            context.fillText("Level: " + currentWave + " Score: " + score, 50, 30);
            
            for (i = 0; i < player.getLives(); i += 1) {
                context.drawImage(playerImg, (i * 25) + 50, 45, 20, 20);
            }
            
            context.fillStyle = 'green';
            for (i = 0; i < energy.getAvailable(); i += 1) {
                context.fillRect((i * 8) + 50, 100, 4, 10);
            }
            context.restore();
        },
        drawAll: function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.drawUI();
            if (player.isAlive()) {
                player.draw();
            }
            for (i = 0; i < powerups.length; i += 1) {
                powerups[i].draw();
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
            }
            for (i = 0; i < scoreMessages.length; i += 1) {
                scoreMessages[i].draw();
            }
            for (i = 0; i < enemyExplosions.length; i += 1) {
                enemyExplosions[i].draw();
            }
        },
        spawnAsteroids: function () {
            var config;
            
            for (i = 0; i < currentWave; i += 1) {
                config = {
                    x: utils.getSpawnPoint().x,
                    y: utils.getSpawnPoint().y,
                    vx: Math.ceil(Math.random() * 5 * (Math.random() < 0.5 ? -1 : 1)),
                    vy: Math.ceil(Math.random() * 5 * (Math.random() < 0.5 ? -1 : 1)),
                    spinFactor: Math.ceil(Math.random() * 4),
                    size: 4
                };
                asteroids.push(new Asteroid(config));
            }
        },
        input: function () {
            if (key.isDown(key.UP)) {
                player.accelerate();
                player.engineEnabled(true);
            } else {
                player.engineEnabled(false);
            }
            if (key.isDown(key.LEFT)) {
                player.rotate(-4);
            }
            if (key.isDown(key.RIGHT)) {
                player.rotate(4);
            }
            if (key.isDown(key.SPACE)) {
                player.shoot();
            }
            if (key.isDown(key.DOWN)) {
                player.shield.activate();
            } else if (player.isRecentlySpawned()) {
                player.shield.activate(true);
            } else {
                player.shield.deactivate();
            }
            if (key.isDown(key.ESC)) {
                if (canPause) {
                    this.pause();
                }
                canPause = false;
            } else {
                canPause = true;
            }
        },
        start: function () {
            var startMenuItems = ['New Game', 'View high scores'],
                startMenu = new menu.StartMenu(
                    startMenuItems,
                    function (value) {
                        if (value === 0) {
                            gameBoard.waveBegin();
                        } else if (value === 1) {
                            // TODO
                            console.log('show high scores not implemented');
                        }
                    }
                );
            enemyManager = new ASTEROIDS.enemyManager(gameBoard.getWave);
            gameLoopManager.run(function () { startMenu.draw(); });
        },
        main: function () {
            gameBoard.updateAll();
            gameBoard.drawAll();
            gameBoard.input();
        },
        pause: function () {
            var pauseMenuItems = ['Resume', 'Quit'],
                pauseMenu = new menu.PauseMenu(pauseMenuItems, gameBoard.resume, gameBoard.resume);
            gameLoopManager.run(function () { gameBoard.drawAll(); pauseMenu.drawPauseMenu(); });
        },
        resume: function (index) {
            if (index === 0 || index === undefined) {
                gameLoopManager.run(function () { gameBoard.main(); });
            } else if (index === 1) {
                gameBoard.gameOver();
            }
        },
        resetWave: function () {
            player.reset();
            asteroids = [];
            powerups = [];
            enemies = [];
            weapon.resetEnemyBulletsFired();
            enemyManager.reset();
        },
        resetGame: function () {
            gameBoard.resetWave();
            currentWave = 0;
            score = 0;
            player.setLives(5);
        },
        waveBegin: function () {
            currentWave += 1;
            var waveTransition = new menu.WaveTransition(
                currentWave,
                Date.now(),
                3000,
                function () {
                    gameBoard.resetWave();
                    gameBoard.spawnAsteroids();
                    gameLoopManager.run(gameBoard.main);
                }
            );
            gameLoopManager.run(waveTransition.waveTransition);
        },
        gameOver: function () {
            // TODO: show game over screen and high score menu
            menu.gameOverScreen.configure(Date.now(), function () { gameBoard.resetGame(); gameBoard.start(); });
            gameLoopManager.run(function () { menu.gameOverScreen.draw(); });
        }
    };

    
    return gameBoard;
}());
