function Room( width_in, length_in, height_in, wallcolor_in, name_in ){
	
	this.dimensions = [width_in, length_in];
 	this.wall_color = wallcolor_in;
	this.room_height = height_in;
	this.room_name = name_in;

	/*
	 * 	    	    		Room.mesh
	 * 	     				  |
	 *   		+-------------+--------+
	 *   		|  			           |
	 * 	   Wall meshes           Room.furniture 
	 */
	this.mesh = new THREE.Group();
	this.furniture = new THREE.Group();
	this.mesh.add(this.furniture);


	var i, wall_dim, other_dim, offset, other_offset;
	var geometry, material, mesh;

	// room box
	geometry = new THREE.BoxGeometry(width_in, height_in, length_in);
	material = new THREE.MeshPhongMaterial( {color: this.wall_color, shading: THREE.FlatShading} );
	material.side = THREE.DoubleSide;
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.y += height_in/2;
	mesh.name = "wallbox";
	this.mesh.add(mesh);

	// invisible floor plane
	geometry = new THREE.PlaneGeometry(width_in, length_in);
	material = new THREE.MeshPhongMaterial( {color: 0xFF11CC, shading: THREE.FlatShading });
	material.side = THREE.DoubleSide;
	material.visible = false;
	mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = Math.PI/2;
	mesh.name = "floorplane";
	this.mesh.add(mesh);
	
}

// given a Furniture object, adds its furniture mesh to the room
Room.prototype.addFurniture = function(furniture_obj){
	this.furniture.add(furniture_obj.mesh); // add to furniture mesh
}

// removes furniture from the room
Room.prototype.removeFurniture = function(furniture_obj){
	this.furniture.remove(furniture_obj.mesh);
}
