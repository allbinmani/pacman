"use strict";

import {scale} from './Config';
import GameObject from './GameObject';

export default class Brick extends GameObject
{
	constructor(game,attr) {
		super(game, Object.assign({
			styles: {
				fillStyle: "blue",
				strokeStyle: "lightblue"
			},
			primitives: [
				{type: 'box',
				 size: scale}
			]
		}, attr));
	}

	reset() {
		// nada
	}

	update() {
		// nada
	}
}