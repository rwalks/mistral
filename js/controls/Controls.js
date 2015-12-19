function Controls() {

	var controls;

	this.init = function(camera) {
		controls = new THREE.OrbitControls(camera);
		controls.center.set( 0.0, 100.0, 0.0 );
		controls.userPanSpeed = 100;
		controls.center.y = 2500;
	}

	this.update = function(deltaT) {
		controls.update(deltaT);
	}

	this.getControls = function() { return controls; }
}
