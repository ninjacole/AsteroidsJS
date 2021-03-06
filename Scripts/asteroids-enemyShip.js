/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.enemy');

ASTEROIDS.enemy = function () {
    // dependencies
    var key = ASTEROIDS.key,
        bullet = ASTEROIDS.bullet,
        weapon = ASTEROIDS.weapon,
        player = ASTEROIDS.player,
        canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
        enemyDeathSound = document.getElementById('enemy-death'),
        
        // private variables
        img = document.getElementById('enemy'),
        x = Math.random() > 0.5 ? 50 : canvas.width - 100,
        y = Math.random() > 0.5 ? 50 : canvas.height - 100,
        vx = Math.random() * 3,
        vy = Math.random() * 3,
        width = 40,
        height = 20,
        lastFired = Date.now(),
        fireRate = 1500,
        lastChangedDirection = Date.now(),
        directionChangeRate = 5000,
        enemy;
    
    // public interface
    enemy = {
        getX: function () {
            return x;
        },
        getY: function () {
            return y;
        },
        die: function () {
            enemyDeathSound.play();
        },
        getVX: function () {
            return vx;
        },
        getVY: function () {
            return vy;
        },
        getWidth: function () {
            return width;
        },
        getHeight: function () {
            return height;
        },
        getCenterX: function () {
            return x + 0.5 * width;
        },
        getCenterY: function () {
            return y + 0.5 * height;
        },
        getCircleCollider: function () {
            return {
                radius: width / 2,
                x: this.getCenterX(),
                y: this.getCenterY()
            };
        },
        changeDirection: function () {
            lastChangedDirection = Date.now();
            var vxchange = Math.random() * 3,
                vychange = Math.random() * 3;
            if (Math.random() > 0.5) {
                vychange *= -1;
            }
            if (Math.random() > 0.5) {
                vxchange *= -1;
            }
            vx = vxchange;
            vy = vychange;
        },
        draw: function () {
            context.fillRect(this.getCenterX(), this.getCenterY(), 5, 5);
            context.drawImage(img, x, y, width, height);
        },
        canShoot: function () {
            return Date.now() - lastFired > fireRate;
        },
        shoot: function () {
            if (this.canShoot()) {
                lastFired = Date.now();
                weapon.fireEnemyBullet(this.getCenterX(), this.getCenterY(), player.getX(), player.getY());
            }
        },
        canChangeDirection: function () {
            return Date.now() - lastChangedDirection > directionChangeRate;
        },
        update: function () {
            if (this.canChangeDirection()) {
                this.changeDirection();
            }
            if (this.canShoot()) {
                this.shoot();
            }
            x += vx;
            y += vy;

            if (x + vx > canvas.width) {
                x = 0;
            }
            if (x + vx < 0) {
                x = canvas.width;
            }
            if (y + vy > canvas.height) {
                y = 0;
            }
            if (y + vy < 0) {
                y = canvas.height;
            }
        }
    };
    return enemy;
};