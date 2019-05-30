/*
 *  AlpenEngine v0.0.1
 *  (c) 2019 Michael Warner
 */

import { Music, Prim, Thread, Console } from 'sphere-runtime';

import FastColors from './colors.js';

import Smath from './smath.js';

import PointCloud from './pointcloud.js';
import Model from './model.js';

import ScalingTex from './scalingtex.js';
import Camera from './camera.js';

function renderStats(statfont, camera)
{
	// Temporary stats rendering code.
	Rectangle(0, 0, 315, 100, fcolors.create(125, 125, 125));
	statfont.drawText(Surface.Screen, 1, 0, "AlpenEngine - Version 0.0.2", fcolors.create(0.5, 1, 1, 1, true));
	statfont.drawText(Surface.Screen, 1, 10, "-----------------------------------", fcolors.create(0.5, 1, 1, 1, true));
	statfont.drawText(Surface.Screen, 1, 20, "CAMERA STATS", fcolors.create(0.5, 1, 1, 1, true));
	statfont.drawText(Surface.Screen, 1, 30, "-----------------------------------", fcolors.create(0.5, 1, 1, 1, true));
	statfont.drawText(Surface.Screen, 1, 40, "ROTATION X: " + camera.rot.x, fcolors.create(0.5, 1, 1, 1, true));
	statfont.drawText(Surface.Screen, 1, 50, "ROTATION Y: " + camera.rot.y, fcolors.create(0.5, 1, 1, 1, true));
	statfont.drawText(Surface.Screen, 1, 60, "ROTATION Z: " + camera.rot.y, fcolors.create(0.5, 1, 1, 1, true));
	statfont.drawText(Surface.Screen, 154, 40, "POSITION X: " + camera.pos.x, fcolors.create(0.5, 1, 1, 1, true));
	statfont.drawText(Surface.Screen, 154, 50, "POSITION Y: " + camera.pos.y, fcolors.create(0.5, 1, 1, 1, true));
	statfont.drawText(Surface.Screen, 154, 60, "POSITION Z: " + camera.pos.z, fcolors.create(0.5, 1, 1, 1, true));
	statfont.drawText(Surface.Screen, 1, 70, "-----------------------------------", fcolors.create(0.5, 1, 1, 1, true));
}

export default
class MyGame extends Thread
{
	constructor()
	{
		super();  // call the superclass constructor

		global.con = new Console();
		global.systemTexture = new ScalingTex('textures/grass.pcx');
		
		//global.font = new Font("ibm_iso9.rfn");
		/* If you want to use this font You can find it at https://int10h.org/oldschool-pc-fonts/fontlist/
		 * Conversion will need to be done using the old sphere studio (v1.5) or an equivalent tool
		 * Just make sure to comment out the line below. and uncomment the line specifying the font used.
		 */
		global.font = Font.Default;
		
		global.fcolors = new FastColors();
		global.smath = new Smath();
		global.cam = new Camera(GetScreenWidth(), GetScreenHeight(), 0, 0, 0, 0, 0, 0);
		
		global.model = new Model(cam);
		model.addPoint(-100, -100, -100);
		model.addPoint(-100, 100, -100);
		model.addPoint(100, 100, -100);
		model.addPoint(100, -100, -100);
		
		model.addPoint(-100, -100, 100);
		model.addPoint(-100, 100, 100);
		model.addPoint(100, 100, 100);
		model.addPoint(100, -100, 100);
		model.definePoly([0, 1, 2, 3], systemTexture);
		model.definePoly([7, 6, 5, 4], systemTexture);
		model.definePoly([4, 5, 1, 0], systemTexture);
		model.definePoly([6, 7, 3, 2], systemTexture);
		model.definePoly([5, 6, 2, 1], systemTexture);
		model.definePoly([0, 3, 7, 4], systemTexture);
		
		model.addPoint(150, 0, 0);
		model.addPoint(0, 150, 0);
		model.addPoint(0, 0, 150);
		model.addPoint(-150, 0, 0);
		model.addPoint(0, -150, 0);
		model.addPoint(0, 0, -150);
		model.definePoly([8, 9, 10, 10], systemTexture, false);
		model.definePoly([10, 9, 11, 11], systemTexture, false);
		model.definePoly([10, 11, 12, 12], systemTexture, false);
		model.definePoly([8, 10, 12, 12], systemTexture, false)
		
		model.definePoly([12, 11, 13, 13], systemTexture, false);
		model.definePoly([12, 13, 8, 8], systemTexture);
		model.definePoly([8, 13, 9, 9], systemTexture);
		model.definePoly([13, 11, 9, 9], systemTexture);
		//model.move(200, 0, 0);
		
		let addFuncs = {
			'point': function(x, y, z) {
				con.log(this.addPoint(x, y, z));
			},
			'poly': function(p1, p2, p3, p4) {
				this.definePoly([p1, p2, p3, p4], systemTexture)
			}
		};
		con.defineObject("add", model, addFuncs);
		
		let remFuncs = {
			'poly': function(id) {
				if(id == 'all')
				{
					this.polydefs = [];
				}
			}
		}
		con.defineObject("rem", model, remFuncs);
	}

	on_update()
	{
		cam.roll(1, 1, 1);
		
		model.rotate(cam.rot.x, cam.rot.y, cam.rot.z, true);
	}

	on_render()
	{
		model.blit(0, 0, 0, true);
		
		renderStats(font, cam);
	}
}
