"use strict";

const fieldSize = require('./Config').fieldSize;
const ghostSpeed = require('./Config').ghostSpeed;
const scale = require('./Config').scale;

const MovingObject = require('./MovingObject.js');
const Candy = require('./Candy.js');

/**
 * Ghost
 */

function Ghost(game, attr)
{
  MovingObject.call(this, game, {speed: ghostSpeed,
  															 fillStyle: 'orange', strokeStyle: 'white', 
                                 radius: scale/2,
  															 edible: false, 
                                 score: 10}, attr);
    this.attr.orig_speed = this.attr.speed;
}

Ghost.prototype = Object.create(MovingObject.prototype);
Ghost.constructor = Ghost;

Ghost.prototype.reset = function() 
{
//	console.log("Ghost.reset");
    // Ghosts start in the center.
    this.x = fieldSize>>1;
    this.y = fieldSize>>1;
    this.dir = [0,0];
    this.pos = [this.x, this.y];
    this.steps = 0;
};

Ghost.prototype.update = function() 
{
    if (//(this.dir[0] === 0 && this.dir[1] === 0) ||
        (Math.random() < 0.005) ||
        (!MovingObject.prototype.update.apply(this, [this]) )) 
    {
        // Choose a new direction, that is preferably NOT the current direction
        do {
//            console.log('Ghost.update pick new dir', this.dir, this.ndir);
            switch (Math.floor(Math.random() * 4)) {
            case 0:
      	        this.left();
                break;
            case 1:
      	        this.right();
                break;
            case 2:
      	        this.up();
                break;
            case 3:
      	        this.down();
                break;
            }
        } while(this.dir[0] === this.ndir[0] && this.dir[1] === this.ndir[1]);
        return false;
    } else {
        return true;
    }
};



module.exports = Ghost;
