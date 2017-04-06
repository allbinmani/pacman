
"use strict";

import {scale} from './Config';
import Renderer from './Renderer';

// ATTENTION! NOT FINISHED! NOT WORKING!

export default class DOMRenderer extends Renderer
{
	constructor(root) {
		super();
		if(!root && document.body) {
			root = document.body;
		}
		this.root = root;
	}


	renderGameObject(go) {
		let xx = Math.floor(go.x*scale);
	    let yy = Math.floor(go.y*scale);
	    let elm = go._domElem;
	    if(!elm) {
	    	elm = go._domElem = this.root.ownerDocument.createElement('div');
	    	this.root.appendChild(elm);
	    	elm.style.position = 'absolute';
	    }
	    go.attrs.primitives.forEach((prim) => {
	    	switch(prim.type) {
	    		case 'sphere': // treated as a circle in 2d
	    		break;
	    		case 'box': // rectangle in 2d
	    		break;
	    	}
	    	elm.style.left = xx+'px';
	    	elm.style.top = yy+'px';
	    	elm.style.width = +'px';
	    	elm.style.top = xx+'px';
	    });
	}
}