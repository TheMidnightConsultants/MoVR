DesktopScene.prototype = Scene.prototype;

function DesktopScene(){
	Scene.apply(this, Array.prototype.slice.call(arguments));
	this.cursorLocked;

	this.controlsEnabled = false;
	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.canJump = false;

	this.prevTime = performance.now();
	this.velocity = new THREE.Vector3();

	this.controls = new THREE.PointerLockControls( this.camera );
	this.scene.add( this.controls.getObject() );

	document.addEventListener( 'keydown', this.onKeyDown.bind(this), false );
	document.addEventListener( 'keyup', this.onKeyUp.bind(this), false );

	this.temp = null;
	
	this.animate();
};

DesktopScene.prototype.onKeyDown = function ( event ) {

	switch ( event.keyCode ) {

		case 38: // up
		case 87: // w
			this.moveForward = true;
			break;

		case 37: // left
		case 65: // a
			this.moveLeft = true; 
			break;

		case 40: // down
		case 83: // s
			this.moveBackward = true;
			break;

		case 39: // right
		case 68: // d
			this.moveRight = true;
			break;

		case 32: // space
			if ( this.canJump === true ) this.velocity.y += 350;
			this.canJump = false;
			break;

		case 72: // h
			this.placeFurniture("1");
			break;

		case 71: // g
			this.placeFurniture("2");
			break;

		case 70: // f
			this.temp = this.pickFurniture();
			console.log("Selected:", this.temp);
			break;

		case 69: // e
			if (this.temp != null){
				var rc = this.getCameraRaycaster();
				var intersect = this.getFloorRaycast(rc);
				if (intersect.length > 0){
					var p = intersect[0].point;
					console.log("Moving to",p);
					this.temp.position.set(p.x, p.y, p.z);
					this.temp = null;
				}
			}
			break;
	}

};

DesktopScene.prototype.onKeyUp = function ( event ) {

	switch( event.keyCode ) {

		case 38: // up
		case 87: // w
			this.moveForward = false;
			break;

		case 37: // left
		case 65: // a
			this.moveLeft = false;
			break;

		case 40: // down
		case 83: // s
			this.moveBackward = false;
			break;

		case 39: // right
		case 68: // d
			this.moveRight = false;
			break;

	}

};

DesktopScene.prototype.animate = function() {
	requestAnimationFrame( this.animate.bind(this) );

	if ( this.controlsEnabled ) {
		this.raycaster.ray.origin.copy( this.controls.getObject().position );
		this.raycaster.ray.origin.y -= 10;

		var intersections = this.raycaster.intersectObjects( this.objects );

		var isOnObject = intersections.length > 0;

		var time = performance.now();
		var delta = ( time - this.prevTime ) / 1000;
		var velocity = this.velocity;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		if ( this.moveForward ) velocity.z -= 400.0 * delta;
		if ( this.moveBackward ) velocity.z += 400.0 * delta;

		if ( this.moveLeft ) velocity.x -= 400.0 * delta;
		if ( this.moveRight ) velocity.x += 400.0 * delta;

		if ( isOnObject === true ) {
			velocity.y = Math.max( 0, velocity.y );

			this.canJump = true;
		}

		this.controls.getObject().translateX( velocity.x * delta );
		this.controls.getObject().translateY( velocity.y * delta );
		this.controls.getObject().translateZ( velocity.z * delta );

		if ( this.controls.getObject().position.y < 10 ) {

			velocity.y = 0;
			this.controls.getObject().position.y = 10;

			this.canJump = true;

		}

		this.prevTime = time;

	} else {
		this.prevTime = performance.now();
	}

	this.renderer.render( this.scene, this.camera );
};

DesktopScene.prototype.EnableControls = function(){
	this.controls.enabled = true;
	this.controlsEnabled = true;
};

DesktopScene.prototype.DisableControls = function(){
	this.controls.enabled = false;
	this.controlsEnabled = false;
};

DesktopScene.prototype.getCameraRaycaster = function(){
	var lookDirection = this.camera.getWorldDirection();
	var cameraPos = this.controls.getObject().position.clone();
	var rc = new THREE.Raycaster(cameraPos, lookDirection);
	return rc;
};

DesktopScene.prototype.getFloorRaycast = function(rc){
	var floor = this.scene.getObjectByName("floorplane");
	var intersect = rc.intersectObject(floor, false);
	return intersect;
};

DesktopScene.prototype.placeFurniture = function(modelName){
	var rc = this.getCameraRaycaster();
	// var floor = this.scene.getObjectByName("floorplane");
	// var intersect = rc.intersectObject(floor, false);
	var intersect = this.getFloorRaycast(rc);
	if (intersect.length > 0){
		var p = intersect[0].point;
		// console.log(p);
		var newFurniture = new Furniture(modelName, 0xf442f1);
		console.log(this);
		this.room.addFurniture(newFurniture, p.x, p.y, p.z);
		console.log("Added furniture");
	}
};

DesktopScene.prototype.pickFurniture = function(){
	var rc = this.getCameraRaycaster();
	var intersect = rc.intersectObject(this.room.furniture, true);
	if (intersect.length > 0){
		var nearest = intersect[0].object.parent.parent;
		return nearest;
	}
	return null;
};
