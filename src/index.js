
const fieldSize = require('./Config.js').fieldSize;
const scale = require('./Config.js').scale;

const Game = require('./Game.js');
const maps = require('./Maps.js');

window.addEventListener('load', 
function() {
    var canvas = document.getElementById("screen");
    canvas.width = fieldSize * scale;
    canvas.height = fieldSize * scale;
    window.ctx = canvas.getContext("2d"); // FIXME: booh!

    var game = new Game(maps[1]);
    game.start();

    window.onkeydown = function(e) {
        var r = false;
//        console.log("key:",e.key);
        switch (e.key) {
        case "ArrowUp":
        case "w":
            r = game.pacman.up();
            break;
        case "ArrowDown":
        case "s":
            r = game.pacman.down();
            break;
        case "ArrowLeft":
        case "a":
            r = game.pacman.left();
            break;
        case "ArrowRight":
        case "d":
            r = game.pacman.right();
            break;
        }
    };
                            
});
