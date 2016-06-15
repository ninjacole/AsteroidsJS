var ASTEROIDS_GAME = (function (asteroids_game) {
    asteroids_game.player = {
        canvas: asteroids_game.getCanvas(),
        context: asteroids_game.getContext(),
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
            this.context.save();
            this.context.translate(this.x, this.y + this.h * .5); // move the origin to the center of the triangle (500, 415)
            this.context.rotate(asteroids_game.convertDegreesToRads(this.rotation)); // turn the entire graph within the canvas x radians
            this.context.translate(-1 * (this.x), -1 * (this.y + this.h * .5)); // move the origin back to the top left corner

            // draw the triangle
            this.context.beginPath();
            this.context.moveTo(this.x, this.y);
            this.context.lineTo(this.x - this.w * .5, this.y + this.h);
            this.context.lineTo(this.x + this.w * .5, this.y + this.h);
            this.context.lineTo(this.x, this.y);
            this.context.fill()
            this.context.closePath();
            this.context.restore();
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

                if (distance < asteroids[i].width * .5) {
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
    return asteroids_game;
}(ASTEROIDS_GAME));