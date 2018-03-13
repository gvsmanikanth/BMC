(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [];


// symbols:
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.guageneedle = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#FF9601","#CC3300","#666666"],[0.004,0.463,1],-39,0,39.1,0).s().p("AlSFTQg9g5AMhZQAJhTBOgvIJ2m/QAagOAYATQATAYgOAaInCJ5QgqBLhVAJIgXADQhHAAg0g0gAkZBgQg+AkgHBCQgLBCAxAxQAyAyBBgMQBCgHAkg+IHBp5g");
	this.shape.setTransform(17.6,-16.8,0.945,0.945,0,0,0,-22.7,23.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.guageneedle, new cjs.Rectangle(2.2,-76,73.8,73.9), null);


(lib.CompoundPath = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AwmZrQjqAAjWhbQjPhYififQigighYjPQhbjWAAjqQABlwDUkqQDTkqFch6QAfjdBrjCQBoi+CkiOQCjiODKhNQDRhQDgAAQGRAAFEDyQFDDwB0GBQAtgDAjAAQD2AADgBgQDaBcCoCnQCnCoBcDZQBfDgAAD2QAAD2hfDhQhcDZinCoQioCnjaBcQjgBgj2AAg");
	this.shape.setTransform(284.1,184.1,1.186,1.186);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = getMCSymbolPrototype(lib.CompoundPath, new cjs.Rectangle(21.4,-10.7,525.3,389.5), null);


(lib.guageanimation = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{Loopstart:53,stop:89});

	// timeline functions:
	this.frame_89 = function() {
		var _this = this;
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('Loopstart');
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(89).call(this.frame_89).wait(1));

	// Layer_1
	this.guageneedle = new lib.guageneedle();
	this.guageneedle.name = "guageneedle";
	this.guageneedle.parent = this;
	this.guageneedle.setTransform(-3.9,3.8,1,1,180,0,0,17.2,-16);

	this.timeline.addTween(cjs.Tween.get(this.guageneedle).to({regX:17.1,rotation:345,x:-3.8,y:3.7},21).to({rotation:435,x:-3.7},32).to({regY:-15.9,rotation:375,y:3.8},18).to({regY:-16,rotation:435,y:3.7},18).wait(1));

	// Layer_4
	this.shape = new cjs.Shape();
	this.shape.graphics.f().ls(["#FF9601","#CC3300","#666666"],[0.004,0.463,1],0,26.6,0,-26.5).ss(3,1,1).p("AhCkrQAAgFADgEQAEgDAFAAIBtAAQAFAAADADQAEAEAAAFIAAJjIiFAAg");
	this.shape.setTransform(17.9,67.1,0.824,0.824);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().ls(["#FF9601","#CC3300","#666666"],[0.004,0.463,1],0,29.4,0,-29.3).ss(3,1,1).p("AhCjsQAAgFAEgEQAEgEAFAAIBsAAQAFAAADAEQAEAEAAAFIAAHmIiFAAg");
	this.shape_1.setTransform(-2.9,72.1,0.824,0.824,0,0,0,0,-0.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().ls(["#FF9601","#CC3300","#666666"],[0.004,0.463,1],0,13.1,0,-13.1).ss(3,1,1).p("Ag1iwIBrAAQAGAAADADQAEAEAAAFIAAFWIiFAAIAAlWQAAgFAEgEQAEgDAFAAg");
	this.shape_2.setTransform(-23.9,78.4,0.824,0.824);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().ls(["#FF9601","#CC3300","#666666"],[0.004,0.463,1],0.1,-112.6,0.1,112.8).ss(6,1,1).p("AAARMQnHAAlClCQlClCAAnIQAAnHFClCQFClCHHAAQHIAAFCFCQFCFCAAHHQAAHIlCFCQlCFCnIAAg");

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#666666").ss(2.4,1,1).p("AoYK7QgSgQgRgRQjtjtAAlPQAAlODtjtQDtjtFOAAQFPAADtDtQDtDtAAFOQAAFPjtDtQgaAZgbAY");
	this.shape_4.setTransform(-0.9,-8.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(90));

	// Layer_2
	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("rgba(204,204,204,0.749)").s().p("AsJMKQlClCAAnIQAAnHFClCQFClCHHAAQHIAAFCFCQFCFCAAHHQAAHIlCFCQlCFCnIAAQnHAAlClCg");
	this.shape_5.setTransform(0,7.5,1,1,0,0,0,0,7.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_5).wait(90));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-113,-113,226,226);


(lib.Cloud_Container = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_44 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(44).call(this.frame_44).wait(1));

	// guage
	this.instance = new lib.guageanimation();
	this.instance.parent = this;
	this.instance.setTransform(-631.7,22.3,1.332,1.332,0,0,0,30.6,31.7);
	this.instance.alpha = 0.328;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(20).to({alpha:1},24).wait(1));

	// cloud
	this.instance_1 = new lib.CompoundPath();
	this.instance_1.parent = this;
	this.instance_1.setTransform(-717,-70.1,1.099,1.099,0,0,0,221.5,164.2);
	this.instance_1.alpha = 0.84;
	this.instance_1.shadow = new cjs.Shadow("rgba(153,153,153,1)",0,0,55);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(45));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-994.8,-320.2,697,547);


// stage content:
(lib.cloud_guage_animation_3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{Loop:100});

	// timeline functions:
	this.frame_149 = function() {
		var _this = this;
		/*
		Moves the playhead to the specified frame label in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay('Loop');
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(149).call(this.frame_149).wait(1));

	// Layer_4
	this.instance = new lib.Cloud_Container();
	this.instance.parent = this;
	this.instance.setTransform(610.6,313.6,0.52,0.52,0,0,0,0.6,0.7);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(49).to({_off:false},0).to({regX:0.7,regY:0.8,x:608.1,y:282.3,alpha:0.82},41).to({regX:0.6,regY:0.7,y:284.1,alpha:1},9).wait(1).to({y:278.1},31).to({y:284.1},18).wait(1));

	// Layer 3
	this.instance_1 = new lib.Cloud_Container();
	this.instance_1.parent = this;
	this.instance_1.setTransform(495.2,255.1,0.5,0.5,0,0,0,0.4,0.6);
	this.instance_1.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regX:0.6,regY:0.7,x:495.3,y:208.4,alpha:0.512},25).to({x:495.2,y:171.1,alpha:0.922},20).to({regX:0.4,regY:0.5,y:163.6,alpha:1},4).wait(51).to({y:156.1},18).to({y:163.6},31).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(193.6,275.6,409,334);
// library properties:
lib.properties = {
	id: '2A024DB680040D42B3E5B31FCF4A993A',
	width: 450,
	height: 420,
	fps: 24,
	color: "#FFFFFF",
	opacity: 0.00,
	manifest: [],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['2A024DB680040D42B3E5B31FCF4A993A'] = {
	getStage: function() { return exportRoot.getStage(); },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}



})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;