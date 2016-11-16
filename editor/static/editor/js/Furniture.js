function Furniture(model_filename, color_in){
	this.mesh = new THREE.Object3D();
	this.model_file = model_filename;
	this.color = color_in;
	
	this.position = {"x": 0, "y": 0, "z": 0};

	this.loadModel(model_filename);
}

Furniture.prototype.loadModel = function(filename){
	console.log("Loading furniture model for ", filename);
	// object loader
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};
	
	var loader = new THREE.OBJLoader();
	loader.load('/static/editor/models/'+filename,
		function(object){
			object.traverse( function(child) {
			 	if (child instanceof THREE.Mesh){
			 		child.material = new THREE.MeshPhongMaterial( {color: this.color, wireframe: false, vertexColors: THREE.NoColors } );
			  	}
			}.bind(this));
			// this.mesh = object;
			this.mesh.add(object);
		}.bind(this), onProgress, onError );
}

Furniture.prototype.setPosition = function(x, y, z){
	this.position.x = x;
	this.position.y = y;
	this.position.z = z;
}

Furniture.prototype.updatePosition = function(){
	this.position.x = this.mesh.position.x;
	this.position.y = this.mesh.position.y;
	this.position.z = this.mesh.position.z;
}

Furniture.prototype.setScale = function(x, y, z){
	this.mesh.scale.set(x,y,z);
}
