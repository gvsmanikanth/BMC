(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"Security_device_animation_1_atlas_", frames: [[534,2163,238,238],[774,2197,238,44],[0,721,1080,719],[0,0,1080,719],[0,2681,884,195],[0,1442,1080,719],[774,2243,233,33],[774,2163,412,32],[0,2163,532,516]]}
];


// symbols:



(lib.Bitmap1 = function() {
	this.spriteSheet = ss["Security_device_animation_1_atlas_"];
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.Reflection = function() {
	this.spriteSheet = ss["Security_device_animation_1_atlas_"];
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.security_screen1 = function() {
	this.spriteSheet = ss["Security_device_animation_1_atlas_"];
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.security_screen2 = function() {
	this.spriteSheet = ss["Security_device_animation_1_atlas_"];
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.security_screen2_popout = function() {
	this.spriteSheet = ss["Security_device_animation_1_atlas_"];
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.security_screen3 = function() {
	this.spriteSheet = ss["Security_device_animation_1_atlas_"];
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.Shadow = function() {
	this.spriteSheet = ss["Security_device_animation_1_atlas_"];
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.Shadowcopy_0 = function() {
	this.spriteSheet = ss["Security_device_animation_1_atlas_"];
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.Unit = function() {
	this.spriteSheet = ss["Security_device_animation_1_atlas_"];
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();
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


(lib.Textforscreens = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{text1:0,text2:4,text3:9,notext:15});

	// timeline functions:
	this.frame_3 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}
	this.frame_8 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}
	this.frame_14 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}
	this.frame_15 = function() {
		var _this = this;
		_this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(3).call(this.frame_3).wait(5).call(this.frame_8).wait(6).call(this.frame_14).wait(1).call(this.frame_15).wait(2));

	// text to change
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgdAnQgOgPAAgXQAAgXAOgPQAPgQAUAAQASAAAKALQAKAKAAATQAAAIgCAHIhDAAIAAABQAAAPAKAJQAJAKAOAAQARAAAMgJIAEARQgNAJgVAAQgVAAgPgPgAgPgdQgIAIgBALIAzgBIAAgBQAAgMgGgGQgGgHgLAAQgLAAgIAIg");
	this.shape.setTransform(57.7,16);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AggA0IAAhkIASgDIAAASQAMgSAQAAQAKAAAJAFIgFARQgIgFgIABQgOAAgMAUIAABBg");
	this.shape_1.setTransform(49,15.9);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AAYAlQgPAPgSAAQgPAAgIgJQgJgJAAgRIAAhEIATAAIAAA+QAAANAEAFQAFAGAKAAQAPAAAMgLIAAhLIASAAIAABkIgSADg");
	this.shape_2.setTransform(38.4,16.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AgnAzIAAgQIA5hDIg3AAIAAgRIBNAAIAAAOIg5BFIA5AAIAAARg");
	this.shape_3.setTransform(28.3,16);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AArBFIgNgkIg7AAIgMAkIgUAAIA0iJIAUAAIAzCJgAAYAQIgYhAIgWBAIAuAAg");
	this.shape_4.setTransform(16.9,14.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AgTAYQAVgQAAgLQAAgEgCgDQgDgDgJgFQAAgFAEgEQAEgEAGAAQAHAAAFAGQAGAGAAAJQAAAUgfAWg");
	this.shape_5.setTransform(2.7,21.5);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFFFFF").s().p("AguA7IAGgRQAUANAUAAQAMAAAJgGQAIgHAAgKQAAgKgHgFQgIgFgRgFQgJgCgGgDQgGgCgHgEQgGgFgEgHQgDgHAAgJQAAgSANgKQAMgLAUAAQAYAAATAMIgGAQQgSgLgTAAQgNAAgHAFQgHAGAAAJQAAAKAIAFQAHAFASAFQASAFALAIQALAJAAASQAAASgNALQgOAMgUAAQgaAAgUgNg");
	this.shape_6.setTransform(-5.4,14.2);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AAiBFIgihyIgiByIgSAAIgniJIAUAAIAdBvIAhhvIAUAAIAhBvIAdhvIATAAIgnCJg");
	this.shape_7.setTransform(-20.3,14.2);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("AArBFIgNgkIg7AAIgNAkIgTAAIA0iJIAUAAIAzCJgAAYAQIgXhAIgYBAIAvAAg");
	this.shape_8.setTransform(-35.8,14.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("AggA0IAAhkIASgDIAAASQAMgSAQAAQAKAAAJAFIgFARQgIgFgIABQgOAAgMAUIAABBg");
	this.shape_9.setTransform(-50.7,15.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFFFFF").s().p("AgjAnQgNgOAAgZQAAgXAOgPQAOgPAVAAQAVAAAOAPQANAPAAAXQAAAYgOAPQgOAPgVAAQgVAAgOgPgAgWgaQgIAKAAAQQAAAQAIALQAJALANgBQAPAAAIgKQAJgKgBgRQABgPgJgLQgIgLgPAAQgOAAgIALg");
	this.shape_10.setTransform(-61.2,16);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FFFFFF").s().p("AgRBNIAAhTIgSgCIABgMIARgEIAAgNQABgmAfAAQAKAAALAEIgBAFIgDAIIgBADQgKgDgGAAQgIAAgDAEQgEAGAAAKIAAAPIAgAAIgBAQIgfAAIAABUg");
	this.shape_11.setTransform(-70.3,13.4);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#FFFFFF").s().p("AAYA0IAAg/QAAgMgFgGQgFgEgLgBQgOAAgMAMIAABKIgSAAIAAhkIASgDIAAAPQAQgPAQAAQAQAAAIAJQAJAKAAAPIAABFg");
	this.shape_12.setTransform(46.7,-7.4);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#FFFFFF").s().p("AgjAnQgNgOAAgZQAAgXAOgPQANgPAWAAQAVAAAOAPQANAPAAAXQAAAYgOAPQgOAPgVAAQgVAAgOgPgAgWgaQgIAKAAAQQAAARAJAKQAIAKANAAQAPABAIgLQAJgKAAgRQAAgPgJgLQgIgKgPAAQgOAAgIAKg");
	this.shape_13.setTransform(35.3,-7.2);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#FFFFFF").s().p("AgIBLIAAhlIARgDIAABogAgIg0QgDgDAAgGQAAgFADgEQADgEAFAAQAGAAADAEQADAEAAAFQAAAGgDADQgDAFgGAAQgFAAgDgFg");
	this.shape_14.setTransform(27,-9.6);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#FFFFFF").s().p("AgRAgIABg3IgRgBIABgMIARgFIAAgWIAQAAIAAAXIAfAAIAAARIgfAAIgBA4QAAAOAMAAQAIAAAKgEIAEAQQgMAFgLAAQgdAAABggg");
	this.shape_15.setTransform(20.6,-8.2);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#FFFFFF").s().p("AgiAtQgJgIAAgMQAAghA7gCIAAgDQAAgNgGgFQgFgFgLAAQgPAAgRALIgEgQQARgMAVAAQAUAAAJAKQAJAJAAAUIAAAqQAAAGABACQACABAHAAIgBAQQgWABgFgOIAAAAQgNAOgOAAQgOAAgJgJgAgPAIQgJAFAAAKQAAAGAFAFQAFAEAIAAQAMAAAKgLIAAgbQgVADgKAFg");
	this.shape_16.setTransform(12.3,-7.2);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FFFFFF").s().p("AgRAgIABg3IgRgBIABgMIARgFIAAgWIAQAAIAAAXIAgAAIgBARIggAAIAAA4QgBAOANAAQAIAAAKgEIAEAQQgMAFgLAAQgdAAABggg");
	this.shape_17.setTransform(3.2,-8.2);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FFFFFF").s().p("AgIBLIAAhlIARgDIAABogAgIg0QgDgDAAgGQAAgFADgEQADgEAFAAQAGAAADAEQADAEAAAFQAAAGgDADQgDAFgGAAQgFAAgDgFg");
	this.shape_18.setTransform(-2.8,-9.6);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#FFFFFF").s().p("AghA+QgMgPABgXQAAgXAOgPQAOgPAWAAQALAAAKADIAAgvIASgDIAACWIgSAAIAAgJQgNAMgOAAQgVAAgMgPgAgRgCQgJAJAAAQQAAARAJAKQAHAKANAAQANAAALgJIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAAAIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAgCQgJgHgNAAQgOAAgIALg");
	this.shape_19.setTransform(-11.3,-9.6);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#FFFFFF").s().p("AgdAnQgOgPAAgXQAAgXAOgPQAPgQAUAAQASAAAKALQAKAKAAATQAAAIgCAHIhDAAIAAABQAAAPAKAJQAJAKAOAAQARAAAMgJIAEARQgNAJgVAAQgVAAgPgPgAgPgdQgIAIgBALIAzgBIAAgBQAAgMgGgGQgGgHgLAAQgLAAgIAIg");
	this.shape_20.setTransform(-22,-7.2);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#FFFFFF").s().p("AA2A0IAAg+QAAgNgFgGQgEgFgKAAQgOAAgMAMIAAAFIAABFIgRAAIAAg+QAAgNgEgGQgGgFgJAAQgPAAgLALIAABLIgSAAIAAhkIASgDIAAAOQAOgOATAAQATAAAGAQQAQgQAVAAQAOAAAIAKQAIAIAAARIAABEg");
	this.shape_21.setTransform(-35.9,-7.4);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#FFFFFF").s().p("AgdAnQgOgPAAgXQAAgXAOgPQAOgQAVAAQASAAAKALQAKAKAAATQAAAIgCAHIhCAAIAAABQAAAPAJAJQAJAKANAAQATAAAMgJIADARQgOAJgUAAQgWAAgOgPgAgPgdQgHAIgCALIAzgBIAAgBQAAgMgGgGQgFgHgMAAQgLAAgIAIg");
	this.shape_22.setTransform(-49.9,-7.2);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#FFFFFF").s().p("AggA0IAAhkIASgDIAAARQAMgRAQAAQAKAAAJAFIgFARQgIgFgIAAQgOAAgMAWIAABAg");
	this.shape_23.setTransform(-58.6,-7.4);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#FFFFFF").s().p("AgzBHIAFgQQAKAEAGAAQAGAAAFgEQAEgFAFgMIAGgQIgnhiIAUAAIAcBOIAchOIATAAIgoBlIgHASQgGATgIAHQgJAIgMAAQgJAAgMgGg");
	this.shape_24.setTransform(26,-27.9);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#FFFFFF").s().p("AgRAgIABg3IgRgBIABgMIARgFIAAgWIAQAAIAAAXIAgAAIgBARIggAAIAAA4QgBAOANAAQAIAAAKgEIAEAQQgMAFgLAAQgdAAABggg");
	this.shape_25.setTransform(17.6,-31.5);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#FFFFFF").s().p("AgIBKIAAhkIARgCIAABmgAgIg0QgDgDAAgGQAAgFADgEQADgDAFAAQAGAAADADQADAEAAAFQAAAGgDADQgDAEgGABQgFgBgDgEg");
	this.shape_26.setTransform(11.6,-32.9);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#FFFFFF").s().p("AggA0IAAhkIASgDIAAARQAMgRAQAAQAKAAAJAFIgFARQgIgEgIgBQgOABgMAUIAABBg");
	this.shape_27.setTransform(5.6,-30.6);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#FFFFFF").s().p("AAYAlQgPAPgSAAQgPAAgIgJQgJgJAAgRIAAhEIATAAIAAA+QAAANAEAFQAFAGAKAAQAPAAAMgLIAAhLIASAAIAABkIgSADg");
	this.shape_28.setTransform(-5,-30.3);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#FFFFFF").s().p("AgcAnQgNgPAAgYQAAgXAPgPQAOgPAVAAQATAAAOAJIgFAQQgMgIgQAAQgOAAgJAKQgIAJAAARQAAARAJAKQAIAKAOAAQAQAAANgJIADARQgOAJgTAAQgXAAgNgPg");
	this.shape_29.setTransform(-15.6,-30.5);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#FFFFFF").s().p("AgdAnQgOgPAAgXQAAgXAOgPQAOgQAVAAQASAAAKALQAKAKAAATQAAAIgCAHIhCAAIAAABQAAAPAJAJQAJAKAOAAQARAAANgJIADARQgNAJgVAAQgWAAgOgPgAgPgdQgHAIgCALIAzgBIAAgBQAAgMgGgGQgFgHgMAAQgLAAgIAIg");
	this.shape_30.setTransform(-25.9,-30.5);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#FFFFFF").s().p("AguA7IAGgRQAUANAUAAQAMAAAJgGQAIgHAAgKQAAgKgHgFQgIgFgRgFQgJgCgGgDQgGgCgHgEQgGgFgEgHQgDgHAAgJQAAgSANgKQAMgLAUAAQAYAAATAMIgGAQQgSgLgTAAQgNAAgHAFQgHAGAAAJQAAAKAIAFQAHAFASAFQASAFALAIQALAJAAASQAAASgNALQgOAMgUAAQgaAAgUgNg");
	this.shape_31.setTransform(-36.9,-32.3);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#FFFFFF").s().p("AgiAsIAEgMQAOAJAQAAQAIAAAHgFQAGgEAAgIQAAgEgCgDIgCgEIgHgEIgGgCIgHgDQgNgEgIgFQgIgGAAgMQAAgOAJgIQAKgHAOAAQAQAAAPAHIgFAMQgNgHgOAAQgIAAgGAEQgFAEAAAHQAAAEACACIACAFIAGADIAHADIAHACQANAEAJAGQAIAGAAANQAAANgLAJQgLAIgNAAQgUAAgOgJg");
	this.shape_32.setTransform(33.8,22.1);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#FFFFFF").s().p("AAaA0IAAhAQABgOgGgGQgFgGgMAAQgPAAgPAOIAABMIgNAAIAAhkIANgDIAAARQARgRARAAQAPAAAJAJQAIAJAAARIAABEg");
	this.shape_33.setTransform(24.1,21.9);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#FFFFFF").s().p("AgiAnQgOgPAAgYQAAgXAOgOQAOgPAVAAQAVAAAOAOQANAPAAAXQAAAXgOAPQgOAPgVAAQgVAAgNgOgAgZgdQgJAMAAARQAAASAJALQAKAMAPAAQAQAAAKgMQAKgLAAgSQAAgRgKgMQgKgLgQAAQgPAAgKALg");
	this.shape_34.setTransform(12.6,22.1);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#FFFFFF").s().p("AgGBIIAAhkIANgDIAABngAgGg2QgCgDAAgEQAAgEACgDQADgDADAAQAFAAACADQACADAAAEQAAAEgCADQgCADgFAAQgDAAgDgDg");
	this.shape_35.setTransform(4.5,19.9);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#FFFFFF").s().p("AgRAgIACg7IgQgBIABgIIAPgEIABgXIANAAIgBAYIAhAAIgBAMIggAAIgCA7QAAATAOAAQAIAAALgFIADAMQgLAGgMAAQgbAAABggg");
	this.shape_36.setTransform(-1.6,21.1);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#FFFFFF").s().p("AggAtQgJgIAAgMQAAgfA8gEIAAgGQAAgYgXAAQgIAAgJAEQgJADgHAGIgDgNQAHgFAKgEQALgDAJAAQAkAAgBAkIAAAvQAAAGACACQACACAGAAIAAALQgUACgCgQIgBAAQgMAPgRAAQgNAAgJgIgAgQAHQgLAGAAALQAAAIAGAEQAFAFAJAAQAOAAAMgNIAAgcQgZABgKAGg");
	this.shape_37.setTransform(-9.7,22.1);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#FFFFFF").s().p("AgGBLIAAiSIANgEIAACWg");
	this.shape_38.setTransform(-17,19.6);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#FFFFFF").s().p("AgiAnQgOgPAAgYQAAgXAOgOQAOgPAVAAQAVAAAOAOQANAPAAAXQAAAXgOAPQgOAPgVAAQgVAAgNgOgAgZgdQgJAMAAARQAAASAJALQAKAMAPAAQAQAAAKgMQAKgLAAgSQAAgRgKgMQgKgLgQAAQgPAAgKALg");
	this.shape_39.setTransform(-25.1,22.1);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#FFFFFF").s().p("AgGBIIAAhkIANgDIAABngAgGg2QgCgDAAgEQAAgEACgDQADgDADAAQAFAAACADQACADAAAEQAAAEgCADQgCADgFAAQgDAAgDgDg");
	this.shape_40.setTransform(-33.3,19.9);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.f("#FFFFFF").s().p("AgFAyIgohjIAPAAIAfBSIAfhSIAOAAIgoBjg");
	this.shape_41.setTransform(-40.2,22.1);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.f("#FFFFFF").s().p("AgbAmQgOgOAAgXQAAgXAOgPQANgPATAAQARAAAKAKQAKAKAAARQAAAJgCAGIhDAAIAAABQAAASAKAKQAJALAPAAQARAAAMgIIADANQgOAIgSAAQgVAAgNgPgAgQgfQgIAIgCAOIA3gBIAAgEQAAgMgGgHQgHgHgLAAQgMAAgJAJg");
	this.shape_42.setTransform(41.5,-0.9);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.f("#FFFFFF").s().p("AglAzIAAgLIA7hNIg5AAIAAgNIBJAAIAAAMIg7BMIA7AAIAAANg");
	this.shape_43.setTransform(32.1,-0.9);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.f("#FFFFFF").s().p("AgxBIIAEgNQAJAFAHAAQAGAAAFgFQAEgFAFgNIAHgSIgnhjIAPAAIAeBTIAfhTIAPAAIgnBjIgJAWQgFASgIAHQgHAHgLAAQgJAAgLgFg");
	this.shape_44.setTransform(22.8,1.7);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.f("#FFFFFF").s().p("AgGBMIAAiUIANgCIAACWg");
	this.shape_45.setTransform(16.2,-3.4);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.f("#FFFFFF").s().p("AggAtQgJgIAAgMQAAgfA8gEIAAgGQAAgYgXAAQgIAAgJAEQgJADgHAGIgDgNQAHgFAKgEQALgDAJAAQAkAAgBAkIAAAvQAAAGACACQACACAGAAIAAALQgUACgCgQIgBAAQgMAPgRAAQgNAAgJgIgAgQAHQgLAGAAALQAAAIAGAEQAFAFAJAAQAOAAAMgNIAAgcQgZABgKAGg");
	this.shape_46.setTransform(9.3,-0.9);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.f("#FFFFFF").s().p("AAaA0IAAhAQAAgOgFgGQgFgGgMAAQgPAAgPAOIAABMIgNAAIAAhkIANgDIAAARQARgRARAAQAPAAAJAJQAIAJAAARIAABEg");
	this.shape_47.setTransform(-1.2,-1.1);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.f("#FFFFFF").s().p("AggAtQgJgIAAgMQAAgfA8gEIAAgGQAAgYgXAAQgIAAgJAEQgJADgHAGIgDgNQAHgFAKgEQALgDAJAAQAkAAgBAkIAAAvQAAAGACACQACACAGAAIAAALQgUACgCgQIgBAAQgMAPgRAAQgNAAgJgIgAgQAHQgLAGAAALQAAAIAGAEQAFAFAJAAQAOAAAMgNIAAgcQgZABgKAGg");
	this.shape_48.setTransform(-11.5,-0.9);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.f("#FFFFFF").s().p("AgfA+QgMgPAAgWQAAgYAOgOQAOgPAVAAQANAAAMAFIAAgyIANgDIAACWIgNAAIAAgKQgNANgQAAQgUAAgNgPgAgTgEQgKAKAAATQABARAIALQAKALAOAAQAPAAAMgLIAAAAIAAgBIAAAAIAAgBIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAAAIAAgBIAAAAIAAAAIAAAAIAAgBIAAAAIAAgBIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgCQgLgHgPgBQgPAAgJAMg");
	this.shape_49.setTransform(-27.4,-3.3);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.f("#FFFFFF").s().p("AAaA0IAAhAQABgOgGgGQgFgGgMAAQgPAAgOAOIAABMIgOAAIAAhkIAOgDIAAARQAQgRARAAQAPAAAIAJQAJAJAAARIAABEg");
	this.shape_50.setTransform(-38.2,-1.1);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.f("#FFFFFF").s().p("AggAtQgJgIAAgMQAAgfA8gEIAAgGQAAgYgXAAQgIAAgJAEQgJADgHAGIgDgNQAHgFAKgEQALgDAJAAQAkAAgBAkIAAAvQAAAGACACQACACAGAAIAAALQgUACgCgQIgBAAQgMAPgRAAQgNAAgJgIgAgQAHQgLAGAAALQAAAIAGAEQAFAFAJAAQAOAAAMgNIAAgcQgZABgKAGg");
	this.shape_51.setTransform(-48.5,-0.9);

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.f("#FFFFFF").s().p("AgPAWQASgOAAgLQAAgEgDgDQgDgDgHgDQABgEADgDQADgEAEAAQAGAAAFAFQAFAFgBAIQAAATgaASg");
	this.shape_52.setTransform(42.2,-18.2);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.f("#FFFFFF").s().p("AgeA0IAAhkIAOgDIAAAWQALgWASAAQAJAAAJAFIgEAMQgIgEgHAAQgRAAgLAaIAABAg");
	this.shape_53.setTransform(37.7,-24.1);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.f("#FFFFFF").s().p("AgbAmQgOgOAAgXQAAgXAOgPQANgPATAAQARAAAKAKQAKAKAAARQAAAJgCAGIhDAAIAAABQAAASAKAKQAJALAPAAQARAAAMgIIADANQgOAIgSAAQgVAAgNgPgAgQgfQgIAIgCAOIA3gBIAAgEQAAgMgGgHQgHgHgLAAQgMAAgJAJg");
	this.shape_54.setTransform(27.8,-23.9);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.f("#FFFFFF").s().p("AgRAgIACg7IgQgBIABgIIAPgEIABgXIANAAIgBAYIAhAAIgBAMIggAAIgCA7QAAATAOAAQAIAAALgFIADAMQgLAGgMAAQgbAAABggg");
	this.shape_55.setTransform(19,-24.9);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.f("#FFFFFF").s().p("AgGBLIAAiSIANgEIAACWg");
	this.shape_56.setTransform(13.3,-26.4);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.f("#FFFFFF").s().p("AgGBIIAAhkIANgDIAABngAgGg2QgCgDAAgEQAAgEACgDQADgDADAAQAFAAACADQACADAAAEQAAAEgCADQgCADgFAAQgDAAgDgDg");
	this.shape_57.setTransform(8.7,-26.1);

	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.f("#FFFFFF").s().p("AgPBMIAAhXIgRgBIABgIIAQgDIAAgRQABgkAcAAQAJABAJAEIAAADIgCAGIgBADQgJgEgGAAQgQAAAAAXIAAARIAfAAIgBAMIgeAAIAABXg");
	this.shape_58.setTransform(3.4,-26.5);

	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.f("#FFFFFF").s().p("AgQAWQATgOAAgLQAAgEgDgDQgDgDgHgDQABgEADgDQADgEAEAAQAGAAAFAFQAEAFABAIQAAATgaASg");
	this.shape_59.setTransform(-8,-18.2);

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.f("#FFFFFF").s().p("AAcAzIgchRIgaBRIgMAAIgfhlIAPAAIAXBQIAahPIALAAIAcBPIAVhQIAPAAIgeBlg");
	this.shape_60.setTransform(-17.2,-23.9);

	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.f("#FFFFFF").s().p("AgbAmQgOgOAAgXQAAgXAOgPQANgPATAAQARAAAKAKQAKAKAAARQAAAJgCAGIhDAAIAAABQAAASAKAKQAJALAPAAQARAAAMgIIADANQgOAIgSAAQgVAAgNgPgAgQgfQgIAIgCAOIA3gBIAAgEQAAgMgGgHQgHgHgLAAQgMAAgJAJg");
	this.shape_61.setTransform(-30,-23.9);

	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.f("#FFFFFF").s().p("AgGBIIAAhkIANgDIAABngAgGg2QgCgDAAgEQAAgEACgDQADgDADAAQAFAAACADQACADAAAEQAAAEgCADQgCADgFAAQgDAAgDgDg");
	this.shape_62.setTransform(-37.4,-26.1);

	this.shape_63 = new cjs.Shape();
	this.shape_63.graphics.f("#FFFFFF").s().p("AgHBFIgziJIAPAAIArB6IAth6IAOAAIgzCJg");
	this.shape_63.setTransform(-45.8,-25.8);

	this.shape_64 = new cjs.Shape();
	this.shape_64.graphics.f("#FFFFFF").s().p("AgkAsIAFgQQAOAJARAAQAHAAAHgEQAFgDAAgHQAAgEgCgCQgCgDgEgCIgHgDIgIgDQgNgDgJgGQgHgHgBgMQABgOAJgIQALgJAOAAQASAAAPAIIgFAQQgOgHgPAAQgGAAgFADQgGADAAAGQAAAHAHADQAFADALADQANAEAJAGQAIAHAAANQAAAOgKAJQgLAJgQAAQgTAAgQgKg");
	this.shape_64.setTransform(42.5,17.7);

	this.shape_65 = new cjs.Shape();
	this.shape_65.graphics.f("#FFFFFF").s().p("AgIBKIAAhkIARgCIAABmgAgIg0QgDgDAAgGQAAgFADgEQADgDAFAAQAGAAADADQADAEAAAFQAAAGgDADQgDAEgGABQgFgBgDgEg");
	this.shape_65.setTransform(10.1,15.3);

	this.shape_66 = new cjs.Shape();
	this.shape_66.graphics.f("#FFFFFF").s().p("AgIBLIAAiSIARgEIAACWg");
	this.shape_66.setTransform(5.1,15.2);

	this.shape_67 = new cjs.Shape();
	this.shape_67.graphics.f("#FFFFFF").s().p("AgjAnQgNgPAAgYQAAgXAOgPQAOgPAVAAQAVAAAOAPQANAOAAAYQAAAYgOAPQgOAPgVAAQgVAAgOgPgAgWgaQgIAKAAAQQAAAQAJALQAIALANAAQAPgBAIgJQAJgLAAgQQAAgQgJgLQgJgLgOAAQgOAAgIALg");
	this.shape_67.setTransform(-3.1,17.7);

	this.shape_68 = new cjs.Shape();
	this.shape_68.graphics.f("#FFFFFF").s().p("AgsBOIAAiYIASgCIAAAMQANgMAOAAQAUAAAMAOQANAPAAAYQAAAXgPAPQgOAPgWAAQgMAAgJgDIAAAzgAgagyIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAAAIAAABIAAAAIAAABIAAAAIAAAAIAAAAIAAABIAAAAIAAABIAAABIAAAAIAAABIAAAAIAAABIAAABQAIAIAOAAQAOAAAJgLQAIgKAAgQQAAgRgIgJQgIgLgNAAQgNAAgLAKg");
	this.shape_68.setTransform(-14.3,20.1);

	this.shape_69 = new cjs.Shape();
	this.shape_69.graphics.f("#FFFFFF").s().p("AggA+QgNgPAAgXQAAgXAPgPQAPgPAVAAQALAAALADIAAgvIASgDIAACWIgSAAIAAgJQgOAMgOAAQgUAAgMgPgAgSgCQgIAJAAAQQAAARAIAKQAIAKANAAQANAAAMgJIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAAAIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAAAIAAgBIAAgCQgJgHgOAAQgOAAgJALg");
	this.shape_69.setTransform(76.5,-7.9);

	this.shape_70 = new cjs.Shape();
	this.shape_70.graphics.f("#FFFFFF").s().p("AAYA0IAAg/QAAgMgFgGQgFgEgLAAQgOgBgMALIAABLIgSAAIAAhkIASgDIAAAPQAQgPAQAAQAQAAAIAJQAJAJAAARIAABEg");
	this.shape_70.setTransform(65.4,-5.7);

	this.shape_71 = new cjs.Shape();
	this.shape_71.graphics.f("#FFFFFF").s().p("AgiAtQgJgIAAgMQAAghA7gCIAAgDQAAgNgGgFQgFgFgLAAQgPAAgRALIgEgQQARgMAVAAQAUAAAJAKQAJAJAAAUIAAAqQAAAGABACQACABAHAAIgBAQQgWABgEgOIgBAAQgNAOgOAAQgOAAgJgJgAgPAIQgJAFAAAKQAAAGAFAFQAFAEAIAAQAMAAAKgLIAAgbQgWADgJAFg");
	this.shape_71.setTransform(55,-5.6);

	this.shape_72 = new cjs.Shape();
	this.shape_72.graphics.f("#FFFFFF").s().p("AgjAsIAEgQQAOAJARAAQAIAAAFgEQAGgDAAgHQAAgEgCgCQgCgDgEgCIgHgDIgIgDQgNgDgIgGQgJgHAAgMQAAgOAKgIQALgJAOAAQASAAAPAIIgFAQQgOgHgOAAQgIAAgFADQgEADAAAGQgBAHAHADQAFADALADQAOAEAIAGQAJAHAAANQAAAOgLAJQgLAJgPAAQgVAAgOgKg");
	this.shape_72.setTransform(40.4,-5.6);

	this.shape_73 = new cjs.Shape();
	this.shape_73.graphics.f("#FFFFFF").s().p("AgjAnQgNgOAAgZQAAgXAOgPQANgPAWAAQAVAAAOAPQANAPAAAXQAAAYgOAPQgOAPgVAAQgVAAgOgPgAgWgaQgIAKAAAQQAAAQAJALQAIALANgBQAPAAAIgKQAJgKAAgRQAAgPgJgLQgIgLgPAAQgOAAgIALg");
	this.shape_73.setTransform(21.9,-5.6);

	this.shape_74 = new cjs.Shape();
	this.shape_74.graphics.f("#FFFFFF").s().p("AgcAnQgNgPAAgYQAAgXAPgPQAOgPAVAAQATAAAOAJIgFAQQgMgIgQAAQgOAAgJAKQgIAJAAARQAAARAJAKQAIAKAOAAQAQAAANgJIADARQgOAJgTAAQgXAAgNgPg");
	this.shape_74.setTransform(3.7,-5.6);

	this.shape_75 = new cjs.Shape();
	this.shape_75.graphics.f("#FFFFFF").s().p("AgdAnQgOgPAAgXQAAgXAOgPQAPgQAUAAQASAAAKALQAKAKAAATQAAAIgCAHIhDAAIAAABQAAAPAKAJQAJAKANAAQASAAAMgJIAEARQgNAJgVAAQgVAAgPgPgAgPgdQgIAIgBALIAzgBIAAgBQAAgMgGgGQgFgHgMAAQgLAAgIAIg");
	this.shape_75.setTransform(-6.6,-5.6);

	this.shape_76 = new cjs.Shape();
	this.shape_76.graphics.f("#FFFFFF").s().p("AAYA0IAAg/QAAgMgFgGQgFgEgLAAQgOgBgMALIAABLIgSAAIAAhkIASgDIAAAPQAQgPAQAAQAQAAAIAJQAJAJAAARIAABEg");
	this.shape_76.setTransform(-17.5,-5.7);

	this.shape_77 = new cjs.Shape();
	this.shape_77.graphics.f("#FFFFFF").s().p("AAYA0IAAg/QAAgMgFgGQgFgEgLAAQgOgBgMALIAABLIgSAAIAAhkIASgDIAAAPQAQgPAQAAQAQAAAIAJQAJAJAAARIAABEg");
	this.shape_77.setTransform(-28.9,-5.7);

	this.shape_78 = new cjs.Shape();
	this.shape_78.graphics.f("#FFFFFF").s().p("AgjAnQgNgOAAgZQAAgXAOgPQANgPAWAAQAVAAAOAPQANAPAAAXQAAAYgOAPQgOAPgVAAQgVAAgOgPgAgWgaQgIAKAAAQQAAAQAJALQAIALANgBQAPAAAIgKQAJgKAAgRQAAgPgJgLQgIgLgPAAQgOAAgIALg");
	this.shape_78.setTransform(-40.3,-5.6);

	this.shape_79 = new cjs.Shape();
	this.shape_79.graphics.f("#FFFFFF").s().p("AgcAnQgNgPAAgYQAAgXAPgPQAOgPAVAAQATAAAOAJIgFAQQgMgIgQAAQgOAAgJAKQgIAJAAARQAAARAJAKQAIAKAOAAQAQAAANgJIADARQgOAJgTAAQgXAAgNgPg");
	this.shape_79.setTransform(-51,-5.6);

	this.shape_80 = new cjs.Shape();
	this.shape_80.graphics.f("#FFFFFF").s().p("AgdAnQgOgPAAgXQAAgXAOgPQAPgQAUAAQASAAAKALQAKAKAAATQAAAIgCAHIhDAAIAAABQAAAPAKAJQAJAKAOAAQARAAAMgJIAEARQgNAJgVAAQgVAAgPgPgAgPgdQgIAIgBALIAzgBIAAgBQAAgMgGgGQgFgHgMAAQgLAAgIAIg");
	this.shape_80.setTransform(53.3,-28.8);

	this.shape_81 = new cjs.Shape();
	this.shape_81.graphics.f("#FFFFFF").s().p("AgIBMIAAiUIARgCIAACWg");
	this.shape_81.setTransform(45.5,-31.3);

	this.shape_82 = new cjs.Shape();
	this.shape_82.graphics.f("#FFFFFF").s().p("AgaBKIgSADIAAiWIASgDIAAA7QANgMAOAAQAVAAAMAPQALAOABAXQgBAXgOAQQgOAPgWAAQgLAAgKgDgAgagDIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAAAIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAAAIAAABIAAACQAIAHAOAAQAOAAAJgLQAIgLAAgQQAAgQgIgJQgIgLgNAAQgNAAgLAKg");
	this.shape_82.setTransform(37.7,-31.2);

	this.shape_83 = new cjs.Shape();
	this.shape_83.graphics.f("#FFFFFF").s().p("AgjAsIAEgQQAOAJARAAQAIAAAFgEQAGgDAAgHQAAgEgCgCQgCgDgDgCIgIgDIgIgDQgNgDgIgGQgJgHABgMQgBgOALgIQAKgJAPAAQARAAAPAIIgEAQQgOgHgPAAQgHAAgGADQgEADAAAGQAAAHAFADQAHADAKADQAOAEAIAGQAJAHAAANQAAAOgLAJQgKAJgRAAQgTAAgPgKg");
	this.shape_83.setTransform(22.2,-28.8);

	this.shape_84 = new cjs.Shape();
	this.shape_84.graphics.f("#FFFFFF").s().p("AgdAnQgOgPAAgXQAAgXAOgPQAOgQAVAAQASAAAKALQAKAKAAATQAAAIgCAHIhDAAIAAABQAAAPAKAJQAJAKAOAAQARAAAMgJIAEARQgNAJgVAAQgWAAgOgPgAgPgdQgHAIgCALIAzgBIAAgBQAAgMgGgGQgGgHgLAAQgLAAgIAIg");
	this.shape_84.setTransform(1.2,-28.8);

	this.shape_85 = new cjs.Shape();
	this.shape_85.graphics.f("#FFFFFF").s().p("AgRAgIABg3IgRgBIABgMIARgFIAAgWIAQAAIAAAXIAgAAIgBARIggAAIAAA4QAAAOAMAAQAIAAALgEIADAQQgMAFgLAAQgdAAABggg");
	this.shape_85.setTransform(-7.9,-29.8);

	this.shape_86 = new cjs.Shape();
	this.shape_86.graphics.f("#FFFFFF").s().p("AAZAzIgZgoIgYAoIgUAAIAjgzIghgyIAUAAIAWAlIAWglIAUAAIgfAyIAjAzg");
	this.shape_86.setTransform(-16,-28.8);

	this.shape_87 = new cjs.Shape();
	this.shape_87.graphics.f("#FFFFFF").s().p("AgqBFIAAiJIBWAAIAAASIhEAAIAAAqIA4AAIAAAQIg4AAIAAArIBEAAIAAASg");
	this.shape_87.setTransform(-25.9,-30.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_31},{t:this.shape_30},{t:this.shape_29,p:{x:-15.6,y:-30.5}},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26,p:{x:11.6,y:-32.9}},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22,p:{x:-49.9,y:-7.2}},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17,p:{x:3.2,y:-8.2}},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14,p:{x:27,y:-9.6}},{t:this.shape_13},{t:this.shape_12,p:{x:46.7,y:-7.4}},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1,p:{x:49,y:15.9}},{t:this.shape}]}).to({state:[{t:this.shape_63},{t:this.shape_62},{t:this.shape_61},{t:this.shape_60},{t:this.shape_59},{t:this.shape_58},{t:this.shape_57},{t:this.shape_56},{t:this.shape_55},{t:this.shape_54},{t:this.shape_53},{t:this.shape_52},{t:this.shape_51},{t:this.shape_50},{t:this.shape_49},{t:this.shape_48},{t:this.shape_47},{t:this.shape_46},{t:this.shape_45},{t:this.shape_44},{t:this.shape_43},{t:this.shape_42},{t:this.shape_41},{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32}]},4).to({state:[{t:this.shape_87},{t:this.shape_86},{t:this.shape_85},{t:this.shape_84},{t:this.shape_12,p:{x:12.2,y:-29}},{t:this.shape_83},{t:this.shape_14,p:{x:29.1,y:-31.2}},{t:this.shape_82},{t:this.shape_81},{t:this.shape_80},{t:this.shape_79},{t:this.shape_78},{t:this.shape_77},{t:this.shape_76},{t:this.shape_75},{t:this.shape_74},{t:this.shape_17,p:{x:12.2,y:-6.6}},{t:this.shape_73},{t:this.shape_1,p:{x:32.4,y:-5.7}},{t:this.shape_72},{t:this.shape_71},{t:this.shape_70},{t:this.shape_69},{t:this.shape_68},{t:this.shape_67},{t:this.shape_66},{t:this.shape_65},{t:this.shape_29,p:{x:17.6,y:17.7}},{t:this.shape_26,p:{x:25.1,y:15.3}},{t:this.shape_22,p:{x:32.9,y:17.7}},{t:this.shape_64}]},5).to({state:[]},6).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-80,-49.3,149,78.8);


(lib.Symbol2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FE5000").ss(14.1,0,0,4).p("AAAylQDyAADdBdQDWBbClCkQCkClBbDWQBdDdAADxQAADyhdDeQhbDVikClQilCkjWBbQjdBdjyAAQjxAAjehdQjVhbilikQikilhbjVQhdjeAAjyQAAjxBdjdQBbjWCkilQClikDVhbQDehdDxAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-126,-126,252,252);


(lib.Screen3_MC = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.security_screen3();
	this.instance.parent = this;
	this.instance.setTransform(-373,-248.3,0.691,0.691);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Screen3_MC, new cjs.Rectangle(-373,-248.3,746.1,496.7), null);


(lib.Screen2_popout = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.security_screen2_popout();
	this.instance.parent = this;
	this.instance.setTransform(-247,-20,0.521,0.521);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Screen2_popout, new cjs.Rectangle(-247,-20,460.2,101.5), null);


(lib.Screen2_MC = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.security_screen2();
	this.instance.parent = this;
	this.instance.setTransform(-373,-248.3,0.691,0.691);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Screen2_MC, new cjs.Rectangle(-373,-248.3,746.1,496.7), null);


(lib.Shadowcopy = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Shadowcopy_0();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Shadowcopy, new cjs.Rectangle(0,0,412,32), null);


(lib.connecteddotsinbak = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#666666").s().p("AksDlIgmApIgBAAIgBgBIAAgBIAkgnIgfgFIgHAlIgDAAIAAgBIAGgkIg/gKIAAgEIAAgBIBAAKIAji9IiogkIAAAAIgBgBIAAgBIABgBICoAkIAsjwIg0iIIAAgBIABgBIABABIA0CDIAVh3IADAAIABAAIgXB8IBlEEIhMmEIABgBIABAAIAAAAIABABIBNGIIgBgBIgBAAIgBACIAAgCIgCABIgBgBIAAAAIhkkAIgsDrICOAgIABAAIAAABIABABIgBABIiPggIgjC9IAjAFICOiZIABAAIABABIAAAAIiNCZIMCB6IAAADIAAABg");
	this.shape.setTransform(-83.6,68.5,0.72,0.72,24.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#666666").s().p("Aj+ilIgBAAIABgCIABgBIH8FNIABABIAAABIgBABIgBABg");
	this.shape_1.setTransform(28.9,98.2,0.72,0.72,24.7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#666666").s().p("AmXheIAAgBIABgCIAAgBIMuDBIAAABIgBACIAAAAIAAABg");
	this.shape_2.setTransform(-28.5,65.4,0.72,0.72,24.7);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#666666").s().p("AhhBZIAAgBIgBgBIABgBIDBiuIACAAIAAABIABABIgBABIAAAAIAAAAIjBCug");
	this.shape_3.setTransform(6.6,81.8,0.72,0.72,24.7);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#666666").s().p("AkPBvIgBgCIABgBIE2i2IhPghIgBgBIAAgBIAAgBIACAAIBSAhIA2ggIACAAIAAACIgBABIgzAfIDhBaIABABIgBACIgBAAIjlhbIk4C5g");
	this.shape_4.setTransform(-71.3,36,0.72,0.72,24.7);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#666666").s().p("AkICYIgBgCIAAAAIAAgBIIRktIABABIAAAAIABACIAAAAIAAABIoREtg");
	this.shape_5.setTransform(-4.5,25.5,0.72,0.72,24.7);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#666666").s().p("AkhhhIAAgCIAAgCIABgBIJCDJIAAABIgBACIAAABg");
	this.shape_6.setTransform(35.8,39.8,0.72,0.72,24.7);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#666666").s().p("AhKAIIgrCbIgBAAIgBAAIAAgBIAAAAIAAAAIABgFIApiZIglg3IAAgBIgBAAIABgBIAAgBIACAAIAkA2IBQktIACAAIABAAIAAAAIAAABIhREwIDCEnIABABIAAABIgBABIgCAAg");
	this.shape_7.setTransform(20,-0.6,0.72,0.72,24.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#666666").s().p("AjeDQIgBAAIgBgBIG/meIAAAAIACAAIABABIAAABInAGdg");
	this.shape_8.setTransform(-8.1,-1.1,0.72,0.72,24.7);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#666666").s().p("AjZBcIAAAAIgBgCIAAAAIGzi2IAAABIABAAIABACIgBAAIABABIm0C1g");
	this.shape_9.setTransform(-11.8,6.8,0.72,0.72,24.7);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#666666").s().p("ABmCqIAUBBIAAABIgCABIgBgBIgWhDIh+guIAAgBIABgCIAAgBIB7AtIgyieIgwAVIghBHIgBAAIgBAAIgBgBIAAAAIAghEIiJA8IBRATIAAADIgBABIhVgUIgqASIgBgBIAAgCIAAgBIAkgQIgkgIIgHAQIgBAAIgBAAIgBgBIAHgQIgjgJIAQAeIgCABIAAAAIgCABIgRghIjqg2IC7BYIABABIAAAAIABABIAAACIgBAAIgBAAIjshlIgBgBIAAgCIABAAIABgBIADACIAAgCIABgBIANADIhsgyIBKAqIAAABIAAAAIAAABIgCAAIhyg/IgBgCIABAAIAAgBIABAAIAKAFIABAAIABgBICZBHID3A7Iisk7IACgBIAAgBIABAAICuE+IAnAJICRlCIAAAAIACABIABAAIAAAAIiRFCIAoAJICShAIAghHIg/jHIACgBIACgBIAAABIA+DDIBJidIh/guIAAAAIgBAAIABgBIAAgCIABgBICAAuIBJicIACAAIAAAAIACABIgBAAIAAABIhJCcIDbBNIAAAAIABAAIAAACIgBACIjdhOIhLChIAQAvIEUh5IABAAIABAAIABACIgBABIkVB6IA0CiIInDJIAAABIgBABIAAABgAlqBHIh7g6IgagGICVBAgAAAAWIAsgVIgOgsg");
	this.shape_10.setTransform(-54,25.6,0.72,0.72,24.7);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#666666").s().p("AhlACIABgCIAAAAIAAAAIgCgBIDLABIABAAIAAABIAAABg");
	this.shape_11.setTransform(-67.7,28.4,0.72,0.72,24.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#666666").s().p("AivACIAAgCIABAAIABAAIFcgCIABACIAAAAIAAABIgBAAIgBABIlcABg");
	this.shape_12.setTransform(-61,1.6,0.72,0.72,24.7);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#666666").s().p("AjUg9IgBAAIABgCIAAAAIABgCIGoB/IABABIgBACIAAAAIAAABg");
	this.shape_13.setTransform(-43,-5.3,0.72,0.72,24.7);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#666666").s().p("AjJhtIABgBIAAgBIABgBIAAAAIGRDeIgBABIAAAAIAAABIgBABIAAAAg");
	this.shape_14.setTransform(-40.7,-8.3,0.72,0.72,24.7);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#666666").s().p("AC7FAIl4p9IAAAAIABgBIAAAAIABgBIABAAIF4J9IAAABIgBAAIgBABg");
	this.shape_15.setTransform(-196.9,-38.4,0.72,0.72,24.7);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#666666").s().p("AgNAlIgCAAIgBgCIAdhGIABgBIAAAAIACAAIABABIgdBHIgBABg");
	this.shape_16.setTransform(9,122.5,0.72,0.72,24.7);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#666666").s().p("AgPE3IAAAAIgBgCIAAAAIAAABIlkmxIgBgBIABgCIACAAIAAgBIAAgBIABAAIABAAIAYAVIgHgJIAAgBIAAgBIACgBIABABIATAXIEeDzIgujbIj7g0IgBgBIAAgCIAAAAIABgBIAAAAID6AzIgxjmIABAAIAAgBIABgBIAAAAIAAgBIACgCIABAAIABABIBODxIGsBXIABACIAAABIgBABIAAAAImqhXIBWEMIgBACIgCAAIgBgBIhXkNIgbgGIAvDgIA/A2IABACIgBABIgCAAIAAAAIg8g0IAeCQIAAABIgBABIgCAAIggiVIkUjrIEyGFIAAABIAAABIgCAAgAhuC/IjfkdIgigcgAhWhLIAbAGIhIjeg");
	this.shape_17.setTransform(16.1,104.3,0.72,0.72,24.7);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#666666").s().p("AgxGAIBhr/IABAAIhgL/g");
	this.shape_18.setTransform(-135.9,7.1,0.72,0.72,24.7);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#666666").s().p("AgwGAIgBAAIBhsAIAAABIACAAIhhMAg");
	this.shape_19.setTransform(-136,7.1,0.72,0.72,24.7);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#666666").s().p("AjIJgIgBgBIAAAAIAAgBIDOipIjUgNIgGCzIgBAAIAAABIgBAAIAAgBIgBAAIAGizIgMgBIgBgBIAAgCIABgBIAMABIABgNIgNAGIgBgBIgBgBIAAgBIAPgHIAFirIggCpIAAAAIgCgBIgBAAIgBAAIAmjBIAChUIADAAIAAAAIABAAIgDA/IAOhEIgDgCIAAgBIgBAAIABgBIAAgBIACAAIACABIBBlUIhKFAIAAABIgCABIgCgCIBcmPIgsgrIiHg7IBVHwIgBABIgBAAIgBgBIhWnyIikhIIn3A6IgBAAIAAgCIAAgBIHxg6IkUh5IAAAAIABgCIABgBIAAAAIEaB8ICEgQIAAABIAAAAIABACIgBAAIAAABIh9AOICbBFIgMhHIABgBIACAAIAAAAIAAABIANBIICAA4IiGiEIABgBIAAAAIAAgBICOCKIAhAPIAAAAIgBACIgBABIgYgLIAlAkIACgGIAAgBIACgBIABACIgCAHIABAAIAAADID9D5IAAAAIAAABIAAABIgBAAIgBABIj8j4IhOGUIgCAOIDRCuIE4iSIhMhQIm6ApIAAgCIgBgBIABgBIG3gpIhWhaIAAgBIABgBIABAAIAAgBIBZBdIDNgTIABABIAAACIjMATIBLBQIAtgVIBWhGIAAAAIABAAIAAABIAAABIABAAIAAABIhKA9IBiguIgGgPIAAAAIAAgBIACgBIACABIAFAOIAQgHIgOgIIAAgBIABgBIABgBIABgBIAPAKIB6g5IAAABIABACIAAABIh3A3IAqAbIBRhRIAAAAIACACIAAAAIABAAIgBABIhPBQIGADuIAAABIAAABIgBABIgBAAImBjvIgpApICKFaIAAABIgCABIAAAAIgBgBIiJlYIhiBhIDmD1IAAABIgBABIgBAAIAAAAIjmj0IjIDHIgBAAIgBgBIAAgBIAAAAIgBAAIABgBIDHjHIhIhMIj1DHIBgBPIAAABIABAAIgBABIAAABIAAAAIgDABIhfhQIhaBKICzAKIABABIAAABIAAABIgBABIi4gLIjSCsgAjOGWIgBAOIDYANIBdhMIhKg9gAjHDTIgHC/IDmhtIjOisgAAgEmIBJA9ID0jIIgGgHgAGFB/IgiAcIBIBNIBihjIgYg7gAFbCTIAFAGIAYgUgAH5BJIAXA5IAmgnIgrgbg");
	this.shape_20.setTransform(81.2,35.9,0.72,0.72,24.7);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#666666").s().p("ACAGAIgBAAIgBgBIAAAAIAihSIpkkFIAAgBIABgBIABAAIAAgBIJkEFIEgqqIABABIABAAIABAAIkgKqIBvAvIAAABIgBADIAAAAIgBAAIhvgvIgiBRIAAABg");
	this.shape_21.setTransform(116.3,23.5,0.72,0.72,24.7);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#666666").s().p("AhWCLIhogJIAAgBIAAgCIAAgBIBmAKIgKgXIADAGIiRlVIAAgBIABAAIABgBIABAAICaFoIFEAeIAAADIAAABIlDgeIAkBTIgBAAIgBABIAAAAIgCABg");
	this.shape_22.setTransform(60.5,-41.6,0.72,0.72,24.7);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#666666").s().p("AiIAiIAAgCIAAgBIABAAIEOhBIABABIABACIgBABIAAAAIkOBBg");
	this.shape_23.setTransform(61.5,-24.8,0.72,0.72,24.7);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#666666").s().p("ABLA2IiXhnIAAgBIgBgBIABgCIACAAICXBnIAAABIABABIgBACg");
	this.shape_24.setTransform(46.7,-33.4,0.72,0.72,24.7);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#666666").s().p("AiiijIAAgBIABAAIABgBIAAAAIAAgBIFEFKIgBABIAAAAIgDACg");
	this.shape_25.setTransform(78.5,-5.6,0.72,0.72,24.7);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#666666").s().p("AgYCSIgBgBIAwkgIAAAAIAAgCIACAAIABACIgvEfIAAABIgBABg");
	this.shape_26.setTransform(36.6,-30.4,0.72,0.72,24.7);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#666666").s().p("AkRgzIgCAAIAAgCIABAAIAAgBIIkBqIACABIAAABIgBABg");
	this.shape_27.setTransform(-3.1,-20.6,0.72,0.72,24.7);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#666666").s().p("Ag2BwIgCgBIAAAAIgBgBIBwjdIAAAAIACABIABAAIAAABIhwDdg");
	this.shape_28.setTransform(22.1,-14.7,0.72,0.72,24.7);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#666666").s().p("AgCBsIAAgBIAAAAIACjVIAAAAIAAgBIADAAIAAABIAAAAIgDDVIAAAAIAAABg");
	this.shape_29.setTransform(10.3,-0.4,0.72,0.72,24.7);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#666666").s().p("ABeEEIgBAAIi9oGIAAgCIACAAIAAAAIACAAIC9IHIAAABIgCABg");
	this.shape_30.setTransform(-6.4,104.8,0.72,0.72,24.7);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#666666").s().p("AA4FQIgBAAIhwqeIAAAAIAAgBIABgBIACAAIABABIBvKeIgBABIgBAAIAAABg");
	this.shape_31.setTransform(11.8,169.6,0.72,0.72,24.7);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#666666").s().p("AhHgFIgBgBIAAAAIABgCIACAAICNANIABACIAAABIgDABg");
	this.shape_32.setTransform(-161.2,106.8,0.72,0.72,24.7);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#666666").s().p("AjVkWIAAgBIABgBIGqIvIAAAAIgBABIAAABg");
	this.shape_33.setTransform(-0.8,168.1,0.72,0.72,24.7);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#666666").s().p("AgjFNIAAAAIgBAAIBGqZIACAAIAAAAIhEKZg");
	this.shape_34.setTransform(-101.8,31.5,0.72,0.72,24.7);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#666666").s().p("AhKClIgBgBIgBAAICXlIIACAAIABABIiYFIg");
	this.shape_35.setTransform(-104,44.2,0.72,0.72,24.7);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#666666").s().p("AjIDXIgBgBIAAgBIGRmsIABABIAAAAIABABIAAABImRGrg");
	this.shape_36.setTransform(-27.3,150.4,0.72,0.72,24.7);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#666666").s().p("AlOEoIgBAAIAAgBIBkhMIhVgvIAAgBIABgBIACAAIBVAvIA1goIgDgGIiAgCIgBgBIAAgCIABgBIB+ABIgrhKIAAgBIABgBIABAAIABAAIArBMIAQABIBJg3Ih9gYIgBgBIAAgCIABgBIABAAIB/AZIBfhHIg2glIisBQIgBgBIAAAAIgBgCIABgBIECh2IgPgSIhFAzIgBAAIgBgBIAAgBIBEg0IgbgiIAAgCIABAAIABgBIACABIAbAiIE2joIgBACIACABIABAAIABAAIk3DnIAQATIC0hSIABAAIAAAAIABACIgBABIizBSIAaAgICRhtIABAAIAAABIABABIAAAAIiRBtIAaAgIB7iPIABABIABABIAAAAIh7CPIBwCIIAAABIgBABIgBAAIABABIAAABIAAABIgCABIAAAAIgBAAIiShgIgwA4IC8AmIABABIAAACIgCAAIgBAAIAAABIAAABIAAAAIgBABIAAAAIjbgCIhTBiIgCABIgBgBIgBgBIABAAIAAgBIBRhgIiKgBIgKAHIA3BeIAAACIgBABIgCAAIgBgBIg1heIg0AmIBpA7IAAABIgBABIhrg7IhmBNgAivCvIAFgEIgIAAgADDCrIi5glIgdAjIDWACgAifCnICJACIAcgkIhegTgADOClIhtiGIgiAoICPBegAhUBuIBdATIAyg5IgygggAAMAlIAwAhIAjgpIgbgggAgsAAIA1AkIA4gqIgagggABCgGIAAgBIgKgLg");
	this.shape_37.setTransform(9.6,127.2,0.72,0.72,24.7);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#666666").s().p("AhqAMIAAgCIAAAAIABAAIDTgWIACABIgBAAIAAACIAAAAIgBAAIjUAWg");
	this.shape_38.setTransform(-14.5,139.4,0.72,0.72,24.7);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#666666").s().p("Am9hLIAAAAIAAgBIAAgBIABAAIAAgBIN6CaIAAAAIAAACIgBABg");
	this.shape_39.setTransform(-193.6,85,0.72,0.72,24.7);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#666666").s().p("AhRGWIgBgBIAbj4IABAAIABAAIABAAIgYDhIAmjCIgNgmIAAgBIAAgBIACgBIABACIALAgIBooPIhxHYIAAAAIgBAAIgBAAIgBAAIB+oRIABAAIAAAAIABAAIABAAIAAgCIAAAAIAAAAIACAAIABAAIAAAAIhELPIgBAAIAAABIgCAAIgBgBIBDq9IhxI/IAuCIIAAAAIgBABIgBAAIgBgBIgsiCIgpDRIgBAAIAAAAIgBAAIAAACIgBABgAhQGVIAAAAIAAgCg");
	this.shape_40.setTransform(-212.3,43.9,0.72,0.72,24.7);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.f("#666666").s().p("AgpAqIgCgBIABgCIBUhQIAAAAIABAAIABABIAAABIhUBRIgBAAg");
	this.shape_41.setTransform(-225.9,67.3,0.72,0.72,24.7);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.f("#666666").s().p("AAnAHIhPgKIAAAAIAAgBIgBAAIABAAIAAgCIACABIBPAIIAAABIABAAIAAABIgBACg");
	this.shape_42.setTransform(-90.7,36.7,0.72,0.72,24.7);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.f("#666666").s().p("AhYDFIgBgBICwmIIAAgBIACABIACABIiyGJg");
	this.shape_43.setTransform(-35.2,147.7,0.72,0.72,24.7);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.f("#666666").s().p("AgLJwIAAAAIAAgBIjwlzIABAAIAAgBIACAAIABABIDZFQIjFlbIgQACIgBgBIAAgCIABgBIAPgBIhBhyIAiBmIgBABIgBABIgBgBIAAAAIgjhmIACAAIABgBIABAAIAAAAIgCgDIACgBIAAAAIABAAIAAAAIABABIBCB1IBwgJIABgBIgBAAIBmg8IhZgSIgUBGIAAABIgCgBIgBAAIgBAAIAVhGIi4glIAAAAIgBgBIAAgBIABgBIC5AkIB5mgIjElfIABgBIABAAIAAAAIABgBIABAAIDYEQIA5jBIAAgBIACABIABAAIABAAIg6DEID7E8IAAABIgBABIAAAAIgBABIj7k7IgVBKICyE6IBcg2IABABIABACIgBABIACACIgBABIhGA8IgBgBIgBgCIABAAIBFg7IhbA0IABADIABAAIgBABIgCABIAAgBIgCgDIjJB3IAIABIC+hgIABABIABABIAAABIgBABIi5BdICkAhIAAAAIAAABIAAACIgBAAIioghIhvA4IEYgWIAAAAIABABIAAABIgBABImQAgIDXF7IAAABIABACIgBAAIAAABgAhMDSIBNgnIgHgCgAhjCTIBcASIDMh4Iivk2gAAVkSIAVhJIgMgQIAFAHIjRkJIAAAAIAEAGIgEgEgAAtlcIAAAAIACgGg");
	this.shape_44.setTransform(-28.7,117.5,0.72,0.72,24.7);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.f("#666666").s().p("AhXHJIgBAAIgBAAIAAAAIA5kSIjFEJIgBgBIAAAAIgBgBIAAAAIDIkOICFp5IACAAIABABIAAAAIiCJyID+lXIABAAIABABIABAAIAAABIkDFcIg7EZg");
	this.shape_45.setTransform(-136.2,81.2,0.72,0.72,24.7);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.f("#666666").s().p("Agyg+IAAAAIABgCIACAAIBiB/IAAAAIgCACg");
	this.shape_46.setTransform(-195.8,12,0.72,0.72,24.7);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.f("#666666").s().p("ADgJkIgBAAIAAAAIgBgBIgnmCIkpggIgBAAIAAAAIAAgCIABgCIEpAgIgGg4IhugyIiXATIggApIgBAAIgBAAIAAgBIgBgBIAAgBIAdglIg4AHIAPAnIgBABIgCAAIgBgCIgPgmIi3AWIBCCSIgBABIAAAAIgCABIAAgBIhCiSIghAEIgBgBIgBgBIABgBIAggEIg6iBIANB6IAAABIgBABIAAAAIAAABIAAAAIgBABIgBAAIgBgBIgtjGIABgBIABgBIABABIABACIAAgBIABAAIABABIAYA0IgGg4IgJgCIAAgBIAAgBIAAgBIABAAIAIACIgik6IABgBIABAAIABABIAiE6IDKAyIgCgEIAAAAIACgBIACAAIAAABIAAAAIACAFIAxANIgugUIABAAIABABIABgCIAAgCIA/AcIBqAaIFAmfIgFg+InkGaIgBAAIgBgBIAAgBIAAgBIHlmbIgPizIABAAIACAAIAQCwICTh9IABABIABAAIAAABIAAACIgDACIABAAIABAAIAAABIABABIAAABIiPC5IAzJKIgEAAIgzpFIk8GbICxAtIABABIgBABIAAABIAAAAIAAAAIizgtIgKANIBkAuIBcgLIABAAIAAACIgBABIhXAKIBoAvIgFgvIABAAIAAAAIACAAIAAAAIAFAwIChBJIAAABIgBACIgBgBIAAAAIiehHIAFA3ICWAQIAAABIABAAIAAACIgBABIiVgQIAmGCIAAAAIAAABIgBAAIAAAAgAmNAXIA+CKIC4gWIgziDIjKgygAmECMIgNh1Igbg7gAiTCKIA8gHIAAAAIAxg/IhfgrIhAgQgAhSCCICPgRIhggsgAgkBBIAKgNIhXgWgAEmmvIAFA8ICNi3g");
	this.shape_47.setTransform(-167.2,5.7,0.72,0.72,24.7);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.f("#666666").s().p("AjyhLIAAgBIAAgCIABAAIHkCZIAAACIAAAAIgBACIAAAAg");
	this.shape_48.setTransform(188,-21.5,0.72,0.72,24.7);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.f("#666666").s().p("AhqATIAAgBIgBAAIABgCIAAAAIACAAIDSgiIABAAIAAABIAAAAIAAACIgCAAIjSAjg");
	this.shape_49.setTransform(194.4,-10.4,0.72,0.72,24.7);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.f("#666666").s().p("AiBhZIAAgBIgBAAIABgCIACgCIEBC5IAAAAIAAAAIAAACIgCABg");
	this.shape_50.setTransform(179.7,-23.8,0.72,0.72,24.7);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.f("#666666").s().p("Ag2E1IgBAAIAAgBIBspnIAAgBIAAAAIACAAIAAAAIABABIhsJnIAAABIAAAAg");
	this.shape_51.setTransform(64.9,-84.1,0.72,0.72,24.7);

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.f("#666666").s().p("AhSCAIgCgBIABAAIAAgBIClj+IACAAIAAACIABAAIAAABIgBABIilD8g");
	this.shape_52.setTransform(-64,-105.2,0.72,0.72,24.7);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.f("#666666").s().p("AA+B5IAAgBIh+jvIABgBIACAAIAAABIB+DvIgBABg");
	this.shape_53.setTransform(148.9,134.6,0.72,0.72,24.7);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.f("#666666").s().p("AhIBiIgBgCIABgBIAAgBICPi/IACABIABABIgBABIAAABIiPC/g");
	this.shape_54.setTransform(141.5,149.3,0.72,0.72,24.7);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.f("#666666").s().p("AhCDdIgBgCIgGj6IABAAIABgBIABAAIABACIAFC/IAGjAIgCAAIAAgBIgBgBIABgBIABAAIABgBIAFiRIgPCDIAAABIgBABIgCgBIAAgBIgBAAIATiqIAAgBIABgBIACAAIAAACIABAAIgBAIIABAAIAAgBIgFCzIB/A0IAAABIABAAIgBACIAAAAIgBABIh+g0IgIDvIAAABIgBAAIABAJIgCABg");
	this.shape_55.setTransform(144.7,140.7,0.72,0.72,24.7);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.f("#666666").s().p("AiSgxIgBgBIAAAAIAAgBIABgBIABAAIEkBmIABAAIAAABIAAABIAAABIgCAAg");
	this.shape_56.setTransform(139.7,115.9,0.72,0.72,24.7);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.f("#666666").s().p("AiEApIAAgCIAAgBIEIhPIABAAIAAACIAAABIAAABIkIBPg");
	this.shape_57.setTransform(116.8,106,0.72,0.72,24.7);

	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.f("#666666").s().p("AjOBTIAAgCIGcikIAAAAIAAABIABAAIgBACIAAAAImbCkg");
	this.shape_58.setTransform(65,70.7,0.72,0.72,24.7);

	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.f("#666666").s().p("AibgnIAAgBIAAgBIACAAIE0BQIABABIgBACIgBAAg");
	this.shape_59.setTransform(102.6,45.7,0.72,0.72,24.7);

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.f("#666666").s().p("AnhFAIgBgBIAAgBIBpiYIiHg4IgBgBIAAgBIgDgBIAAAAIgBgBIABgCIABAAICUAvICEi9IAAAAIABAAIABAAIABACIiDC9IClA0Igcj2IABgBIACAAIAAAAIABACIAAADIACAAIABABIBDDzIKaoOIAAABIACgCIAAABIABAAIABACIAAAAIqNISIAAAAIgBAAIgBgCIAAgBIFfkeIl2EmIAAABIAAACIgCAAIgBgBIgPAMIAAAAIgBgBIgBgBIAAgBIAAAAIANgKIgbgJIACAXIgBABIgBAAIgBAAIAAgCIgDgXIing1IgHAJICmBFIABABIAAAAIgBABIgBABIimhFIhqCYIgBABgAjDDOIAfAKIAJgHIgBgBIhBjsgAl3CjIAGgJIh3gmg");
	this.shape_60.setTransform(147.8,97.6,0.72,0.72,24.7);

	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.f("#666666").s().p("AlnCFIgBgBIAAgBILPkIIABAAIABACIAAAAIrPEKg");
	this.shape_61.setTransform(163.4,89.7,0.72,0.72,24.7);

	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.f("#666666").s().p("AiJBGIAAgCIESiKIABABIAAABIAAABIAAAAIgBAAIkRCLg");
	this.shape_62.setTransform(122.4,87.9,0.72,0.72,24.7);

	this.shape_63 = new cjs.Shape();
	this.shape_63.graphics.f("#666666").s().p("AAOBiIgejCIAAAAIAAgBIADAAIAfDCIgBAAIAAABg");
	this.shape_63.setTransform(108,96.4,0.72,0.72,24.7);

	this.shape_64 = new cjs.Shape();
	this.shape_64.graphics.f("#666666").s().p("AluAWIAAAAIAAgDILdgpIAAABIAAACIAAABIrdApg");
	this.shape_64.setTransform(107.6,143.4,0.72,0.72,24.7);

	this.shape_65 = new cjs.Shape();
	this.shape_65.graphics.f("#666666").s().p("AjBDQIgCgCIGFmdIAAAAIABAAIABACIAAABImEGcg");
	this.shape_65.setTransform(113.4,161.7,0.72,0.72,24.7);

	this.shape_66 = new cjs.Shape();
	this.shape_66.graphics.f("#666666").s().p("ABxBzIjkjjIAAgCIACgBIABABIAAAAIDkDjIAAACIgCABg");
	this.shape_66.setTransform(137.8,165.2,0.72,0.72,24.7);

	this.shape_67 = new cjs.Shape();
	this.shape_67.graphics.f("#666666").s().p("AjPjoIAAAAIAAAAIABgBIAAAAIABgBIGdHTIgBABIAAAAIgBAAIAAABg");
	this.shape_67.setTransform(86.4,179,0.72,0.72,24.7);

	this.shape_68 = new cjs.Shape();
	this.shape_68.graphics.f("#666666").s().p("AhWi2IAAgBIABAAIACAAIABgBICpFvIgBAAIgCABIgBAAIAAABg");
	this.shape_68.setTransform(93.3,185.9,0.72,0.72,24.7);

	this.shape_69 = new cjs.Shape();
	this.shape_69.graphics.f("#666666").s().p("AjeEgIgBAAIgBgBIG+o+IAAgBIABABIABAAIAAAAIABABIm+I+IAAABg");
	this.shape_69.setTransform(117.7,189.3,0.72,0.72,24.7);

	this.shape_70 = new cjs.Shape();
	this.shape_70.graphics.f("#666666").s().p("AipFCIgCgBIAAAAIFUqDIABAAIACACIAAAAIAAABIlUKBg");
	this.shape_70.setTransform(71.4,218.6,0.72,0.72,24.7);

	this.shape_71 = new cjs.Shape();
	this.shape_71.graphics.f("#666666").s().p("Aioi2IAAgBIABgBIACAAIFOFuIAAABIgBACIgBAAIAAAAg");
	this.shape_71.setTransform(87.4,151.5,0.72,0.72,24.7);

	this.shape_72 = new cjs.Shape();
	this.shape_72.graphics.f("#666666").s().p("AAtCEIhdkKIABgBIACAAIAAAAIAAABIBeENIgBABIgBAAIgBAAg");
	this.shape_72.setTransform(80.5,144.7,0.72,0.72,24.7);

	this.shape_73 = new cjs.Shape();
	this.shape_73.graphics.f("#666666").s().p("AhsglIAAgBIABgBIAAgBIAAgBIDYBPIgBABIAAABIgBABg");
	this.shape_73.setTransform(86.4,163,0.72,0.72,24.7);

	this.shape_74 = new cjs.Shape();
	this.shape_74.graphics.f("#666666").s().p("Ak2BfIAAgCIAAgBIJsi7IABABIABACIgBABIpsC7g");
	this.shape_74.setTransform(117.7,173.3,0.72,0.72,24.7);

	this.shape_75 = new cjs.Shape();
	this.shape_75.graphics.f("#666666").s().p("Al9h5IAAgBIABgBIAAAAIAAgBIL6D2IgBABIAAABIAAABIAAAAg");
	this.shape_75.setTransform(27.3,214.7,0.72,0.72,24.7);

	this.shape_76 = new cjs.Shape();
	this.shape_76.graphics.f("#666666").s().p("AgMAvIgBAAIgBAAIAZhdIABgBIABABIABAAIABAAIgaBdIAAABg");
	this.shape_76.setTransform(25.8,-112.7,0.72,0.72,24.7);

	this.shape_77 = new cjs.Shape();
	this.shape_77.graphics.f("#666666").s().p("AiphsIgBgBIABAAIAAgBIACgBIFSDbIAAABIAAABIAAABIgCABg");
	this.shape_77.setTransform(-91.3,-42,0.72,0.72,24.7);

	this.shape_78 = new cjs.Shape();
	this.shape_78.graphics.f("#666666").s().p("AoOKVIgBgCIABgBIIkmxIgRgmIhqgjIAAgBIABgBIAAgBIAAAAIBnAiIg2h3Ig3BDIgBAAIAAAAIgCgBIAAgBIA4hFIhijWImzJXIgBgBIgBAAIAAAAIAAgBIgBAAIABgBIGzpXIhMinIABAAIABgBIABAAIBLClIBdiAIACACIAAAAIhdCBIAAABIBiDWICIinIh5iwIgBAAIABgBIABAAIAAgBIABAAIB6CvIAOgRIhzjUIgUAZIgBgBIgBgBIAAAAIgBgBIAVgaIg6hpIgNAJIAmB/IgBABIgCAAIgBgBIgmh9IiGBdIgBABIgBgBIgBgBIAAgBICIheIgYhQIABgCIACAAIAAABIABABIAYBOIANgJIgjg/IABAAIAAAAIABgBIABAAIABAAIAiA+IA3gmIhagkIAAgBIABgCIBdAkIDtikIABgBIAAABIABAAIAAACIjsCkIBIAdIAAABIgBACIgCgBIhIgdIg6AoIA5BnIAUgbIAHgJIgHAJIgTAcIAAAAIBJhgIABABIAAAAIABABIhKBhIB0DUIApgyIhFkAIABgBIABAAIABAAIABAAIBDD9IBDhRIAAABIABAAIABABIAAABIhDBTIA/DsIgBAAIgBAAIgBABIgBgBIAAAAIg+jpIgpAyIBmC4IAAABIgBAAIAAAAIgBAAIAAABIgBABIgCABIh0ilIiICnIA4B7IAvAPICShzIACAAIABACIgBABIiQByIIUCuIAAABIgBABIAAABIAAABIoWivIgdAWIAVAtIgBABIgBAAIgBAAIgUgsIolGygAAYDfIAagVIgpgOgAC6BgIAOgLIABABIgBgBIAAAAIAAAAgABahtIBsCaIheirg");
	this.shape_78.setTransform(-194.5,-86.5,0.72,0.72,24.7);

	this.shape_79 = new cjs.Shape();
	this.shape_79.graphics.f("#666666").s().p("AjGD7IgBgCIgBAAIGOn0IABABIAAAAIACABIgBABImOH0g");
	this.shape_79.setTransform(-228.2,-69.8,0.72,0.72,24.7);

	this.shape_80 = new cjs.Shape();
	this.shape_80.graphics.f("#666666").s().p("AjfCTIgBgBIAAgBIG/kkIABAAIABACIAAABIm/Ekg");
	this.shape_80.setTransform(-227,-77.7,0.72,0.72,24.7);

	this.shape_81 = new cjs.Shape();
	this.shape_81.graphics.f("#666666").s().p("AC0E9Ilpp3IgBAAIAAAAIACgBIAAAAIACgBIFpJ3IAAABIgBABIgBAAg");
	this.shape_81.setTransform(-168.7,-70.7,0.72,0.72,24.7);

	this.shape_82 = new cjs.Shape();
	this.shape_82.graphics.f("#666666").s().p("AgEC1IgBgBIAIloIABgBIABAAIABABIgIFoIgBABIgBABg");
	this.shape_82.setTransform(-165,-110.6,0.72,0.72,24.7);

	this.shape_83 = new cjs.Shape();
	this.shape_83.graphics.f("#666666").s().p("AhtiWIAAgCIACAAIABABIDYEuIAAAAIgBABIgBABg");
	this.shape_83.setTransform(-161.6,-136.8,0.72,0.72,24.7);

	this.shape_84 = new cjs.Shape();
	this.shape_84.graphics.f("#666666").s().p("AC1CjIlrlDIgBgBIACgBIABAAIAAAAIFrFDIAAAAIgBACIAAAAg");
	this.shape_84.setTransform(-192.3,-49.2,0.72,0.72,24.7);

	this.shape_85 = new cjs.Shape();
	this.shape_85.graphics.f("#666666").s().p("Ah0EyIgBgBIDqpiIABABIAAAAIjqJig");
	this.shape_85.setTransform(-181.9,-133.2,0.72,0.72,24.7);

	this.shape_86 = new cjs.Shape();
	this.shape_86.graphics.f("#666666").s().p("Ah1EyIDppjIACAAIjqJjg");
	this.shape_86.setTransform(-181.9,-133.3,0.72,0.72,24.7);

	this.shape_87 = new cjs.Shape();
	this.shape_87.graphics.f("#666666").s().p("AhdDPIAAAAIgBgBIC6mdIACABIAAAAIABABIi6GcIgBAAg");
	this.shape_87.setTransform(-151.1,-161.8,0.72,0.72,24.7);

	this.shape_88 = new cjs.Shape();
	this.shape_88.graphics.f("#666666").s().p("AhDBbIgBgCICFiyIABgBIACAAIAAACIiECyIAAABg");
	this.shape_88.setTransform(242.2,54.6,0.72,0.72,24.7);

	this.shape_89 = new cjs.Shape();
	this.shape_89.graphics.f("#666666").s().p("AlfgyIAAAAIAAgBIAAgBIABgBIAAgBIABAAIJLFtInWmhIh2AoIAAAAIgBgBIAAgCIABAAIBzgoIhPhHIgBAAIAAgBIABgBIAAAAIABgBIBSBIIJAjHIqSBzIgBgBIAAgDIABAAIKZh0IAAACIAAABIAAABIgBABIgBAAIAAABIABABIpDDIIHXGiIgBABIgBABIAAABIAAABIgCABIAAABg");
	this.shape_89.setTransform(44.7,-93.8,0.72,0.72,24.7);

	this.shape_90 = new cjs.Shape();
	this.shape_90.graphics.f("#666666").s().p("AgwEMIAAABIgBgBIgBAAIAAAAIgBAAIBgnBIhrGoIgBABIgCAAIgBgBICBn9IABgCIACAAIABACIgCAIIABAAIhyIPg");
	this.shape_90.setTransform(-116,-203.9,0.72,0.72,24.7);

	this.shape_91 = new cjs.Shape();
	this.shape_91.graphics.f("#666666").s().p("AgBF+IAAr7IADAAIAAL7g");
	this.shape_91.setTransform(-115.2,-193.7,0.72,0.72,24.7);

	this.shape_92 = new cjs.Shape();
	this.shape_92.graphics.f("#666666").s().p("Ai9CbIgBAAIAAAAIF5k1IABABIAAgBIAAgBIABAAIABABIABAAIAAABIl6E1IgBAAg");
	this.shape_92.setTransform(-121.1,-215.4,0.72,0.72,24.7);

	this.shape_93 = new cjs.Shape();
	this.shape_93.graphics.f("#666666").s().p("ABBCFIAAAAIgMgZIgCgEIhfi5IAAAAIABAAIAAAAIABgBIgJgRIAAABIgCAAIgBgCIgNgfIABgBIACAAIABABIACAEIAAABIABABIB5DyIABACIAGANIAAABIgBAAgAAwBjIADAFIACAEIAAABg");
	this.shape_93.setTransform(-127.7,-178.6,0.72,0.72,24.7);

	this.shape_94 = new cjs.Shape();
	this.shape_94.graphics.f("#666666").s().p("Ai6gdIgBgBIAAgCIACAAIF0A+IABABIAAACIgCAAg");
	this.shape_94.setTransform(-140.2,-194.9,0.72,0.72,24.7);

	this.shape_95 = new cjs.Shape();
	this.shape_95.graphics.f("#666666").s().p("ACBBzIkDjhIgBgCIABgBIABAAIABgBIECDhIABACIgBABIAAABg");
	this.shape_95.setTransform(-133.6,-198.7,0.72,0.72,24.7);

	this.shape_96 = new cjs.Shape();
	this.shape_96.graphics.f("#666666").s().p("Aj3iOIAAgBIAAgBIABgBIABAAIHtEgIAAABIgBACIgBAAIAAAAg");
	this.shape_96.setTransform(-139.8,-185.3,0.72,0.72,24.7);

	this.shape_97 = new cjs.Shape();
	this.shape_97.graphics.f("#666666").s().p("ACZCdIk0k3IABAAIAAgCIACAAIAAAAIE0E3IAAAAIgBABIgBABIAAAAg");
	this.shape_97.setTransform(-158,-219.2,0.72,0.72,24.7);

	this.shape_98 = new cjs.Shape();
	this.shape_98.graphics.f("#666666").s().p("AAvAeIhDBeIAAAAIgBAAIgCgBIAAgBIBDheImJjZIAAgBIAAAAIAAgBIABgBIAAAAIgBAAIAAgBIAAgBIAAgBIABgBIGoCaIAAAAIAAADIgBAAImliYIGIDYIAigvIABAAIACACIAAAAIgiAvIEuCmIAAACIgBABIgBABg");
	this.shape_98.setTransform(-146,-211.1,0.72,0.72,24.7);

	this.shape_99 = new cjs.Shape();
	this.shape_99.graphics.f("#666666").s().p("ACHGDIkRsEIACgBIABAAIAAAAIABAAIERMFIgDABg");
	this.shape_99.setTransform(140.2,-60.6,0.72,0.72,24.7);

	this.shape_100 = new cjs.Shape();
	this.shape_100.graphics.f("#666666").s().p("Ajvi/IACgDIAAgBIHdGEIAAAAIgBACIgBABg");
	this.shape_100.setTransform(62,-43.8,0.72,0.72,24.7);

	this.shape_101 = new cjs.Shape();
	this.shape_101.graphics.f("#666666").s().p("AAQCpIgglPIAAgCIABABIAhFPIgBABg");
	this.shape_101.setTransform(47.3,-52.3,0.72,0.72,24.7);

	this.shape_102 = new cjs.Shape();
	this.shape_102.graphics.f("#666666").s().p("AAQCqIAAgBIAAAAIghlRIABAAIABgBIABABIAAAAIAAAAIAAACIAgFQg");
	this.shape_102.setTransform(47.2,-52.4,0.72,0.72,24.7);

	this.shape_103 = new cjs.Shape();
	this.shape_103.graphics.f("#666666").s().p("AgVEUIAqonIACAAIgrIng");
	this.shape_103.setTransform(-109.9,-36.4,0.72,0.72,24.7);

	this.shape_104 = new cjs.Shape();
	this.shape_104.graphics.f("#666666").s().p("AgVEUIgBgBIAAAAIAromIACAAIgrIng");
	this.shape_104.setTransform(-110.1,-36.5,0.72,0.72,24.7);

	this.shape_105 = new cjs.Shape();
	this.shape_105.graphics.f("#666666").s().p("AhnD2IgBgBIgBAAIAAAAIDQnrIABAAIACABIAAABIjQHqg");
	this.shape_105.setTransform(-114.9,-41.2,0.72,0.72,24.7);

	this.shape_106 = new cjs.Shape();
	this.shape_106.graphics.f("#666666").s().p("AhIgXIAAgBIAAAAIABgCIABgBICPAzIgBABIgBACIABABg");
	this.shape_106.setTransform(-125.3,-22.6,0.72,0.72,24.7);

	this.shape_107 = new cjs.Shape();
	this.shape_107.graphics.f("#666666").s().p("AghBfIgBAAIgBgBIBEi8IAAAAIACAAIABABIhEC8IAAAAg");
	this.shape_107.setTransform(-93.5,-61.2,0.72,0.72,24.7);

	this.shape_108 = new cjs.Shape();
	this.shape_108.graphics.f("#666666").s().p("AgnFOIgBAAIAAAAIBCqbIAAAAIAAAAIACAAIABAAIACAAIABAAIAKG6IgBAAIgDAAIgBAAIgJmvIhBKQIAAAAg");
	this.shape_108.setTransform(-86.2,-77,0.72,0.72,24.7);

	this.shape_109 = new cjs.Shape();
	this.shape_109.graphics.f("#666666").s().p("AjJgpIgBAAIAAAAIAAgCIABgBIAAAAIAAAAIGTBWIABABIAAABIgBABg");
	this.shape_109.setTransform(-107.6,-8.2,0.72,0.72,24.7);

	this.shape_110 = new cjs.Shape();
	this.shape_110.graphics.f("#666666").s().p("AgxAWIABgBIAAgBIBfgqIAAAAIABAAIABABIAAABIAAABIheAqIgBAAIgBABg");
	this.shape_110.setTransform(-134.3,-27.4,0.72,0.72,24.7);

	this.shape_111 = new cjs.Shape();
	this.shape_111.graphics.f("#666666").s().p("AlwDqIgBgBIAAgBIAAAAIAAgBILhnRIAAABIABAAIABABIAAABIAAABIriHQg");
	this.shape_111.setTransform(105,-26.9,0.72,0.72,24.7);

	this.shape_112 = new cjs.Shape();
	this.shape_112.graphics.f("#666666").s().p("Ai0EuIgBgBIAAAAIAdirIiLBwIgCAAIAAgBIAAgBIAAAAIAAgBICOhyIA7laIhvhNIAAAAIACgCIAAgBIBuBMIAMhFIAAgBIABABIACAAIAAAAIgMBHIF+EKIAAABIgBACIgMgJIALAJIAAAAIl9kIIg6FUIBEg3IACAAIAAABIAAABIAAAAIAAABIhHA5IgdCuIgBAAIAAABg");
	this.shape_112.setTransform(-67.2,-5.7,0.72,0.72,24.7);

	this.shape_113 = new cjs.Shape();
	this.shape_113.graphics.f("#666666").s().p("AAXBdIgxi4IABgCIACAAIABABIAxC4IgBABIgBAAIgBABg");
	this.shape_113.setTransform(-248.7,-66.8,0.72,0.72,24.7);

	this.shape_114 = new cjs.Shape();
	this.shape_114.graphics.f("#666666").s().p("AhsJNIAAgBICCi7IAXhPIhOkHIlTBKIgBgBIAAAAIAAgBIAAgBIFThLIh2mMIjugCIAAgBIgBAAIAAAAIgBgBIABgBIDuACIhJj0IABgBIACAAIAAAAIBKD1ICcABIABAAIAAAAIABABIAAABIgBABIicgBIB2GLICkgkIBBjfIinh7IABgBIABgCIABAAIClB7IARg6IABAAIAAgBIABABIABAAIABABIAAABIAAAAIgQA8IC8CMIgBAAIgCACIi6iKIg4DXIBWgSIAAACIAAABIAAAAIhXATIhSE7IgBAAIAAABIgCAAIgBgBIAAAAIBSk6IgGABIhYEtIAEAMIgBAAIgBAAIgBABIgBgBIgCgFIgSA/IAVgfIACAAIAAAAIAAAAIACgDIACAAIABAAIAAABIg1B5IAAABIgBAAIgBABIgBAAIAAgBIgBgBIAGgNIgBAAIgBgBIgBAAIAQg1Ih0CmIBShTIACACIABABIAAAAIAAABIhUBTIgBAAIgBgCIAAAAIAAAAIgHAJIgCABgAhgJGIAAABIAMgMgAAaGTIgQA3IAmhWgAgdA6IBMEBIBWklgACKARIAGgCIAsiog");
	this.shape_114.setTransform(-57.6,-64.4,0.72,0.72,24.7);

	this.shape_115 = new cjs.Shape();
	this.shape_115.graphics.f("#666666").s().p("Ah0hrIABgCIACAAIDlDXIABABIAAABIgBABIAAAAIgCABg");
	this.shape_115.setTransform(-24.9,-44.3,0.72,0.72,24.7);

	this.shape_116 = new cjs.Shape();
	this.shape_116.graphics.f("#666666").s().p("AlXCoIAAgBIgBAAIERjeIhjgIIgBgBIAAgBIgKAAIgBAAIAAgBIAAgCIACAAIAAAAIAAgBIAAgBIAAAAIABgBIDyhhIACAAIAAAAIABABIgBABIAAABIjxBgICCgGIBmhUIAAAAIACABIAAABIh4BjIEIAWIjigiIgBAAIAAgCIAAgBIAAAAIAAgCIABgBIDXgBIh1hYIgBgCIABgBIABgBIB5BcICUgBIAAABIABAAIgBACIgBABIiOABIA0AnIABABIAAACIgCAAIAAAAIg4gqIjVABIECAnIABAAIAAACIgCACIkygZIkTDggAighCIBdAIIAQgOg");
	this.shape_116.setTransform(-156.1,-33.1,0.72,0.72,24.7);

	this.shape_117 = new cjs.Shape();
	this.shape_117.graphics.f("#666666").s().p("AA3B5IiDgMIgBgBIAAgBIAAAAIAAgBIABgBIB9AMIlzkIIABAAIAAgBIABgBIABgBIF4ELIEIAYIABABIAAABIABABIgBAAIAAABIkDgYIAlAbIAAAAIAAABIgBAAIAAACIgBAAg");
	this.shape_117.setTransform(-37.1,-90.4,0.72,0.72,24.7);

	this.shape_118 = new cjs.Shape();
	this.shape_118.graphics.f("#666666").s().p("AhRB2IAAgCICgjpIABAAIABgBIABABIAAABIAAABIihDpIgBABg");
	this.shape_118.setTransform(-175.6,-37.7,0.72,0.72,24.7);

	this.shape_119 = new cjs.Shape();
	this.shape_119.graphics.f("#666666").s().p("AhAgrIAAgBIAAgBIAAgBIABAAIABAAIB/BaIAAABIAAABIAAABIgBAAIgBAAg");
	this.shape_119.setTransform(-59.4,-22.6,0.72,0.72,24.7);

	this.shape_120 = new cjs.Shape();
	this.shape_120.graphics.f("#666666").s().p("AgKAtIAAgBIgBAAIAUhXIABgBIABAAIAAAAIABABIgTBXIgBABg");
	this.shape_120.setTransform(-53.6,-19.7,0.72,0.72,24.7);

	this.shape_121 = new cjs.Shape();
	this.shape_121.graphics.f("#666666").s().p("AhIAAIgBAAIAAgCIABgBIAAAAICQAEIABAAIAAACIAAAAIAAABg");
	this.shape_121.setTransform(-57,-25.6,0.72,0.72,24.7);

	this.shape_122 = new cjs.Shape();
	this.shape_122.graphics.f("#666666").s().p("Ah5GBIgBgBIA9mcIhyg1IgBgBIAAgBIABgBIAAgBIBzA1IAOhmIiMArIgDAAIAAgBIgBgBIABgCICQgrIAijpIAAgBIACgKIABgCIACAAIABACIggDtIgBACIgCAAIAAgCIgSByID5BzIAAABIgBABIgBACIj3hzIg9Gcg");
	this.shape_122.setTransform(-31,-45.3,0.72,0.72,24.7);

	this.shape_123 = new cjs.Shape();
	this.shape_123.graphics.f("#666666").s().p("AAsDjIgBgCIhYnCIABgBIABAAIABABIAAAAIBYHCIAAAAIgBACg");
	this.shape_123.setTransform(-109.1,-111.2,0.72,0.72,24.7);

	this.shape_124 = new cjs.Shape();
	this.shape_124.graphics.f("#333333").s().p("AgHAWQgXgJAHgWQAHgRASACQATACAEATQABAFgCAHQgHAQgNAAQgEAAgHgDg");
	this.shape_124.setTransform(99.4,210.2,0.72,0.72,24.7);

	this.shape_125 = new cjs.Shape();
	this.shape_125.graphics.f("#333333").s().p("AgGASQgSgHAGgSQAGgOAOACQAPACADAPQABAEgCAGQgFAMgLAAQgDAAgGgCg");
	this.shape_125.setTransform(93.3,202,0.72,0.72,24.7);

	this.shape_126 = new cjs.Shape();
	this.shape_126.graphics.f("#333333").s().p("AgTADQgEgSAUgDQATgDAEATQAEASgVADIgEABQgPAAgDgRg");
	this.shape_126.setTransform(93.3,169.9,0.72,0.72,24.7);

	this.shape_127 = new cjs.Shape();
	this.shape_127.graphics.f("#333333").s().p("AgTADQgDgSATgDQATgDAEATQAEASgVADIgEAAQgPAAgDgQg");
	this.shape_127.setTransform(79.5,156.1,0.72,0.72,24.7);

	this.shape_128 = new cjs.Shape();
	this.shape_128.graphics.f("#333333").s().p("AgSAGQgHgRATgGQASgGAHARQAGASgTAGQgFACgDAAQgLAAgFgOg");
	this.shape_128.setTransform(142.1,176.6,0.72,0.72,24.7);

	this.shape_129 = new cjs.Shape();
	this.shape_129.graphics.f("#333333").s().p("AgRADQgDgRARgCQARgDAEARQADAQgSADIgDABQgOAAgDgPg");
	this.shape_129.setTransform(84.9,179.1,0.72,0.72,24.7);

	this.shape_130 = new cjs.Shape();
	this.shape_130.graphics.f("#333333").s().p("AgWAGQgGgVAXgGQAWgGAGAWQAGAVgXAHIgIABQgPAAgFgSg");
	this.shape_130.setTransform(-61.9,106.6,0.72,0.72,24.7);

	this.shape_131 = new cjs.Shape();
	this.shape_131.graphics.f("#333333").s().p("AgWAEQgDgVAWgEQAVgDAFAVQADAWgWADIgFAAQgRAAgEgSg");
	this.shape_131.setTransform(41.1,117.8,0.72,0.72,24.7);

	this.shape_132 = new cjs.Shape();
	this.shape_132.graphics.f("#333333").s().p("AgTAGQgGgTAUgGQASgGAHATQAIATgVAGIgJACQgNAAgEgPg");
	this.shape_132.setTransform(6.1,125.2,0.72,0.72,24.7);

	this.shape_133 = new cjs.Shape();
	this.shape_133.graphics.f("#333333").s().p("AgTAHQgGgTATgGQATgHAHATQAHATgUAHIgIABQgNAAgFgOg");
	this.shape_133.setTransform(11.9,119.8,0.72,0.72,24.7);

	this.shape_134 = new cjs.Shape();
	this.shape_134.graphics.f("#333333").s().p("AgLAPQgOgLAIgOQAHgLAMACQANABAEAMQAEALgJAJQgGAGgHAAQgFAAgHgFg");
	this.shape_134.setTransform(18.4,145,0.72,0.72,24.7);

	this.shape_135 = new cjs.Shape();
	this.shape_135.graphics.f("#333333").s().p("AgSAFQgFgRATgGQASgFAFATQAGARgUAGIgHABQgMAAgEgPg");
	this.shape_135.setTransform(-44.2,129.2,0.72,0.72,24.7);

	this.shape_136 = new cjs.Shape();
	this.shape_136.graphics.f("#333333").s().p("AgSAFQgFgRATgFQASgFAFASQAGARgTAFIgHABQgNAAgEgOg");
	this.shape_136.setTransform(-16.8,128.2,0.72,0.72,24.7);

	this.shape_137 = new cjs.Shape();
	this.shape_137.graphics.f("#333333").s().p("AgSAFQgFgRATgGQASgFAFATQAGARgTAFIgHACQgNAAgEgPg");
	this.shape_137.setTransform(-8,125.6,0.72,0.72,24.7);

	this.shape_138 = new cjs.Shape();
	this.shape_138.graphics.f("#333333").s().p("AgFARQgOgEABgOQABgQAQgBQAPgBAEAPQACAGgEAIQgFAJgJAAIgHgCg");
	this.shape_138.setTransform(-6.6,142,0.72,0.72,24.7);

	this.shape_139 = new cjs.Shape();
	this.shape_139.graphics.f("#333333").s().p("AgRAFQgFgRASgEQARgGAFASQAFARgSAEIgGACQgMAAgEgOg");
	this.shape_139.setTransform(-48,158.8,0.72,0.72,24.7);

	this.shape_140 = new cjs.Shape();
	this.shape_140.graphics.f("#333333").s().p("AAAASQgcgDANgXQAGgKALABQAMACADALQAJAWgXAAIgDAAg");
	this.shape_140.setTransform(28.5,125.7,0.72,0.72,24.7);

	this.shape_141 = new cjs.Shape();
	this.shape_141.graphics.f("#333333").s().p("AgRAFQgFgRASgEQAQgFAFARQAGAQgSAFIgGABQgMAAgEgNg");
	this.shape_141.setTransform(-22.5,136.7,0.72,0.72,24.7);

	this.shape_142 = new cjs.Shape();
	this.shape_142.graphics.f("#333333").s().p("AgQAFQgFgQARgFQAQgEAFAQQAFAQgSAFIgFABQgMAAgDgNg");
	this.shape_142.setTransform(-51.6,115.6,0.72,0.72,24.7);

	this.shape_143 = new cjs.Shape();
	this.shape_143.graphics.f("#333333").s().p("AgQAFQgEgQAQgFQAQgEAFAQQAFAQgRAFIgGABQgLAAgEgNg");
	this.shape_143.setTransform(-52.7,125.6,0.72,0.72,24.7);

	this.shape_144 = new cjs.Shape();
	this.shape_144.graphics.f("#333333").s().p("AgVAGQgGgVAWgGQAVgGAHAWQAEAVgWAGIgHABQgPAAgEgRg");
	this.shape_144.setTransform(-117.7,69.3,0.72,0.72,24.7);

	this.shape_145 = new cjs.Shape();
	this.shape_145.graphics.f("#333333").s().p("AgRAFQgFgRASgFQARgFAGASQAEARgSAFIgHABQgLAAgEgOg");
	this.shape_145.setTransform(-114.8,53.3,0.72,0.72,24.7);

	this.shape_146 = new cjs.Shape();
	this.shape_146.graphics.f("#333333").s().p("AgKANQgNgLALgNQAHgIAJACQALACADALQACAIgFAIQgHAHgHAAQgFAAgGgGg");
	this.shape_146.setTransform(-95.4,68.2,0.72,0.72,24.7);

	this.shape_147 = new cjs.Shape();
	this.shape_147.graphics.f("#333333").s().p("AgHAQQgMgGADgNQADgNANgBQANAAAEANQACAFgDAHIgCAEQgGAGgHAAQgDAAgFgCg");
	this.shape_147.setTransform(-114.8,76.2,0.72,0.72,24.7);

	this.shape_148 = new cjs.Shape();
	this.shape_148.graphics.f("#333333").s().p("AgRAOQgKgMAIgNQAHgMAPABQAQABADAPQADAIgEAIQgFAIgJADQgEACgDAAQgJAAgIgJg");
	this.shape_148.setTransform(202.7,-8.1,0.72,0.72,24.7);

	this.shape_149 = new cjs.Shape();
	this.shape_149.graphics.f("#333333").s().p("AgKAUQgUgKAMgTQAMgUARAKQATALgLASQgHANgLAAQgEAAgHgDg");
	this.shape_149.setTransform(186,-12.6,0.72,0.72,24.7);

	this.shape_150 = new cjs.Shape();
	this.shape_150.graphics.f("#333333").s().p("AgHAWQgVgIAIgUQAJgWATAHQAVAJgIATQgHAQgNAAQgDAAgFgBg");
	this.shape_150.setTransform(173.3,-35,0.72,0.72,24.7);

	this.shape_151 = new cjs.Shape();
	this.shape_151.graphics.f("#333333").s().p("AgDAVQgWgEAEgUQAEgWAVAEQAWAFgEAUQgDASgQAAIgGgBg");
	this.shape_151.setTransform(78.3,-103.4,0.72,0.72,24.7);

	this.shape_152 = new cjs.Shape();
	this.shape_152.graphics.f("#333333").s().p("AgUAGQgGgUAVgGQAUgFAGAUQAFAUgVAGIgHABQgOAAgEgQg");
	this.shape_152.setTransform(-54.4,-111.2,0.72,0.72,24.7);

	this.shape_153 = new cjs.Shape();
	this.shape_153.graphics.f("#333333").s().p("AgKASQgRgKAKgRQALgTAQAKQATAKgLASQgHAMgKAAQgEAAgHgEg");
	this.shape_153.setTransform(22.5,-109,0.72,0.72,24.7);

	this.shape_154 = new cjs.Shape();
	this.shape_154.graphics.f("#333333").s().p("AgUAGQgFgUAVgFQATgGAFAVQAGATgVAFIgHABQgNAAgFgPg");
	this.shape_154.setTransform(29,-116.5,0.72,0.72,24.7);

	this.shape_155 = new cjs.Shape();
	this.shape_155.graphics.f("#333333").s().p("AgUAEQgDgTAUgEQAUgEAEAUQACATgUAEIgFABQgPAAgDgRg");
	this.shape_155.setTransform(143,-91.4,0.72,0.72,24.7);

	this.shape_156 = new cjs.Shape();
	this.shape_156.graphics.f("#333333").s().p("AgIASQgSgIAIgSQAJgSARAIQATAJgIASQgGAMgLAAQgEAAgGgDg");
	this.shape_156.setTransform(51.6,-65,0.72,0.72,24.7);

	this.shape_157 = new cjs.Shape();
	this.shape_157.graphics.f("#333333").s().p("AgJASQgRgJAKgRQAJgSAQAJQASAKgKAQQgGAMgKAAQgEAAgGgDg");
	this.shape_157.setTransform(43,-39.7,0.72,0.72,24.7);

	this.shape_158 = new cjs.Shape();
	this.shape_158.graphics.f("#333333").s().p("AgBAVQgUgCACgTQACgVATABQAUACgCAUQgCATgRAAIgCAAg");
	this.shape_158.setTransform(50.5,-27,0.72,0.72,24.7);

	this.shape_159 = new cjs.Shape();
	this.shape_159.graphics.f("#333333").s().p("AgSAHQgHgSATgHQASgHAHATQAHASgTAHQgFACgEAAQgLAAgFgOg");
	this.shape_159.setTransform(84.6,11.5,0.72,0.72,24.7);

	this.shape_160 = new cjs.Shape();
	this.shape_160.graphics.f("#333333").s().p("AgSADQgDgTATgDQATgDADAUQADATgVADIgDABQgPAAgCgSg");
	this.shape_160.setTransform(72.4,-22.7,0.72,0.72,24.7);

	this.shape_161 = new cjs.Shape();
	this.shape_161.graphics.f("#333333").s().p("AgRAHQgHgRATgHQARgGAGARQAHARgSAHQgGACgDAAQgKAAgFgNg");
	this.shape_161.setTransform(30.3,-21.1,0.72,0.72,24.7);

	this.shape_162 = new cjs.Shape();
	this.shape_162.graphics.f("#333333").s().p("AgRAHQgGgRASgGQARgHAGARQAHARgTAGQgFACgDAAQgKAAgFgMg");
	this.shape_162.setTransform(76.5,-6,0.72,0.72,24.7);

	this.shape_163 = new cjs.Shape();
	this.shape_163.graphics.f("#333333").s().p("AgQAAQAAgQAQAAQARAAgBAQQAAARgQAAQgQAAAAgRg");
	this.shape_163.setTransform(39.6,-1.1,0.72,0.72,24.7);

	this.shape_164 = new cjs.Shape();
	this.shape_164.graphics.f("#333333").s().p("AgTAEQgEgTAVgDQATgEADATQADATgUAEIgEAAQgPAAgDgQg");
	this.shape_164.setTransform(137.5,-31.2,0.72,0.72,24.7);

	this.shape_165 = new cjs.Shape();
	this.shape_165.graphics.f("#333333").s().p("AgRAFQgFgRASgEQARgFAFARQAEARgRAFIgGABQgMAAgEgOg");
	this.shape_165.setTransform(-19.7,-71,0.72,0.72,24.7);

	this.shape_166 = new cjs.Shape();
	this.shape_166.graphics.f("#333333").s().p("AgVAAQAAgVAVAAQAWAAABAVQgBAWgWAAQgVAAAAgWg");
	this.shape_166.setTransform(-64.6,-39.4,0.72,0.72,24.7);

	this.shape_167 = new cjs.Shape();
	this.shape_167.graphics.f("#333333").s().p("AgHAPQgMACgIgKQgHgIAFgLQAEgKALgCQALgBAGAHQAIgDAJAFQAJAEACAJQAGARgSAIQgGADgFAAQgJAAgGgKg");
	this.shape_167.setTransform(-4,84.5,0.72,0.72,24.7);

	this.shape_168 = new cjs.Shape();
	this.shape_168.graphics.f("#333333").s().p("AgUAIQgHgTAVgIQATgIAIAUQAIATgVAIQgGACgEAAQgNAAgFgOg");
	this.shape_168.setTransform(-180.5,-1.2,0.72,0.72,24.7);

	this.shape_169 = new cjs.Shape();
	this.shape_169.graphics.f("#333333").s().p("AgOAQQgOgQAOgNQAOgPAPAOIAFAIQAGAPgPAJQgGAEgFAAQgHAAgHgGg");
	this.shape_169.setTransform(-181.4,14.1,0.72,0.72,24.7);

	this.shape_170 = new cjs.Shape();
	this.shape_170.graphics.f("#333333").s().p("AgSAIQgHgSATgIQATgIAGATQAIASgTAHQgGADgEAAQgMAAgEgNg");
	this.shape_170.setTransform(-151.5,32,0.72,0.72,24.7);

	this.shape_171 = new cjs.Shape();
	this.shape_171.graphics.f("#333333").s().p("AgQAHQgGgQARgGQAQgGAGAQQAGAPgRAGQgFACgDAAQgKAAgEgLg");
	this.shape_171.setTransform(-194.2,18.9,0.72,0.72,24.7);

	this.shape_172 = new cjs.Shape();
	this.shape_172.graphics.f("#333333").s().p("AgQAGQgGgPARgGQAQgGAGAQQAGAPgRAGQgFACgDAAQgKAAgEgMg");
	this.shape_172.setTransform(-197.4,5.2,0.72,0.72,24.7);

	this.shape_173 = new cjs.Shape();
	this.shape_173.graphics.f("#333333").s().p("AgMAMQgJgKAHgLQAFgHAIgBQAHAAAGAFQAMAMgMAMQgHAGgFAAQgGAAgGgGg");
	this.shape_173.setTransform(-194,-10.7,0.72,0.72,24.7);

	this.shape_174 = new cjs.Shape();
	this.shape_174.graphics.f("#333333").s().p("AgPAGQgGgPAQgFQAPgHAGAQQAGAOgQAGIgHACQgKAAgEgLg");
	this.shape_174.setTransform(-158.9,17.5,0.72,0.72,24.7);

	this.shape_175 = new cjs.Shape();
	this.shape_175.graphics.f("#333333").s().p("AgTAHQgHgTAUgGQATgIAHAUQAHATgUAGQgFACgEAAQgMAAgFgOg");
	this.shape_175.setTransform(-186.1,-125.1,0.72,0.72,24.7);

	this.shape_176 = new cjs.Shape();
	this.shape_176.graphics.f("#333333").s().p("AgTAHQgHgSAUgHQATgHAHATQAHASgUAHQgFACgEAAQgMAAgFgOg");
	this.shape_176.setTransform(-175.8,-114.4,0.72,0.72,24.7);

	this.shape_177 = new cjs.Shape();
	this.shape_177.graphics.f("#333333").s().p("AgRAGQgGgQASgGQARgGAGARQAGAQgSAGIgHACQgLAAgFgNg");
	this.shape_177.setTransform(-158.9,-123.1,0.72,0.72,24.7);

	this.shape_178 = new cjs.Shape();
	this.shape_178.graphics.f("#333333").s().p("AgQAJQgHgLAJgLQAHgIAKACQAKACAFAKQAEAIgFAJQgFAKgKAAIABAAIgCAAQgLAAgGgLg");
	this.shape_178.setTransform(-103.1,-220,0.72,0.72,24.7);

	this.shape_179 = new cjs.Shape();
	this.shape_179.graphics.f("#333333").s().p("AAGAlQgKgBgFgLQgGgLAHgJQgQgCgCgQQgCgRAQgFQANgEAKANQAJANgJALQAKACAEAIQAFAKgGAKQgGAJgKAAIgCAAg");
	this.shape_179.setTransform(-128.1,-188,0.72,0.72,24.7);

	this.shape_180 = new cjs.Shape();
	this.shape_180.graphics.f("#333333").s().p("AgRAIQgJgQATgJQARgIAIASQAIAQgSAIQgFADgEAAQgKAAgGgMg");
	this.shape_180.setTransform(-127.3,-167.5,0.72,0.72,24.7);

	this.shape_181 = new cjs.Shape();
	this.shape_181.graphics.f("#333333").s().p("AgSAGQgGgRATgHQARgFAHASQAGARgTAGIgHACQgMAAgFgOg");
	this.shape_181.setTransform(-163.9,-235.3,0.72,0.72,24.7);

	this.shape_182 = new cjs.Shape();
	this.shape_182.graphics.f("#333333").s().p("AgRAFQgGgSASgFQARgFAGATQAGARgSAGIgGABQgMAAgFgPg");
	this.shape_182.setTransform(-152.2,-203.1,0.72,0.72,24.7);

	this.shape_183 = new cjs.Shape();
	this.shape_183.graphics.f("#333333").s().p("AAAATQgIAAgFgGQgIgIAEgLQAEgLAMgBIgBAAQAMgCAHAMQAGALgIAKQgFAGgJAAIgBAAg");
	this.shape_183.setTransform(-138.9,-210.7,0.72,0.72,24.7);

	this.shape_184 = new cjs.Shape();
	this.shape_184.graphics.f("#333333").s().p("AgQAGQgFgQAQgFQAQgGAGAQQAFAQgQAFIgHACQgLAAgEgMg");
	this.shape_184.setTransform(-164.2,-150.5,0.72,0.72,24.7);

	this.shape_185 = new cjs.Shape();
	this.shape_185.graphics.f("#333333").s().p("AgKANQgNgLALgMQALgNAMALQANALgLAMQgGAHgGAAQgFAAgGgFg");
	this.shape_185.setTransform(-138.1,-173.1,0.72,0.72,24.7);

	this.shape_186 = new cjs.Shape();
	this.shape_186.graphics.f("#333333").s().p("AgNAHQgHgNAOgHQANgHAHAOQAHANgOAHQgFACgDAAQgIAAgEgJg");
	this.shape_186.setTransform(-105.1,-127.9,0.72,0.72,24.7);

	this.shape_187 = new cjs.Shape();
	this.shape_187.graphics.f("#333333").s().p("AgTAHQgHgSAUgHQATgHAHATQAHASgUAHQgGACgDAAQgMAAgFgOg");
	this.shape_187.setTransform(-182.6,-75.2,0.72,0.72,24.7);

	this.shape_188 = new cjs.Shape();
	this.shape_188.graphics.f("#333333").s().p("AgSAGQgGgRASgGQASgGAHARQAGARgTAHQgFACgDAAQgLAAgFgOg");
	this.shape_188.setTransform(-206.7,-80.7,0.72,0.72,24.7);

	this.shape_189 = new cjs.Shape();
	this.shape_189.graphics.f("#333333").s().p("AgQAGQgGgQARgFQAPgGAHAQQAGAPgRAGIgIACQgKAAgEgMg");
	this.shape_189.setTransform(-199.7,-66.1,0.72,0.72,24.7);

	this.shape_190 = new cjs.Shape();
	this.shape_190.graphics.f("#333333").s().p("AgSAHQgGgRASgHQASgHAHASQAHARgTAHQgFACgEAAQgLAAgFgNg");
	this.shape_190.setTransform(-156.5,-39.3,0.72,0.72,24.7);

	this.shape_191 = new cjs.Shape();
	this.shape_191.graphics.f("#333333").s().p("AgFASQgRgGAFgRQAGgSAQAFQATAFgGASQgFAPgMAAIgGgCg");
	this.shape_191.setTransform(-166.3,-43.2,0.72,0.72,24.7);

	this.shape_192 = new cjs.Shape();
	this.shape_192.graphics.f("#333333").s().p("AgEARQgOgEABgOQACgPAPgCIgBABQAVgDgCAVQgCASgNAAIgHgCg");
	this.shape_192.setTransform(-184.9,-32.2,0.72,0.72,24.7);

	this.shape_193 = new cjs.Shape();
	this.shape_193.graphics.f("#333333").s().p("AgQAGQgGgQARgGQARgGAFAQQAHAQgSAHQgFACgDAAQgKAAgEgNg");
	this.shape_193.setTransform(-146.3,-42.2,0.72,0.72,24.7);

	this.shape_194 = new cjs.Shape();
	this.shape_194.graphics.f("#333333").s().p("AgTAHQgGgSATgHQATgHAHATQAHASgUAHQgFACgEAAQgMAAgFgOg");
	this.shape_194.setTransform(-188.5,-107.7,0.72,0.72,24.7);

	this.shape_195 = new cjs.Shape();
	this.shape_195.graphics.f("#333333").s().p("AgRAHQgHgRATgGQARgHAGARQAHARgTAHQgFABgDAAQgLAAgEgMg");
	this.shape_195.setTransform(-171.2,-98.1,0.72,0.72,24.7);

	this.shape_196 = new cjs.Shape();
	this.shape_196.graphics.f("#333333").s().p("AgQAGQgGgQARgFQAQgGAGAQQAGAQgRAGIgHABQgKAAgFgMg");
	this.shape_196.setTransform(-199.7,-115.9,0.72,0.72,24.7);

	this.shape_197 = new cjs.Shape();
	this.shape_197.graphics.f("#333333").s().p("AgTAFQgFgSAUgFQASgFAGATQAEASgTAGIgHABQgMAAgFgQg");
	this.shape_197.setTransform(-99.6,-55.1,0.72,0.72,24.7);

	this.shape_198 = new cjs.Shape();
	this.shape_198.graphics.f("#333333").s().p("AgHATQgSgIAIgSQAIgTARAIQASAIgIARQgGAOgLAAQgDAAgFgCg");
	this.shape_198.setTransform(-87.4,-67.4,0.72,0.72,24.7);

	this.shape_199 = new cjs.Shape();
	this.shape_199.graphics.f("#333333").s().p("AgUAEQgDgTAUgDQAUgEADATQAEATgUAEIgFAAQgQAAgDgQg");
	this.shape_199.setTransform(-250,-58.9,0.72,0.72,24.7);

	this.shape_200 = new cjs.Shape();
	this.shape_200.graphics.f("#333333").s().p("AgTAEQgEgSAVgEQATgEADAUQAEASgUADIgFABQgPAAgDgQg");
	this.shape_200.setTransform(-247.3,-74.7,0.72,0.72,24.7);

	this.shape_201 = new cjs.Shape();
	this.shape_201.graphics.f("#333333").s().p("AgHATQgSgIAIgSQAJgSAQAIQASAIgIARQgGANgLAAQgDAAgFgCg");
	this.shape_201.setTransform(-73.6,-99.2,0.72,0.72,24.7);

	this.shape_202 = new cjs.Shape();
	this.shape_202.graphics.f("#333333").s().p("AgOAHQgHgOAPgHQAOgGAHAOQAHAOgPAHQgFACgDAAQgIAAgFgKg");
	this.shape_202.setTransform(-113.2,-94.5,0.72,0.72,24.7);

	this.shape_203 = new cjs.Shape();
	this.shape_203.graphics.f("#333333").s().p("AgOAFQgGgOAQgFQAOgFAFAPQAFAOgOAFIgHABQgJAAgEgLg");
	this.shape_203.setTransform(-198.7,-144.6,0.72,0.72,24.7);

	this.shape_204 = new cjs.Shape();
	this.shape_204.graphics.f("#333333").s().p("AgRALQgMgSASgLQARgLAMATQAMASgTALQgGAEgFAAQgKAAgHgMg");
	this.shape_204.setTransform(-34.4,-76.3,0.72,0.72,24.7);

	this.shape_205 = new cjs.Shape();
	this.shape_205.graphics.f("#333333").s().p("AgUAHQgIgTAVgHQAUgHAIAUQAHAUgVAGQgFACgEAAQgMAAgGgPg");
	this.shape_205.setTransform(149.4,145,0.72,0.72,24.7);

	this.shape_206 = new cjs.Shape();
	this.shape_206.graphics.f("#333333").s().p("AgJATQgTgKALgSQAKgTARAKQATAKgLASQgGAMgLAAQgEAAgGgDg");
	this.shape_206.setTransform(141.2,136,0.72,0.72,24.7);

	this.shape_207 = new cjs.Shape();
	this.shape_207.graphics.f("#333333").s().p("AgTAHQgHgTAUgGQATgHAIATQAGATgUAGIgIACQgNAAgFgOg");
	this.shape_207.setTransform(148.3,124.1,0.72,0.72,24.7);

	this.shape_208 = new cjs.Shape();
	this.shape_208.graphics.f("#333333").s().p("AgUADQgDgTAUgDQAUgDAEAUQAEASgVAEIgFAAQgPAAgEgRg");
	this.shape_208.setTransform(133.6,153.6,0.72,0.72,24.7);

	this.shape_209 = new cjs.Shape();
	this.shape_209.graphics.f("#333333").s().p("AgDAVQgMgCgEgMQgEgKAHgKQAJgKAMADQAMADAEAMQADALgIAIQgHAIgJAAIgDgBg");
	this.shape_209.setTransform(-53.4,45.9,0.72,0.72,24.7);

	this.shape_210 = new cjs.Shape();
	this.shape_210.graphics.f("#333333").s().p("AgTAHQgHgTAUgHQATgHAHAUQAIATgVAHQgFACgEAAQgMAAgFgPg");
	this.shape_210.setTransform(16.7,78.7,0.72,0.72,24.7);

	this.shape_211 = new cjs.Shape();
	this.shape_211.graphics.f("#333333").s().p("AgUAHQgHgSAVgIQAUgHAHATQAIATgVAHQgGACgEAAQgNAAgFgOg");
	this.shape_211.setTransform(234.5,58.8,0.72,0.72,24.7);

	this.shape_212 = new cjs.Shape();
	this.shape_212.graphics.f("#333333").s().p("AgUAGQgFgTAUgFQAUgGAGATQAGATgVAFIgJACQgNAAgEgPg");
	this.shape_212.setTransform(249.9,50.4,0.72,0.72,24.7);

	this.shape_213 = new cjs.Shape();
	this.shape_213.graphics.f("#333333").s().p("AgRAKQgLgSATgKQARgJAKATQALASgTAJQgGADgEAAQgKAAgHgMg");
	this.shape_213.setTransform(-83,-28.8,0.72,0.72,24.7);

	this.shape_214 = new cjs.Shape();
	this.shape_214.graphics.f("#333333").s().p("AAAAVQgVgBACgUQABgWATACQAVABgCAUQgBAUgTAAIAAAAg");
	this.shape_214.setTransform(-72.2,-32.8,0.72,0.72,24.7);

	this.shape_215 = new cjs.Shape();
	this.shape_215.graphics.f("#333333").s().p("AgJATQgTgKALgSQAKgSARAJQASAKgKARQgHANgKAAQgEAAgGgDg");
	this.shape_215.setTransform(124.8,55.6,0.72,0.72,24.7);

	this.shape_216 = new cjs.Shape();
	this.shape_216.graphics.f("#333333").s().p("AgSADQgEgRAUgEQASgDAEASQADASgUAEIgEAAQgOAAgDgQg");
	this.shape_216.setTransform(112,53.4,0.72,0.72,24.7);

	this.shape_217 = new cjs.Shape();
	this.shape_217.graphics.f("#333333").s().p("AgRADQgEgRATgDQARgDAEASQACARgSADIgEAAQgOAAgCgPg");
	this.shape_217.setTransform(93.2,37.9,0.72,0.72,24.7);

	this.shape_218 = new cjs.Shape();
	this.shape_218.graphics.f("#333333").s().p("AgTAFQgFgTAUgFQATgFAFAUQAFATgUAFIgHABQgNAAgEgQg");
	this.shape_218.setTransform(-48.6,7.3,0.72,0.72,24.7);

	this.shape_219 = new cjs.Shape();
	this.shape_219.graphics.f("#333333").s().p("AgTAEQgFgSAUgEQASgFAGATQAFATgVAEIgGABQgNAAgEgQg");
	this.shape_219.setTransform(-120.5,-17.8,0.72,0.72,24.7);

	this.shape_220 = new cjs.Shape();
	this.shape_220.graphics.f("#333333").s().p("AgSAJQgIgRATgJQARgJAIATQAJAQgTAJQgGADgEAAQgKAAgGgMg");
	this.shape_220.setTransform(-130.2,-27.4,0.72,0.72,24.7);

	this.shape_221 = new cjs.Shape();
	this.shape_221.graphics.f("#333333").s().p("AgSAHQgGgQASgIQARgHAHARQAJARgUAIQgGACgDAAQgLAAgFgNg");
	this.shape_221.setTransform(-138.3,-27.4,0.72,0.72,24.7);

	this.shape_222 = new cjs.Shape();
	this.shape_222.graphics.f("#333333").s().p("AgTAFQgFgSAUgGQATgFAFATQAEATgTAGIgHABQgNAAgEgQg");
	this.shape_222.setTransform(-71.3,26.9,0.72,0.72,24.7);

	this.shape_223 = new cjs.Shape();
	this.shape_223.graphics.f("#333333").s().p("AgQAKQgLgRARgKQAQgKALASQALARgRAKQgGAEgFAAQgJAAgHgMg");
	this.shape_223.setTransform(52.7,56.1,0.72,0.72,24.7);

	this.shape_224 = new cjs.Shape();
	this.shape_224.graphics.f("#333333").s().p("AgTADQgEgTAVgDQATgDAEATQACATgUAEIgEAAQgPAAgDgRg");
	this.shape_224.setTransform(81.7,71.6,0.72,0.72,24.7);

	this.shape_225 = new cjs.Shape();
	this.shape_225.graphics.f("#333333").s().p("AgSAHQgHgSASgHQARgHAIASQAIASgSAIQgFACgEAAQgLAAgGgOg");
	this.shape_225.setTransform(-27.8,27.5,0.72,0.72,24.7);

	this.shape_226 = new cjs.Shape();
	this.shape_226.graphics.f("#333333").s().p("AgTAFQgFgSAUgFQATgFAFATQAEASgTAFIgHABQgNAAgEgPg");
	this.shape_226.setTransform(-40.9,-57.2,0.72,0.72,24.7);

	this.shape_227 = new cjs.Shape();
	this.shape_227.graphics.f("#333333").s().p("AgTAGQgFgRATgHQASgGAGASQAHASgUAHQgFACgDAAQgNAAgEgPg");
	this.shape_227.setTransform(18.9,23.5,0.72,0.72,24.7);

	this.shape_228 = new cjs.Shape();
	this.shape_228.graphics.f("#333333").s().p("AgTACQgCgRASgEQARgDAGARQAEAUgVAEIgFABQgPAAgCgSg");
	this.shape_228.setTransform(-73.3,-4,0.72,0.72,24.7);

	this.shape_229 = new cjs.Shape();
	this.shape_229.graphics.f("#333333").s().p("AgDAUQgTgEADgTQAEgTASAEQAUAEgDARQgDARgPAAIgFAAg");
	this.shape_229.setTransform(-20.3,-33,0.72,0.72,24.7);

	this.shape_230 = new cjs.Shape();
	this.shape_230.graphics.f("#333333").s().p("AgNANQgOgNAOgOQAJgIAKAEQAMAEACAMQACAIgHAIQgHAGgHAAQgGAAgIgHg");
	this.shape_230.setTransform(81.6,133.2,0.72,0.72,24.7);

	this.shape_231 = new cjs.Shape();
	this.shape_231.graphics.f("#333333").s().p("AgSAFQgFgSATgFQASgFAFATQAFASgTAFIgHABQgMAAgEgPg");
	this.shape_231.setTransform(-94.8,1.5,0.72,0.72,24.7);

	this.shape_232 = new cjs.Shape();
	this.shape_232.graphics.f("#333333").s().p("AgTADQgDgSAUgDQASgDAEATQAEASgVADIgEAAQgQAAgCgQg");
	this.shape_232.setTransform(131.2,107.6,0.72,0.72,24.7);

	this.shape_233 = new cjs.Shape();
	this.shape_233.graphics.f("#333333").s().p("AgLAOQgQgMANgOQAMgOAPANQAPAMgNANQgGAIgIAAQgFAAgHgGg");
	this.shape_233.setTransform(134.5,87.5,0.72,0.72,24.7);

	this.shape_234 = new cjs.Shape();
	this.shape_234.graphics.f("#333333").s().p("AgLAOQgLgJAGgMQAFgMAMABQAHAAAFAFQAFAEABAHQACAMgLAGQgGADgEAAQgGAAgFgFg");
	this.shape_234.setTransform(105.8,104.5,0.72,0.72,24.7);

	this.shape_235 = new cjs.Shape();
	this.shape_235.graphics.f("#333333").s().p("AgIAPQgOgHAFgOQAFgNAOABQAPACACAOQACAIgHAHQgGAGgGAAQgFAAgFgEg");
	this.shape_235.setTransform(127.8,107.5,0.72,0.72,24.7);

	this.shape_236 = new cjs.Shape();
	this.shape_236.graphics.f("#333333").s().p("AgTAEQgDgTAUgDQATgDADASQAEATgUADIgFABQgPAAgDgQg");
	this.shape_236.setTransform(158.4,11,0.72,0.72,24.7);

	this.shape_237 = new cjs.Shape();
	this.shape_237.graphics.f("#333333").s().p("AgEARQgRgFAGgQQAFgRAPAFQARAFgFAQQgFANgKAAIgGgBg");
	this.shape_237.setTransform(167.6,38.6,0.72,0.72,24.7);

	this.shape_238 = new cjs.Shape();
	this.shape_238.graphics.f("#333333").s().p("AgSAGQgGgRASgGQASgGAHARQAHARgTAHIgIABQgMAAgFgNg");
	this.shape_238.setTransform(192.3,92,0.72,0.72,24.7);

	this.shape_239 = new cjs.Shape();
	this.shape_239.graphics.f("#333333").s().p("AgSAFQgFgRATgFQASgFAFASQAEASgSAFIgGABQgNAAgEgPg");
	this.shape_239.setTransform(-75,25,0.72,0.72,24.7);

	this.shape_240 = new cjs.Shape();
	this.shape_240.graphics.f("#333333").s().p("AgSAHQgGgRASgHQASgHAHASQAGARgSAHQgFACgDAAQgMAAgFgNg");
	this.shape_240.setTransform(65.1,36.9,0.72,0.72,24.7);

	this.shape_241 = new cjs.Shape();
	this.shape_241.graphics.f("#333333").s().p("AgTgBQACgRARAAQAQAAADAQQAEAVgWAAIgBAAQgUAAABgUg");
	this.shape_241.setTransform(49.6,235.2,0.72,0.72,24.7);

	this.shape_242 = new cjs.Shape();
	this.shape_242.graphics.f("#333333").s().p("AgSADQgDgQARgEQARgEAFAQQAHASgUAFIgHABQgNAAgDgQg");
	this.shape_242.setTransform(5.1,194.1,0.72,0.72,24.7);

	this.shape_243 = new cjs.Shape();
	this.shape_243.graphics.f("#333333").s().p("AgSAFQgFgSATgEQASgFAFASQAEARgSAFIgHABQgMAAgEgOg");
	this.shape_243.setTransform(-29.5,-55.6,0.72,0.72,24.7);

	this.shape_244 = new cjs.Shape();
	this.shape_244.graphics.f("#333333").s().p("AgSAFQgEgSATgEQARgFAFASQAFARgTAFIgGABQgNAAgEgOg");
	this.shape_244.setTransform(-46.1,-86.2,0.72,0.72,24.7);

	this.shape_245 = new cjs.Shape();
	this.shape_245.graphics.f("#333333").s().p("AgRAFQgGgRATgFQASgFAFASQAFARgTAFIgHABQgMAAgDgOg");
	this.shape_245.setTransform(14,-8.2,0.72,0.72,24.7);

	this.shape_246 = new cjs.Shape();
	this.shape_246.graphics.f("#333333").s().p("AgQAKQgIgPAQgKQAPgKAKAQIACAFQABAGgDAGQgFALgLAAIgBABQgKAAgGgKg");
	this.shape_246.setTransform(-156.6,109.5,0.72,0.72,24.7);

	this.shape_247 = new cjs.Shape();
	this.shape_247.graphics.f("#333333").s().p("AgRAHQgGgQARgHQARgHAHARQAGAQgSAHQgFACgDAAQgKAAgFgMg");
	this.shape_247.setTransform(-221.5,65.8,0.72,0.72,24.7);

	this.shape_248 = new cjs.Shape();
	this.shape_248.graphics.f("#333333").s().p("AgQAHQgHgQASgHQAQgHAHARQAFAQgRAHQgFACgDAAQgKAAgEgMg");
	this.shape_248.setTransform(-230.4,68.9,0.72,0.72,24.7);

	this.shape_249 = new cjs.Shape();
	this.shape_249.graphics.f("#333333").s().p("AgGAQQgQgHAHgQQAFgKAKAAQAKgBAGAKIACAEQABAHgDAFQgFAKgJAAQgDAAgFgCg");
	this.shape_249.setTransform(-165.9,104.1,0.72,0.72,24.7);

	this.shape_250 = new cjs.Shape();
	this.shape_250.graphics.f("#333333").s().p("AgQAGQgGgPARgGQAQgHAGARQAGAPgRAGQgFACgDAAQgKAAgEgMg");
	this.shape_250.setTransform(-220,51.7,0.72,0.72,24.7);

	this.shape_251 = new cjs.Shape();
	this.shape_251.graphics.f("#333333").s().p("AgLAMQgLgMAMgKQAKgMAMALIAEAGQAFALgMAIQgFADgEAAQgGAAgFgFg");
	this.shape_251.setTransform(-171.3,53.3,0.72,0.72,24.7);

	this.shape_252 = new cjs.Shape();
	this.shape_252.graphics.f("#333333").s().p("AgRAFQgFgRASgFQARgFAGASQAEARgSAFIgHABQgLAAgEgOg");
	this.shape_252.setTransform(-88.8,9.6,0.72,0.72,24.7);

	this.shape_253 = new cjs.Shape();
	this.shape_253.graphics.f("#333333").s().p("AgSAFQgEgQASgGQAQgFAGARQAHARgTAGIgIABQgMAAgEgOg");
	this.shape_253.setTransform(48.4,69.9,0.72,0.72,24.7);

	this.shape_254 = new cjs.Shape();
	this.shape_254.graphics.f("#333333").s().p("AgSAFQgEgRATgFQARgEAEASQAEARgSAEIgFABQgMAAgFgOg");
	this.shape_254.setTransform(-56,-16.7,0.72,0.72,24.7);

	this.shape_255 = new cjs.Shape();
	this.shape_255.graphics.f("#333333").s().p("AgRAFQgFgRASgFQARgEAGARQAEARgSAFIgGABQgMAAgEgOg");
	this.shape_255.setTransform(-60.5,31.7,0.72,0.72,24.7);

	this.shape_256 = new cjs.Shape();
	this.shape_256.graphics.f("#333333").s().p("AgHASQgQgIAHgQQAHgRAPAGQASAHgHARQgFANgLAAQgDAAgFgCg");
	this.shape_256.setTransform(6.6,7.4,0.72,0.72,24.7);

	this.shape_257 = new cjs.Shape();
	this.shape_257.graphics.f("#333333").s().p("AgMAOQgNgMAMgMQALgOAOAKQAPAMgMAOQgIAHgHAAQgFAAgHgFg");
	this.shape_257.setTransform(110.3,88.4,0.72,0.72,24.7);

	this.shape_258 = new cjs.Shape();
	this.shape_258.graphics.f("#333333").s().p("AgRAFQgEgRASgFQAQgFAFASQAFARgSAFIgGABQgMAAgEgOg");
	this.shape_258.setTransform(-62.7,-28.5,0.72,0.72,24.7);

	this.shape_259 = new cjs.Shape();
	this.shape_259.graphics.f("#333333").s().p("AgRAFQgFgRASgFQARgEAFARQAGARgTAFIgGABQgMAAgEgOg");
	this.shape_259.setTransform(-21.6,70.3,0.72,0.72,24.7);

	this.shape_260 = new cjs.Shape();
	this.shape_260.graphics.f("#333333").s().p("AgRAFQgFgRASgFQARgFAFASQAFARgSAFIgGABQgNAAgDgOg");
	this.shape_260.setTransform(-30.1,6.1,0.72,0.72,24.7);

	this.shape_261 = new cjs.Shape();
	this.shape_261.graphics.f("#333333").s().p("AgHAQQgRgHAIgQQAIgRAQAJQARAHgHAQQgGALgKAAQgDAAgGgDg");
	this.shape_261.setTransform(-51.2,-22.8,0.72,0.72,24.7);

	this.shape_262 = new cjs.Shape();
	this.shape_262.graphics.f("#333333").s().p("AgRAFQgFgQASgGQARgEAFARQAEARgSAEIgGACQgLAAgEgOg");
	this.shape_262.setTransform(-93.3,35.1,0.72,0.72,24.7);

	this.shape_263 = new cjs.Shape();
	this.shape_263.graphics.f("#333333").s().p("AgQAFQgFgQARgEQAQgFAFAQQAEAQgRAFIgGAAQgLAAgDgMg");
	this.shape_263.setTransform(-88.1,38.3,0.72,0.72,24.7);

	this.shape_264 = new cjs.Shape();
	this.shape_264.graphics.f("#333333").s().p("AgQAFQgDgQARgEQAQgEADARQADAPgQAEIgEAAQgMAAgEgMg");
	this.shape_264.setTransform(-48.7,-70,0.72,0.72,24.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_264},{t:this.shape_263},{t:this.shape_262},{t:this.shape_261},{t:this.shape_260},{t:this.shape_259},{t:this.shape_258},{t:this.shape_257},{t:this.shape_256},{t:this.shape_255},{t:this.shape_254},{t:this.shape_253},{t:this.shape_252},{t:this.shape_251},{t:this.shape_250},{t:this.shape_249},{t:this.shape_248},{t:this.shape_247},{t:this.shape_246},{t:this.shape_245},{t:this.shape_244},{t:this.shape_243},{t:this.shape_242},{t:this.shape_241},{t:this.shape_240},{t:this.shape_239},{t:this.shape_238},{t:this.shape_237},{t:this.shape_236},{t:this.shape_235},{t:this.shape_234},{t:this.shape_233},{t:this.shape_232},{t:this.shape_231},{t:this.shape_230},{t:this.shape_229},{t:this.shape_228},{t:this.shape_227},{t:this.shape_226},{t:this.shape_225},{t:this.shape_224},{t:this.shape_223},{t:this.shape_222},{t:this.shape_221},{t:this.shape_220},{t:this.shape_219},{t:this.shape_218},{t:this.shape_217},{t:this.shape_216},{t:this.shape_215},{t:this.shape_214},{t:this.shape_213},{t:this.shape_212},{t:this.shape_211},{t:this.shape_210},{t:this.shape_209},{t:this.shape_208},{t:this.shape_207},{t:this.shape_206},{t:this.shape_205},{t:this.shape_204},{t:this.shape_203},{t:this.shape_202},{t:this.shape_201},{t:this.shape_200},{t:this.shape_199},{t:this.shape_198},{t:this.shape_197},{t:this.shape_196},{t:this.shape_195},{t:this.shape_194},{t:this.shape_193},{t:this.shape_192},{t:this.shape_191},{t:this.shape_190},{t:this.shape_189},{t:this.shape_188},{t:this.shape_187},{t:this.shape_186},{t:this.shape_185},{t:this.shape_184},{t:this.shape_183},{t:this.shape_182},{t:this.shape_181},{t:this.shape_180},{t:this.shape_179},{t:this.shape_178},{t:this.shape_177},{t:this.shape_176},{t:this.shape_175},{t:this.shape_174},{t:this.shape_173},{t:this.shape_172},{t:this.shape_171},{t:this.shape_170},{t:this.shape_169},{t:this.shape_168},{t:this.shape_167},{t:this.shape_166},{t:this.shape_165},{t:this.shape_164},{t:this.shape_163},{t:this.shape_162},{t:this.shape_161},{t:this.shape_160},{t:this.shape_159},{t:this.shape_158},{t:this.shape_157},{t:this.shape_156},{t:this.shape_155},{t:this.shape_154},{t:this.shape_153},{t:this.shape_152},{t:this.shape_151},{t:this.shape_150},{t:this.shape_149},{t:this.shape_148},{t:this.shape_147},{t:this.shape_146},{t:this.shape_145},{t:this.shape_144},{t:this.shape_143},{t:this.shape_142},{t:this.shape_141},{t:this.shape_140},{t:this.shape_139},{t:this.shape_138},{t:this.shape_137},{t:this.shape_136},{t:this.shape_135},{t:this.shape_134},{t:this.shape_133},{t:this.shape_132},{t:this.shape_131},{t:this.shape_130},{t:this.shape_129},{t:this.shape_128},{t:this.shape_127},{t:this.shape_126},{t:this.shape_125},{t:this.shape_124},{t:this.shape_123},{t:this.shape_122},{t:this.shape_121},{t:this.shape_120},{t:this.shape_119},{t:this.shape_118},{t:this.shape_117},{t:this.shape_116},{t:this.shape_115},{t:this.shape_114},{t:this.shape_113},{t:this.shape_112},{t:this.shape_111},{t:this.shape_110},{t:this.shape_109},{t:this.shape_108},{t:this.shape_107},{t:this.shape_106},{t:this.shape_105},{t:this.shape_104},{t:this.shape_103},{t:this.shape_102},{t:this.shape_101},{t:this.shape_100},{t:this.shape_99},{t:this.shape_98},{t:this.shape_97},{t:this.shape_96},{t:this.shape_95},{t:this.shape_94},{t:this.shape_93},{t:this.shape_92},{t:this.shape_91},{t:this.shape_90},{t:this.shape_89},{t:this.shape_88},{t:this.shape_87},{t:this.shape_86},{t:this.shape_85},{t:this.shape_84},{t:this.shape_83},{t:this.shape_82},{t:this.shape_81},{t:this.shape_80},{t:this.shape_79},{t:this.shape_78},{t:this.shape_77},{t:this.shape_76},{t:this.shape_75},{t:this.shape_74},{t:this.shape_73},{t:this.shape_72},{t:this.shape_71},{t:this.shape_70},{t:this.shape_69},{t:this.shape_68},{t:this.shape_67},{t:this.shape_66},{t:this.shape_65},{t:this.shape_64},{t:this.shape_63},{t:this.shape_62},{t:this.shape_61},{t:this.shape_60},{t:this.shape_59},{t:this.shape_58},{t:this.shape_57},{t:this.shape_56},{t:this.shape_55},{t:this.shape_54},{t:this.shape_53},{t:this.shape_52},{t:this.shape_51},{t:this.shape_50},{t:this.shape_49},{t:this.shape_48},{t:this.shape_47},{t:this.shape_46},{t:this.shape_45},{t:this.shape_44},{t:this.shape_43},{t:this.shape_42},{t:this.shape_41},{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-251.5,-236.7,503,473.4);


(lib.circleshadow = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Bitmap1();
	this.instance.parent = this;
	this.instance.setTransform(-119,-119);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-119,-119,238,238);


(lib.Monitor = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("A6av6MA/igJNMgJxAxRMhAeAA+g");
	this.shape.setTransform(2.3,-88.7);

	this.instance = new lib.Unit();
	this.instance.parent = this;
	this.instance.setTransform(-265.8,-274.9);

	this.instance_1 = new lib.Shadowcopy();
	this.instance_1.parent = this;
	this.instance_1.setTransform(45.2,232,1,1,0,0,0,206,16);
	this.instance_1.alpha = 0.5;

	this.instance_2 = new lib.Shadow();
	this.instance_2.parent = this;
	this.instance_2.setTransform(-119.7,211.5,0.999,0.999);

	this.instance_3 = new lib.Reflection();
	this.instance_3.parent = this;
	this.instance_3.setTransform(-123.7,231.4,0.99,0.99);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance},{t:this.shape}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.Monitor, new cjs.Rectangle(-265.8,-274.9,531.8,549.9), null);


(lib.Ellipse5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Symbol2("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(121.9,122.9,1.082,1.082,0,0,0,0.2,0.1);
	this.instance.alpha = 0.41;

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EF5500").s().p("AneRtQjchdiriqQiqiqhejdQhgjlAAj6QAAj5BgjkQBejdCqiqQCrirDcheQDlhgD5AAQD6AADkBgQDeBeCqCrQCqCqBdDdQBhDkAAD5QAAD6hhDlQhdDdiqCqQiqCqjeBdQjkBhj6AAQj6AAjkhhg");
	this.shape.setTransform(123,123);

	this.instance_1 = new lib.circleshadow("synched",0);
	this.instance_1.parent = this;
	this.instance_1.setTransform(138.6,127);
	this.instance_1.alpha = 0.09;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.shape},{t:this.instance}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.Ellipse5, new cjs.Rectangle(-14.6,-13.5,272.7,272.7), null);


(lib.calloutcircle = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Ellipse5();
	this.instance.parent = this;
	this.instance.setTransform(2.6,3.4,0.712,0.712,0,0,0,123,123);
	this.instance.alpha = 0.898;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-95.5,-93.9,194.2,194.2);


(lib.CalloutCirclenocopy = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{fadein:1,fadeout:40});

	// timeline functions:
	this.frame_0 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}
	this.frame_39 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}
	this.frame_63 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(39).call(this.frame_39).wait(24).call(this.frame_63).wait(1));

	// Layer_1
	this.instance = new lib.calloutcircle("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(3,11.7);
	this.instance.alpha = 0.039;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({_off:false},0).to({y:0,alpha:0.961},18).wait(21).to({startPosition:0},0).to({y:3.7,alpha:0.039},22).to({_off:true},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = null;


(lib.Screens_Clip = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{Screen1:0,Screen2:73,"Screen 3":152});

	// timeline functions:
	this.frame_14 = function() {
		var _this = this;
		_this.bubble.gotoAndPlay('fadein');
		_this.TextHolder_MC.gotoAndStop('text1');
	}
	this.frame_73 = function() {
		var _this = this;
		_this.bubble.gotoAndPlay('fadeout');
	}
	this.frame_92 = function() {
		var _this = this;
		_this.bubble.gotoAndPlay('fadein');
		_this.TextHolder_MC.gotoAndStop('text2');
	}
	this.frame_152 = function() {
		var _this = this;
		_this.bubble.gotoAndPlay('fadeout');
	}
	this.frame_171 = function() {
		var _this = this;
		_this.bubble.gotoAndPlay('fadein');
		_this.TextHolder_MC.gotoAndStop('text3');
	}
	this.frame_216 = function() {
		var _this = this;
		_this.bubble.gotoAndPlay('fadeout');
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(14).call(this.frame_14).wait(59).call(this.frame_73).wait(19).call(this.frame_92).wait(60).call(this.frame_152).wait(19).call(this.frame_171).wait(45).call(this.frame_216).wait(21));

	// TEXT HOLDER
	this.TextHolder_MC = new lib.Textforscreens();
	this.TextHolder_MC.name = "TextHolder_MC";
	this.TextHolder_MC.parent = this;
	this.TextHolder_MC.setTransform(339.6,-220.5,1.116,1.106,0,0,0,0.1,-3.9);
	this.TextHolder_MC._off = true;

	this.timeline.addTween(cjs.Tween.get(this.TextHolder_MC).wait(14).to({_off:false},0).wait(78).to({x:-328.4,y:-51.6},0).wait(79).to({x:277.1,y:57.9},0).to({_off:true},45).wait(21));

	// Additional Pop Out
	this.instance = new lib.Screen2_popout();
	this.instance.parent = this;
	this.instance.setTransform(7.4,124.5,1.45,1.45);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(92).to({_off:false},0).to({regX:0.1,regY:0.2,scaleX:1.84,scaleY:1.84,x:-6,y:72.3,alpha:1},13).to({_off:true},47).wait(85));

	// bubble 
	this.bubble = new lib.CalloutCirclenocopy();
	this.bubble.name = "bubble";
	this.bubble.parent = this;
	this.bubble.setTransform(330.5,-219.3);

	this.timeline.addTween(cjs.Tween.get(this.bubble).wait(92).to({x:-336.7,y:-59.8},0).wait(79).to({x:283.5,y:54.1},0).wait(66));

	// adds frame stroke
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(3).p("Eg5TAmzQYzgdY1gdUAxngA5AAEAABUAACAABAHhgl6UAHggl7AADAABUAADAABgw9AG/Ugw9AHAAACAAAQACABoTfyQkJP5kKP5g");
	this.shape.setTransform(-3.8,-5.5,1,1,0,0,0,-0.7,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(237));

	// screen 3
	this.instance_1 = new lib.Screen3_MC();
	this.instance_1.parent = this;
	this.instance_1.setTransform(3.1,-5.6);
	this.instance_1.alpha = 0;
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(152).to({_off:false},0).to({alpha:1},19).wait(45).to({alpha:0},20).wait(1));

	// Screens 2
	this.instance_2 = new lib.Screen2_MC();
	this.instance_2.parent = this;
	this.instance_2.setTransform(3.1,-5.6);
	this.instance_2.alpha = 0;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(73).to({_off:false},0).to({alpha:1},19).to({_off:true},79).wait(66));

	// Screens_1
	this.instance_3 = new lib.security_screen1();
	this.instance_3.parent = this;
	this.instance_3.setTransform(-370,-254,0.691,0.691);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({_off:true},92).wait(124).to({_off:false},0).wait(21));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-371.8,-255.3,748,499.5);


