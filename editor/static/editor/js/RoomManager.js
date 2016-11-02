function RoomManager(roomList, addBtn, dupBtn, delBtn){
	this.roomList = document.getElementById(roomList);
	this.addBtn = document.getElementById(addBtn);
	this.dupBtn = document.getElementById(dupBtn);
	this.delBtn = document.getElementById(delBtn);
	this.roomNames = [];
};

function RoomManager(roomList){
	this.roomList = document.getElementById(roomList);
	this.roomNames = [];
};

RoomManager.prototype.update = function(userId, authToken){
	mgr = this;
	Util.getJson('/api/rooms/' + userId + '/' + authToken + '/', function(err, data){
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