/* MenuManager - owns the menu overlay (blocker) and all the menus which the user might be shown.
  Keeps track of the previously visited menu to enable "go back" functionality.
*/
function MenuManager( scene, inputManager ) {
  console.log('instantiating a MenuManager');
    
  //hard-coded IDs
  this.blocker = document.getElementById( 'blocker' );
  this.crosshair = document.getElementById( 'crosshair' );  
  
  if (this.crosshair){
	this.crosshair.style.display = 'none';
  }
  
  this.inputManager = inputManager;
  
  this.currentMenu = 'none';
  this.prevMenu = 'none';
  this.menus = [];
  this.scene = scene;

  this.havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  if ( this.havePointerLock ) {

    var element = document.body;
    var pointerlockchange = function ( event ) {

      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

        scene.EnableControls();

        blocker.style.display = 'none';
        crosshair.style.display = 'block';
        

      } else {
        
        scene.DisableControls();

        blocker.style.display = 'block';
        crosshair.style.display = 'none';
      }

    };

    var pointerlockerror = function ( event ) {
      //we should probably do something in this case
    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    MenuManager.prototype.startApp = function () {
      
      // Ask the browser to lock the pointer
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

      if ( /Firefox/i.test( navigator.userAgent ) ) {

        var fullscreenchange = function () {

          if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

            document.removeEventListener( 'fullscreenchange', fullscreenchange );
            document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

            element.requestPointerLock();
          }

        };

        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

        element.requestFullscreen();

      } else {

        element.requestPointerLock();

      }

    };

  } 
};

/* Registers and HTML element with the MenuManager
Args:   menuName - id of the HTML element to treat as a show/hide-able menu
*/
MenuManager.prototype.addMenu = function ( menuName ){
  this.menus[menuName] = document.getElementById(menuName);
  if (this.currentMenu == 'none'){
    this.currentMenu = this.menus[menuName];
    this.prevMenu = this.menus[menuName];
  }
};

/* Adds a listener to navigate to the given menu, when given button/element is clicked
Args:   menuName - id of the HTML menu element to navigate to
    buttonName - id of the HTML element which, when clicked, should show the menu menuName
*/
MenuManager.prototype.registerNavBtn = function ( menuName, buttonName ){
  if (typeof this.menus[menuName] !== "undefined"){
    var btn = document.getElementById(buttonName);
    var menumgr = this;
    btn.addEventListener('click', function ( event ){
      menumgr.switchMenu(menuName);
    }, false);
  }
};

/* Navigates to the given menu
Args: newMenu -id of the HTML menu element to navigate to
*/
MenuManager.prototype.switchMenu = function ( newMenu ){
  this.currentMenu.style.display = 'none';
  this.prevMenu = this.currentMenu;
  this.currentMenu = this.menus[newMenu];
  this.currentMenu.style.display = 'block';
};

/* Hides all registered menus
*/
MenuManager.prototype.hideAll = function () {
  Object.keys(this.menus).forEach(function(key){
    this.menus[key].style.display = 'none';
  }, this);
};

MenuManager.prototype.getInput = function(fields, callback){
  for (var i = 0; i < fields.length; i++){
    this.inputManager.addInput(fields[i].tag, fields[i].type);
  }
  this.inputManager.setCallback(callback);
  this.switchMenu('inputMenu');
}
