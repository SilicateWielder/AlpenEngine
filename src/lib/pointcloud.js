/*
 * Candle Lib - Vect3.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to manage groups of points in 3 dimensional space
 */
 
import { Thread } from 'sphere-runtime';
import Vector3 from './vect3.js';

export default
class PointCloud
{
	constructor()
	{
		this.points = [];
		this.ids = [];
		
		this.rot = {"x":0, "y":0, "z":0};
	}
	
	generateID(x, y, z)
	{
		return(x + "&" + y + "&" + z);
	}
	
	addPoint(x, y, z)
	{
		let id = this.generateID(x, y, z);
			
		this.ids.push(id);
		this.points[id] = new Vector3(x, y, z);
		
		let index = this.ids.length - 1;
		if (index < 0)
		{
			index = 0;
		}
		
		return index;
	}
	
	rotate(rx, ry, rz, offX, offY, offZ)
	{
		if(rx != this.rot.x && ry != this.rot.y && rz != this.rot.z)
		{
			for(let p = 0; p < this.ids.length; p++)
			{
				let id = this.ids[p];
			
				this.points[id].rotate(rx, ry, rz, {"x":offX,"y":offY,"z":offZ});
			}
		}
	}
	
	blit()
	{
		for(let p = 0; p < this.ids.length; p++)
		{
			let id = this.ids[p];
			
			let pos = this.points[id];
			cam.drawPoint(pos.pub.x, pos.pub.y, pos.pub.z);
		}
	}
	
	get(id)
	{
		return this.points[this.ids[id]];
	}
	
	getPos(id)
	{
		return this.points[this.ids[id]].pub;
	}
}