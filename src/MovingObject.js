"use strict";

const GameObject = require('./GameObject.js');

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
    this.reset();
}

MovingObject.prototype = Object.create(GameObject.prototype);
MovingObject.constructor = MovingObject;

MovingObject.prototype.update = function() {
	if(this.dir[0] === 0 && this.dir[1] === 0 && !this.ndir) {
//        console.log('MO.update: dir 0,0');
  	    return false;
    }

    if(this.steps === 0) 
    {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.pos[0] = parseInt(this.x,10);
        this.pos[1] = parseInt(this.y,10);
//        console.log("MO.update, new sqr  pos, ndir", this.pos, this.ndir);
        if(this.ndir && this.ndir.length == 2) { 
            var nextPos = [ (this.pos[0] + this.ndir[0]), 
                            (this.pos[1] + this.ndir[1]) ];
            if(this.canMoveTo(nextPos[0], nextPos[1]))  {
                this.steps = Math.floor(1/this.speed);
                this.dir = this.ndir;
            } else {
//                console.log("MO.update, impossible new dir", this.ndir);
                this.dir = [0,0];
                this.ndir = false;
                return false;
            }
        } else {
            console.log('no new dir..');
            this.dir = [0,0];
            return false;
        }
        
    }
    if(this.steps !== 0) {
//        console.log("MO.update, step speed: ", this.speed, this.dir[0]*this.speed, this.dir[1]*this.speed);
        this.steps--;
        this.x = Math.round((this.x + this.dir[0]*this.speed)*100)/100;
        this.y = Math.round((this.y + this.dir[1]*this.speed)*100)/100;
    }
    //	  console.log("pacman moved to", this.x, this.y, nextPos, this.dir,this.pos);
  	return true;
};

// x and y must be integers
MovingObject.prototype.canMoveTo = function(x, y) {
//  console.log("MovingObject.canMoveTo", x, y);
  if ((this.game.field.at(x, y) !== '#')) {
    return true;
  }
  return false;
};

/*MovingObject.prototype.maybeMove = function(xd, yd) {
  var r = this.canMoveTo(math.floor(this.x) + Math.ceil(xd), Matthis.y + Math.ceil(yd));
  if (r) {
    this.x = r[0];
    this.y = r[1];
    return true;
  }
  return false;
};*/

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
