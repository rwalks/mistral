//Global Util Functions

function distance(p1, p2) {
	return Math.sqrt(Math.pow(p2[0] - p1[0],2)+Math.pow(p2[1]-p1[1],2));
}

function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max);
};
