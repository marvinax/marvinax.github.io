Tautology.Three = function(demoName, width, height){
	this.materials;
	this.ctrl;
	this.rndr;
	this.scene;
	this.camera;

	this.init(demoName, width, height);
}

Tautology.Three.prototype.constructor = Tautology.Three;

Tautology.Three.prototype.initControl = function(demoName){
	this.ctrl = new THREE.TrackballControls(this.camera, $("#"+demoName).get(0));
	this.ctrl.rotateSpeed = 1.0;
	this.ctrl.zoomSpeed = 1.2;
	this.ctrl.panSpeed = 0.8;
	this.ctrl.noZoom = false;
	this.ctrl.noPan = false;
	this.ctrl.staticMoving = false;

	this.ctrl.dynamicDampingFactor = 0.3;	
};

Tautology.Three.prototype.initRenderer = function(demoName, width, height){
	this.rndr = new THREE.WebGLRenderer({
		alpha:true,
		antialias: true
	});
	$("#"+demoName).get(0).appendChild( this.rndr.domElement );

	this.rndr.setPixelRatio(window.devicePixelRatio);
	this.rndr.setSize( width, height);
	this.rndr.setClearColor( 0xfafafa, 1);
}

Tautology.Three.prototype.initScene = function(){
	this.camera = new THREE.PerspectiveCamera( 30, 512 / 256, 1, 1000 );
	this.camera.position.set(0, 0, 100);

	var light = new THREE.DirectionalLight( 0xe0e0e0, 1 );
    	light.position = this.camera.position;
    
    this.camera.add( light );

	this.scene = new THREE.Scene();
	this.scene.add(this.camera);

}

Tautology.Three.prototype.render = function(){
	this.rndr.render(this.scene, this.camera);
}

Tautology.Three.prototype.animate = function(){
	var that = this;
	requestAnimationFrame(function(){
		that.animate();
		that.ctrl.update();
		that.render();
    });	
}

Tautology.Three.prototype.init = function(demoName, width, height) {
	this.initScene();
	this.initRenderer(demoName, width, height);
	this.initControl(demoName);
	
	this.render();
	this.animate();
}