"use strict";

const GameObject = require('./GameObject.js');
import Brick from './Brick';

/**
 * MovingObject
 */
function MovingObject(game, attr) {
//  console.log("MovingObject", arguments);
    GameObject.call(this, game, Object.assign({speed: 0}, attr));
    this.speed = this.attr.speed;
    this.dir = [0, 0];
    this.pos = [0,0]; // where on field
    this.steps = 0;
    this.score = 0;
    this.reset();
}

MovingObject.prototype = Object.create(GameObject.prototype);
MovingObject.constructor = MovingObject;

MovingObject.prototype.update = function() {
    let ql = Math.PI,dio=0;
    if(this.dir[0] === -1) { // moving left
        dio = -ql;
    } else if(this.dir[1] === -1) { // moving up
        dio = -ql/2;
    } else if(this.dir[1] === 1) { // moving down
        dio = ql/2;
    } else { // moving right
        dio = 0;
    }
    this.rot = (this.rot + this.rot + dio) / 3;

	  if(this.dir[0] === 0 && this.dir[1] === 0 && !this.ndir) {
  	    return false;
    }

    if(this.steps === 0) 
    {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.pos[0] = parseInt(this.x,10);
        this.pos[1] = parseInt(this.y,10);

        if(this.ndir && this.ndir.length === 2) { 
            this.next_pos = [ (this.pos[0] + this.ndir[0]), 
                              (this.pos[1] + this.ndir[1]) ];
            if(this.canMoveTo(this.next_pos[0], this.next_pos[1]))  {
                this.steps = Math.floor(1/this.speed);
                this.dir = this.ndir;
            } else {

                this.dir = [0,0];
                this.ndir = false;
                return false;
            }
        } else {
            this.dir = [0,0];
            return false;
        }
        
    }
    if(this.steps !== 0) {
        this.steps--;
        this.x = Math.round((this.x + this.dir[0]*this.speed)*100)/100;
        this.y = Math.round((this.y + this.dir[1]*this.speed)*100)/100;
        this.game.field.markDirty(this.pos[0], this.pos[1]);
        this.game.field.markDirty(this.next_pos[0], this.next_pos[1]);
    }

    //	  console.log("pacman moved to", this.x, this.y, nextPos, this.dir,this.pos);
  	return true;
};

// x and y must be integers
MovingObject.prototype.canMoveTo = function(x, y) {
  let af = this.game.field.at(x, y);
  if(af.length === 0) {
    return true;
  }
  let nos = af.filter((go) => { return (go instanceof Brick); });
  return nos.length === 0;
};

MovingObject.prototype.up = function() {
    this.ndir = [0, -1];
};

MovingObject.prototype.down = function() {
  this.ndir = [0, 1];
};

MovingObject.prototype.left = function() {
  this.ndir = [-1, 0];
};

MovingObject.prototype.right = function() {
  this.ndir = [1, 0];
};

MovingObject.prototype.stop = function() {
  this.ndir = [0, 0];
};


module.exports = MovingObject;
