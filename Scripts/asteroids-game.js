// Closure that exports asteroids game object
var ASTEROIDS_GAME = (function () {
    var asteroids_game = {};


    //---------------- Private properties
    var currentWave = 1, totalWaves = 10, fps = 50, intervalId = 0;
    var canvas;
    var context;


    //---------------- Public properties
    asteroids_game.player;
    asteroids_game.bullets = [], asteroids_game.powerups = [], asteroids_game.powerupMessages = [], asteroids_game.asteroids = [];


    //---------------- Public functions
    asteroids_game.start = (function () {
        var loops = 0, skipTicks = 1000 / fps, maxFrameSkip = 10, nextGameTick = (new Date).getTime();
        return function () {
            loops = 0;

            while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
                updateAll();
                nextGameTick += skipTicks;
                loops++;
            }
            if (loops) {
                drawAll();
            }
        };
    })();

    asteroids_game.setIntervalId = function (id) {
        intervalId = id;
    }

    asteroids_game.getIntervalId = function () {
        return intervalId;
    }

    asteroids_game.getCanvas = function () {
        if (!canvas) {
            setupCanvas();
        }
        return canvas;
    }

    asteroids_game.getCanvasCenterX = function() {
        if (!canvas) {
            setupCanvas();
        }
        return canvas.width / 2;
    }

    asteroids_game.getCanvasCenterY = function() {
        if (!canvas) {
            setupCanvas();
        }
        return canvas.height / 2;
    }

    asteroids_game.getContext = function () {
        if (!context) {
            setupCanvas();
        }
        return context;
    }

    asteroids_game.convertDegreesToRads = function (degrees) {
        return (Math.PI / 180) * degrees;
    }

    asteroids_game.getCurrentWave = function () {
        return currentWave;
    }

    // ---------------- Private functions
    // Setup the canvas
    function setupCanvas() {
        canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 1000;
        canvas.height = 800;
        document.getElementById('canvasParent').appendChild(canvas);
        context = canvas.getContext('2d');
    }

    // Perform physics and mechanic related tasks
    function updateAll () {
        asteroids_game.player.update();
        for (var i = 0; i < asteroids_game.bullets.length; i++) {
            asteroids_game.bullets[i].update();
            if (asteroids_game.bullets[i].timeTravelled > asteroids_game.bullets[i].duration) {
                asteroids_game.bullets.splice(i, 1);
            }
        }

        if (asteroids_game.powerups.length < 5) {
            var rand = Math.random() * 1000;
            if (rand > 998) {
                var randAbilityNum = Math.random() * 15;
                var randAbility = "";
                if (randAbilityNum < 3) {
                    randAbility = 'speed';
                } else if (randAbilityNum >= 3 && randAbilityNum < 6) {
                    randAbility = 'double';
                } else if (randAbilityNum >= 6 && randAbilityNum < 10) {
                    randAbility = 'rear'
                } else if (randAbilityNum >= 10 && randAbility < 15) {
                    randAbility = 'spread'
                }
                asteroids_game.powerups.push(new asteroids_game.powerup(context, Math.random() * canvas.width, Math.random() * canvas.height, randAbility));
            }
        }

        for (var i = 0; i < asteroids_game.powerupMessages.length; i++) {
            if (asteroids_game.powerupMessages[i].duration < asteroids_game.powerupMessages[i].runningTime) {
                asteroids_game.powerupMessages.splice(i, 1);
            }
        }

        for (var i = 0; i < asteroids_game.asteroids.length; i++) {
            asteroids_game.asteroids[i].update();
        }

        for (var i = 0; i < asteroids_game.asteroids.length; i++) {
            for (var j = 0; j < asteroids_game.bullets.length; j++) {
                var dx = asteroids_game.asteroids[i].x - asteroids_game.bullets[j].x;
                var dy = asteroids_game.asteroids[i].y - asteroids_game.bullets[j].y;

                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < asteroids_game.asteroids[i].width) {
                    asteroids_game.asteroids[i].explosionSound.play();
                    if (asteroids_game.asteroids[i].size > 1) {
                        var randy = Math.random() > .5 ? -1 : 1;
                        var randx = Math.random() > .5 ? -1 : 1;
                        var asterAfterx = asteroids_game.asteroids[i].vx + randx;
                        var asterAftery = asteroids_game.asteroids[i].vy + randy;

                        asteroids_game.asteroids.push(new asteroids_game.asteroid(
                        asteroids_game.asteroids[i].x + 8,
                        asteroids_game.asteroids[i].y + 8,
                        asterAfterx,
                        asterAftery,
                        2,
                        asteroids_game.asteroids[i].size - 1))

                        asteroids_game.asteroids.push(new asteroids_game.asteroid(
                        asteroids_game.asteroids[i].x - 8,
                        asteroids_game.asteroids[i].y - 8,
                        asterAfterx,
                        asterAftery,
                        2,
                        asteroids_game.asteroids[i].size - 1))
                    }
                    asteroids_game.asteroids.splice(i, 1);
                    asteroids_game.bullets.splice(j, 1);
                    break;
                }
            }
        }
    }

    // Perform animation related tasks
    function drawAll () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        asteroids_game.player.draw();
        for (var i = 0; i < asteroids_game.bullets.length; i++) {
            asteroids_game.bullets[i].draw();
        }
        for (var i = 0; i < asteroids_game.powerups.length; i++) {
            asteroids_game.powerups[i].draw();
        }
        for (var i = 0; i < asteroids_game.powerupMessages.length; i++) {
            asteroids_game.powerupMessages[i].draw();
        }
        for (var i = 0; i < asteroids_game.asteroids.length; i++) {
            asteroids_game.asteroids[i].draw();
        }
    }

    return asteroids_game;
})();
