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

//////////////////////////////////////////////////////////////////////
////////////////             ENTRY POINT      ////////////////////////
//////////////////////////////////////////////////////////////////////
$(document).ready(function () {
    (function () {
        
        function asteroid(x, y, vx, vy, spinFactor, size) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.rotation = 0;
            this.spinFactor = spinFactor;
            this.height = size * 15;
            this.width = size * 15;
            this.size = size;

            this.draw = function () {
                context.save();
                context.translate(this.x, this.y);
                context.rotate((Math.PI / 180) * this.rotation);
                context.fillRect(-.5 * this.width, -.5 * this.height, this.width, this.height);
                context.restore();
            }

            this.update = function () {
                this.x += vx;
                this.y += vy;
                this.rotate(this.spinFactor);
                if (this.x + this.vx > canvas.width) {
                    this.x = 0;
                }
                if (this.x + this.vx < 0) {
                    this.x = canvas.width;
                }
                if (this.y + this.vy > canvas.height) {
                    this.y = 0;
                }
                if (this.y + this.vy < 0) {
                    this.y = canvas.height;
                }

            }
            this.rotate = function (degrees) {
                this.rotation += degrees;
                // If we're over 360 degrees, use the remainder
                // example: 365 % 360 = remainder of 5. Rotation is 5 degrees.
                if (this.rotation % 360 > 0) {
                    this.rotation = this.rotation % 360;
                }
                // If we're negative rotation, add 360.
                // Example, rotated to -5 degrees, becomes 355 in the circle
                if (this.rotation < 0) {
                    this.rotation = 360 + this.rotation;
                }
            }
        }

        //////////////////////////////////////////////////////////////////////
        ////////////////             BULLET           ////////////////////////
        //////////////////////////////////////////////////////////////////////
        function bullet(context, x, y, vx, vy, rotation, offset) {
            this.duration = 700;

            this.startTime = (new Date).getTime();
            this.timeTravelled = 0;
            this.rotation = rotation;
            this.width = 6;
            this.height = 6;
            this.offset = offset;

            this.speed = 7;

            this.x = x;
            this.y = y;

            this.vx = vx;
            this.vy = vy;

            this.vx += Math.sin((Math.PI / 180) * (180 - this.rotation)) * this.speed; // create a vector based on current rotation
            this.vy += Math.cos((Math.PI / 180) * (180 - this.rotation)) * this.speed; // create y vector based on current rotation

            this.draw = function () {
                context.save();
                context.translate(this.x, this.y);
                context.rotate((Math.PI / 180) * this.rotation); // turn the entire graph within the canvas x radians

                if (this.offset < 0) {
                    context.fillRect(this.offset - this.width, -.5 * this.height, this.width, this.height);
                } else if (this.offset > 0) {
                    context.fillRect(this.offset, -.5 * this.height, this.width, this.height);
                } else {
                    context.fillRect(0, 0, this.width, this.height);
                }

                context.restore();

                if (this.x + this.vx > canvas.width) {
                    this.x = 0;
                } else if (this.x + this.vx < 0) {
                    this.x = canvas.width;
                }

                if (this.y + this.vy > canvas.height) {
                    this.y = 0;
                } else if (this.y + this.vy < 0) {
                    this.y = canvas.height;
                }
            }

            this.update = function () {
                this.x += this.vx;
                this.y += this.vy;

                this.timeTravelled = (new Date).getTime() - this.startTime;
            }
        }

        //////////////////////////////////////////////////////////////////////
        ////////////////             POWERUP          ////////////////////////
        //////////////////////////////////////////////////////////////////////
        function powerup(context, x, y, ability) {
            this.x = x;
            this.y = y;
            this.radius = 20;
            this.pulse = .5;
            this.pulseChange = .5;
            this.ability = ability;
            this.getRadGrad = function () {
                if (this.pulse === this.radius - 1) {
                    this.pulseChange = -1;
                } else if (this.pulse === 1) {
                    this.pulseChange = 1;
                }
                this.pulse += this.pulseChange;

                var radgrad = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.pulse);
                radgrad.addColorStop(.5, '#C60F0F');
                radgrad.addColorStop(.9, '#751F0E')
                return radgrad;
            }

            this.draw = function () {
                context.save();
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
                context.fillStyle = this.getRadGrad();
                context.fill();
                context.restore();
            }
        }

        //////////////////////////////////////////////////////////////////////
        ////////////////             PLAYER          /////////////////////////
        //////////////////////////////////////////////////////////////////////
        var player = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            w: 15,
            h: 30,
            vx: 0,
            vy: 0,
            lastFired: (new Date).getTime(),
            accelerationCoefficient: .1,
            maxSpeed: 20,
            maxAccelerationCoefficient: 1,
            rotation: 0,
            fireRate: 300,
            weaponType: 'single',
            draw: function () {
                context.save();
                context.translate(this.x, this.y + this.h * .5); // move the origin to the center of the triangle (500, 415)
                context.rotate((Math.PI / 180) * this.rotation); // turn the entire graph within the canvas x radians
                context.translate(-1 * (this.x), -1 * (this.y + this.h * .5)); // move the origin back to the top left corner
                // draw the triangle
                context.beginPath();
                context.moveTo(this.x, this.y);
                context.lineTo(this.x - this.w * .5, this.y + this.h);
                context.lineTo(this.x + this.w * .5, this.y + this.h);
                context.lineTo(this.x, this.y);
                context.fill()
                context.closePath();
                context.restore();
            },
            rotate: function (degrees) {
                this.rotation += degrees;
                // If we're over 360 degrees, use the remainder
                // example: 365 % 360 = remainder of 5. Rotation is 5 degrees.
                if (this.rotation % 360 > 0) {
                    this.rotation = this.rotation % 360;
                }
                // If we're negative rotation, add 360.
                // Example, rotated to -5 degrees, becomes 355 in the circle
                if (this.rotation < 0) {
                    this.rotation = 360 + this.rotation;
                }
            },
            accelerate: function () {
                var vx = Math.sin((Math.PI / 180) * (180 - this.rotation)) * this.accelerationCoefficient; // create a vector based on current rotation
                var vy = Math.cos((Math.PI / 180) * (180 - this.rotation)) * this.accelerationCoefficient; // create y vector based on current rotation
                this.vx += vx; // vector math in x direction
                this.vy += vy; // vector math in y direction
                if (this.vx > this.maxSpeed) {
                    this.vx = this.maxSpeed;
                } else if (this.vx < -1 * this.maxSpeed) {
                    this.vx = -1 * this.maxSpeed;
                }
                if (this.vy > this.maxSpeed) {
                    this.vy = this.maxSpeed;
                } else if (this.vy < -1 * this.maxSpeed) {
                    this.vy = -1 * this.maxSpeed;
                }
            },
            setAccelerationCoefficient: function (value) {
                if (this.accelerationCoefficient + value > this.maxAccelerationCoefficient) {
                    this.accelerationCoefficient = this.maxAccelerationCoefficient;
                } else {
                    this.accelerationCoefficient += value;
                }
            },
            shoot: function () {
                if (!((new Date).getTime() - this.lastFired < this.fireRate)) {
                    this.lastFired = (new Date).getTime();
                    if (this.weaponType === 'single') {
                        fireSound.currentTime = 0;
                        fireSound.play();
                        bullets.push(new bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation, 0));
                    } else if (this.weaponType === 'double') {
                        fireSound.currentTime = 0;

                        fireSound.play();
                        fireSound.play();
                        bullets.push(new bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation, 2));
                        bullets.push(new bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation, -2));
                    } else if (this.weaponType === 'rear') {
                        fireSound.currentTime = 0;

                        fireSound.play();
                        fireSound.play();
                        bullets.push(new bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation, 0));
                        bullets.push(new bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation + 180, 0));
                    } else if (this.weaponType === 'spread') {
                        fireSound.currentTime = 0;

                        fireSound.play();
                        fireSound.play();
                        fireSound.play();
                        bullets.push(new bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation, 0));
                        bullets.push(new bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation + 45, 0));
                        bullets.push(new bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation - 45, 0));
                    }
                }
            },
            gainPowerup: function (powerup) {
                powerupSound.play();
                if (powerup.ability === 'speed') {
                    this.setAccelerationCoefficient(.1);
                    powerupMessages.push(new powerupMessage(this.x, this.y, "Speed+! Current speed is " + this.accelerationCoefficient.toFixed(1) * 10));
                }
                if (powerup.ability === 'double') {
                    this.weaponType = 'double';
                    powerupMessages.push(new powerupMessage(this.x, this.y, "Double gun!"));
                }
                if (powerup.ability === 'rear') {
                    this.weaponType = 'rear';
                    powerupMessages.push(new powerupMessage(this.x, this.y, "Rear gun!"));
                }
                if (powerup.ability === 'spread') {
                    this.weaponType = 'spread';
                    powerupMessages.push(new powerupMessage(this.x, this.y, "Spread gun!"));
                }
            },
            update: function () {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x + this.vx > canvas.width) {
                    this.x = 0;
                }
                if (this.x + this.vx < 0) {
                    this.x = canvas.width;
                }
                if (this.y + this.vy > canvas.height) {
                    this.y = 0;
                }
                if (this.y + this.vy < 0) {
                    this.y = canvas.height;
                }

                for (var i = 0; i < powerups.length; i++) {
                    var dx = powerups[i].x - this.x;
                    var dy = powerups[i].y - this.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < powerups[i].radius + this.h) {
                        this.gainPowerup(powerups[i]);
                        powerups.splice(i, 1);
                    }
                }

                for (var i = 0; i < asteroids.length; i++) {
                    var dx = asteroids[i].x - this.x;
                    var dy = asteroids[i].y - this.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < asteroids[i].width * .5)
                    {
                        this.vx = 0;
                        this.vy = 0;
                        this.x = canvas.width / 2;
                        this.y = canvas.height / 2;
                        console.log(this.x);
                        console.log(this.y);
                    }
                }

                if (key.isDown(key.UP)) {
                    this.accelerate();
                }
                if (key.isDown(key.LEFT)) {
                    this.rotate(-5);
                }
                if (key.isDown(key.RIGHT)) {
                    this.rotate(5);
                }
                if (key.isDown(key.DOWN)) {
                    this.accelerationCoefficient += .1;
                }
                if (key.isDown(key.SPACE)) {
                    this.shoot();
                }
            }
        }

        //////////////////////////////////////////////////////////////////////
        ////////////////             PowerupMessage   ////////////////////////
        //////////////////////////////////////////////////////////////////////
        function powerupMessage(x, y, message) {

            this.x = x;
            this.y = y;
            this.message = message;
            this.startTime = (new Date).getTime();
            this.runningTime = 0;
            this.duration = 1500;

            this.draw = function () {
                this.runningTime = (new Date).getTime() - this.startTime;
                context.save();
                context.font = "15px Consolas";
                context.strokeText(message, this.x, this.y);
                context.restore();
            }
        }


        //////////////////////////////////////////////////////////////////////
        ////////////////             EVENTS           ////////////////////////
        //////////////////////////////////////////////////////////////////////
        document.addEventListener('keyup', function (event) { key.onKeyUp(event); }, false);
        document.addEventListener('keydown', function (event) { key.onKeyDown(event); }, false);
    }());

    ASTEROIDS_GAME.intervalId = setInterval(ASTEROIDS_GAME.start, 0);
});