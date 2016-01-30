var colly = new Collider();

function Client() {
	var This = this;

	var clock;
	var camera = new Camera();
	var controls = new Controls();
	var gameEngine = new GameEngine();
	var graphicsEngine = new GraphicsEngine();
	var messenger = new ClientMessenger();
	var player;

	var messages = [];

	function init() {
		clock = new THREE.Clock();
		camera.init();
		//ENGINE STUFF
		gameEngine.init();
		var terrainTiles = gameEngine.getTerrain();
		graphicsEngine.init(camera,terrainTiles);
		messenger.init(This,gameEngine,graphicsEngine);
		controls.init(messenger,camera);

		/////Player1 fake server send
		var collidon = new Collider();
		collidon.init(terrainTiles);
		colly.init(terrainTiles);
		var px = Math.floor(Config.width * (-0.2 + (Math.random() * 0.4)));
		var pz = Math.floor(Config.depth * (-0.2 + (Math.random() * 0.4)));
		var py = Config.height;//colly.terrainAltitude(px,pz) + 800;
		var playerPos = [px,py,pz];
		var playerData = {
			type: "init",
			playerId: 1,
			data: {
				players: [
					{id: 1, position: playerPos, velocity: [0,0,5], theta: 0, phi: 0, state: 'alive'}
				]
			}
		}
		messenger.receive(playerData);
		/* mock horses //
		for(var i = 0; i < 60; i++) {
			px = Math.floor(Config.width * (-0.2 + (Math.random() * 0.4)));
			pz = Math.floor(Config.depth * (-0.2 + (Math.random() * 0.4)));
			py = Config.height;//colly.terrainAltitude(px,pz) + 800;
			playerPos = [px,py,pz];
			playerData = {
				type: "update",
				playerId: i+2,
				data: {
					players: [
						{id: i+2, position: playerPos, velocity: [0,0,5], theta: 0, phi: 0, state: 'alive'}
					]
				}
			}
			messenger.receive(playerData);
		}
	    */
	}

	function update(deltaT) {
		var time = performance.now() * 0.001;
		gameEngine.update(deltaT);
		controls.update(deltaT, player);
	//	if(player.mesh){
	//	camera.getCamera().lookAt(player.mesh);
	//	}
		graphicsEngine.update(gameEngine.getPlayers());
	}

	this.run = function() {
		init();
		animate();
	}

	function animate() {
		requestAnimationFrame(animate);
		render();
	}

	function render() {
		var deltaT = clock.getDelta();
		update(deltaT);
	}

	this.setClientPlayer = function(pObj) {
		player = pObj;
	}

}