(lib.screenanimationsecurity = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_105 = function() {
		function pauseForTime(sym, t)
		
		     {
		
		       var currTime = sym.getPosition();
		
		       sym.stop();
		
		       sym.play(currTime + t);
		
		     }
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(105).call(this.frame_105).wait(1));

	// Screens animation
	this.instance = new lib.Screens_Clip();
	this.instance.parent = this;
	this.instance.setTransform(-5.7,3,0.605,0.605,0,0,0,-0.1,0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(106));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-230.7,-151.5,452.7,302.3);


// stage content:
(lib.Security_device_animation_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Screen Animation
	this.instance = new lib.screenanimationsecurity();
	this.instance.parent = this;
	this.instance.setTransform(285.6,209.6,1,1.042);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Device In Back
	this.instance_1 = new lib.Monitor();
	this.instance_1.parent = this;
	this.instance_1.setTransform(274.1,294.7,0.929,0.929);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	// Layer_7
	this.instance_2 = new lib.connecteddotsinbak("synched",0);
	this.instance_2.parent = this;
	this.instance_2.setTransform(269.6,276.2,1.04,1.04);
	this.instance_2.alpha = 0.539;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(283.1,305.1,522.9,519.9);
// library properties:
lib.properties = {
	id: '186ABC73767E1440A568679BEA3F421A',
	width: 550,
	height: 550,
	fps: 24,
	color: "#FFFFFF",
	opacity: 0.00,
	manifest: [
		{src:"images/Security_device_animation_1_atlas_.png", id:"Security_device_animation_1_atlas_"}
	],
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
an.compositions['186ABC73767E1440A568679BEA3F421A'] = {
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