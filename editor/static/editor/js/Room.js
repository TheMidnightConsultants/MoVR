function Room( width_in, length_in, height_in, wallcolor_in ){
	
	this.dimensions = [width_in, length_in];
 	this.wall_color = wallcolor_in;
	this.room_height = height_in;

	this.walls = [];
	this.furniture = [];

	var i, wall_dim, other_dim, offset, other_offset;
	var geometry, material, mesh;

	// walls

	for ( var i = 0; i < 4; i ++){

		wall_dim = room_dimensions[Math.floor(i/2)];
		other_dim = room_dimensions[ (Math.floor(i/2)+1) % 2 ];
		offset = Math.floor(wall_dim/2);
		other_offset = (i%2) * other_dim;

		geometry = new THREE.PlaneGeometry(wall_dim, room_height);
		material = new THREE.MeshPhongMaterial( { color: wall_color, shading: THREE.FlatShading } );
		mesh = new THREE.Mesh( geometry, material );

		mesh.position.y = Math.floor(room_height) / 2;

		if (Math.floor(i/2) == 0){
			mesh.position.x = offset;
			mesh.position.z = other_offset;
		} else {
			mesh.position.z = offset;
			mesh.position.x = other_offset;
			mesh.rotation.y = Math.PI / 2;
		}

		mesh.material.side = THREE.DoubleSide;

		// this.scene.add( mesh );
		this.walls.push(mesh);
	}

	// ceiling

	geometry = new THREE.PlaneGeometry(room_dimensions[0],room_dimensions[1]);
	material = new THREE.MeshPhongMaterial( { color: wall_color, shading: THREE.FlatShading } );
	mesh = new THREE.Mesh( geometry, material );

	mesh.material.side = THREE.DoubleSide;

	mesh.position.x = Math.floor(room_dimensions[0]/2);
	mesh.position.z = Math.floor(room_dimensions[1]/2);
	mesh.position.y = room_height;

	mesh.rotation.x = Math.PI/2;

	this.scene.add(mesh);
}

Room.prototype.addFurniture(filename, pos_x, pos_y){
	
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
			 		child.material = new THREE.MeshPhongMaterial( {color: 0x445599, wireframe: false, vertexColors: THREE.NoColors } );
			  	}
			});
			object.position.x = pos_x;
			object.position.z = pos_z;
			this.furniture.push(object);
		}.bind(this), onProgress, onError );
}
