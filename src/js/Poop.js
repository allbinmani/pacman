"use strict";

const scale = require('./Config.js').scale;
const GameObject = require('./GameObject.js');

/**
 * Poop
 */

function Poop(game, attrs) 
{
    //  console.log("Poop", arguments);
 	GameObject.call(this, 
                    game, 
                    Object.assign({
                        styles: {
                          fillStyle: "brown"
                        },
                        speed: 0,
                        edible: true,
                        score: -100,
                        primitives: [
                           {type: 'sphere',
                            center: true,
                            radius: scale/3,
                            start_angle: Math.PI / 4,
                            end_angle: Math.PI * 2}
                        ]
                    }, attrs));
	this.attr.orig_size = this.attr.size;
}

Poop.prototype = Object.create(GameObject.prototype);
Poop.constructor = Poop;

Poop.prototype.reset = function() {
	this.eaten = false;
    this.attr.size = this.attr.orig_size;
};

Poop.prototype.consume = function() {
    if(this.attr.size <= 1 || this.eaten || !this.attr.edible) {
        return 0;
    }
    this.attr.size = 0;
    this.attr.primitives[0].size = this.attr.size; // FIXME
    this.eaten = this.attr.size < 1;
    if(this.eaten) {
        this.game.field.remove(this);
    }
    return this.attr.score;
};


module.exports = Poop;
