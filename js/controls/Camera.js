function Camera() {

	var camera;

	this.init = function() {
		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000000 );
	}

	this.update = function() {
	}

	this.setPosition = function(x,y,z) {
		if (x) { camera.position.x = x; }
		if (y) { camera.position.y = y; }
		if (z) { camera.position.z = z; }
	}

	this.getCamera = function() { return camera; }
}
