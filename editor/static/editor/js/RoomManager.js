function RoomManager(roomList, addBtn, dupBtn, delBtn, userId, authToken){
	console.log('initializing simple RoomManager');
	this.roomList = document.getElementById(roomList);
	this.roomNames = [];
	
	if (typeof addBtn !== 'undefined' && typeof dupBtn !== 'undefined' && typeof delBtn !== 'undefined' && typeof userId !== 'undefined' && typeof authToken !== 'undefined'){
		console.log('initializing complicated RoomManager');
		this.addBtn = document.getElementById(addBtn);
		this.dupBtn = document.getElementById(dupBtn);
		this.delBtn = document.getElementById(delBtn);
		this.userId = userId;
		this.authToken = authToken;
		
		var mgr = this; //so it gets captured in the callback
		this.addBtn.addEventListener('click', function(event){
			var roomName = 'Room ' + Math.floor(Math.random() * 1000);
			mgr.addRoom(roomName);
		}, false);
	}
};

RoomManager.prototype.update = function(){
	var mgr = this;
	Util.POST('/api/rooms/', {'user_id':mgr.userId, 'auth_token':mgr.authToken}, function(err, data){
		if (err != null){
			console.log('Error ' + err + ' while getting rooms list.');
		} else if (data.status === 'ok'){
			while (mgr.roomList.lastChild){
				mgr.roomList.removeChild(mgr.roomList.lastChild);
			}
			mgr.roomNames = data.data;
			for (var key in mgr.roomNames){
				var li = document.createElement('li');
				li.appendChild(document.createTextNode(mgr.roomNames[key]));
				mgr.roomList.appendChild(li);
			}
		} else {
			console.log(data.status + ':' + data.msg);
		}
	});
};

RoomManager.prototype.addRoom = function(roomName){
	var mgr = this;
	Util.POST('/api/addroom/', {'user_id':mgr.userId, 'auth_token':mgr.authToken, 'room_name':roomName}, function(err, data){
		if (err != null){
			console.log('Error ' + err + ' while POST-ing new room.');
		} else if (data.status === 'ok'){
			mgr.update();
		} else {
			console.log(data.status + ':' + data.msg);
		}
	});
}