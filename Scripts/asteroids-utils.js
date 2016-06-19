/*jslint node: true */
'use strict';

// global object
var ASTEROIDS = ASTEROIDS || {};

// util function for adding new namespaces
ASTEROIDS.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = ASTEROIDS,
        i;
    
    // strip redundant leading global
    if (parts[0] === "ASTEROIDS") {
        parts = parts.slice(1);
    }
    
    for (i = 0; i < parts.length; i += 1) {
        // create a property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};