"use strict";

const scale = require('./Config').scale;
const pacmanSpeed =  require('./Config').pacmanSpeed;
const MovingObject = require('./MovingObject');

function PacMan(game) {
    console.log('PacMan.constructor MovingObject.prototype:', MovingObject.prototype);
    MovingObject.call(this, game, {
                          fillStyle: "yellow",
                          strokeStyle: "blue",
                          speed: pacmanSpeed,
                          radius: scale/2});
}

PacMan.prototype = Object.create(MovingObject.prototype);
PacMan.constructor = PacMan;

PacMan.prototype.reset = function() 
{
    this.x = 1;
    this.y = 1;
    this.pos = [this.x, this.y];
    this.dir = [0,0];
};

// returns true if moved
PacMan.prototype.update = function() {
//    console.log('PacMan.update calling parent');
    if(!MovingObject.prototype.update.apply(this, [this]) ){
//        console.log('PacMan.update parent said no move');
        return false;
    }
//    console.log('PacMan.update parent moved us to ', this.x, this.y, this.pos);
    return true;
/*    if(this.canMoveTo(this.x + this.dir[0], this.y + this.dir[1])) {
        this.x += this.dir[0];
        this.y += this.dir[1];
        return true;
    }
    this.stop();
    return false;*/
};


module.exports = PacMan;
