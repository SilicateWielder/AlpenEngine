/*
 * Candle Lib - model.js
 * Written by Michael Warner
 * Version 0.1.8
 *
 * Used to manage groups of polygons in the form of models.
 */

import { Thread } from 'sphere-runtime';
import PointCloud from './pointcloud.js';
import Polygon from './polygon.js';

export default
class Model
{
	constructor(camera, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0)
	{
		// Create a pointcloud and polygon table.
		this.camera = camera;
		this.cloud = new PointCloud();
		this.polydefs = [];
		
		// Positional and orientation data.
		this.pos = {"x":x, "y":y, "z":z};
		this.rot = {"x":rx, "y":ry, "z":rz};
		
		// Rendering mode settings.
		this.mode = {};
		this.mode.wireframe = false;
		this.mode.mixed = false;
		this.mode.zsort = false;
		this.mode.backcull = true;
	}
	
	addPoint(x, y, z)
	{
		return this.cloud.addPoint(x, y, z);
	}
	
	rotate(x, y, z)
	{
		this.cloud.rotate(x, y, z, this.pos.x, this.pos.y, this.pos.z);
		this.rot = {"x":x, "y":y, "z":z};
	}
	
	move(x, y, z)
	{
		this.pos = {"x":x, "y":y, "z":z};
	}
	
	definePoly(points, texture, flipped)
	{
		if(points.length == 4)
		{
			let map = new Polygon(this.cloud, points[0], points[1], points[2], points[3], flipped, texture);
			this.polydefs.push(map);
		}
	}

	// Allows you to blit a single polygon, as long as you know it's ID
	// Additionally, you can override textures, useful for select rendering jobs.
	blitPoly(id, x, y, z, texOverride)
	{
		// Grab point info.
		let poly = this.polydefs[id];
		let p1 = this.cloud.get(poly.p1).flatten(this.camera, x, y, z);
		let p2 = this.cloud.get(poly.p2).flatten(this.camera, x, y, z);
		let p3 = this.cloud.get(poly.p3).flatten(this.camera, x, y, z);
		let p4 = this.cloud.get(poly.p4).flatten(this.camera, x, y, z);
		
		// Grab or assign a texture.
		let texture = null;
		if(texOverride == undefined)
		{
			texture = this.polydefs[id].texture;
		} else {
			texture = texOverride;
		}
		
		// Textured render code.
		if(!this.mode.wireframe || this.mode.mixed)
		{
			this.camera.drawPoly([p1, p2, p3, p4], {"texture":texture, "flipped":poly.flipped}, this.mode);
		}
		
		// Wireframe render code.
		if(this.mode.wireframe || this.mode.mixed)
		{
			Line(p1.x, p1.y, p2.x, p2.y, CreateColor(255, 255, 255));
			Line(p2.x, p2.y, p3.x, p3.y, CreateColor(255, 255, 255));
			Line(p3.x, p3.y, p4.x, p4.y, CreateColor(255, 255, 255));
			Line(p4.x, p4.y, p1.x, p1.y, CreateColor(255, 255, 255));
		}
	}
	
	blit(x, y, z)
	{
		let xp = x + this.camera.pos.x;
		let yp = y + this.camera.pos.y;
		let zp = z + this.camera.pos.z;
		
		for(let p = 0; p < this.polydefs.length; p++)
		{
			this.blitPoly(p, xp, yp, zp);
		}
	}
}