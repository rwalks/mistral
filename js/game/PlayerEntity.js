function PlayerEntity() {

	var id;
	//
	var mesh;
	var commandState = { forward: false, reverse: false, left: false, right: false, jump: false, action: false, rotLeft: false, rotRight: false };
	var mixer;
	//collision
	var collisionPoints = [];
	//speeds
	//ground
	var strafeV = 10;
	var walkV = 60;
	var reverseV = -20;
	var jumpV = 50;
	var terminalV = -200;
	var rotV = Math.PI / 3;
	var maxV = 200;
	var maxVG = 50;
	var phiV = Math.PI / 6;
	//water
	var strafeVW = 50;
	var walkVW = 90;
	var reverseVW = -50;
	var jumpVW = 50;
	var terminalVW = -100;
	var rotVW = Math.PI / 3;
	var maxVW = 60;
	//states
	var state;
	var velocity = new THREE.Vector3();
	var deltaV = new THREE.Vector3();
	var onGround = false;
	var underwater = false;
	var jumpCounter = 0;
	var jumpInterval = 1.2;
	var theta = 0;
	var dTheta;
	var phi = 0;
	var targetPhi = 0;
	var dPhi;
	//friction
	var groundCoefficient = 2;
	var airCoefficient = 0.3;
	var waterCoefficient = 0.6;
	

	this.init = function() {
		createMesh();
	}

	this.pushState = function(data) {
		id = data.id || id;
		if(data.position) {
			mesh.position.set(data.position[0],data.position[1],data.position[2]);
		}
		if(data.velocity) {
			velocity.set(data.velocity[0],data.velocity[1],data.velocity[2]);
		}
		commandState = data.commandState || commandState;
		theta = data.theta || theta;
		phi = data.phi || phi;
		state = data.state || state;
	}

	this.update = function(deltaT, collider) {
		updateVariables(deltaT);
		applyCommands(deltaT);
		applyFriction(deltaT);
	//	phi += dPhi;
		theta += dTheta;
		rotateX(deltaV,phi);
		rotateY(deltaV,theta);
		applyForces(deltaT);
		velocity.add(deltaV);
		capVelocity();
		checkTerrain(collider);
		mesh.position.add(velocity);
		updatePhi(deltaT);
		mesh.rotation.x = phi;
		mesh.rotation.y = theta;
		if ( mixer ) {
			mixer.update( deltaT );
		}
	}

	function updateVariables(deltaT) {
		deltaV.set(0,0,0);
		dPhi = 0;
		dTheta = 0;
		jumpCounter = jumpCounter < 0 ? jumpCounter : jumpCounter - deltaT;
		underwater = mesh.position.z <= Config.seaLevel;
	}

	function updatePhi(deltaT) {
		var forward = new THREE.Vector3().copy(velocity);
		forward.projectOnPlane(new THREE.Vector3(0,1,0));
		forward.normalize();
		var newV = new THREE.Vector3().copy(velocity)
		newV.normalize();
		targetPhi = forward.angleTo(newV) || 0;
		if ( targetPhi < 0.001 ) {
			targetPhi = 0;
		}
		if (newV.y >= 0) { targetPhi = targetPhi * -1  }
		var diff = targetPhi - phi;
		if (diff > 0) {
			phi += Math.min(phiV*deltaT,diff);
		} else if (diff < 0) {
			phi += Math.max(-phiV*deltaT,diff);
		}
		if ( Math.abs(phi) < 0.001 ) {
			phi = 0;
		}
	}

	this.getId = function() {
		return id;
	}

	this.getMesh = function() {
		return mesh;
	}

	this.getTheta = function() {
		return theta;
	}

	function applyForces(deltaT) {
		//gravity
		var termV = underwater ? terminalVW : terminalV;
		if ( (velocity.y + deltaV.y) > termV ) {
			deltaV.setY(deltaV.y + (deltaT * Config.gravity));
		}

	}

	function checkTerrain(collider) {
		onGround = collider.checkTerrainCollisions(mesh.position,velocity);
		if (onGround && Math.abs(onGround) < Math.PI/10 && velocity.length() < 7) {
			velocity.multiplyScalar(0.9);
		}
	}

	function applyFriction(deltaT) {
		//check medium
		if ( underwater ) {
			velocity.multiplyScalar(1 - (deltaT * waterCoefficient));
		} else {
			velocity.multiplyScalar(1 - (deltaT * airCoefficient));
		}
		//ground friction
		if ( onGround ) {
			velocity.multiplyScalar(Math.max(0,1 - (deltaT * groundCoefficient)));
		}
	}

	function createMesh() {

		var material = new THREE.MeshPhongMaterial( {
			vertexColors: THREE.FaceColors,
			morphTargets: true,
			shininess: 100,
			overdraw: 0.5,
			shading: THREE.FlatShading
		} );

		mesh = new THREE.Mesh( HorseGeo, material );
		mesh.scale.set( 1.0, 1.0, 1.0 );
		mesh.rotation.order = "YXZ";
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		mixer = new THREE.AnimationMixer( mesh );
		var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'gallop', HorseGeo.morphTargets, 30 );
		mixer.addAction( new THREE.AnimationAction( clip ).warpToDuration( 1 ) );
		setCollisionPoints();
	}

	function setCollisionPoints() {
		var geoRadius = mesh.geometry.boundingSphere.radius;
		collisionPoints.push(new THREE.Vector3(0,-geoRadius,geoRadius*0.8));
		collisionPoints.push(new THREE.Vector3(0,-geoRadius,-geoRadius*0.8));
	}

	function jump(){
		if(onGround && jumpCounter <= 0) {
			deltaV.setY(jumpV);
			jumpCounter = jumpInterval;
		}
	}

	function pickDV(groundV,waterV,deltaT) {
		return deltaT * (underwater ? waterV : groundV);
	}

	function capVelocity() {
		var max;
		var length = velocity.length();
		if(onGround) {
			max = maxVG;
		} else if( underwater ) {
			max = maxVW;
		}else {
			max = maxV;
		}
		if(length > max) {
			velocity.multiplyScalar(max/length);
		}
	}

	function applyCommands(deltaT) {
		var movementCommand = false;
		//translate
		if(commandState.forward) { deltaV.setZ(pickDV(walkV,walkVW,deltaT)); }
		if(commandState.reverse) { deltaV.setZ(pickDV(reverseV,reverseVW,deltaT)); }
		if(commandState.left) { deltaV.setX(pickDV(strafeV,strafeVW,deltaT)); }
		if(commandState.right) { deltaV.setX(pickDV(-strafeV,-strafeVW,deltaT)); }
		if(commandState.jump) { jump(); }
		if(commandState.action) {  }
		//rotate
		if(commandState.rotLeft) { dTheta += pickDV(rotV,rotVW,deltaT); }
		if(commandState.rotRight) { dTheta -= pickDV(rotV,rotVW,deltaT); }
//		if(commandState.rotUp) { dPhi += 0.01; }
//		if(commandState.rotDown) { dPhi -= 0.01; }
	}
}
