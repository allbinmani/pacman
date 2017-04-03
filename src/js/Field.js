/* global ctx */
"use strict";

const scale = require('./Config').scale;
const fieldSize = require('./Config').fieldSize;
const candyScore = require('./Config').candyScore;

const Candy = require('./Candy');

/**
 * Field
 */

function Field(game, map) {
    this.game = game;
    this.data = [];
    this.map = map;
    this.reset();
}

// x and y must be integers
Field.prototype.at = function(x, y) {
    return this.data[y][x];
};

Field.prototype.eat = function(x, y) {
    var c = this.data[y][x];
    return (c instanceof Candy) && c.attr.edible ? c.consume() : false;
};

Field.prototype.reset = function() 
{
    var game = this.game;
    this.candy = [];
    var data = [];
    this.map.forEach(
        function(row, y) 
        {
            return row.split('').forEach(
                function(c, x) {
                    if (c !== '#') {
      	                // TODO: Candy type
                        c = new Candy(game, {x:x, y:y, score: candyScore[0]});
	                    this.candy.push(c);
                        
                    }
                    if(!data[y]) {
                        data[y] = [];
                    }
                    data[y][x] = c;
                }.bind(this));
        }.bind(this));
    this.dirty = [];
    this.data = data;
	this.firstDraw = true;
};

Field.prototype.markDirty = function(x,y) {
	this.dirty[y][x] = true;
};

Field.prototype.draw = function() {
//	console.log("Field.draw");
	if(this.firstDraw) {

        ctx.beginPath();
        ctx.rect(0, 0, Math.floor(scale*fieldSize), Math.floor(scale*fieldSize));
        ctx.strokeStyle = "lightblue";
        ctx.fillStyle = "black";
        ctx.fill();

        for (var y = 0; y < fieldSize; y++) {
            for (var x = 0; x < fieldSize; x++) {
                
                if (this.data[y][x] === '#') {
                    ctx.beginPath();
                    ctx.rect(x * scale, y * scale, scale, scale);
                    ctx.fillStyle = "blue";
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }
  	    this.firstDraw = false;
	}
    this.dirty = [];
    this.candy.forEach(function(c) { c.draw(); });
};



module.exports = Field;
