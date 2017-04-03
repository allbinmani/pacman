"use strict";

const gameSpeed = require('./Config').gameSpeed;
const maxGhosts = require('./Config').maxGhosts;

const Field = require('./Field');
const PacMan = require('./PacMan');
const Ghost = require('./Ghost');


function Game(map) 
{
  this.score = 0;
  this.map = map;
}

Game.prototype.start = function() 
{
    this.field = new Field(this, this.map);
    this.pacman = new PacMan(this);
    this.ghosts = [];
    this.lastGhost = 0;
    this.lastUpdate = 0;
    this.frame();
};

Game.prototype.frame = function() 
{
    var now = Date.now();
    if(now - this.lastUpdate > gameSpeed) {
	    this.update();
	    this.draw();
        this.lastUpdate = now;
    }
    requestAnimationFrame(this.frame.bind(this));
};

Game.prototype.update = function() 
{
    //	console.log("Game.update");
    var now = Date.now();
    if(this.ghosts.length < maxGhosts && (now - this.lastGhost) > 5000) {
  	    this.lastGhost = now;
        this.ghosts.push(new Ghost(this));
    }
    
    this.pacman.update();
    this.ghosts.forEach(function(ghost) {
                            ghost.update();
                        });

	var px = this.pacman.pos[0],
    py = this.pacman.pos[1];
	var res = this.field.eat(px, py);
    if (res !== false) { // Candy!!
        this.score += parseInt(res.score,10);
        document.getElementById('score').innerText = this.score;
    }

    this.ghosts.forEach(function(ghost) {
                            if (px === ghost.pos[0] && py === ghost.pos[1]) {
                                this.gameOver("Killed by a ghost!");
                            }
                        }.bind(this));
};

Game.prototype.gameOver = function(reason) 
{
	console.log("Game.gameOver:" + reason);
    //  alert('Game Over!');
    this.score = 0;
    this.start();
};

Game.prototype.draw = function() 
{
//	console.log("Game.draw field=,pacman=",this.field,this.pacman);
  this.field.draw();
  this.pacman.draw();
  this.ghosts.forEach(function(ghost) {
    ghost.draw();
  });
};

module.exports = Game;
