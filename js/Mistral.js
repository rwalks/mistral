function Mistral() {

	var scene;
	var clock;
	var world;
	var controlCenter;

	this.init = function() {
		clock = new THREE.Clock();
		scene = new THREE.Scene();
		world = new World();
		controlCenter = new ControlCenter();
		//init
		world.init(scene);
		controlCenter.init(scene);
	}

	this.run = function() {
		animate();
	}

	function animate() {
		requestAnimationFrame( animate );
		render();
	}

	function render() {
		var deltaT = clock.getDelta();
		world.update();
		controlCenter.update(deltaT, scene);
	}



}
