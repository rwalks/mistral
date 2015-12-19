function World() {

	var skyBox = new SkyBox();
	var terrain = new Terrain();
	var water = new Water();
	var worldLight = new WorldLight();

	this.init = function(scene) {
		skyBox.init(scene);
		worldLight.init(scene);
		//water.init(scene);
		terrain.init(scene);
	}

	this.update = function() {
		var time = performance.now() * 0.001;
		//water.update();
	}
}
