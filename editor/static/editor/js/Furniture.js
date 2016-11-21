/*
 * Furniture class
 * 
 * Stores the current/permanent color of a piece of furniture, the model itself,
 * and has methods for manipulating the model in the room
 */
function Furniture(model_id, color_in){
	if (typeof model_id === 'undefined'){
		return;
	}
	
	this.mesh = new THREE.Object3D();
	this.model_id = model_id;
	this.color = color_in;
	this.loaded = false;
	this.onLoad = null;
	this.loadModel(model_id);

	this.setPosition(0,0,0);
	
	this.mesh.asFurniture = this;
}

// a static set of the furniture models that have been loaded in
Furniture.loadedModels = {};

// a static object used for loading in furniture models
Furniture.loader = new THREE.OBJLoader();

// grabs the specified model, loading it if necessary
Furniture.prototype.loadModel = function(model_id){
	if (model_id in Furniture.loadedModels){
		console.log("Model already loaded for ", model_id);
		this.cloneLoadedMesh(model_id);
		this.setDimensions(50,50,50);
		this.loaded = true;
		return;
	}

	console.log("Loading furniture model for ", model_id);

	// object loader callbacks
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};
	
	// load the model with the api
	Furniture.loader.load('/api/loadmodel/'+model_id+'/',
		function(object){
			console.log(object);
			// give the base loaded model a material on its meshes
			object.traverse( function(child) {
			 	if (child instanceof THREE.Mesh){
			 		child.material = new THREE.MeshPhongMaterial( {color: 0xffeedd, wireframe: false, vertexColors: THREE.NoColors } );
			  	}
			}.bind(this));
			// store it in the model set
			Furniture.loadedModels[model_id] = object;
			
			// use a bounding box to center the model in its local coordinate system
			var boundingBox = new THREE.BoundingBoxHelper(object, 0xffffff);
			boundingBox.update();
			var center = boundingBox.box.center();
			object.position.x -= center.x;
			object.position.y = -boundingBox.box.min.y;
			object.position.z -= center.z;
			
			this.cloneLoadedMesh(model_id);
			this.loaded = true;
			this.setDimensions(50,50,50);
			if (this.onLoad != null){
				this.onLoad();
			}
			console.log("Loaded furniture model for ", model_id);
		}.bind(this), onProgress, onError );
	return false;
}

// copies a furniture model from the set of loaded models
Furniture.prototype.cloneLoadedMesh = function(model_id){
	var cloneModel = Furniture.loadedModels[model_id].clone();
	this.mesh.add(cloneModel);
	this.mesh.traverse( function(child) {
		if (child instanceof THREE.Mesh){
			child.material = new THREE.MeshPhongMaterial( { wireframe: false, vertexColors: THREE.NoColors } );
		}
	}.bind(this));
	this.resetColor();
	console.log("New furniture mesh",this.mesh);
}

// temporarily sets the color of the model (i.e. for highlighting)
Furniture.prototype.setColor = function(color){
	this.mesh.traverse( function(child) {
		if (child instanceof THREE.Mesh){
			child.material.color.set(color);
		}
	});
}

// changes the permanent base color for the model
Furniture.prototype.setPermanentColor = function(color){
	this.color = color;
}

// resets the color to the base color
Furniture.prototype.resetColor = function(){
	this.setColor(this.color);
}

// rotate the furniture along the y axis
Furniture.prototype.rotateYaw = function(radians){
	this.mesh.rotateY(radians);
}

// multiply the model's scale vector by a scalar on all dimensions
Furniture.prototype.scaleMultiply = function(scalar){
	this.mesh.scale.multiply(scalar);	
}

// set the model's scale vector to a given vector
Furniture.prototype.setScale = function(x, y, z){
	this.mesh.scale.set(x,y,z);
}

// move the furniture model to the given position
Furniture.prototype.setPosition = function(x, y, z){
	this.mesh.position.x = x;
	this.mesh.position.y = y;
	this.mesh.position.z = z;
}

// size the furniture to a set of dimensions
Furniture.prototype.setDimensions = function(x,y,z){
	// get the current scale and bounding box dimensions
	var currentScale = new THREE.Vector3().copy(this.mesh.scale);
	var currentDimensions = this.getDimensions();
	// scale the model with a formula to make it match the desired dimensions
	this.setScale(
		x*currentScale.x/currentDimensions.x,
		y*currentScale.y/currentDimensions.y,
		z*currentScale.z/currentDimensions.z
	);
}

// set the model's rotation to a given rotation
Furniture.prototype.setRotation = function(x, y, z){
	this.mesh.rotation.x = x;
	this.mesh.rotation.y = y;
	this.mesh.rotation.z = z;
}

// get the dimensions of the bounding box of the furniture
Furniture.prototype.getDimensions = function(){
	var boundingBox = new THREE.BoundingBoxHelper(this.mesh, 0xffffff);
	boundingBox.update();
	var xdim = boundingBox.box.max.x - boundingBox.box.min.x;
	var ydim = boundingBox.box.max.y - boundingBox.box.min.y;
	var zdim = boundingBox.box.max.z - boundingBox.box.min.z;
	return new THREE.Vector3(xdim,ydim,zdim);
}

// get the permanent color of the furniture (NOT the "current" color)
Furniture.prototype.getColor = function(){
	return this.color;
}

// gets the position of the furniture
Furniture.prototype.getPosition = function(){
	return new THREE.Vector3().copy(this.mesh.position);
}

// gets the rotation of the furniture
Furniture.prototype.getRotation = function(){
	return this.mesh.rotation;
}

// gets the model id of the furniture model
Furniture.prototype.getModelId = function(){
	return this.model_id;
}

// gets the scale vector of the furniture model (returns a copy)
Furniture.prototype.getScale = function(){
	return new THREE.Vector3().copy(this.mesh.scale);
}

