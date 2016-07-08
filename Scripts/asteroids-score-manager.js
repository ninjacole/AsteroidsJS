/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.ScoreManager');


ASTEROIDS.ScoreManager = function () {
    var that = this;
    
    that.getCookie = function (cname) {
        var name = cname + "=",
            ca = document.cookie.split(';'),
            i,
            c;
        for (i = 0; i < ca.length; i += 1) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
    
    that.setCookie = function (cname, cvalue, exdays) {
        var d = new Date(),
            expires;
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };
};