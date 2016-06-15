var ASTEROIDS_GAME = (function (asteroids_game) {
    asteroids_game.player = {
        x: asteroids_game.getCanvasCenterX(),
        y: asteroids_game.getCanvasCenterY(),
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
        fireSound: document.getElementById('laserSound'),
        draw: function () {
            var canvas = asteroids_game.getCanvas();
            var context = asteroids_game.getContext();
            context.save();
            context.translate(this.x, this.y + this.h * .5); // move the origin to the center of the triangle (500, 415)
            context.rotate(asteroids_game.convertDegreesToRads(this.rotation)); // turn the entire graph within the canvas x radians
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
                var context = asteroids_game.getContext();
                if (this.weaponType === 'single') {
                    this.fireSound.currentTime = 0;
                    this.fireSound.play();
                    asteroids_game.bullets.push(new asteroids_game.bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation, 0));
                } else if (this.weaponType === 'double') {
                    this.fireSound.currentTime = 0;

                    this.fireSound.play();
                    this.fireSound.play();
                    asteroids_game.bullets.push(new asteroids_game.bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation, 2));
                    asteroids_game.bullets.push(new asteroids_game.bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation, -2));
                } else if (this.weaponType === 'rear') {
                    this.fireSound.currentTime = 0;

                    this.fireSound.play();
                    this.fireSound.play();
                    asteroids_game.bullets.push(new asteroids_game.bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation, 0));
                    asteroids_game.bullets.push(new asteroids_game.bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation + 180, 0));
                } else if (this.weaponType === 'spread') {
                    this.fireSound.currentTime = 0;

                    this.fireSound.play();
                    this.fireSound.play();
                    this.fireSound.play();
                    asteroids_game.bullets.push(new asteroids_game.bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation, 0));
                    asteroids_game.bullets.push(new asteroids_game.bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation + 45, 0));
                    asteroids_game.bullets.push(new asteroids_game.bullet(context, this.x, this.y + .5 * this.h, this.vx, this.vy, this.rotation - 45, 0));
                }
            }
        },
        gainPowerup: function (powerup) {
            powerupSound.play();
            if (powerup.ability === 'speed') {
                this.setAccelerationCoefficient(.1);
                asteroids_game.powerupMessages.push(new asteroids_game.powerupMessage(this.x, this.y, "Speed+! Current speed is " + this.accelerationCoefficient.toFixed(1) * 10));
            }
            if (powerup.ability === 'double') {
                this.weaponType = 'double';
                asteroids_game.powerupMessages.push(new asteroids_game.powerupMessage(this.x, this.y, "Double gun!"));
            }
            if (powerup.ability === 'rear') {
                this.weaponType = 'rear';
                asteroids_game.powerupMessages.push(new asteroids_game.powerupMessage(this.x, this.y, "Rear gun!"));
            }
            if (powerup.ability === 'spread') {
                this.weaponType = 'spread';
                asteroids_game.powerupMessages.push(new asteroids_game.powerupMessage(this.x, this.y, "Spread gun!"));
            }
        },
        update: function () {
            var canvas = asteroids_game.getCanvas();
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

            if (asteroids_game.powerups) {
                    for (var i = 0; i < asteroids_game.powerups.length; i++) {
                        var dx = asteroids_game.powerups[i].x - this.x;
                        var dy = asteroids_game.powerups[i].y - this.y;
                        var distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < asteroids_game.powerups[i].radius + this.h) {
                            this.gainPowerup(asteroids_game.powerups[i]);
                            asteroids_game.powerups.splice(i, 1);
                        }
                    }                    
            }

            if (asteroids_game.asteroids) {
                    for (var i = 0; i < asteroids_game.asteroids.length; i++) {
                        var dx = asteroids_game.asteroids[i].x - this.x;
                        var dy = asteroids_game.asteroids[i].y - this.y;
                        var distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < asteroids_game.asteroids[i].width * .5) {
                            this.vx = 0;
                            this.vy = 0;
                            this.x = canvas.width / 2;
                            this.y = canvas.height / 2;
                        }
                    }                    
            }

            if (asteroids_game.key) {
                    if (asteroids_game.key.isDown(asteroids_game.key.UP)) {
                        this.accelerate();
                    }
                    if (asteroids_game.key.isDown(asteroids_game.key.LEFT)) {
                        this.rotate(-5);
                    }
                    if (asteroids_game.key.isDown(asteroids_game.key.RIGHT)) {
                        this.rotate(5);
                    }
                    if (asteroids_game.key.isDown(asteroids_game.key.DOWN)) {
                        this.accelerationCoefficient += .1;
                    }
                    if (asteroids_game.key.isDown(asteroids_game.key.SPACE)) {
                        this.shoot();
                    }                    
            }


        }
    }
    return asteroids_game;
}(ASTEROIDS_GAME));