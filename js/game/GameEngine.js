function GameEngine() {

	var players = {};	
	var terrainTiles;
	var terrainGen = new TerrainGen();
	var collider = new Collider();

	this.init = function() {
		terrainTiles = terrainGen.generate();
		collider.init(terrainTiles);
	}

	this.update = function(deltaT) {
		var pKeys = Object.keys(players);
		var player;
		for (var p = 0; p < pKeys.length; p++) {
			player = players[pKeys[p]];
			player.update(deltaT, collider);
		}
	}

	this.pushPlayer = function(pMsg) {
		var p = players[pMsg.id];
		if (p) {
			p.pushState(pMsg);
			return false;
		} else {
			p = addPlayer(pMsg.id);
			p.pushState(pMsg);
			return p;
		}
	}

	this.getTerrain = function() {
		return terrainTiles;
	}

	this.getPlayers = function() {
		return players;
	}

	function addPlayer(id) {
		players[id] = new PlayerEntity();
		players[id].init();
		return players[id];
	}


}
