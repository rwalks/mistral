function TerrainGen() {

	this.generate = function() {
		var texture;
		var mesh;
		var geometry = new THREE.PlaneGeometry( Config.width, Config.depth, Config.worldWidth - 1, Config.worldDepth - 1 );
		var zMax = Config.height;
		var width = Config.worldWidth;
		var height = Config.worldDepth;

		var x, y, d, z;
		//mountains
		var numMountains = 6 + (Math.random() * 5);
		for (var i = 0; i < numMountains; i++) {
			x = Math.floor((width * 0.36) + (Math.random() * (width * 0.28)));
			y = Math.floor((height * 0.36) + (Math.random() * (height * 0.28)));
			if ( i < 4 || Math.random() > 0.7) {
				//large mountain
				z = ((zMax * 0.95) + (Math.random() * (zMax * 0.05)));
			}else if(Math.random() > 0.6) {
				//medium mountain
				z = ((zMax * 0.7) + (Math.random() * (zMax * 0.2)));
			}else {
				//above sea
				z = ((zMax * 0.5) + (Math.random() * (zMax * 0.1)));
			}
			mountainGen(geometry,x,y,z,0);
		}
		//flats
		var numFlats = 10 + (Math.random() * 10);
		for (var i = 0; i < numFlats; i++) {
			x = Math.floor((width * 0.36) + (Math.random() * (width * 0.28)));
			y = Math.floor((height * 0.36) + (Math.random() * (height * 0.28)));
			flatsGen(geometry,x,y,false,Math.random()*20);
		}
		//smoothing
		for ( var i = 0; i < 1; i++) {
			for(var v = 0; v < geometry.vertices.length; v++) {
				var avgZ = 0;
				var count = 0;
				var neighbors = [v, v+1,v-1,v+(width), v-(width)];
				for (var n = 0; n < neighbors.length; n++) {
					if (geometry.vertices[neighbors[n]]) {
						avgZ += geometry.vertices[neighbors[n]].z;
						count += 1;
					}
				}
				avgZ = Math.floor(avgZ / count);
				geometry.vertices[v].setZ(avgZ);
			}
		}
		//tiling
		var tilesX = Config.worldWidth / Config.tileWidth;
		var tilesY = Config.worldDepth / Config.tileDepth;
		var tileGeo;
		var terrainMeshes = [];
		var posX = -Config.width / 2;
		var posY = -Config.depth / 2;
		var dPosX = Config.width / (Config.worldWidth / (Config.tileWidth + 1));
		var dPosY = Config.depth / (Config.worldDepth / (Config.tileDepth + 1));

		var material = new THREE.MeshPhongMaterial( {
			vertexColors: THREE.FaceColors,
			shininess: 100,
			shading: THREE.FlatShading
		} );
		
		var terrainTiles = [];
		for(var t = 0; t < (tilesX * tilesY); t++) {
			terrainTiles.push(new THREE.PlaneGeometry( dPosX, dPosY, Config.tileWidth , Config.tileDepth  ));
		}

		var tileIndex;
		var tileGeoIndex;
		var tX; var tY; var tZ;
		for(var i = 0; i < geometry.vertices.length; i++) {
			x = i % Config.worldWidth;
			y = ~~(i / Config.worldWidth);
			tileIndex = ~~(x / Config.tileWidth) + (~~(y / Config.tileDepth) * tilesY);
			tX = x % Config.tileWidth;
			tY = y % Config.tileDepth;
			tileGeoIndex = tX + ~~(tY * (Config.tileDepth + 1));
			tZ = geometry.vertices[i].z;
			terrainTiles[tileIndex].vertices[tileGeoIndex].setZ(tZ);
		}
		//stitch tiles
		for(var t = 0; t < terrainTiles.length; t++) {
			for(var y = 1; y <= Config.tileDepth; y++){
				tY = (y * (Config.tileWidth + 1)) - 1;
				tZ = (t % tilesX != tilesX - 1) ? terrainTiles[t+1].vertices[(Config.tileWidth+1) * (y-1)].z : terrainTiles[t].vertices[tY-1].z;
				terrainTiles[t].vertices[tY].setZ(tZ);
			}
		}
		for(var t = 0; t < terrainTiles.length; t++) {
			for(var x = 0; x <= Config.tileWidth; x++){
				tX = x + ((Config.tileWidth + 1) * Config.tileDepth);
				tZ = (t < (terrainTiles.length - tilesX)) ? terrainTiles[t+tilesX].vertices[x].z : terrainTiles[t].vertices[tX-(Config.tileDepth+1)].z;
				terrainTiles[t].vertices[tX].setZ(tZ);
			}
		}
		//tile meshes
		for(var t = 0; t < terrainTiles.length; t++) {
			tileGeo = terrainTiles[t];
			generateTexture( tileGeo );
			tileGeo.rotateX( - Math.PI / 2 );
			tileGeo.computeFaceNormals();

			mesh = new THREE.Mesh( tileGeo, material );
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.position.setX(posX);
			mesh.position.setZ(posY);
			posX += dPosX;
			if ( posX >= (Config.width/2)) {
				posX = -Config.width / 2;
				posY += dPosY;
			}
			terrainMeshes.push(mesh);
		}

		return terrainMeshes;
	}

	function mountainGen(geometry,x,y,z,deep) {
		var vIndex = Math.floor((y * Config.worldWidth)) + x;
		if ( deep > 1000 || !geometry.vertices[vIndex] || geometry.vertices[vIndex].z >= z ) {
			return;
		}
		var rand = Math.random();
		if ( z > Config.height * 0.8 ) {
			//mountain
			if ( rand > 0.9 ) {
				z = z * 0.99;
			}else {
				z = z * 0.98;
			}
		} else if ( z > Config.height * 0.6 ) {
			//slopes
			if ( rand > 0.9 ) {
				z = z * 0.95;
			} else {
				z = z * 0.9;
			}
		} else if ( z > Config.height * 0.5 ) {
			//slopes
			if ( rand > 0.9 ) {
				z = z * 0.97;
			} else {
				z = z * 0.94;
			}
		} else if ( z > Config.height * 0.3 ) {
			//grass
			if ( rand > 0.5 ) {
				z = z * 1;
			} else {
				z = z * 0.98;
			}
		} else if ( z > Config.height * 0.15 ) {
			//beach
			if ( rand > 0.9 ) {
				z = z * 1;
			} else {
				z = z * 0.98;
			}
		} else if ( z > Config.height * 0.05 ) {
			//dropoff
			if ( rand > 0.9 ) {
				z = z * 0.9;
			} else {
				z = z * 0.8;
			}
		} else {
			if ( rand > 0.99 ) {
				z = z + (Config.height * 0.02);
			} else {
				z = z * (0.9);
			}
		}
	
		geometry.vertices[vIndex].setZ(z);
		rand = Math.random();
		if (rand < 0.5) {
			mountainGen(geometry,x+1,y,z,deep+1);
			mountainGen(geometry,x,y-1,z,deep+1);
		} else if (rand < 1) {
			mountainGen(geometry,x-1,y,z,deep+1);
			mountainGen(geometry,x,y+1,z,deep+1);
		}
	}

	function flatsGen(geometry,x,y,z,deep) {
		var vIndex = Math.floor((y * Config.worldWidth)) + x;
		if ( deep <= 0 || !geometry.vertices[vIndex] || Math.random() > 0.8) {
			return;
		}
		z = z || geometry.vertices[vIndex].z;
		geometry.vertices[vIndex].setZ(z);
		rand = Math.random();
		if (rand < 0.5) {
			flatsGen(geometry,x+1,y,z,deep-1);
			flatsGen(geometry,x,y-1,z,deep-1);
		} else if (rand < 1) {
			flatsGen(geometry,x-1,y,z,deep-1);
			flatsGen(geometry,x,y+1,z,deep-1);
		}

	}

	function generateTexture( geometry ) {
		var terrainType,r,g,b,alt;

		for ( var i = 0; i < geometry.faces.length; i++ ) {
			alt = (geometry.vertices[geometry.faces[i].a].z + geometry.vertices[geometry.faces[i].b].z + geometry.vertices[geometry.faces[i].c].z) / 3;
			terrainType = getAltitudeType(alt,Config.height);

			switch (terrainType) {
				case "deep":
					r = 0.6;
					g = 0.6;
					b = 0.1;
					break;
				case "shallows":
					r = 0.7;
					g = 0.7;
					b = 0.7;
					break;
				case "beach":
					r = 0.6;
					g = 0.6;
					b = 0;
					break;
				case "grass":
					r = 0.05;
					g = 0.8;
					b = 0.05;
					break;
				case "mountain":
					r = 0.6;
					g = 0.6;
					b = 0.6;
					break;
				case "snow":
					r = 1;
					g = 1;
					b = 1;
					break;
			}
			r = r + ((Math.random() * (r * 0.1)) - (r * 0.05));
			g = g + ((Math.random() * (g * 0.1)) - (g * 0.05));
			b = b + ((Math.random() * (b * 0.1)) - (b * 0.05));
			geometry.faces[i].color.setRGB(r,g,b);
		}
	}

	function getAltitudeType(alt,max) {
		if (alt <= max * 0) {
			return "deep";
		}else if (alt <= max * 0.15) {
			return "shallows";
		}else if (alt <= max * 0.3) {
			return "beach";
		}else if (alt <= max * 0.5) {
			return "grass";
		}else if (alt <= max * 0.7) {
			return "mountain";
		}else if (alt <= max * 1) {
			return "snow";
		}
	}
}
