function Config() {
	
	//polygon points
	this.worldWidth = 256;
	this.worldDepth = 256;

	this.tileWidth = 16;
	this.tileDepth = 16;

	this.seaLevel = Math.floor(this.height * 0.25);

	//real coords
	this.width = 800000;
	this.depth = 800000;
	this.height = 100000;

	this.showStats = true;

	this.gravity = -70;

}
