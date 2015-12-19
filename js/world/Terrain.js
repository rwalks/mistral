function Terrain() {

	var data;
	var texture;
	var mesh;

	this.init = function(scene) {

		data = generateHeight( Config.worldWidth, Config.worldDepth );
		var geometry = new THREE.PlaneBufferGeometry( 22000, 22000, Config.worldWidth - 1, Config.worldDepth - 1 );
		geometry.rotateX( - Math.PI / 2 );

		var vertices = geometry.attributes.position.array;

		for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

			vertices[ j + 1 ] = data[ i ] * 10;

		}

		geometry.computeFaceNormals();

		texture = new THREE.CanvasTexture( generateTexture( data, Config.worldWidth, Config.worldDepth ) );
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;

		mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: texture } ) );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add( mesh );
	}

	this.update = function() {

	}

	function generateHeight( width, height ) {
		var zMax = 255;
		var size = width * height;
		var data = new Uint8Array( size );
		var perlin = new ImprovedNoise();
		var quality = 1;
		var zNoise = Math.random() * 50;

		var x, y, d, z;

		for ( var j = 0; j < 1; j ++ ) {
			for ( var i = 0; i < size; i ++ ) {
				x = i % width;
				y = ~~ ( i / width );

				if (j == 0) {
					data[i] = zMax * getTerrainHeight(x,y,width,height);
				} else {
					data[i] += Math.abs( perlin.noise( x / quality, y / quality, zNoise ) * quality * 1 );
				}
			}
			quality *= 5;
		}
		return data;
	}

	function generateTexture( data, width, height ) {
		var canvas, canvasScaled, context, image, imageData,
		level, diff, vector3, sun, shade;

		var imageUpSample = 1;
		var texHeight = height * imageUpSample;
		var texWidth = width * imageUpSample;

		vector3 = new THREE.Vector3( 0, 0, 0 );

		sun = new THREE.Vector3( 1, 1, 1 );
		sun.normalize();

		canvas = document.createElement( 'canvas' );
		canvas.width = texWidth;
		canvas.height = texHeight;

		context = canvas.getContext( '2d' );
		context.fillStyle = '#000';
		context.fillRect( 0, 0, texWidth, texHeight );

		image = context.getImageData( 0, 0, canvas.width, canvas.height );
		imageData = image.data;
		var terrainType, x, y;

		for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

			vector3.x = data[ j - 2 ] - data[ j + 2 ];
			vector3.y = 2;
			vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
			vector3.normalize();

			shade = vector3.dot( sun );
			x = j % texWidth;
			y = ~~ ( j / texWidth);
			terrainType = getTerrainType(x,y,texWidth,texHeight);

			var r, g, b;
			switch (terrainType) {
				case "deep":
					r = ( 150 + shade * 100 ) * ( 0.4 + data[ j ] * 0.007 );
					g = ( 150 + shade * 100 ) * ( 0.4 + data[ j ] * 0.007 );
					b = ( 50 - shade * 100 ) * ( 0.4 + data[ j ] * 0.007 );
					break;
				case "shallows":
					r = ( 170 + shade * 100 ) * ( 0.4 + data[ j ] * 0.007 );
					g = ( 170 + shade * 100 ) * ( 0.4 + data[ j ] * 0.007 );
					b = ( 70 - shade * 100 ) * ( 0.4 + data[ j ] * 0.007 );
					break;
				case "beach":
					r = ( 120 + shade * 100 ) * ( 0.3 + data[ j ] * 0.007 );
					g = ( 120 + shade * 100 ) * ( 0.3 + data[ j ] * 0.007 );
					b = 0;
					break;
				case "grass":
					r = ( 10 + shade * 100 ) * ( 0.4 + data[ j ] * 0.007 );
					g = ( 200 + shade * 100 ) * ( 0.4 + data[ j ] * 0.007 );
					b = ( 10 + shade * 100 ) * ( 0.4 + data[ j ] * 0.007 );
					break;
				case "mountain":
					r = ( 80 + shade * 100 ) * ( 0.3 + data[ j ] * 0.007 );
					g = ( 80 + shade * 100 ) * ( 0.3 + data[ j ] * 0.007 );
					b = ( 80 + shade * 100 ) * ( 0.3 + data[ j ] * 0.007 );
					break;
			}

			imageData[ i ] = r;
			imageData[ i + 1 ] = g;					
			imageData[ i + 2 ] = b;			
		}
		context.putImageData( image, 0, 0 );

		return canvas;
	}

	function getTerrainType(x,y,width,height) {
		var d = distance([x,y],[width/2,height/2]);
		if (d > (width * 0.4)) {
			return "deep";
		}else if (d > (width * 0.3)) {
			return "shallows";
		}else if (d > (width * 0.25)) {
			return "beach";
		}else if (d > (width * 0.05)) {
			return "grass";
		}else if (d > 0) {
			return "mountain";
		}

	}

	function getTerrainHeight(x,y,width,height) {
		var d = distance([x,y],[width/2,height/2]);

		if (d > (width * 0.42)) {
			//deep
			return 0;
		}else if (d > (width * 0.4)) {
			//deep->shallows
			return 0.15 - (((d % (width * 0.02)) / (width * 0.02)) * 0.15);
		}else if (d > (width * 0.36)) {
			//shallows
			return 0.15;
		}else if (d > (width * 0.3)) {
			//shallows->beach
			return 0.15 + (0.15 - (((d % (width * 0.06)) / (width * 0.06)) * 0.15));
		}else if (d > (width * 0.25)) {
			//beach->grass
			return 0.3 + (0.1 - (((d % (width * 0.05)) / (width * 0.05)) * 0.1));
		}else if (d > (width * 0.08)) {
			//grass
			return 0.4;
		}else if (d > (width * 0)) {
			//grass->mountain
			return 0.4 + (0.6 - (((d % (width * 0.08)) / (width * 0.08)) * 0.6));
		}else if (d >= 0) {
			//mountain
			return 1;
		}
	}

}
