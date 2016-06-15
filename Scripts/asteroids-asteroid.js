var ASTEROIDS_GAME = (function (asteroids_game) {

    asteroids_game.asteroid = function (x, y, vx, vy, spinFactor, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.rotation = 0;
        this.spinFactor = spinFactor;
        this.height = size * 15;
        this.width = size * 15;
        this.size = size;
        this.explosionSound = document.getElementById('explosionSound');

        this.draw = function () {
            var context = asteroids_game.getContext();
            context.save();
            context.translate(this.x, this.y);
            context.rotate(asteroids_game.convertDegreesToRads(this.rotation));
            context.fillRect(-.5 * this.width, -.5 * this.height, this.width, this.height);
            context.restore();
        }

        this.update = function () {
            var canvas = asteroids_game.getCanvas();
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
    };

    asteroids_game.spawnAsteroids = function () {
        var asteroidCount = asteroids_game.getCurrentWave() * 5 - 2;
        for (var i = 0; i < asteroidCount; i++) {
            var canvas = asteroids_game.getCanvas();
            var velCox = Math.random() < 0.5 ? -1 : 1;
            var velCoy = Math.random() < 0.5 ? -1 : 1;
            var randomXPosition = Math.random() * canvas.width;
            var randomYPosition = Math.random() * canvas.height;
            var randomXV = Math.ceil(Math.random() * 5 * velCox);
            var randomXY = Math.ceil(Math.random() * 5 * velCoy);
            var randomSpinFactor = Math.ceil(Math.random() * 4);
            var randomSize = Math.ceil(Math.random() * 6);
            asteroids_game.asteroids.push(new asteroids_game.asteroid(randomXPosition, randomYPosition, randomXV, randomXY, randomSpinFactor, randomSize));
        }
    };

    return asteroids_game;
}(ASTEROIDS_GAME));