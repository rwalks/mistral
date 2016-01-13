function WorldLight() {

	var sun;

	this.init = function(scene) {
		//main scene light
		sun = new THREE.DirectionalLight( 0xffffff );
		sun.position.set(2000,2000,500);
		sun.target.position.set(6000,0,3000);
		sun.castShadow = true;
		sun.shadowDarkness = 0.5;
		scene.add( sun );
	}

	this.update = function() {

	}

	this.getSun = function() { return sun; }

}
