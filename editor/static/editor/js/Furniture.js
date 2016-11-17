function Furniture(model_id, color_in){
	this.mesh = new THREE.Object3D();
	this.color = color_in;
	
	this.loadModel(model_id);

	this.setPosition(0,0,0);
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

Furniture.prototype.setScale = function(x, y, z){
	this.mesh.scale.set(x,y,z);
}
