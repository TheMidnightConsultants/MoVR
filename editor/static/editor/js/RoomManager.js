function RoomManager(roomList, addBtn, dupBtn, delBtn, userId, authToken, scene, menuManager){
  console.log('initializing simple RoomManager');
  this.roomList = document.getElementById(roomList);
  this.roomNames = [];
  this.scene = scene;
  this.menuManager = menuManager;
  this.loadedRoom = -1;
  
  this.deleting = false;
  this.duplicating = false;
  
  if (typeof addBtn !== 'undefined' && typeof dupBtn !== 'undefined' && typeof delBtn !== 'undefined' && typeof userId !== 'undefined' && typeof authToken !== 'undefined'){
    console.log('initializing complicated RoomManager');
    this.addBtn = document.getElementById(addBtn);
    this.dupBtn = document.getElementById(dupBtn);
    this.delBtn = document.getElementById(delBtn);
    this.userId = userId;
    this.authToken = authToken;
    
    this.roomList.addEventListener('click', RoomManager.prototype.onRoomClick.bind(this), true);
    
    this.addBtn.addEventListener('click', function(event){
      var fields = new Array(
        {'tag':'name', 'type':'text'},
        {'tag':'width', 'type':'number'}, 
        {'tag':'length', 'type':'number'},
        {'tag':'height', 'type':'number'},
        {'tag':'wallColor', 'type':'text'});
      this.menuManager.getInput(fields, function(data){
        console.log(data);
        var name = data[0];
        var width = data[1];
        var length = data[2];
        var height = data[3];
        var wallColor = data[4];
        this.addRoom(name, [width, length, height], wallColor);
        this.menuManager.switchMenu('mainMenu');
      }.bind(this));
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
  Util.POST('/api/rooms/', {'auth_token':this.authToken}, function(err, data){
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

RoomManager.prototype.addRoom = function(roomName, dims, wallColor){
  Util.POST('/api/addroom/', {'auth_token':this.authToken, 'room_name':roomName, 'dims':dims, 'wallColor':wallColor}, function(err, data){
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
  Util.POST('/api/deleteroom/', {'auth_token':this.authToken, 'room_id':roomId}, function(err, data){
    if (err != null){
      console.log('Error ' + err + ' while POST-ing room deletion.');
    } else {
      this.update();
    }
  }.bind(this));
}

RoomManager.prototype.loadRoom = function(roomId){
  Util.POST('/api/loadroom/', {'auth_token':this.authToken, 'room_id':roomId}, function(err, data) {
    this.scene.clearRooms();
    var room = new Room(data.dimensions.x, data.dimensions.y, data.dimensions.z, parseInt(data.wallColor, 16), data.name);
    this.scene.addRoom(room);
    console.log(data);
    data.furniture = data.furniture.split("u'").join("'")
    data.furniture = data.furniture.split("'").join("\"")
    if (data.furniture == ""){
      data.furniture = "{}";
    }
    var furniture = JSON.parse(data.furniture)
    console.log("FURNITURE OBJECT:")
    console.log(furniture)
    for (i = 0; i < furniture.length; i++) {
      console.log("Element:")
      console.log(furniture[i]);
      var piece = new Furniture(furniture[i].modelId, furniture[i].color);
      if (piece.loaded){
        console.log("Piece already loaded");
        piece.setPermanentColor(furniture[i].color);
        piece.setRotation(furniture[i].rotation.x, furniture[i].rotation.y, furniture[i].rotation.z);
        piece.setScale(furniture[i].scale.x, furniture[i].scale.y, furniture[i].scale.z);
        piece.setPosition(furniture[i].pos.x, furniture[i].pos.y, furniture[i].pos.z);
        piece.setDimensions(furniture[i].dimensions.x, furniture[i].dimensions.y, furniture[i].dimensions.z);
        this.scene.room.addFurniture(piece);
      } else {
        var room = this.scene.room;
        var properties = furniture[i];
        console.log(properties);
        piece.onLoad = this.createFurnitureCallback(properties, room);
      }
    }
  }.bind(this));
}

RoomManager.prototype.duplicateRoom = function(roomId){
  //load the room we want to duplicate, but don't instantiate it
  Util.POST('/api/loadroom/', {'auth_token':this.authToken, 'room_id':roomId}, function(err, data) {
    this.scene.clearRooms();
    console.log(data);
    data.furniture = data.furniture.split("u'").join("'")
    data.furniture = data.furniture.split("'").join("\"")
    if (data.furniture == ""){
      data.furniture = "{}";
    }
    var roomData = data;
    var dims = [data.dimensions.x, data.dimensions.y, data.dimensions.z];
    this.menuManager.getInput([{'tag':'New Name', 'type':'text'}], function(inputData){
      roomData.roomName = inputData[0];
      this.menuManager.switchMenu('mainMenu');
      this.duplicateRoomHelper(roomData);
    }.bind(this));
  }.bind(this));
  this.duplicating = false;
}

RoomManager.prototype.duplicateRoomHelper = function(roomData){
  //add the new room to the database
  var dims = [roomData.dimensions.x, roomData.dimensions.y, roomData.dimensions.z];
  Util.POST('/api/addroom/', {'auth_token':this.authToken, 'room_name':roomData.roomName, 'dims':dims, 'wallColor':roomData.wallColor}, function(err, data){
    if (err != null){
      console.log('Error ' + err + ' while POST-ing new room.');
    } else if (data.status === 'ok'){
      this.update();
  //then update the new room's contents to match roomData
      Util.POST('/api/saveroom/', roomData, function(err, data) {
        if (err != null) {
          console.log("Error " + err + " while saving room.");
        } else if (data.status === 'ok') {
          console.log('Successfully saved room');
        } else {
          console.log(data.status + ':' + data.msg);
        }
      }.bind(this));
    } else {
      console.log(data.status + ':' + data.msg);
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
    this.duplicateRoom(roomId);
  } else {
    //load the room they clicked on and start the app
    if (this.loadedRoom != roomId){
      this.loadRoom(roomId);
    }
    this.menuManager.switchMenu('furnitureMenu');
    this.menuManager.startApp();
  }
  console.log("clicked " + roomId);
}

RoomManager.prototype.createFurnitureCallback = function(properties, room){
  return function(){
    console.log("called onLoad");
    console.log(properties);
    console.log(room);
    this.setPermanentColor(properties.color);
    this.setRotation(properties.rotation.x, properties.rotation.y, properties.rotation.z);
    this.setScale(properties.scale.x, properties.scale.y, properties.scale.z);
    this.setPosition(properties.pos.x, properties.pos.y, properties.pos.z);
    this.setDimensions(properties.dimensions.x, properties.dimensions.y, properties.dimensions.z);
    room.addFurniture(this);
  };
}
