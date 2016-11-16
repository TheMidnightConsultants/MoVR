function Furniture(model_filename, color_in){
	this.mesh = new THREE.Object3D();
	this.model_file = model_filename;
	this.color = color_in;
	
	this.loadModel(model_filename);

	this.setPosition(0,0,0);
}

Furniture.loadedModels = {};

Furniture.loader = new THREE.OBJLoader();

Furniture.prototype.loadModel = function(filename){
	if (filename in Furniture.loadedModels){
		console.log("Model already loaded for ",filename);
		this.cloneLoadedMesh(filename);
		return;
	}

	console.log("Loading furniture model for ", filename);

	// object loader functions
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};
	
	Furniture.loader.load('/static/editor/models/'+filename,
		function(object){
			object.traverse( function(child) {
			 	if (child instanceof THREE.Mesh){
			 		child.material = new THREE.MeshPhongMaterial( {color: this.color, wireframe: false, vertexColors: THREE.NoColors } );
			  	}
			}.bind(this));
			Furniture.loadedModels[filename] = object;
			this.cloneLoadedMesh(filename);
		}.bind(this), onProgress, onError );
}

Furniture.prototype.cloneLoadedMesh = function(filename){
	this.mesh.add(Furniture.loadedModels[filename].clone());
}

Furniture.prototype.setPosition = function(x, y, z){
	this.mesh.position.x = x;
	this.mesh.position.y = y;
	this.mesh.position.z = z;
}

Furniture.prototype.setScale = function(x, y, z){
	this.mesh.scale.set(x,y,z);
}
