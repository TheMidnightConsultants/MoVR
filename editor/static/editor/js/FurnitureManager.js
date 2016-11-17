function FurnitureManager(furnitureList, menuManager){
	console.log('initializing FurnitureManager');
	this.furnitureList = document.getElementById(furnitureList);
	this.menuManager = menuManager;
		
	this.furnitureList.addEventListener('click', FurnitureManager.prototype.onFurnitureClick.bind(this), false);
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

FurnitureManager.prototype.onFurnitureClick = function(event){
	var furnitureId = event.target.id;
	if (!furnitureId.startsWith('_f_')){
		return;
	} else {
		furnitureId = furnitureId.substring(3);
	}
	console.log("clicked " + furnitureId);
}