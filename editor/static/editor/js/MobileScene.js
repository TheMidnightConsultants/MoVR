MobileScene.prototype = Scene.prototype;

function MobileScene(){
	Scene.apply(this, Array.prototype.slice.call(arguments));
	this.controls = new THREE.DeviceOrientationControls( this.camera );
	
	var pos = this.camera.position;
	this.camera.position.set(pos.x, pos.y + 40, pos.z);
	this.animate();
};

MobileScene.prototype.animate = function(){
	requestAnimationFrame( this.animate.bind(this) );
	this.controls.update();
	this.renderer.render( this.scene, this.camera );
}


/*
(function() {
	  "use strict";

	  window.addEventListener('load', function() {

			var container, camera, scene, renderer, controls, geometry, mesh;

			var animate = function(){

				window.requestAnimationFrame( animate );

				controls.update();
				renderer.render(scene, camera);

			};

			container = document.getElementById( 'container' );

			camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);

			controls = new THREE.DeviceOrientationControls( camera );

			scene = new THREE.Scene();

			var geometry = new THREE.SphereGeometry( 500, 16, 8 );
			geometry.scale( - 1, 1, 1 );

			var material = new THREE.MeshBasicMaterial( {
				map: new THREE.TextureLoader().load( '/static/editor/img/placeholder_panorama.jpg' )
			} );

			var mesh = new THREE.Mesh( geometry, material );
			scene.add( mesh );

			var geometry = new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 );
			var material = new THREE.MeshBasicMaterial( { color: 0xff00ff, side: THREE.BackSide, wireframe: true } );
			var mesh = new THREE.Mesh( geometry, material );
			scene.add( mesh );

			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.domElement.style.position = 'absolute';
			renderer.domElement.style.top = 0;
			container.appendChild(renderer.domElement);

			window.addEventListener('resize', function() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );

			}, false);

			animate();

	  }, false);

})();
*/