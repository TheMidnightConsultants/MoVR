function FurnitureManager(furnitureList, scene, menuManager){
	console.log('initializing FurnitureManager');
	this.scene = scene;
	this.menuManager = menuManager;
	
	this.furnitureList = document.getElementById(furnitureList);
	this.scaleButton = document.getElementById("changescaleBtn");
	this.colorButton = document.getElementById("changecolorBtn");
	this.saveroomButton = document.getElementById("saveroomBtn");
		
	this.furnitureList.addEventListener('click', FurnitureManager.prototype.onFurnitureClick.bind(this), false);
	this.scaleButton.addEventListener('click', FurnitureManager.prototype.onScaleClick.bind(this), true);
	this.colorButton.addEventListener('click', FurnitureManager.prototype.onColorClick.bind(this), true);
	this.saveroomButton.addEventListener('click', FurnitureManager.prototype.onSaveRoomClick.bind(this), true);
};

FurnitureManager.prototype.update = function(){
	console.log("getting furniture");
	Util.GET('/api/listfurniture/', function(err, data){
		if (err != null){
			console.log('Error ' + err + ' while getting rooms list.');
		} else if (data.status === 'ok'){
			while (this.furnitureList.lastChild){
				this.furnitureList.removeChild(this.furnitureList.lastChild);
			}
			this.furnitureNames = data.data;
			for (var key in this.furnitureNames){
				var li = document.createElement('li');
				li.appendChild(document.createTextNode(this.furnitureNames[key]));
				li.id = '_f_' + key;
				this.furnitureList.appendChild(li);
			}
		} else {
			console.log(data.status + ':' + data.msg);
		}
	}.bind(this));
};

FurnitureManager.prototype.onSaveRoomClick = function(event) {
	var roomData = {};
	roomData.roomName = this.scene.room.room_name;
	// this.scene.room.furniture.children[0].asFurniture.getDimensions()
	console.log(this.scene.room.room_name);
	var furnitureList = this.scene.room.furniture.children;
	//console.log(furnitureList);
	roomData.furniture = [];
	for (var i = furnitureList.length - 1; i >= 0; i--) {
		var furniture = {};
		furniture.dimensions = {
			'x': furnitureList[i].asFurniture.getDimensions().x,
			'y': furnitureList[i].asFurniture.getDimensions().y,
			'z': furnitureList[i].asFurniture.getDimensions().z
		};
		furniture.color = furnitureList[i].asFurniture.getColor();
		furniture.yaw = furnitureList[i].asFurniture.getRotation();
		furniture.pos = {
			'x': furnitureList[i].asFurniture.getPosition().x,
			'y': furnitureList[i].asFurniture.getPosition().y,
			'z': furnitureList[i].asFurniture.getPosition().z
		};
		furniture.modelId = furnitureList[i].asFurniture.getModelId();
		furniture.scale = {
			'x': furnitureList[i].asFurniture.getScale().x,
			'y': furnitureList[i].asFurniture.getScale().y,
			'z': furnitureList[i].asFurniture.getScale().z,
		};
		roomData.furniture.push(furniture);
	}
	console.log(roomData);
	Util.POST('/api/saveroom/', roomData, function(err, data) {
		if (err != null) {
			console.log("Error " + err + " while saving room.");
		} else if (data.status === 'ok') {
			console.log('Successfully saved room');
		} else {
			console.log(data.status + ':' + data.msg);
		}
	}.bind(this));
};

FurnitureManager.prototype.onFurnitureClick = function(event){
	var furnitureId = event.target.id;
	if (!furnitureId.startsWith('_f_')){
		return;
	}
	furnitureId = furnitureId.substring(3);
	console.log("clicked " + furnitureId);
	this.scene.addHoverFurniture(furnitureId);
	this.menuManager.startApp();
}

FurnitureManager.prototype.onScaleClick = function(event){
	if (this.scene.hoverFurniture == null){
		return;
	}
	var fields = new Array(
		{'tag':'X', 'type':'number'},
		{'tag':'Y', 'type':'number'},
		{'tag':'Z', 'type':'number'}
	);
	this.menuManager.getInput(fields, function(data){
		console.log(data);
		var xdim = data[0];
		var ydim = data[1];
		var zdim = data[2];
		this.scene.setHoverDimensions(xdim,ydim,zdim);
		this.menuManager.switchMenu("furnitureMenu");
		this.menuManager.startApp();
	}.bind(this));
}

FurnitureManager.prototype.onColorClick = function(event){
	if (this.scene.hoverFurniture == null){
		return;
	}
	var fields = new Array(
		{'tag':'Color', 'type':'text'}
	);
	this.menuManager.getInput(fields, function(data){
		var colorString = data[0];
		if (colorString.match("^[0-9a-fA-f]{6}$") == null){
			this.menuManager.switchMenu("furnitureMenu");
			return;
		}
		var color = parseInt(colorString,16);
		this.scene.hoverFurniture.setPermanentColor(color);
		this.menuManager.switchMenu("furnitureMenu");
	}.bind(this));
}
