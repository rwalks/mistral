function WaterG() {

	var water;
	var mirrorMesh;
	var waterNormals;

	this.init = function(scene, renderer, camera, sun) {
		waterNormals = new THREE.ImageUtils.loadTexture( 'textures/waternormals.jpg' );
		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

		water = new THREE.Water( renderer, camera, scene, {
			textureWidth: 1024,
			textureHeight: 1024,
			waterNormals: waterNormals,
			alpha:  1.0,
			sunDirection: sun.position.clone().normalize(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 50.0,
		} );


		mirrorMesh = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( Config.width, Config.depth ),
			water.material
		);

		mirrorMesh.add( water );
		mirrorMesh.material.side = THREE.DoubleSide;
		mirrorMesh.rotation.x = - Math.PI * 0.5;
		mirrorMesh.position.setY(Config.seaLevel);
		scene.add( mirrorMesh );
	}

	this.update = function() {
	//	mirrorMesh.position.y = Math.sin( time ) * 1 + 850;				
		water.material.uniforms.time.value += 1.0 / 60.0;
		water.render();
	}

}
