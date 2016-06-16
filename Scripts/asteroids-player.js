var ASTEROIDS_GAME = (function (asteroids_game) {
    asteroids_game.player = function() {
        var that = this;
        this.point = asteroids_game.point(asteroids_game.getCanvasCenterX(), asteroids_game.getCanvasCenterY());
        this.shape = new asteroids_game.triangle(this.point, 15, 30);

        this.vx = 0;
        this.vy = 0;

        this.lastFired = (new Date).getTime();
        this.accelerationCoefficient = .1;
        this.maxSpeed = 20;
        this.maxAccelerationCoefficient = 1;
        this.fireRate = 300;
        this.weapon = new asteroids_game.weapon('single');

        
        this.draw = function() {
            this.shape.draw();
        }

        this.setVX= function(vx) {
            this.vx + vx > this.maxSpeed ? this.vx = this.maxSpeed : this.vx += vx;
        }

        this.setVY= function (vy) {
            this.vy + vy > this.maxSpeed ? this.vy = this.maxSpeed : this.vy+= vy;
        }

        this.accelerate = function () {
            var vx = Math.sin((Math.PI / 180) * (180 - this.rotation)) * this.accelerationCoefficient; // create a vector based on current rotation
            var vy = Math.cos((Math.PI / 180) * (180 - this.rotation)) * this.accelerationCoefficient; // create y vector based on current rotation
            this.setVX(vx);
            this.setVY(vy);
        }

        this.setAccelerationCoefficient = function (value) {
            var newValue = this.accelerationCoefficient + value;
            newValue > this.maxAccelerationCoefficient ? this.accelerationCoefficient = this.maxAccelerationCoefficient : this.accelerationCoefficient = newValue;
        }

        this.isFireReady = function() {
            return ((new Date).gettime() - this.lastFired > this.fireRate);
        }

        this.isFiring = function () {
            this.lastFired = (new Date).getTime();
        }

        this.shoot = function () {
            if (this.isFireReady()) {
                this.isFiring();
                this.weapon.fire();
            }
        }

        this.gainPowerup = function (powerup) {
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
        }

        this.update = function () {
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
        return asteroids_game;
    }
} (ASTEROIDS_GAME));