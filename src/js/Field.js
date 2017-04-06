/* global ctx */
"use strict";

const scale = require('./Config').scale;
const fieldSize = require('./Config').fieldSize;
const candyScore = require('./Config').candyScore;

const Candy = require('./Candy');
const Poop = require('./Poop');
import Brick from './Brick';

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
    return typeof this.data[y] !== 'undefined' ? this.data[y][x] : [];
};

Field.prototype.remove = function(go) {
    let x = go.x;
    let y = go.y;
    if(!this.data[y]) {
        throw new Error('GameObject was never here');
    }
    let idx = this.data[y][x].indexOf(go);
    if(idx !== -1) {
        this.data[y][x].splice(idx,1);
    }
    return true;
};

Field.prototype.add = function(go) {
    let x = go.x;
    let y = go.y;
    if(typeof this.data[y] === 'undefined') {
        this.data[y] = [];
    }
    if(typeof this.data[y][x] === 'undefined') {
        this.data[y][x] = [];
    }

    this.data[y][x].unshift( go );
    this.markDirty(x,y);
    return true;
};

Field.prototype.eat = function(x, y) {
};

Field.prototype.reset = function() 
{
    var game = this.game;
    this.dirty = {};
    this.map.forEach(
        function(row, y) 
        {
            return row.split('').forEach(
                function(c, x) {
                    if (c !== '#') {
      	                // TODO: Candy type
                        this.add( new Candy(game, {x:x, y:y, score: candyScore[0]}) );                        
                    } else {
                        this.add( new Brick(game, {x:x, y:y}) );
                    }
                }.bind(this));
        }.bind(this));
	this.firstDraw = true;
};

Field.prototype.markDirty = function(x,y) {
    let idx = Math.floor(y)*fieldSize + Math.floor(x);
	this.dirty[idx] = true;
};

Field.prototype.draw = function() {
//    console.log("draw %d dirty", Object.keys(this.dirty).length);
    let dirt = this.dirty;
    this.dirty = {};
    // Object.keys(dirt).forEach((xy) => {
    //     let y = Math.floor(xy / fieldSize);
    //     let x = xy % fieldSize;
    //     let c = this.at(x,y);
    //     //console.log('dirty', xy, x, y);
    //     if(c) {
    //         this.game.renderer.beginUpdate(x,y);
    //         c.forEach((go) => { 
    //             go.draw(); 
    //         });
    //         this.game.renderer.endUpdate(x,y);
    //     }
    // });

    for (let y = 0; y < fieldSize; y++) {
        for (let x = 0; x < fieldSize; x++) {
            
            let c = this.at(x,y);
            if(c.length !== 0) {
                this.game.renderer.beginUpdate(x,y);
                c.forEach((go) => { 
                    this.game.renderer.renderGameObject(go);
                });
                this.game.renderer.endUpdate();
            }

            // if (data[y][x] === '#') {
            //     ctx.beginPath();
            //     ctx.rect(x * scale, y * scale, scale, scale);
            //     ctx.fillStyle = "blue";
            //     ctx.fill();
            //     ctx.stroke();
            // }
        }
    }
};



module.exports = Field;
