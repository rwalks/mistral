function Renderer() {

	var renderer;
	var composer;

	this.init = function(scene,camera) {
		scene.fog = new THREE.FogExp2( 0xBABABA, 0.00002 );
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( scene.fog.color );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		composeEffects(scene,camera);
	}

	this.update = function(scene, camera) {
		renderer.render(scene,camera);
		composer.render(0.1);
	}

	this.getElement = function() {
		return renderer.domElement;
	}

	this.resize = function() {
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	this.getRenderer = function() { return renderer; }

	function composeEffects(scene,camera) {
		renderer.autoClear = false;

		var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

		renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
		renderTarget.generateMipmaps = false;


		var hblur = new THREE.ShaderPass( THREE.HorizontalTiltShiftShader );
		var vblur = new THREE.ShaderPass( THREE.VerticalTiltShiftShader );

		var bluriness = 2;

		hblur.uniforms[ 'h' ].value = bluriness / window.innerWidth;
		vblur.uniforms[ 'v' ].value = bluriness / window.innerHeight;

		hblur.uniforms[ 'r' ].value = vblur.uniforms[ 'r' ].value = 0.5;

		composer = new THREE.EffectComposer( renderer, renderTarget );

		var renderModel = new THREE.RenderPass( scene, camera.getCamera() );

		vblur.renderToScreen = true;

		composer = new THREE.EffectComposer( renderer, renderTarget );

		composer.addPass( renderModel );


		composer.addPass( hblur );
		composer.addPass( vblur );

	}

}
