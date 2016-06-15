var ASTEROIDS_GAME = (function (asteroids_game) {
    asteroids_game.key = {
        _pressed: {},

        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32,

        isDown: function (keyCode) {
            return this._pressed[keyCode];
        },

        onKeyDown: function (event) {
            this._pressed[event.keyCode] = true;
        },

        onKeyUp: function (event) {
            delete this._pressed[event.keyCode];
        }
    };

    document.addEventListener('keyup', function (event) { asteroids_game.key.onKeyUp(event); }, false);
    document.addEventListener('keydown', function (event) { asteroids_game.key.onKeyDown(event); }, false);

    return asteroids_game;

})(ASTEROIDS_GAME);