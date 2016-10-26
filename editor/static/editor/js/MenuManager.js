var MenuManager = function () {
	console.log('instantiating a MenuManager');
		
	this.blocker = document.getElementById( 'blocker' );
	this.mainMenu = document.getElementById( 'mainmenu' );
	this.furnitureMenu = document.getElementById( 'furnituremenu' );
	this.helpMenu = document.getElementById( 'helpmenu' );
	this.currentMenu = this.mainMenu;
	this.prevMenu = this.helpMenu;
	this.playButton = document.getElementById( 'playButton' );
	
	console.log(this.currentMenu);
	console.log(this.prevMenu);
	
	this.furnitureMenu.style.display = 'none';

	this.havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

	if ( this.havePointerLock ) {

		var element = document.body;
		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

				controlsEnabled = true;
				controls.enabled = true;

				blocker.style.display = 'none';

			} else {
				
				controlsEnabled = false;
				controls.enabled = false;

				blocker.style.display = 'block';
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

		document.getElementById("playButton").addEventListener( 'click', function ( event ) {
			
			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

			if ( /Firefox/i.test( navigator.userAgent ) ) {

				var fullscreenchange = function ( event ) {

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

		}, false );

	} else {

		this.playButton.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

	}	
};

MenuManager.prototype.switchMenu = function ( newMenu ){
	console.log(this);
	console.log(this.currentMenu);
	this.currentMenu.style.display = 'none';
	this.prevMenu = this.currentMenu;
	this.currentMenu = this[newMenu];
	this.currentMenu.style.display = 'block';
};

MenuManager.prototype.hideAll = function () {
	this.mainMenu.style.display = 'none';
	this.furnitureMenu.style.display = 'none';
	this.helpMenu.style.display = 'none';
}
