/* global ctx */
"use strict";

const scale = require('./Config').scale;

/**
 * GameObject
 */
let _gameObjectId = 1;
 
function GameObject(game, attr) {
    this.game = game;
    this.id = _gameObjectId++;
    this.attr = attr;
    this.x = this.attr.x || 0;
    this.y = this.attr.y || 0;
    this.pos=[this.x,this.y];
    this.reset();
}

GameObject.prototype.hasAttr = function(attr) {
	return typeof this.attr[attr] !== 'undefined';
};


GameObject.prototype.draw = function() {
  this.game.renderer.renderGameObject(this);
};


module.exports = GameObject;
