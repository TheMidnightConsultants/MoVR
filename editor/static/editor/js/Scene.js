function Scene(){
	var geometry, material, mesh;

	this.objects = [];

	this.raycaster;

	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

	this.scene = new THREE.Scene();
	// this.scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	this.scene.add( light );

	this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setClearColor( 0xffffff );
	this.renderer.setPixelRatio( window.devicePixelRatio );
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( this.renderer.domElement );

	window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
};

Scene.prototype.addRoom = function(room){
	room.mesh.name = 'ROOM';
	this.room = room;
	this.scene.add(room.mesh);
}

Scene.prototype.clearRooms = function(){
	var obj = this.scene.getObjectByName('ROOM');
	this.scene.remove(obj);
}

Scene.prototype.onWindowResize = function() {
	//update 3D scene
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize( window.innerWidth, window.innerHeight );
};

Scene.prototype.animate = function() {
	requestAnimationFrame( this.animate.bind(this) );
	this.renderer.render( this.scene, this.camera );
};

Scene.prototype.EnableControls = function(){};

Scene.prototype.DisableControls = function(){};
