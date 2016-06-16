var ASTEROIDS_GAME = (function (asteroids_game) {
    asteroids_game.weapon = function (type, playerShape) {
        this.type = type;

        this.fireSound = document.getElementById('laserSound');

        this.makeFireSound = function (times) {
            for (var i = 0; i < times; i++) {
                this.fireSound.currentTime = 0;
                this.fireSound.play();
            }
        }

        this.fire = function () {
            if (this.type === 'single') {
                makeFireSound(1);
                asteroids_game.bullets.push(new asteroids_game.bullet(playerShape, 0));
            } else if (this.weaponType === 'double') {
                makeFireSound(2);
                asteroids_game.bullets.push(new asteroids_game.bullet(playerShape, 2));
                asteroids_game.bullets.push(new asteroids_game.bullet(playerShape, -2));
            } else if (this.weaponType === 'rear') {
                makeFireSound(2);
                asteroids_game.bullets.push(new asteroids_game.bullet(playerShape, 0));
                asteroids_game.bullets.push(new asteroids_game.bullet(playerShape, 0));
            } else if (this.weaponType === 'spread') {
                makeFireSound(3);
                asteroids_game.bullets.push(new asteroids_game.bullet(playerShape, 0));
                asteroids_game.bullets.push(new asteroids_game.bullet(playerShape, 0));
                asteroids_game.bullets.push(new asteroids_game.bullet(playerShape, 0));
            }
        }
    }
}(ASTEROIDS_GAME));