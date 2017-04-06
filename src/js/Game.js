"use strict";

const gameSpeed = require('./Config').gameSpeed;
const fieldSize = require('./Config').fieldSize;
const ghostSpeed = require('./Config').ghostSpeed;
const maxGhosts = require('./Config').maxGhosts;
const ghostStyles = require('./Config').ghostStyles;
const scale = require('./Config').scale;

const Field = require('./Field');
const PacMan = require('./PacMan');
const Ghost = require('./Ghost');
import Brick from './Brick';


function Game(map) 
{
  this.score = 0;
  this.map = map;
  this.renderer = false;
}

Game.prototype.setRenderer = function(renderer) {
    this.renderer = renderer;
};

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
        this.renderer.beginFrame();
	    this.update();
	    this.draw();
        this.renderer.endFrame();
        this.lastUpdate = now;
    }
    requestAnimationFrame(this.frame.bind(this));
};

Game.prototype.update = function() 
{
    this.renderer.Zoom = 1.00;

    //	console.log("Game.update");
    var now = Date.now();
    if(this.ghosts.length < maxGhosts && (now - this.lastGhost) > 10000) {
  	    this.lastGhost = now;
        this.ghosts.push(new Ghost(this, {speed: (1+this.ghosts.length)*ghostSpeed, styles: ghostStyles[this.ghosts.length]}));
    }

    // Update all moving objects
    [].concat(this.pacman).concat(this.ghosts)
        .forEach((go) => {
                let px = go.pos[0],
                    py = go.pos[1];
                if(go.update()) {
                    // Moved to a new square, try to eat
                    if(go.pos[0] !== px || go.pos[1] !== py) {
//                        this.field.markDirty(px,py);
                        px = go.pos[0];
                        py = go.pos[1];
                        let c = this.field.at(px,py);
                        if(c.length !== 0) {
                            // Sum up score of all things here
                            go.score += c.reduce((acc, go) => {
                                return acc + (go.attr.edible) ? go.consume() : 0;
                            }, 0);
                        }

                        if(go.score < 0) {
                            if(this.ghosts.indexOf(go) !== -1) {
                                this.ghosts.splice(this.ghosts.indexOf(go),1);
                                console.log("Ghost died!");
                            } else {
                                this.gameOver("Player ran out of points!");
                            }
                        }
                    }

                }
            });

    document.getElementById('score').innerText = this.pacman.score;

    // Zoom is based on how far to next brick in current direction
    let srch = [this.pacman.dir[0], this.pacman.dir[1]];
    let dist = 0;
    let hit = false;
    srch[0] += this.pacman.pos[0];
    srch[1] += this.pacman.pos[1];
    do {
        let af = this.field.at(srch[0],srch[1]);
        if(af && af.length === 1 && af[0] instanceof Brick) {
            hit = true;
        }
        dist++;
        srch[0] += this.pacman.dir[0];
        srch[1] += this.pacman.dir[1];
    } while(hit === false && dist < fieldSize);
    if(dist < 2) {
        dist=0;
    }
    dist = ((this._last_dist || 0)*7 + dist) / 8.0;
    this._last_dist = dist;
    console.log('found dist %d',dist);
    this.renderer.Zoom = 1.0+((fieldSize-dist)/16);
    this.renderer.Center = [-((scale*this.pacman.x) - (fieldSize*scale/4)),
                            -((scale*this.pacman.y) - (fieldSize*scale/4))];

    this.ghosts.forEach(function(ghost) {
        if (this.pacman.pos[0] === ghost.pos[0] && 
            this.pacman.pos[1] === ghost.pos[1]) {
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
//    let pr = this.pacman.rot;
//    this.pacman.rot = 0;
//    this.renderer.Rotation = pr;
//	console.log("Game.draw field=,pacman=",this.field,this.pacman);
  this.field.draw();

  this.renderer.beginUpdate(this.pacman.pos[0], this.pacman.pos[1]);
  this.renderer.renderGameObject(this.pacman);
  this.renderer.endUpdate();

  this.ghosts.forEach((ghost) => {
    this.renderer.beginUpdate(ghost.pos[0], ghost.pos[1]);
    this.renderer.renderGameObject(ghost);
    this.renderer.endUpdate();
  });
//  this.pacman.rot = pr;
};

module.exports = Game;
