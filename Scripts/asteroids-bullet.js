var ASTEROIDS_GAME = (function (asteroids_game) {
    asteroids_game.bullet = function (playerShape, offset) {
        this.duration = 700;
        this.startTime = (new Date).getTime();
        this.timeTravelled = 0;
        this.rotation = rotation;
        this.width = 6;
        this.height = 6;
        this.offset = offset;

        this.speed = 7;

        this.x = playerShape.center.x;
        this.y = playerShape.center.y;

        this.vx = vx;
        this.vy = vy;

        this.vx += Math.sin((Math.PI / 180) * (180 - this.rotation)) * this.speed; // create a vector based on current rotation
        this.vy += Math.cos((Math.PI / 180) * (180 - this.rotation)) * this.speed; // create y vector based on current rotation

        this.draw = function () {
            var context = asteroids_game.getContext();
            var canvas = asteroids_game.getCanvas();

            context.save();
            context.translate(this.x, this.y);
            context.rotate(asteroids_game.convertDegreesToRads(this.rotation)); // turn the entire graph within the canvas x radians

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
    };
    return asteroids_game;

}(ASTEROIDS_GAME));