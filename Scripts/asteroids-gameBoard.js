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
        ScoreMessage = ASTEROIDS.ScoreMessage,
        Enemy = ASTEROIDS.enemy,
        utils = ASTEROIDS.utils,
        energy = ASTEROIDS.energy,
        shield = ASTEROIDS.shield,
        menu = ASTEROIDS.menu,
        key = ASTEROIDS.key,
        gameLoopManager = new ASTEROIDS.GameLoopManager(),
        //---------------- Private properties
        enemyDeathSound = document.getElementById('enemy-death'),
        that = this,
        playerImg = document.getElementById('ship-single'),
        enemyImg = document.getElementById('enemy'),
        asteroids = [],
        powerups = [],
        powerupMessages = [],
        scoreMessages = [],
        enemies = [],
        bulletsFired = weapon.getBulletsFired(),
        enemyBulletsFired = weapon.getEnemyBulletsFired(),
        gameBoard,
        currentWave = 0,
        totalWaves = 10,
        fps = 50,
        intervalId = 0,
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        bgPic = document.getElementById('bgpic'),
        timeBetweenWaves = 3000,
        score = 0,
        canPause = true,
        enemyPeriodicity = 15000 / currentWave + 1,
        lastEnemySpawnedTime = Date.now(),
        i,
        j,
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
            if (!shield.isUp()) {
                for (i = 0; i  < asteroids.length; i += 1) {
                    dx = asteroids[i].getCenterX() - player.getX();
                    dy = asteroids[i].getCenterY() - player.getY();
                    distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < asteroids[i].getWidth() * 0.5 + player.getHeight() * 0.5) {
                        player.die();
                        if (player.getLives() === 0) {
                            gameBoard.gameOver();
                        }
                    }
                }

                // player enemy bullet collision
                for (i = 0; i  < enemyBulletsFired.length; i += 1) {
                    dx = enemyBulletsFired[i].getX() - player.getX();
                    dy = enemyBulletsFired[i].getY() - player.getY();
                    distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < enemyBulletsFired[i].getRadius() + player.getHeight() * 0.5) {
                        player.die();
                        enemyBulletsFired.splice(i, 1);
                        if (player.getLives() === 0) {
                            gameBoard.gameOver();
                        }
                    }
                }
            }

        },
        detectBulletAsteroidCollision = function () {
            var i,
                j,
                dx,
                dy,
                x,
                y,
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
                                gameBoard.waveBegin();
                            }
                        }
                    }
                }
            }
            
            // player bullets colliding with enemies
            for (i = 0; i < enemies.length; i += 1) {
                for (j = 0; j < bulletsFired.length; j += 1) {
                    dx = enemies[i].getX() - bulletsFired[j].getCenterX();
                    dy = enemies[i].getY() - bulletsFired[j].getCenterY();
                    distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= enemies[i].getWidth() / 2 + bulletsFired[j].getRadius()) {
                        x = enemies[i].getX();
                        y = enemies[i].getY();
                        enemies.splice(i, 1);
                        score += 1000;
                        scoreMessages.push(new ScoreMessage(1000, {x: x, y: y }));
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
                                gameBoard.waveBegin();
                            }
                        }
                    }
                }
            }
        };
    
    // public properties
    gameBoard = {
        canSpawnEnemy: function () {
            return Date.now() - lastEnemySpawnedTime > (15000 / (currentWave));
        },
        updateAll: function () {
            if (player.isAlive()) {
                player.update();
            }

            energy.update();
            
            for (i = 0; i < bulletsFired.length; i += 1) {
                if (bulletsFired[i].canTravel()) {
                    bulletsFired[i].update();
                } else {
                    bulletsFired.splice(i, 1);
                }
            }
            
            // Remove powerup messages if they're expired
            for (i = powerupMessages.length - 1; i >= 0; i -= 1) {
                if (powerupMessages[i].timeExpired) {
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
            
            
            for (i = 0; i < asteroids.length; i += 1) {
                asteroids[i].update();
            }

            for (i = 0; i < enemies.length; i += 1) {
                enemies[i].update();
            }

            if (this.canSpawnEnemy()) {
                this.spawnEnemy();
            }
            detectBulletAsteroidCollision();
            detectPowerupPlayerCollision();
            detectAsteroidPlayerCollision();
        },
        spawnEnemy: function () {
            if (enemies.length < 3 * currentWave) {
                enemies.push(new Enemy());
                lastEnemySpawnedTime = Date.now();
            }
        },
        drawUI: function () {
            var i;
            
            context.save();
            context.fillStyle = 'white';
            context.font = "30px Consolas";
            // draw level and score at 30 Y
            context.fillText("Level: " + currentWave + " Score: " + score, 50, 30);
            context.translate(50, 30);
            // draw player lives at 45 Y
            for (i = 0; i < player.getLives(); i += 1) {
                context.drawImage(playerImg, i * 25, 15, 20, 20);
            }
            context.fillStyle = 'blue';
            // draw energy bar at 60
            for (i = 0; i < energy.getAvailable(); i += 1) {
                context.fillRect(i * 2, 50, 1, 10);
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
            }
            for (i = 0; i < scoreMessages.length; i += 1) {
                scoreMessages[i].draw();
            }
        },
        spawnAsteroids: function () {
            var asteroidCount = currentWave,
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
                x = utils.getSpawnPoint().x;
                y = utils.getSpawnPoint().y;
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
            lastEnemySpawnedTime = Date.now();
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
