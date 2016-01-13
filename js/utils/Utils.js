//Global Util Functions

function distance(p1, p2) {
	return Math.sqrt(Math.pow(p2[0] - p1[0],2)+Math.pow(p2[1]-p1[1],2));
}

function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max);
};

var xAxis = new THREE.Vector3(1,0,0);
var yAxis = new THREE.Vector3(0,1,0);

function rotateX(vec,phi) {
	vec.applyAxisAngle(xAxis,phi);
}
function rotateY(vec,theta) {
	vec.applyAxisAngle(yAxis,theta);
}

function rotateMeshX(mesh,phi) {
	var rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(xAxis.normalize(), phi);
    rotWorldMatrix.multiply(mesh.matrix);
    mesh.matrix = rotWorldMatrix;
    mesh.rotation.setFromRotationMatrix(mesh.matrix);
}
function rotateMeshY(mesh,theta) {
	var rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(yAxis.normalize(), theta);
    rotWorldMatrix.multiply(mesh.matrix);
    mesh.matrix = rotWorldMatrix;
    mesh.rotation.setFromRotationMatrix(mesh.matrix);
}

/*
this.pointWithin2D = function(point,){
	var inside = false;
	for (var i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
		var xi = this.points[i].x, yi = this.points[i].y;
		var xj = this.points[j].x, yj = this.points[j].y;
		var intersect = ((yi > y) != (yj > y))
			&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}
	return inside;
}
*/
