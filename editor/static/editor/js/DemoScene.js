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
	document.addEventListener( 'click', this.onClick.bind(this), false );

	this.temp = null;
	this.hoverFurniture = null;
	
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

DesktopScene.prototype.onClick = function ( event ) {
	if (this.controlsEnabled){
		if (this.hoverFurniture != null){
			this.placeFurniture();
		} else {
			this.hoverFurniture = this.pickFurniture();
		}
	}
};

DesktopScene.prototype.animate = function() {
	requestAnimationFrame( this.animate.bind(this) );

	if ( this.controlsEnabled ) {

		var time = performance.now();
		var delta = ( time - this.prevTime ) / 1000;
		var velocity = this.velocity;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		if ( this.moveForward ) velocity.z -= 12 * 300.0 * delta;
		if ( this.moveBackward ) velocity.z += 12 * 300.0 * delta;

		if ( this.moveLeft ) velocity.x -= 12 * 300.0 * delta;
		if ( this.moveRight ) velocity.x += 12 * 300.0 * delta;

		var controlObj = this.controls.getObject();

		if (this.room){
			var limX = this.room.dimensions[0] / 2;
			var limZ = this.room.dimensions[1] / 2;
			var changed = false;
			var worldPos = controlObj.getWorldPosition(); // get world position
			var worldVel = new THREE.Vector3().copy(velocity);
			controlObj.localToWorld(worldVel); // translate local vel to world
			if (worldPos.x > limX - 6 || worldPos.x < 6 - limX){
				worldVel.x = 0;
				changed = true;
			 	// console.log("X hit limit");
			}
			if (worldPos.z > limZ - 6 || worldPos.z < 6 - limZ){
				worldVel.z = 0;
				changed = true;
			 	// console.log("Z hit limit");
			}
			if (changed){
				controlObj.worldToLocal(worldVel);
				velocity.copy(worldVel);
			}
		}

		controlObj.translateX( velocity.x * delta );
		controlObj.translateZ( velocity.z * delta );

		this.prevTime = time;

	} else {
		this.prevTime = performance.now();
	}
	
	this.updateHoverPosition();

	this.renderer.render( this.scene, this.camera );
};

DesktopScene.prototype.DisableControls = function(){
	this.controls.enabled = false;
	this.controlsEnabled = false;
};

DesktopScene.prototype.EnableControls = function(){
	this.controls.enabled = true;
	this.controlsEnabled = true;
};

DesktopScene.prototype.getCameraRaycaster = function(){
	var lookDirection = this.camera.getWorldDirection();
	var cameraPos = this.controls.getObject().position.clone();
	var rc = new THREE.Raycaster(cameraPos, lookDirection);
	return rc;
};

DesktopScene.prototype.addHoverFurniture = function(model_id){
	this.hoverFurniture = new Furniture(model_id, 0xf442f1);
	this.scene.add(this.hoverFurniture.mesh);
}

DesktopScene.prototype.getFloorRaycast = function(rc){
	var floor = this.scene.getObjectByName("floorplane");
	var intersect = rc.intersectObject(floor, false);
	return intersect;
};

DesktopScene.prototype.placeFurniture = function(){
	this.scene.remove(this.hoverFurniture.mesh);
	this.room.addFurniture(this.hoverFurniture);
	this.hoverFurniture = null;
};

DesktopScene.prototype.pickFurniture = function(){
	var rc = this.getCameraRaycaster();
	var intersect = rc.intersectObject(this.room.furniture, true);
	if (intersect.length > 0){
		var nearest = intersect[0].object.parent.parent;
		return nearest.asFurniture;
	}
	return null;
};

DesktopScene.prototype.updateHoverPosition = function(){
	if (this.hoverFurniture == null){
		return;
	}
	var rc = this.getCameraRaycaster();
	var intersect = this.getFloorRaycast(rc);
	if (intersect.length > 0){
		var p = intersect[0].point;
		this.hoverFurniture.setPosition(p.x, p.y, p.z);
	}
};