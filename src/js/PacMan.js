"use strict";

import {scale,pacmanSpeed} from './Config';
const MovingObject = require('./MovingObject');
const Poop = require('./Poop');

function PacMan(game) {
    MovingObject.call(this, 
                      game, 
                      {
                        styles: {
                          fillStyle: "yellow",
                          strokeStyle: "",
                          strokeWidth: 0
                        },
                        speed: pacmanSpeed,
                        primitives: [
                           {type: 'sphere',
                            radius: scale/2-1,
                            center: true,
                            start_angle: Math.PI / 4,
                            end_angle: Math.PI * 2 - ( Math.PI / 4)},
                           {type: 'triangle',
                            center: true,
                            points: [[-3,0], [scale/3+1,-scale/4],[scale/3+1,scale/4]], // updated by update()
                            styles: {
                                fillStyle: "black"
                            }                           
                           }
                        ]
                      });
}

PacMan.prototype = Object.create(MovingObject.prototype);
PacMan.constructor = PacMan;

PacMan.prototype.poop = function() {
    let poop = new Poop(this.game, {x: this.pos[0], y: this.pos[1]});
    if(this.game.field.add(poop)) {
        console.log("Pooped at ", this.pos); 
    } else {
        console.log("Could not poop at", this.pos);
    }
};

PacMan.prototype.reset = function() 
{
    this.x = 1;
    this.y = 1;
    this.rot = 0;
    this.pos = [this.x, this.y];
    this.dir = [0,0];
    this.frame_cnt = 0;
};

// returns true if moved
PacMan.prototype.update = function() {

    if(this.frame_cnt > 0) {
        let fully_open = (Math.PI - (Math.PI/6)) / 3;
        let msize = fully_open * ((Math.sin(Math.PI*2*(1/this.frame_cnt))+0.5));
        this.frame_cnt--;

        let sa = msize, ea = (Math.PI*2 - msize), dio = 0;
        this.attr.primitives[0].start_angle = sa;
        this.attr.primitives[0].end_angle = ea;
    }
    if(!MovingObject.prototype.update.apply(this, [this]) ){
//        console.log('PacMan.update parent said no move');
        return false;
    }
    if(this.frame_cnt === 0) {
        this.frame_cnt = 9;
    }
//    console.log('PacMan.update parent moved us to ', this.x, this.y, this.pos);
    return true;
};


module.exports = PacMan;
