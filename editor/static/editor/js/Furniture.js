function Furniture(model_id, color_in){
	if (typeof model_id === 'undefined'){
		return;
	}
	
	this.mesh = new THREE.Object3D();
	this.color = color_in;
	
	this.loadModel(model_id);

	this.setPosition(0,0,0);
	
	this.mesh.asFurniture = this;
}

Furniture.loadedModels = {};

Furniture.loader = new THREE.OBJLoader();

Furniture.prototype.loadModel = function(model_id){
	if (model_id in Furniture.loadedModels){
		console.log("Model already loaded for ", model_id);
		this.cloneLoadedMesh(model_id);
		return;
	}

	console.log("Loading furniture model for ", model_id);

	// object loader functions
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};
	
	Furniture.loader.load('/api/loadmodel/'+model_id+'/',
		function(object){
			object.traverse( function(child) {
			 	if (child instanceof THREE.Mesh){
			 		child.material = new THREE.MeshPhongMaterial( {color: this.color, wireframe: false, vertexColors: THREE.NoColors } );
			  	}
			}.bind(this));
			Furniture.loadedModels[model_id] = object;
			
			var boundingBox = new THREE.BoundingBoxHelper(object, 0xffffff);
			boundingBox.update();
			var center = boundingBox.box.center();
			console.log(object.position);
			object.position.x -= center.x;
			object.position.y = -boundingBox.box.min.y;
			object.position.z -= center.z;
			console.log(object.position);
			
			this.cloneLoadedMesh(model_id);
		}.bind(this), onProgress, onError );
}

Furniture.prototype.cloneLoadedMesh = function(model_id){
	var cloneModel = Furniture.loadedModels[model_id].clone();
	this.mesh.add(cloneModel);
	console.log("New furniture mesh",this.mesh);
}

Furniture.prototype.setPosition = function(x, y, z){
	this.mesh.position.x = x;
	this.mesh.position.y = y;
	this.mesh.position.z = z;
}

Furniture.prototype.rotateYaw = function(radians){
	this.mesh.rotateY(radians);
}

Furniture.prototype.setScale = function(x, y, z){
	this.mesh.scale.set(x,y,z);
}

Furniture.prototype.scaleMultiply = function(scalar){
	this.mesh.scale.multiply(scalar);	
}

Furniture.prototype.getDimensions = function(){
	// var scale = this.mesh.scale;
	var boundingBox = new THREE.BoundingBoxHelper(this.mesh, 0xffffff);
	boundingBox.update();
	console.log(boundingBox);
	var xdim = boundingBox.box.max.x - boundingBox.box.min.x;
	var ydim = boundingBox.box.max.y - boundingBox.box.min.y;
	var zdim = boundingBox.box.max.z - boundingBox.box.min.z;
	return new THREE.Vector3(xdim,ydim,zdim);
}

Furniture.prototype.setDimensions = function(x,y,z){
	var currentDimensions = this.getDimensions();
	this.setScale(
		x/currentDimensions.x,
		y/currentDimensions.y,
		z/currentDimensions.z
	);
}
