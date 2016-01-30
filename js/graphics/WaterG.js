function WaterG() {

	var water;
	var mesh;
	var waterNormals;
	var waveCount = 0;
	var waveSteps = 20;
	var waveV = Config.height * 0.01;

	this.init = function(scene) {
		var geometry = new THREE.PlaneGeometry( Config.width, Config.depth, 30, 30 );
		geometry.dynamic = true;
		var width = Config.worldWidth;
		var height = Config.worldDepth;

		//for(var i = 0; i < geometry.vertices.length; i++) {
		//	geometry.vertices[i].setZ(-( waveV / 2 )+( Math.random() * waveV));
		//}

		geometry.rotateX( - Math.PI / 2 );

		generateTexture(geometry);
		geometry.computeFaceNormals();

		var material = new THREE.MeshPhongMaterial( {
			vertexColors: THREE.FaceColors,
			shininess: 100,
			transparent: true,
			opacity: 0.8,
			side: THREE.DoubleSide,
			//shading: THREE.FlatShading
		} );

		mesh = new THREE.Mesh( geometry, material );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.position.setY(Config.seaLevel);

		scene.add( mesh );
	}

	function generateTexture( geometry ) {
		var r,g,b;

		for ( var i = 0; i < geometry.faces.length; i++ ) {
			r = 0;
			g = 50 + (Math.random() * 40);
			b = 100 + (Math.random() * 100);
			geometry.faces[i].color.setRGB(r,g,b);
		}
	}

//	var waveUp = true;
	this.update = function() {
//		var dY;
//		var rowOffset = waveCount % 2;
//		for(var i = rowOffset; i < mesh.geometry.vertices.length; i += 2) {
//			dY = mesh.geometry.vertices[i].z += ((waveV / waveSteps) * (waveUp ? 1 : -1));
//			mesh.geometry.vertices[i].setZ(dY);
//		}
//		waveCount = waveCount % waveSteps;
//		waveUp = waveCount == 0 ? waveUp : !waveUp;
//		mesh.geometry.verticesNeedUpdate = true;
	}

}
