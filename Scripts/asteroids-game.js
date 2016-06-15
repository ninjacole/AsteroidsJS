// Closure that exports asteroids game object
var ASTEROIDS_GAME = (function () {
    var asteroids_game = {};


    //---------------- Private properties
    var currentWave = 1, totalWaves = 10, fps = 50, intervalId = 0;
    var bullets = [], powerups = [], powerupMessages = [], asteroids = [];
    var canvas;
    var context;
    var fireSound = document.getElementById('laserSound');
    var explosionSound = document.getElementById('explosion');
    var powerupSound = document.getElementById('powerupSound');


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

    asteroids_game.getContext = function () {
        if (!context) {
            setupCanvas();
        }
        return context;
    }

    asteroids_game.getFireSound = function () {
        return fireSound;
    }

    asteroids_game.getExplosionSound = function () {
        return explosionSound;
    }

    asteroids_game.getPowerupSound = function () {
        return powerupSound;
    }

    asteroids_game.convertDegreesToRads = function (degrees) {
        return (Math.PI / 180) * degrees;
    }

    // ---------------- Private functions
    // Create asteroids at the start of the wave
    function spawnAsteroids() {
        var asteroidCount = currentWave * 5 - 2;
        for (var i = 0; i < asteroidCount; i++) {
            var velCox = Math.random() < 0.5 ? -1 : 1;
            var velCoy = Math.random() < 0.5 ? -1 : 1;
            var randomXPosition = Math.random() * canvas.width;
            var randomYPosition = Math.random() * canvas.height;
            var randomXV = Math.ceil(Math.random() * 5 * velCox);
            var randomXY = Math.ceil(Math.random() * 5 * velCoy);
            var randomSpinFactor = Math.ceil(Math.random() * 4);
            var randomSize = Math.ceil(Math.random() * 6);
            asteroids.push(new asteroid(randomXPosition, randomYPosition, randomXV, randomXY, randomSpinFactor, randomSize));
        }
    };

    // Setup the canvas
    function setupCanvas() {
        asteroids_game.canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 1000;
        canvas.height = 800;
        document.getElementById('canvasParent').appendChild(canvas);
        var context = canvas.getContext('2d');
    }

    // Perform physics and mechanic related tasks
    function updateAll () {
        player.update();
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].update();
            if (bullets[i].timeTravelled > bullets[i].duration) {
                bullets.splice(i, 1);
            }
        }

        if (powerups.length < 5) {
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
                powerups.push(new powerup(context, Math.random() * canvas.width, Math.random() * canvas.height, randAbility));
            }
        }

        for (var i = 0; i < powerupMessages.length; i++) {
            if (powerupMessages[i].duration < powerupMessages[i].runningTime) {
                powerupMessages.splice(i, 1);
            }
        }

        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].update();
        }

        for (var i = 0; i < asteroids.length; i++) {
            for (var j = 0; j < bullets.length; j++) {
                var dx = asteroids[i].x - bullets[j].x;
                var dy = asteroids[i].y - bullets[j].y;

                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < asteroids[i].width) {
                    explosionSound.play();
                    if (asteroids[i].size > 1) {
                        var randy = Math.random() > .5 ? -1 : 1;
                        var randx = Math.random() > .5 ? -1 : 1;
                        var asterAfterx = asteroids[i].vx + randx;
                        var asterAftery = asteroids[i].vy + randy;

                        asteroids.push(new asteroid(
                        asteroids[i].x + 8,
                        asteroids[i].y + 8,
                        asterAfterx,
                        asterAftery,
                        2,
                        asteroids[i].size - 1))

                        asteroids.push(new asteroid(
                        asteroids[i].x - 8,
                        asteroids[i].y - 8,
                        asterAfterx,
                        asterAftery,
                        2,
                        asteroids[i].size - 1))
                    }
                    asteroids.splice(i, 1);
                    bullets.splice(j, 1);
                    break;
                }
            }
        }
    }

    // Perform animation related tasks
    function drawAll () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        player.draw();
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].draw();
        }
        for (var i = 0; i < powerups.length; i++) {
            powerups[i].draw();
        }
        for (var i = 0; i < powerupMessages.length; i++) {
            powerupMessages[i].draw();
        }
        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].draw();
        }
    }

    return asteroids_game;
})();
