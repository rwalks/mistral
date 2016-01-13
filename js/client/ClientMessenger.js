function ClientMessenger() {

	var gameEngine;
	var graphicsEngine;
	var playerId;
	var client;

	this.init = function(cl,logic,graphics) {
		client = cl;
		gameEngine = logic;
		graphicsEngine = graphics;
	}

	this.receive = function(msg) {
		switch(msg.type) {
			case "init":
				playerId = msg.playerId;
				graphicsEngine.setPlayer(playerId);
				updateWorld(msg.data);
				break;
			case "update":
				updateWorld(msg.data);
				break;
		}
	}

	this.send = function(msg) {
		msg.id = playerId;
		//send to network
		gameEngine.pushPlayer(msg);
	}

	function updateWorld(data) {
		var newObj;
		for(var p = 0; p < data.players.length; p++) {
			newObj = gameEngine.pushPlayer(data.players[p]);
			if (newObj) {
				graphicsEngine.addPlayer(newObj);
				if (newObj.getId() == playerId) {
					client.setClientPlayer(newObj);
				}
			}
		}
	}

}
