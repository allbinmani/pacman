"use strict";

const scale = require('./Config.js').scale;
const GameObject = require('./GameObject.js');

/**
 * Candy
 */

function Candy(game, attr) 
{
    //  console.log("Candy", arguments);
    this.x = attr.x || 0;
    this.y = attr.y || 0;
    GameObject.call(this, 
                    game, 
                    Object.assign({ 
                      styles: {
                        fillStyle: 'blue',
                        strokeWidth: 1,
                        strokeStyle: ''
                      },
                      primitives: [
                        {type: 'box',
                         center: true,
                         size: scale/2,
                         styles: {
                            fillStyle: 'yellow', 
                            strokeStyle: ''
                         }
                        },
                        {type: 'box',
                         center: true,
                         size: scale/3,
                         styles: {
                            fillStyle: 'orange',
                            strokeStyle: 'purple'
                         }
                        }
                      ],
                      orig_size: (scale/2),
                      edible: true, 
                      score: 5}, 
                      attr)
                    );
    this.attr.orig_size = this.attr.size;
}

Candy.prototype = Object.create(GameObject.prototype);
Candy.constructor = Candy;

Candy.prototype.reset = function() {
    this.eaten = false; 
    this.attr.size = this.attr.orig_size;
};

Candy.prototype.consume = function() {
    if(this.attr.size <= 1 || this.eaten || !this.attr.edible) {
        return 0;
    }
//    console.log("Candy.consume", this.x, this.y, this.attr.size);
    this.attr.size >>= 1;
    this.attr.primitives[0].size = this.attr.size; // FIXME
    this.eaten = this.attr.size < 1;
    if(this.eaten) {
      this.game.field.remove(this);
    }
    this.game.field.markDirty(this.pos[0],this.pos[1]);

    return this.attr.score;
};


module.exports = Candy;
