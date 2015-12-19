function Renderer() {

	var renderer;

	this.init = function() {
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0xbfd1e5 );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}

	this.update = function(scene, camera) {
		renderer.render(scene,camera);
	}

	this.getElement = function() {
		return renderer.domElement;
	}

	this.getRenderer = function() { return renderer; }
}
