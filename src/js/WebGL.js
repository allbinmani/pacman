"use strict";

module.exports = function InitGL(canvas)
{
    var gl = false;
    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
        console.warn("Could not initialise WebGL:", e.message);
    }

    if (gl) {
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } else {
        console.warn("No WebGL support :(");
    }

    return gl;
};
