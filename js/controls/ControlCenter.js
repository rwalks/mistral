function ControlCenter() {

	var container;
	var stats;
	var camera = new Camera();
	var controls = new Controls();
	var renderer = new Renderer();

	this.init = function(scene) {
		camera.init();
		controls.init(camera.getCamera());
		renderer.init();

		container = document.getElementById( 'container' );
		container.innerHTML = "";
		container.appendChild( renderer.getElement() );
		container.addEventListener( 'mousemove', onMouseMove, false );

		camera.setPosition(2000,controls.getControls().center.y + 2000,null);

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild( stats.domElement );

		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();

		window.addEventListener( 'resize', onWindowResize, false );
	}

	this.update = function(deltaT, scene) {
		stats.update();
		controls.update( deltaT );
		renderer.update( scene, camera.getCamera() );
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	function onMouseMove( event ) {
		//mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		//mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
		//raycaster.setFromCamera( mouse, camera );
		// See if the ray from the camera into the world hits one of our meshes
		//var intersects = raycaster.intersectObject( mesh );
		// Toggle rotation bool for meshes that we clicked
		//if ( intersects.length > 0 ) {
			//helper.position.set( 0, 0, 0 );
			//helper.lookAt( intersects[ 0 ].face.normal );
			//helper.position.copy( intersects[ 0 ].point );
		//}
	}
}
