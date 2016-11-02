function RoomManager(roomList, addBtn, dupBtn, delBtn, userId, authToken){
	console.log('initializing simple RoomManager');
	this.roomList = document.getElementById(roomList);
	this.roomNames = [];
	
	this.deleting = false;
	this.duplicating = false;
	
	if (typeof addBtn !== 'undefined' && typeof dupBtn !== 'undefined' && typeof delBtn !== 'undefined' && typeof userId !== 'undefined' && typeof authToken !== 'undefined'){
		console.log('initializing complicated RoomManager');
		this.addBtn = document.getElementById(addBtn);
		this.dupBtn = document.getElementById(dupBtn);
		this.delBtn = document.getElementById(delBtn);
		this.userId = userId;
		this.authToken = authToken;
		
		this.roomList.addEventListener('click', RoomManager.prototype.onRoomClick.bind(this), false);
		
		this.addBtn.addEventListener('click', function(event){
			var roomName = 'Room ' + Math.floor(Math.random() * 1000);
			this.addRoom(roomName);
		}.bind(this), false);
		
		this.dupBtn.addEventListener('click', function(event){
			this.duplicating = !this.duplicating;
		}.bind(this), false);
		
		this.delBtn.addEventListener('click', function(event){
			this.deleting = !this.deleting;
		}.bind(this), false);
	}
};

RoomManager.prototype.update = function(){
	Util.POST('/api/rooms/', {'user_id':this.userId, 'auth_token':this.authToken}, function(err, data){
		if (err != null){
			console.log('Error ' + err + ' while getting rooms list.');
		} else if (data.status === 'ok'){
			while (this.roomList.lastChild){
				this.roomList.removeChild(this.roomList.lastChild);
			}
			this.roomNames = data.data;
			for (var key in this.roomNames){
				var li = document.createElement('li');
				li.appendChild(document.createTextNode(this.roomNames[key]));
				li.id = '_room_' + key;
				this.roomList.appendChild(li);
			}
		} else {
			console.log(data.status + ':' + data.msg);
		}
	}.bind(this));
};

RoomManager.prototype.addRoom = function(roomName){
	Util.POST('/api/addroom/', {'user_id':this.userId, 'auth_token':this.authToken, 'room_name':roomName}, function(err, data){
		if (err != null){
			console.log('Error ' + err + ' while POST-ing new room.');
		} else if (data.status === 'ok'){
			this.update();
		} else {
			console.log(data.status + ':' + data.msg);
		}
	}.bind(this));
}

RoomManager.prototype.deleteRoom = function(roomId){
	Util.POST('/api/deleteroom/', {'user_id':this.userId, 'auth_token':this.authToken, 'room_id':roomId}, function(err, data){
		if (err != null){
			console.log('Error ' + err + ' while POST-ing room deletion.');
		} else {
			this.update();
		}
	}.bind(this));
}

RoomManager.prototype.onRoomClick = function(event){
	var roomId = event.target.id;
	if (!roomId.startsWith('_room_')){
		return;
	} else {
		roomId = roomId.substring(6);
	}
	if (this.deleting){
		this.deleting = false;
		this.deleteRoom(roomId);
	} else if (this.duplicating){
		//duplicate the room
	} else {
		//load the room they clicked on and start the app
	}
	console.log("clicked " + roomId);
}