var ASTEROIDS_GAME = (function (asteroids_game) {
    asteroids_game.powerup = function (context, x, y, ability) {
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
            var context = asteroids_game.getContext();
            context.save();
            context.getContext().beginPath();
            context.getContext().arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            context.fillStyle = this.getRadGrad();
            context.fill();
            context.restore();
        }
    };
    return asteroids_game;
}(ASTEROIDS_GAME));