function Collider() {

	var terrainTiles;
	var caster;
	var downRay = new THREE.Vector3(0,-1,0);
	var upRay = new THREE.Vector3(0,1,0);

	this.init = function(tTiles) {
		terrainTiles = tTiles;
		caster = new THREE.Raycaster( );
	}

	this.terrainCollide = function(point, vRay) {
		caster.set(point, vRay);
		return caster.intersectObjects( terrainTiles );
	}
	
	this.terrainAltitude = function(x,z) {
		var pos = new THREE.Vector3(x,0,z);
		var colls = this.terrainCollide(pos,upRay);
		if (colls.length > 0) {
			return Config.height - colls[0].distance;
		}
		return false;
	}

	this.checkTerrainCollisions = function(origin,velocity) {
		var terrainSafe = false;
		var originPoint = new THREE.Vector3().copy(origin);
		var maxChecks = 2;
		var onGround = false;
		while(!terrainSafe) {
			var dvNorm = new THREE.Vector3().copy(velocity).normalize();
			var colls = this.terrainCollide(originPoint,dvNorm);
			if (colls.length > 0 && colls[0].distance <= velocity.length()) {
				onGround = true;
				if ( maxChecks <= 0 ) {
					velocity.set(0,0,0);
					terrainSafe = true;
				} else {
					maxChecks -= 1;
					var faceNorm = new THREE.Vector3().copy(colls[0].face.normal);
					var slope = upRay.angleTo(faceNorm);
					//if (velocity.y < 0.0001 && Math.abs(slope) < Math.PI/4) {
					//	velocity.setY(-velocity.y * 0.2);
					//}
					velocity.projectOnPlane(faceNorm);
				}
			} else {
				terrainSafe = true;
			}
		}
		return onGround;
	}

}
