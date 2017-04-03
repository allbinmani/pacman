"use strict";

const scale = require('./Config').scale;

/**
 * GameObject
 */
 
function GameObject(game, attr) {
    this.game = game;
    this.x = this.x || 0;
    this.y = this.y || 0;
    this.attr = attr;
    this.reset();
}

GameObject.prototype.hasAttr = function(attr) {
	return typeof this.attr[attr] !== 'undefined';
};

GameObject.prototype.setDrawAttr = function(attr) {
	if(typeof this.attr[attr] !== 'undefined') {
		ctx[attr] = this.attr[attr];
  } else {
  	ctx[attr] = '';
  }
};

GameObject.prototype.draw = function() {
    var xx = (this.x);
    var yy = (this.y);

    ctx.beginPath();
	ctx.fillStyle='rgba(0,0,0,1)';
    ctx.rect(Math.floor(xx * scale), 
         	 Math.floor(yy * scale),
             Math.floor(scale), 
             Math.floor(scale));
    ctx.fill();

    ctx.beginPath();
	if(this.hasAttr("radius")) {
  		var r = this.attr.radius;
        ctx.arc(xx * scale + scale / 2, yy * scale + scale / 2, r-1, 0, 2 * Math.PI);
    } else if(this.hasAttr("size")) {
        ctx.rect(Math.floor(xx * scale + (scale / 2) - (this.attr.size / 2)), 
        		 Math.floor(yy * scale + (scale / 2) - (this.attr.size / 2)),
                 Math.floor(this.attr.size-1), 
                 Math.floor(this.attr.size-1));
    }

	this.setDrawAttr("fillStyle");
	this.setDrawAttr("strokeStyle");
    ctx.fill();
    ctx.stroke();
};


module.exports = GameObject;
