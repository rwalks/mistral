function GraphicsEngine() {

	var scene;
	var camera;
	var container;
	var stats;
	var renderer = new Renderer();
	var skyBox = new SkyBox();
	var terrainTiles;
	var waterG = new WaterG();
	var worldLight = new WorldLight();
	var playerId;

	this.init = function(cam,tTiles) {
		camera = cam;
		scene = new THREE.Scene();
		renderer.init(scene,camera);
		skyBox.init(scene);
		worldLight.init(scene);
		waterG.init(scene);
		terrainTiles = tTiles;
		for(var t = 0; t < terrainTiles.length; t++){
			scene.add(terrainTiles[t]);
		}
		window.addEventListener( 'resize', onWindowResize, false );
		if(Config.showStats) {
			//stats
			container = document.getElementById( 'container' );
			container.innerHTML = "";
			container.appendChild( renderer.getElement() );
			stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.top = '0px';
			container.appendChild( stats.domElement );
		}
	}

	this.update = function(engPlayers) {
		waterG.update();
		renderer.update( scene, camera.getCamera() );
		if(stats) {
			stats.update();
		}
	}

	this.setPlayer = function(pid) {
		playerId = pid;
	}

	this.addPlayer = function(player) {
		var mesh = player.getMesh();
		if(player.getId() == playerId) {
			mesh.add(camera.getCamera());
		}
		this.addMesh(mesh);
	}

	this.addMesh = function(mesh) {
		scene.add(mesh);
	}

	function onWindowResize() {
		camera.resize();
		renderer.resize();
	}

}
