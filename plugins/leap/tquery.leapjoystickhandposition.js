tQuery.registerStatic('LeapJoystickHandPosition', function(opts){
	// handle arguments polymorphism
//	if( opts instanceof tQuery.LeapController )	opts	= { controller: opts };
	// handle arguments default value
	opts	= tQuery.extend(opts, {
		world	: tQuery.world
	});
	// handle arguments sanity check
//	console.assert( opts.contoller instanceof tQuery.LeapController, "opts.controller MUST be specified" )

	// your code goes here
	var world	= opts.world;
	var controller	= opts.controller;

	this._object3d	= tQuery.createSphere().addTo(world)
	var handId	= null;
	var callback	= world.hook(function(delta, now){
		var frame	= controller.lastFrame();
		if( frame === null )		return;
		if( frame.valid !== true )	return;
		if( frame.hands.length < 1)	return;
		// try to find the last hand
		for(var i = 0; i < frame.hands.length; i++){
			if( frame.hands[i].id === handId ){
				hand	= frame.hands[i];
				break;
			}
		}
		// if previous hand has not been found, pick the first one
		if( i === frame.hands.length ){
			hand	= frame.hands[0]
			handId	= hand.id
			console.log('assigning handid', handId)
		}
		// 
		var position	= controller.convertPosition(hand.sphereCenter)
		this._object3d.position(position)
		
		this._deltaX	= position.x
		this._deltaY	= position.z
	}.bind(this))
	this.addEventListener('destroy', function(){ world.unhook(callback)	})
});

// make it eventable
tQuery.MicroeventMixin(tQuery.LeapJoystickHandPosition.prototype)

/**
 * explicit destructor
 */
tQuery.LeapJoystickHandPosition.prototype.destroy	= function(){
	this.dispatchEvent('destoy')
};

tQuery.registerStatic('createLeapJoystickHandPosition', function(opts){
	return new tQuery.LeapJoystickHandPosition(opts)
});

//////////////////////////////////////////////////////////////////////////////////
//		comment								//
//////////////////////////////////////////////////////////////////////////////////

tQuery.LeapJoystickHandPosition.prototype.deltaX	= function(){
	return this._deltaX;
};

tQuery.LeapJoystickHandPosition.prototype.deltaY	= function(){
	return this._deltaY;
};

tQuery.LeapJoystickHandPosition.prototype.up	= function(){
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaY >= 0 )				return false;
	if( Math.abs(deltaX) > 2*Math.abs(deltaY) )	return false;
	return true;
}
tQuery.LeapJoystickHandPosition.prototype.down	= function(){
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaY <= 0 )				return false;
	if( Math.abs(deltaX) > 2*Math.abs(deltaY) )	return false;
	return true;	
}
tQuery.LeapJoystickHandPosition.prototype.right	= function(){
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaX <= 0 )				return false;
	if( Math.abs(deltaY) > 2*Math.abs(deltaX) )	return false;
	return true;	
}
tQuery.LeapJoystickHandPosition.prototype.left	= function(){
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaX >= 0 )				return false;
	if( Math.abs(deltaY) > 2*Math.abs(deltaX) )	return false;
	return true;	
}
