function Controls() {

	var controls;
	var mouse;
	var messenger;
	var keys = { A: 65, W: 87, D: 68, S: 83, SPACE: 32, SHIFT: 16 ,CTRL: 17, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
	var commandState = { forward: false, reverse: false, left: false, right: false, jump: false, action: false, rotLeft: false, rotRight: false, rotUp: false, rotDown: false };

	this.init = function(clientMsg,camera) {
		controls = new THREE.OrbitControls(camera.getCamera());
		mouse = new THREE.Vector2();
		messenger = clientMsg;

		controls.center.set( 0.0, 10.0, 0.0 );
		window.addEventListener( 'keydown', onKeyDown, false );
		window.addEventListener( 'keyup', onKeyUp, false );
	}

	this.update = function(deltaT, player) {
		controls.update(player.getTheta());
	}

	this.getControls = function() { return controls; }

	function onKeyDown( event ) {
		keyPress(event.keyCode, true);
	}

	function onKeyUp( event ) {
		keyPress(event.keyCode, false);
	}

	function keyPress( keyCode, keyDown ) {
		var command;
		switch ( keyCode ) {
			case keys.W:
				command = "forward";
				break;
			case keys.S:
				command = "reverse";
				break;
			case keys.A:
				command = "rotLeft";
				break;
			case keys.D:
				command = "rotRight";
				break;
			case keys.SPACE:
				command = "jump";
				break;
			case keys.SHIFT:
				command = "action"
				break;
			case keys.LEFT:
				command = "left";
				break;
			case keys.RIGHT:
				command = "right";
				break;
			case keys.UP:
				command = "rotUp";
				break;
			case keys.DOWN:
				command = "rotDown";
				break;
		}
		if(command && commandState[command] != keyDown) {
			commandState[command] = keyDown;
			messenger.send({
				type: 'command',
				commandState: commandState
			});
		}
	}

	function onMouseMove( event ) {
	}

}
