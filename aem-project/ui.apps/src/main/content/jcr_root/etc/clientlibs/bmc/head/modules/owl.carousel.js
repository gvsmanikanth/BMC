(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Owl carousel
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 * @todo Lazy Load Icon
 * @todo prevent animationend bubling
 * @todo itemsScaleUp
 * @todo Test Zepto
 * @todo stagePadding calculate wrong active classes
 */
;(function($, window, document, undefined) {

	var drag, state, e;

	/**
	 * Template for status information about drag and touch events.
	 * @private
	 */
	drag = {
		start: 0,
		startX: 0,
		startY: 0,
		current: 0,
		currentX: 0,
		currentY: 0,
		offsetX: 0,
		offsetY: 0,
		distance: null,
		startTime: 0,
		endTime: 0,
		updatedX: 0,
		targetEl: null
	};

	/**
	 * Template for some status informations.
	 * @private
	 */
	state = {
		isTouch: false,
		isScrolling: false,
		isSwiping: false,
		direction: false,
		inMotion: false
	};

	/**
	 * Event functions references.
	 * @private
	 */
	e = {
		_onDragStart: null,
		_onDragMove: null,
		_onDragEnd: null,
		_transitionEnd: null,
		_resizer: null,
		_responsiveCall: null,
		_goToLoop: null,
		_checkVisibile: null
	};

	/**
	 * Creates a carousel.
	 * @class The Owl Carousel.
	 * @public
	 * @param {HTMLElement|jQuery} element - The element to create the carousel for.
	 * @param {Object} [options] - The options
	 */
	function Owl(element, options) {

		/**
		 * Current settings for the carousel.
		 * @public
		 */
		this.settings = null;

		/**
		 * Current options set by the caller including defaults.
		 * @public
		 */
		this.options = $.extend({}, Owl.Defaults, options);

		/**
		 * Plugin element.
		 * @public
		 */
		this.$element = $(element);

		/**
		 * Caches informations about drag and touch events.
		 */
		this.drag = $.extend({}, drag);

		/**
		 * Caches some status informations.
		 * @protected
		 */
		this.state = $.extend({}, state);

		/**
		 * @protected
		 * @todo Must be documented
		 */
		this.e = $.extend({}, e);

		/**
		 * References to the running plugins of this carousel.
		 * @protected
		 */
		this._plugins = {};

		/**
		 * Currently suppressed events to prevent them from beeing retriggered.
		 * @protected
		 */
		this._supress = {};

		/**
		 * Absolute current position.
		 * @protected
		 */
		this._current = null;

		/**
		 * Animation speed in milliseconds.
		 * @protected
		 */
		this._speed = null;

		/**
		 * Coordinates of all items in pixel.
		 * @todo The name of this member is missleading.
		 * @protected
		 */
		this._coordinates = [];

		/**
		 * Current breakpoint.
		 * @todo Real media queries would be nice.
		 * @protected
		 */
		this._breakpoint = null;

		/**
		 * Current width of the plugin element.
		 */
		this._width = null;

		/**
		 * All real items.
		 * @protected
		 */
		this._items = [];

		/**
		 * All cloned items.
		 * @protected
		 */
		this._clones = [];

		/**
		 * Merge values of all items.
		 * @todo Maybe this could be part of a plugin.
		 * @protected
		 */
		this._mergers = [];

		/**
		 * Invalidated parts within the update process.
		 * @protected
		 */
		this._invalidated = {};

		/**
		 * Ordered list of workers for the update process.
		 * @protected
		 */
		this._pipe = [];

		$.each(Owl.Plugins, $.proxy(function(key, plugin) {
			this._plugins[key[0].toLowerCase() + key.slice(1)]
				= new plugin(this);
		}, this));

		$.each(Owl.Pipe, $.proxy(function(priority, worker) {
			this._pipe.push({
				'filter': worker.filter,
				'run': $.proxy(worker.run, this)
			});
		}, this));

		this.setup();
		this.initialize();
	}

	/**
	 * Default options for the carousel.
	 * @public
	 */
	Owl.Defaults = {
		items: 3,
		loop: false,
		center: false,

		mouseDrag: true,
		touchDrag: true,
		pullDrag: true,
		freeDrag: false,

		margin: 0,
		stagePadding: 0,

		merge: false,
		mergeFit: true,
		autoWidth: false,

		startPosition: 0,
		rtl: false,

		smartSpeed: 250,
		fluidSpeed: false,
		dragEndSpeed: false,
		pageAnimationDuration: '1s',

		responsive: {},
		responsiveRefreshRate: 200,
		responsiveBaseElement: window,
		responsiveClass: false,

		fallbackEasing: 'swing',

		info: false,

		nestedItemSelector: false,
		itemElement: 'div',
		stageElement: 'div',

		// Classes and Names
		themeClass: 'owl-theme',
		baseClass: 'owl-carousel',
		itemClass: 'owl-item',
		centerClass: 'center',
		activeClass: 'active'
	};

	/**
	 * Enumeration for width.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
	Owl.Width = {
		Default: 'default',
		Inner: 'inner',
		Outer: 'outer'
	};

	/**
	 * Contains all registered plugins.
	 * @public
	 */
	Owl.Plugins = {};

	/**
	 * Update pipe.
	 */
	Owl.Pipe = [ {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			cache.current = this._items && this._items[this.relative(this._current)];
		}
	}, {
		filter: [ 'items', 'settings' ],
		run: function() {
			var cached = this._clones,
				clones = this.$stage.children('.cloned');

			if (clones.length !== cached.length || (!this.settings.loop && cached.length > 0)) {
				this.$stage.children('.cloned').remove();
				this._clones = [];
			}
		}
	}, {
		filter: [ 'items', 'settings' ],
		run: function() {
			var i, n,
				clones = this._clones,
				items = this._items,
				delta = this.settings.loop ? clones.length - Math.max(this.settings.items * 2, 4) : 0;

			for (i = 0, n = Math.abs(delta / 2); i < n; i++) {
				if (delta > 0) {
					this.$stage.children().eq(items.length + clones.length - 1).remove();
					clones.pop();
					this.$stage.children().eq(0).remove();
					clones.pop();
				} else {
					clones.push(clones.length / 2);
					this.$stage.append(items[clones[clones.length - 1]].clone().addClass('cloned'));
					clones.push(items.length - 1 - (clones.length - 1) / 2);
					this.$stage.prepend(items[clones[clones.length - 1]].clone().addClass('cloned'));
				}
			}
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function() {
			var rtl = (this.settings.rtl ? 1 : -1),
				width = (this.width() / this.settings.items).toFixed(3),
				coordinate = 0, merge, i, n;

			this._coordinates = [];
			for (i = 0, n = this._clones.length + this._items.length; i < n; i++) {
				merge = this._mergers[this.relative(i)];
				merge = (this.settings.mergeFit && Math.min(merge, this.settings.items)) || merge;
				coordinate += (this.settings.autoWidth ? this._items[this.relative(i)].width() + this.settings.margin : width * merge) * rtl;

				this._coordinates.push(coordinate);
			}
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function() {
			var i, n, width = (this.width() / this.settings.items).toFixed(3), css = {
				'width': Math.abs(this._coordinates[this._coordinates.length - 1]) + this.settings.stagePadding * 2,
				'padding-left': this.settings.stagePadding || '',
				'padding-right': this.settings.stagePadding || ''
			};

			this.$stage.css(css);

			css = { 'width': this.settings.autoWidth ? 'auto' : width - this.settings.margin };
			css[this.settings.rtl ? 'margin-left' : 'margin-right'] = this.settings.margin;

			if (!this.settings.autoWidth && $.grep(this._mergers, function(v) { return v > 1 }).length > 0) {
				for (i = 0, n = this._coordinates.length; i < n; i++) {
					css.width = Math.abs(this._coordinates[i]) - Math.abs(this._coordinates[i - 1] || 0) - this.settings.margin;
					this.$stage.children().eq(i).css(css);
				}
			} else {
				this.$stage.children().css(css);
			}
		}
	}, {
		filter: [ 'width', 'items', 'settings' ],
		run: function(cache) {
			cache.current && this.reset(this.$stage.children().index(cache.current));
		}
	}, {
		filter: [ 'position' ],
		run: function() {
			this.animate(this.coordinates(this._current));
		}
	}, {
		filter: [ 'width', 'position', 'items', 'settings' ],
		run: function() {
			var rtl = this.settings.rtl ? 1 : -1,
				padding = this.settings.stagePadding * 2,
				begin = this.coordinates(this.current()) + padding,
				end = begin + this.width() * rtl,
				inner, outer, matches = [], i, n;

			for (i = 0, n = this._coordinates.length; i < n; i++) {
				inner = this._coordinates[i - 1] || 0;
				outer = Math.abs(this._coordinates[i]) + padding * rtl;

				if ((this.op(inner, '<=', begin) && (this.op(inner, '>', end)))
					|| (this.op(outer, '<', begin) && this.op(outer, '>', end))) {
					matches.push(i);
				}
			}

			this.$stage.children('.' + this.settings.activeClass).removeClass(this.settings.activeClass);
			this.$stage.children(':eq(' + matches.join('), :eq(') + ')').addClass(this.settings.activeClass);

			if (this.settings.center) {
				this.$stage.children('.' + this.settings.centerClass).removeClass(this.settings.centerClass);
				this.$stage.children().eq(this.current()).addClass(this.settings.centerClass);
			}
		}
	} ];

	/**
	 * Initializes the carousel.
	 * @protected
	 */
	Owl.prototype.initialize = function() {
		this.trigger('initialize');

		this.$element
			.addClass(this.settings.baseClass)
			.addClass(this.settings.themeClass)
			.toggleClass('owl-rtl', this.settings.rtl);

		// check support
		this.browserSupport();

		if (this.settings.autoWidth && this.state.imagesLoaded !== true) {
			var imgs, nestedSelector, width;
			imgs = this.$element.find('img');
			nestedSelector = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : undefined;
			width = this.$element.children(nestedSelector).width();

			if (imgs.length && width <= 0) {
				this.preloadAutoWidthImages(imgs);
				return false;
			}
		}

		this.$element.addClass('owl-loading');

		// create stage
		this.$stage = $('<' + this.settings.stageElement + ' class="owl-stage"/>')
			.wrap('<div class="owl-stage-outer">');

		// append stage
		this.$element.append(this.$stage.parent());

		// append content
		this.replace(this.$element.children().not(this.$stage.parent()));

		// set view width
		this._width = this.$element.width();

		// update view
		this.refresh();

		this.$element.removeClass('owl-loading').addClass('owl-loaded');

		// attach generic events
		this.eventsCall();

		// attach generic events
		this.internalEvents();

		// attach custom control events
		this.addTriggerableEvents();

		this.trigger('initialized');
	};

	/**
	 * Setups the current settings.
	 * @todo Remove responsive classes. Why should adaptive designs be brought into IE8?
	 * @todo Support for media queries by using `matchMedia` would be nice.
	 * @public
	 */
	Owl.prototype.setup = function() {
		var viewport = this.viewport(),
			overwrites = this.options.responsive,
			match = -1,
			settings = null;

		if (!overwrites) {
			settings = $.extend({}, this.options);
		} else {
			$.each(overwrites, function(breakpoint) {
				if (breakpoint <= viewport && breakpoint > match) {
					match = Number(breakpoint);
				}
			});

			settings = $.extend({}, this.options, overwrites[match]);
			delete settings.responsive;

			// responsive class
			if (settings.responsiveClass) {
				this.$element.attr('class', function(i, c) {
					return c.replace(/\b owl-responsive-\S+/g, '');
				}).addClass('owl-responsive-' + match);
			}
		}

		if (this.settings === null || this._breakpoint !== match) {
			this.trigger('change', { property: { name: 'settings', value: settings } });
			this._breakpoint = match;
			this.settings = settings;
			this.invalidate('settings');
			this.trigger('changed', { property: { name: 'settings', value: this.settings } });
		}
	};

	/**
	 * Updates option logic if necessery.
	 * @protected
	 */
	Owl.prototype.optionsLogic = function() {
		// Toggle Center class
		this.$element.toggleClass('owl-center', this.settings.center);

		// if items number is less than in body
		if (this.settings.loop && this._items.length < this.settings.items) {
			this.settings.loop = false;
		}

		if (this.settings.autoWidth) {
			this.settings.stagePadding = false;
			this.settings.merge = false;
		}
	};

	/**
	 * Prepares an item before add.
	 * @todo Rename event parameter `content` to `item`.
	 * @protected
	 * @returns {jQuery|HTMLElement} - The item container.
	 */
	Owl.prototype.prepare = function(item) {
		var event = this.trigger('prepare', { content: item });

		if (!event.data) {
			event.data = $('<' + this.settings.itemElement + '/>')
				.addClass(this.settings.itemClass).append(item)
		}

		this.trigger('prepared', { content: event.data });

		return event.data;
	};

	/**
	 * Updates the view.
	 * @public
	 */
	Owl.prototype.update = function() {
		var i = 0,
			n = this._pipe.length,
			filter = $.proxy(function(p) { return this[p] }, this._invalidated),
			cache = {};

		while (i < n) {
			if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
				this._pipe[i].run(cache);
			}
			i++;
		}

		this._invalidated = {};
	};

	/**
	 * Gets the width of the view.
	 * @public
	 * @param {Owl.Width} [dimension=Owl.Width.Default] - The dimension to return.
	 * @returns {Number} - The width of the view in pixel.
	 */
	Owl.prototype.width = function(dimension) {
		dimension = dimension || Owl.Width.Default;
		switch (dimension) {
			case Owl.Width.Inner:
			case Owl.Width.Outer:
				return this._width;
			default:
				return this._width - this.settings.stagePadding * 2 + this.settings.margin;
		}
	};

	/**
	 * Refreshes the carousel primarily for adaptive purposes.
	 * @public
	 */
	Owl.prototype.refresh = function() {
		if (this._items.length === 0) {
			return false;
		}

		var start = new Date().getTime();

		this.trigger('refresh');

		this.setup();

		this.optionsLogic();

		// hide and show methods helps here to set a proper widths,
		// this prevents scrollbar to be calculated in stage width
		this.$stage.addClass('owl-refresh');

		this.update();

		this.$stage.removeClass('owl-refresh');

		this.state.orientation = window.orientation;

		this.watchVisibility();

		this.trigger('refreshed');
	};

	/**
	 * Save internal event references and add event based functions.
	 * @protected
	 */
	Owl.prototype.eventsCall = function() {
		// Save events references
		this.e._onDragStart = $.proxy(function(e) {
			this.onDragStart(e);
		}, this);
		this.e._onDragMove = $.proxy(function(e) {
			this.onDragMove(e);
		}, this);
		this.e._onDragEnd = $.proxy(function(e) {
			this.onDragEnd(e);
		}, this);
		this.e._onResize = $.proxy(function(e) {
			this.onResize(e);
		}, this);
		this.e._transitionEnd = $.proxy(function(e) {
			this.transitionEnd(e);
		}, this);
		this.e._preventClick = $.proxy(function(e) {
			this.preventClick(e);
		}, this);
	};

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
	Owl.prototype.onThrottledResize = function() {
		window.clearTimeout(this.resizeTimer);
		this.resizeTimer = window.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate);
	};

	/**
	 * Checks window `resize` event.
	 * @protected
	 */
	Owl.prototype.onResize = function() {
		if (!this._items.length) {
			return false;
		}

		if (this._width === this.$element.width()) {
			return false;
		}

		if (this.trigger('resize').isDefaultPrevented()) {
			return false;
		}

		this._width = this.$element.width();

		this.invalidate('width');

		this.refresh();

		this.trigger('resized');
	};

	/**
	 * Checks for touch/mouse drag event type and add run event handlers.
	 * @protected
	 */
	Owl.prototype.eventsRouter = function(event) {
		var type = event.type;

		if (type === "mousedown" || type === "touchstart") {
			this.onDragStart(event);
		} else if (type === "mousemove" || type === "touchmove") {
			this.onDragMove(event);
		} else if (type === "mouseup" || type === "touchend") {
			this.onDragEnd(event);
		} else if (type === "touchcancel") {
			this.onDragEnd(event);
		}
	};

	/**
	 * Checks for touch/mouse drag options and add necessery event handlers.
	 * @protected
	 */
	Owl.prototype.internalEvents = function() {
		var isTouch = isTouchSupport(),
			isTouchIE = isTouchSupportIE();

		if (this.settings.mouseDrag){
			this.$stage.on('mousedown', $.proxy(function(event) { this.eventsRouter(event) }, this));
			this.$stage.on('dragstart', function() { return false });
			this.$stage.get(0).onselectstart = function() { return false };
		} else {
			this.$element.addClass('owl-text-select-on');
		}

		if (this.settings.touchDrag && !isTouchIE){
			this.$stage.on('touchstart touchcancel', $.proxy(function(event) { this.eventsRouter(event) }, this));
		}

		// catch transitionEnd event
		if (this.transitionEndVendor) {
			this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, false);
		}

		// responsive
		if (this.settings.responsive !== false) {
			this.on(window, 'resize', $.proxy(this.onThrottledResize, this));
		}
	};

	/**
	 * Handles touchstart/mousedown event.
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragStart = function(event) {
		var ev, isTouchEvent, pageX, pageY, animatedPos;

		ev = event.originalEvent || event || window.event;

		// prevent right click
		if (ev.which === 3 || this.state.isTouch) {
			return false;
		}

		if (ev.type === 'mousedown') {
			this.$stage.addClass('owl-grab');
		}

		this.trigger('drag');
		this.drag.startTime = new Date().getTime();
		this.speed(0);
		this.state.isTouch = true;
		this.state.isScrolling = false;
		this.state.isSwiping = false;
		this.drag.distance = 0;

		pageX = getTouches(ev).x;
		pageY = getTouches(ev).y;

		// get stage position left
		this.drag.offsetX = this.$stage.position().left;
		this.drag.offsetY = this.$stage.position().top;

		if (this.settings.rtl) {
			this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width()
				+ this.settings.margin;
		}

		// catch position // ie to fix
		if (this.state.inMotion && this.support3d) {
			animatedPos = this.getTransformProperty();
			this.drag.offsetX = animatedPos;
			this.animate(animatedPos);
			this.state.inMotion = true;
		} else if (this.state.inMotion && !this.support3d) {
			this.state.inMotion = false;
			return false;
		}

		this.drag.startX = pageX - this.drag.offsetX;
		this.drag.startY = pageY - this.drag.offsetY;

		this.drag.start = pageX - this.drag.startX;
		this.drag.targetEl = ev.target || ev.srcElement;
		this.drag.updatedX = this.drag.start;

		// to do/check
		// prevent links and images dragging;
		if (this.drag.targetEl.tagName === "IMG" || this.drag.targetEl.tagName === "A") {
			this.drag.targetEl.draggable = false;
		}

		$(document).on('mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents', $.proxy(function(event) {this.eventsRouter(event)},this));
	};

	/**
	 * Handles the touchmove/mousemove events.
	 * @todo Simplify
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.onDragMove = function(event) {
		var ev, isTouchEvent, pageX, pageY, minValue, maxValue, pull;

		if (!this.state.isTouch) {
			return;
		}

		if (this.state.isScrolling) {
			return;
		}

		ev = event.originalEvent || event || window.event;

		pageX = getTouches(ev).x;
		pageY = getTouches(ev).y;

		// Drag Direction
		this.drag.currentX = pageX - this.drag.startX;
		this.drag.currentY = pageY - this.drag.startY;
		this.drag.distance = this.drag.currentX - this.drag.offsetX;

		// Check move direction
		if (this.drag.distance < 0) {
			this.state.direction = this.settings.rtl ? 'right' : 'left';
		} else if (this.drag.distance > 0) {
			this.state.direction = this.settings.rtl ? 'left' : 'right';
		}
		// Loop
		if (this.settings.loop) {
			if (this.op(this.drag.currentX, '>', this.coordinates(this.minimum())) && this.state.direction === 'right') {
				this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length);
			} else if (this.op(this.drag.currentX, '<', this.coordinates(this.maximum())) && this.state.direction === 'left') {
				this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length);
			}
		} else {
			// pull
			minValue = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
			maxValue = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
			pull = this.settings.pullDrag ? this.drag.distance / 5 : 0;
			this.drag.currentX = Math.max(Math.min(this.drag.currentX, minValue + pull), maxValue + pull);
		}

		// Lock browser if swiping horizontal

		if ((this.drag.distance > 8 || this.drag.distance < -8)) {
			if (ev.preventDefault !== undefined) {
				ev.preventDefault();
			} else {
				ev.returnValue = false;
			}
			this.state.isSwiping = true;
		}

		this.drag.updatedX = this.drag.currentX;

		// Lock Owl if scrolling
		if ((this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === false) {
			this.state.isScrolling = true;
			this.drag.updatedX = this.drag.start;
		}

		this.animate(this.drag.updatedX);
	};

	/**
	 * Handles the touchend/mouseup events.
	 * @protected
	 */
	Owl.prototype.onDragEnd = function(event) {
		var compareTimes, distanceAbs, closest;

		if (!this.state.isTouch) {
			return;
		}

		if (event.type === 'mouseup') {
			this.$stage.removeClass('owl-grab');
		}

		this.trigger('dragged');

		// prevent links and images dragging;
		this.drag.targetEl.removeAttribute("draggable");

		// remove drag event listeners

		this.state.isTouch = false;
		this.state.isScrolling = false;
		this.state.isSwiping = false;

		// to check
		if (this.drag.distance === 0 && this.state.inMotion !== true) {
			this.state.inMotion = false;
			return false;
		}

		// prevent clicks while scrolling

		this.drag.endTime = new Date().getTime();
		compareTimes = this.drag.endTime - this.drag.startTime;
		distanceAbs = Math.abs(this.drag.distance);

		// to test
		if (distanceAbs > 3 || compareTimes > 300) {
			this.removeClick(this.drag.targetEl);
		}

		closest = this.closest(this.drag.updatedX);

		this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
		this.current(closest);
		this.invalidate('position');
		this.update();

		// if pullDrag is off then fire transitionEnd event manually when stick
		// to border
		if (!this.settings.pullDrag && this.drag.updatedX === this.coordinates(closest)) {
			this.transitionEnd();
		}

		this.drag.distance = 0;

		$(document).off('.owl.dragEvents');
	};

	/**
	 * Attaches `preventClick` to disable link while swipping.
	 * @protected
	 * @param {HTMLElement} [target] - The target of the `click` event.
	 */
	Owl.prototype.removeClick = function(target) {
		this.drag.targetEl = target;
		$(target).on('click.preventClick', this.e._preventClick);
		// to make sure click is removed:
		window.setTimeout(function() {
			$(target).off('click.preventClick');
		}, 300);
	};

	/**
	 * Suppresses click event.
	 * @protected
	 * @param {Event} ev - The event arguments.
	 */
	Owl.prototype.preventClick = function(ev) {
		if (ev.preventDefault) {
			ev.preventDefault();
		} else {
			ev.returnValue = false;
		}
		if (ev.stopPropagation) {
			ev.stopPropagation();
		}
		$(ev.target).off('click.preventClick');
	};

	/**
	 * Catches stage position while animate (only CSS3).
	 * @protected
	 * @returns
	 */
	Owl.prototype.getTransformProperty = function() {
		var transform, matrix3d;

		transform = window.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + 'transform');
		// var transform = this.$stage.css(this.vendorName + 'transform')
		transform = transform.replace(/matrix(3d)?\(|\)/g, '').split(',');
		matrix3d = transform.length === 16;

		return matrix3d !== true ? transform[4] : transform[12];
	};

	/**
	 * Gets absolute position of the closest item for a coordinate.
	 * @todo Setting `freeDrag` makes `closest` not reusable. See #165.
	 * @protected
	 * @param {Number} coordinate - The coordinate in pixel.
	 * @return {Number} - The absolute position of the closest item.
	 */
	Owl.prototype.closest = function(coordinate) {
		var position = -1, pull = 30, width = this.width(), coordinates = this.coordinates();

		if (!this.settings.freeDrag) {
			// check closest item
			$.each(coordinates, $.proxy(function(index, value) {
				if (coordinate > value - pull && coordinate < value + pull) {
					position = index;
				} else if (this.op(coordinate, '<', value)
					&& this.op(coordinate, '>', coordinates[index + 1] || value - width)) {
					position = this.state.direction === 'left' ? index + 1 : index;
				}
				return position === -1;
			}, this));
		}

		if (!this.settings.loop) {
			// non loop boundries
			if (this.op(coordinate, '>', coordinates[this.minimum()])) {
				position = coordinate = this.minimum();
			} else if (this.op(coordinate, '<', coordinates[this.maximum()])) {
				position = coordinate = this.maximum();
			}
		}

		return position;
	};

	/**
	 * Animates the stage.
	 * @public
	 * @param {Number} coordinate - The coordinate in pixels.
	 */
	Owl.prototype.animate = function(coordinate) {
		this.trigger('translate');
		this.state.inMotion = this.speed() > 0;

		if (this.support3d) {
			this.$stage.css({
				transform: 'translate3d(' + coordinate + 'px' + ',0px, 0px)',
				transition: (this.speed() / 1000) + 's'
			});
		} else if (this.state.isTouch) {
			this.$stage.css({
				left: coordinate + 'px'
			});
		} else {
			this.$stage.animate({
				left: coordinate
			}, this.speed() / 1000, this.settings.fallbackEasing, $.proxy(function() {
				if (this.state.inMotion) {
					this.transitionEnd();
				}
			}, this));
		}
	};

	/**
	 * Sets the absolute position of the current item.
	 * @public
	 * @param {Number} [position] - The new absolute position or nothing to leave it unchanged.
	 * @returns {Number} - The absolute position of the current item.
	 */
	Owl.prototype.current = function(position) {
		if (position === undefined) {
			return this._current;
		}

		if (this._items.length === 0) {
			return undefined;
		}

		position = this.normalize(position);

		if (this._current !== position) {
			var event = this.trigger('change', { property: { name: 'position', value: position } });

			if (event.data !== undefined) {
				position = this.normalize(event.data);
			}

			this._current = position;

			this.invalidate('position');

			this.trigger('changed', { property: { name: 'position', value: this._current } });
		}

		return this._current;
	};

	/**
	 * Invalidates the given part of the update routine.
	 * @param {String} part - The part to invalidate.
	 */
	Owl.prototype.invalidate = function(part) {
		this._invalidated[part] = true;
	}

	/**
	 * Resets the absolute position of the current item.
	 * @public
	 * @param {Number} position - The absolute position of the new item.
	 */
	Owl.prototype.reset = function(position) {
		position = this.normalize(position);

		if (position === undefined) {
			return;
		}

		this._speed = 0;
		this._current = position;

		this.suppress([ 'translate', 'translated' ]);

		this.animate(this.coordinates(position));

		this.release([ 'translate', 'translated' ]);
	};

	/**
	 * Normalizes an absolute or a relative position for an item.
	 * @public
	 * @param {Number} position - The absolute or relative position to normalize.
	 * @param {Boolean} [relative=false] - Whether the given position is relative or not.
	 * @returns {Number} - The normalized position.
	 */
	Owl.prototype.normalize = function(position, relative) {
		var n = (relative ? this._items.length : this._items.length + this._clones.length);

		if (!$.isNumeric(position) || n < 1) {
			return undefined;
		}

		if (this._clones.length) {
			position = ((position % n) + n) % n;
		} else {
			position = Math.max(this.minimum(relative), Math.min(this.maximum(relative), position));
		}

		return position;
	};

	/**
	 * Converts an absolute position for an item into a relative position.
	 * @public
	 * @param {Number} position - The absolute position to convert.
	 * @returns {Number} - The converted position.
	 */
	Owl.prototype.relative = function(position) {
		position = this.normalize(position);
		position = position - this._clones.length / 2;
		return this.normalize(position, true);
	};

	/**
	 * Gets the maximum position for an item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
	Owl.prototype.maximum = function(relative) {
		var maximum, width, i = 0, coordinate,
			settings = this.settings;

		if (relative) {
			return this._items.length - 1;
		}

		if (!settings.loop && settings.center) {
			maximum = this._items.length - 1;
		} else if (!settings.loop && !settings.center) {
			maximum = this._items.length - settings.items;
		} else if (settings.loop || settings.center) {
			maximum = this._items.length + settings.items;
		} else if (settings.autoWidth || settings.merge) {
			revert = settings.rtl ? 1 : -1;
			width = this.$stage.width() - this.$element.width();
			while (coordinate = this.coordinates(i)) {
				if (coordinate * revert >= width) {
					break;
				}
				maximum = ++i;
			}
		} else {
			throw 'Can not detect maximum absolute position.'
		}

		return maximum;
	};

	/**
	 * Gets the minimum position for an item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
	Owl.prototype.minimum = function(relative) {
		if (relative) {
			return 0;
		}

		return this._clones.length / 2;
	};

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
	Owl.prototype.items = function(position) {
		if (position === undefined) {
			return this._items.slice();
		}

		position = this.normalize(position, true);
		return this._items[position];
	};

	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
	Owl.prototype.mergers = function(position) {
		if (position === undefined) {
			return this._mergers.slice();
		}

		position = this.normalize(position, true);
		return this._mergers[position];
	};

	/**
	 * Gets the absolute positions of clones for an item.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @returns {Array.<Number>} - The absolute positions of clones for the item or all if no position was given.
	 */
	Owl.prototype.clones = function(position) {
		var odd = this._clones.length / 2,
			even = odd + this._items.length,
			map = function(index) { return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2 };

		if (position === undefined) {
			return $.map(this._clones, function(v, i) { return map(i) });
		}

		return $.map(this._clones, function(v, i) { return v === position ? map(i) : null });
	};

	/**
	 * Sets the current animation speed.
	 * @public
	 * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
	 * @returns {Number} - The current animation speed in milliseconds.
	 */
	Owl.prototype.speed = function(speed) {
		if (speed !== undefined) {
			this._speed = speed;
		}

		return this._speed;
	};

	/**
	 * Gets the coordinate of an item.
	 * @todo The name of this method is missleanding.
	 * @public
	 * @param {Number} position - The absolute position of the item within `minimum()` and `maximum()`.
	 * @returns {Number|Array.<Number>} - The coordinate of the item in pixel or all coordinates.
	 */
	Owl.prototype.coordinates = function(position) {
		var coordinate = null;

		if (position === undefined) {
			return $.map(this._coordinates, $.proxy(function(coordinate, index) {
				return this.coordinates(index);
			}, this));
		}

		if (this.settings.center) {
			coordinate = this._coordinates[position];
			coordinate += (this.width() - coordinate + (this._coordinates[position - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1);
		} else {
			coordinate = this._coordinates[position - 1] || 0;
		}

		return coordinate;
	};

	/**
	 * Calculates the speed for a translation.
	 * @protected
	 * @param {Number} from - The absolute position of the start item.
	 * @param {Number} to - The absolute position of the target item.
	 * @param {Number} [factor=undefined] - The time factor in milliseconds.
	 * @returns {Number} - The time in milliseconds for the translation.
	 */
	Owl.prototype.duration = function(from, to, factor) {
		return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs((factor || this.settings.smartSpeed));
	};

	/**
	 * Slides to the specified item.
	 * @public
	 * @param {Number} position - The position of the item.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.to = function(position, speed) {
		if (this.settings.loop) {
			var distance = position - this.relative(this.current()),
				revert = this.current(),
				before = this.current(),
				after = this.current() + distance,
				direction = before - after < 0 ? true : false,
				items = this._clones.length + this._items.length;

			if (after < this.settings.items && direction === false) {
				revert = before + this._items.length;
				this.reset(revert);
			} else if (after >= items - this.settings.items && direction === true) {
				revert = before - this._items.length;
				this.reset(revert);
			}
			window.clearTimeout(this.e._goToLoop);
			this.e._goToLoop = window.setTimeout($.proxy(function() {
				this.speed(this.duration(this.current(), revert + distance, speed));
				this.current(revert + distance);
				this.update();
			}, this), 30);
		} else {
			this.speed(this.duration(this.current(), position, speed));
			this.current(position);
			this.update();
		}
	};

	/**
	 * Slides to the next item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.next = function(speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) + 1, speed);
	};

	/**
	 * Slides to the previous item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
	Owl.prototype.prev = function(speed) {
		speed = speed || false;
		this.to(this.relative(this.current()) - 1, speed);
	};

	/**
	 * Handles the end of an animation.
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
	Owl.prototype.transitionEnd = function(event) {

		// if css2 animation then event object is undefined
		if (event !== undefined) {
			event.stopPropagation();

			// Catch only owl-stage transitionEnd event
			if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) {
				return false;
			}
		}

		this.state.inMotion = false;
		this.trigger('translated');
	};

	/**
	 * Gets viewport width.
	 * @protected
	 * @return {Number} - The width in pixel.
	 */
	Owl.prototype.viewport = function() {
		var width;
		if (this.options.responsiveBaseElement !== window) {
			width = $(this.options.responsiveBaseElement).width();
		} else if (window.innerWidth) {
			width = window.innerWidth;
		} else if (document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
		} else {
			throw 'Can not detect viewport width.';
		}
		return width;
	};

	/**
	 * Replaces the current content.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The new content.
	 */
	Owl.prototype.replace = function(content) {
		this.$stage.empty();
		this._items = [];

		if (content) {
			content = (content instanceof jQuery) ? content : $(content);
		}

		if (this.settings.nestedItemSelector) {
			content = content.find('.' + this.settings.nestedItemSelector);
		}

		content.filter(function() {
			return this.nodeType === 1;
		}).each($.proxy(function(index, item) {
			item = this.prepare(item);
			this.$stage.append(item);
			this._items.push(item);
			this._mergers.push(item.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
		}, this));

		this.reset($.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);

		this.invalidate('items');
	};

	/**
	 * Adds an item.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The item content to add.
	 * @param {Number} [position] - The relative position at which to insert the item otherwise the item will be added to the end.
	 */
	Owl.prototype.add = function(content, position) {
		position = position === undefined ? this._items.length : this.normalize(position, true);

		this.trigger('add', { content: content, position: position });

		if (this._items.length === 0 || position === this._items.length) {
			this.$stage.append(content);
			this._items.push(content);
			this._mergers.push(content.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
		} else {
			this._items[position].before(content);
			this._items.splice(position, 0, content);
			this._mergers.splice(position, 0, content.find('[data-merge]').andSelf('[data-merge]').attr('data-merge') * 1 || 1);
		}

		this.invalidate('items');

		this.trigger('added', { content: content, position: position });
	};

	/**
	 * Removes an item by its position.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {Number} position - The relative position of the item to remove.
	 */
	Owl.prototype.remove = function(position) {
		position = this.normalize(position, true);

		if (position === undefined) {
			return;
		}

		this.trigger('remove', { content: this._items[position], position: position });

		this._items[position].remove();
		this._items.splice(position, 1);
		this._mergers.splice(position, 1);

		this.invalidate('items');

		this.trigger('removed', { content: null, position: position });
	};

	/**
	 * Adds triggerable events.
	 * @protected
	 */
	Owl.prototype.addTriggerableEvents = function() {
		var handler = $.proxy(function(callback, event) {
			return $.proxy(function(e) {
				if (e.relatedTarget !== this) {
					this.suppress([ event ]);
					callback.apply(this, [].slice.call(arguments, 1));
					this.release([ event ]);
				}
			}, this);
		}, this);

		$.each({
			'next': this.next,
			'prev': this.prev,
			'to': this.to,
			'destroy': this.destroy,
			'refresh': this.refresh,
			'replace': this.replace,
			'add': this.add,
			'remove': this.remove
		}, $.proxy(function(event, callback) {
			this.$element.on(event + '.owl.carousel', handler(callback, event + '.owl.carousel'));
		}, this));

	};

	/**
	 * Watches the visibility of the carousel element.
	 * @protected
	 */
	Owl.prototype.watchVisibility = function() {

		// test on zepto
		if (!isElVisible(this.$element.get(0))) {
			this.$element.addClass('owl-hidden');
			window.clearInterval(this.e._checkVisibile);
			this.e._checkVisibile = window.setInterval($.proxy(checkVisible, this), 500);
		}

		function isElVisible(el) {
			return el.offsetWidth > 0 && el.offsetHeight > 0;
		}

		function checkVisible() {
			if (isElVisible(this.$element.get(0))) {
				this.$element.removeClass('owl-hidden');
				this.refresh();
				window.clearInterval(this.e._checkVisibile);
			}
		}
	};

	/**
	 * Preloads images with auto width.
	 * @protected
	 * @todo Still to test
	 */
	Owl.prototype.preloadAutoWidthImages = function(imgs) {
		var loaded, that, $el, img;

		loaded = 0;
		that = this;
		imgs.each(function(i, el) {
			$el = $(el);
			img = new Image();

			img.onload = function() {
				loaded++;
				$el.attr('src', img.src);
				$el.css('opacity', 1);
				if (loaded >= imgs.length) {
					that.state.imagesLoaded = true;
					that.initialize();
				}
			};

			img.src = $el.attr('src') || $el.attr('data-src') || $el.attr('data-src-retina');
		});
	};

	/**
	 * Destroys the carousel.
	 * @public
	 */
	Owl.prototype.destroy = function() {

		if (this.$element.hasClass(this.settings.themeClass)) {
			this.$element.removeClass(this.settings.themeClass);
		}

		if (this.settings.responsive !== false) {
			$(window).off('resize.owl.carousel');
		}

		if (this.transitionEndVendor) {
			this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd);
		}

		for ( var i in this._plugins) {
			this._plugins[i].destroy();
		}

		if (this.settings.mouseDrag || this.settings.touchDrag) {
			this.$stage.off('mousedown touchstart touchcancel');
			$(document).off('.owl.dragEvents');
			this.$stage.get(0).onselectstart = function() {};
			this.$stage.off('dragstart', function() { return false });
		}

		// remove event handlers in the ".owl.carousel" namespace
		this.$element.off('.owl');

		this.$stage.children('.cloned').remove();
		this.e = null;
		this.$element.removeData('owlCarousel');

		this.$stage.children().contents().unwrap();
		this.$stage.children().unwrap();
		this.$stage.unwrap();
	};

	/**
	 * Operators to calculate right-to-left and left-to-right.
	 * @protected
	 * @param {Number} [a] - The left side operand.
	 * @param {String} [o] - The operator.
	 * @param {Number} [b] - The right side operand.
	 */
	Owl.prototype.op = function(a, o, b) {
		var rtl = this.settings.rtl;
		switch (o) {
			case '<':
				return rtl ? a > b : a < b;
			case '>':
				return rtl ? a < b : a > b;
			case '>=':
				return rtl ? a <= b : a >= b;
			case '<=':
				return rtl ? a >= b : a <= b;
			default:
				break;
		}
	};

	/**
	 * Attaches to an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The event handler to attach.
	 * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.
	 */
	Owl.prototype.on = function(element, event, listener, capture) {
		if (element.addEventListener) {
			element.addEventListener(event, listener, capture);
		} else if (element.attachEvent) {
			element.attachEvent('on' + event, listener);
		}
	};

	/**
	 * Detaches from an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The attached event handler to detach.
	 * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.
	 */
	Owl.prototype.off = function(element, event, listener, capture) {
		if (element.removeEventListener) {
			element.removeEventListener(event, listener, capture);
		} else if (element.detachEvent) {
			element.detachEvent('on' + event, listener);
		}
	};

	/**
	 * Triggers an public event.
	 * @protected
	 * @param {String} name - The event name.
	 * @param {*} [data=null] - The event data.
	 * @param {String} [namespace=.owl.carousel] - The event namespace.
	 * @returns {Event} - The event arguments.
	 */
	Owl.prototype.trigger = function(name, data, namespace) {
		var status = {
			item: { count: this._items.length, index: this.current() }
		}, handler = $.camelCase(
			$.grep([ 'on', name, namespace ], function(v) { return v })
				.join('-').toLowerCase()
		), event = $.Event(
			[ name, 'owl', namespace || 'carousel' ].join('.').toLowerCase(),
			$.extend({ relatedTarget: this }, status, data)
		);

		if (!this._supress[name]) {
			$.each(this._plugins, function(name, plugin) {
				if (plugin.onTrigger) {
					plugin.onTrigger(event);
				}
			});

			this.$element.trigger(event);

			if (this.settings && typeof this.settings[handler] === 'function') {
				this.settings[handler].apply(this, event);
			}
		}

		return event;
	};

	/**
	 * Suppresses events.
	 * @protected
	 * @param {Array.<String>} events - The events to suppress.
	 */
	Owl.prototype.suppress = function(events) {
		$.each(events, $.proxy(function(index, event) {
			this._supress[event] = true;
		}, this));
	}

	/**
	 * Releases suppressed events.
	 * @protected
	 * @param {Array.<String>} events - The events to release.
	 */
	Owl.prototype.release = function(events) {
		$.each(events, $.proxy(function(index, event) {
			delete this._supress[event];
		}, this));
	}

	/**
	 * Checks the availability of some browser features.
	 * @protected
	 */
	Owl.prototype.browserSupport = function() {
		this.support3d = isPerspective();

		if (this.support3d) {
			this.transformVendor = isTransform();

			// take transitionend event name by detecting transition
			var endVendors = [ 'transitionend', 'webkitTransitionEnd', 'transitionend', 'oTransitionEnd' ];
			this.transitionEndVendor = endVendors[isTransition()];

			// take vendor name from transform name
			this.vendorName = this.transformVendor.replace(/Transform/i, '');
			this.vendorName = this.vendorName !== '' ? '-' + this.vendorName.toLowerCase() + '-' : '';
		}

		this.state.orientation = window.orientation;
	};

	/**
	 * Get touch/drag coordinats.
	 * @private
	 * @param {event} - mousedown/touchstart event
	 * @returns {object} - Contains X and Y of current mouse/touch position
	 */

	function getTouches(event) {
		if (event.touches !== undefined) {
			return {
				x: event.touches[0].pageX,
				y: event.touches[0].pageY
			};
		}

		if (event.touches === undefined) {
			if (event.pageX !== undefined) {
				return {
					x: event.pageX,
					y: event.pageY
				};
			}

		if (event.pageX === undefined) {
			return {
					x: event.clientX,
					y: event.clientY
				};
			}
		}
	}

	/**
	 * Checks for CSS support.
	 * @private
	 * @param {Array} array - The CSS properties to check for.
	 * @returns {Array} - Contains the supported CSS property name and its index or `false`.
	 */
	function isStyleSupported(array) {
		var p, s, fake = document.createElement('div'), list = array;
		for (p in list) {
			s = list[p];
			if (typeof fake.style[s] !== 'undefined') {
				fake = null;
				return [ s, p ];
			}
		}
		return [ false ];
	}

	/**
	 * Checks for CSS transition support.
	 * @private
	 * @todo Realy bad design
	 * @returns {Number}
	 */
	function isTransition() {
		return isStyleSupported([ 'transition', 'WebkitTransition', 'MozTransition', 'OTransition' ])[1];
	}

	/**
	 * Checks for CSS transform support.
	 * @private
	 * @returns {String} The supported property name or false.
	 */
	function isTransform() {
		return isStyleSupported([ 'transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform' ])[0];
	}

	/**
	 * Checks for CSS perspective support.
	 * @private
	 * @returns {String} The supported property name or false.
	 */
	function isPerspective() {
		return isStyleSupported([ 'perspective', 'webkitPerspective', 'MozPerspective', 'OPerspective', 'MsPerspective' ])[0];
	}

	/**
	 * Checks wether touch is supported or not.
	 * @private
	 * @returns {Boolean}
	 */
	function isTouchSupport() {
		return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
	}

	/**
	 * Checks wether touch is supported or not for IE.
	 * @private
	 * @returns {Boolean}
	 */
	function isTouchSupportIE() {
		return window.navigator.msPointerEnabled;
	}

	/**
	 * The jQuery Plugin for the Owl Carousel
	 * @public
	 */
	$.fn.owlCarousel = function(options) {
		return this.each(function() {
			if (!$(this).data('owlCarousel')) {
				$(this).data('owlCarousel', new Owl(this, options));
			}
		});
	};

	/**
	 * The constructor for the jQuery Plugin
	 * @public
	 */
	$.fn.owlCarousel.Constructor = Owl;

})(window.Zepto || window.jQuery, window, document);

/**
 * Lazy Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the lazy plugin.
	 * @class The Lazy Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Lazy = function(carousel) {

		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Already loaded items.
		 * @protected
		 * @type {Array.<jQuery>}
		 */
		this._loaded = [];

		/**
		 * Event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel change.owl.carousel': $.proxy(function(e) {
				if (!e.namespace) {
					return;
				}

				if (!this._core.settings || !this._core.settings.lazyLoad) {
					return;
				}

				if ((e.property && e.property.name == 'position') || e.type == 'initialized') {
					var settings = this._core.settings,
						n = (settings.center && Math.ceil(settings.items / 2) || settings.items),
						i = ((settings.center && n * -1) || 0),
						position = ((e.property && e.property.value) || this._core.current()) + i,
						clones = this._core.clones().length,
						load = $.proxy(function(i, v) { this.load(v) }, this);

					while (i++ < n) {
						this.load(clones / 2 + this._core.relative(position));
						clones && $.each(this._core.clones(this._core.relative(position++)), load);
					}
				}
			}, this)
		};

		// set the default options
		this._core.options = $.extend({}, Lazy.Defaults, this._core.options);

		// register event handler
		this._core.$element.on(this._handlers);
	}

	/**
	 * Default options.
	 * @public
	 */
	Lazy.Defaults = {
		lazyLoad: false
	}

	/**
	 * Loads all resources of an item at the specified position.
	 * @param {Number} position - The absolute position of the item.
	 * @protected
	 */
	Lazy.prototype.load = function(position) {
		var $item = this._core.$stage.children().eq(position),
			$elements = $item && $item.find('.owl-lazy');

		if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
			return;
		}

		$elements.each($.proxy(function(index, element) {
			var $element = $(element), image,
				url = (window.devicePixelRatio > 1 && $element.attr('data-src-retina')) || $element.attr('data-src');

			this._core.trigger('load', { element: $element, url: url }, 'lazy');

			if ($element.is('img')) {
				$element.one('load.owl.lazy', $.proxy(function() {
					$element.css('opacity', 1);
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this)).attr('src', url);
			} else {
				image = new Image();
				image.onload = $.proxy(function() {
					$element.css({
						'background-image': 'url(' + url + ')',
						'opacity': '1'
					});
					this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
				}, this);
				image.src = url;
			}
		}, this));

		this._loaded.push($item.get(0));
	}

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Lazy.prototype.destroy = function() {
		var handler, property;

		for (handler in this.handlers) {
			this._core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	}

	$.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;

})(window.Zepto || window.jQuery, window, document);

