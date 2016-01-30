function Camera() {

	var camera;

	this.init = function() {
		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000000 );
		//camera.zoom = 20;
	//	camera.eulerOrder = "YXZ";
		this.setPosition(0,300,-1000);
	}

	this.update = function() {
	}

	this.setPosition = function(x,y,z) {
		if (x) { camera.position.x = x; }
		if (y) { camera.position.y = y; }
		if (z) { camera.position.z = z; }
		camera.updateProjectionMatrix();
	}

	this.resize = function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		//camera.zoom = 20;
		this.setPosition(0,300,-1000);
	}

	this.getCamera = function() { return camera; }
}
