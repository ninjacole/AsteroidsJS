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
    return asteroids_game;

})(ASTEROIDS_GAME);