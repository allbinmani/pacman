/* global window */
"use strict";

import {scale, fieldSize} from './Config';
import Canvas2DRenderer from './Canvas2DRenderer';

// Still 'old' js
const Game = require('./Game.js');
const maps = require('./Maps.js');

// 'old' js
const Modplayer = require('webaudio-mod-player');

let modplayer = new Modplayer();

let loadMusic = function(modno, autostart) {
    let url = false;
    switch(modno) {
//        case 1:
            // break;
        default:
            url = 'assets/pacman%20beats7.mod';
            break;
    }

    modplayer.onReady = function() {
        if(autostart) {
            modplayer.play();
        } else {
            modplayer.stop();
        }
    };
    modplayer.load(url);
};

// browser-wait
window.addEventListener('load', 
function() {

    loadMusic(0, !(localStorage.getItem('mute') || false));

    var canvas = document.getElementById("screen");
    if(!canvas) {
        window.alert("ERROR: Canvas element 'screen' not found");
        return;
    }
    canvas.width = fieldSize * scale;
    canvas.height = fieldSize * scale;

    var renderer = new Canvas2DRenderer(canvas);

    window.ctx = canvas.getContext("2d"); // FIXME: booh!
    var game = new Game(maps[1]);
    game.setRenderer(renderer);

    game.start();

    window.onkeydown = function(e) {
        var r = false;
//        console.log("key:",e.key);
        switch (e.key) {
        case " ":
            game.pacman.poop();
            break;
        case "ArrowUp":
        case "w":
            game.pacman.up();
            break;
        case "ArrowDown":
        case "s":
            game.pacman.down();
            break;
        case "ArrowLeft":
        case "a":
            game.pacman.left();
            break;
        case "ArrowRight":
        case "d":
            game.pacman.right();
            break;
        }
    };
                            
});