/**
 * AutoHeight Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the auto height plugin.
	 * @class The Auto Height Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var AutoHeight = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function() {
				if (this._core.settings.autoHeight) {
					this.update();
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (this._core.settings.autoHeight && e.property.name == 'position'){
					this.update();
				}
			}, this),
			'loaded.owl.lazy': $.proxy(function(e) {
				if (this._core.settings.autoHeight && e.element.closest('.' + this._core.settings.itemClass)
					=== this._core.$stage.children().eq(this._core.current())) {
					this.update();
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	AutoHeight.Defaults = {
		autoHeight: false,
		autoHeightClass: 'owl-height'
	};

	/**
	 * Updates the view.
	 */
	AutoHeight.prototype.update = function() {
		this._core.$stage.parent()
			.height(this._core.$stage.children().eq(this._core.current()).height())
			.addClass(this._core.settings.autoHeightClass);
	};

	AutoHeight.prototype.destroy = function() {
		var handler, property;

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;

})(window.Zepto || window.jQuery, window, document);

/**
 * Video Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the video plugin.
	 * @class The Video Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Video = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Cache all video URLs.
		 * @protected
		 * @type {Object}
		 */
		this._videos = {};

		/**
		 * Current playing item.
		 * @protected
		 * @type {jQuery}
		 */
		this._playing = null;

		/**
		 * Whether this is in fullscreen or not.
		 * @protected
		 * @type {Boolean}
		 */
		this._fullscreen = false;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'resize.owl.carousel': $.proxy(function(e) {
				if (this._core.settings.video && !this.isInFullScreen()) {
					e.preventDefault();
				}
			}, this),
			'refresh.owl.carousel changed.owl.carousel': $.proxy(function(e) {
				if (this._playing) {
					this.stop();
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function(e) {
				var $element = $(e.content).find('.owl-video');
				if ($element.length) {
					$element.css('display', 'none');
					this.fetch($element, $(e.content));
				}
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Video.Defaults, this._core.options);

		// register event handlers
		this._core.$element.on(this._handlers);

		this._core.$element.on('click.owl.video', '.owl-video-play-icon', $.proxy(function(e) {
			this.play(e);
		}, this));
	};

	/**
	 * Default options.
	 * @public
	 */
	Video.Defaults = {
		video: false,
		videoHeight: false,
		videoWidth: false
	};

	/**
	 * Gets the video ID and the type (YouTube/Vimeo only).
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {jQuery} item - The item containing the video.
	 */
	Video.prototype.fetch = function(target, item) {

		var type = target.attr('data-vimeo-id') ? 'vimeo' : 'youtube',
			id = target.attr('data-vimeo-id') || target.attr('data-youtube-id'),
			width = target.attr('data-width') || this._core.settings.videoWidth,
			height = target.attr('data-height') || this._core.settings.videoHeight,
			url = target.attr('href');

		if (url) {
			id = url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

			if (id[3].indexOf('youtu') > -1) {
				type = 'youtube';
			} else if (id[3].indexOf('vimeo') > -1) {
				type = 'vimeo';
			} else {
				throw new Error('Video URL not supported.');
			}
			id = id[6];
		} else {
			throw new Error('Missing video URL.');
		}

		this._videos[url] = {
			type: type,
			id: id,
			width: width,
			height: height
		};

		item.attr('data-video', url);

		this.thumbnail(target, this._videos[url]);
	};

	/**
	 * Creates video thumbnail.
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {Object} info - The video info object.
	 * @see `fetch`
	 */
	Video.prototype.thumbnail = function(target, video) {

		var tnLink,
			icon,
			path,
			dimensions = video.width && video.height ? 'style="width:' + video.width + 'px;height:' + video.height + 'px;"' : '',
			customTn = target.find('img'),
			srcType = 'src',
			lazyClass = '',
			settings = this._core.settings,
			create = function(path) {
				icon = '<div class="owl-video-play-icon"></div>';

				if (settings.lazyLoad) {
					tnLink = '<div class="owl-video-tn ' + lazyClass + '" ' + srcType + '="' + path + '"></div>';
				} else {
					tnLink = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + path + ')"></div>';
				}
				target.after(tnLink);
				target.after(icon);
			};

		// wrap video content into owl-video-wrapper div
		target.wrap('<div class="owl-video-wrapper"' + dimensions + '></div>');

		if (this._core.settings.lazyLoad) {
			srcType = 'data-src';
			lazyClass = 'owl-lazy';
		}

		// custom thumbnail
		if (customTn.length) {
			create(customTn.attr(srcType));
			customTn.remove();
			return false;
		}

		if (video.type === 'youtube') {
			path = "http://img.youtube.com/vi/" + video.id + "/hqdefault.jpg";
			create(path);
		} else if (video.type === 'vimeo') {
			$.ajax({
				type: 'GET',
				url: 'http://vimeo.com/api/v2/video/' + video.id + '.json',
				jsonp: 'callback',
				dataType: 'jsonp',
				success: function(data) {
					path = data[0].thumbnail_large;
					create(path);
				}
			});
		}
	};

	/**
	 * Stops the current video.
	 * @public
	 */
	Video.prototype.stop = function() {
		this._core.trigger('stop', null, 'video');
		this._playing.find('.owl-video-frame').remove();
		this._playing.removeClass('owl-video-playing');
		this._playing = null;
	};

	/**
	 * Starts the current video.
	 * @public
	 * @param {Event} ev - The event arguments.
	 */
	Video.prototype.play = function(ev) {
		this._core.trigger('play', null, 'video');

		if (this._playing) {
			this.stop();
		}

		var target = $(ev.target || ev.srcElement),
			item = target.closest('.' + this._core.settings.itemClass),
			video = this._videos[item.attr('data-video')],
			width = video.width || '100%',
			height = video.height || this._core.$stage.height(),
			html, wrap;

		if (video.type === 'youtube') {
			html = '<iframe width="' + width + '" height="' + height + '" src="http://www.youtube.com/embed/'
				+ video.id + '?autoplay=1&v=' + video.id + '" frameborder="0" allowfullscreen></iframe>';
		} else if (video.type === 'vimeo') {
			html = '<iframe src="http://player.vimeo.com/video/' + video.id + '?autoplay=1" width="' + width
				+ '" height="' + height
				+ '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		}

		item.addClass('owl-video-playing');
		this._playing = item;

		wrap = $('<div style="height:' + height + 'px; width:' + width + 'px" class="owl-video-frame">'
			+ html + '</div>');
		target.after(wrap);
	};

	/**
	 * Checks whether an video is currently in full screen mode or not.
	 * @todo Bad style because looks like a readonly method but changes members.
	 * @protected
	 * @returns {Boolean}
	 */
	Video.prototype.isInFullScreen = function() {

		// if Vimeo Fullscreen mode
		var element = document.fullscreenElement || document.mozFullScreenElement
			|| document.webkitFullscreenElement;

		if (element && $(element).parent().hasClass('owl-video-frame')) {
			this._core.speed(0);
			this._fullscreen = true;
		}

		if (element && this._fullscreen && this._playing) {
			return false;
		}

		// comming back from fullscreen
		if (this._fullscreen) {
			this._fullscreen = false;
			return false;
		}

		// check full screen mode and window orientation
		if (this._playing) {
			if (this._core.state.orientation !== window.orientation) {
				this._core.state.orientation = window.orientation;
				return false;
			}
		}

		return true;
	};

	/**
	 * Destroys the plugin.
	 */
	Video.prototype.destroy = function() {
		var handler, property;

		this._core.$element.off('click.owl.video');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Video = Video;

})(window.Zepto || window.jQuery, window, document);

/**
 * Animate Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the animate plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
	var Animate = function(scope) {
		this.core = scope;
		this.core.options = $.extend({}, Animate.Defaults, this.core.options);
		this.swapping = true;
		this.previous = undefined;
		this.next = undefined;
		this.pageAnimations = [];

		this.handlers = {
			'change.owl.carousel': $.proxy(function(e) {
				if (e.property.name == 'position') {
					this.previous = this.core.current();
					this.next = e.property.value;
				}
			}, this),
			'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function(e) {
				this.swapping = e.type == 'translated';
			}, this),
			'translate.owl.carousel': $.proxy(function(e) {

				var pageAnimationIndex = this.pageHasAnimations(e.page.index) ? e.page.index : null;

				if (
					this.swapping
					&& (
						this.core.options.animateOut
						|| this.core.options.animateIn
						|| pageAnimationIndex
					)
				) {
					this.swap(pageAnimationIndex);
				}
			}, this)
		};

		this.core.$element.on(this.handlers);
		this.setupPageAnimations();
	};

	/**
	 * Default options.
	 * @public
	 */
	Animate.Defaults = {
		animateOut: false,
		animateIn: false
	};

	Animate.prototype.pageHasAnimations = function(index) {

		if (
			typeof this.pageAnimations[index] !== 'undefined'
			&& (typeof this.pageAnimations[index]['animateIn'] === 'string' || typeof this.pageAnimations[index]['animateOut'] === 'string')
		) {
			return true;
		}

		return false;
	}

	Animate.prototype.setupPageAnimations = function() {

		var options = this.core.options;

		if (options.pageAnimations === undefined) {
			return;
		}

		if (!$.isArray(options.pageAnimations)) {
			throw "pageAnimations passed in must be an array";
		}

		$.each(options.pageAnimations, function(i, pageAnimationOptions) {
			this.pageAnimations[pageAnimationOptions.page] = {
				animateIn: pageAnimationOptions.animateIn,
				animateOut: pageAnimationOptions.animateOut,
				animationDuration: pageAnimationOptions.animationDuration
			}
		}.bind(this));

	}

	/**
	 * Toggles the animation classes whenever an translations starts.
	 * @protected
	 * @returns {Boolean|undefined}
	 */
	Animate.prototype.swap = function(pageAnimationIndex) {

		if (this.core.settings.items !== 1 || !this.core.support3d) {
			return;
		}

		this.core.speed(0);

		var pageAnimationIncoming = $.isNumeric(pageAnimationIndex) ? this.pageAnimations[pageAnimationIndex].animateIn : null;
		var pageAnimationOutgoing = $.isNumeric(pageAnimationIndex) ? this.pageAnimations[pageAnimationIndex].animateOut : null;
		var pageAnimationDuration = $.isNumeric(pageAnimationIndex) ? this.pageAnimations[pageAnimationIndex].animationDuration : null;

		var left,
			clear = $.proxy(this.clear, this),
			previous = this.core.$stage.children().eq(this.previous),
			next = this.core.$stage.children().eq(this.next),
			incoming = pageAnimationIncoming || this.core.settings.animateIn,
			outgoing = pageAnimationOutgoing || this.core.settings.animateOut,
			duration = pageAnimationDuration || this.core.settings.pageAnimationDuration;

		if (this.core.current() === this.previous) {
			return;
		}

		if (outgoing) {
			left = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
			previous.css( { 'left': left + 'px' } )
				.addClass('animated owl-animated-out')
				.addClass(outgoing)
				.css({
					'-webkit-animation-duration': duration,
					'-moz-animation-duration':    duration,
					'-ms-animation-duration':     duration,
					'-o-animation-duration':      duration,
					'animation-duration':         duration
				})
				.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', clear);
		}

		if (incoming) {
			next.addClass('animated owl-animated-in')
				.addClass(incoming)
				.css({
					'-webkit-animation-duration': duration,
					'-moz-animation-duration':    duration,
					'-ms-animation-duration':     duration,
					'-o-animation-duration':      duration,
					'animation-duration':         duration
				})
				.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', clear);
		}
	};

	Animate.prototype.clear = function(e) {

		var pageAnimationClasses = "";
		this.pageAnimations.forEach(function(animationOptions){
			pageAnimationClasses += (animationOptions.animateIn) ? animationOptions.animateIn + ' ' : "";
			pageAnimationClasses += (animationOptions.animateOut) ? animationOptions.animateOut + ' ': "";
		});

		$(e.target).css( { 'left': '' } )
			.removeClass('animated owl-animated-out owl-animated-in')
			.removeClass(this.core.settings.animateIn)
			.removeClass(this.core.settings.animateOut)
			.removeClass(pageAnimationClasses);
		this.core.transitionEnd();
	}

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Animate.prototype.destroy = function() {
		var handler, property;

		for (handler in this.handlers) {
			this.core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.Animate = Animate;

})(window.Zepto || window.jQuery, window, document);

/**
 * Autoplay Plugin
 * @version 2.0.0
 * @author Bartosz Wojciechowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {

	/**
	 * Creates the autoplay plugin.
	 * @class The Autoplay Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
	var Autoplay = function(scope) {
		this.core = scope;
		this.core.options = $.extend({}, Autoplay.Defaults, this.core.options);

		this.handlers = {
			'translated.owl.carousel refreshed.owl.carousel': $.proxy(function() {
				this.autoplay();
			}, this),
			'play.owl.autoplay': $.proxy(function(e, t, s) {
				this.play(t, s);
			}, this),
			'stop.owl.autoplay': $.proxy(function() {
				this.stop();
			}, this),
			'mouseover.owl.autoplay': $.proxy(function() {
				if (this.core.settings.autoplayHoverPause) {
					this.pause();
				}
			}, this),
			'mouseleave.owl.autoplay': $.proxy(function() {
				if (this.core.settings.autoplayHoverPause) {
					this.autoplay();
				}
			}, this)
		};

		this.core.$element.on(this.handlers);
	};

	/**
	 * Default options.
	 * @public
	 */
	Autoplay.Defaults = {
		autoplay: false,
		autoplayTimeout: 5000,
		autoplayHoverPause: false,
		autoplaySpeed: false
	};

	/**
	 * @protected
	 * @todo Must be documented.
	 */
	Autoplay.prototype.autoplay = function() {
		if (this.core.settings.autoplay && !this.core.state.videoPlay) {
			window.clearInterval(this.interval);

			this.interval = window.setInterval($.proxy(function() {
				this.play();
			}, this), this.core.settings.autoplayTimeout);
		} else {
			window.clearInterval(this.interval);
		}
	};

	/**
	 * Starts the autoplay.
	 * @public
	 * @param {Number} [timeout] - ...
	 * @param {Number} [speed] - ...
	 * @returns {Boolean|undefined} - ...
	 * @todo Must be documented.
	 */
	Autoplay.prototype.play = function(timeout, speed) {
		// if tab is inactive - doesnt work in <IE10
		if (document.hidden === true) {
			return;
		}

		if (this.core.state.isTouch || this.core.state.isScrolling
			|| this.core.state.isSwiping || this.core.state.inMotion) {
			return;
		}

		if (this.core.settings.autoplay === false) {
			window.clearInterval(this.interval);
			return;
		}

		this.core.next(this.core.settings.autoplaySpeed);
	};

	/**
	 * Stops the autoplay.
	 * @public
	 */
	Autoplay.prototype.stop = function() {
		window.clearInterval(this.interval);
	};

	/**
	 * Pauses the autoplay.
	 * @public
	 */
	Autoplay.prototype.pause = function() {
		window.clearInterval(this.interval);
	};

	/**
	 * Destroys the plugin.
	 */
	Autoplay.prototype.destroy = function() {
		var handler, property;

		window.clearInterval(this.interval);

		for (handler in this.handlers) {
			this.core.$element.off(handler, this.handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	};

	$.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;

})(window.Zepto || window.jQuery, window, document);

/**
 * Navigation Plugin
 * @version 2.0.0
 * @author Artus Kolanowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {
	'use strict';

	/**
	 * Creates the navigation plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} carousel - The Owl Carousel.
	 */
	var Navigation = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Indicates whether the plugin is initialized or not.
		 * @protected
		 * @type {Boolean}
		 */
		this._initialized = false;

		/**
		 * The current paging indexes.
		 * @protected
		 * @type {Array}
		 */
		this._pages = [];

		/**
		 * All DOM elements of the user interface.
		 * @protected
		 * @type {Object}
		 */
		this._controls = {};

		/**
		 * Markup for an indicator.
		 * @protected
		 * @type {Array.<String>}
		 */
		this._templates = [];

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
		this.$element = this._core.$element;

		/**
		 * Overridden methods of the carousel.
		 * @protected
		 * @type {Object}
		 */
		this._overrides = {
			next: this._core.next,
			prev: this._core.prev,
			to: this._core.to
		};

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'prepared.owl.carousel': $.proxy(function(e) {
				if (this._core.settings.dotsData) {
					this._templates.push($(e.content).find('[data-dot]').andSelf('[data-dot]').attr('data-dot'));
				}
			}, this),
			'add.owl.carousel': $.proxy(function(e) {
				if (this._core.settings.dotsData) {
					this._templates.splice(e.position, 0, $(e.content).find('[data-dot]').andSelf('[data-dot]').attr('data-dot'));
				}
			}, this),
			'remove.owl.carousel prepared.owl.carousel': $.proxy(function(e) {
				if (this._core.settings.dotsData) {
					this._templates.splice(e.position, 1);
				}
			}, this),
			'change.owl.carousel': $.proxy(function(e) {
				if (e.property.name == 'position') {
					if (!this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
						var current = this._core.current(),
							maximum = this._core.maximum(),
							minimum = this._core.minimum();
						e.data = e.property.value > maximum
							? current >= maximum ? minimum : maximum
							: e.property.value < minimum ? maximum : e.property.value;
					}
				}
			}, this),
			'changed.owl.carousel': $.proxy(function(e) {
				if (e.property.name == 'position') {
					this.draw();
				}
			}, this),
			'refreshed.owl.carousel': $.proxy(function() {
				if (!this._initialized) {
					this.initialize();
					this._initialized = true;
				}
				this._core.trigger('refresh', null, 'navigation');
				this.update();
				this.draw();
				this._core.trigger('refreshed', null, 'navigation');
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Navigation.Defaults, this._core.options);

		// register event handlers
		this.$element.on(this._handlers);
	}

	/**
	 * Default options.
	 * @public
	 * @todo Rename `slideBy` to `navBy`
	 */
	Navigation.Defaults = {
		nav: false,
		navRewind: true,
		navText: [ 'prev', 'next' ],
		navSpeed: false,
		navElement: 'div',
		navContainer: false,
		navContainerClass: 'owl-nav',
		navClass: [ 'owl-prev', 'owl-next' ],
		slideBy: 1,
		dotClass: 'owl-dot',
		dotsClass: 'owl-dots',
		dots: true,
		dotsEach: false,
		dotData: false,
		dotsSpeed: false,
		dotsContainer: false,
		controlsClass: 'owl-controls'
	}

	/**
	 * Initializes the layout of the plugin and extends the carousel.
	 * @protected
	 */
	Navigation.prototype.initialize = function() {
		var $container, override,
			options = this._core.settings;

		// create the indicator template
		if (!options.dotsData) {
			this._templates = [ $('<div>')
				.addClass(options.dotClass)
				.append($('<span>'))
				.prop('outerHTML') ];
		}

		// create controls container if needed
		if (!options.navContainer || !options.dotsContainer) {
			this._controls.$container = $('<div>')
				.addClass(options.controlsClass)
				.appendTo(this.$element);
		}

		// create DOM structure for absolute navigation
		this._controls.$indicators = options.dotsContainer ? $(options.dotsContainer)
			: $('<div>').hide().addClass(options.dotsClass).appendTo(this._controls.$container);

		this._controls.$indicators.on('click', 'div', $.proxy(function(e) {
			var index = $(e.target).parent().is(this._controls.$indicators)
				? $(e.target).index() : $(e.target).parent().index();

			e.preventDefault();

			this.to(index, options.dotsSpeed);
		}, this));

		// create DOM structure for relative navigation
		$container = options.navContainer ? $(options.navContainer)
			: $('<div>').addClass(options.navContainerClass).prependTo(this._controls.$container);

		this._controls.$next = $('<' + options.navElement + '>');
		this._controls.$previous = this._controls.$next.clone();

		this._controls.$previous
			.addClass(options.navClass[0])
			.html(options.navText[0])
			.hide()
			.prependTo($container)
			.on('click', $.proxy(function(e) {
				this.prev(options.navSpeed);
			}, this));
		this._controls.$next
			.addClass(options.navClass[1])
			.html(options.navText[1])
			.hide()
			.appendTo($container)
			.on('click', $.proxy(function(e) {
				this.next(options.navSpeed);
			}, this));

		// override public methods of the carousel
		for (override in this._overrides) {
			this._core[override] = $.proxy(this[override], this);
		}
	}

	/**
	 * Destroys the plugin.
	 * @protected
	 */
	Navigation.prototype.destroy = function() {
		var handler, control, property, override;

		for (handler in this._handlers) {
			this.$element.off(handler, this._handlers[handler]);
		}
		for (control in this._controls) {
			this._controls[control].remove();
		}
		for (override in this.overides) {
			this._core[override] = this._overrides[override];
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	}

	/**
	 * Updates the internal state.
	 * @protected
	 */
	Navigation.prototype.update = function() {
		var i, j, k,
			options = this._core.settings,
			lower = this._core.clones().length / 2,
			upper = lower + this._core.items().length,
			size = options.center || options.autoWidth || options.dotData
				? 1 : options.dotsEach || options.items;

		if (options.slideBy !== 'page') {
			options.slideBy = Math.min(options.slideBy, options.items);
		}

		if (options.dots || options.slideBy == 'page') {
			this._pages = [];

			for (i = lower, j = 0, k = 0; i < upper; i++) {
				if (j >= size || j === 0) {
					this._pages.push({
						start: i - lower,
						end: i - lower + size - 1
					});
					j = 0, ++k;
				}
				j += this._core.mergers(this._core.relative(i));
			}
		}
	}

	/**
	 * Draws the user interface.
	 * @todo The option `dotData` wont work.
	 * @protected
	 */
	Navigation.prototype.draw = function() {
		var difference, i, html = '',
			options = this._core.settings,
			$items = this._core.$stage.children(),
			index = this._core.relative(this._core.current());

		if (options.nav && !options.loop && !options.navRewind) {
			this._controls.$previous.toggleClass('disabled', index <= 0);
			this._controls.$next.toggleClass('disabled', index >= this._core.maximum());
		}

		this._controls.$previous.toggle(options.nav);
		this._controls.$next.toggle(options.nav);

		if (options.dots) {
			difference = this._pages.length - this._controls.$indicators.children().length;

			if (options.dotData && difference !== 0) {
				for (i = 0; i < this._controls.$indicators.children().length; i++) {
					html += this._templates[this._core.relative(i)];
				}
				this._controls.$indicators.html(html);
			} else if (difference > 0) {
				html = new Array(difference + 1).join(this._templates[0]);
				this._controls.$indicators.append(html);
			} else if (difference < 0) {
				this._controls.$indicators.children().slice(difference).remove();
			}

			this._controls.$indicators.find('.active').removeClass('active');
			this._controls.$indicators.children().eq($.inArray(this.current(), this._pages)).addClass('active');
		}

		this._controls.$indicators.toggle(options.dots);
	}

	/**
	 * Extends event data.
	 * @protected
	 * @param {Event} event - The event object which gets thrown.
	 */
	Navigation.prototype.onTrigger = function(event) {
		var settings = this._core.settings;

		event.page = {
			index: $.inArray(this.current(), this._pages),
			count: this._pages.length,
			size: settings && (settings.center || settings.autoWidth || settings.dotData
				? 1 : settings.dotsEach || settings.items)
		};
	}

	/**
	 * Gets the current page position of the carousel.
	 * @protected
	 * @returns {Number}
	 */
	Navigation.prototype.current = function() {
		var index = this._core.relative(this._core.current());
		return $.grep(this._pages, function(o) {
			return o.start <= index && o.end >= index;
		}).pop();
	}

	/**
	 * Gets the current succesor/predecessor position.
	 * @protected
	 * @returns {Number}
	 */
	Navigation.prototype.getPosition = function(successor) {
		var position, length,
			options = this._core.settings;

		if (options.slideBy == 'page') {
			position = $.inArray(this.current(), this._pages);
			length = this._pages.length;
			successor ? ++position : --position;
			position = this._pages[((position % length) + length) % length].start;
		} else {
			position = this._core.relative(this._core.current());
			length = this._core.items().length;
			successor ? position += options.slideBy : position -= options.slideBy;
		}
		return position;
	}

	/**
	 * Slides to the next item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
	Navigation.prototype.next = function(speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
	}

	/**
	 * Slides to the previous item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
	Navigation.prototype.prev = function(speed) {
		$.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
	}

	/**
	 * Slides to the specified item or page.
	 * @public
	 * @param {Number} position - The position of the item or page.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 * @param {Boolean} [standard=false] - Whether to use the standard behaviour or not.
	 */
	Navigation.prototype.to = function(position, speed, standard) {
		var length;

		if (!standard) {
			length = this._pages.length;
			$.proxy(this._overrides.to, this._core)(this._pages[((position % length) + length) % length].start, speed);
		} else {
			$.proxy(this._overrides.to, this._core)(position, speed);
		}
	}

	$.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;

})(window.Zepto || window.jQuery, window, document);

/**
 * Hash Plugin
 * @version 2.0.0
 * @author Artus Kolanowski
 * @license The MIT License (MIT)
 */
;(function($, window, document, undefined) {
	'use strict';

	/**
	 * Creates the hash plugin.
	 * @class The Hash Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
	var Hash = function(carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
		this._core = carousel;

		/**
		 * Hash table for the hashes.
		 * @protected
		 * @type {Object}
		 */
		this._hashes = {};

		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
		this.$element = this._core.$element;

		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
		this._handlers = {
			'initialized.owl.carousel': $.proxy(function() {
				if (this._core.settings.startPosition == 'URLHash') {
					$(window).trigger('hashchange.owl.navigation');
				}
			}, this),
			'prepared.owl.carousel': $.proxy(function(e) {
				var hash = $(e.content).find('[data-hash]').andSelf('[data-hash]').attr('data-hash');
				this._hashes[hash] = e.content;
			}, this)
		};

		// set default options
		this._core.options = $.extend({}, Hash.Defaults, this._core.options);

		// register the event handlers
		this.$element.on(this._handlers);

		// register event listener for hash navigation
		$(window).on('hashchange.owl.navigation', $.proxy(function() {
			var hash = window.location.hash.substring(1),
				items = this._core.$stage.children(),
				position = this._hashes[hash] && items.index(this._hashes[hash]) || 0;

			if (!hash) {
				return false;
			}

			this._core.to(position, false, true);
		}, this));
	}

	/**
	 * Default options.
	 * @public
	 */
	Hash.Defaults = {
		URLhashListener: false
	}

	/**
	 * Destroys the plugin.
	 * @public
	 */
	Hash.prototype.destroy = function() {
		var handler, property;

		$(window).off('hashchange.owl.navigation');

		for (handler in this._handlers) {
			this._core.$element.off(handler, this._handlers[handler]);
		}
		for (property in Object.getOwnPropertyNames(this)) {
			typeof this[property] != 'function' && (this[property] = null);
		}
	}

	$.fn.owlCarousel.Constructor.Plugins.Hash = Hash;

})(window.Zepto || window.jQuery, window, document);
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL293bC5jYXJvdXNlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBPd2wgY2Fyb3VzZWxcbiAqIEB2ZXJzaW9uIDIuMC4wXG4gKiBAYXV0aG9yIEJhcnRvc3ogV29qY2llY2hvd3NraVxuICogQGxpY2Vuc2UgVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKiBAdG9kbyBMYXp5IExvYWQgSWNvblxuICogQHRvZG8gcHJldmVudCBhbmltYXRpb25lbmQgYnVibGluZ1xuICogQHRvZG8gaXRlbXNTY2FsZVVwXG4gKiBAdG9kbyBUZXN0IFplcHRvXG4gKiBAdG9kbyBzdGFnZVBhZGRpbmcgY2FsY3VsYXRlIHdyb25nIGFjdGl2ZSBjbGFzc2VzXG4gKi9cbjsoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG5cblx0dmFyIGRyYWcsIHN0YXRlLCBlO1xuXG5cdC8qKlxuXHQgKiBUZW1wbGF0ZSBmb3Igc3RhdHVzIGluZm9ybWF0aW9uIGFib3V0IGRyYWcgYW5kIHRvdWNoIGV2ZW50cy5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdGRyYWcgPSB7XG5cdFx0c3RhcnQ6IDAsXG5cdFx0c3RhcnRYOiAwLFxuXHRcdHN0YXJ0WTogMCxcblx0XHRjdXJyZW50OiAwLFxuXHRcdGN1cnJlbnRYOiAwLFxuXHRcdGN1cnJlbnRZOiAwLFxuXHRcdG9mZnNldFg6IDAsXG5cdFx0b2Zmc2V0WTogMCxcblx0XHRkaXN0YW5jZTogbnVsbCxcblx0XHRzdGFydFRpbWU6IDAsXG5cdFx0ZW5kVGltZTogMCxcblx0XHR1cGRhdGVkWDogMCxcblx0XHR0YXJnZXRFbDogbnVsbFxuXHR9O1xuXG5cdC8qKlxuXHQgKiBUZW1wbGF0ZSBmb3Igc29tZSBzdGF0dXMgaW5mb3JtYXRpb25zLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0c3RhdGUgPSB7XG5cdFx0aXNUb3VjaDogZmFsc2UsXG5cdFx0aXNTY3JvbGxpbmc6IGZhbHNlLFxuXHRcdGlzU3dpcGluZzogZmFsc2UsXG5cdFx0ZGlyZWN0aW9uOiBmYWxzZSxcblx0XHRpbk1vdGlvbjogZmFsc2Vcblx0fTtcblxuXHQvKipcblx0ICogRXZlbnQgZnVuY3Rpb25zIHJlZmVyZW5jZXMuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRlID0ge1xuXHRcdF9vbkRyYWdTdGFydDogbnVsbCxcblx0XHRfb25EcmFnTW92ZTogbnVsbCxcblx0XHRfb25EcmFnRW5kOiBudWxsLFxuXHRcdF90cmFuc2l0aW9uRW5kOiBudWxsLFxuXHRcdF9yZXNpemVyOiBudWxsLFxuXHRcdF9yZXNwb25zaXZlQ2FsbDogbnVsbCxcblx0XHRfZ29Ub0xvb3A6IG51bGwsXG5cdFx0X2NoZWNrVmlzaWJpbGU6IG51bGxcblx0fTtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGNhcm91c2VsLlxuXHQgKiBAY2xhc3MgVGhlIE93bCBDYXJvdXNlbC5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fGpRdWVyeX0gZWxlbWVudCAtIFRoZSBlbGVtZW50IHRvIGNyZWF0ZSB0aGUgY2Fyb3VzZWwgZm9yLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gVGhlIG9wdGlvbnNcblx0ICovXG5cdGZ1bmN0aW9uIE93bChlbGVtZW50LCBvcHRpb25zKSB7XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IHNldHRpbmdzIGZvciB0aGUgY2Fyb3VzZWwuXG5cdFx0ICogQHB1YmxpY1xuXHRcdCAqL1xuXHRcdHRoaXMuc2V0dGluZ3MgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCBvcHRpb25zIHNldCBieSB0aGUgY2FsbGVyIGluY2x1ZGluZyBkZWZhdWx0cy5cblx0XHQgKiBAcHVibGljXG5cdFx0ICovXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIE93bC5EZWZhdWx0cywgb3B0aW9ucyk7XG5cblx0XHQvKipcblx0XHQgKiBQbHVnaW4gZWxlbWVudC5cblx0XHQgKiBAcHVibGljXG5cdFx0ICovXG5cdFx0dGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cblx0XHQvKipcblx0XHQgKiBDYWNoZXMgaW5mb3JtYXRpb25zIGFib3V0IGRyYWcgYW5kIHRvdWNoIGV2ZW50cy5cblx0XHQgKi9cblx0XHR0aGlzLmRyYWcgPSAkLmV4dGVuZCh7fSwgZHJhZyk7XG5cblx0XHQvKipcblx0XHQgKiBDYWNoZXMgc29tZSBzdGF0dXMgaW5mb3JtYXRpb25zLlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKi9cblx0XHR0aGlzLnN0YXRlID0gJC5leHRlbmQoe30sIHN0YXRlKTtcblxuXHRcdC8qKlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKiBAdG9kbyBNdXN0IGJlIGRvY3VtZW50ZWRcblx0XHQgKi9cblx0XHR0aGlzLmUgPSAkLmV4dGVuZCh7fSwgZSk7XG5cblx0XHQvKipcblx0XHQgKiBSZWZlcmVuY2VzIHRvIHRoZSBydW5uaW5nIHBsdWdpbnMgb2YgdGhpcyBjYXJvdXNlbC5cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICovXG5cdFx0dGhpcy5fcGx1Z2lucyA9IHt9O1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudGx5IHN1cHByZXNzZWQgZXZlbnRzIHRvIHByZXZlbnQgdGhlbSBmcm9tIGJlZWluZyByZXRyaWdnZXJlZC5cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICovXG5cdFx0dGhpcy5fc3VwcmVzcyA9IHt9O1xuXG5cdFx0LyoqXG5cdFx0ICogQWJzb2x1dGUgY3VycmVudCBwb3NpdGlvbi5cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICovXG5cdFx0dGhpcy5fY3VycmVudCA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBBbmltYXRpb24gc3BlZWQgaW4gbWlsbGlzZWNvbmRzLlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKi9cblx0XHR0aGlzLl9zcGVlZCA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBDb29yZGluYXRlcyBvZiBhbGwgaXRlbXMgaW4gcGl4ZWwuXG5cdFx0ICogQHRvZG8gVGhlIG5hbWUgb2YgdGhpcyBtZW1iZXIgaXMgbWlzc2xlYWRpbmcuXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqL1xuXHRcdHRoaXMuX2Nvb3JkaW5hdGVzID0gW107XG5cblx0XHQvKipcblx0XHQgKiBDdXJyZW50IGJyZWFrcG9pbnQuXG5cdFx0ICogQHRvZG8gUmVhbCBtZWRpYSBxdWVyaWVzIHdvdWxkIGJlIG5pY2UuXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqL1xuXHRcdHRoaXMuX2JyZWFrcG9pbnQgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogQ3VycmVudCB3aWR0aCBvZiB0aGUgcGx1Z2luIGVsZW1lbnQuXG5cdFx0ICovXG5cdFx0dGhpcy5fd2lkdGggPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogQWxsIHJlYWwgaXRlbXMuXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqL1xuXHRcdHRoaXMuX2l0ZW1zID0gW107XG5cblx0XHQvKipcblx0XHQgKiBBbGwgY2xvbmVkIGl0ZW1zLlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKi9cblx0XHR0aGlzLl9jbG9uZXMgPSBbXTtcblxuXHRcdC8qKlxuXHRcdCAqIE1lcmdlIHZhbHVlcyBvZiBhbGwgaXRlbXMuXG5cdFx0ICogQHRvZG8gTWF5YmUgdGhpcyBjb3VsZCBiZSBwYXJ0IG9mIGEgcGx1Z2luLlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKi9cblx0XHR0aGlzLl9tZXJnZXJzID0gW107XG5cblx0XHQvKipcblx0XHQgKiBJbnZhbGlkYXRlZCBwYXJ0cyB3aXRoaW4gdGhlIHVwZGF0ZSBwcm9jZXNzLlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKi9cblx0XHR0aGlzLl9pbnZhbGlkYXRlZCA9IHt9O1xuXG5cdFx0LyoqXG5cdFx0ICogT3JkZXJlZCBsaXN0IG9mIHdvcmtlcnMgZm9yIHRoZSB1cGRhdGUgcHJvY2Vzcy5cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICovXG5cdFx0dGhpcy5fcGlwZSA9IFtdO1xuXG5cdFx0JC5lYWNoKE93bC5QbHVnaW5zLCAkLnByb3h5KGZ1bmN0aW9uKGtleSwgcGx1Z2luKSB7XG5cdFx0XHR0aGlzLl9wbHVnaW5zW2tleVswXS50b0xvd2VyQ2FzZSgpICsga2V5LnNsaWNlKDEpXVxuXHRcdFx0XHQ9IG5ldyBwbHVnaW4odGhpcyk7XG5cdFx0fSwgdGhpcykpO1xuXG5cdFx0JC5lYWNoKE93bC5QaXBlLCAkLnByb3h5KGZ1bmN0aW9uKHByaW9yaXR5LCB3b3JrZXIpIHtcblx0XHRcdHRoaXMuX3BpcGUucHVzaCh7XG5cdFx0XHRcdCdmaWx0ZXInOiB3b3JrZXIuZmlsdGVyLFxuXHRcdFx0XHQncnVuJzogJC5wcm94eSh3b3JrZXIucnVuLCB0aGlzKVxuXHRcdFx0fSk7XG5cdFx0fSwgdGhpcykpO1xuXG5cdFx0dGhpcy5zZXR1cCgpO1xuXHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIGNhcm91c2VsLlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRPd2wuRGVmYXVsdHMgPSB7XG5cdFx0aXRlbXM6IDMsXG5cdFx0bG9vcDogZmFsc2UsXG5cdFx0Y2VudGVyOiBmYWxzZSxcblxuXHRcdG1vdXNlRHJhZzogdHJ1ZSxcblx0XHR0b3VjaERyYWc6IHRydWUsXG5cdFx0cHVsbERyYWc6IHRydWUsXG5cdFx0ZnJlZURyYWc6IGZhbHNlLFxuXG5cdFx0bWFyZ2luOiAwLFxuXHRcdHN0YWdlUGFkZGluZzogMCxcblxuXHRcdG1lcmdlOiBmYWxzZSxcblx0XHRtZXJnZUZpdDogdHJ1ZSxcblx0XHRhdXRvV2lkdGg6IGZhbHNlLFxuXG5cdFx0c3RhcnRQb3NpdGlvbjogMCxcblx0XHRydGw6IGZhbHNlLFxuXG5cdFx0c21hcnRTcGVlZDogMjUwLFxuXHRcdGZsdWlkU3BlZWQ6IGZhbHNlLFxuXHRcdGRyYWdFbmRTcGVlZDogZmFsc2UsXG5cdFx0cGFnZUFuaW1hdGlvbkR1cmF0aW9uOiAnMXMnLFxuXG5cdFx0cmVzcG9uc2l2ZToge30sXG5cdFx0cmVzcG9uc2l2ZVJlZnJlc2hSYXRlOiAyMDAsXG5cdFx0cmVzcG9uc2l2ZUJhc2VFbGVtZW50OiB3aW5kb3csXG5cdFx0cmVzcG9uc2l2ZUNsYXNzOiBmYWxzZSxcblxuXHRcdGZhbGxiYWNrRWFzaW5nOiAnc3dpbmcnLFxuXG5cdFx0aW5mbzogZmFsc2UsXG5cblx0XHRuZXN0ZWRJdGVtU2VsZWN0b3I6IGZhbHNlLFxuXHRcdGl0ZW1FbGVtZW50OiAnZGl2Jyxcblx0XHRzdGFnZUVsZW1lbnQ6ICdkaXYnLFxuXG5cdFx0Ly8gQ2xhc3NlcyBhbmQgTmFtZXNcblx0XHR0aGVtZUNsYXNzOiAnb3dsLXRoZW1lJyxcblx0XHRiYXNlQ2xhc3M6ICdvd2wtY2Fyb3VzZWwnLFxuXHRcdGl0ZW1DbGFzczogJ293bC1pdGVtJyxcblx0XHRjZW50ZXJDbGFzczogJ2NlbnRlcicsXG5cdFx0YWN0aXZlQ2xhc3M6ICdhY3RpdmUnXG5cdH07XG5cblx0LyoqXG5cdCAqIEVudW1lcmF0aW9uIGZvciB3aWR0aC5cblx0ICogQHB1YmxpY1xuXHQgKiBAcmVhZG9ubHlcblx0ICogQGVudW0ge1N0cmluZ31cblx0ICovXG5cdE93bC5XaWR0aCA9IHtcblx0XHREZWZhdWx0OiAnZGVmYXVsdCcsXG5cdFx0SW5uZXI6ICdpbm5lcicsXG5cdFx0T3V0ZXI6ICdvdXRlcidcblx0fTtcblxuXHQvKipcblx0ICogQ29udGFpbnMgYWxsIHJlZ2lzdGVyZWQgcGx1Z2lucy5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0T3dsLlBsdWdpbnMgPSB7fTtcblxuXHQvKipcblx0ICogVXBkYXRlIHBpcGUuXG5cdCAqL1xuXHRPd2wuUGlwZSA9IFsge1xuXHRcdGZpbHRlcjogWyAnd2lkdGgnLCAnaXRlbXMnLCAnc2V0dGluZ3MnIF0sXG5cdFx0cnVuOiBmdW5jdGlvbihjYWNoZSkge1xuXHRcdFx0Y2FjaGUuY3VycmVudCA9IHRoaXMuX2l0ZW1zICYmIHRoaXMuX2l0ZW1zW3RoaXMucmVsYXRpdmUodGhpcy5fY3VycmVudCldO1xuXHRcdH1cblx0fSwge1xuXHRcdGZpbHRlcjogWyAnaXRlbXMnLCAnc2V0dGluZ3MnIF0sXG5cdFx0cnVuOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjYWNoZWQgPSB0aGlzLl9jbG9uZXMsXG5cdFx0XHRcdGNsb25lcyA9IHRoaXMuJHN0YWdlLmNoaWxkcmVuKCcuY2xvbmVkJyk7XG5cblx0XHRcdGlmIChjbG9uZXMubGVuZ3RoICE9PSBjYWNoZWQubGVuZ3RoIHx8ICghdGhpcy5zZXR0aW5ncy5sb29wICYmIGNhY2hlZC5sZW5ndGggPiAwKSkge1xuXHRcdFx0XHR0aGlzLiRzdGFnZS5jaGlsZHJlbignLmNsb25lZCcpLnJlbW92ZSgpO1xuXHRcdFx0XHR0aGlzLl9jbG9uZXMgPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIHtcblx0XHRmaWx0ZXI6IFsgJ2l0ZW1zJywgJ3NldHRpbmdzJyBdLFxuXHRcdHJ1bjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaSwgbixcblx0XHRcdFx0Y2xvbmVzID0gdGhpcy5fY2xvbmVzLFxuXHRcdFx0XHRpdGVtcyA9IHRoaXMuX2l0ZW1zLFxuXHRcdFx0XHRkZWx0YSA9IHRoaXMuc2V0dGluZ3MubG9vcCA/IGNsb25lcy5sZW5ndGggLSBNYXRoLm1heCh0aGlzLnNldHRpbmdzLml0ZW1zICogMiwgNCkgOiAwO1xuXG5cdFx0XHRmb3IgKGkgPSAwLCBuID0gTWF0aC5hYnMoZGVsdGEgLyAyKTsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRpZiAoZGVsdGEgPiAwKSB7XG5cdFx0XHRcdFx0dGhpcy4kc3RhZ2UuY2hpbGRyZW4oKS5lcShpdGVtcy5sZW5ndGggKyBjbG9uZXMubGVuZ3RoIC0gMSkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0Y2xvbmVzLnBvcCgpO1xuXHRcdFx0XHRcdHRoaXMuJHN0YWdlLmNoaWxkcmVuKCkuZXEoMCkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0Y2xvbmVzLnBvcCgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNsb25lcy5wdXNoKGNsb25lcy5sZW5ndGggLyAyKTtcblx0XHRcdFx0XHR0aGlzLiRzdGFnZS5hcHBlbmQoaXRlbXNbY2xvbmVzW2Nsb25lcy5sZW5ndGggLSAxXV0uY2xvbmUoKS5hZGRDbGFzcygnY2xvbmVkJykpO1xuXHRcdFx0XHRcdGNsb25lcy5wdXNoKGl0ZW1zLmxlbmd0aCAtIDEgLSAoY2xvbmVzLmxlbmd0aCAtIDEpIC8gMik7XG5cdFx0XHRcdFx0dGhpcy4kc3RhZ2UucHJlcGVuZChpdGVtc1tjbG9uZXNbY2xvbmVzLmxlbmd0aCAtIDFdXS5jbG9uZSgpLmFkZENsYXNzKCdjbG9uZWQnKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sIHtcblx0XHRmaWx0ZXI6IFsgJ3dpZHRoJywgJ2l0ZW1zJywgJ3NldHRpbmdzJyBdLFxuXHRcdHJ1bjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcnRsID0gKHRoaXMuc2V0dGluZ3MucnRsID8gMSA6IC0xKSxcblx0XHRcdFx0d2lkdGggPSAodGhpcy53aWR0aCgpIC8gdGhpcy5zZXR0aW5ncy5pdGVtcykudG9GaXhlZCgzKSxcblx0XHRcdFx0Y29vcmRpbmF0ZSA9IDAsIG1lcmdlLCBpLCBuO1xuXG5cdFx0XHR0aGlzLl9jb29yZGluYXRlcyA9IFtdO1xuXHRcdFx0Zm9yIChpID0gMCwgbiA9IHRoaXMuX2Nsb25lcy5sZW5ndGggKyB0aGlzLl9pdGVtcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0bWVyZ2UgPSB0aGlzLl9tZXJnZXJzW3RoaXMucmVsYXRpdmUoaSldO1xuXHRcdFx0XHRtZXJnZSA9ICh0aGlzLnNldHRpbmdzLm1lcmdlRml0ICYmIE1hdGgubWluKG1lcmdlLCB0aGlzLnNldHRpbmdzLml0ZW1zKSkgfHwgbWVyZ2U7XG5cdFx0XHRcdGNvb3JkaW5hdGUgKz0gKHRoaXMuc2V0dGluZ3MuYXV0b1dpZHRoID8gdGhpcy5faXRlbXNbdGhpcy5yZWxhdGl2ZShpKV0ud2lkdGgoKSArIHRoaXMuc2V0dGluZ3MubWFyZ2luIDogd2lkdGggKiBtZXJnZSkgKiBydGw7XG5cblx0XHRcdFx0dGhpcy5fY29vcmRpbmF0ZXMucHVzaChjb29yZGluYXRlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIHtcblx0XHRmaWx0ZXI6IFsgJ3dpZHRoJywgJ2l0ZW1zJywgJ3NldHRpbmdzJyBdLFxuXHRcdHJ1bjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaSwgbiwgd2lkdGggPSAodGhpcy53aWR0aCgpIC8gdGhpcy5zZXR0aW5ncy5pdGVtcykudG9GaXhlZCgzKSwgY3NzID0ge1xuXHRcdFx0XHQnd2lkdGgnOiBNYXRoLmFicyh0aGlzLl9jb29yZGluYXRlc1t0aGlzLl9jb29yZGluYXRlcy5sZW5ndGggLSAxXSkgKyB0aGlzLnNldHRpbmdzLnN0YWdlUGFkZGluZyAqIDIsXG5cdFx0XHRcdCdwYWRkaW5nLWxlZnQnOiB0aGlzLnNldHRpbmdzLnN0YWdlUGFkZGluZyB8fCAnJyxcblx0XHRcdFx0J3BhZGRpbmctcmlnaHQnOiB0aGlzLnNldHRpbmdzLnN0YWdlUGFkZGluZyB8fCAnJ1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy4kc3RhZ2UuY3NzKGNzcyk7XG5cblx0XHRcdGNzcyA9IHsgJ3dpZHRoJzogdGhpcy5zZXR0aW5ncy5hdXRvV2lkdGggPyAnYXV0bycgOiB3aWR0aCAtIHRoaXMuc2V0dGluZ3MubWFyZ2luIH07XG5cdFx0XHRjc3NbdGhpcy5zZXR0aW5ncy5ydGwgPyAnbWFyZ2luLWxlZnQnIDogJ21hcmdpbi1yaWdodCddID0gdGhpcy5zZXR0aW5ncy5tYXJnaW47XG5cblx0XHRcdGlmICghdGhpcy5zZXR0aW5ncy5hdXRvV2lkdGggJiYgJC5ncmVwKHRoaXMuX21lcmdlcnMsIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIHYgPiAxIH0pLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgbiA9IHRoaXMuX2Nvb3JkaW5hdGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdGNzcy53aWR0aCA9IE1hdGguYWJzKHRoaXMuX2Nvb3JkaW5hdGVzW2ldKSAtIE1hdGguYWJzKHRoaXMuX2Nvb3JkaW5hdGVzW2kgLSAxXSB8fCAwKSAtIHRoaXMuc2V0dGluZ3MubWFyZ2luO1xuXHRcdFx0XHRcdHRoaXMuJHN0YWdlLmNoaWxkcmVuKCkuZXEoaSkuY3NzKGNzcyk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuJHN0YWdlLmNoaWxkcmVuKCkuY3NzKGNzcyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0ZmlsdGVyOiBbICd3aWR0aCcsICdpdGVtcycsICdzZXR0aW5ncycgXSxcblx0XHRydW46IGZ1bmN0aW9uKGNhY2hlKSB7XG5cdFx0XHRjYWNoZS5jdXJyZW50ICYmIHRoaXMucmVzZXQodGhpcy4kc3RhZ2UuY2hpbGRyZW4oKS5pbmRleChjYWNoZS5jdXJyZW50KSk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0ZmlsdGVyOiBbICdwb3NpdGlvbicgXSxcblx0XHRydW46IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5hbmltYXRlKHRoaXMuY29vcmRpbmF0ZXModGhpcy5fY3VycmVudCkpO1xuXHRcdH1cblx0fSwge1xuXHRcdGZpbHRlcjogWyAnd2lkdGgnLCAncG9zaXRpb24nLCAnaXRlbXMnLCAnc2V0dGluZ3MnIF0sXG5cdFx0cnVuOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBydGwgPSB0aGlzLnNldHRpbmdzLnJ0bCA/IDEgOiAtMSxcblx0XHRcdFx0cGFkZGluZyA9IHRoaXMuc2V0dGluZ3Muc3RhZ2VQYWRkaW5nICogMixcblx0XHRcdFx0YmVnaW4gPSB0aGlzLmNvb3JkaW5hdGVzKHRoaXMuY3VycmVudCgpKSArIHBhZGRpbmcsXG5cdFx0XHRcdGVuZCA9IGJlZ2luICsgdGhpcy53aWR0aCgpICogcnRsLFxuXHRcdFx0XHRpbm5lciwgb3V0ZXIsIG1hdGNoZXMgPSBbXSwgaSwgbjtcblxuXHRcdFx0Zm9yIChpID0gMCwgbiA9IHRoaXMuX2Nvb3JkaW5hdGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRpbm5lciA9IHRoaXMuX2Nvb3JkaW5hdGVzW2kgLSAxXSB8fCAwO1xuXHRcdFx0XHRvdXRlciA9IE1hdGguYWJzKHRoaXMuX2Nvb3JkaW5hdGVzW2ldKSArIHBhZGRpbmcgKiBydGw7XG5cblx0XHRcdFx0aWYgKCh0aGlzLm9wKGlubmVyLCAnPD0nLCBiZWdpbikgJiYgKHRoaXMub3AoaW5uZXIsICc+JywgZW5kKSkpXG5cdFx0XHRcdFx0fHwgKHRoaXMub3Aob3V0ZXIsICc8JywgYmVnaW4pICYmIHRoaXMub3Aob3V0ZXIsICc+JywgZW5kKSkpIHtcblx0XHRcdFx0XHRtYXRjaGVzLnB1c2goaSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dGhpcy4kc3RhZ2UuY2hpbGRyZW4oJy4nICsgdGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcykucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG5cdFx0XHR0aGlzLiRzdGFnZS5jaGlsZHJlbignOmVxKCcgKyBtYXRjaGVzLmpvaW4oJyksIDplcSgnKSArICcpJykuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG5cblx0XHRcdGlmICh0aGlzLnNldHRpbmdzLmNlbnRlcikge1xuXHRcdFx0XHR0aGlzLiRzdGFnZS5jaGlsZHJlbignLicgKyB0aGlzLnNldHRpbmdzLmNlbnRlckNsYXNzKS5yZW1vdmVDbGFzcyh0aGlzLnNldHRpbmdzLmNlbnRlckNsYXNzKTtcblx0XHRcdFx0dGhpcy4kc3RhZ2UuY2hpbGRyZW4oKS5lcSh0aGlzLmN1cnJlbnQoKSkuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5jZW50ZXJDbGFzcyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IF07XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIHRoZSBjYXJvdXNlbC5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy50cmlnZ2VyKCdpbml0aWFsaXplJyk7XG5cblx0XHR0aGlzLiRlbGVtZW50XG5cdFx0XHQuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5iYXNlQ2xhc3MpXG5cdFx0XHQuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy50aGVtZUNsYXNzKVxuXHRcdFx0LnRvZ2dsZUNsYXNzKCdvd2wtcnRsJywgdGhpcy5zZXR0aW5ncy5ydGwpO1xuXG5cdFx0Ly8gY2hlY2sgc3VwcG9ydFxuXHRcdHRoaXMuYnJvd3NlclN1cHBvcnQoKTtcblxuXHRcdGlmICh0aGlzLnNldHRpbmdzLmF1dG9XaWR0aCAmJiB0aGlzLnN0YXRlLmltYWdlc0xvYWRlZCAhPT0gdHJ1ZSkge1xuXHRcdFx0dmFyIGltZ3MsIG5lc3RlZFNlbGVjdG9yLCB3aWR0aDtcblx0XHRcdGltZ3MgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ2ltZycpO1xuXHRcdFx0bmVzdGVkU2VsZWN0b3IgPSB0aGlzLnNldHRpbmdzLm5lc3RlZEl0ZW1TZWxlY3RvciA/ICcuJyArIHRoaXMuc2V0dGluZ3MubmVzdGVkSXRlbVNlbGVjdG9yIDogdW5kZWZpbmVkO1xuXHRcdFx0d2lkdGggPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKG5lc3RlZFNlbGVjdG9yKS53aWR0aCgpO1xuXG5cdFx0XHRpZiAoaW1ncy5sZW5ndGggJiYgd2lkdGggPD0gMCkge1xuXHRcdFx0XHR0aGlzLnByZWxvYWRBdXRvV2lkdGhJbWFnZXMoaW1ncyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdvd2wtbG9hZGluZycpO1xuXG5cdFx0Ly8gY3JlYXRlIHN0YWdlXG5cdFx0dGhpcy4kc3RhZ2UgPSAkKCc8JyArIHRoaXMuc2V0dGluZ3Muc3RhZ2VFbGVtZW50ICsgJyBjbGFzcz1cIm93bC1zdGFnZVwiLz4nKVxuXHRcdFx0LndyYXAoJzxkaXYgY2xhc3M9XCJvd2wtc3RhZ2Utb3V0ZXJcIj4nKTtcblxuXHRcdC8vIGFwcGVuZCBzdGFnZVxuXHRcdHRoaXMuJGVsZW1lbnQuYXBwZW5kKHRoaXMuJHN0YWdlLnBhcmVudCgpKTtcblxuXHRcdC8vIGFwcGVuZCBjb250ZW50XG5cdFx0dGhpcy5yZXBsYWNlKHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oKS5ub3QodGhpcy4kc3RhZ2UucGFyZW50KCkpKTtcblxuXHRcdC8vIHNldCB2aWV3IHdpZHRoXG5cdFx0dGhpcy5fd2lkdGggPSB0aGlzLiRlbGVtZW50LndpZHRoKCk7XG5cblx0XHQvLyB1cGRhdGUgdmlld1xuXHRcdHRoaXMucmVmcmVzaCgpO1xuXG5cdFx0dGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcygnb3dsLWxvYWRpbmcnKS5hZGRDbGFzcygnb3dsLWxvYWRlZCcpO1xuXG5cdFx0Ly8gYXR0YWNoIGdlbmVyaWMgZXZlbnRzXG5cdFx0dGhpcy5ldmVudHNDYWxsKCk7XG5cblx0XHQvLyBhdHRhY2ggZ2VuZXJpYyBldmVudHNcblx0XHR0aGlzLmludGVybmFsRXZlbnRzKCk7XG5cblx0XHQvLyBhdHRhY2ggY3VzdG9tIGNvbnRyb2wgZXZlbnRzXG5cdFx0dGhpcy5hZGRUcmlnZ2VyYWJsZUV2ZW50cygpO1xuXG5cdFx0dGhpcy50cmlnZ2VyKCdpbml0aWFsaXplZCcpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTZXR1cHMgdGhlIGN1cnJlbnQgc2V0dGluZ3MuXG5cdCAqIEB0b2RvIFJlbW92ZSByZXNwb25zaXZlIGNsYXNzZXMuIFdoeSBzaG91bGQgYWRhcHRpdmUgZGVzaWducyBiZSBicm91Z2h0IGludG8gSUU4P1xuXHQgKiBAdG9kbyBTdXBwb3J0IGZvciBtZWRpYSBxdWVyaWVzIGJ5IHVzaW5nIGBtYXRjaE1lZGlhYCB3b3VsZCBiZSBuaWNlLlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHZpZXdwb3J0ID0gdGhpcy52aWV3cG9ydCgpLFxuXHRcdFx0b3ZlcndyaXRlcyA9IHRoaXMub3B0aW9ucy5yZXNwb25zaXZlLFxuXHRcdFx0bWF0Y2ggPSAtMSxcblx0XHRcdHNldHRpbmdzID0gbnVsbDtcblxuXHRcdGlmICghb3ZlcndyaXRlcykge1xuXHRcdFx0c2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JC5lYWNoKG92ZXJ3cml0ZXMsIGZ1bmN0aW9uKGJyZWFrcG9pbnQpIHtcblx0XHRcdFx0aWYgKGJyZWFrcG9pbnQgPD0gdmlld3BvcnQgJiYgYnJlYWtwb2ludCA+IG1hdGNoKSB7XG5cdFx0XHRcdFx0bWF0Y2ggPSBOdW1iZXIoYnJlYWtwb2ludCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG92ZXJ3cml0ZXNbbWF0Y2hdKTtcblx0XHRcdGRlbGV0ZSBzZXR0aW5ncy5yZXNwb25zaXZlO1xuXG5cdFx0XHQvLyByZXNwb25zaXZlIGNsYXNzXG5cdFx0XHRpZiAoc2V0dGluZ3MucmVzcG9uc2l2ZUNsYXNzKSB7XG5cdFx0XHRcdHRoaXMuJGVsZW1lbnQuYXR0cignY2xhc3MnLCBmdW5jdGlvbihpLCBjKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGMucmVwbGFjZSgvXFxiIG93bC1yZXNwb25zaXZlLVxcUysvZywgJycpO1xuXHRcdFx0XHR9KS5hZGRDbGFzcygnb3dsLXJlc3BvbnNpdmUtJyArIG1hdGNoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zZXR0aW5ncyA9PT0gbnVsbCB8fCB0aGlzLl9icmVha3BvaW50ICE9PSBtYXRjaCkge1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2UnLCB7IHByb3BlcnR5OiB7IG5hbWU6ICdzZXR0aW5ncycsIHZhbHVlOiBzZXR0aW5ncyB9IH0pO1xuXHRcdFx0dGhpcy5fYnJlYWtwb2ludCA9IG1hdGNoO1xuXHRcdFx0dGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuXHRcdFx0dGhpcy5pbnZhbGlkYXRlKCdzZXR0aW5ncycpO1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdjaGFuZ2VkJywgeyBwcm9wZXJ0eTogeyBuYW1lOiAnc2V0dGluZ3MnLCB2YWx1ZTogdGhpcy5zZXR0aW5ncyB9IH0pO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogVXBkYXRlcyBvcHRpb24gbG9naWMgaWYgbmVjZXNzZXJ5LlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLm9wdGlvbnNMb2dpYyA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRvZ2dsZSBDZW50ZXIgY2xhc3Ncblx0XHR0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdvd2wtY2VudGVyJywgdGhpcy5zZXR0aW5ncy5jZW50ZXIpO1xuXG5cdFx0Ly8gaWYgaXRlbXMgbnVtYmVyIGlzIGxlc3MgdGhhbiBpbiBib2R5XG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MubG9vcCAmJiB0aGlzLl9pdGVtcy5sZW5ndGggPCB0aGlzLnNldHRpbmdzLml0ZW1zKSB7XG5cdFx0XHR0aGlzLnNldHRpbmdzLmxvb3AgPSBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5zZXR0aW5ncy5hdXRvV2lkdGgpIHtcblx0XHRcdHRoaXMuc2V0dGluZ3Muc3RhZ2VQYWRkaW5nID0gZmFsc2U7XG5cdFx0XHR0aGlzLnNldHRpbmdzLm1lcmdlID0gZmFsc2U7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBQcmVwYXJlcyBhbiBpdGVtIGJlZm9yZSBhZGQuXG5cdCAqIEB0b2RvIFJlbmFtZSBldmVudCBwYXJhbWV0ZXIgYGNvbnRlbnRgIHRvIGBpdGVtYC5cblx0ICogQHByb3RlY3RlZFxuXHQgKiBAcmV0dXJucyB7alF1ZXJ5fEhUTUxFbGVtZW50fSAtIFRoZSBpdGVtIGNvbnRhaW5lci5cblx0ICovXG5cdE93bC5wcm90b3R5cGUucHJlcGFyZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHR2YXIgZXZlbnQgPSB0aGlzLnRyaWdnZXIoJ3ByZXBhcmUnLCB7IGNvbnRlbnQ6IGl0ZW0gfSk7XG5cblx0XHRpZiAoIWV2ZW50LmRhdGEpIHtcblx0XHRcdGV2ZW50LmRhdGEgPSAkKCc8JyArIHRoaXMuc2V0dGluZ3MuaXRlbUVsZW1lbnQgKyAnLz4nKVxuXHRcdFx0XHQuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5pdGVtQ2xhc3MpLmFwcGVuZChpdGVtKVxuXHRcdH1cblxuXHRcdHRoaXMudHJpZ2dlcigncHJlcGFyZWQnLCB7IGNvbnRlbnQ6IGV2ZW50LmRhdGEgfSk7XG5cblx0XHRyZXR1cm4gZXZlbnQuZGF0YTtcblx0fTtcblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgdmlldy5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0T3dsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgaSA9IDAsXG5cdFx0XHRuID0gdGhpcy5fcGlwZS5sZW5ndGgsXG5cdFx0XHRmaWx0ZXIgPSAkLnByb3h5KGZ1bmN0aW9uKHApIHsgcmV0dXJuIHRoaXNbcF0gfSwgdGhpcy5faW52YWxpZGF0ZWQpLFxuXHRcdFx0Y2FjaGUgPSB7fTtcblxuXHRcdHdoaWxlIChpIDwgbikge1xuXHRcdFx0aWYgKHRoaXMuX2ludmFsaWRhdGVkLmFsbCB8fCAkLmdyZXAodGhpcy5fcGlwZVtpXS5maWx0ZXIsIGZpbHRlcikubGVuZ3RoID4gMCkge1xuXHRcdFx0XHR0aGlzLl9waXBlW2ldLnJ1bihjYWNoZSk7XG5cdFx0XHR9XG5cdFx0XHRpKys7XG5cdFx0fVxuXG5cdFx0dGhpcy5faW52YWxpZGF0ZWQgPSB7fTtcblx0fTtcblxuXHQvKipcblx0ICogR2V0cyB0aGUgd2lkdGggb2YgdGhlIHZpZXcuXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtPd2wuV2lkdGh9IFtkaW1lbnNpb249T3dsLldpZHRoLkRlZmF1bHRdIC0gVGhlIGRpbWVuc2lvbiB0byByZXR1cm4uXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3IGluIHBpeGVsLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS53aWR0aCA9IGZ1bmN0aW9uKGRpbWVuc2lvbikge1xuXHRcdGRpbWVuc2lvbiA9IGRpbWVuc2lvbiB8fCBPd2wuV2lkdGguRGVmYXVsdDtcblx0XHRzd2l0Y2ggKGRpbWVuc2lvbikge1xuXHRcdFx0Y2FzZSBPd2wuV2lkdGguSW5uZXI6XG5cdFx0XHRjYXNlIE93bC5XaWR0aC5PdXRlcjpcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3dpZHRoO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3dpZHRoIC0gdGhpcy5zZXR0aW5ncy5zdGFnZVBhZGRpbmcgKiAyICsgdGhpcy5zZXR0aW5ncy5tYXJnaW47XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZWZyZXNoZXMgdGhlIGNhcm91c2VsIHByaW1hcmlseSBmb3IgYWRhcHRpdmUgcHVycG9zZXMuXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdE93bC5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLl9pdGVtcy5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuXHRcdHRoaXMudHJpZ2dlcigncmVmcmVzaCcpO1xuXG5cdFx0dGhpcy5zZXR1cCgpO1xuXG5cdFx0dGhpcy5vcHRpb25zTG9naWMoKTtcblxuXHRcdC8vIGhpZGUgYW5kIHNob3cgbWV0aG9kcyBoZWxwcyBoZXJlIHRvIHNldCBhIHByb3BlciB3aWR0aHMsXG5cdFx0Ly8gdGhpcyBwcmV2ZW50cyBzY3JvbGxiYXIgdG8gYmUgY2FsY3VsYXRlZCBpbiBzdGFnZSB3aWR0aFxuXHRcdHRoaXMuJHN0YWdlLmFkZENsYXNzKCdvd2wtcmVmcmVzaCcpO1xuXG5cdFx0dGhpcy51cGRhdGUoKTtcblxuXHRcdHRoaXMuJHN0YWdlLnJlbW92ZUNsYXNzKCdvd2wtcmVmcmVzaCcpO1xuXG5cdFx0dGhpcy5zdGF0ZS5vcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbjtcblxuXHRcdHRoaXMud2F0Y2hWaXNpYmlsaXR5KCk7XG5cblx0XHR0aGlzLnRyaWdnZXIoJ3JlZnJlc2hlZCcpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTYXZlIGludGVybmFsIGV2ZW50IHJlZmVyZW5jZXMgYW5kIGFkZCBldmVudCBiYXNlZCBmdW5jdGlvbnMuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdE93bC5wcm90b3R5cGUuZXZlbnRzQ2FsbCA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vIFNhdmUgZXZlbnRzIHJlZmVyZW5jZXNcblx0XHR0aGlzLmUuX29uRHJhZ1N0YXJ0ID0gJC5wcm94eShmdW5jdGlvbihlKSB7XG5cdFx0XHR0aGlzLm9uRHJhZ1N0YXJ0KGUpO1xuXHRcdH0sIHRoaXMpO1xuXHRcdHRoaXMuZS5fb25EcmFnTW92ZSA9ICQucHJveHkoZnVuY3Rpb24oZSkge1xuXHRcdFx0dGhpcy5vbkRyYWdNb3ZlKGUpO1xuXHRcdH0sIHRoaXMpO1xuXHRcdHRoaXMuZS5fb25EcmFnRW5kID0gJC5wcm94eShmdW5jdGlvbihlKSB7XG5cdFx0XHR0aGlzLm9uRHJhZ0VuZChlKTtcblx0XHR9LCB0aGlzKTtcblx0XHR0aGlzLmUuX29uUmVzaXplID0gJC5wcm94eShmdW5jdGlvbihlKSB7XG5cdFx0XHR0aGlzLm9uUmVzaXplKGUpO1xuXHRcdH0sIHRoaXMpO1xuXHRcdHRoaXMuZS5fdHJhbnNpdGlvbkVuZCA9ICQucHJveHkoZnVuY3Rpb24oZSkge1xuXHRcdFx0dGhpcy50cmFuc2l0aW9uRW5kKGUpO1xuXHRcdH0sIHRoaXMpO1xuXHRcdHRoaXMuZS5fcHJldmVudENsaWNrID0gJC5wcm94eShmdW5jdGlvbihlKSB7XG5cdFx0XHR0aGlzLnByZXZlbnRDbGljayhlKTtcblx0XHR9LCB0aGlzKTtcblx0fTtcblxuXHQvKipcblx0ICogQ2hlY2tzIHdpbmRvdyBgcmVzaXplYCBldmVudC5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5vblRocm90dGxlZFJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5yZXNpemVUaW1lcik7XG5cdFx0dGhpcy5yZXNpemVUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMuZS5fb25SZXNpemUsIHRoaXMuc2V0dGluZ3MucmVzcG9uc2l2ZVJlZnJlc2hSYXRlKTtcblx0fTtcblxuXHQvKipcblx0ICogQ2hlY2tzIHdpbmRvdyBgcmVzaXplYCBldmVudC5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5vblJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICghdGhpcy5faXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX3dpZHRoID09PSB0aGlzLiRlbGVtZW50LndpZHRoKCkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy50cmlnZ2VyKCdyZXNpemUnKS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHRoaXMuX3dpZHRoID0gdGhpcy4kZWxlbWVudC53aWR0aCgpO1xuXG5cdFx0dGhpcy5pbnZhbGlkYXRlKCd3aWR0aCcpO1xuXG5cdFx0dGhpcy5yZWZyZXNoKCk7XG5cblx0XHR0aGlzLnRyaWdnZXIoJ3Jlc2l6ZWQnKTtcblx0fTtcblxuXHQvKipcblx0ICogQ2hlY2tzIGZvciB0b3VjaC9tb3VzZSBkcmFnIGV2ZW50IHR5cGUgYW5kIGFkZCBydW4gZXZlbnQgaGFuZGxlcnMuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdE93bC5wcm90b3R5cGUuZXZlbnRzUm91dGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdHlwZSA9IGV2ZW50LnR5cGU7XG5cblx0XHRpZiAodHlwZSA9PT0gXCJtb3VzZWRvd25cIiB8fCB0eXBlID09PSBcInRvdWNoc3RhcnRcIikge1xuXHRcdFx0dGhpcy5vbkRyYWdTdGFydChldmVudCk7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSBcIm1vdXNlbW92ZVwiIHx8IHR5cGUgPT09IFwidG91Y2htb3ZlXCIpIHtcblx0XHRcdHRoaXMub25EcmFnTW92ZShldmVudCk7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSBcIm1vdXNldXBcIiB8fCB0eXBlID09PSBcInRvdWNoZW5kXCIpIHtcblx0XHRcdHRoaXMub25EcmFnRW5kKGV2ZW50KTtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IFwidG91Y2hjYW5jZWxcIikge1xuXHRcdFx0dGhpcy5vbkRyYWdFbmQoZXZlbnQpO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogQ2hlY2tzIGZvciB0b3VjaC9tb3VzZSBkcmFnIG9wdGlvbnMgYW5kIGFkZCBuZWNlc3NlcnkgZXZlbnQgaGFuZGxlcnMuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdE93bC5wcm90b3R5cGUuaW50ZXJuYWxFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgaXNUb3VjaCA9IGlzVG91Y2hTdXBwb3J0KCksXG5cdFx0XHRpc1RvdWNoSUUgPSBpc1RvdWNoU3VwcG9ydElFKCk7XG5cblx0XHRpZiAodGhpcy5zZXR0aW5ncy5tb3VzZURyYWcpe1xuXHRcdFx0dGhpcy4kc3RhZ2Uub24oJ21vdXNlZG93bicsICQucHJveHkoZnVuY3Rpb24oZXZlbnQpIHsgdGhpcy5ldmVudHNSb3V0ZXIoZXZlbnQpIH0sIHRoaXMpKTtcblx0XHRcdHRoaXMuJHN0YWdlLm9uKCdkcmFnc3RhcnQnLCBmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlIH0pO1xuXHRcdFx0dGhpcy4kc3RhZ2UuZ2V0KDApLm9uc2VsZWN0c3RhcnQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlIH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ293bC10ZXh0LXNlbGVjdC1vbicpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNldHRpbmdzLnRvdWNoRHJhZyAmJiAhaXNUb3VjaElFKXtcblx0XHRcdHRoaXMuJHN0YWdlLm9uKCd0b3VjaHN0YXJ0IHRvdWNoY2FuY2VsJywgJC5wcm94eShmdW5jdGlvbihldmVudCkgeyB0aGlzLmV2ZW50c1JvdXRlcihldmVudCkgfSwgdGhpcykpO1xuXHRcdH1cblxuXHRcdC8vIGNhdGNoIHRyYW5zaXRpb25FbmQgZXZlbnRcblx0XHRpZiAodGhpcy50cmFuc2l0aW9uRW5kVmVuZG9yKSB7XG5cdFx0XHR0aGlzLm9uKHRoaXMuJHN0YWdlLmdldCgwKSwgdGhpcy50cmFuc2l0aW9uRW5kVmVuZG9yLCB0aGlzLmUuX3RyYW5zaXRpb25FbmQsIGZhbHNlKTtcblx0XHR9XG5cblx0XHQvLyByZXNwb25zaXZlXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MucmVzcG9uc2l2ZSAhPT0gZmFsc2UpIHtcblx0XHRcdHRoaXMub24od2luZG93LCAncmVzaXplJywgJC5wcm94eSh0aGlzLm9uVGhyb3R0bGVkUmVzaXplLCB0aGlzKSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIHRvdWNoc3RhcnQvbW91c2Vkb3duIGV2ZW50LlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IC0gVGhlIGV2ZW50IGFyZ3VtZW50cy5cblx0ICovXG5cdE93bC5wcm90b3R5cGUub25EcmFnU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciBldiwgaXNUb3VjaEV2ZW50LCBwYWdlWCwgcGFnZVksIGFuaW1hdGVkUG9zO1xuXG5cdFx0ZXYgPSBldmVudC5vcmlnaW5hbEV2ZW50IHx8IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcblxuXHRcdC8vIHByZXZlbnQgcmlnaHQgY2xpY2tcblx0XHRpZiAoZXYud2hpY2ggPT09IDMgfHwgdGhpcy5zdGF0ZS5pc1RvdWNoKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKGV2LnR5cGUgPT09ICdtb3VzZWRvd24nKSB7XG5cdFx0XHR0aGlzLiRzdGFnZS5hZGRDbGFzcygnb3dsLWdyYWInKTtcblx0XHR9XG5cblx0XHR0aGlzLnRyaWdnZXIoJ2RyYWcnKTtcblx0XHR0aGlzLmRyYWcuc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0dGhpcy5zcGVlZCgwKTtcblx0XHR0aGlzLnN0YXRlLmlzVG91Y2ggPSB0cnVlO1xuXHRcdHRoaXMuc3RhdGUuaXNTY3JvbGxpbmcgPSBmYWxzZTtcblx0XHR0aGlzLnN0YXRlLmlzU3dpcGluZyA9IGZhbHNlO1xuXHRcdHRoaXMuZHJhZy5kaXN0YW5jZSA9IDA7XG5cblx0XHRwYWdlWCA9IGdldFRvdWNoZXMoZXYpLng7XG5cdFx0cGFnZVkgPSBnZXRUb3VjaGVzKGV2KS55O1xuXG5cdFx0Ly8gZ2V0IHN0YWdlIHBvc2l0aW9uIGxlZnRcblx0XHR0aGlzLmRyYWcub2Zmc2V0WCA9IHRoaXMuJHN0YWdlLnBvc2l0aW9uKCkubGVmdDtcblx0XHR0aGlzLmRyYWcub2Zmc2V0WSA9IHRoaXMuJHN0YWdlLnBvc2l0aW9uKCkudG9wO1xuXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MucnRsKSB7XG5cdFx0XHR0aGlzLmRyYWcub2Zmc2V0WCA9IHRoaXMuJHN0YWdlLnBvc2l0aW9uKCkubGVmdCArIHRoaXMuJHN0YWdlLndpZHRoKCkgLSB0aGlzLndpZHRoKClcblx0XHRcdFx0KyB0aGlzLnNldHRpbmdzLm1hcmdpbjtcblx0XHR9XG5cblx0XHQvLyBjYXRjaCBwb3NpdGlvbiAvLyBpZSB0byBmaXhcblx0XHRpZiAodGhpcy5zdGF0ZS5pbk1vdGlvbiAmJiB0aGlzLnN1cHBvcnQzZCkge1xuXHRcdFx0YW5pbWF0ZWRQb3MgPSB0aGlzLmdldFRyYW5zZm9ybVByb3BlcnR5KCk7XG5cdFx0XHR0aGlzLmRyYWcub2Zmc2V0WCA9IGFuaW1hdGVkUG9zO1xuXHRcdFx0dGhpcy5hbmltYXRlKGFuaW1hdGVkUG9zKTtcblx0XHRcdHRoaXMuc3RhdGUuaW5Nb3Rpb24gPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5pbk1vdGlvbiAmJiAhdGhpcy5zdXBwb3J0M2QpIHtcblx0XHRcdHRoaXMuc3RhdGUuaW5Nb3Rpb24gPSBmYWxzZTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLmRyYWcuc3RhcnRYID0gcGFnZVggLSB0aGlzLmRyYWcub2Zmc2V0WDtcblx0XHR0aGlzLmRyYWcuc3RhcnRZID0gcGFnZVkgLSB0aGlzLmRyYWcub2Zmc2V0WTtcblxuXHRcdHRoaXMuZHJhZy5zdGFydCA9IHBhZ2VYIC0gdGhpcy5kcmFnLnN0YXJ0WDtcblx0XHR0aGlzLmRyYWcudGFyZ2V0RWwgPSBldi50YXJnZXQgfHwgZXYuc3JjRWxlbWVudDtcblx0XHR0aGlzLmRyYWcudXBkYXRlZFggPSB0aGlzLmRyYWcuc3RhcnQ7XG5cblx0XHQvLyB0byBkby9jaGVja1xuXHRcdC8vIHByZXZlbnQgbGlua3MgYW5kIGltYWdlcyBkcmFnZ2luZztcblx0XHRpZiAodGhpcy5kcmFnLnRhcmdldEVsLnRhZ05hbWUgPT09IFwiSU1HXCIgfHwgdGhpcy5kcmFnLnRhcmdldEVsLnRhZ05hbWUgPT09IFwiQVwiKSB7XG5cdFx0XHR0aGlzLmRyYWcudGFyZ2V0RWwuZHJhZ2dhYmxlID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0JChkb2N1bWVudCkub24oJ21vdXNlbW92ZS5vd2wuZHJhZ0V2ZW50cyBtb3VzZXVwLm93bC5kcmFnRXZlbnRzIHRvdWNobW92ZS5vd2wuZHJhZ0V2ZW50cyB0b3VjaGVuZC5vd2wuZHJhZ0V2ZW50cycsICQucHJveHkoZnVuY3Rpb24oZXZlbnQpIHt0aGlzLmV2ZW50c1JvdXRlcihldmVudCl9LHRoaXMpKTtcblx0fTtcblxuXHQvKipcblx0ICogSGFuZGxlcyB0aGUgdG91Y2htb3ZlL21vdXNlbW92ZSBldmVudHMuXG5cdCAqIEB0b2RvIFNpbXBsaWZ5XG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnQgLSBUaGUgZXZlbnQgYXJndW1lbnRzLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5vbkRyYWdNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgZXYsIGlzVG91Y2hFdmVudCwgcGFnZVgsIHBhZ2VZLCBtaW5WYWx1ZSwgbWF4VmFsdWUsIHB1bGw7XG5cblx0XHRpZiAoIXRoaXMuc3RhdGUuaXNUb3VjaCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnN0YXRlLmlzU2Nyb2xsaW5nKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZXYgPSBldmVudC5vcmlnaW5hbEV2ZW50IHx8IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcblxuXHRcdHBhZ2VYID0gZ2V0VG91Y2hlcyhldikueDtcblx0XHRwYWdlWSA9IGdldFRvdWNoZXMoZXYpLnk7XG5cblx0XHQvLyBEcmFnIERpcmVjdGlvblxuXHRcdHRoaXMuZHJhZy5jdXJyZW50WCA9IHBhZ2VYIC0gdGhpcy5kcmFnLnN0YXJ0WDtcblx0XHR0aGlzLmRyYWcuY3VycmVudFkgPSBwYWdlWSAtIHRoaXMuZHJhZy5zdGFydFk7XG5cdFx0dGhpcy5kcmFnLmRpc3RhbmNlID0gdGhpcy5kcmFnLmN1cnJlbnRYIC0gdGhpcy5kcmFnLm9mZnNldFg7XG5cblx0XHQvLyBDaGVjayBtb3ZlIGRpcmVjdGlvblxuXHRcdGlmICh0aGlzLmRyYWcuZGlzdGFuY2UgPCAwKSB7XG5cdFx0XHR0aGlzLnN0YXRlLmRpcmVjdGlvbiA9IHRoaXMuc2V0dGluZ3MucnRsID8gJ3JpZ2h0JyA6ICdsZWZ0Jztcblx0XHR9IGVsc2UgaWYgKHRoaXMuZHJhZy5kaXN0YW5jZSA+IDApIHtcblx0XHRcdHRoaXMuc3RhdGUuZGlyZWN0aW9uID0gdGhpcy5zZXR0aW5ncy5ydGwgPyAnbGVmdCcgOiAncmlnaHQnO1xuXHRcdH1cblx0XHQvLyBMb29wXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MubG9vcCkge1xuXHRcdFx0aWYgKHRoaXMub3AodGhpcy5kcmFnLmN1cnJlbnRYLCAnPicsIHRoaXMuY29vcmRpbmF0ZXModGhpcy5taW5pbXVtKCkpKSAmJiB0aGlzLnN0YXRlLmRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuXHRcdFx0XHR0aGlzLmRyYWcuY3VycmVudFggLT0gKHRoaXMuc2V0dGluZ3MuY2VudGVyICYmIHRoaXMuY29vcmRpbmF0ZXMoMCkpIC0gdGhpcy5jb29yZGluYXRlcyh0aGlzLl9pdGVtcy5sZW5ndGgpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLm9wKHRoaXMuZHJhZy5jdXJyZW50WCwgJzwnLCB0aGlzLmNvb3JkaW5hdGVzKHRoaXMubWF4aW11bSgpKSkgJiYgdGhpcy5zdGF0ZS5kaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuXHRcdFx0XHR0aGlzLmRyYWcuY3VycmVudFggKz0gKHRoaXMuc2V0dGluZ3MuY2VudGVyICYmIHRoaXMuY29vcmRpbmF0ZXMoMCkpIC0gdGhpcy5jb29yZGluYXRlcyh0aGlzLl9pdGVtcy5sZW5ndGgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwdWxsXG5cdFx0XHRtaW5WYWx1ZSA9IHRoaXMuc2V0dGluZ3MucnRsID8gdGhpcy5jb29yZGluYXRlcyh0aGlzLm1heGltdW0oKSkgOiB0aGlzLmNvb3JkaW5hdGVzKHRoaXMubWluaW11bSgpKTtcblx0XHRcdG1heFZhbHVlID0gdGhpcy5zZXR0aW5ncy5ydGwgPyB0aGlzLmNvb3JkaW5hdGVzKHRoaXMubWluaW11bSgpKSA6IHRoaXMuY29vcmRpbmF0ZXModGhpcy5tYXhpbXVtKCkpO1xuXHRcdFx0cHVsbCA9IHRoaXMuc2V0dGluZ3MucHVsbERyYWcgPyB0aGlzLmRyYWcuZGlzdGFuY2UgLyA1IDogMDtcblx0XHRcdHRoaXMuZHJhZy5jdXJyZW50WCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuZHJhZy5jdXJyZW50WCwgbWluVmFsdWUgKyBwdWxsKSwgbWF4VmFsdWUgKyBwdWxsKTtcblx0XHR9XG5cblx0XHQvLyBMb2NrIGJyb3dzZXIgaWYgc3dpcGluZyBob3Jpem9udGFsXG5cblx0XHRpZiAoKHRoaXMuZHJhZy5kaXN0YW5jZSA+IDggfHwgdGhpcy5kcmFnLmRpc3RhbmNlIDwgLTgpKSB7XG5cdFx0XHRpZiAoZXYucHJldmVudERlZmF1bHQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZXYucmV0dXJuVmFsdWUgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHRoaXMuc3RhdGUuaXNTd2lwaW5nID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR0aGlzLmRyYWcudXBkYXRlZFggPSB0aGlzLmRyYWcuY3VycmVudFg7XG5cblx0XHQvLyBMb2NrIE93bCBpZiBzY3JvbGxpbmdcblx0XHRpZiAoKHRoaXMuZHJhZy5jdXJyZW50WSA+IDE2IHx8IHRoaXMuZHJhZy5jdXJyZW50WSA8IC0xNikgJiYgdGhpcy5zdGF0ZS5pc1N3aXBpbmcgPT09IGZhbHNlKSB7XG5cdFx0XHR0aGlzLnN0YXRlLmlzU2Nyb2xsaW5nID0gdHJ1ZTtcblx0XHRcdHRoaXMuZHJhZy51cGRhdGVkWCA9IHRoaXMuZHJhZy5zdGFydDtcblx0XHR9XG5cblx0XHR0aGlzLmFuaW1hdGUodGhpcy5kcmFnLnVwZGF0ZWRYKTtcblx0fTtcblxuXHQvKipcblx0ICogSGFuZGxlcyB0aGUgdG91Y2hlbmQvbW91c2V1cCBldmVudHMuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdE93bC5wcm90b3R5cGUub25EcmFnRW5kID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgY29tcGFyZVRpbWVzLCBkaXN0YW5jZUFicywgY2xvc2VzdDtcblxuXHRcdGlmICghdGhpcy5zdGF0ZS5pc1RvdWNoKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZXVwJykge1xuXHRcdFx0dGhpcy4kc3RhZ2UucmVtb3ZlQ2xhc3MoJ293bC1ncmFiJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy50cmlnZ2VyKCdkcmFnZ2VkJyk7XG5cblx0XHQvLyBwcmV2ZW50IGxpbmtzIGFuZCBpbWFnZXMgZHJhZ2dpbmc7XG5cdFx0dGhpcy5kcmFnLnRhcmdldEVsLnJlbW92ZUF0dHJpYnV0ZShcImRyYWdnYWJsZVwiKTtcblxuXHRcdC8vIHJlbW92ZSBkcmFnIGV2ZW50IGxpc3RlbmVyc1xuXG5cdFx0dGhpcy5zdGF0ZS5pc1RvdWNoID0gZmFsc2U7XG5cdFx0dGhpcy5zdGF0ZS5pc1Njcm9sbGluZyA9IGZhbHNlO1xuXHRcdHRoaXMuc3RhdGUuaXNTd2lwaW5nID0gZmFsc2U7XG5cblx0XHQvLyB0byBjaGVja1xuXHRcdGlmICh0aGlzLmRyYWcuZGlzdGFuY2UgPT09IDAgJiYgdGhpcy5zdGF0ZS5pbk1vdGlvbiAhPT0gdHJ1ZSkge1xuXHRcdFx0dGhpcy5zdGF0ZS5pbk1vdGlvbiA9IGZhbHNlO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIHByZXZlbnQgY2xpY2tzIHdoaWxlIHNjcm9sbGluZ1xuXG5cdFx0dGhpcy5kcmFnLmVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRjb21wYXJlVGltZXMgPSB0aGlzLmRyYWcuZW5kVGltZSAtIHRoaXMuZHJhZy5zdGFydFRpbWU7XG5cdFx0ZGlzdGFuY2VBYnMgPSBNYXRoLmFicyh0aGlzLmRyYWcuZGlzdGFuY2UpO1xuXG5cdFx0Ly8gdG8gdGVzdFxuXHRcdGlmIChkaXN0YW5jZUFicyA+IDMgfHwgY29tcGFyZVRpbWVzID4gMzAwKSB7XG5cdFx0XHR0aGlzLnJlbW92ZUNsaWNrKHRoaXMuZHJhZy50YXJnZXRFbCk7XG5cdFx0fVxuXG5cdFx0Y2xvc2VzdCA9IHRoaXMuY2xvc2VzdCh0aGlzLmRyYWcudXBkYXRlZFgpO1xuXG5cdFx0dGhpcy5zcGVlZCh0aGlzLnNldHRpbmdzLmRyYWdFbmRTcGVlZCB8fCB0aGlzLnNldHRpbmdzLnNtYXJ0U3BlZWQpO1xuXHRcdHRoaXMuY3VycmVudChjbG9zZXN0KTtcblx0XHR0aGlzLmludmFsaWRhdGUoJ3Bvc2l0aW9uJyk7XG5cdFx0dGhpcy51cGRhdGUoKTtcblxuXHRcdC8vIGlmIHB1bGxEcmFnIGlzIG9mZiB0aGVuIGZpcmUgdHJhbnNpdGlvbkVuZCBldmVudCBtYW51YWxseSB3aGVuIHN0aWNrXG5cdFx0Ly8gdG8gYm9yZGVyXG5cdFx0aWYgKCF0aGlzLnNldHRpbmdzLnB1bGxEcmFnICYmIHRoaXMuZHJhZy51cGRhdGVkWCA9PT0gdGhpcy5jb29yZGluYXRlcyhjbG9zZXN0KSkge1xuXHRcdFx0dGhpcy50cmFuc2l0aW9uRW5kKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5kcmFnLmRpc3RhbmNlID0gMDtcblxuXHRcdCQoZG9jdW1lbnQpLm9mZignLm93bC5kcmFnRXZlbnRzJyk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEF0dGFjaGVzIGBwcmV2ZW50Q2xpY2tgIHRvIGRpc2FibGUgbGluayB3aGlsZSBzd2lwcGluZy5cblx0ICogQHByb3RlY3RlZFxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbdGFyZ2V0XSAtIFRoZSB0YXJnZXQgb2YgdGhlIGBjbGlja2AgZXZlbnQuXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLnJlbW92ZUNsaWNrID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0dGhpcy5kcmFnLnRhcmdldEVsID0gdGFyZ2V0O1xuXHRcdCQodGFyZ2V0KS5vbignY2xpY2sucHJldmVudENsaWNrJywgdGhpcy5lLl9wcmV2ZW50Q2xpY2spO1xuXHRcdC8vIHRvIG1ha2Ugc3VyZSBjbGljayBpcyByZW1vdmVkOlxuXHRcdHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0YXJnZXQpLm9mZignY2xpY2sucHJldmVudENsaWNrJyk7XG5cdFx0fSwgMzAwKTtcblx0fTtcblxuXHQvKipcblx0ICogU3VwcHJlc3NlcyBjbGljayBldmVudC5cblx0ICogQHByb3RlY3RlZFxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldiAtIFRoZSBldmVudCBhcmd1bWVudHMuXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLnByZXZlbnRDbGljayA9IGZ1bmN0aW9uKGV2KSB7XG5cdFx0aWYgKGV2LnByZXZlbnREZWZhdWx0KSB7XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRldi5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuXHRcdH1cblx0XHRpZiAoZXYuc3RvcFByb3BhZ2F0aW9uKSB7XG5cdFx0XHRldi5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cdFx0JChldi50YXJnZXQpLm9mZignY2xpY2sucHJldmVudENsaWNrJyk7XG5cdH07XG5cblx0LyoqXG5cdCAqIENhdGNoZXMgc3RhZ2UgcG9zaXRpb24gd2hpbGUgYW5pbWF0ZSAob25seSBDU1MzKS5cblx0ICogQHByb3RlY3RlZFxuXHQgKiBAcmV0dXJuc1xuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm1Qcm9wZXJ0eSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0cmFuc2Zvcm0sIG1hdHJpeDNkO1xuXG5cdFx0dHJhbnNmb3JtID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy4kc3RhZ2UuZ2V0KDApLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHRoaXMudmVuZG9yTmFtZSArICd0cmFuc2Zvcm0nKTtcblx0XHQvLyB2YXIgdHJhbnNmb3JtID0gdGhpcy4kc3RhZ2UuY3NzKHRoaXMudmVuZG9yTmFtZSArICd0cmFuc2Zvcm0nKVxuXHRcdHRyYW5zZm9ybSA9IHRyYW5zZm9ybS5yZXBsYWNlKC9tYXRyaXgoM2QpP1xcKHxcXCkvZywgJycpLnNwbGl0KCcsJyk7XG5cdFx0bWF0cml4M2QgPSB0cmFuc2Zvcm0ubGVuZ3RoID09PSAxNjtcblxuXHRcdHJldHVybiBtYXRyaXgzZCAhPT0gdHJ1ZSA/IHRyYW5zZm9ybVs0XSA6IHRyYW5zZm9ybVsxMl07XG5cdH07XG5cblx0LyoqXG5cdCAqIEdldHMgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIGNsb3Nlc3QgaXRlbSBmb3IgYSBjb29yZGluYXRlLlxuXHQgKiBAdG9kbyBTZXR0aW5nIGBmcmVlRHJhZ2AgbWFrZXMgYGNsb3Nlc3RgIG5vdCByZXVzYWJsZS4gU2VlICMxNjUuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGNvb3JkaW5hdGUgLSBUaGUgY29vcmRpbmF0ZSBpbiBwaXhlbC5cblx0ICogQHJldHVybiB7TnVtYmVyfSAtIFRoZSBhYnNvbHV0ZSBwb3NpdGlvbiBvZiB0aGUgY2xvc2VzdCBpdGVtLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5jbG9zZXN0ID0gZnVuY3Rpb24oY29vcmRpbmF0ZSkge1xuXHRcdHZhciBwb3NpdGlvbiA9IC0xLCBwdWxsID0gMzAsIHdpZHRoID0gdGhpcy53aWR0aCgpLCBjb29yZGluYXRlcyA9IHRoaXMuY29vcmRpbmF0ZXMoKTtcblxuXHRcdGlmICghdGhpcy5zZXR0aW5ncy5mcmVlRHJhZykge1xuXHRcdFx0Ly8gY2hlY2sgY2xvc2VzdCBpdGVtXG5cdFx0XHQkLmVhY2goY29vcmRpbmF0ZXMsICQucHJveHkoZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XG5cdFx0XHRcdGlmIChjb29yZGluYXRlID4gdmFsdWUgLSBwdWxsICYmIGNvb3JkaW5hdGUgPCB2YWx1ZSArIHB1bGwpIHtcblx0XHRcdFx0XHRwb3NpdGlvbiA9IGluZGV4O1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMub3AoY29vcmRpbmF0ZSwgJzwnLCB2YWx1ZSlcblx0XHRcdFx0XHQmJiB0aGlzLm9wKGNvb3JkaW5hdGUsICc+JywgY29vcmRpbmF0ZXNbaW5kZXggKyAxXSB8fCB2YWx1ZSAtIHdpZHRoKSkge1xuXHRcdFx0XHRcdHBvc2l0aW9uID0gdGhpcy5zdGF0ZS5kaXJlY3Rpb24gPT09ICdsZWZ0JyA/IGluZGV4ICsgMSA6IGluZGV4O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwb3NpdGlvbiA9PT0gLTE7XG5cdFx0XHR9LCB0aGlzKSk7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLnNldHRpbmdzLmxvb3ApIHtcblx0XHRcdC8vIG5vbiBsb29wIGJvdW5kcmllc1xuXHRcdFx0aWYgKHRoaXMub3AoY29vcmRpbmF0ZSwgJz4nLCBjb29yZGluYXRlc1t0aGlzLm1pbmltdW0oKV0pKSB7XG5cdFx0XHRcdHBvc2l0aW9uID0gY29vcmRpbmF0ZSA9IHRoaXMubWluaW11bSgpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLm9wKGNvb3JkaW5hdGUsICc8JywgY29vcmRpbmF0ZXNbdGhpcy5tYXhpbXVtKCldKSkge1xuXHRcdFx0XHRwb3NpdGlvbiA9IGNvb3JkaW5hdGUgPSB0aGlzLm1heGltdW0oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcG9zaXRpb247XG5cdH07XG5cblx0LyoqXG5cdCAqIEFuaW1hdGVzIHRoZSBzdGFnZS5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge051bWJlcn0gY29vcmRpbmF0ZSAtIFRoZSBjb29yZGluYXRlIGluIHBpeGVscy5cblx0ICovXG5cdE93bC5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uKGNvb3JkaW5hdGUpIHtcblx0XHR0aGlzLnRyaWdnZXIoJ3RyYW5zbGF0ZScpO1xuXHRcdHRoaXMuc3RhdGUuaW5Nb3Rpb24gPSB0aGlzLnNwZWVkKCkgPiAwO1xuXG5cdFx0aWYgKHRoaXMuc3VwcG9ydDNkKSB7XG5cdFx0XHR0aGlzLiRzdGFnZS5jc3Moe1xuXHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgnICsgY29vcmRpbmF0ZSArICdweCcgKyAnLDBweCwgMHB4KScsXG5cdFx0XHRcdHRyYW5zaXRpb246ICh0aGlzLnNwZWVkKCkgLyAxMDAwKSArICdzJ1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlLmlzVG91Y2gpIHtcblx0XHRcdHRoaXMuJHN0YWdlLmNzcyh7XG5cdFx0XHRcdGxlZnQ6IGNvb3JkaW5hdGUgKyAncHgnXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy4kc3RhZ2UuYW5pbWF0ZSh7XG5cdFx0XHRcdGxlZnQ6IGNvb3JkaW5hdGVcblx0XHRcdH0sIHRoaXMuc3BlZWQoKSAvIDEwMDAsIHRoaXMuc2V0dGluZ3MuZmFsbGJhY2tFYXNpbmcsICQucHJveHkoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICh0aGlzLnN0YXRlLmluTW90aW9uKSB7XG5cdFx0XHRcdFx0dGhpcy50cmFuc2l0aW9uRW5kKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGl0ZW0uXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtwb3NpdGlvbl0gLSBUaGUgbmV3IGFic29sdXRlIHBvc2l0aW9uIG9yIG5vdGhpbmcgdG8gbGVhdmUgaXQgdW5jaGFuZ2VkLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSAtIFRoZSBhYnNvbHV0ZSBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCBpdGVtLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcblx0XHRpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2N1cnJlbnQ7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2l0ZW1zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRwb3NpdGlvbiA9IHRoaXMubm9ybWFsaXplKHBvc2l0aW9uKTtcblxuXHRcdGlmICh0aGlzLl9jdXJyZW50ICE9PSBwb3NpdGlvbikge1xuXHRcdFx0dmFyIGV2ZW50ID0gdGhpcy50cmlnZ2VyKCdjaGFuZ2UnLCB7IHByb3BlcnR5OiB7IG5hbWU6ICdwb3NpdGlvbicsIHZhbHVlOiBwb3NpdGlvbiB9IH0pO1xuXG5cdFx0XHRpZiAoZXZlbnQuZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHBvc2l0aW9uID0gdGhpcy5ub3JtYWxpemUoZXZlbnQuZGF0YSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2N1cnJlbnQgPSBwb3NpdGlvbjtcblxuXHRcdFx0dGhpcy5pbnZhbGlkYXRlKCdwb3NpdGlvbicpO1xuXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZWQnLCB7IHByb3BlcnR5OiB7IG5hbWU6ICdwb3NpdGlvbicsIHZhbHVlOiB0aGlzLl9jdXJyZW50IH0gfSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX2N1cnJlbnQ7XG5cdH07XG5cblx0LyoqXG5cdCAqIEludmFsaWRhdGVzIHRoZSBnaXZlbiBwYXJ0IG9mIHRoZSB1cGRhdGUgcm91dGluZS5cblx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcnQgLSBUaGUgcGFydCB0byBpbnZhbGlkYXRlLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5pbnZhbGlkYXRlID0gZnVuY3Rpb24ocGFydCkge1xuXHRcdHRoaXMuX2ludmFsaWRhdGVkW3BhcnRdID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNldHMgdGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGl0ZW0uXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIC0gVGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIHRoZSBuZXcgaXRlbS5cblx0ICovXG5cdE93bC5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbihwb3NpdGlvbikge1xuXHRcdHBvc2l0aW9uID0gdGhpcy5ub3JtYWxpemUocG9zaXRpb24pO1xuXG5cdFx0aWYgKHBvc2l0aW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9zcGVlZCA9IDA7XG5cdFx0dGhpcy5fY3VycmVudCA9IHBvc2l0aW9uO1xuXG5cdFx0dGhpcy5zdXBwcmVzcyhbICd0cmFuc2xhdGUnLCAndHJhbnNsYXRlZCcgXSk7XG5cblx0XHR0aGlzLmFuaW1hdGUodGhpcy5jb29yZGluYXRlcyhwb3NpdGlvbikpO1xuXG5cdFx0dGhpcy5yZWxlYXNlKFsgJ3RyYW5zbGF0ZScsICd0cmFuc2xhdGVkJyBdKTtcblx0fTtcblxuXHQvKipcblx0ICogTm9ybWFsaXplcyBhbiBhYnNvbHV0ZSBvciBhIHJlbGF0aXZlIHBvc2l0aW9uIGZvciBhbiBpdGVtLlxuXHQgKiBAcHVibGljXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiAtIFRoZSBhYnNvbHV0ZSBvciByZWxhdGl2ZSBwb3NpdGlvbiB0byBub3JtYWxpemUuXG5cdCAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JlbGF0aXZlPWZhbHNlXSAtIFdoZXRoZXIgdGhlIGdpdmVuIHBvc2l0aW9uIGlzIHJlbGF0aXZlIG9yIG5vdC5cblx0ICogQHJldHVybnMge051bWJlcn0gLSBUaGUgbm9ybWFsaXplZCBwb3NpdGlvbi5cblx0ICovXG5cdE93bC5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24ocG9zaXRpb24sIHJlbGF0aXZlKSB7XG5cdFx0dmFyIG4gPSAocmVsYXRpdmUgPyB0aGlzLl9pdGVtcy5sZW5ndGggOiB0aGlzLl9pdGVtcy5sZW5ndGggKyB0aGlzLl9jbG9uZXMubGVuZ3RoKTtcblxuXHRcdGlmICghJC5pc051bWVyaWMocG9zaXRpb24pIHx8IG4gPCAxKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9jbG9uZXMubGVuZ3RoKSB7XG5cdFx0XHRwb3NpdGlvbiA9ICgocG9zaXRpb24gJSBuKSArIG4pICUgbjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cG9zaXRpb24gPSBNYXRoLm1heCh0aGlzLm1pbmltdW0ocmVsYXRpdmUpLCBNYXRoLm1pbih0aGlzLm1heGltdW0ocmVsYXRpdmUpLCBwb3NpdGlvbikpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwb3NpdGlvbjtcblx0fTtcblxuXHQvKipcblx0ICogQ29udmVydHMgYW4gYWJzb2x1dGUgcG9zaXRpb24gZm9yIGFuIGl0ZW0gaW50byBhIHJlbGF0aXZlIHBvc2l0aW9uLlxuXHQgKiBAcHVibGljXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiAtIFRoZSBhYnNvbHV0ZSBwb3NpdGlvbiB0byBjb252ZXJ0LlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSAtIFRoZSBjb252ZXJ0ZWQgcG9zaXRpb24uXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLnJlbGF0aXZlID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcblx0XHRwb3NpdGlvbiA9IHRoaXMubm9ybWFsaXplKHBvc2l0aW9uKTtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uIC0gdGhpcy5fY2xvbmVzLmxlbmd0aCAvIDI7XG5cdFx0cmV0dXJuIHRoaXMubm9ybWFsaXplKHBvc2l0aW9uLCB0cnVlKTtcblx0fTtcblxuXHQvKipcblx0ICogR2V0cyB0aGUgbWF4aW11bSBwb3NpdGlvbiBmb3IgYW4gaXRlbS5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZWxhdGl2ZT1mYWxzZV0gLSBXaGV0aGVyIHRvIHJldHVybiBhbiBhYnNvbHV0ZSBwb3NpdGlvbiBvciBhIHJlbGF0aXZlIHBvc2l0aW9uLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfVxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5tYXhpbXVtID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcblx0XHR2YXIgbWF4aW11bSwgd2lkdGgsIGkgPSAwLCBjb29yZGluYXRlLFxuXHRcdFx0c2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzO1xuXG5cdFx0aWYgKHJlbGF0aXZlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faXRlbXMubGVuZ3RoIC0gMTtcblx0XHR9XG5cblx0XHRpZiAoIXNldHRpbmdzLmxvb3AgJiYgc2V0dGluZ3MuY2VudGVyKSB7XG5cdFx0XHRtYXhpbXVtID0gdGhpcy5faXRlbXMubGVuZ3RoIC0gMTtcblx0XHR9IGVsc2UgaWYgKCFzZXR0aW5ncy5sb29wICYmICFzZXR0aW5ncy5jZW50ZXIpIHtcblx0XHRcdG1heGltdW0gPSB0aGlzLl9pdGVtcy5sZW5ndGggLSBzZXR0aW5ncy5pdGVtcztcblx0XHR9IGVsc2UgaWYgKHNldHRpbmdzLmxvb3AgfHwgc2V0dGluZ3MuY2VudGVyKSB7XG5cdFx0XHRtYXhpbXVtID0gdGhpcy5faXRlbXMubGVuZ3RoICsgc2V0dGluZ3MuaXRlbXM7XG5cdFx0fSBlbHNlIGlmIChzZXR0aW5ncy5hdXRvV2lkdGggfHwgc2V0dGluZ3MubWVyZ2UpIHtcblx0XHRcdHJldmVydCA9IHNldHRpbmdzLnJ0bCA/IDEgOiAtMTtcblx0XHRcdHdpZHRoID0gdGhpcy4kc3RhZ2Uud2lkdGgoKSAtIHRoaXMuJGVsZW1lbnQud2lkdGgoKTtcblx0XHRcdHdoaWxlIChjb29yZGluYXRlID0gdGhpcy5jb29yZGluYXRlcyhpKSkge1xuXHRcdFx0XHRpZiAoY29vcmRpbmF0ZSAqIHJldmVydCA+PSB3aWR0aCkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG1heGltdW0gPSArK2k7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93ICdDYW4gbm90IGRldGVjdCBtYXhpbXVtIGFic29sdXRlIHBvc2l0aW9uLidcblx0XHR9XG5cblx0XHRyZXR1cm4gbWF4aW11bTtcblx0fTtcblxuXHQvKipcblx0ICogR2V0cyB0aGUgbWluaW11bSBwb3NpdGlvbiBmb3IgYW4gaXRlbS5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZWxhdGl2ZT1mYWxzZV0gLSBXaGV0aGVyIHRvIHJldHVybiBhbiBhYnNvbHV0ZSBwb3NpdGlvbiBvciBhIHJlbGF0aXZlIHBvc2l0aW9uLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfVxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5taW5pbXVtID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcblx0XHRpZiAocmVsYXRpdmUpIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9jbG9uZXMubGVuZ3RoIC8gMjtcblx0fTtcblxuXHQvKipcblx0ICogR2V0cyBhbiBpdGVtIGF0IHRoZSBzcGVjaWZpZWQgcmVsYXRpdmUgcG9zaXRpb24uXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtwb3NpdGlvbl0gLSBUaGUgcmVsYXRpdmUgcG9zaXRpb24gb2YgdGhlIGl0ZW0uXG5cdCAqIEByZXR1cm4ge2pRdWVyeXxBcnJheS48alF1ZXJ5Pn0gLSBUaGUgaXRlbSBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24gb3IgYWxsIGl0ZW1zIGlmIG5vIHBvc2l0aW9uIHdhcyBnaXZlbi5cblx0ICovXG5cdE93bC5wcm90b3R5cGUuaXRlbXMgPSBmdW5jdGlvbihwb3NpdGlvbikge1xuXHRcdGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faXRlbXMuc2xpY2UoKTtcblx0XHR9XG5cblx0XHRwb3NpdGlvbiA9IHRoaXMubm9ybWFsaXplKHBvc2l0aW9uLCB0cnVlKTtcblx0XHRyZXR1cm4gdGhpcy5faXRlbXNbcG9zaXRpb25dO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBHZXRzIGFuIGl0ZW0gYXQgdGhlIHNwZWNpZmllZCByZWxhdGl2ZSBwb3NpdGlvbi5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge051bWJlcn0gW3Bvc2l0aW9uXSAtIFRoZSByZWxhdGl2ZSBwb3NpdGlvbiBvZiB0aGUgaXRlbS5cblx0ICogQHJldHVybiB7alF1ZXJ5fEFycmF5LjxqUXVlcnk+fSAtIFRoZSBpdGVtIGF0IHRoZSBnaXZlbiBwb3NpdGlvbiBvciBhbGwgaXRlbXMgaWYgbm8gcG9zaXRpb24gd2FzIGdpdmVuLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5tZXJnZXJzID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcblx0XHRpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX21lcmdlcnMuc2xpY2UoKTtcblx0XHR9XG5cblx0XHRwb3NpdGlvbiA9IHRoaXMubm9ybWFsaXplKHBvc2l0aW9uLCB0cnVlKTtcblx0XHRyZXR1cm4gdGhpcy5fbWVyZ2Vyc1twb3NpdGlvbl07XG5cdH07XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGFic29sdXRlIHBvc2l0aW9ucyBvZiBjbG9uZXMgZm9yIGFuIGl0ZW0uXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtwb3NpdGlvbl0gLSBUaGUgcmVsYXRpdmUgcG9zaXRpb24gb2YgdGhlIGl0ZW0uXG5cdCAqIEByZXR1cm5zIHtBcnJheS48TnVtYmVyPn0gLSBUaGUgYWJzb2x1dGUgcG9zaXRpb25zIG9mIGNsb25lcyBmb3IgdGhlIGl0ZW0gb3IgYWxsIGlmIG5vIHBvc2l0aW9uIHdhcyBnaXZlbi5cblx0ICovXG5cdE93bC5wcm90b3R5cGUuY2xvbmVzID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcblx0XHR2YXIgb2RkID0gdGhpcy5fY2xvbmVzLmxlbmd0aCAvIDIsXG5cdFx0XHRldmVuID0gb2RkICsgdGhpcy5faXRlbXMubGVuZ3RoLFxuXHRcdFx0bWFwID0gZnVuY3Rpb24oaW5kZXgpIHsgcmV0dXJuIGluZGV4ICUgMiA9PT0gMCA/IGV2ZW4gKyBpbmRleCAvIDIgOiBvZGQgLSAoaW5kZXggKyAxKSAvIDIgfTtcblxuXHRcdGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gJC5tYXAodGhpcy5fY2xvbmVzLCBmdW5jdGlvbih2LCBpKSB7IHJldHVybiBtYXAoaSkgfSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICQubWFwKHRoaXMuX2Nsb25lcywgZnVuY3Rpb24odiwgaSkgeyByZXR1cm4gdiA9PT0gcG9zaXRpb24gPyBtYXAoaSkgOiBudWxsIH0pO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBjdXJyZW50IGFuaW1hdGlvbiBzcGVlZC5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge051bWJlcn0gW3NwZWVkXSAtIFRoZSBhbmltYXRpb24gc3BlZWQgaW4gbWlsbGlzZWNvbmRzIG9yIG5vdGhpbmcgdG8gbGVhdmUgaXQgdW5jaGFuZ2VkLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSAtIFRoZSBjdXJyZW50IGFuaW1hdGlvbiBzcGVlZCBpbiBtaWxsaXNlY29uZHMuXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLnNwZWVkID0gZnVuY3Rpb24oc3BlZWQpIHtcblx0XHRpZiAoc3BlZWQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5fc3BlZWQgPSBzcGVlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5fc3BlZWQ7XG5cdH07XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGNvb3JkaW5hdGUgb2YgYW4gaXRlbS5cblx0ICogQHRvZG8gVGhlIG5hbWUgb2YgdGhpcyBtZXRob2QgaXMgbWlzc2xlYW5kaW5nLlxuXHQgKiBAcHVibGljXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiAtIFRoZSBhYnNvbHV0ZSBwb3NpdGlvbiBvZiB0aGUgaXRlbSB3aXRoaW4gYG1pbmltdW0oKWAgYW5kIGBtYXhpbXVtKClgLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfEFycmF5LjxOdW1iZXI+fSAtIFRoZSBjb29yZGluYXRlIG9mIHRoZSBpdGVtIGluIHBpeGVsIG9yIGFsbCBjb29yZGluYXRlcy5cblx0ICovXG5cdE93bC5wcm90b3R5cGUuY29vcmRpbmF0ZXMgPSBmdW5jdGlvbihwb3NpdGlvbikge1xuXHRcdHZhciBjb29yZGluYXRlID0gbnVsbDtcblxuXHRcdGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gJC5tYXAodGhpcy5fY29vcmRpbmF0ZXMsICQucHJveHkoZnVuY3Rpb24oY29vcmRpbmF0ZSwgaW5kZXgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29vcmRpbmF0ZXMoaW5kZXgpO1xuXHRcdFx0fSwgdGhpcykpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNldHRpbmdzLmNlbnRlcikge1xuXHRcdFx0Y29vcmRpbmF0ZSA9IHRoaXMuX2Nvb3JkaW5hdGVzW3Bvc2l0aW9uXTtcblx0XHRcdGNvb3JkaW5hdGUgKz0gKHRoaXMud2lkdGgoKSAtIGNvb3JkaW5hdGUgKyAodGhpcy5fY29vcmRpbmF0ZXNbcG9zaXRpb24gLSAxXSB8fCAwKSkgLyAyICogKHRoaXMuc2V0dGluZ3MucnRsID8gLTEgOiAxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29vcmRpbmF0ZSA9IHRoaXMuX2Nvb3JkaW5hdGVzW3Bvc2l0aW9uIC0gMV0gfHwgMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29vcmRpbmF0ZTtcblx0fTtcblxuXHQvKipcblx0ICogQ2FsY3VsYXRlcyB0aGUgc3BlZWQgZm9yIGEgdHJhbnNsYXRpb24uXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGZyb20gLSBUaGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIHN0YXJ0IGl0ZW0uXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSB0byAtIFRoZSBhYnNvbHV0ZSBwb3NpdGlvbiBvZiB0aGUgdGFyZ2V0IGl0ZW0uXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBbZmFjdG9yPXVuZGVmaW5lZF0gLSBUaGUgdGltZSBmYWN0b3IgaW4gbWlsbGlzZWNvbmRzLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSAtIFRoZSB0aW1lIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHRyYW5zbGF0aW9uLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5kdXJhdGlvbiA9IGZ1bmN0aW9uKGZyb20sIHRvLCBmYWN0b3IpIHtcblx0XHRyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgoTWF0aC5hYnModG8gLSBmcm9tKSwgMSksIDYpICogTWF0aC5hYnMoKGZhY3RvciB8fCB0aGlzLnNldHRpbmdzLnNtYXJ0U3BlZWQpKTtcblx0fTtcblxuXHQvKipcblx0ICogU2xpZGVzIHRvIHRoZSBzcGVjaWZpZWQgaXRlbS5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gLSBUaGUgcG9zaXRpb24gb2YgdGhlIGl0ZW0uXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBbc3BlZWRdIC0gVGhlIHRpbWUgaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgdHJhbnNpdGlvbi5cblx0ICovXG5cdE93bC5wcm90b3R5cGUudG8gPSBmdW5jdGlvbihwb3NpdGlvbiwgc3BlZWQpIHtcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5sb29wKSB7XG5cdFx0XHR2YXIgZGlzdGFuY2UgPSBwb3NpdGlvbiAtIHRoaXMucmVsYXRpdmUodGhpcy5jdXJyZW50KCkpLFxuXHRcdFx0XHRyZXZlcnQgPSB0aGlzLmN1cnJlbnQoKSxcblx0XHRcdFx0YmVmb3JlID0gdGhpcy5jdXJyZW50KCksXG5cdFx0XHRcdGFmdGVyID0gdGhpcy5jdXJyZW50KCkgKyBkaXN0YW5jZSxcblx0XHRcdFx0ZGlyZWN0aW9uID0gYmVmb3JlIC0gYWZ0ZXIgPCAwID8gdHJ1ZSA6IGZhbHNlLFxuXHRcdFx0XHRpdGVtcyA9IHRoaXMuX2Nsb25lcy5sZW5ndGggKyB0aGlzLl9pdGVtcy5sZW5ndGg7XG5cblx0XHRcdGlmIChhZnRlciA8IHRoaXMuc2V0dGluZ3MuaXRlbXMgJiYgZGlyZWN0aW9uID09PSBmYWxzZSkge1xuXHRcdFx0XHRyZXZlcnQgPSBiZWZvcmUgKyB0aGlzLl9pdGVtcy5sZW5ndGg7XG5cdFx0XHRcdHRoaXMucmVzZXQocmV2ZXJ0KTtcblx0XHRcdH0gZWxzZSBpZiAoYWZ0ZXIgPj0gaXRlbXMgLSB0aGlzLnNldHRpbmdzLml0ZW1zICYmIGRpcmVjdGlvbiA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRyZXZlcnQgPSBiZWZvcmUgLSB0aGlzLl9pdGVtcy5sZW5ndGg7XG5cdFx0XHRcdHRoaXMucmVzZXQocmV2ZXJ0KTtcblx0XHRcdH1cblx0XHRcdHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5lLl9nb1RvTG9vcCk7XG5cdFx0XHR0aGlzLmUuX2dvVG9Mb29wID0gd2luZG93LnNldFRpbWVvdXQoJC5wcm94eShmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5zcGVlZCh0aGlzLmR1cmF0aW9uKHRoaXMuY3VycmVudCgpLCByZXZlcnQgKyBkaXN0YW5jZSwgc3BlZWQpKTtcblx0XHRcdFx0dGhpcy5jdXJyZW50KHJldmVydCArIGRpc3RhbmNlKTtcblx0XHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHRcdH0sIHRoaXMpLCAzMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc3BlZWQodGhpcy5kdXJhdGlvbih0aGlzLmN1cnJlbnQoKSwgcG9zaXRpb24sIHNwZWVkKSk7XG5cdFx0XHR0aGlzLmN1cnJlbnQocG9zaXRpb24pO1xuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIFNsaWRlcyB0byB0aGUgbmV4dCBpdGVtLlxuXHQgKiBAcHVibGljXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBbc3BlZWRdIC0gVGhlIHRpbWUgaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgdHJhbnNpdGlvbi5cblx0ICovXG5cdE93bC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKHNwZWVkKSB7XG5cdFx0c3BlZWQgPSBzcGVlZCB8fCBmYWxzZTtcblx0XHR0aGlzLnRvKHRoaXMucmVsYXRpdmUodGhpcy5jdXJyZW50KCkpICsgMSwgc3BlZWQpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTbGlkZXMgdG8gdGhlIHByZXZpb3VzIGl0ZW0uXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVlZF0gLSBUaGUgdGltZSBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSB0cmFuc2l0aW9uLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24oc3BlZWQpIHtcblx0XHRzcGVlZCA9IHNwZWVkIHx8IGZhbHNlO1xuXHRcdHRoaXMudG8odGhpcy5yZWxhdGl2ZSh0aGlzLmN1cnJlbnQoKSkgLSAxLCBzcGVlZCk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgdGhlIGVuZCBvZiBhbiBhbmltYXRpb24uXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnQgLSBUaGUgZXZlbnQgYXJndW1lbnRzLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS50cmFuc2l0aW9uRW5kID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuXHRcdC8vIGlmIGNzczIgYW5pbWF0aW9uIHRoZW4gZXZlbnQgb2JqZWN0IGlzIHVuZGVmaW5lZFxuXHRcdGlmIChldmVudCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0Ly8gQ2F0Y2ggb25seSBvd2wtc3RhZ2UgdHJhbnNpdGlvbkVuZCBldmVudFxuXHRcdFx0aWYgKChldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudCB8fCBldmVudC5vcmlnaW5hbFRhcmdldCkgIT09IHRoaXMuJHN0YWdlLmdldCgwKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5zdGF0ZS5pbk1vdGlvbiA9IGZhbHNlO1xuXHRcdHRoaXMudHJpZ2dlcigndHJhbnNsYXRlZCcpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBHZXRzIHZpZXdwb3J0IHdpZHRoLlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqIEByZXR1cm4ge051bWJlcn0gLSBUaGUgd2lkdGggaW4gcGl4ZWwuXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLnZpZXdwb3J0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHdpZHRoO1xuXHRcdGlmICh0aGlzLm9wdGlvbnMucmVzcG9uc2l2ZUJhc2VFbGVtZW50ICE9PSB3aW5kb3cpIHtcblx0XHRcdHdpZHRoID0gJCh0aGlzLm9wdGlvbnMucmVzcG9uc2l2ZUJhc2VFbGVtZW50KS53aWR0aCgpO1xuXHRcdH0gZWxzZSBpZiAod2luZG93LmlubmVyV2lkdGgpIHtcblx0XHRcdHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0fSBlbHNlIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSB7XG5cdFx0XHR3aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgJ0NhbiBub3QgZGV0ZWN0IHZpZXdwb3J0IHdpZHRoLic7XG5cdFx0fVxuXHRcdHJldHVybiB3aWR0aDtcblx0fTtcblxuXHQvKipcblx0ICogUmVwbGFjZXMgdGhlIGN1cnJlbnQgY29udGVudC5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fGpRdWVyeXxTdHJpbmd9IGNvbnRlbnQgLSBUaGUgbmV3IGNvbnRlbnQuXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLnJlcGxhY2UgPSBmdW5jdGlvbihjb250ZW50KSB7XG5cdFx0dGhpcy4kc3RhZ2UuZW1wdHkoKTtcblx0XHR0aGlzLl9pdGVtcyA9IFtdO1xuXG5cdFx0aWYgKGNvbnRlbnQpIHtcblx0XHRcdGNvbnRlbnQgPSAoY29udGVudCBpbnN0YW5jZW9mIGpRdWVyeSkgPyBjb250ZW50IDogJChjb250ZW50KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5zZXR0aW5ncy5uZXN0ZWRJdGVtU2VsZWN0b3IpIHtcblx0XHRcdGNvbnRlbnQgPSBjb250ZW50LmZpbmQoJy4nICsgdGhpcy5zZXR0aW5ncy5uZXN0ZWRJdGVtU2VsZWN0b3IpO1xuXHRcdH1cblxuXHRcdGNvbnRlbnQuZmlsdGVyKGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubm9kZVR5cGUgPT09IDE7XG5cdFx0fSkuZWFjaCgkLnByb3h5KGZ1bmN0aW9uKGluZGV4LCBpdGVtKSB7XG5cdFx0XHRpdGVtID0gdGhpcy5wcmVwYXJlKGl0ZW0pO1xuXHRcdFx0dGhpcy4kc3RhZ2UuYXBwZW5kKGl0ZW0pO1xuXHRcdFx0dGhpcy5faXRlbXMucHVzaChpdGVtKTtcblx0XHRcdHRoaXMuX21lcmdlcnMucHVzaChpdGVtLmZpbmQoJ1tkYXRhLW1lcmdlXScpLmFuZFNlbGYoJ1tkYXRhLW1lcmdlXScpLmF0dHIoJ2RhdGEtbWVyZ2UnKSAqIDEgfHwgMSk7XG5cdFx0fSwgdGhpcykpO1xuXG5cdFx0dGhpcy5yZXNldCgkLmlzTnVtZXJpYyh0aGlzLnNldHRpbmdzLnN0YXJ0UG9zaXRpb24pID8gdGhpcy5zZXR0aW5ncy5zdGFydFBvc2l0aW9uIDogMCk7XG5cblx0XHR0aGlzLmludmFsaWRhdGUoJ2l0ZW1zJyk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEFkZHMgYW4gaXRlbS5cblx0ICogQHRvZG8gVXNlIGBpdGVtYCBpbnN0ZWFkIG9mIGBjb250ZW50YCBmb3IgdGhlIGV2ZW50IGFyZ3VtZW50cy5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fGpRdWVyeXxTdHJpbmd9IGNvbnRlbnQgLSBUaGUgaXRlbSBjb250ZW50IHRvIGFkZC5cblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtwb3NpdGlvbl0gLSBUaGUgcmVsYXRpdmUgcG9zaXRpb24gYXQgd2hpY2ggdG8gaW5zZXJ0IHRoZSBpdGVtIG90aGVyd2lzZSB0aGUgaXRlbSB3aWxsIGJlIGFkZGVkIHRvIHRoZSBlbmQuXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGNvbnRlbnQsIHBvc2l0aW9uKSB7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gdGhpcy5faXRlbXMubGVuZ3RoIDogdGhpcy5ub3JtYWxpemUocG9zaXRpb24sIHRydWUpO1xuXG5cdFx0dGhpcy50cmlnZ2VyKCdhZGQnLCB7IGNvbnRlbnQ6IGNvbnRlbnQsIHBvc2l0aW9uOiBwb3NpdGlvbiB9KTtcblxuXHRcdGlmICh0aGlzLl9pdGVtcy5sZW5ndGggPT09IDAgfHwgcG9zaXRpb24gPT09IHRoaXMuX2l0ZW1zLmxlbmd0aCkge1xuXHRcdFx0dGhpcy4kc3RhZ2UuYXBwZW5kKGNvbnRlbnQpO1xuXHRcdFx0dGhpcy5faXRlbXMucHVzaChjb250ZW50KTtcblx0XHRcdHRoaXMuX21lcmdlcnMucHVzaChjb250ZW50LmZpbmQoJ1tkYXRhLW1lcmdlXScpLmFuZFNlbGYoJ1tkYXRhLW1lcmdlXScpLmF0dHIoJ2RhdGEtbWVyZ2UnKSAqIDEgfHwgMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2l0ZW1zW3Bvc2l0aW9uXS5iZWZvcmUoY29udGVudCk7XG5cdFx0XHR0aGlzLl9pdGVtcy5zcGxpY2UocG9zaXRpb24sIDAsIGNvbnRlbnQpO1xuXHRcdFx0dGhpcy5fbWVyZ2Vycy5zcGxpY2UocG9zaXRpb24sIDAsIGNvbnRlbnQuZmluZCgnW2RhdGEtbWVyZ2VdJykuYW5kU2VsZignW2RhdGEtbWVyZ2VdJykuYXR0cignZGF0YS1tZXJnZScpICogMSB8fCAxKTtcblx0XHR9XG5cblx0XHR0aGlzLmludmFsaWRhdGUoJ2l0ZW1zJyk7XG5cblx0XHR0aGlzLnRyaWdnZXIoJ2FkZGVkJywgeyBjb250ZW50OiBjb250ZW50LCBwb3NpdGlvbjogcG9zaXRpb24gfSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYW4gaXRlbSBieSBpdHMgcG9zaXRpb24uXG5cdCAqIEB0b2RvIFVzZSBgaXRlbWAgaW5zdGVhZCBvZiBgY29udGVudGAgZm9yIHRoZSBldmVudCBhcmd1bWVudHMuXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIC0gVGhlIHJlbGF0aXZlIHBvc2l0aW9uIG9mIHRoZSBpdGVtIHRvIHJlbW92ZS5cblx0ICovXG5cdE93bC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcblx0XHRwb3NpdGlvbiA9IHRoaXMubm9ybWFsaXplKHBvc2l0aW9uLCB0cnVlKTtcblxuXHRcdGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy50cmlnZ2VyKCdyZW1vdmUnLCB7IGNvbnRlbnQ6IHRoaXMuX2l0ZW1zW3Bvc2l0aW9uXSwgcG9zaXRpb246IHBvc2l0aW9uIH0pO1xuXG5cdFx0dGhpcy5faXRlbXNbcG9zaXRpb25dLnJlbW92ZSgpO1xuXHRcdHRoaXMuX2l0ZW1zLnNwbGljZShwb3NpdGlvbiwgMSk7XG5cdFx0dGhpcy5fbWVyZ2Vycy5zcGxpY2UocG9zaXRpb24sIDEpO1xuXG5cdFx0dGhpcy5pbnZhbGlkYXRlKCdpdGVtcycpO1xuXG5cdFx0dGhpcy50cmlnZ2VyKCdyZW1vdmVkJywgeyBjb250ZW50OiBudWxsLCBwb3NpdGlvbjogcG9zaXRpb24gfSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEFkZHMgdHJpZ2dlcmFibGUgZXZlbnRzLlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLmFkZFRyaWdnZXJhYmxlRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGhhbmRsZXIgPSAkLnByb3h5KGZ1bmN0aW9uKGNhbGxiYWNrLCBldmVudCkge1xuXHRcdFx0cmV0dXJuICQucHJveHkoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoZS5yZWxhdGVkVGFyZ2V0ICE9PSB0aGlzKSB7XG5cdFx0XHRcdFx0dGhpcy5zdXBwcmVzcyhbIGV2ZW50IF0pO1xuXHRcdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG5cdFx0XHRcdFx0dGhpcy5yZWxlYXNlKFsgZXZlbnQgXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpO1xuXHRcdH0sIHRoaXMpO1xuXG5cdFx0JC5lYWNoKHtcblx0XHRcdCduZXh0JzogdGhpcy5uZXh0LFxuXHRcdFx0J3ByZXYnOiB0aGlzLnByZXYsXG5cdFx0XHQndG8nOiB0aGlzLnRvLFxuXHRcdFx0J2Rlc3Ryb3knOiB0aGlzLmRlc3Ryb3ksXG5cdFx0XHQncmVmcmVzaCc6IHRoaXMucmVmcmVzaCxcblx0XHRcdCdyZXBsYWNlJzogdGhpcy5yZXBsYWNlLFxuXHRcdFx0J2FkZCc6IHRoaXMuYWRkLFxuXHRcdFx0J3JlbW92ZSc6IHRoaXMucmVtb3ZlXG5cdFx0fSwgJC5wcm94eShmdW5jdGlvbihldmVudCwgY2FsbGJhY2spIHtcblx0XHRcdHRoaXMuJGVsZW1lbnQub24oZXZlbnQgKyAnLm93bC5jYXJvdXNlbCcsIGhhbmRsZXIoY2FsbGJhY2ssIGV2ZW50ICsgJy5vd2wuY2Fyb3VzZWwnKSk7XG5cdFx0fSwgdGhpcykpO1xuXG5cdH07XG5cblx0LyoqXG5cdCAqIFdhdGNoZXMgdGhlIHZpc2liaWxpdHkgb2YgdGhlIGNhcm91c2VsIGVsZW1lbnQuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdE93bC5wcm90b3R5cGUud2F0Y2hWaXNpYmlsaXR5ID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyB0ZXN0IG9uIHplcHRvXG5cdFx0aWYgKCFpc0VsVmlzaWJsZSh0aGlzLiRlbGVtZW50LmdldCgwKSkpIHtcblx0XHRcdHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ293bC1oaWRkZW4nKTtcblx0XHRcdHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuZS5fY2hlY2tWaXNpYmlsZSk7XG5cdFx0XHR0aGlzLmUuX2NoZWNrVmlzaWJpbGUgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoJC5wcm94eShjaGVja1Zpc2libGUsIHRoaXMpLCA1MDApO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGlzRWxWaXNpYmxlKGVsKSB7XG5cdFx0XHRyZXR1cm4gZWwub2Zmc2V0V2lkdGggPiAwICYmIGVsLm9mZnNldEhlaWdodCA+IDA7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hlY2tWaXNpYmxlKCkge1xuXHRcdFx0aWYgKGlzRWxWaXNpYmxlKHRoaXMuJGVsZW1lbnQuZ2V0KDApKSkge1xuXHRcdFx0XHR0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKCdvd2wtaGlkZGVuJyk7XG5cdFx0XHRcdHRoaXMucmVmcmVzaCgpO1xuXHRcdFx0XHR3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmUuX2NoZWNrVmlzaWJpbGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogUHJlbG9hZHMgaW1hZ2VzIHdpdGggYXV0byB3aWR0aC5cblx0ICogQHByb3RlY3RlZFxuXHQgKiBAdG9kbyBTdGlsbCB0byB0ZXN0XG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLnByZWxvYWRBdXRvV2lkdGhJbWFnZXMgPSBmdW5jdGlvbihpbWdzKSB7XG5cdFx0dmFyIGxvYWRlZCwgdGhhdCwgJGVsLCBpbWc7XG5cblx0XHRsb2FkZWQgPSAwO1xuXHRcdHRoYXQgPSB0aGlzO1xuXHRcdGltZ3MuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuXHRcdFx0JGVsID0gJChlbCk7XG5cdFx0XHRpbWcgPSBuZXcgSW1hZ2UoKTtcblxuXHRcdFx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsb2FkZWQrKztcblx0XHRcdFx0JGVsLmF0dHIoJ3NyYycsIGltZy5zcmMpO1xuXHRcdFx0XHQkZWwuY3NzKCdvcGFjaXR5JywgMSk7XG5cdFx0XHRcdGlmIChsb2FkZWQgPj0gaW1ncy5sZW5ndGgpIHtcblx0XHRcdFx0XHR0aGF0LnN0YXRlLmltYWdlc0xvYWRlZCA9IHRydWU7XG5cdFx0XHRcdFx0dGhhdC5pbml0aWFsaXplKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGltZy5zcmMgPSAkZWwuYXR0cignc3JjJykgfHwgJGVsLmF0dHIoJ2RhdGEtc3JjJykgfHwgJGVsLmF0dHIoJ2RhdGEtc3JjLXJldGluYScpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBEZXN0cm95cyB0aGUgY2Fyb3VzZWwuXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdE93bC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3ModGhpcy5zZXR0aW5ncy50aGVtZUNsYXNzKSkge1xuXHRcdFx0dGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyh0aGlzLnNldHRpbmdzLnRoZW1lQ2xhc3MpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNldHRpbmdzLnJlc3BvbnNpdmUgIT09IGZhbHNlKSB7XG5cdFx0XHQkKHdpbmRvdykub2ZmKCdyZXNpemUub3dsLmNhcm91c2VsJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMudHJhbnNpdGlvbkVuZFZlbmRvcikge1xuXHRcdFx0dGhpcy5vZmYodGhpcy4kc3RhZ2UuZ2V0KDApLCB0aGlzLnRyYW5zaXRpb25FbmRWZW5kb3IsIHRoaXMuZS5fdHJhbnNpdGlvbkVuZCk7XG5cdFx0fVxuXG5cdFx0Zm9yICggdmFyIGkgaW4gdGhpcy5fcGx1Z2lucykge1xuXHRcdFx0dGhpcy5fcGx1Z2luc1tpXS5kZXN0cm95KCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MubW91c2VEcmFnIHx8IHRoaXMuc2V0dGluZ3MudG91Y2hEcmFnKSB7XG5cdFx0XHR0aGlzLiRzdGFnZS5vZmYoJ21vdXNlZG93biB0b3VjaHN0YXJ0IHRvdWNoY2FuY2VsJyk7XG5cdFx0XHQkKGRvY3VtZW50KS5vZmYoJy5vd2wuZHJhZ0V2ZW50cycpO1xuXHRcdFx0dGhpcy4kc3RhZ2UuZ2V0KDApLm9uc2VsZWN0c3RhcnQgPSBmdW5jdGlvbigpIHt9O1xuXHRcdFx0dGhpcy4kc3RhZ2Uub2ZmKCdkcmFnc3RhcnQnLCBmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlIH0pO1xuXHRcdH1cblxuXHRcdC8vIHJlbW92ZSBldmVudCBoYW5kbGVycyBpbiB0aGUgXCIub3dsLmNhcm91c2VsXCIgbmFtZXNwYWNlXG5cdFx0dGhpcy4kZWxlbWVudC5vZmYoJy5vd2wnKTtcblxuXHRcdHRoaXMuJHN0YWdlLmNoaWxkcmVuKCcuY2xvbmVkJykucmVtb3ZlKCk7XG5cdFx0dGhpcy5lID0gbnVsbDtcblx0XHR0aGlzLiRlbGVtZW50LnJlbW92ZURhdGEoJ293bENhcm91c2VsJyk7XG5cblx0XHR0aGlzLiRzdGFnZS5jaGlsZHJlbigpLmNvbnRlbnRzKCkudW53cmFwKCk7XG5cdFx0dGhpcy4kc3RhZ2UuY2hpbGRyZW4oKS51bndyYXAoKTtcblx0XHR0aGlzLiRzdGFnZS51bndyYXAoKTtcblx0fTtcblxuXHQvKipcblx0ICogT3BlcmF0b3JzIHRvIGNhbGN1bGF0ZSByaWdodC10by1sZWZ0IGFuZCBsZWZ0LXRvLXJpZ2h0LlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBbYV0gLSBUaGUgbGVmdCBzaWRlIG9wZXJhbmQuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBbb10gLSBUaGUgb3BlcmF0b3IuXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBbYl0gLSBUaGUgcmlnaHQgc2lkZSBvcGVyYW5kLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5vcCA9IGZ1bmN0aW9uKGEsIG8sIGIpIHtcblx0XHR2YXIgcnRsID0gdGhpcy5zZXR0aW5ncy5ydGw7XG5cdFx0c3dpdGNoIChvKSB7XG5cdFx0XHRjYXNlICc8Jzpcblx0XHRcdFx0cmV0dXJuIHJ0bCA/IGEgPiBiIDogYSA8IGI7XG5cdFx0XHRjYXNlICc+Jzpcblx0XHRcdFx0cmV0dXJuIHJ0bCA/IGEgPCBiIDogYSA+IGI7XG5cdFx0XHRjYXNlICc+PSc6XG5cdFx0XHRcdHJldHVybiBydGwgPyBhIDw9IGIgOiBhID49IGI7XG5cdFx0XHRjYXNlICc8PSc6XG5cdFx0XHRcdHJldHVybiBydGwgPyBhID49IGIgOiBhIDw9IGI7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEF0dGFjaGVzIHRvIGFuIGludGVybmFsIGV2ZW50LlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgZXZlbnQgc291cmNlLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgLSBUaGUgZXZlbnQgbmFtZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgLSBUaGUgZXZlbnQgaGFuZGxlciB0byBhdHRhY2guXG5cdCAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FwdHVyZSAtIFdldGhlciB0aGUgZXZlbnQgc2hvdWxkIGJlIGhhbmRsZWQgYXQgdGhlIGNhcHR1cmluZyBwaGFzZSBvciBub3QuXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZWxlbWVudCwgZXZlbnQsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XG5cdFx0aWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuXHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgY2FwdHVyZSk7XG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KSB7XG5cdFx0XHRlbGVtZW50LmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgbGlzdGVuZXIpO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogRGV0YWNoZXMgZnJvbSBhbiBpbnRlcm5hbCBldmVudC5cblx0ICogQHByb3RlY3RlZFxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gVGhlIGV2ZW50IHNvdXJjZS5cblx0ICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IC0gVGhlIGV2ZW50IG5hbWUuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIC0gVGhlIGF0dGFjaGVkIGV2ZW50IGhhbmRsZXIgdG8gZGV0YWNoLlxuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IGNhcHR1cmUgLSBXZXRoZXIgdGhlIGF0dGFjaGVkIGV2ZW50IGhhbmRsZXIgd2FzIHJlZ2lzdGVyZWQgYXMgYSBjYXB0dXJpbmcgbGlzdGVuZXIgb3Igbm90LlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbihlbGVtZW50LCBldmVudCwgbGlzdGVuZXIsIGNhcHR1cmUpIHtcblx0XHRpZiAoZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBjYXB0dXJlKTtcblx0XHR9IGVsc2UgaWYgKGVsZW1lbnQuZGV0YWNoRXZlbnQpIHtcblx0XHRcdGVsZW1lbnQuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBsaXN0ZW5lcik7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBUcmlnZ2VycyBhbiBwdWJsaWMgZXZlbnQuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgZXZlbnQgbmFtZS5cblx0ICogQHBhcmFtIHsqfSBbZGF0YT1udWxsXSAtIFRoZSBldmVudCBkYXRhLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gW25hbWVzcGFjZT0ub3dsLmNhcm91c2VsXSAtIFRoZSBldmVudCBuYW1lc3BhY2UuXG5cdCAqIEByZXR1cm5zIHtFdmVudH0gLSBUaGUgZXZlbnQgYXJndW1lbnRzLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24obmFtZSwgZGF0YSwgbmFtZXNwYWNlKSB7XG5cdFx0dmFyIHN0YXR1cyA9IHtcblx0XHRcdGl0ZW06IHsgY291bnQ6IHRoaXMuX2l0ZW1zLmxlbmd0aCwgaW5kZXg6IHRoaXMuY3VycmVudCgpIH1cblx0XHR9LCBoYW5kbGVyID0gJC5jYW1lbENhc2UoXG5cdFx0XHQkLmdyZXAoWyAnb24nLCBuYW1lLCBuYW1lc3BhY2UgXSwgZnVuY3Rpb24odikgeyByZXR1cm4gdiB9KVxuXHRcdFx0XHQuam9pbignLScpLnRvTG93ZXJDYXNlKClcblx0XHQpLCBldmVudCA9ICQuRXZlbnQoXG5cdFx0XHRbIG5hbWUsICdvd2wnLCBuYW1lc3BhY2UgfHwgJ2Nhcm91c2VsJyBdLmpvaW4oJy4nKS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0JC5leHRlbmQoeyByZWxhdGVkVGFyZ2V0OiB0aGlzIH0sIHN0YXR1cywgZGF0YSlcblx0XHQpO1xuXG5cdFx0aWYgKCF0aGlzLl9zdXByZXNzW25hbWVdKSB7XG5cdFx0XHQkLmVhY2godGhpcy5fcGx1Z2lucywgZnVuY3Rpb24obmFtZSwgcGx1Z2luKSB7XG5cdFx0XHRcdGlmIChwbHVnaW4ub25UcmlnZ2VyKSB7XG5cdFx0XHRcdFx0cGx1Z2luLm9uVHJpZ2dlcihldmVudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLiRlbGVtZW50LnRyaWdnZXIoZXZlbnQpO1xuXG5cdFx0XHRpZiAodGhpcy5zZXR0aW5ncyAmJiB0eXBlb2YgdGhpcy5zZXR0aW5nc1toYW5kbGVyXSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzW2hhbmRsZXJdLmFwcGx5KHRoaXMsIGV2ZW50KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZXZlbnQ7XG5cdH07XG5cblx0LyoqXG5cdCAqIFN1cHByZXNzZXMgZXZlbnRzLlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqIEBwYXJhbSB7QXJyYXkuPFN0cmluZz59IGV2ZW50cyAtIFRoZSBldmVudHMgdG8gc3VwcHJlc3MuXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLnN1cHByZXNzID0gZnVuY3Rpb24oZXZlbnRzKSB7XG5cdFx0JC5lYWNoKGV2ZW50cywgJC5wcm94eShmdW5jdGlvbihpbmRleCwgZXZlbnQpIHtcblx0XHRcdHRoaXMuX3N1cHJlc3NbZXZlbnRdID0gdHJ1ZTtcblx0XHR9LCB0aGlzKSk7XG5cdH1cblxuXHQvKipcblx0ICogUmVsZWFzZXMgc3VwcHJlc3NlZCBldmVudHMuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQHBhcmFtIHtBcnJheS48U3RyaW5nPn0gZXZlbnRzIC0gVGhlIGV2ZW50cyB0byByZWxlYXNlLlxuXHQgKi9cblx0T3dsLnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24oZXZlbnRzKSB7XG5cdFx0JC5lYWNoKGV2ZW50cywgJC5wcm94eShmdW5jdGlvbihpbmRleCwgZXZlbnQpIHtcblx0XHRcdGRlbGV0ZSB0aGlzLl9zdXByZXNzW2V2ZW50XTtcblx0XHR9LCB0aGlzKSk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIHRoZSBhdmFpbGFiaWxpdHkgb2Ygc29tZSBicm93c2VyIGZlYXR1cmVzLlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHRPd2wucHJvdG90eXBlLmJyb3dzZXJTdXBwb3J0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zdXBwb3J0M2QgPSBpc1BlcnNwZWN0aXZlKCk7XG5cblx0XHRpZiAodGhpcy5zdXBwb3J0M2QpIHtcblx0XHRcdHRoaXMudHJhbnNmb3JtVmVuZG9yID0gaXNUcmFuc2Zvcm0oKTtcblxuXHRcdFx0Ly8gdGFrZSB0cmFuc2l0aW9uZW5kIGV2ZW50IG5hbWUgYnkgZGV0ZWN0aW5nIHRyYW5zaXRpb25cblx0XHRcdHZhciBlbmRWZW5kb3JzID0gWyAndHJhbnNpdGlvbmVuZCcsICd3ZWJraXRUcmFuc2l0aW9uRW5kJywgJ3RyYW5zaXRpb25lbmQnLCAnb1RyYW5zaXRpb25FbmQnIF07XG5cdFx0XHR0aGlzLnRyYW5zaXRpb25FbmRWZW5kb3IgPSBlbmRWZW5kb3JzW2lzVHJhbnNpdGlvbigpXTtcblxuXHRcdFx0Ly8gdGFrZSB2ZW5kb3IgbmFtZSBmcm9tIHRyYW5zZm9ybSBuYW1lXG5cdFx0XHR0aGlzLnZlbmRvck5hbWUgPSB0aGlzLnRyYW5zZm9ybVZlbmRvci5yZXBsYWNlKC9UcmFuc2Zvcm0vaSwgJycpO1xuXHRcdFx0dGhpcy52ZW5kb3JOYW1lID0gdGhpcy52ZW5kb3JOYW1lICE9PSAnJyA/ICctJyArIHRoaXMudmVuZG9yTmFtZS50b0xvd2VyQ2FzZSgpICsgJy0nIDogJyc7XG5cdFx0fVxuXG5cdFx0dGhpcy5zdGF0ZS5vcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbjtcblx0fTtcblxuXHQvKipcblx0ICogR2V0IHRvdWNoL2RyYWcgY29vcmRpbmF0cy5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtldmVudH0gLSBtb3VzZWRvd24vdG91Y2hzdGFydCBldmVudFxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSAtIENvbnRhaW5zIFggYW5kIFkgb2YgY3VycmVudCBtb3VzZS90b3VjaCBwb3NpdGlvblxuXHQgKi9cblxuXHRmdW5jdGlvbiBnZXRUb3VjaGVzKGV2ZW50KSB7XG5cdFx0aWYgKGV2ZW50LnRvdWNoZXMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0eDogZXZlbnQudG91Y2hlc1swXS5wYWdlWCxcblx0XHRcdFx0eTogZXZlbnQudG91Y2hlc1swXS5wYWdlWVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoZXZlbnQudG91Y2hlcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRpZiAoZXZlbnQucGFnZVggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHg6IGV2ZW50LnBhZ2VYLFxuXHRcdFx0XHRcdHk6IGV2ZW50LnBhZ2VZXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRpZiAoZXZlbnQucGFnZVggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR4OiBldmVudC5jbGllbnRYLFxuXHRcdFx0XHRcdHk6IGV2ZW50LmNsaWVudFlcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGZvciBDU1Mgc3VwcG9ydC5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgLSBUaGUgQ1NTIHByb3BlcnRpZXMgdG8gY2hlY2sgZm9yLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IC0gQ29udGFpbnMgdGhlIHN1cHBvcnRlZCBDU1MgcHJvcGVydHkgbmFtZSBhbmQgaXRzIGluZGV4IG9yIGBmYWxzZWAuXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N0eWxlU3VwcG9ydGVkKGFycmF5KSB7XG5cdFx0dmFyIHAsIHMsIGZha2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgbGlzdCA9IGFycmF5O1xuXHRcdGZvciAocCBpbiBsaXN0KSB7XG5cdFx0XHRzID0gbGlzdFtwXTtcblx0XHRcdGlmICh0eXBlb2YgZmFrZS5zdHlsZVtzXSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0ZmFrZSA9IG51bGw7XG5cdFx0XHRcdHJldHVybiBbIHMsIHAgXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIFsgZmFsc2UgXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgZm9yIENTUyB0cmFuc2l0aW9uIHN1cHBvcnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0b2RvIFJlYWx5IGJhZCBkZXNpZ25cblx0ICogQHJldHVybnMge051bWJlcn1cblx0ICovXG5cdGZ1bmN0aW9uIGlzVHJhbnNpdGlvbigpIHtcblx0XHRyZXR1cm4gaXNTdHlsZVN1cHBvcnRlZChbICd0cmFuc2l0aW9uJywgJ1dlYmtpdFRyYW5zaXRpb24nLCAnTW96VHJhbnNpdGlvbicsICdPVHJhbnNpdGlvbicgXSlbMV07XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGZvciBDU1MgdHJhbnNmb3JtIHN1cHBvcnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBzdXBwb3J0ZWQgcHJvcGVydHkgbmFtZSBvciBmYWxzZS5cblx0ICovXG5cdGZ1bmN0aW9uIGlzVHJhbnNmb3JtKCkge1xuXHRcdHJldHVybiBpc1N0eWxlU3VwcG9ydGVkKFsgJ3RyYW5zZm9ybScsICdXZWJraXRUcmFuc2Zvcm0nLCAnTW96VHJhbnNmb3JtJywgJ09UcmFuc2Zvcm0nLCAnbXNUcmFuc2Zvcm0nIF0pWzBdO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBmb3IgQ1NTIHBlcnNwZWN0aXZlIHN1cHBvcnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBzdXBwb3J0ZWQgcHJvcGVydHkgbmFtZSBvciBmYWxzZS5cblx0ICovXG5cdGZ1bmN0aW9uIGlzUGVyc3BlY3RpdmUoKSB7XG5cdFx0cmV0dXJuIGlzU3R5bGVTdXBwb3J0ZWQoWyAncGVyc3BlY3RpdmUnLCAnd2Via2l0UGVyc3BlY3RpdmUnLCAnTW96UGVyc3BlY3RpdmUnLCAnT1BlcnNwZWN0aXZlJywgJ01zUGVyc3BlY3RpdmUnIF0pWzBdO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyB3ZXRoZXIgdG91Y2ggaXMgc3VwcG9ydGVkIG9yIG5vdC5cblx0ICogQHByaXZhdGVcblx0ICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAqL1xuXHRmdW5jdGlvbiBpc1RvdWNoU3VwcG9ydCgpIHtcblx0XHRyZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8ICEhKG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3Mgd2V0aGVyIHRvdWNoIGlzIHN1cHBvcnRlZCBvciBub3QgZm9yIElFLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICovXG5cdGZ1bmN0aW9uIGlzVG91Y2hTdXBwb3J0SUUoKSB7XG5cdFx0cmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgalF1ZXJ5IFBsdWdpbiBmb3IgdGhlIE93bCBDYXJvdXNlbFxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHQkLmZuLm93bENhcm91c2VsID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoISQodGhpcykuZGF0YSgnb3dsQ2Fyb3VzZWwnKSkge1xuXHRcdFx0XHQkKHRoaXMpLmRhdGEoJ293bENhcm91c2VsJywgbmV3IE93bCh0aGlzLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFRoZSBjb25zdHJ1Y3RvciBmb3IgdGhlIGpRdWVyeSBQbHVnaW5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0JC5mbi5vd2xDYXJvdXNlbC5Db25zdHJ1Y3RvciA9IE93bDtcblxufSkod2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuXG4vKipcbiAqIExhenkgUGx1Z2luXG4gKiBAdmVyc2lvbiAyLjAuMFxuICogQGF1dGhvciBCYXJ0b3N6IFdvamNpZWNob3dza2lcbiAqIEBsaWNlbnNlIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICovXG47KGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBsYXp5IHBsdWdpbi5cblx0ICogQGNsYXNzIFRoZSBMYXp5IFBsdWdpblxuXHQgKiBAcGFyYW0ge093bH0gY2Fyb3VzZWwgLSBUaGUgT3dsIENhcm91c2VsXG5cdCAqL1xuXHR2YXIgTGF6eSA9IGZ1bmN0aW9uKGNhcm91c2VsKSB7XG5cblx0XHQvKipcblx0XHQgKiBSZWZlcmVuY2UgdG8gdGhlIGNvcmUuXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqIEB0eXBlIHtPd2x9XG5cdFx0ICovXG5cdFx0dGhpcy5fY29yZSA9IGNhcm91c2VsO1xuXG5cdFx0LyoqXG5cdFx0ICogQWxyZWFkeSBsb2FkZWQgaXRlbXMuXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqIEB0eXBlIHtBcnJheS48alF1ZXJ5Pn1cblx0XHQgKi9cblx0XHR0aGlzLl9sb2FkZWQgPSBbXTtcblxuXHRcdC8qKlxuXHRcdCAqIEV2ZW50IGhhbmRsZXJzLlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdHRoaXMuX2hhbmRsZXJzID0ge1xuXHRcdFx0J2luaXRpYWxpemVkLm93bC5jYXJvdXNlbCBjaGFuZ2Uub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmICghZS5uYW1lc3BhY2UpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIXRoaXMuX2NvcmUuc2V0dGluZ3MgfHwgIXRoaXMuX2NvcmUuc2V0dGluZ3MubGF6eUxvYWQpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoKGUucHJvcGVydHkgJiYgZS5wcm9wZXJ0eS5uYW1lID09ICdwb3NpdGlvbicpIHx8IGUudHlwZSA9PSAnaW5pdGlhbGl6ZWQnKSB7XG5cdFx0XHRcdFx0dmFyIHNldHRpbmdzID0gdGhpcy5fY29yZS5zZXR0aW5ncyxcblx0XHRcdFx0XHRcdG4gPSAoc2V0dGluZ3MuY2VudGVyICYmIE1hdGguY2VpbChzZXR0aW5ncy5pdGVtcyAvIDIpIHx8IHNldHRpbmdzLml0ZW1zKSxcblx0XHRcdFx0XHRcdGkgPSAoKHNldHRpbmdzLmNlbnRlciAmJiBuICogLTEpIHx8IDApLFxuXHRcdFx0XHRcdFx0cG9zaXRpb24gPSAoKGUucHJvcGVydHkgJiYgZS5wcm9wZXJ0eS52YWx1ZSkgfHwgdGhpcy5fY29yZS5jdXJyZW50KCkpICsgaSxcblx0XHRcdFx0XHRcdGNsb25lcyA9IHRoaXMuX2NvcmUuY2xvbmVzKCkubGVuZ3RoLFxuXHRcdFx0XHRcdFx0bG9hZCA9ICQucHJveHkoZnVuY3Rpb24oaSwgdikgeyB0aGlzLmxvYWQodikgfSwgdGhpcyk7XG5cblx0XHRcdFx0XHR3aGlsZSAoaSsrIDwgbikge1xuXHRcdFx0XHRcdFx0dGhpcy5sb2FkKGNsb25lcyAvIDIgKyB0aGlzLl9jb3JlLnJlbGF0aXZlKHBvc2l0aW9uKSk7XG5cdFx0XHRcdFx0XHRjbG9uZXMgJiYgJC5lYWNoKHRoaXMuX2NvcmUuY2xvbmVzKHRoaXMuX2NvcmUucmVsYXRpdmUocG9zaXRpb24rKykpLCBsb2FkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpXG5cdFx0fTtcblxuXHRcdC8vIHNldCB0aGUgZGVmYXVsdCBvcHRpb25zXG5cdFx0dGhpcy5fY29yZS5vcHRpb25zID0gJC5leHRlbmQoe30sIExhenkuRGVmYXVsdHMsIHRoaXMuX2NvcmUub3B0aW9ucyk7XG5cblx0XHQvLyByZWdpc3RlciBldmVudCBoYW5kbGVyXG5cdFx0dGhpcy5fY29yZS4kZWxlbWVudC5vbih0aGlzLl9oYW5kbGVycyk7XG5cdH1cblxuXHQvKipcblx0ICogRGVmYXVsdCBvcHRpb25zLlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRMYXp5LkRlZmF1bHRzID0ge1xuXHRcdGxhenlMb2FkOiBmYWxzZVxuXHR9XG5cblx0LyoqXG5cdCAqIExvYWRzIGFsbCByZXNvdXJjZXMgb2YgYW4gaXRlbSBhdCB0aGUgc3BlY2lmaWVkIHBvc2l0aW9uLlxuXHQgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gLSBUaGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIGl0ZW0uXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICovXG5cdExhenkucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbihwb3NpdGlvbikge1xuXHRcdHZhciAkaXRlbSA9IHRoaXMuX2NvcmUuJHN0YWdlLmNoaWxkcmVuKCkuZXEocG9zaXRpb24pLFxuXHRcdFx0JGVsZW1lbnRzID0gJGl0ZW0gJiYgJGl0ZW0uZmluZCgnLm93bC1sYXp5Jyk7XG5cblx0XHRpZiAoISRlbGVtZW50cyB8fCAkLmluQXJyYXkoJGl0ZW0uZ2V0KDApLCB0aGlzLl9sb2FkZWQpID4gLTEpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkZWxlbWVudHMuZWFjaCgkLnByb3h5KGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG5cdFx0XHR2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpLCBpbWFnZSxcblx0XHRcdFx0dXJsID0gKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID4gMSAmJiAkZWxlbWVudC5hdHRyKCdkYXRhLXNyYy1yZXRpbmEnKSkgfHwgJGVsZW1lbnQuYXR0cignZGF0YS1zcmMnKTtcblxuXHRcdFx0dGhpcy5fY29yZS50cmlnZ2VyKCdsb2FkJywgeyBlbGVtZW50OiAkZWxlbWVudCwgdXJsOiB1cmwgfSwgJ2xhenknKTtcblxuXHRcdFx0aWYgKCRlbGVtZW50LmlzKCdpbWcnKSkge1xuXHRcdFx0XHQkZWxlbWVudC5vbmUoJ2xvYWQub3dsLmxhenknLCAkLnByb3h5KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRlbGVtZW50LmNzcygnb3BhY2l0eScsIDEpO1xuXHRcdFx0XHRcdHRoaXMuX2NvcmUudHJpZ2dlcignbG9hZGVkJywgeyBlbGVtZW50OiAkZWxlbWVudCwgdXJsOiB1cmwgfSwgJ2xhenknKTtcblx0XHRcdFx0fSwgdGhpcykpLmF0dHIoJ3NyYycsIHVybCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0XHRpbWFnZS5vbmxvYWQgPSAkLnByb3h5KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRlbGVtZW50LmNzcyh7XG5cdFx0XHRcdFx0XHQnYmFja2dyb3VuZC1pbWFnZSc6ICd1cmwoJyArIHVybCArICcpJyxcblx0XHRcdFx0XHRcdCdvcGFjaXR5JzogJzEnXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5fY29yZS50cmlnZ2VyKCdsb2FkZWQnLCB7IGVsZW1lbnQ6ICRlbGVtZW50LCB1cmw6IHVybCB9LCAnbGF6eScpO1xuXHRcdFx0XHR9LCB0aGlzKTtcblx0XHRcdFx0aW1hZ2Uuc3JjID0gdXJsO1xuXHRcdFx0fVxuXHRcdH0sIHRoaXMpKTtcblxuXHRcdHRoaXMuX2xvYWRlZC5wdXNoKCRpdGVtLmdldCgwKSk7XG5cdH1cblxuXHQvKipcblx0ICogRGVzdHJveXMgdGhlIHBsdWdpbi5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0TGF6eS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBoYW5kbGVyLCBwcm9wZXJ0eTtcblxuXHRcdGZvciAoaGFuZGxlciBpbiB0aGlzLmhhbmRsZXJzKSB7XG5cdFx0XHR0aGlzLl9jb3JlLiRlbGVtZW50Lm9mZihoYW5kbGVyLCB0aGlzLmhhbmRsZXJzW2hhbmRsZXJdKTtcblx0XHR9XG5cdFx0Zm9yIChwcm9wZXJ0eSBpbiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzKSkge1xuXHRcdFx0dHlwZW9mIHRoaXNbcHJvcGVydHldICE9ICdmdW5jdGlvbicgJiYgKHRoaXNbcHJvcGVydHldID0gbnVsbCk7XG5cdFx0fVxuXHR9XG5cblx0JC5mbi5vd2xDYXJvdXNlbC5Db25zdHJ1Y3Rvci5QbHVnaW5zLkxhenkgPSBMYXp5O1xuXG59KSh3aW5kb3cuWmVwdG8gfHwgd2luZG93LmpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG5cbi8qKlxuICogQXV0b0hlaWdodCBQbHVnaW5cbiAqIEB2ZXJzaW9uIDIuMC4wXG4gKiBAYXV0aG9yIEJhcnRvc3ogV29qY2llY2hvd3NraVxuICogQGxpY2Vuc2UgVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKi9cbjsoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgdGhlIGF1dG8gaGVpZ2h0IHBsdWdpbi5cblx0ICogQGNsYXNzIFRoZSBBdXRvIEhlaWdodCBQbHVnaW5cblx0ICogQHBhcmFtIHtPd2x9IGNhcm91c2VsIC0gVGhlIE93bCBDYXJvdXNlbFxuXHQgKi9cblx0dmFyIEF1dG9IZWlnaHQgPSBmdW5jdGlvbihjYXJvdXNlbCkge1xuXHRcdC8qKlxuXHRcdCAqIFJlZmVyZW5jZSB0byB0aGUgY29yZS5cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICogQHR5cGUge093bH1cblx0XHQgKi9cblx0XHR0aGlzLl9jb3JlID0gY2Fyb3VzZWw7XG5cblx0XHQvKipcblx0XHQgKiBBbGwgZXZlbnQgaGFuZGxlcnMuXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0dGhpcy5faGFuZGxlcnMgPSB7XG5cdFx0XHQnaW5pdGlhbGl6ZWQub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKHRoaXMuX2NvcmUuc2V0dGluZ3MuYXV0b0hlaWdodCkge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpLFxuXHRcdFx0J2NoYW5nZWQub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9jb3JlLnNldHRpbmdzLmF1dG9IZWlnaHQgJiYgZS5wcm9wZXJ0eS5uYW1lID09ICdwb3NpdGlvbicpe1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpLFxuXHRcdFx0J2xvYWRlZC5vd2wubGF6eSc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAodGhpcy5fY29yZS5zZXR0aW5ncy5hdXRvSGVpZ2h0ICYmIGUuZWxlbWVudC5jbG9zZXN0KCcuJyArIHRoaXMuX2NvcmUuc2V0dGluZ3MuaXRlbUNsYXNzKVxuXHRcdFx0XHRcdD09PSB0aGlzLl9jb3JlLiRzdGFnZS5jaGlsZHJlbigpLmVxKHRoaXMuX2NvcmUuY3VycmVudCgpKSkge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpXG5cdFx0fTtcblxuXHRcdC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcblx0XHR0aGlzLl9jb3JlLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQXV0b0hlaWdodC5EZWZhdWx0cywgdGhpcy5fY29yZS5vcHRpb25zKTtcblxuXHRcdC8vIHJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJzXG5cdFx0dGhpcy5fY29yZS4kZWxlbWVudC5vbih0aGlzLl9oYW5kbGVycyk7XG5cdH07XG5cblx0LyoqXG5cdCAqIERlZmF1bHQgb3B0aW9ucy5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QXV0b0hlaWdodC5EZWZhdWx0cyA9IHtcblx0XHRhdXRvSGVpZ2h0OiBmYWxzZSxcblx0XHRhdXRvSGVpZ2h0Q2xhc3M6ICdvd2wtaGVpZ2h0J1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSB2aWV3LlxuXHQgKi9cblx0QXV0b0hlaWdodC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fY29yZS4kc3RhZ2UucGFyZW50KClcblx0XHRcdC5oZWlnaHQodGhpcy5fY29yZS4kc3RhZ2UuY2hpbGRyZW4oKS5lcSh0aGlzLl9jb3JlLmN1cnJlbnQoKSkuaGVpZ2h0KCkpXG5cdFx0XHQuYWRkQ2xhc3ModGhpcy5fY29yZS5zZXR0aW5ncy5hdXRvSGVpZ2h0Q2xhc3MpO1xuXHR9O1xuXG5cdEF1dG9IZWlnaHQucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgaGFuZGxlciwgcHJvcGVydHk7XG5cblx0XHRmb3IgKGhhbmRsZXIgaW4gdGhpcy5faGFuZGxlcnMpIHtcblx0XHRcdHRoaXMuX2NvcmUuJGVsZW1lbnQub2ZmKGhhbmRsZXIsIHRoaXMuX2hhbmRsZXJzW2hhbmRsZXJdKTtcblx0XHR9XG5cdFx0Zm9yIChwcm9wZXJ0eSBpbiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzKSkge1xuXHRcdFx0dHlwZW9mIHRoaXNbcHJvcGVydHldICE9ICdmdW5jdGlvbicgJiYgKHRoaXNbcHJvcGVydHldID0gbnVsbCk7XG5cdFx0fVxuXHR9O1xuXG5cdCQuZm4ub3dsQ2Fyb3VzZWwuQ29uc3RydWN0b3IuUGx1Z2lucy5BdXRvSGVpZ2h0ID0gQXV0b0hlaWdodDtcblxufSkod2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuXG4vKipcbiAqIFZpZGVvIFBsdWdpblxuICogQHZlcnNpb24gMi4wLjBcbiAqIEBhdXRob3IgQmFydG9zeiBXb2pjaWVjaG93c2tpXG4gKiBAbGljZW5zZSBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqL1xuOyhmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcblxuXHQvKipcblx0ICogQ3JlYXRlcyB0aGUgdmlkZW8gcGx1Z2luLlxuXHQgKiBAY2xhc3MgVGhlIFZpZGVvIFBsdWdpblxuXHQgKiBAcGFyYW0ge093bH0gY2Fyb3VzZWwgLSBUaGUgT3dsIENhcm91c2VsXG5cdCAqL1xuXHR2YXIgVmlkZW8gPSBmdW5jdGlvbihjYXJvdXNlbCkge1xuXHRcdC8qKlxuXHRcdCAqIFJlZmVyZW5jZSB0byB0aGUgY29yZS5cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICogQHR5cGUge093bH1cblx0XHQgKi9cblx0XHR0aGlzLl9jb3JlID0gY2Fyb3VzZWw7XG5cblx0XHQvKipcblx0XHQgKiBDYWNoZSBhbGwgdmlkZW8gVVJMcy5cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cblx0XHR0aGlzLl92aWRlb3MgPSB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIEN1cnJlbnQgcGxheWluZyBpdGVtLlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKiBAdHlwZSB7alF1ZXJ5fVxuXHRcdCAqL1xuXHRcdHRoaXMuX3BsYXlpbmcgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogV2hldGhlciB0aGlzIGlzIGluIGZ1bGxzY3JlZW4gb3Igbm90LlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKiBAdHlwZSB7Qm9vbGVhbn1cblx0XHQgKi9cblx0XHR0aGlzLl9mdWxsc2NyZWVuID0gZmFsc2U7XG5cblx0XHQvKipcblx0XHQgKiBBbGwgZXZlbnQgaGFuZGxlcnMuXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0dGhpcy5faGFuZGxlcnMgPSB7XG5cdFx0XHQncmVzaXplLm93bC5jYXJvdXNlbCc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAodGhpcy5fY29yZS5zZXR0aW5ncy52aWRlbyAmJiAhdGhpcy5pc0luRnVsbFNjcmVlbigpKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aGlzKSxcblx0XHRcdCdyZWZyZXNoLm93bC5jYXJvdXNlbCBjaGFuZ2VkLm93bC5jYXJvdXNlbCc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAodGhpcy5fcGxheWluZykge1xuXHRcdFx0XHRcdHRoaXMuc3RvcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aGlzKSxcblx0XHRcdCdwcmVwYXJlZC5vd2wuY2Fyb3VzZWwnOiAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0dmFyICRlbGVtZW50ID0gJChlLmNvbnRlbnQpLmZpbmQoJy5vd2wtdmlkZW8nKTtcblx0XHRcdFx0aWYgKCRlbGVtZW50Lmxlbmd0aCkge1xuXHRcdFx0XHRcdCRlbGVtZW50LmNzcygnZGlzcGxheScsICdub25lJyk7XG5cdFx0XHRcdFx0dGhpcy5mZXRjaCgkZWxlbWVudCwgJChlLmNvbnRlbnQpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGhpcylcblx0XHR9O1xuXG5cdFx0Ly8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuXHRcdHRoaXMuX2NvcmUub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBWaWRlby5EZWZhdWx0cywgdGhpcy5fY29yZS5vcHRpb25zKTtcblxuXHRcdC8vIHJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJzXG5cdFx0dGhpcy5fY29yZS4kZWxlbWVudC5vbih0aGlzLl9oYW5kbGVycyk7XG5cblx0XHR0aGlzLl9jb3JlLiRlbGVtZW50Lm9uKCdjbGljay5vd2wudmlkZW8nLCAnLm93bC12aWRlby1wbGF5LWljb24nLCAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcblx0XHRcdHRoaXMucGxheShlKTtcblx0XHR9LCB0aGlzKSk7XG5cdH07XG5cblx0LyoqXG5cdCAqIERlZmF1bHQgb3B0aW9ucy5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0VmlkZW8uRGVmYXVsdHMgPSB7XG5cdFx0dmlkZW86IGZhbHNlLFxuXHRcdHZpZGVvSGVpZ2h0OiBmYWxzZSxcblx0XHR2aWRlb1dpZHRoOiBmYWxzZVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSB2aWRlbyBJRCBhbmQgdGhlIHR5cGUgKFlvdVR1YmUvVmltZW8gb25seSkuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQHBhcmFtIHtqUXVlcnl9IHRhcmdldCAtIFRoZSB0YXJnZXQgY29udGFpbmluZyB0aGUgdmlkZW8gZGF0YS5cblx0ICogQHBhcmFtIHtqUXVlcnl9IGl0ZW0gLSBUaGUgaXRlbSBjb250YWluaW5nIHRoZSB2aWRlby5cblx0ICovXG5cdFZpZGVvLnByb3RvdHlwZS5mZXRjaCA9IGZ1bmN0aW9uKHRhcmdldCwgaXRlbSkge1xuXG5cdFx0dmFyIHR5cGUgPSB0YXJnZXQuYXR0cignZGF0YS12aW1lby1pZCcpID8gJ3ZpbWVvJyA6ICd5b3V0dWJlJyxcblx0XHRcdGlkID0gdGFyZ2V0LmF0dHIoJ2RhdGEtdmltZW8taWQnKSB8fCB0YXJnZXQuYXR0cignZGF0YS15b3V0dWJlLWlkJyksXG5cdFx0XHR3aWR0aCA9IHRhcmdldC5hdHRyKCdkYXRhLXdpZHRoJykgfHwgdGhpcy5fY29yZS5zZXR0aW5ncy52aWRlb1dpZHRoLFxuXHRcdFx0aGVpZ2h0ID0gdGFyZ2V0LmF0dHIoJ2RhdGEtaGVpZ2h0JykgfHwgdGhpcy5fY29yZS5zZXR0aW5ncy52aWRlb0hlaWdodCxcblx0XHRcdHVybCA9IHRhcmdldC5hdHRyKCdocmVmJyk7XG5cblx0XHRpZiAodXJsKSB7XG5cdFx0XHRpZCA9IHVybC5tYXRjaCgvKGh0dHA6fGh0dHBzOnwpXFwvXFwvKHBsYXllci58d3d3Lik/KHZpbWVvXFwuY29tfHlvdXR1KGJlXFwuY29tfFxcLmJlfGJlXFwuZ29vZ2xlYXBpc1xcLmNvbSkpXFwvKHZpZGVvXFwvfGVtYmVkXFwvfHdhdGNoXFw/dj18dlxcLyk/KFtBLVphLXowLTkuXyUtXSopKFxcJlxcUyspPy8pO1xuXG5cdFx0XHRpZiAoaWRbM10uaW5kZXhPZigneW91dHUnKSA+IC0xKSB7XG5cdFx0XHRcdHR5cGUgPSAneW91dHViZSc7XG5cdFx0XHR9IGVsc2UgaWYgKGlkWzNdLmluZGV4T2YoJ3ZpbWVvJykgPiAtMSkge1xuXHRcdFx0XHR0eXBlID0gJ3ZpbWVvJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignVmlkZW8gVVJMIG5vdCBzdXBwb3J0ZWQuJyk7XG5cdFx0XHR9XG5cdFx0XHRpZCA9IGlkWzZdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgdmlkZW8gVVJMLicpO1xuXHRcdH1cblxuXHRcdHRoaXMuX3ZpZGVvc1t1cmxdID0ge1xuXHRcdFx0dHlwZTogdHlwZSxcblx0XHRcdGlkOiBpZCxcblx0XHRcdHdpZHRoOiB3aWR0aCxcblx0XHRcdGhlaWdodDogaGVpZ2h0XG5cdFx0fTtcblxuXHRcdGl0ZW0uYXR0cignZGF0YS12aWRlbycsIHVybCk7XG5cblx0XHR0aGlzLnRodW1ibmFpbCh0YXJnZXQsIHRoaXMuX3ZpZGVvc1t1cmxdKTtcblx0fTtcblxuXHQvKipcblx0ICogQ3JlYXRlcyB2aWRlbyB0aHVtYm5haWwuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQHBhcmFtIHtqUXVlcnl9IHRhcmdldCAtIFRoZSB0YXJnZXQgY29udGFpbmluZyB0aGUgdmlkZW8gZGF0YS5cblx0ICogQHBhcmFtIHtPYmplY3R9IGluZm8gLSBUaGUgdmlkZW8gaW5mbyBvYmplY3QuXG5cdCAqIEBzZWUgYGZldGNoYFxuXHQgKi9cblx0VmlkZW8ucHJvdG90eXBlLnRodW1ibmFpbCA9IGZ1bmN0aW9uKHRhcmdldCwgdmlkZW8pIHtcblxuXHRcdHZhciB0bkxpbmssXG5cdFx0XHRpY29uLFxuXHRcdFx0cGF0aCxcblx0XHRcdGRpbWVuc2lvbnMgPSB2aWRlby53aWR0aCAmJiB2aWRlby5oZWlnaHQgPyAnc3R5bGU9XCJ3aWR0aDonICsgdmlkZW8ud2lkdGggKyAncHg7aGVpZ2h0OicgKyB2aWRlby5oZWlnaHQgKyAncHg7XCInIDogJycsXG5cdFx0XHRjdXN0b21UbiA9IHRhcmdldC5maW5kKCdpbWcnKSxcblx0XHRcdHNyY1R5cGUgPSAnc3JjJyxcblx0XHRcdGxhenlDbGFzcyA9ICcnLFxuXHRcdFx0c2V0dGluZ3MgPSB0aGlzLl9jb3JlLnNldHRpbmdzLFxuXHRcdFx0Y3JlYXRlID0gZnVuY3Rpb24ocGF0aCkge1xuXHRcdFx0XHRpY29uID0gJzxkaXYgY2xhc3M9XCJvd2wtdmlkZW8tcGxheS1pY29uXCI+PC9kaXY+JztcblxuXHRcdFx0XHRpZiAoc2V0dGluZ3MubGF6eUxvYWQpIHtcblx0XHRcdFx0XHR0bkxpbmsgPSAnPGRpdiBjbGFzcz1cIm93bC12aWRlby10biAnICsgbGF6eUNsYXNzICsgJ1wiICcgKyBzcmNUeXBlICsgJz1cIicgKyBwYXRoICsgJ1wiPjwvZGl2Pic7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dG5MaW5rID0gJzxkaXYgY2xhc3M9XCJvd2wtdmlkZW8tdG5cIiBzdHlsZT1cIm9wYWNpdHk6MTtiYWNrZ3JvdW5kLWltYWdlOnVybCgnICsgcGF0aCArICcpXCI+PC9kaXY+Jztcblx0XHRcdFx0fVxuXHRcdFx0XHR0YXJnZXQuYWZ0ZXIodG5MaW5rKTtcblx0XHRcdFx0dGFyZ2V0LmFmdGVyKGljb24pO1xuXHRcdFx0fTtcblxuXHRcdC8vIHdyYXAgdmlkZW8gY29udGVudCBpbnRvIG93bC12aWRlby13cmFwcGVyIGRpdlxuXHRcdHRhcmdldC53cmFwKCc8ZGl2IGNsYXNzPVwib3dsLXZpZGVvLXdyYXBwZXJcIicgKyBkaW1lbnNpb25zICsgJz48L2Rpdj4nKTtcblxuXHRcdGlmICh0aGlzLl9jb3JlLnNldHRpbmdzLmxhenlMb2FkKSB7XG5cdFx0XHRzcmNUeXBlID0gJ2RhdGEtc3JjJztcblx0XHRcdGxhenlDbGFzcyA9ICdvd2wtbGF6eSc7XG5cdFx0fVxuXG5cdFx0Ly8gY3VzdG9tIHRodW1ibmFpbFxuXHRcdGlmIChjdXN0b21Ubi5sZW5ndGgpIHtcblx0XHRcdGNyZWF0ZShjdXN0b21Ubi5hdHRyKHNyY1R5cGUpKTtcblx0XHRcdGN1c3RvbVRuLnJlbW92ZSgpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmICh2aWRlby50eXBlID09PSAneW91dHViZScpIHtcblx0XHRcdHBhdGggPSBcImh0dHA6Ly9pbWcueW91dHViZS5jb20vdmkvXCIgKyB2aWRlby5pZCArIFwiL2hxZGVmYXVsdC5qcGdcIjtcblx0XHRcdGNyZWF0ZShwYXRoKTtcblx0XHR9IGVsc2UgaWYgKHZpZGVvLnR5cGUgPT09ICd2aW1lbycpIHtcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHR5cGU6ICdHRVQnLFxuXHRcdFx0XHR1cmw6ICdodHRwOi8vdmltZW8uY29tL2FwaS92Mi92aWRlby8nICsgdmlkZW8uaWQgKyAnLmpzb24nLFxuXHRcdFx0XHRqc29ucDogJ2NhbGxiYWNrJyxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29ucCcsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRwYXRoID0gZGF0YVswXS50aHVtYm5haWxfbGFyZ2U7XG5cdFx0XHRcdFx0Y3JlYXRlKHBhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIFN0b3BzIHRoZSBjdXJyZW50IHZpZGVvLlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRWaWRlby5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2NvcmUudHJpZ2dlcignc3RvcCcsIG51bGwsICd2aWRlbycpO1xuXHRcdHRoaXMuX3BsYXlpbmcuZmluZCgnLm93bC12aWRlby1mcmFtZScpLnJlbW92ZSgpO1xuXHRcdHRoaXMuX3BsYXlpbmcucmVtb3ZlQ2xhc3MoJ293bC12aWRlby1wbGF5aW5nJyk7XG5cdFx0dGhpcy5fcGxheWluZyA9IG51bGw7XG5cdH07XG5cblx0LyoqXG5cdCAqIFN0YXJ0cyB0aGUgY3VycmVudCB2aWRlby5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge0V2ZW50fSBldiAtIFRoZSBldmVudCBhcmd1bWVudHMuXG5cdCAqL1xuXHRWaWRlby5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKGV2KSB7XG5cdFx0dGhpcy5fY29yZS50cmlnZ2VyKCdwbGF5JywgbnVsbCwgJ3ZpZGVvJyk7XG5cblx0XHRpZiAodGhpcy5fcGxheWluZykge1xuXHRcdFx0dGhpcy5zdG9wKCk7XG5cdFx0fVxuXG5cdFx0dmFyIHRhcmdldCA9ICQoZXYudGFyZ2V0IHx8IGV2LnNyY0VsZW1lbnQpLFxuXHRcdFx0aXRlbSA9IHRhcmdldC5jbG9zZXN0KCcuJyArIHRoaXMuX2NvcmUuc2V0dGluZ3MuaXRlbUNsYXNzKSxcblx0XHRcdHZpZGVvID0gdGhpcy5fdmlkZW9zW2l0ZW0uYXR0cignZGF0YS12aWRlbycpXSxcblx0XHRcdHdpZHRoID0gdmlkZW8ud2lkdGggfHwgJzEwMCUnLFxuXHRcdFx0aGVpZ2h0ID0gdmlkZW8uaGVpZ2h0IHx8IHRoaXMuX2NvcmUuJHN0YWdlLmhlaWdodCgpLFxuXHRcdFx0aHRtbCwgd3JhcDtcblxuXHRcdGlmICh2aWRlby50eXBlID09PSAneW91dHViZScpIHtcblx0XHRcdGh0bWwgPSAnPGlmcmFtZSB3aWR0aD1cIicgKyB3aWR0aCArICdcIiBoZWlnaHQ9XCInICsgaGVpZ2h0ICsgJ1wiIHNyYz1cImh0dHA6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJ1xuXHRcdFx0XHQrIHZpZGVvLmlkICsgJz9hdXRvcGxheT0xJnY9JyArIHZpZGVvLmlkICsgJ1wiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nO1xuXHRcdH0gZWxzZSBpZiAodmlkZW8udHlwZSA9PT0gJ3ZpbWVvJykge1xuXHRcdFx0aHRtbCA9ICc8aWZyYW1lIHNyYz1cImh0dHA6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLycgKyB2aWRlby5pZCArICc/YXV0b3BsYXk9MVwiIHdpZHRoPVwiJyArIHdpZHRoXG5cdFx0XHRcdCsgJ1wiIGhlaWdodD1cIicgKyBoZWlnaHRcblx0XHRcdFx0KyAnXCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+Jztcblx0XHR9XG5cblx0XHRpdGVtLmFkZENsYXNzKCdvd2wtdmlkZW8tcGxheWluZycpO1xuXHRcdHRoaXMuX3BsYXlpbmcgPSBpdGVtO1xuXG5cdFx0d3JhcCA9ICQoJzxkaXYgc3R5bGU9XCJoZWlnaHQ6JyArIGhlaWdodCArICdweDsgd2lkdGg6JyArIHdpZHRoICsgJ3B4XCIgY2xhc3M9XCJvd2wtdmlkZW8tZnJhbWVcIj4nXG5cdFx0XHQrIGh0bWwgKyAnPC9kaXY+Jyk7XG5cdFx0dGFyZ2V0LmFmdGVyKHdyYXApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBDaGVja3Mgd2hldGhlciBhbiB2aWRlbyBpcyBjdXJyZW50bHkgaW4gZnVsbCBzY3JlZW4gbW9kZSBvciBub3QuXG5cdCAqIEB0b2RvIEJhZCBzdHlsZSBiZWNhdXNlIGxvb2tzIGxpa2UgYSByZWFkb25seSBtZXRob2QgYnV0IGNoYW5nZXMgbWVtYmVycy5cblx0ICogQHByb3RlY3RlZFxuXHQgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICovXG5cdFZpZGVvLnByb3RvdHlwZS5pc0luRnVsbFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gaWYgVmltZW8gRnVsbHNjcmVlbiBtb2RlXG5cdFx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fCBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudFxuXHRcdFx0fHwgZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQ7XG5cblx0XHRpZiAoZWxlbWVudCAmJiAkKGVsZW1lbnQpLnBhcmVudCgpLmhhc0NsYXNzKCdvd2wtdmlkZW8tZnJhbWUnKSkge1xuXHRcdFx0dGhpcy5fY29yZS5zcGVlZCgwKTtcblx0XHRcdHRoaXMuX2Z1bGxzY3JlZW4gPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmIChlbGVtZW50ICYmIHRoaXMuX2Z1bGxzY3JlZW4gJiYgdGhpcy5fcGxheWluZykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGNvbW1pbmcgYmFjayBmcm9tIGZ1bGxzY3JlZW5cblx0XHRpZiAodGhpcy5fZnVsbHNjcmVlbikge1xuXHRcdFx0dGhpcy5fZnVsbHNjcmVlbiA9IGZhbHNlO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGNoZWNrIGZ1bGwgc2NyZWVuIG1vZGUgYW5kIHdpbmRvdyBvcmllbnRhdGlvblxuXHRcdGlmICh0aGlzLl9wbGF5aW5nKSB7XG5cdFx0XHRpZiAodGhpcy5fY29yZS5zdGF0ZS5vcmllbnRhdGlvbiAhPT0gd2luZG93Lm9yaWVudGF0aW9uKSB7XG5cdFx0XHRcdHRoaXMuX2NvcmUuc3RhdGUub3JpZW50YXRpb24gPSB3aW5kb3cub3JpZW50YXRpb247XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblxuXHQvKipcblx0ICogRGVzdHJveXMgdGhlIHBsdWdpbi5cblx0ICovXG5cdFZpZGVvLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGhhbmRsZXIsIHByb3BlcnR5O1xuXG5cdFx0dGhpcy5fY29yZS4kZWxlbWVudC5vZmYoJ2NsaWNrLm93bC52aWRlbycpO1xuXG5cdFx0Zm9yIChoYW5kbGVyIGluIHRoaXMuX2hhbmRsZXJzKSB7XG5cdFx0XHR0aGlzLl9jb3JlLiRlbGVtZW50Lm9mZihoYW5kbGVyLCB0aGlzLl9oYW5kbGVyc1toYW5kbGVyXSk7XG5cdFx0fVxuXHRcdGZvciAocHJvcGVydHkgaW4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcykpIHtcblx0XHRcdHR5cGVvZiB0aGlzW3Byb3BlcnR5XSAhPSAnZnVuY3Rpb24nICYmICh0aGlzW3Byb3BlcnR5XSA9IG51bGwpO1xuXHRcdH1cblx0fTtcblxuXHQkLmZuLm93bENhcm91c2VsLkNvbnN0cnVjdG9yLlBsdWdpbnMuVmlkZW8gPSBWaWRlbztcblxufSkod2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuXG4vKipcbiAqIEFuaW1hdGUgUGx1Z2luXG4gKiBAdmVyc2lvbiAyLjAuMFxuICogQGF1dGhvciBCYXJ0b3N6IFdvamNpZWNob3dza2lcbiAqIEBsaWNlbnNlIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICovXG47KGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBhbmltYXRlIHBsdWdpbi5cblx0ICogQGNsYXNzIFRoZSBOYXZpZ2F0aW9uIFBsdWdpblxuXHQgKiBAcGFyYW0ge093bH0gc2NvcGUgLSBUaGUgT3dsIENhcm91c2VsXG5cdCAqL1xuXHR2YXIgQW5pbWF0ZSA9IGZ1bmN0aW9uKHNjb3BlKSB7XG5cdFx0dGhpcy5jb3JlID0gc2NvcGU7XG5cdFx0dGhpcy5jb3JlLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQW5pbWF0ZS5EZWZhdWx0cywgdGhpcy5jb3JlLm9wdGlvbnMpO1xuXHRcdHRoaXMuc3dhcHBpbmcgPSB0cnVlO1xuXHRcdHRoaXMucHJldmlvdXMgPSB1bmRlZmluZWQ7XG5cdFx0dGhpcy5uZXh0ID0gdW5kZWZpbmVkO1xuXHRcdHRoaXMucGFnZUFuaW1hdGlvbnMgPSBbXTtcblxuXHRcdHRoaXMuaGFuZGxlcnMgPSB7XG5cdFx0XHQnY2hhbmdlLm93bC5jYXJvdXNlbCc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoZS5wcm9wZXJ0eS5uYW1lID09ICdwb3NpdGlvbicpIHtcblx0XHRcdFx0XHR0aGlzLnByZXZpb3VzID0gdGhpcy5jb3JlLmN1cnJlbnQoKTtcblx0XHRcdFx0XHR0aGlzLm5leHQgPSBlLnByb3BlcnR5LnZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aGlzKSxcblx0XHRcdCdkcmFnLm93bC5jYXJvdXNlbCBkcmFnZ2VkLm93bC5jYXJvdXNlbCB0cmFuc2xhdGVkLm93bC5jYXJvdXNlbCc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHR0aGlzLnN3YXBwaW5nID0gZS50eXBlID09ICd0cmFuc2xhdGVkJztcblx0XHRcdH0sIHRoaXMpLFxuXHRcdFx0J3RyYW5zbGF0ZS5vd2wuY2Fyb3VzZWwnOiAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcblxuXHRcdFx0XHR2YXIgcGFnZUFuaW1hdGlvbkluZGV4ID0gdGhpcy5wYWdlSGFzQW5pbWF0aW9ucyhlLnBhZ2UuaW5kZXgpID8gZS5wYWdlLmluZGV4IDogbnVsbDtcblxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5zd2FwcGluZ1xuXHRcdFx0XHRcdCYmIChcblx0XHRcdFx0XHRcdHRoaXMuY29yZS5vcHRpb25zLmFuaW1hdGVPdXRcblx0XHRcdFx0XHRcdHx8IHRoaXMuY29yZS5vcHRpb25zLmFuaW1hdGVJblxuXHRcdFx0XHRcdFx0fHwgcGFnZUFuaW1hdGlvbkluZGV4XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHR0aGlzLnN3YXAocGFnZUFuaW1hdGlvbkluZGV4KTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGhpcylcblx0XHR9O1xuXG5cdFx0dGhpcy5jb3JlLiRlbGVtZW50Lm9uKHRoaXMuaGFuZGxlcnMpO1xuXHRcdHRoaXMuc2V0dXBQYWdlQW5pbWF0aW9ucygpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBEZWZhdWx0IG9wdGlvbnMuXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEFuaW1hdGUuRGVmYXVsdHMgPSB7XG5cdFx0YW5pbWF0ZU91dDogZmFsc2UsXG5cdFx0YW5pbWF0ZUluOiBmYWxzZVxuXHR9O1xuXG5cdEFuaW1hdGUucHJvdG90eXBlLnBhZ2VIYXNBbmltYXRpb25zID0gZnVuY3Rpb24oaW5kZXgpIHtcblxuXHRcdGlmIChcblx0XHRcdHR5cGVvZiB0aGlzLnBhZ2VBbmltYXRpb25zW2luZGV4XSAhPT0gJ3VuZGVmaW5lZCdcblx0XHRcdCYmICh0eXBlb2YgdGhpcy5wYWdlQW5pbWF0aW9uc1tpbmRleF1bJ2FuaW1hdGVJbiddID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdGhpcy5wYWdlQW5pbWF0aW9uc1tpbmRleF1bJ2FuaW1hdGVPdXQnXSA9PT0gJ3N0cmluZycpXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRBbmltYXRlLnByb3RvdHlwZS5zZXR1cFBhZ2VBbmltYXRpb25zID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMuY29yZS5vcHRpb25zO1xuXG5cdFx0aWYgKG9wdGlvbnMucGFnZUFuaW1hdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICghJC5pc0FycmF5KG9wdGlvbnMucGFnZUFuaW1hdGlvbnMpKSB7XG5cdFx0XHR0aHJvdyBcInBhZ2VBbmltYXRpb25zIHBhc3NlZCBpbiBtdXN0IGJlIGFuIGFycmF5XCI7XG5cdFx0fVxuXG5cdFx0JC5lYWNoKG9wdGlvbnMucGFnZUFuaW1hdGlvbnMsIGZ1bmN0aW9uKGksIHBhZ2VBbmltYXRpb25PcHRpb25zKSB7XG5cdFx0XHR0aGlzLnBhZ2VBbmltYXRpb25zW3BhZ2VBbmltYXRpb25PcHRpb25zLnBhZ2VdID0ge1xuXHRcdFx0XHRhbmltYXRlSW46IHBhZ2VBbmltYXRpb25PcHRpb25zLmFuaW1hdGVJbixcblx0XHRcdFx0YW5pbWF0ZU91dDogcGFnZUFuaW1hdGlvbk9wdGlvbnMuYW5pbWF0ZU91dCxcblx0XHRcdFx0YW5pbWF0aW9uRHVyYXRpb246IHBhZ2VBbmltYXRpb25PcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uXG5cdFx0XHR9XG5cdFx0fS5iaW5kKHRoaXMpKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgdGhlIGFuaW1hdGlvbiBjbGFzc2VzIHdoZW5ldmVyIGFuIHRyYW5zbGF0aW9ucyBzdGFydHMuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQHJldHVybnMge0Jvb2xlYW58dW5kZWZpbmVkfVxuXHQgKi9cblx0QW5pbWF0ZS5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uKHBhZ2VBbmltYXRpb25JbmRleCkge1xuXG5cdFx0aWYgKHRoaXMuY29yZS5zZXR0aW5ncy5pdGVtcyAhPT0gMSB8fCAhdGhpcy5jb3JlLnN1cHBvcnQzZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuY29yZS5zcGVlZCgwKTtcblxuXHRcdHZhciBwYWdlQW5pbWF0aW9uSW5jb21pbmcgPSAkLmlzTnVtZXJpYyhwYWdlQW5pbWF0aW9uSW5kZXgpID8gdGhpcy5wYWdlQW5pbWF0aW9uc1twYWdlQW5pbWF0aW9uSW5kZXhdLmFuaW1hdGVJbiA6IG51bGw7XG5cdFx0dmFyIHBhZ2VBbmltYXRpb25PdXRnb2luZyA9ICQuaXNOdW1lcmljKHBhZ2VBbmltYXRpb25JbmRleCkgPyB0aGlzLnBhZ2VBbmltYXRpb25zW3BhZ2VBbmltYXRpb25JbmRleF0uYW5pbWF0ZU91dCA6IG51bGw7XG5cdFx0dmFyIHBhZ2VBbmltYXRpb25EdXJhdGlvbiA9ICQuaXNOdW1lcmljKHBhZ2VBbmltYXRpb25JbmRleCkgPyB0aGlzLnBhZ2VBbmltYXRpb25zW3BhZ2VBbmltYXRpb25JbmRleF0uYW5pbWF0aW9uRHVyYXRpb24gOiBudWxsO1xuXG5cdFx0dmFyIGxlZnQsXG5cdFx0XHRjbGVhciA9ICQucHJveHkodGhpcy5jbGVhciwgdGhpcyksXG5cdFx0XHRwcmV2aW91cyA9IHRoaXMuY29yZS4kc3RhZ2UuY2hpbGRyZW4oKS5lcSh0aGlzLnByZXZpb3VzKSxcblx0XHRcdG5leHQgPSB0aGlzLmNvcmUuJHN0YWdlLmNoaWxkcmVuKCkuZXEodGhpcy5uZXh0KSxcblx0XHRcdGluY29taW5nID0gcGFnZUFuaW1hdGlvbkluY29taW5nIHx8IHRoaXMuY29yZS5zZXR0aW5ncy5hbmltYXRlSW4sXG5cdFx0XHRvdXRnb2luZyA9IHBhZ2VBbmltYXRpb25PdXRnb2luZyB8fCB0aGlzLmNvcmUuc2V0dGluZ3MuYW5pbWF0ZU91dCxcblx0XHRcdGR1cmF0aW9uID0gcGFnZUFuaW1hdGlvbkR1cmF0aW9uIHx8IHRoaXMuY29yZS5zZXR0aW5ncy5wYWdlQW5pbWF0aW9uRHVyYXRpb247XG5cblx0XHRpZiAodGhpcy5jb3JlLmN1cnJlbnQoKSA9PT0gdGhpcy5wcmV2aW91cykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChvdXRnb2luZykge1xuXHRcdFx0bGVmdCA9IHRoaXMuY29yZS5jb29yZGluYXRlcyh0aGlzLnByZXZpb3VzKSAtIHRoaXMuY29yZS5jb29yZGluYXRlcyh0aGlzLm5leHQpO1xuXHRcdFx0cHJldmlvdXMuY3NzKCB7ICdsZWZ0JzogbGVmdCArICdweCcgfSApXG5cdFx0XHRcdC5hZGRDbGFzcygnYW5pbWF0ZWQgb3dsLWFuaW1hdGVkLW91dCcpXG5cdFx0XHRcdC5hZGRDbGFzcyhvdXRnb2luZylcblx0XHRcdFx0LmNzcyh7XG5cdFx0XHRcdFx0Jy13ZWJraXQtYW5pbWF0aW9uLWR1cmF0aW9uJzogZHVyYXRpb24sXG5cdFx0XHRcdFx0Jy1tb3otYW5pbWF0aW9uLWR1cmF0aW9uJzogICAgZHVyYXRpb24sXG5cdFx0XHRcdFx0Jy1tcy1hbmltYXRpb24tZHVyYXRpb24nOiAgICAgZHVyYXRpb24sXG5cdFx0XHRcdFx0Jy1vLWFuaW1hdGlvbi1kdXJhdGlvbic6ICAgICAgZHVyYXRpb24sXG5cdFx0XHRcdFx0J2FuaW1hdGlvbi1kdXJhdGlvbic6ICAgICAgICAgZHVyYXRpb25cblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uZSgnd2Via2l0QW5pbWF0aW9uRW5kIG1vekFuaW1hdGlvbkVuZCBNU0FuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kIGFuaW1hdGlvbmVuZCcsIGNsZWFyKTtcblx0XHR9XG5cblx0XHRpZiAoaW5jb21pbmcpIHtcblx0XHRcdG5leHQuYWRkQ2xhc3MoJ2FuaW1hdGVkIG93bC1hbmltYXRlZC1pbicpXG5cdFx0XHRcdC5hZGRDbGFzcyhpbmNvbWluZylcblx0XHRcdFx0LmNzcyh7XG5cdFx0XHRcdFx0Jy13ZWJraXQtYW5pbWF0aW9uLWR1cmF0aW9uJzogZHVyYXRpb24sXG5cdFx0XHRcdFx0Jy1tb3otYW5pbWF0aW9uLWR1cmF0aW9uJzogICAgZHVyYXRpb24sXG5cdFx0XHRcdFx0Jy1tcy1hbmltYXRpb24tZHVyYXRpb24nOiAgICAgZHVyYXRpb24sXG5cdFx0XHRcdFx0Jy1vLWFuaW1hdGlvbi1kdXJhdGlvbic6ICAgICAgZHVyYXRpb24sXG5cdFx0XHRcdFx0J2FuaW1hdGlvbi1kdXJhdGlvbic6ICAgICAgICAgZHVyYXRpb25cblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uZSgnd2Via2l0QW5pbWF0aW9uRW5kIG1vekFuaW1hdGlvbkVuZCBNU0FuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kIGFuaW1hdGlvbmVuZCcsIGNsZWFyKTtcblx0XHR9XG5cdH07XG5cblx0QW5pbWF0ZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbihlKSB7XG5cblx0XHR2YXIgcGFnZUFuaW1hdGlvbkNsYXNzZXMgPSBcIlwiO1xuXHRcdHRoaXMucGFnZUFuaW1hdGlvbnMuZm9yRWFjaChmdW5jdGlvbihhbmltYXRpb25PcHRpb25zKXtcblx0XHRcdHBhZ2VBbmltYXRpb25DbGFzc2VzICs9IChhbmltYXRpb25PcHRpb25zLmFuaW1hdGVJbikgPyBhbmltYXRpb25PcHRpb25zLmFuaW1hdGVJbiArICcgJyA6IFwiXCI7XG5cdFx0XHRwYWdlQW5pbWF0aW9uQ2xhc3NlcyArPSAoYW5pbWF0aW9uT3B0aW9ucy5hbmltYXRlT3V0KSA/IGFuaW1hdGlvbk9wdGlvbnMuYW5pbWF0ZU91dCArICcgJzogXCJcIjtcblx0XHR9KTtcblxuXHRcdCQoZS50YXJnZXQpLmNzcyggeyAnbGVmdCc6ICcnIH0gKVxuXHRcdFx0LnJlbW92ZUNsYXNzKCdhbmltYXRlZCBvd2wtYW5pbWF0ZWQtb3V0IG93bC1hbmltYXRlZC1pbicpXG5cdFx0XHQucmVtb3ZlQ2xhc3ModGhpcy5jb3JlLnNldHRpbmdzLmFuaW1hdGVJbilcblx0XHRcdC5yZW1vdmVDbGFzcyh0aGlzLmNvcmUuc2V0dGluZ3MuYW5pbWF0ZU91dClcblx0XHRcdC5yZW1vdmVDbGFzcyhwYWdlQW5pbWF0aW9uQ2xhc3Nlcyk7XG5cdFx0dGhpcy5jb3JlLnRyYW5zaXRpb25FbmQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZXN0cm95cyB0aGUgcGx1Z2luLlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRBbmltYXRlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGhhbmRsZXIsIHByb3BlcnR5O1xuXG5cdFx0Zm9yIChoYW5kbGVyIGluIHRoaXMuaGFuZGxlcnMpIHtcblx0XHRcdHRoaXMuY29yZS4kZWxlbWVudC5vZmYoaGFuZGxlciwgdGhpcy5oYW5kbGVyc1toYW5kbGVyXSk7XG5cdFx0fVxuXHRcdGZvciAocHJvcGVydHkgaW4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcykpIHtcblx0XHRcdHR5cGVvZiB0aGlzW3Byb3BlcnR5XSAhPSAnZnVuY3Rpb24nICYmICh0aGlzW3Byb3BlcnR5XSA9IG51bGwpO1xuXHRcdH1cblx0fTtcblxuXHQkLmZuLm93bENhcm91c2VsLkNvbnN0cnVjdG9yLlBsdWdpbnMuQW5pbWF0ZSA9IEFuaW1hdGU7XG5cbn0pKHdpbmRvdy5aZXB0byB8fCB3aW5kb3cualF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcblxuLyoqXG4gKiBBdXRvcGxheSBQbHVnaW5cbiAqIEB2ZXJzaW9uIDIuMC4wXG4gKiBAYXV0aG9yIEJhcnRvc3ogV29qY2llY2hvd3NraVxuICogQGxpY2Vuc2UgVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKi9cbjsoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgdGhlIGF1dG9wbGF5IHBsdWdpbi5cblx0ICogQGNsYXNzIFRoZSBBdXRvcGxheSBQbHVnaW5cblx0ICogQHBhcmFtIHtPd2x9IHNjb3BlIC0gVGhlIE93bCBDYXJvdXNlbFxuXHQgKi9cblx0dmFyIEF1dG9wbGF5ID0gZnVuY3Rpb24oc2NvcGUpIHtcblx0XHR0aGlzLmNvcmUgPSBzY29wZTtcblx0XHR0aGlzLmNvcmUub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBBdXRvcGxheS5EZWZhdWx0cywgdGhpcy5jb3JlLm9wdGlvbnMpO1xuXG5cdFx0dGhpcy5oYW5kbGVycyA9IHtcblx0XHRcdCd0cmFuc2xhdGVkLm93bC5jYXJvdXNlbCByZWZyZXNoZWQub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5hdXRvcGxheSgpO1xuXHRcdFx0fSwgdGhpcyksXG5cdFx0XHQncGxheS5vd2wuYXV0b3BsYXknOiAkLnByb3h5KGZ1bmN0aW9uKGUsIHQsIHMpIHtcblx0XHRcdFx0dGhpcy5wbGF5KHQsIHMpO1xuXHRcdFx0fSwgdGhpcyksXG5cdFx0XHQnc3RvcC5vd2wuYXV0b3BsYXknOiAkLnByb3h5KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLnN0b3AoKTtcblx0XHRcdH0sIHRoaXMpLFxuXHRcdFx0J21vdXNlb3Zlci5vd2wuYXV0b3BsYXknOiAkLnByb3h5KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAodGhpcy5jb3JlLnNldHRpbmdzLmF1dG9wbGF5SG92ZXJQYXVzZSkge1xuXHRcdFx0XHRcdHRoaXMucGF1c2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGhpcyksXG5cdFx0XHQnbW91c2VsZWF2ZS5vd2wuYXV0b3BsYXknOiAkLnByb3h5KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAodGhpcy5jb3JlLnNldHRpbmdzLmF1dG9wbGF5SG92ZXJQYXVzZSkge1xuXHRcdFx0XHRcdHRoaXMuYXV0b3BsYXkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGhpcylcblx0XHR9O1xuXG5cdFx0dGhpcy5jb3JlLiRlbGVtZW50Lm9uKHRoaXMuaGFuZGxlcnMpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBEZWZhdWx0IG9wdGlvbnMuXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEF1dG9wbGF5LkRlZmF1bHRzID0ge1xuXHRcdGF1dG9wbGF5OiBmYWxzZSxcblx0XHRhdXRvcGxheVRpbWVvdXQ6IDUwMDAsXG5cdFx0YXV0b3BsYXlIb3ZlclBhdXNlOiBmYWxzZSxcblx0XHRhdXRvcGxheVNwZWVkOiBmYWxzZVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqIEB0b2RvIE11c3QgYmUgZG9jdW1lbnRlZC5cblx0ICovXG5cdEF1dG9wbGF5LnByb3RvdHlwZS5hdXRvcGxheSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLmNvcmUuc2V0dGluZ3MuYXV0b3BsYXkgJiYgIXRoaXMuY29yZS5zdGF0ZS52aWRlb1BsYXkpIHtcblx0XHRcdHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuXG5cdFx0XHR0aGlzLmludGVydmFsID0gd2luZG93LnNldEludGVydmFsKCQucHJveHkoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMucGxheSgpO1xuXHRcdFx0fSwgdGhpcyksIHRoaXMuY29yZS5zZXR0aW5ncy5hdXRvcGxheVRpbWVvdXQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIFN0YXJ0cyB0aGUgYXV0b3BsYXkuXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFt0aW1lb3V0XSAtIC4uLlxuXHQgKiBAcGFyYW0ge051bWJlcn0gW3NwZWVkXSAtIC4uLlxuXHQgKiBAcmV0dXJucyB7Qm9vbGVhbnx1bmRlZmluZWR9IC0gLi4uXG5cdCAqIEB0b2RvIE11c3QgYmUgZG9jdW1lbnRlZC5cblx0ICovXG5cdEF1dG9wbGF5LnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24odGltZW91dCwgc3BlZWQpIHtcblx0XHQvLyBpZiB0YWIgaXMgaW5hY3RpdmUgLSBkb2VzbnQgd29yayBpbiA8SUUxMFxuXHRcdGlmIChkb2N1bWVudC5oaWRkZW4gPT09IHRydWUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5jb3JlLnN0YXRlLmlzVG91Y2ggfHwgdGhpcy5jb3JlLnN0YXRlLmlzU2Nyb2xsaW5nXG5cdFx0XHR8fCB0aGlzLmNvcmUuc3RhdGUuaXNTd2lwaW5nIHx8IHRoaXMuY29yZS5zdGF0ZS5pbk1vdGlvbikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNvcmUuc2V0dGluZ3MuYXV0b3BsYXkgPT09IGZhbHNlKSB7XG5cdFx0XHR3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLmNvcmUubmV4dCh0aGlzLmNvcmUuc2V0dGluZ3MuYXV0b3BsYXlTcGVlZCk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFN0b3BzIHRoZSBhdXRvcGxheS5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QXV0b3BsYXkucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcblx0fTtcblxuXHQvKipcblx0ICogUGF1c2VzIHRoZSBhdXRvcGxheS5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QXV0b3BsYXkucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG5cdH07XG5cblx0LyoqXG5cdCAqIERlc3Ryb3lzIHRoZSBwbHVnaW4uXG5cdCAqL1xuXHRBdXRvcGxheS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBoYW5kbGVyLCBwcm9wZXJ0eTtcblxuXHRcdHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuXG5cdFx0Zm9yIChoYW5kbGVyIGluIHRoaXMuaGFuZGxlcnMpIHtcblx0XHRcdHRoaXMuY29yZS4kZWxlbWVudC5vZmYoaGFuZGxlciwgdGhpcy5oYW5kbGVyc1toYW5kbGVyXSk7XG5cdFx0fVxuXHRcdGZvciAocHJvcGVydHkgaW4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcykpIHtcblx0XHRcdHR5cGVvZiB0aGlzW3Byb3BlcnR5XSAhPSAnZnVuY3Rpb24nICYmICh0aGlzW3Byb3BlcnR5XSA9IG51bGwpO1xuXHRcdH1cblx0fTtcblxuXHQkLmZuLm93bENhcm91c2VsLkNvbnN0cnVjdG9yLlBsdWdpbnMuYXV0b3BsYXkgPSBBdXRvcGxheTtcblxufSkod2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuXG4vKipcbiAqIE5hdmlnYXRpb24gUGx1Z2luXG4gKiBAdmVyc2lvbiAyLjAuMFxuICogQGF1dGhvciBBcnR1cyBLb2xhbm93c2tpXG4gKiBAbGljZW5zZSBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqL1xuOyhmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBuYXZpZ2F0aW9uIHBsdWdpbi5cblx0ICogQGNsYXNzIFRoZSBOYXZpZ2F0aW9uIFBsdWdpblxuXHQgKiBAcGFyYW0ge093bH0gY2Fyb3VzZWwgLSBUaGUgT3dsIENhcm91c2VsLlxuXHQgKi9cblx0dmFyIE5hdmlnYXRpb24gPSBmdW5jdGlvbihjYXJvdXNlbCkge1xuXHRcdC8qKlxuXHRcdCAqIFJlZmVyZW5jZSB0byB0aGUgY29yZS5cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICogQHR5cGUge093bH1cblx0XHQgKi9cblx0XHR0aGlzLl9jb3JlID0gY2Fyb3VzZWw7XG5cblx0XHQvKipcblx0XHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgcGx1Z2luIGlzIGluaXRpYWxpemVkIG9yIG5vdC5cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICogQHR5cGUge0Jvb2xlYW59XG5cdFx0ICovXG5cdFx0dGhpcy5faW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBjdXJyZW50IHBhZ2luZyBpbmRleGVzLlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKiBAdHlwZSB7QXJyYXl9XG5cdFx0ICovXG5cdFx0dGhpcy5fcGFnZXMgPSBbXTtcblxuXHRcdC8qKlxuXHRcdCAqIEFsbCBET00gZWxlbWVudHMgb2YgdGhlIHVzZXIgaW50ZXJmYWNlLlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdHRoaXMuX2NvbnRyb2xzID0ge307XG5cblx0XHQvKipcblx0XHQgKiBNYXJrdXAgZm9yIGFuIGluZGljYXRvci5cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICogQHR5cGUge0FycmF5LjxTdHJpbmc+fVxuXHRcdCAqL1xuXHRcdHRoaXMuX3RlbXBsYXRlcyA9IFtdO1xuXG5cdFx0LyoqXG5cdFx0ICogVGhlIGNhcm91c2VsIGVsZW1lbnQuXG5cdFx0ICogQHR5cGUge2pRdWVyeX1cblx0XHQgKi9cblx0XHR0aGlzLiRlbGVtZW50ID0gdGhpcy5fY29yZS4kZWxlbWVudDtcblxuXHRcdC8qKlxuXHRcdCAqIE92ZXJyaWRkZW4gbWV0aG9kcyBvZiB0aGUgY2Fyb3VzZWwuXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0dGhpcy5fb3ZlcnJpZGVzID0ge1xuXHRcdFx0bmV4dDogdGhpcy5fY29yZS5uZXh0LFxuXHRcdFx0cHJldjogdGhpcy5fY29yZS5wcmV2LFxuXHRcdFx0dG86IHRoaXMuX2NvcmUudG9cblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogQWxsIGV2ZW50IGhhbmRsZXJzLlxuXHRcdCAqIEBwcm90ZWN0ZWRcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdHRoaXMuX2hhbmRsZXJzID0ge1xuXHRcdFx0J3ByZXBhcmVkLm93bC5jYXJvdXNlbCc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAodGhpcy5fY29yZS5zZXR0aW5ncy5kb3RzRGF0YSkge1xuXHRcdFx0XHRcdHRoaXMuX3RlbXBsYXRlcy5wdXNoKCQoZS5jb250ZW50KS5maW5kKCdbZGF0YS1kb3RdJykuYW5kU2VsZignW2RhdGEtZG90XScpLmF0dHIoJ2RhdGEtZG90JykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aGlzKSxcblx0XHRcdCdhZGQub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9jb3JlLnNldHRpbmdzLmRvdHNEYXRhKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGVtcGxhdGVzLnNwbGljZShlLnBvc2l0aW9uLCAwLCAkKGUuY29udGVudCkuZmluZCgnW2RhdGEtZG90XScpLmFuZFNlbGYoJ1tkYXRhLWRvdF0nKS5hdHRyKCdkYXRhLWRvdCcpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGhpcyksXG5cdFx0XHQncmVtb3ZlLm93bC5jYXJvdXNlbCBwcmVwYXJlZC5vd2wuY2Fyb3VzZWwnOiAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0aWYgKHRoaXMuX2NvcmUuc2V0dGluZ3MuZG90c0RhdGEpIHtcblx0XHRcdFx0XHR0aGlzLl90ZW1wbGF0ZXMuc3BsaWNlKGUucG9zaXRpb24sIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aGlzKSxcblx0XHRcdCdjaGFuZ2Uub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmIChlLnByb3BlcnR5Lm5hbWUgPT0gJ3Bvc2l0aW9uJykge1xuXHRcdFx0XHRcdGlmICghdGhpcy5fY29yZS5zdGF0ZS5yZXZlcnQgJiYgIXRoaXMuX2NvcmUuc2V0dGluZ3MubG9vcCAmJiB0aGlzLl9jb3JlLnNldHRpbmdzLm5hdlJld2luZCkge1xuXHRcdFx0XHRcdFx0dmFyIGN1cnJlbnQgPSB0aGlzLl9jb3JlLmN1cnJlbnQoKSxcblx0XHRcdFx0XHRcdFx0bWF4aW11bSA9IHRoaXMuX2NvcmUubWF4aW11bSgpLFxuXHRcdFx0XHRcdFx0XHRtaW5pbXVtID0gdGhpcy5fY29yZS5taW5pbXVtKCk7XG5cdFx0XHRcdFx0XHRlLmRhdGEgPSBlLnByb3BlcnR5LnZhbHVlID4gbWF4aW11bVxuXHRcdFx0XHRcdFx0XHQ/IGN1cnJlbnQgPj0gbWF4aW11bSA/IG1pbmltdW0gOiBtYXhpbXVtXG5cdFx0XHRcdFx0XHRcdDogZS5wcm9wZXJ0eS52YWx1ZSA8IG1pbmltdW0gPyBtYXhpbXVtIDogZS5wcm9wZXJ0eS52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMpLFxuXHRcdFx0J2NoYW5nZWQub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmIChlLnByb3BlcnR5Lm5hbWUgPT0gJ3Bvc2l0aW9uJykge1xuXHRcdFx0XHRcdHRoaXMuZHJhdygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aGlzKSxcblx0XHRcdCdyZWZyZXNoZWQub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCF0aGlzLl9pbml0aWFsaXplZCkge1xuXHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xuXHRcdFx0XHRcdHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9jb3JlLnRyaWdnZXIoJ3JlZnJlc2gnLCBudWxsLCAnbmF2aWdhdGlvbicpO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0XHR0aGlzLmRyYXcoKTtcblx0XHRcdFx0dGhpcy5fY29yZS50cmlnZ2VyKCdyZWZyZXNoZWQnLCBudWxsLCAnbmF2aWdhdGlvbicpO1xuXHRcdFx0fSwgdGhpcylcblx0XHR9O1xuXG5cdFx0Ly8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuXHRcdHRoaXMuX2NvcmUub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBOYXZpZ2F0aW9uLkRlZmF1bHRzLCB0aGlzLl9jb3JlLm9wdGlvbnMpO1xuXG5cdFx0Ly8gcmVnaXN0ZXIgZXZlbnQgaGFuZGxlcnNcblx0XHR0aGlzLiRlbGVtZW50Lm9uKHRoaXMuX2hhbmRsZXJzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWZhdWx0IG9wdGlvbnMuXG5cdCAqIEBwdWJsaWNcblx0ICogQHRvZG8gUmVuYW1lIGBzbGlkZUJ5YCB0byBgbmF2QnlgXG5cdCAqL1xuXHROYXZpZ2F0aW9uLkRlZmF1bHRzID0ge1xuXHRcdG5hdjogZmFsc2UsXG5cdFx0bmF2UmV3aW5kOiB0cnVlLFxuXHRcdG5hdlRleHQ6IFsgJ3ByZXYnLCAnbmV4dCcgXSxcblx0XHRuYXZTcGVlZDogZmFsc2UsXG5cdFx0bmF2RWxlbWVudDogJ2RpdicsXG5cdFx0bmF2Q29udGFpbmVyOiBmYWxzZSxcblx0XHRuYXZDb250YWluZXJDbGFzczogJ293bC1uYXYnLFxuXHRcdG5hdkNsYXNzOiBbICdvd2wtcHJldicsICdvd2wtbmV4dCcgXSxcblx0XHRzbGlkZUJ5OiAxLFxuXHRcdGRvdENsYXNzOiAnb3dsLWRvdCcsXG5cdFx0ZG90c0NsYXNzOiAnb3dsLWRvdHMnLFxuXHRcdGRvdHM6IHRydWUsXG5cdFx0ZG90c0VhY2g6IGZhbHNlLFxuXHRcdGRvdERhdGE6IGZhbHNlLFxuXHRcdGRvdHNTcGVlZDogZmFsc2UsXG5cdFx0ZG90c0NvbnRhaW5lcjogZmFsc2UsXG5cdFx0Y29udHJvbHNDbGFzczogJ293bC1jb250cm9scydcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplcyB0aGUgbGF5b3V0IG9mIHRoZSBwbHVnaW4gYW5kIGV4dGVuZHMgdGhlIGNhcm91c2VsLlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqL1xuXHROYXZpZ2F0aW9uLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyICRjb250YWluZXIsIG92ZXJyaWRlLFxuXHRcdFx0b3B0aW9ucyA9IHRoaXMuX2NvcmUuc2V0dGluZ3M7XG5cblx0XHQvLyBjcmVhdGUgdGhlIGluZGljYXRvciB0ZW1wbGF0ZVxuXHRcdGlmICghb3B0aW9ucy5kb3RzRGF0YSkge1xuXHRcdFx0dGhpcy5fdGVtcGxhdGVzID0gWyAkKCc8ZGl2PicpXG5cdFx0XHRcdC5hZGRDbGFzcyhvcHRpb25zLmRvdENsYXNzKVxuXHRcdFx0XHQuYXBwZW5kKCQoJzxzcGFuPicpKVxuXHRcdFx0XHQucHJvcCgnb3V0ZXJIVE1MJykgXTtcblx0XHR9XG5cblx0XHQvLyBjcmVhdGUgY29udHJvbHMgY29udGFpbmVyIGlmIG5lZWRlZFxuXHRcdGlmICghb3B0aW9ucy5uYXZDb250YWluZXIgfHwgIW9wdGlvbnMuZG90c0NvbnRhaW5lcikge1xuXHRcdFx0dGhpcy5fY29udHJvbHMuJGNvbnRhaW5lciA9ICQoJzxkaXY+Jylcblx0XHRcdFx0LmFkZENsYXNzKG9wdGlvbnMuY29udHJvbHNDbGFzcylcblx0XHRcdFx0LmFwcGVuZFRvKHRoaXMuJGVsZW1lbnQpO1xuXHRcdH1cblxuXHRcdC8vIGNyZWF0ZSBET00gc3RydWN0dXJlIGZvciBhYnNvbHV0ZSBuYXZpZ2F0aW9uXG5cdFx0dGhpcy5fY29udHJvbHMuJGluZGljYXRvcnMgPSBvcHRpb25zLmRvdHNDb250YWluZXIgPyAkKG9wdGlvbnMuZG90c0NvbnRhaW5lcilcblx0XHRcdDogJCgnPGRpdj4nKS5oaWRlKCkuYWRkQ2xhc3Mob3B0aW9ucy5kb3RzQ2xhc3MpLmFwcGVuZFRvKHRoaXMuX2NvbnRyb2xzLiRjb250YWluZXIpO1xuXG5cdFx0dGhpcy5fY29udHJvbHMuJGluZGljYXRvcnMub24oJ2NsaWNrJywgJ2RpdicsICQucHJveHkoZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIGluZGV4ID0gJChlLnRhcmdldCkucGFyZW50KCkuaXModGhpcy5fY29udHJvbHMuJGluZGljYXRvcnMpXG5cdFx0XHRcdD8gJChlLnRhcmdldCkuaW5kZXgoKSA6ICQoZS50YXJnZXQpLnBhcmVudCgpLmluZGV4KCk7XG5cblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0dGhpcy50byhpbmRleCwgb3B0aW9ucy5kb3RzU3BlZWQpO1xuXHRcdH0sIHRoaXMpKTtcblxuXHRcdC8vIGNyZWF0ZSBET00gc3RydWN0dXJlIGZvciByZWxhdGl2ZSBuYXZpZ2F0aW9uXG5cdFx0JGNvbnRhaW5lciA9IG9wdGlvbnMubmF2Q29udGFpbmVyID8gJChvcHRpb25zLm5hdkNvbnRhaW5lcilcblx0XHRcdDogJCgnPGRpdj4nKS5hZGRDbGFzcyhvcHRpb25zLm5hdkNvbnRhaW5lckNsYXNzKS5wcmVwZW5kVG8odGhpcy5fY29udHJvbHMuJGNvbnRhaW5lcik7XG5cblx0XHR0aGlzLl9jb250cm9scy4kbmV4dCA9ICQoJzwnICsgb3B0aW9ucy5uYXZFbGVtZW50ICsgJz4nKTtcblx0XHR0aGlzLl9jb250cm9scy4kcHJldmlvdXMgPSB0aGlzLl9jb250cm9scy4kbmV4dC5jbG9uZSgpO1xuXG5cdFx0dGhpcy5fY29udHJvbHMuJHByZXZpb3VzXG5cdFx0XHQuYWRkQ2xhc3Mob3B0aW9ucy5uYXZDbGFzc1swXSlcblx0XHRcdC5odG1sKG9wdGlvbnMubmF2VGV4dFswXSlcblx0XHRcdC5oaWRlKClcblx0XHRcdC5wcmVwZW5kVG8oJGNvbnRhaW5lcilcblx0XHRcdC5vbignY2xpY2snLCAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0dGhpcy5wcmV2KG9wdGlvbnMubmF2U3BlZWQpO1xuXHRcdFx0fSwgdGhpcykpO1xuXHRcdHRoaXMuX2NvbnRyb2xzLiRuZXh0XG5cdFx0XHQuYWRkQ2xhc3Mob3B0aW9ucy5uYXZDbGFzc1sxXSlcblx0XHRcdC5odG1sKG9wdGlvbnMubmF2VGV4dFsxXSlcblx0XHRcdC5oaWRlKClcblx0XHRcdC5hcHBlbmRUbygkY29udGFpbmVyKVxuXHRcdFx0Lm9uKCdjbGljaycsICQucHJveHkoZnVuY3Rpb24oZSkge1xuXHRcdFx0XHR0aGlzLm5leHQob3B0aW9ucy5uYXZTcGVlZCk7XG5cdFx0XHR9LCB0aGlzKSk7XG5cblx0XHQvLyBvdmVycmlkZSBwdWJsaWMgbWV0aG9kcyBvZiB0aGUgY2Fyb3VzZWxcblx0XHRmb3IgKG92ZXJyaWRlIGluIHRoaXMuX292ZXJyaWRlcykge1xuXHRcdFx0dGhpcy5fY29yZVtvdmVycmlkZV0gPSAkLnByb3h5KHRoaXNbb3ZlcnJpZGVdLCB0aGlzKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogRGVzdHJveXMgdGhlIHBsdWdpbi5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0TmF2aWdhdGlvbi5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBoYW5kbGVyLCBjb250cm9sLCBwcm9wZXJ0eSwgb3ZlcnJpZGU7XG5cblx0XHRmb3IgKGhhbmRsZXIgaW4gdGhpcy5faGFuZGxlcnMpIHtcblx0XHRcdHRoaXMuJGVsZW1lbnQub2ZmKGhhbmRsZXIsIHRoaXMuX2hhbmRsZXJzW2hhbmRsZXJdKTtcblx0XHR9XG5cdFx0Zm9yIChjb250cm9sIGluIHRoaXMuX2NvbnRyb2xzKSB7XG5cdFx0XHR0aGlzLl9jb250cm9sc1tjb250cm9sXS5yZW1vdmUoKTtcblx0XHR9XG5cdFx0Zm9yIChvdmVycmlkZSBpbiB0aGlzLm92ZXJpZGVzKSB7XG5cdFx0XHR0aGlzLl9jb3JlW292ZXJyaWRlXSA9IHRoaXMuX292ZXJyaWRlc1tvdmVycmlkZV07XG5cdFx0fVxuXHRcdGZvciAocHJvcGVydHkgaW4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcykpIHtcblx0XHRcdHR5cGVvZiB0aGlzW3Byb3BlcnR5XSAhPSAnZnVuY3Rpb24nICYmICh0aGlzW3Byb3BlcnR5XSA9IG51bGwpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBpbnRlcm5hbCBzdGF0ZS5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0TmF2aWdhdGlvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGksIGosIGssXG5cdFx0XHRvcHRpb25zID0gdGhpcy5fY29yZS5zZXR0aW5ncyxcblx0XHRcdGxvd2VyID0gdGhpcy5fY29yZS5jbG9uZXMoKS5sZW5ndGggLyAyLFxuXHRcdFx0dXBwZXIgPSBsb3dlciArIHRoaXMuX2NvcmUuaXRlbXMoKS5sZW5ndGgsXG5cdFx0XHRzaXplID0gb3B0aW9ucy5jZW50ZXIgfHwgb3B0aW9ucy5hdXRvV2lkdGggfHwgb3B0aW9ucy5kb3REYXRhXG5cdFx0XHRcdD8gMSA6IG9wdGlvbnMuZG90c0VhY2ggfHwgb3B0aW9ucy5pdGVtcztcblxuXHRcdGlmIChvcHRpb25zLnNsaWRlQnkgIT09ICdwYWdlJykge1xuXHRcdFx0b3B0aW9ucy5zbGlkZUJ5ID0gTWF0aC5taW4ob3B0aW9ucy5zbGlkZUJ5LCBvcHRpb25zLml0ZW1zKTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy5kb3RzIHx8IG9wdGlvbnMuc2xpZGVCeSA9PSAncGFnZScpIHtcblx0XHRcdHRoaXMuX3BhZ2VzID0gW107XG5cblx0XHRcdGZvciAoaSA9IGxvd2VyLCBqID0gMCwgayA9IDA7IGkgPCB1cHBlcjsgaSsrKSB7XG5cdFx0XHRcdGlmIChqID49IHNpemUgfHwgaiA9PT0gMCkge1xuXHRcdFx0XHRcdHRoaXMuX3BhZ2VzLnB1c2goe1xuXHRcdFx0XHRcdFx0c3RhcnQ6IGkgLSBsb3dlcixcblx0XHRcdFx0XHRcdGVuZDogaSAtIGxvd2VyICsgc2l6ZSAtIDFcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRqID0gMCwgKytrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGogKz0gdGhpcy5fY29yZS5tZXJnZXJzKHRoaXMuX2NvcmUucmVsYXRpdmUoaSkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBEcmF3cyB0aGUgdXNlciBpbnRlcmZhY2UuXG5cdCAqIEB0b2RvIFRoZSBvcHRpb24gYGRvdERhdGFgIHdvbnQgd29yay5cblx0ICogQHByb3RlY3RlZFxuXHQgKi9cblx0TmF2aWdhdGlvbi5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkaWZmZXJlbmNlLCBpLCBodG1sID0gJycsXG5cdFx0XHRvcHRpb25zID0gdGhpcy5fY29yZS5zZXR0aW5ncyxcblx0XHRcdCRpdGVtcyA9IHRoaXMuX2NvcmUuJHN0YWdlLmNoaWxkcmVuKCksXG5cdFx0XHRpbmRleCA9IHRoaXMuX2NvcmUucmVsYXRpdmUodGhpcy5fY29yZS5jdXJyZW50KCkpO1xuXG5cdFx0aWYgKG9wdGlvbnMubmF2ICYmICFvcHRpb25zLmxvb3AgJiYgIW9wdGlvbnMubmF2UmV3aW5kKSB7XG5cdFx0XHR0aGlzLl9jb250cm9scy4kcHJldmlvdXMudG9nZ2xlQ2xhc3MoJ2Rpc2FibGVkJywgaW5kZXggPD0gMCk7XG5cdFx0XHR0aGlzLl9jb250cm9scy4kbmV4dC50b2dnbGVDbGFzcygnZGlzYWJsZWQnLCBpbmRleCA+PSB0aGlzLl9jb3JlLm1heGltdW0oKSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fY29udHJvbHMuJHByZXZpb3VzLnRvZ2dsZShvcHRpb25zLm5hdik7XG5cdFx0dGhpcy5fY29udHJvbHMuJG5leHQudG9nZ2xlKG9wdGlvbnMubmF2KTtcblxuXHRcdGlmIChvcHRpb25zLmRvdHMpIHtcblx0XHRcdGRpZmZlcmVuY2UgPSB0aGlzLl9wYWdlcy5sZW5ndGggLSB0aGlzLl9jb250cm9scy4kaW5kaWNhdG9ycy5jaGlsZHJlbigpLmxlbmd0aDtcblxuXHRcdFx0aWYgKG9wdGlvbnMuZG90RGF0YSAmJiBkaWZmZXJlbmNlICE9PSAwKSB7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl9jb250cm9scy4kaW5kaWNhdG9ycy5jaGlsZHJlbigpLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aHRtbCArPSB0aGlzLl90ZW1wbGF0ZXNbdGhpcy5fY29yZS5yZWxhdGl2ZShpKV07XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fY29udHJvbHMuJGluZGljYXRvcnMuaHRtbChodG1sKTtcblx0XHRcdH0gZWxzZSBpZiAoZGlmZmVyZW5jZSA+IDApIHtcblx0XHRcdFx0aHRtbCA9IG5ldyBBcnJheShkaWZmZXJlbmNlICsgMSkuam9pbih0aGlzLl90ZW1wbGF0ZXNbMF0pO1xuXHRcdFx0XHR0aGlzLl9jb250cm9scy4kaW5kaWNhdG9ycy5hcHBlbmQoaHRtbCk7XG5cdFx0XHR9IGVsc2UgaWYgKGRpZmZlcmVuY2UgPCAwKSB7XG5cdFx0XHRcdHRoaXMuX2NvbnRyb2xzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKCkuc2xpY2UoZGlmZmVyZW5jZSkucmVtb3ZlKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2NvbnRyb2xzLiRpbmRpY2F0b3JzLmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHR0aGlzLl9jb250cm9scy4kaW5kaWNhdG9ycy5jaGlsZHJlbigpLmVxKCQuaW5BcnJheSh0aGlzLmN1cnJlbnQoKSwgdGhpcy5fcGFnZXMpKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fY29udHJvbHMuJGluZGljYXRvcnMudG9nZ2xlKG9wdGlvbnMuZG90cyk7XG5cdH1cblxuXHQvKipcblx0ICogRXh0ZW5kcyBldmVudCBkYXRhLlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IC0gVGhlIGV2ZW50IG9iamVjdCB3aGljaCBnZXRzIHRocm93bi5cblx0ICovXG5cdE5hdmlnYXRpb24ucHJvdG90eXBlLm9uVHJpZ2dlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHNldHRpbmdzID0gdGhpcy5fY29yZS5zZXR0aW5ncztcblxuXHRcdGV2ZW50LnBhZ2UgPSB7XG5cdFx0XHRpbmRleDogJC5pbkFycmF5KHRoaXMuY3VycmVudCgpLCB0aGlzLl9wYWdlcyksXG5cdFx0XHRjb3VudDogdGhpcy5fcGFnZXMubGVuZ3RoLFxuXHRcdFx0c2l6ZTogc2V0dGluZ3MgJiYgKHNldHRpbmdzLmNlbnRlciB8fCBzZXR0aW5ncy5hdXRvV2lkdGggfHwgc2V0dGluZ3MuZG90RGF0YVxuXHRcdFx0XHQ/IDEgOiBzZXR0aW5ncy5kb3RzRWFjaCB8fCBzZXR0aW5ncy5pdGVtcylcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGN1cnJlbnQgcGFnZSBwb3NpdGlvbiBvZiB0aGUgY2Fyb3VzZWwuXG5cdCAqIEBwcm90ZWN0ZWRcblx0ICogQHJldHVybnMge051bWJlcn1cblx0ICovXG5cdE5hdmlnYXRpb24ucHJvdG90eXBlLmN1cnJlbnQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgaW5kZXggPSB0aGlzLl9jb3JlLnJlbGF0aXZlKHRoaXMuX2NvcmUuY3VycmVudCgpKTtcblx0XHRyZXR1cm4gJC5ncmVwKHRoaXMuX3BhZ2VzLCBmdW5jdGlvbihvKSB7XG5cdFx0XHRyZXR1cm4gby5zdGFydCA8PSBpbmRleCAmJiBvLmVuZCA+PSBpbmRleDtcblx0XHR9KS5wb3AoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBjdXJyZW50IHN1Y2Nlc29yL3ByZWRlY2Vzc29yIHBvc2l0aW9uLlxuXHQgKiBAcHJvdGVjdGVkXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9XG5cdCAqL1xuXHROYXZpZ2F0aW9uLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKHN1Y2Nlc3Nvcikge1xuXHRcdHZhciBwb3NpdGlvbiwgbGVuZ3RoLFxuXHRcdFx0b3B0aW9ucyA9IHRoaXMuX2NvcmUuc2V0dGluZ3M7XG5cblx0XHRpZiAob3B0aW9ucy5zbGlkZUJ5ID09ICdwYWdlJykge1xuXHRcdFx0cG9zaXRpb24gPSAkLmluQXJyYXkodGhpcy5jdXJyZW50KCksIHRoaXMuX3BhZ2VzKTtcblx0XHRcdGxlbmd0aCA9IHRoaXMuX3BhZ2VzLmxlbmd0aDtcblx0XHRcdHN1Y2Nlc3NvciA/ICsrcG9zaXRpb24gOiAtLXBvc2l0aW9uO1xuXHRcdFx0cG9zaXRpb24gPSB0aGlzLl9wYWdlc1soKHBvc2l0aW9uICUgbGVuZ3RoKSArIGxlbmd0aCkgJSBsZW5ndGhdLnN0YXJ0O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwb3NpdGlvbiA9IHRoaXMuX2NvcmUucmVsYXRpdmUodGhpcy5fY29yZS5jdXJyZW50KCkpO1xuXHRcdFx0bGVuZ3RoID0gdGhpcy5fY29yZS5pdGVtcygpLmxlbmd0aDtcblx0XHRcdHN1Y2Nlc3NvciA/IHBvc2l0aW9uICs9IG9wdGlvbnMuc2xpZGVCeSA6IHBvc2l0aW9uIC09IG9wdGlvbnMuc2xpZGVCeTtcblx0XHR9XG5cdFx0cmV0dXJuIHBvc2l0aW9uO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNsaWRlcyB0byB0aGUgbmV4dCBpdGVtIG9yIHBhZ2UuXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVlZD1mYWxzZV0gLSBUaGUgdGltZSBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSB0cmFuc2l0aW9uLlxuXHQgKi9cblx0TmF2aWdhdGlvbi5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKHNwZWVkKSB7XG5cdFx0JC5wcm94eSh0aGlzLl9vdmVycmlkZXMudG8sIHRoaXMuX2NvcmUpKHRoaXMuZ2V0UG9zaXRpb24odHJ1ZSksIHNwZWVkKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTbGlkZXMgdG8gdGhlIHByZXZpb3VzIGl0ZW0gb3IgcGFnZS5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge051bWJlcn0gW3NwZWVkPWZhbHNlXSAtIFRoZSB0aW1lIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHRyYW5zaXRpb24uXG5cdCAqL1xuXHROYXZpZ2F0aW9uLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24oc3BlZWQpIHtcblx0XHQkLnByb3h5KHRoaXMuX292ZXJyaWRlcy50bywgdGhpcy5fY29yZSkodGhpcy5nZXRQb3NpdGlvbihmYWxzZSksIHNwZWVkKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTbGlkZXMgdG8gdGhlIHNwZWNpZmllZCBpdGVtIG9yIHBhZ2UuXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBpdGVtIG9yIHBhZ2UuXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBbc3BlZWRdIC0gVGhlIHRpbWUgaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgdHJhbnNpdGlvbi5cblx0ICogQHBhcmFtIHtCb29sZWFufSBbc3RhbmRhcmQ9ZmFsc2VdIC0gV2hldGhlciB0byB1c2UgdGhlIHN0YW5kYXJkIGJlaGF2aW91ciBvciBub3QuXG5cdCAqL1xuXHROYXZpZ2F0aW9uLnByb3RvdHlwZS50byA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBzcGVlZCwgc3RhbmRhcmQpIHtcblx0XHR2YXIgbGVuZ3RoO1xuXG5cdFx0aWYgKCFzdGFuZGFyZCkge1xuXHRcdFx0bGVuZ3RoID0gdGhpcy5fcGFnZXMubGVuZ3RoO1xuXHRcdFx0JC5wcm94eSh0aGlzLl9vdmVycmlkZXMudG8sIHRoaXMuX2NvcmUpKHRoaXMuX3BhZ2VzWygocG9zaXRpb24gJSBsZW5ndGgpICsgbGVuZ3RoKSAlIGxlbmd0aF0uc3RhcnQsIHNwZWVkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JC5wcm94eSh0aGlzLl9vdmVycmlkZXMudG8sIHRoaXMuX2NvcmUpKHBvc2l0aW9uLCBzcGVlZCk7XG5cdFx0fVxuXHR9XG5cblx0JC5mbi5vd2xDYXJvdXNlbC5Db25zdHJ1Y3Rvci5QbHVnaW5zLk5hdmlnYXRpb24gPSBOYXZpZ2F0aW9uO1xuXG59KSh3aW5kb3cuWmVwdG8gfHwgd2luZG93LmpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG5cbi8qKlxuICogSGFzaCBQbHVnaW5cbiAqIEB2ZXJzaW9uIDIuMC4wXG4gKiBAYXV0aG9yIEFydHVzIEtvbGFub3dza2lcbiAqIEBsaWNlbnNlIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICovXG47KGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgdGhlIGhhc2ggcGx1Z2luLlxuXHQgKiBAY2xhc3MgVGhlIEhhc2ggUGx1Z2luXG5cdCAqIEBwYXJhbSB7T3dsfSBjYXJvdXNlbCAtIFRoZSBPd2wgQ2Fyb3VzZWxcblx0ICovXG5cdHZhciBIYXNoID0gZnVuY3Rpb24oY2Fyb3VzZWwpIHtcblx0XHQvKipcblx0XHQgKiBSZWZlcmVuY2UgdG8gdGhlIGNvcmUuXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqIEB0eXBlIHtPd2x9XG5cdFx0ICovXG5cdFx0dGhpcy5fY29yZSA9IGNhcm91c2VsO1xuXG5cdFx0LyoqXG5cdFx0ICogSGFzaCB0YWJsZSBmb3IgdGhlIGhhc2hlcy5cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cblx0XHR0aGlzLl9oYXNoZXMgPSB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBjYXJvdXNlbCBlbGVtZW50LlxuXHRcdCAqIEB0eXBlIHtqUXVlcnl9XG5cdFx0ICovXG5cdFx0dGhpcy4kZWxlbWVudCA9IHRoaXMuX2NvcmUuJGVsZW1lbnQ7XG5cblx0XHQvKipcblx0XHQgKiBBbGwgZXZlbnQgaGFuZGxlcnMuXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0dGhpcy5faGFuZGxlcnMgPSB7XG5cdFx0XHQnaW5pdGlhbGl6ZWQub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKHRoaXMuX2NvcmUuc2V0dGluZ3Muc3RhcnRQb3NpdGlvbiA9PSAnVVJMSGFzaCcpIHtcblx0XHRcdFx0XHQkKHdpbmRvdykudHJpZ2dlcignaGFzaGNoYW5nZS5vd2wubmF2aWdhdGlvbicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aGlzKSxcblx0XHRcdCdwcmVwYXJlZC5vd2wuY2Fyb3VzZWwnOiAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0dmFyIGhhc2ggPSAkKGUuY29udGVudCkuZmluZCgnW2RhdGEtaGFzaF0nKS5hbmRTZWxmKCdbZGF0YS1oYXNoXScpLmF0dHIoJ2RhdGEtaGFzaCcpO1xuXHRcdFx0XHR0aGlzLl9oYXNoZXNbaGFzaF0gPSBlLmNvbnRlbnQ7XG5cdFx0XHR9LCB0aGlzKVxuXHRcdH07XG5cblx0XHQvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG5cdFx0dGhpcy5fY29yZS5vcHRpb25zID0gJC5leHRlbmQoe30sIEhhc2guRGVmYXVsdHMsIHRoaXMuX2NvcmUub3B0aW9ucyk7XG5cblx0XHQvLyByZWdpc3RlciB0aGUgZXZlbnQgaGFuZGxlcnNcblx0XHR0aGlzLiRlbGVtZW50Lm9uKHRoaXMuX2hhbmRsZXJzKTtcblxuXHRcdC8vIHJlZ2lzdGVyIGV2ZW50IGxpc3RlbmVyIGZvciBoYXNoIG5hdmlnYXRpb25cblx0XHQkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2Uub3dsLm5hdmlnYXRpb24nLCAkLnByb3h5KGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSksXG5cdFx0XHRcdGl0ZW1zID0gdGhpcy5fY29yZS4kc3RhZ2UuY2hpbGRyZW4oKSxcblx0XHRcdFx0cG9zaXRpb24gPSB0aGlzLl9oYXNoZXNbaGFzaF0gJiYgaXRlbXMuaW5kZXgodGhpcy5faGFzaGVzW2hhc2hdKSB8fCAwO1xuXG5cdFx0XHRpZiAoIWhhc2gpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9jb3JlLnRvKHBvc2l0aW9uLCBmYWxzZSwgdHJ1ZSk7XG5cdFx0fSwgdGhpcykpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlZmF1bHQgb3B0aW9ucy5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0SGFzaC5EZWZhdWx0cyA9IHtcblx0XHRVUkxoYXNoTGlzdGVuZXI6IGZhbHNlXG5cdH1cblxuXHQvKipcblx0ICogRGVzdHJveXMgdGhlIHBsdWdpbi5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0SGFzaC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBoYW5kbGVyLCBwcm9wZXJ0eTtcblxuXHRcdCQod2luZG93KS5vZmYoJ2hhc2hjaGFuZ2Uub3dsLm5hdmlnYXRpb24nKTtcblxuXHRcdGZvciAoaGFuZGxlciBpbiB0aGlzLl9oYW5kbGVycykge1xuXHRcdFx0dGhpcy5fY29yZS4kZWxlbWVudC5vZmYoaGFuZGxlciwgdGhpcy5faGFuZGxlcnNbaGFuZGxlcl0pO1xuXHRcdH1cblx0XHRmb3IgKHByb3BlcnR5IGluIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMpKSB7XG5cdFx0XHR0eXBlb2YgdGhpc1twcm9wZXJ0eV0gIT0gJ2Z1bmN0aW9uJyAmJiAodGhpc1twcm9wZXJ0eV0gPSBudWxsKTtcblx0XHR9XG5cdH1cblxuXHQkLmZuLm93bENhcm91c2VsLkNvbnN0cnVjdG9yLlBsdWdpbnMuSGFzaCA9IEhhc2g7XG5cbn0pKHdpbmRvdy5aZXB0byB8fCB3aW5kb3cualF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTsiXX0=
