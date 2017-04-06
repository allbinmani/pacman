"use strict";

import {scale} from './Config';
import Renderer from './Renderer';

export default class Canvas2DRenderer extends Renderer
{
	constructor(canvas) {
		super();
		this.ctx = canvas.getContext('2d');
		this._rot = 10.0;
		this._next_rot = 1.0;
		this._zoom = 10.0;
		this._next_zoom = 1.0;
		this._center = [-320.0, -320.0];
		this._next_center = [0.0, 0.0];
	}

	_setDrawStyle(styles) {
		Object.keys(styles).forEach((sn) => {
			this.ctx[sn] = styles[sn];
		});
	}

	get Zoom() {
		return this._zoom;
	}

	set Zoom(z) {
		this._next_zoom = z;
	}

	get Rotation() {
		return this._rot;
	}

	set Rotation(z) {
		this._next_rot = z;
	}

	set Center(c) {
		this._next_center = c;
	}

	get Center() {
		return this._center;
	}

	beginUpdate(x,y) {

		let xx = (x)*scale+this._center[0];
	    let yy = (y)*scale+this._center[1];
		this._updating = [xx,yy];
		// Reset transform
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		// Translate to top left of square
		this.ctx.translate(xx, yy);
//		this.ctx.scale(this._zoom, this._zoom);

	    // Wipe out rect where we are going to draw
	    // Using alpha 0.5 will give a "blur" effect on all objects
	    this.ctx.beginPath();
		this.ctx.fillStyle='rgba(0, 0, 0, 0.5)';
	    this.ctx.rect(0, 0, scale, scale);
	    this.ctx.fill();
		this.ctx.translate(-xx, -yy);
//		this.ctx.scale(-this._zoom, -this._zoom);
	}

	endUpdate() {
	    // Reset transform
		this.ctx.translate(-this._updating[0], -this._updating[1]);
		this._updating = false;
	}

	beginFrame() {
		// Reset transform
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		// let cx = this._center[0];
		// let cy = this._center[1];
		// this.ctx.translate(cx, cy);
		// this.ctx.scale(this._zoom, this._zoom);

		// Step zoom, center and rot
		this._zoom = (this._next_zoom + this._zoom*3) / 4.0;
		this._center[0] = (this._next_center[0] + this._center[0]*7) / 8.0;
		this._center[1] = (this._next_center[1] + this._center[1]*7) / 8.0;
		this._rot = (this._next_rot + this._rot*3) / 4.0;
	}

	endFrame() {

	}

	// a GameObject has attr.primitives
	renderGameObject(go) {
		if(!this.updating) {
			console.warn("beginUpdate not called!");
		}
		let xx = (go.x*scale)+this._center[0];
	    let yy = (go.y*scale)+this._center[1];

	 //console.log('draw %d', go.id, go.pos);
    	go.attr.styles = go.attr.styles || {};

		this.ctx.translate(xx, yy);

	    go.attr.primitives.forEach((prim) => {
	    	prim.styles = prim.styles || {};
	    	let strokeWidth = parseInt(go.attr.styles.strokeWidth || prim.styles.strokeWidth, 10);
    		// Center offset to top left of primitive
    		let co = prim.center ? 
    			(prim.size ? (scale / 2) - (prim.size / 2) : scale / 2) : 0;
    		let xoffs = co;
    		let yoffs = co;
			this.ctx.translate(co, co);
			this.ctx.rotate(go.rot || 0);

	    	this.ctx.beginPath();
	    	switch(prim.type) {

	    		case 'triangle':
	    			let p = prim.points;
	    			this.ctx.moveTo(p[0][0], p[0][1]);
	    			this.ctx.lineTo(p[1][0], p[1][1]);
	    			this.ctx.lineTo(p[2][0], p[2][1]);
	    			this.ctx.moveTo(p[0][0], p[0][1]);
	    			break;

	    		case 'sphere': // treated as a circle in 2d
			        this.ctx.arc(0, 
			        			 0, 
			        			 prim.radius-2, 
			        			 prim.start_angle || 0,
			        			 prim.end_angle || (Math.PI * 2)
			        			);
		    		break;

	    		case 'box': // rectangle in 2d
					this.ctx.rect(0,
								  0,
								  Math.floor(prim.size-1), 
								  Math.floor(prim.size-1) 
								);
		    		break;
		    	default:
		    		throw new Error('Unknown primitive ' + prim.type);
	    	}
			this._setDrawStyle(go.attr.styles||{});
			this._setDrawStyle(prim.styles||{});
			if(go.attr.styles.fillStyle) {
			    this.ctx.fill();
			}
			if(go.attr.styles.strokeStyle) {
			    this.ctx.stroke();
			}
			this.ctx.rotate(-(go.rot || 0));
			this.ctx.translate(-co, -co);
	    });
		this.ctx.translate(-xx, -yy);

	 //    this.ctx.beginPath();
		// if(go.hasAttr("radius")) {
	 //  		var r = go.attr.radius;
	 //        this.ctx.arc(xx * scale + scale / 2, yy * scale + scale / 2, r-1, 0, 2 * Math.PI);
	 //    } else if(go.hasAttr("size")) {
	 //        this.ctx.rect(Math.floor(xx * scale + (scale / 2) - (go.attr.size / 2)), 
	 //        		 Math.floor(yy * scale + (scale / 2) - (go.attr.size / 2)),
	 //                 Math.floor(go.attr.size-1), 
	 //                 Math.floor(go.attr.size-1));
	 //    }

	}
}