function Room( width_in, length_in, height_in, wallcolor_in ){
	
	//this.dimensions = [width_in, length_in];
	this.dimensions = [100, 100];
 	this.wall_color = wallcolor_in;
	//this.room_height = height_in;
	this.room_height = 40;

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

	// walls

	for ( i = 0; i < 4; i ++){

		wall_dim = this.dimensions[Math.floor(i/2)];
		other_dim = this.dimensions[ (Math.floor(i/2)+1) % 2 ];
		offset = Math.floor(wall_dim/2);
		other_offset = (i%2) * other_dim;

		geometry = new THREE.PlaneGeometry(wall_dim, this.room_height);
		material = new THREE.MeshPhongMaterial( { color: this.wall_color, shading: THREE.FlatShading } );
		mesh = new THREE.Mesh( geometry, material );

		mesh.position.y = Math.floor(this.room_height) / 2;

		if (Math.floor(i/2) == 0){
			mesh.position.x = offset;
			mesh.position.z = other_offset;
		} else {
			mesh.position.z = offset;
			mesh.position.x = other_offset;
			mesh.rotation.y = Math.PI / 2;
		}

		mesh.material.side = THREE.DoubleSide;

		this.mesh.add(mesh);
	}

	// ceiling

	geometry = new THREE.PlaneGeometry(this.dimensions[0],this.dimensions[1]);
	material = new THREE.MeshPhongMaterial( { color: this.wall_color, shading: THREE.FlatShading } );
	mesh = new THREE.Mesh( geometry, material );

	mesh.material.side = THREE.DoubleSide;

	mesh.position.x = Math.floor(this.dimensions[0]/2);
	mesh.position.z = Math.floor(this.dimensions[1]/2);
	mesh.position.y = this.room_height;

	mesh.rotation.x = Math.PI/2;

	this.mesh.add(mesh);
}

Room.prototype.addFurniture = function(furniture_obj){
	this.furniture.add(furniture_obj.mesh); // add to furniture mesh
}
