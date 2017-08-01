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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL293bC5jYXJvdXNlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIE93bCBjYXJvdXNlbFxyXG4gKiBAdmVyc2lvbiAyLjAuMFxyXG4gKiBAYXV0aG9yIEJhcnRvc3ogV29qY2llY2hvd3NraVxyXG4gKiBAbGljZW5zZSBUaGUgTUlUIExpY2Vuc2UgKE1JVClcclxuICogQHRvZG8gTGF6eSBMb2FkIEljb25cclxuICogQHRvZG8gcHJldmVudCBhbmltYXRpb25lbmQgYnVibGluZ1xyXG4gKiBAdG9kbyBpdGVtc1NjYWxlVXBcclxuICogQHRvZG8gVGVzdCBaZXB0b1xyXG4gKiBAdG9kbyBzdGFnZVBhZGRpbmcgY2FsY3VsYXRlIHdyb25nIGFjdGl2ZSBjbGFzc2VzXHJcbiAqL1xyXG47KGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xyXG5cclxuXHR2YXIgZHJhZywgc3RhdGUsIGU7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRlbXBsYXRlIGZvciBzdGF0dXMgaW5mb3JtYXRpb24gYWJvdXQgZHJhZyBhbmQgdG91Y2ggZXZlbnRzLlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0ZHJhZyA9IHtcclxuXHRcdHN0YXJ0OiAwLFxyXG5cdFx0c3RhcnRYOiAwLFxyXG5cdFx0c3RhcnRZOiAwLFxyXG5cdFx0Y3VycmVudDogMCxcclxuXHRcdGN1cnJlbnRYOiAwLFxyXG5cdFx0Y3VycmVudFk6IDAsXHJcblx0XHRvZmZzZXRYOiAwLFxyXG5cdFx0b2Zmc2V0WTogMCxcclxuXHRcdGRpc3RhbmNlOiBudWxsLFxyXG5cdFx0c3RhcnRUaW1lOiAwLFxyXG5cdFx0ZW5kVGltZTogMCxcclxuXHRcdHVwZGF0ZWRYOiAwLFxyXG5cdFx0dGFyZ2V0RWw6IG51bGxcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBUZW1wbGF0ZSBmb3Igc29tZSBzdGF0dXMgaW5mb3JtYXRpb25zLlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0c3RhdGUgPSB7XHJcblx0XHRpc1RvdWNoOiBmYWxzZSxcclxuXHRcdGlzU2Nyb2xsaW5nOiBmYWxzZSxcclxuXHRcdGlzU3dpcGluZzogZmFsc2UsXHJcblx0XHRkaXJlY3Rpb246IGZhbHNlLFxyXG5cdFx0aW5Nb3Rpb246IGZhbHNlXHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogRXZlbnQgZnVuY3Rpb25zIHJlZmVyZW5jZXMuXHJcblx0ICogQHByaXZhdGVcclxuXHQgKi9cclxuXHRlID0ge1xyXG5cdFx0X29uRHJhZ1N0YXJ0OiBudWxsLFxyXG5cdFx0X29uRHJhZ01vdmU6IG51bGwsXHJcblx0XHRfb25EcmFnRW5kOiBudWxsLFxyXG5cdFx0X3RyYW5zaXRpb25FbmQ6IG51bGwsXHJcblx0XHRfcmVzaXplcjogbnVsbCxcclxuXHRcdF9yZXNwb25zaXZlQ2FsbDogbnVsbCxcclxuXHRcdF9nb1RvTG9vcDogbnVsbCxcclxuXHRcdF9jaGVja1Zpc2liaWxlOiBudWxsXHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlcyBhIGNhcm91c2VsLlxyXG5cdCAqIEBjbGFzcyBUaGUgT3dsIENhcm91c2VsLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fGpRdWVyeX0gZWxlbWVudCAtIFRoZSBlbGVtZW50IHRvIGNyZWF0ZSB0aGUgY2Fyb3VzZWwgZm9yLlxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBUaGUgb3B0aW9uc1xyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIE93bChlbGVtZW50LCBvcHRpb25zKSB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDdXJyZW50IHNldHRpbmdzIGZvciB0aGUgY2Fyb3VzZWwuXHJcblx0XHQgKiBAcHVibGljXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuc2V0dGluZ3MgPSBudWxsO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ3VycmVudCBvcHRpb25zIHNldCBieSB0aGUgY2FsbGVyIGluY2x1ZGluZyBkZWZhdWx0cy5cclxuXHRcdCAqIEBwdWJsaWNcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIE93bC5EZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBQbHVnaW4gZWxlbWVudC5cclxuXHRcdCAqIEBwdWJsaWNcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDYWNoZXMgaW5mb3JtYXRpb25zIGFib3V0IGRyYWcgYW5kIHRvdWNoIGV2ZW50cy5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5kcmFnID0gJC5leHRlbmQoe30sIGRyYWcpO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ2FjaGVzIHNvbWUgc3RhdHVzIGluZm9ybWF0aW9ucy5cclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5zdGF0ZSA9ICQuZXh0ZW5kKHt9LCBzdGF0ZSk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKiBAdG9kbyBNdXN0IGJlIGRvY3VtZW50ZWRcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5lID0gJC5leHRlbmQoe30sIGUpO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmVmZXJlbmNlcyB0byB0aGUgcnVubmluZyBwbHVnaW5zIG9mIHRoaXMgY2Fyb3VzZWwuXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX3BsdWdpbnMgPSB7fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEN1cnJlbnRseSBzdXBwcmVzc2VkIGV2ZW50cyB0byBwcmV2ZW50IHRoZW0gZnJvbSBiZWVpbmcgcmV0cmlnZ2VyZWQuXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX3N1cHJlc3MgPSB7fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFic29sdXRlIGN1cnJlbnQgcG9zaXRpb24uXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX2N1cnJlbnQgPSBudWxsO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQW5pbWF0aW9uIHNwZWVkIGluIG1pbGxpc2Vjb25kcy5cclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5fc3BlZWQgPSBudWxsO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ29vcmRpbmF0ZXMgb2YgYWxsIGl0ZW1zIGluIHBpeGVsLlxyXG5cdFx0ICogQHRvZG8gVGhlIG5hbWUgb2YgdGhpcyBtZW1iZXIgaXMgbWlzc2xlYWRpbmcuXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX2Nvb3JkaW5hdGVzID0gW107XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDdXJyZW50IGJyZWFrcG9pbnQuXHJcblx0XHQgKiBAdG9kbyBSZWFsIG1lZGlhIHF1ZXJpZXMgd291bGQgYmUgbmljZS5cclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5fYnJlYWtwb2ludCA9IG51bGw7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDdXJyZW50IHdpZHRoIG9mIHRoZSBwbHVnaW4gZWxlbWVudC5cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5fd2lkdGggPSBudWxsO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQWxsIHJlYWwgaXRlbXMuXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX2l0ZW1zID0gW107XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBbGwgY2xvbmVkIGl0ZW1zLlxyXG5cdFx0ICogQHByb3RlY3RlZFxyXG5cdFx0ICovXHJcblx0XHR0aGlzLl9jbG9uZXMgPSBbXTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIE1lcmdlIHZhbHVlcyBvZiBhbGwgaXRlbXMuXHJcblx0XHQgKiBAdG9kbyBNYXliZSB0aGlzIGNvdWxkIGJlIHBhcnQgb2YgYSBwbHVnaW4uXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX21lcmdlcnMgPSBbXTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEludmFsaWRhdGVkIHBhcnRzIHdpdGhpbiB0aGUgdXBkYXRlIHByb2Nlc3MuXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX2ludmFsaWRhdGVkID0ge307XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBPcmRlcmVkIGxpc3Qgb2Ygd29ya2VycyBmb3IgdGhlIHVwZGF0ZSBwcm9jZXNzLlxyXG5cdFx0ICogQHByb3RlY3RlZFxyXG5cdFx0ICovXHJcblx0XHR0aGlzLl9waXBlID0gW107XHJcblxyXG5cdFx0JC5lYWNoKE93bC5QbHVnaW5zLCAkLnByb3h5KGZ1bmN0aW9uKGtleSwgcGx1Z2luKSB7XHJcblx0XHRcdHRoaXMuX3BsdWdpbnNba2V5WzBdLnRvTG93ZXJDYXNlKCkgKyBrZXkuc2xpY2UoMSldXHJcblx0XHRcdFx0PSBuZXcgcGx1Z2luKHRoaXMpO1xyXG5cdFx0fSwgdGhpcykpO1xyXG5cclxuXHRcdCQuZWFjaChPd2wuUGlwZSwgJC5wcm94eShmdW5jdGlvbihwcmlvcml0eSwgd29ya2VyKSB7XHJcblx0XHRcdHRoaXMuX3BpcGUucHVzaCh7XHJcblx0XHRcdFx0J2ZpbHRlcic6IHdvcmtlci5maWx0ZXIsXHJcblx0XHRcdFx0J3J1bic6ICQucHJveHkod29ya2VyLnJ1biwgdGhpcylcclxuXHRcdFx0fSk7XHJcblx0XHR9LCB0aGlzKSk7XHJcblxyXG5cdFx0dGhpcy5zZXR1cCgpO1xyXG5cdFx0dGhpcy5pbml0aWFsaXplKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBEZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBjYXJvdXNlbC5cclxuXHQgKiBAcHVibGljXHJcblx0ICovXHJcblx0T3dsLkRlZmF1bHRzID0ge1xyXG5cdFx0aXRlbXM6IDMsXHJcblx0XHRsb29wOiBmYWxzZSxcclxuXHRcdGNlbnRlcjogZmFsc2UsXHJcblxyXG5cdFx0bW91c2VEcmFnOiB0cnVlLFxyXG5cdFx0dG91Y2hEcmFnOiB0cnVlLFxyXG5cdFx0cHVsbERyYWc6IHRydWUsXHJcblx0XHRmcmVlRHJhZzogZmFsc2UsXHJcblxyXG5cdFx0bWFyZ2luOiAwLFxyXG5cdFx0c3RhZ2VQYWRkaW5nOiAwLFxyXG5cclxuXHRcdG1lcmdlOiBmYWxzZSxcclxuXHRcdG1lcmdlRml0OiB0cnVlLFxyXG5cdFx0YXV0b1dpZHRoOiBmYWxzZSxcclxuXHJcblx0XHRzdGFydFBvc2l0aW9uOiAwLFxyXG5cdFx0cnRsOiBmYWxzZSxcclxuXHJcblx0XHRzbWFydFNwZWVkOiAyNTAsXHJcblx0XHRmbHVpZFNwZWVkOiBmYWxzZSxcclxuXHRcdGRyYWdFbmRTcGVlZDogZmFsc2UsXHJcblx0XHRwYWdlQW5pbWF0aW9uRHVyYXRpb246ICcxcycsXHJcblxyXG5cdFx0cmVzcG9uc2l2ZToge30sXHJcblx0XHRyZXNwb25zaXZlUmVmcmVzaFJhdGU6IDIwMCxcclxuXHRcdHJlc3BvbnNpdmVCYXNlRWxlbWVudDogd2luZG93LFxyXG5cdFx0cmVzcG9uc2l2ZUNsYXNzOiBmYWxzZSxcclxuXHJcblx0XHRmYWxsYmFja0Vhc2luZzogJ3N3aW5nJyxcclxuXHJcblx0XHRpbmZvOiBmYWxzZSxcclxuXHJcblx0XHRuZXN0ZWRJdGVtU2VsZWN0b3I6IGZhbHNlLFxyXG5cdFx0aXRlbUVsZW1lbnQ6ICdkaXYnLFxyXG5cdFx0c3RhZ2VFbGVtZW50OiAnZGl2JyxcclxuXHJcblx0XHQvLyBDbGFzc2VzIGFuZCBOYW1lc1xyXG5cdFx0dGhlbWVDbGFzczogJ293bC10aGVtZScsXHJcblx0XHRiYXNlQ2xhc3M6ICdvd2wtY2Fyb3VzZWwnLFxyXG5cdFx0aXRlbUNsYXNzOiAnb3dsLWl0ZW0nLFxyXG5cdFx0Y2VudGVyQ2xhc3M6ICdjZW50ZXInLFxyXG5cdFx0YWN0aXZlQ2xhc3M6ICdhY3RpdmUnXHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogRW51bWVyYXRpb24gZm9yIHdpZHRoLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcmVhZG9ubHlcclxuXHQgKiBAZW51bSB7U3RyaW5nfVxyXG5cdCAqL1xyXG5cdE93bC5XaWR0aCA9IHtcclxuXHRcdERlZmF1bHQ6ICdkZWZhdWx0JyxcclxuXHRcdElubmVyOiAnaW5uZXInLFxyXG5cdFx0T3V0ZXI6ICdvdXRlcidcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBDb250YWlucyBhbGwgcmVnaXN0ZXJlZCBwbHVnaW5zLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHRPd2wuUGx1Z2lucyA9IHt9O1xyXG5cclxuXHQvKipcclxuXHQgKiBVcGRhdGUgcGlwZS5cclxuXHQgKi9cclxuXHRPd2wuUGlwZSA9IFsge1xyXG5cdFx0ZmlsdGVyOiBbICd3aWR0aCcsICdpdGVtcycsICdzZXR0aW5ncycgXSxcclxuXHRcdHJ1bjogZnVuY3Rpb24oY2FjaGUpIHtcclxuXHRcdFx0Y2FjaGUuY3VycmVudCA9IHRoaXMuX2l0ZW1zICYmIHRoaXMuX2l0ZW1zW3RoaXMucmVsYXRpdmUodGhpcy5fY3VycmVudCldO1xyXG5cdFx0fVxyXG5cdH0sIHtcclxuXHRcdGZpbHRlcjogWyAnaXRlbXMnLCAnc2V0dGluZ3MnIF0sXHJcblx0XHRydW46IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgY2FjaGVkID0gdGhpcy5fY2xvbmVzLFxyXG5cdFx0XHRcdGNsb25lcyA9IHRoaXMuJHN0YWdlLmNoaWxkcmVuKCcuY2xvbmVkJyk7XHJcblxyXG5cdFx0XHRpZiAoY2xvbmVzLmxlbmd0aCAhPT0gY2FjaGVkLmxlbmd0aCB8fCAoIXRoaXMuc2V0dGluZ3MubG9vcCAmJiBjYWNoZWQubGVuZ3RoID4gMCkpIHtcclxuXHRcdFx0XHR0aGlzLiRzdGFnZS5jaGlsZHJlbignLmNsb25lZCcpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdHRoaXMuX2Nsb25lcyA9IFtdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSwge1xyXG5cdFx0ZmlsdGVyOiBbICdpdGVtcycsICdzZXR0aW5ncycgXSxcclxuXHRcdHJ1bjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBpLCBuLFxyXG5cdFx0XHRcdGNsb25lcyA9IHRoaXMuX2Nsb25lcyxcclxuXHRcdFx0XHRpdGVtcyA9IHRoaXMuX2l0ZW1zLFxyXG5cdFx0XHRcdGRlbHRhID0gdGhpcy5zZXR0aW5ncy5sb29wID8gY2xvbmVzLmxlbmd0aCAtIE1hdGgubWF4KHRoaXMuc2V0dGluZ3MuaXRlbXMgKiAyLCA0KSA6IDA7XHJcblxyXG5cdFx0XHRmb3IgKGkgPSAwLCBuID0gTWF0aC5hYnMoZGVsdGEgLyAyKTsgaSA8IG47IGkrKykge1xyXG5cdFx0XHRcdGlmIChkZWx0YSA+IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuJHN0YWdlLmNoaWxkcmVuKCkuZXEoaXRlbXMubGVuZ3RoICsgY2xvbmVzLmxlbmd0aCAtIDEpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0Y2xvbmVzLnBvcCgpO1xyXG5cdFx0XHRcdFx0dGhpcy4kc3RhZ2UuY2hpbGRyZW4oKS5lcSgwKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdGNsb25lcy5wb3AoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2xvbmVzLnB1c2goY2xvbmVzLmxlbmd0aCAvIDIpO1xyXG5cdFx0XHRcdFx0dGhpcy4kc3RhZ2UuYXBwZW5kKGl0ZW1zW2Nsb25lc1tjbG9uZXMubGVuZ3RoIC0gMV1dLmNsb25lKCkuYWRkQ2xhc3MoJ2Nsb25lZCcpKTtcclxuXHRcdFx0XHRcdGNsb25lcy5wdXNoKGl0ZW1zLmxlbmd0aCAtIDEgLSAoY2xvbmVzLmxlbmd0aCAtIDEpIC8gMik7XHJcblx0XHRcdFx0XHR0aGlzLiRzdGFnZS5wcmVwZW5kKGl0ZW1zW2Nsb25lc1tjbG9uZXMubGVuZ3RoIC0gMV1dLmNsb25lKCkuYWRkQ2xhc3MoJ2Nsb25lZCcpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LCB7XHJcblx0XHRmaWx0ZXI6IFsgJ3dpZHRoJywgJ2l0ZW1zJywgJ3NldHRpbmdzJyBdLFxyXG5cdFx0cnVuOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHJ0bCA9ICh0aGlzLnNldHRpbmdzLnJ0bCA/IDEgOiAtMSksXHJcblx0XHRcdFx0d2lkdGggPSAodGhpcy53aWR0aCgpIC8gdGhpcy5zZXR0aW5ncy5pdGVtcykudG9GaXhlZCgzKSxcclxuXHRcdFx0XHRjb29yZGluYXRlID0gMCwgbWVyZ2UsIGksIG47XHJcblxyXG5cdFx0XHR0aGlzLl9jb29yZGluYXRlcyA9IFtdO1xyXG5cdFx0XHRmb3IgKGkgPSAwLCBuID0gdGhpcy5fY2xvbmVzLmxlbmd0aCArIHRoaXMuX2l0ZW1zLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG5cdFx0XHRcdG1lcmdlID0gdGhpcy5fbWVyZ2Vyc1t0aGlzLnJlbGF0aXZlKGkpXTtcclxuXHRcdFx0XHRtZXJnZSA9ICh0aGlzLnNldHRpbmdzLm1lcmdlRml0ICYmIE1hdGgubWluKG1lcmdlLCB0aGlzLnNldHRpbmdzLml0ZW1zKSkgfHwgbWVyZ2U7XHJcblx0XHRcdFx0Y29vcmRpbmF0ZSArPSAodGhpcy5zZXR0aW5ncy5hdXRvV2lkdGggPyB0aGlzLl9pdGVtc1t0aGlzLnJlbGF0aXZlKGkpXS53aWR0aCgpICsgdGhpcy5zZXR0aW5ncy5tYXJnaW4gOiB3aWR0aCAqIG1lcmdlKSAqIHJ0bDtcclxuXHJcblx0XHRcdFx0dGhpcy5fY29vcmRpbmF0ZXMucHVzaChjb29yZGluYXRlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sIHtcclxuXHRcdGZpbHRlcjogWyAnd2lkdGgnLCAnaXRlbXMnLCAnc2V0dGluZ3MnIF0sXHJcblx0XHRydW46IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgaSwgbiwgd2lkdGggPSAodGhpcy53aWR0aCgpIC8gdGhpcy5zZXR0aW5ncy5pdGVtcykudG9GaXhlZCgzKSwgY3NzID0ge1xyXG5cdFx0XHRcdCd3aWR0aCc6IE1hdGguYWJzKHRoaXMuX2Nvb3JkaW5hdGVzW3RoaXMuX2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdKSArIHRoaXMuc2V0dGluZ3Muc3RhZ2VQYWRkaW5nICogMixcclxuXHRcdFx0XHQncGFkZGluZy1sZWZ0JzogdGhpcy5zZXR0aW5ncy5zdGFnZVBhZGRpbmcgfHwgJycsXHJcblx0XHRcdFx0J3BhZGRpbmctcmlnaHQnOiB0aGlzLnNldHRpbmdzLnN0YWdlUGFkZGluZyB8fCAnJ1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dGhpcy4kc3RhZ2UuY3NzKGNzcyk7XHJcblxyXG5cdFx0XHRjc3MgPSB7ICd3aWR0aCc6IHRoaXMuc2V0dGluZ3MuYXV0b1dpZHRoID8gJ2F1dG8nIDogd2lkdGggLSB0aGlzLnNldHRpbmdzLm1hcmdpbiB9O1xyXG5cdFx0XHRjc3NbdGhpcy5zZXR0aW5ncy5ydGwgPyAnbWFyZ2luLWxlZnQnIDogJ21hcmdpbi1yaWdodCddID0gdGhpcy5zZXR0aW5ncy5tYXJnaW47XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuc2V0dGluZ3MuYXV0b1dpZHRoICYmICQuZ3JlcCh0aGlzLl9tZXJnZXJzLCBmdW5jdGlvbih2KSB7IHJldHVybiB2ID4gMSB9KS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Zm9yIChpID0gMCwgbiA9IHRoaXMuX2Nvb3JkaW5hdGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG5cdFx0XHRcdFx0Y3NzLndpZHRoID0gTWF0aC5hYnModGhpcy5fY29vcmRpbmF0ZXNbaV0pIC0gTWF0aC5hYnModGhpcy5fY29vcmRpbmF0ZXNbaSAtIDFdIHx8IDApIC0gdGhpcy5zZXR0aW5ncy5tYXJnaW47XHJcblx0XHRcdFx0XHR0aGlzLiRzdGFnZS5jaGlsZHJlbigpLmVxKGkpLmNzcyhjc3MpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLiRzdGFnZS5jaGlsZHJlbigpLmNzcyhjc3MpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSwge1xyXG5cdFx0ZmlsdGVyOiBbICd3aWR0aCcsICdpdGVtcycsICdzZXR0aW5ncycgXSxcclxuXHRcdHJ1bjogZnVuY3Rpb24oY2FjaGUpIHtcclxuXHRcdFx0Y2FjaGUuY3VycmVudCAmJiB0aGlzLnJlc2V0KHRoaXMuJHN0YWdlLmNoaWxkcmVuKCkuaW5kZXgoY2FjaGUuY3VycmVudCkpO1xyXG5cdFx0fVxyXG5cdH0sIHtcclxuXHRcdGZpbHRlcjogWyAncG9zaXRpb24nIF0sXHJcblx0XHRydW46IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmFuaW1hdGUodGhpcy5jb29yZGluYXRlcyh0aGlzLl9jdXJyZW50KSk7XHJcblx0XHR9XHJcblx0fSwge1xyXG5cdFx0ZmlsdGVyOiBbICd3aWR0aCcsICdwb3NpdGlvbicsICdpdGVtcycsICdzZXR0aW5ncycgXSxcclxuXHRcdHJ1bjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBydGwgPSB0aGlzLnNldHRpbmdzLnJ0bCA/IDEgOiAtMSxcclxuXHRcdFx0XHRwYWRkaW5nID0gdGhpcy5zZXR0aW5ncy5zdGFnZVBhZGRpbmcgKiAyLFxyXG5cdFx0XHRcdGJlZ2luID0gdGhpcy5jb29yZGluYXRlcyh0aGlzLmN1cnJlbnQoKSkgKyBwYWRkaW5nLFxyXG5cdFx0XHRcdGVuZCA9IGJlZ2luICsgdGhpcy53aWR0aCgpICogcnRsLFxyXG5cdFx0XHRcdGlubmVyLCBvdXRlciwgbWF0Y2hlcyA9IFtdLCBpLCBuO1xyXG5cclxuXHRcdFx0Zm9yIChpID0gMCwgbiA9IHRoaXMuX2Nvb3JkaW5hdGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG5cdFx0XHRcdGlubmVyID0gdGhpcy5fY29vcmRpbmF0ZXNbaSAtIDFdIHx8IDA7XHJcblx0XHRcdFx0b3V0ZXIgPSBNYXRoLmFicyh0aGlzLl9jb29yZGluYXRlc1tpXSkgKyBwYWRkaW5nICogcnRsO1xyXG5cclxuXHRcdFx0XHRpZiAoKHRoaXMub3AoaW5uZXIsICc8PScsIGJlZ2luKSAmJiAodGhpcy5vcChpbm5lciwgJz4nLCBlbmQpKSlcclxuXHRcdFx0XHRcdHx8ICh0aGlzLm9wKG91dGVyLCAnPCcsIGJlZ2luKSAmJiB0aGlzLm9wKG91dGVyLCAnPicsIGVuZCkpKSB7XHJcblx0XHRcdFx0XHRtYXRjaGVzLnB1c2goaSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRzdGFnZS5jaGlsZHJlbignLicgKyB0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKS5yZW1vdmVDbGFzcyh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcclxuXHRcdFx0dGhpcy4kc3RhZ2UuY2hpbGRyZW4oJzplcSgnICsgbWF0Y2hlcy5qb2luKCcpLCA6ZXEoJykgKyAnKScpLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3MpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MuY2VudGVyKSB7XHJcblx0XHRcdFx0dGhpcy4kc3RhZ2UuY2hpbGRyZW4oJy4nICsgdGhpcy5zZXR0aW5ncy5jZW50ZXJDbGFzcykucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5jZW50ZXJDbGFzcyk7XHJcblx0XHRcdFx0dGhpcy4kc3RhZ2UuY2hpbGRyZW4oKS5lcSh0aGlzLmN1cnJlbnQoKSkuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5jZW50ZXJDbGFzcyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9IF07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpemVzIHRoZSBjYXJvdXNlbC5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnRyaWdnZXIoJ2luaXRpYWxpemUnKTtcclxuXHJcblx0XHR0aGlzLiRlbGVtZW50XHJcblx0XHRcdC5hZGRDbGFzcyh0aGlzLnNldHRpbmdzLmJhc2VDbGFzcylcclxuXHRcdFx0LmFkZENsYXNzKHRoaXMuc2V0dGluZ3MudGhlbWVDbGFzcylcclxuXHRcdFx0LnRvZ2dsZUNsYXNzKCdvd2wtcnRsJywgdGhpcy5zZXR0aW5ncy5ydGwpO1xyXG5cclxuXHRcdC8vIGNoZWNrIHN1cHBvcnRcclxuXHRcdHRoaXMuYnJvd3NlclN1cHBvcnQoKTtcclxuXHJcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5hdXRvV2lkdGggJiYgdGhpcy5zdGF0ZS5pbWFnZXNMb2FkZWQgIT09IHRydWUpIHtcclxuXHRcdFx0dmFyIGltZ3MsIG5lc3RlZFNlbGVjdG9yLCB3aWR0aDtcclxuXHRcdFx0aW1ncyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnaW1nJyk7XHJcblx0XHRcdG5lc3RlZFNlbGVjdG9yID0gdGhpcy5zZXR0aW5ncy5uZXN0ZWRJdGVtU2VsZWN0b3IgPyAnLicgKyB0aGlzLnNldHRpbmdzLm5lc3RlZEl0ZW1TZWxlY3RvciA6IHVuZGVmaW5lZDtcclxuXHRcdFx0d2lkdGggPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKG5lc3RlZFNlbGVjdG9yKS53aWR0aCgpO1xyXG5cclxuXHRcdFx0aWYgKGltZ3MubGVuZ3RoICYmIHdpZHRoIDw9IDApIHtcclxuXHRcdFx0XHR0aGlzLnByZWxvYWRBdXRvV2lkdGhJbWFnZXMoaW1ncyk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy4kZWxlbWVudC5hZGRDbGFzcygnb3dsLWxvYWRpbmcnKTtcclxuXHJcblx0XHQvLyBjcmVhdGUgc3RhZ2VcclxuXHRcdHRoaXMuJHN0YWdlID0gJCgnPCcgKyB0aGlzLnNldHRpbmdzLnN0YWdlRWxlbWVudCArICcgY2xhc3M9XCJvd2wtc3RhZ2VcIi8+JylcclxuXHRcdFx0LndyYXAoJzxkaXYgY2xhc3M9XCJvd2wtc3RhZ2Utb3V0ZXJcIj4nKTtcclxuXHJcblx0XHQvLyBhcHBlbmQgc3RhZ2VcclxuXHRcdHRoaXMuJGVsZW1lbnQuYXBwZW5kKHRoaXMuJHN0YWdlLnBhcmVudCgpKTtcclxuXHJcblx0XHQvLyBhcHBlbmQgY29udGVudFxyXG5cdFx0dGhpcy5yZXBsYWNlKHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oKS5ub3QodGhpcy4kc3RhZ2UucGFyZW50KCkpKTtcclxuXHJcblx0XHQvLyBzZXQgdmlldyB3aWR0aFxyXG5cdFx0dGhpcy5fd2lkdGggPSB0aGlzLiRlbGVtZW50LndpZHRoKCk7XHJcblxyXG5cdFx0Ly8gdXBkYXRlIHZpZXdcclxuXHRcdHRoaXMucmVmcmVzaCgpO1xyXG5cclxuXHRcdHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ293bC1sb2FkaW5nJykuYWRkQ2xhc3MoJ293bC1sb2FkZWQnKTtcclxuXHJcblx0XHQvLyBhdHRhY2ggZ2VuZXJpYyBldmVudHNcclxuXHRcdHRoaXMuZXZlbnRzQ2FsbCgpO1xyXG5cclxuXHRcdC8vIGF0dGFjaCBnZW5lcmljIGV2ZW50c1xyXG5cdFx0dGhpcy5pbnRlcm5hbEV2ZW50cygpO1xyXG5cclxuXHRcdC8vIGF0dGFjaCBjdXN0b20gY29udHJvbCBldmVudHNcclxuXHRcdHRoaXMuYWRkVHJpZ2dlcmFibGVFdmVudHMoKTtcclxuXHJcblx0XHR0aGlzLnRyaWdnZXIoJ2luaXRpYWxpemVkJyk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogU2V0dXBzIHRoZSBjdXJyZW50IHNldHRpbmdzLlxyXG5cdCAqIEB0b2RvIFJlbW92ZSByZXNwb25zaXZlIGNsYXNzZXMuIFdoeSBzaG91bGQgYWRhcHRpdmUgZGVzaWducyBiZSBicm91Z2h0IGludG8gSUU4P1xyXG5cdCAqIEB0b2RvIFN1cHBvcnQgZm9yIG1lZGlhIHF1ZXJpZXMgYnkgdXNpbmcgYG1hdGNoTWVkaWFgIHdvdWxkIGJlIG5pY2UuXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB2aWV3cG9ydCA9IHRoaXMudmlld3BvcnQoKSxcclxuXHRcdFx0b3ZlcndyaXRlcyA9IHRoaXMub3B0aW9ucy5yZXNwb25zaXZlLFxyXG5cdFx0XHRtYXRjaCA9IC0xLFxyXG5cdFx0XHRzZXR0aW5ncyA9IG51bGw7XHJcblxyXG5cdFx0aWYgKCFvdmVyd3JpdGVzKSB7XHJcblx0XHRcdHNldHRpbmdzID0gJC5leHRlbmQoe30sIHRoaXMub3B0aW9ucyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkLmVhY2gob3ZlcndyaXRlcywgZnVuY3Rpb24oYnJlYWtwb2ludCkge1xyXG5cdFx0XHRcdGlmIChicmVha3BvaW50IDw9IHZpZXdwb3J0ICYmIGJyZWFrcG9pbnQgPiBtYXRjaCkge1xyXG5cdFx0XHRcdFx0bWF0Y2ggPSBOdW1iZXIoYnJlYWtwb2ludCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHNldHRpbmdzID0gJC5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3ZlcndyaXRlc1ttYXRjaF0pO1xyXG5cdFx0XHRkZWxldGUgc2V0dGluZ3MucmVzcG9uc2l2ZTtcclxuXHJcblx0XHRcdC8vIHJlc3BvbnNpdmUgY2xhc3NcclxuXHRcdFx0aWYgKHNldHRpbmdzLnJlc3BvbnNpdmVDbGFzcykge1xyXG5cdFx0XHRcdHRoaXMuJGVsZW1lbnQuYXR0cignY2xhc3MnLCBmdW5jdGlvbihpLCBjKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYy5yZXBsYWNlKC9cXGIgb3dsLXJlc3BvbnNpdmUtXFxTKy9nLCAnJyk7XHJcblx0XHRcdFx0fSkuYWRkQ2xhc3MoJ293bC1yZXNwb25zaXZlLScgKyBtYXRjaCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5zZXR0aW5ncyA9PT0gbnVsbCB8fCB0aGlzLl9icmVha3BvaW50ICE9PSBtYXRjaCkge1xyXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NoYW5nZScsIHsgcHJvcGVydHk6IHsgbmFtZTogJ3NldHRpbmdzJywgdmFsdWU6IHNldHRpbmdzIH0gfSk7XHJcblx0XHRcdHRoaXMuX2JyZWFrcG9pbnQgPSBtYXRjaDtcclxuXHRcdFx0dGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG5cdFx0XHR0aGlzLmludmFsaWRhdGUoJ3NldHRpbmdzJyk7XHJcblx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgcHJvcGVydHk6IHsgbmFtZTogJ3NldHRpbmdzJywgdmFsdWU6IHRoaXMuc2V0dGluZ3MgfSB9KTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBVcGRhdGVzIG9wdGlvbiBsb2dpYyBpZiBuZWNlc3NlcnkuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUub3B0aW9uc0xvZ2ljID0gZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBUb2dnbGUgQ2VudGVyIGNsYXNzXHJcblx0XHR0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdvd2wtY2VudGVyJywgdGhpcy5zZXR0aW5ncy5jZW50ZXIpO1xyXG5cclxuXHRcdC8vIGlmIGl0ZW1zIG51bWJlciBpcyBsZXNzIHRoYW4gaW4gYm9keVxyXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MubG9vcCAmJiB0aGlzLl9pdGVtcy5sZW5ndGggPCB0aGlzLnNldHRpbmdzLml0ZW1zKSB7XHJcblx0XHRcdHRoaXMuc2V0dGluZ3MubG9vcCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLnNldHRpbmdzLmF1dG9XaWR0aCkge1xyXG5cdFx0XHR0aGlzLnNldHRpbmdzLnN0YWdlUGFkZGluZyA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLnNldHRpbmdzLm1lcmdlID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogUHJlcGFyZXMgYW4gaXRlbSBiZWZvcmUgYWRkLlxyXG5cdCAqIEB0b2RvIFJlbmFtZSBldmVudCBwYXJhbWV0ZXIgYGNvbnRlbnRgIHRvIGBpdGVtYC5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHJldHVybnMge2pRdWVyeXxIVE1MRWxlbWVudH0gLSBUaGUgaXRlbSBjb250YWluZXIuXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5wcmVwYXJlID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0dmFyIGV2ZW50ID0gdGhpcy50cmlnZ2VyKCdwcmVwYXJlJywgeyBjb250ZW50OiBpdGVtIH0pO1xyXG5cclxuXHRcdGlmICghZXZlbnQuZGF0YSkge1xyXG5cdFx0XHRldmVudC5kYXRhID0gJCgnPCcgKyB0aGlzLnNldHRpbmdzLml0ZW1FbGVtZW50ICsgJy8+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5pdGVtQ2xhc3MpLmFwcGVuZChpdGVtKVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudHJpZ2dlcigncHJlcGFyZWQnLCB7IGNvbnRlbnQ6IGV2ZW50LmRhdGEgfSk7XHJcblxyXG5cdFx0cmV0dXJuIGV2ZW50LmRhdGE7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogVXBkYXRlcyB0aGUgdmlldy5cclxuXHQgKiBAcHVibGljXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpID0gMCxcclxuXHRcdFx0biA9IHRoaXMuX3BpcGUubGVuZ3RoLFxyXG5cdFx0XHRmaWx0ZXIgPSAkLnByb3h5KGZ1bmN0aW9uKHApIHsgcmV0dXJuIHRoaXNbcF0gfSwgdGhpcy5faW52YWxpZGF0ZWQpLFxyXG5cdFx0XHRjYWNoZSA9IHt9O1xyXG5cclxuXHRcdHdoaWxlIChpIDwgbikge1xyXG5cdFx0XHRpZiAodGhpcy5faW52YWxpZGF0ZWQuYWxsIHx8ICQuZ3JlcCh0aGlzLl9waXBlW2ldLmZpbHRlciwgZmlsdGVyKS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0dGhpcy5fcGlwZVtpXS5ydW4oY2FjaGUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGkrKztcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9pbnZhbGlkYXRlZCA9IHt9O1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEdldHMgdGhlIHdpZHRoIG9mIHRoZSB2aWV3LlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge093bC5XaWR0aH0gW2RpbWVuc2lvbj1Pd2wuV2lkdGguRGVmYXVsdF0gLSBUaGUgZGltZW5zaW9uIHRvIHJldHVybi5cclxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSAtIFRoZSB3aWR0aCBvZiB0aGUgdmlldyBpbiBwaXhlbC5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLndpZHRoID0gZnVuY3Rpb24oZGltZW5zaW9uKSB7XHJcblx0XHRkaW1lbnNpb24gPSBkaW1lbnNpb24gfHwgT3dsLldpZHRoLkRlZmF1bHQ7XHJcblx0XHRzd2l0Y2ggKGRpbWVuc2lvbikge1xyXG5cdFx0XHRjYXNlIE93bC5XaWR0aC5Jbm5lcjpcclxuXHRcdFx0Y2FzZSBPd2wuV2lkdGguT3V0ZXI6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3dpZHRoO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLl93aWR0aCAtIHRoaXMuc2V0dGluZ3Muc3RhZ2VQYWRkaW5nICogMiArIHRoaXMuc2V0dGluZ3MubWFyZ2luO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlZnJlc2hlcyB0aGUgY2Fyb3VzZWwgcHJpbWFyaWx5IGZvciBhZGFwdGl2ZSBwdXJwb3Nlcy5cclxuXHQgKiBAcHVibGljXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodGhpcy5faXRlbXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcblx0XHR0aGlzLnRyaWdnZXIoJ3JlZnJlc2gnKTtcclxuXHJcblx0XHR0aGlzLnNldHVwKCk7XHJcblxyXG5cdFx0dGhpcy5vcHRpb25zTG9naWMoKTtcclxuXHJcblx0XHQvLyBoaWRlIGFuZCBzaG93IG1ldGhvZHMgaGVscHMgaGVyZSB0byBzZXQgYSBwcm9wZXIgd2lkdGhzLFxyXG5cdFx0Ly8gdGhpcyBwcmV2ZW50cyBzY3JvbGxiYXIgdG8gYmUgY2FsY3VsYXRlZCBpbiBzdGFnZSB3aWR0aFxyXG5cdFx0dGhpcy4kc3RhZ2UuYWRkQ2xhc3MoJ293bC1yZWZyZXNoJyk7XHJcblxyXG5cdFx0dGhpcy51cGRhdGUoKTtcclxuXHJcblx0XHR0aGlzLiRzdGFnZS5yZW1vdmVDbGFzcygnb3dsLXJlZnJlc2gnKTtcclxuXHJcblx0XHR0aGlzLnN0YXRlLm9yaWVudGF0aW9uID0gd2luZG93Lm9yaWVudGF0aW9uO1xyXG5cclxuXHRcdHRoaXMud2F0Y2hWaXNpYmlsaXR5KCk7XHJcblxyXG5cdFx0dGhpcy50cmlnZ2VyKCdyZWZyZXNoZWQnKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBTYXZlIGludGVybmFsIGV2ZW50IHJlZmVyZW5jZXMgYW5kIGFkZCBldmVudCBiYXNlZCBmdW5jdGlvbnMuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUuZXZlbnRzQ2FsbCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gU2F2ZSBldmVudHMgcmVmZXJlbmNlc1xyXG5cdFx0dGhpcy5lLl9vbkRyYWdTdGFydCA9ICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR0aGlzLm9uRHJhZ1N0YXJ0KGUpO1xyXG5cdFx0fSwgdGhpcyk7XHJcblx0XHR0aGlzLmUuX29uRHJhZ01vdmUgPSAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0dGhpcy5vbkRyYWdNb3ZlKGUpO1xyXG5cdFx0fSwgdGhpcyk7XHJcblx0XHR0aGlzLmUuX29uRHJhZ0VuZCA9ICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR0aGlzLm9uRHJhZ0VuZChlKTtcclxuXHRcdH0sIHRoaXMpO1xyXG5cdFx0dGhpcy5lLl9vblJlc2l6ZSA9ICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR0aGlzLm9uUmVzaXplKGUpO1xyXG5cdFx0fSwgdGhpcyk7XHJcblx0XHR0aGlzLmUuX3RyYW5zaXRpb25FbmQgPSAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0dGhpcy50cmFuc2l0aW9uRW5kKGUpO1xyXG5cdFx0fSwgdGhpcyk7XHJcblx0XHR0aGlzLmUuX3ByZXZlbnRDbGljayA9ICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR0aGlzLnByZXZlbnRDbGljayhlKTtcclxuXHRcdH0sIHRoaXMpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIENoZWNrcyB3aW5kb3cgYHJlc2l6ZWAgZXZlbnQuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUub25UaHJvdHRsZWRSZXNpemUgPSBmdW5jdGlvbigpIHtcclxuXHRcdHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5yZXNpemVUaW1lcik7XHJcblx0XHR0aGlzLnJlc2l6ZVRpbWVyID0gd2luZG93LnNldFRpbWVvdXQodGhpcy5lLl9vblJlc2l6ZSwgdGhpcy5zZXR0aW5ncy5yZXNwb25zaXZlUmVmcmVzaFJhdGUpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIENoZWNrcyB3aW5kb3cgYHJlc2l6ZWAgZXZlbnQuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUub25SZXNpemUgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICghdGhpcy5faXRlbXMubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fd2lkdGggPT09IHRoaXMuJGVsZW1lbnQud2lkdGgoKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMudHJpZ2dlcigncmVzaXplJykuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3dpZHRoID0gdGhpcy4kZWxlbWVudC53aWR0aCgpO1xyXG5cclxuXHRcdHRoaXMuaW52YWxpZGF0ZSgnd2lkdGgnKTtcclxuXHJcblx0XHR0aGlzLnJlZnJlc2goKTtcclxuXHJcblx0XHR0aGlzLnRyaWdnZXIoJ3Jlc2l6ZWQnKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBDaGVja3MgZm9yIHRvdWNoL21vdXNlIGRyYWcgZXZlbnQgdHlwZSBhbmQgYWRkIHJ1biBldmVudCBoYW5kbGVycy5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5ldmVudHNSb3V0ZXIgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0dmFyIHR5cGUgPSBldmVudC50eXBlO1xyXG5cclxuXHRcdGlmICh0eXBlID09PSBcIm1vdXNlZG93blwiIHx8IHR5cGUgPT09IFwidG91Y2hzdGFydFwiKSB7XHJcblx0XHRcdHRoaXMub25EcmFnU3RhcnQoZXZlbnQpO1xyXG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSBcIm1vdXNlbW92ZVwiIHx8IHR5cGUgPT09IFwidG91Y2htb3ZlXCIpIHtcclxuXHRcdFx0dGhpcy5vbkRyYWdNb3ZlKGV2ZW50KTtcclxuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gXCJtb3VzZXVwXCIgfHwgdHlwZSA9PT0gXCJ0b3VjaGVuZFwiKSB7XHJcblx0XHRcdHRoaXMub25EcmFnRW5kKGV2ZW50KTtcclxuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gXCJ0b3VjaGNhbmNlbFwiKSB7XHJcblx0XHRcdHRoaXMub25EcmFnRW5kKGV2ZW50KTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBDaGVja3MgZm9yIHRvdWNoL21vdXNlIGRyYWcgb3B0aW9ucyBhbmQgYWRkIG5lY2Vzc2VyeSBldmVudCBoYW5kbGVycy5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5pbnRlcm5hbEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGlzVG91Y2ggPSBpc1RvdWNoU3VwcG9ydCgpLFxyXG5cdFx0XHRpc1RvdWNoSUUgPSBpc1RvdWNoU3VwcG9ydElFKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MubW91c2VEcmFnKXtcclxuXHRcdFx0dGhpcy4kc3RhZ2Uub24oJ21vdXNlZG93bicsICQucHJveHkoZnVuY3Rpb24oZXZlbnQpIHsgdGhpcy5ldmVudHNSb3V0ZXIoZXZlbnQpIH0sIHRoaXMpKTtcclxuXHRcdFx0dGhpcy4kc3RhZ2Uub24oJ2RyYWdzdGFydCcsIGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2UgfSk7XHJcblx0XHRcdHRoaXMuJHN0YWdlLmdldCgwKS5vbnNlbGVjdHN0YXJ0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBmYWxzZSB9O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy4kZWxlbWVudC5hZGRDbGFzcygnb3dsLXRleHQtc2VsZWN0LW9uJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MudG91Y2hEcmFnICYmICFpc1RvdWNoSUUpe1xyXG5cdFx0XHR0aGlzLiRzdGFnZS5vbigndG91Y2hzdGFydCB0b3VjaGNhbmNlbCcsICQucHJveHkoZnVuY3Rpb24oZXZlbnQpIHsgdGhpcy5ldmVudHNSb3V0ZXIoZXZlbnQpIH0sIHRoaXMpKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjYXRjaCB0cmFuc2l0aW9uRW5kIGV2ZW50XHJcblx0XHRpZiAodGhpcy50cmFuc2l0aW9uRW5kVmVuZG9yKSB7XHJcblx0XHRcdHRoaXMub24odGhpcy4kc3RhZ2UuZ2V0KDApLCB0aGlzLnRyYW5zaXRpb25FbmRWZW5kb3IsIHRoaXMuZS5fdHJhbnNpdGlvbkVuZCwgZmFsc2UpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHJlc3BvbnNpdmVcclxuXHRcdGlmICh0aGlzLnNldHRpbmdzLnJlc3BvbnNpdmUgIT09IGZhbHNlKSB7XHJcblx0XHRcdHRoaXMub24od2luZG93LCAncmVzaXplJywgJC5wcm94eSh0aGlzLm9uVGhyb3R0bGVkUmVzaXplLCB0aGlzKSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogSGFuZGxlcyB0b3VjaHN0YXJ0L21vdXNlZG93biBldmVudC5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnQgLSBUaGUgZXZlbnQgYXJndW1lbnRzLlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUub25EcmFnU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0dmFyIGV2LCBpc1RvdWNoRXZlbnQsIHBhZ2VYLCBwYWdlWSwgYW5pbWF0ZWRQb3M7XHJcblxyXG5cdFx0ZXYgPSBldmVudC5vcmlnaW5hbEV2ZW50IHx8IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcclxuXHJcblx0XHQvLyBwcmV2ZW50IHJpZ2h0IGNsaWNrXHJcblx0XHRpZiAoZXYud2hpY2ggPT09IDMgfHwgdGhpcy5zdGF0ZS5pc1RvdWNoKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZXYudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcclxuXHRcdFx0dGhpcy4kc3RhZ2UuYWRkQ2xhc3MoJ293bC1ncmFiJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy50cmlnZ2VyKCdkcmFnJyk7XHJcblx0XHR0aGlzLmRyYWcuc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblx0XHR0aGlzLnNwZWVkKDApO1xyXG5cdFx0dGhpcy5zdGF0ZS5pc1RvdWNoID0gdHJ1ZTtcclxuXHRcdHRoaXMuc3RhdGUuaXNTY3JvbGxpbmcgPSBmYWxzZTtcclxuXHRcdHRoaXMuc3RhdGUuaXNTd2lwaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmRyYWcuZGlzdGFuY2UgPSAwO1xyXG5cclxuXHRcdHBhZ2VYID0gZ2V0VG91Y2hlcyhldikueDtcclxuXHRcdHBhZ2VZID0gZ2V0VG91Y2hlcyhldikueTtcclxuXHJcblx0XHQvLyBnZXQgc3RhZ2UgcG9zaXRpb24gbGVmdFxyXG5cdFx0dGhpcy5kcmFnLm9mZnNldFggPSB0aGlzLiRzdGFnZS5wb3NpdGlvbigpLmxlZnQ7XHJcblx0XHR0aGlzLmRyYWcub2Zmc2V0WSA9IHRoaXMuJHN0YWdlLnBvc2l0aW9uKCkudG9wO1xyXG5cclxuXHRcdGlmICh0aGlzLnNldHRpbmdzLnJ0bCkge1xyXG5cdFx0XHR0aGlzLmRyYWcub2Zmc2V0WCA9IHRoaXMuJHN0YWdlLnBvc2l0aW9uKCkubGVmdCArIHRoaXMuJHN0YWdlLndpZHRoKCkgLSB0aGlzLndpZHRoKClcclxuXHRcdFx0XHQrIHRoaXMuc2V0dGluZ3MubWFyZ2luO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNhdGNoIHBvc2l0aW9uIC8vIGllIHRvIGZpeFxyXG5cdFx0aWYgKHRoaXMuc3RhdGUuaW5Nb3Rpb24gJiYgdGhpcy5zdXBwb3J0M2QpIHtcclxuXHRcdFx0YW5pbWF0ZWRQb3MgPSB0aGlzLmdldFRyYW5zZm9ybVByb3BlcnR5KCk7XHJcblx0XHRcdHRoaXMuZHJhZy5vZmZzZXRYID0gYW5pbWF0ZWRQb3M7XHJcblx0XHRcdHRoaXMuYW5pbWF0ZShhbmltYXRlZFBvcyk7XHJcblx0XHRcdHRoaXMuc3RhdGUuaW5Nb3Rpb24gPSB0cnVlO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlLmluTW90aW9uICYmICF0aGlzLnN1cHBvcnQzZCkge1xyXG5cdFx0XHR0aGlzLnN0YXRlLmluTW90aW9uID0gZmFsc2U7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmRyYWcuc3RhcnRYID0gcGFnZVggLSB0aGlzLmRyYWcub2Zmc2V0WDtcclxuXHRcdHRoaXMuZHJhZy5zdGFydFkgPSBwYWdlWSAtIHRoaXMuZHJhZy5vZmZzZXRZO1xyXG5cclxuXHRcdHRoaXMuZHJhZy5zdGFydCA9IHBhZ2VYIC0gdGhpcy5kcmFnLnN0YXJ0WDtcclxuXHRcdHRoaXMuZHJhZy50YXJnZXRFbCA9IGV2LnRhcmdldCB8fCBldi5zcmNFbGVtZW50O1xyXG5cdFx0dGhpcy5kcmFnLnVwZGF0ZWRYID0gdGhpcy5kcmFnLnN0YXJ0O1xyXG5cclxuXHRcdC8vIHRvIGRvL2NoZWNrXHJcblx0XHQvLyBwcmV2ZW50IGxpbmtzIGFuZCBpbWFnZXMgZHJhZ2dpbmc7XHJcblx0XHRpZiAodGhpcy5kcmFnLnRhcmdldEVsLnRhZ05hbWUgPT09IFwiSU1HXCIgfHwgdGhpcy5kcmFnLnRhcmdldEVsLnRhZ05hbWUgPT09IFwiQVwiKSB7XHJcblx0XHRcdHRoaXMuZHJhZy50YXJnZXRFbC5kcmFnZ2FibGUgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHQkKGRvY3VtZW50KS5vbignbW91c2Vtb3ZlLm93bC5kcmFnRXZlbnRzIG1vdXNldXAub3dsLmRyYWdFdmVudHMgdG91Y2htb3ZlLm93bC5kcmFnRXZlbnRzIHRvdWNoZW5kLm93bC5kcmFnRXZlbnRzJywgJC5wcm94eShmdW5jdGlvbihldmVudCkge3RoaXMuZXZlbnRzUm91dGVyKGV2ZW50KX0sdGhpcykpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEhhbmRsZXMgdGhlIHRvdWNobW92ZS9tb3VzZW1vdmUgZXZlbnRzLlxyXG5cdCAqIEB0b2RvIFNpbXBsaWZ5XHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IC0gVGhlIGV2ZW50IGFyZ3VtZW50cy5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLm9uRHJhZ01vdmUgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0dmFyIGV2LCBpc1RvdWNoRXZlbnQsIHBhZ2VYLCBwYWdlWSwgbWluVmFsdWUsIG1heFZhbHVlLCBwdWxsO1xyXG5cclxuXHRcdGlmICghdGhpcy5zdGF0ZS5pc1RvdWNoKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5zdGF0ZS5pc1Njcm9sbGluZykge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0ZXYgPSBldmVudC5vcmlnaW5hbEV2ZW50IHx8IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcclxuXHJcblx0XHRwYWdlWCA9IGdldFRvdWNoZXMoZXYpLng7XHJcblx0XHRwYWdlWSA9IGdldFRvdWNoZXMoZXYpLnk7XHJcblxyXG5cdFx0Ly8gRHJhZyBEaXJlY3Rpb25cclxuXHRcdHRoaXMuZHJhZy5jdXJyZW50WCA9IHBhZ2VYIC0gdGhpcy5kcmFnLnN0YXJ0WDtcclxuXHRcdHRoaXMuZHJhZy5jdXJyZW50WSA9IHBhZ2VZIC0gdGhpcy5kcmFnLnN0YXJ0WTtcclxuXHRcdHRoaXMuZHJhZy5kaXN0YW5jZSA9IHRoaXMuZHJhZy5jdXJyZW50WCAtIHRoaXMuZHJhZy5vZmZzZXRYO1xyXG5cclxuXHRcdC8vIENoZWNrIG1vdmUgZGlyZWN0aW9uXHJcblx0XHRpZiAodGhpcy5kcmFnLmRpc3RhbmNlIDwgMCkge1xyXG5cdFx0XHR0aGlzLnN0YXRlLmRpcmVjdGlvbiA9IHRoaXMuc2V0dGluZ3MucnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JztcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5kcmFnLmRpc3RhbmNlID4gMCkge1xyXG5cdFx0XHR0aGlzLnN0YXRlLmRpcmVjdGlvbiA9IHRoaXMuc2V0dGluZ3MucnRsID8gJ2xlZnQnIDogJ3JpZ2h0JztcclxuXHRcdH1cclxuXHRcdC8vIExvb3BcclxuXHRcdGlmICh0aGlzLnNldHRpbmdzLmxvb3ApIHtcclxuXHRcdFx0aWYgKHRoaXMub3AodGhpcy5kcmFnLmN1cnJlbnRYLCAnPicsIHRoaXMuY29vcmRpbmF0ZXModGhpcy5taW5pbXVtKCkpKSAmJiB0aGlzLnN0YXRlLmRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRcdHRoaXMuZHJhZy5jdXJyZW50WCAtPSAodGhpcy5zZXR0aW5ncy5jZW50ZXIgJiYgdGhpcy5jb29yZGluYXRlcygwKSkgLSB0aGlzLmNvb3JkaW5hdGVzKHRoaXMuX2l0ZW1zLmxlbmd0aCk7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5vcCh0aGlzLmRyYWcuY3VycmVudFgsICc8JywgdGhpcy5jb29yZGluYXRlcyh0aGlzLm1heGltdW0oKSkpICYmIHRoaXMuc3RhdGUuZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuXHRcdFx0XHR0aGlzLmRyYWcuY3VycmVudFggKz0gKHRoaXMuc2V0dGluZ3MuY2VudGVyICYmIHRoaXMuY29vcmRpbmF0ZXMoMCkpIC0gdGhpcy5jb29yZGluYXRlcyh0aGlzLl9pdGVtcy5sZW5ndGgpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBwdWxsXHJcblx0XHRcdG1pblZhbHVlID0gdGhpcy5zZXR0aW5ncy5ydGwgPyB0aGlzLmNvb3JkaW5hdGVzKHRoaXMubWF4aW11bSgpKSA6IHRoaXMuY29vcmRpbmF0ZXModGhpcy5taW5pbXVtKCkpO1xyXG5cdFx0XHRtYXhWYWx1ZSA9IHRoaXMuc2V0dGluZ3MucnRsID8gdGhpcy5jb29yZGluYXRlcyh0aGlzLm1pbmltdW0oKSkgOiB0aGlzLmNvb3JkaW5hdGVzKHRoaXMubWF4aW11bSgpKTtcclxuXHRcdFx0cHVsbCA9IHRoaXMuc2V0dGluZ3MucHVsbERyYWcgPyB0aGlzLmRyYWcuZGlzdGFuY2UgLyA1IDogMDtcclxuXHRcdFx0dGhpcy5kcmFnLmN1cnJlbnRYID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5kcmFnLmN1cnJlbnRYLCBtaW5WYWx1ZSArIHB1bGwpLCBtYXhWYWx1ZSArIHB1bGwpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIExvY2sgYnJvd3NlciBpZiBzd2lwaW5nIGhvcml6b250YWxcclxuXHJcblx0XHRpZiAoKHRoaXMuZHJhZy5kaXN0YW5jZSA+IDggfHwgdGhpcy5kcmFnLmRpc3RhbmNlIDwgLTgpKSB7XHJcblx0XHRcdGlmIChldi5wcmV2ZW50RGVmYXVsdCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRldi5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuc3RhdGUuaXNTd2lwaW5nID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmRyYWcudXBkYXRlZFggPSB0aGlzLmRyYWcuY3VycmVudFg7XHJcblxyXG5cdFx0Ly8gTG9jayBPd2wgaWYgc2Nyb2xsaW5nXHJcblx0XHRpZiAoKHRoaXMuZHJhZy5jdXJyZW50WSA+IDE2IHx8IHRoaXMuZHJhZy5jdXJyZW50WSA8IC0xNikgJiYgdGhpcy5zdGF0ZS5pc1N3aXBpbmcgPT09IGZhbHNlKSB7XHJcblx0XHRcdHRoaXMuc3RhdGUuaXNTY3JvbGxpbmcgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmRyYWcudXBkYXRlZFggPSB0aGlzLmRyYWcuc3RhcnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5hbmltYXRlKHRoaXMuZHJhZy51cGRhdGVkWCk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogSGFuZGxlcyB0aGUgdG91Y2hlbmQvbW91c2V1cCBldmVudHMuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUub25EcmFnRW5kID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdHZhciBjb21wYXJlVGltZXMsIGRpc3RhbmNlQWJzLCBjbG9zZXN0O1xyXG5cclxuXHRcdGlmICghdGhpcy5zdGF0ZS5pc1RvdWNoKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNldXAnKSB7XHJcblx0XHRcdHRoaXMuJHN0YWdlLnJlbW92ZUNsYXNzKCdvd2wtZ3JhYicpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudHJpZ2dlcignZHJhZ2dlZCcpO1xyXG5cclxuXHRcdC8vIHByZXZlbnQgbGlua3MgYW5kIGltYWdlcyBkcmFnZ2luZztcclxuXHRcdHRoaXMuZHJhZy50YXJnZXRFbC5yZW1vdmVBdHRyaWJ1dGUoXCJkcmFnZ2FibGVcIik7XHJcblxyXG5cdFx0Ly8gcmVtb3ZlIGRyYWcgZXZlbnQgbGlzdGVuZXJzXHJcblxyXG5cdFx0dGhpcy5zdGF0ZS5pc1RvdWNoID0gZmFsc2U7XHJcblx0XHR0aGlzLnN0YXRlLmlzU2Nyb2xsaW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLnN0YXRlLmlzU3dpcGluZyA9IGZhbHNlO1xyXG5cclxuXHRcdC8vIHRvIGNoZWNrXHJcblx0XHRpZiAodGhpcy5kcmFnLmRpc3RhbmNlID09PSAwICYmIHRoaXMuc3RhdGUuaW5Nb3Rpb24gIT09IHRydWUpIHtcclxuXHRcdFx0dGhpcy5zdGF0ZS5pbk1vdGlvbiA9IGZhbHNlO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcHJldmVudCBjbGlja3Mgd2hpbGUgc2Nyb2xsaW5nXHJcblxyXG5cdFx0dGhpcy5kcmFnLmVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHRcdGNvbXBhcmVUaW1lcyA9IHRoaXMuZHJhZy5lbmRUaW1lIC0gdGhpcy5kcmFnLnN0YXJ0VGltZTtcclxuXHRcdGRpc3RhbmNlQWJzID0gTWF0aC5hYnModGhpcy5kcmFnLmRpc3RhbmNlKTtcclxuXHJcblx0XHQvLyB0byB0ZXN0XHJcblx0XHRpZiAoZGlzdGFuY2VBYnMgPiAzIHx8IGNvbXBhcmVUaW1lcyA+IDMwMCkge1xyXG5cdFx0XHR0aGlzLnJlbW92ZUNsaWNrKHRoaXMuZHJhZy50YXJnZXRFbCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y2xvc2VzdCA9IHRoaXMuY2xvc2VzdCh0aGlzLmRyYWcudXBkYXRlZFgpO1xyXG5cclxuXHRcdHRoaXMuc3BlZWQodGhpcy5zZXR0aW5ncy5kcmFnRW5kU3BlZWQgfHwgdGhpcy5zZXR0aW5ncy5zbWFydFNwZWVkKTtcclxuXHRcdHRoaXMuY3VycmVudChjbG9zZXN0KTtcclxuXHRcdHRoaXMuaW52YWxpZGF0ZSgncG9zaXRpb24nKTtcclxuXHRcdHRoaXMudXBkYXRlKCk7XHJcblxyXG5cdFx0Ly8gaWYgcHVsbERyYWcgaXMgb2ZmIHRoZW4gZmlyZSB0cmFuc2l0aW9uRW5kIGV2ZW50IG1hbnVhbGx5IHdoZW4gc3RpY2tcclxuXHRcdC8vIHRvIGJvcmRlclxyXG5cdFx0aWYgKCF0aGlzLnNldHRpbmdzLnB1bGxEcmFnICYmIHRoaXMuZHJhZy51cGRhdGVkWCA9PT0gdGhpcy5jb29yZGluYXRlcyhjbG9zZXN0KSkge1xyXG5cdFx0XHR0aGlzLnRyYW5zaXRpb25FbmQoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmRyYWcuZGlzdGFuY2UgPSAwO1xyXG5cclxuXHRcdCQoZG9jdW1lbnQpLm9mZignLm93bC5kcmFnRXZlbnRzJyk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQXR0YWNoZXMgYHByZXZlbnRDbGlja2AgdG8gZGlzYWJsZSBsaW5rIHdoaWxlIHN3aXBwaW5nLlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbdGFyZ2V0XSAtIFRoZSB0YXJnZXQgb2YgdGhlIGBjbGlja2AgZXZlbnQuXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5yZW1vdmVDbGljayA9IGZ1bmN0aW9uKHRhcmdldCkge1xyXG5cdFx0dGhpcy5kcmFnLnRhcmdldEVsID0gdGFyZ2V0O1xyXG5cdFx0JCh0YXJnZXQpLm9uKCdjbGljay5wcmV2ZW50Q2xpY2snLCB0aGlzLmUuX3ByZXZlbnRDbGljayk7XHJcblx0XHQvLyB0byBtYWtlIHN1cmUgY2xpY2sgaXMgcmVtb3ZlZDpcclxuXHRcdHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKHRhcmdldCkub2ZmKCdjbGljay5wcmV2ZW50Q2xpY2snKTtcclxuXHRcdH0sIDMwMCk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogU3VwcHJlc3NlcyBjbGljayBldmVudC5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHBhcmFtIHtFdmVudH0gZXYgLSBUaGUgZXZlbnQgYXJndW1lbnRzLlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUucHJldmVudENsaWNrID0gZnVuY3Rpb24oZXYpIHtcclxuXHRcdGlmIChldi5wcmV2ZW50RGVmYXVsdCkge1xyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZXYucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGlmIChldi5zdG9wUHJvcGFnYXRpb24pIHtcclxuXHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHR9XHJcblx0XHQkKGV2LnRhcmdldCkub2ZmKCdjbGljay5wcmV2ZW50Q2xpY2snKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBDYXRjaGVzIHN0YWdlIHBvc2l0aW9uIHdoaWxlIGFuaW1hdGUgKG9ubHkgQ1NTMykuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqIEByZXR1cm5zXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm1Qcm9wZXJ0eSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRyYW5zZm9ybSwgbWF0cml4M2Q7XHJcblxyXG5cdFx0dHJhbnNmb3JtID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy4kc3RhZ2UuZ2V0KDApLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHRoaXMudmVuZG9yTmFtZSArICd0cmFuc2Zvcm0nKTtcclxuXHRcdC8vIHZhciB0cmFuc2Zvcm0gPSB0aGlzLiRzdGFnZS5jc3ModGhpcy52ZW5kb3JOYW1lICsgJ3RyYW5zZm9ybScpXHJcblx0XHR0cmFuc2Zvcm0gPSB0cmFuc2Zvcm0ucmVwbGFjZSgvbWF0cml4KDNkKT9cXCh8XFwpL2csICcnKS5zcGxpdCgnLCcpO1xyXG5cdFx0bWF0cml4M2QgPSB0cmFuc2Zvcm0ubGVuZ3RoID09PSAxNjtcclxuXHJcblx0XHRyZXR1cm4gbWF0cml4M2QgIT09IHRydWUgPyB0cmFuc2Zvcm1bNF0gOiB0cmFuc2Zvcm1bMTJdO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEdldHMgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIGNsb3Nlc3QgaXRlbSBmb3IgYSBjb29yZGluYXRlLlxyXG5cdCAqIEB0b2RvIFNldHRpbmcgYGZyZWVEcmFnYCBtYWtlcyBgY2xvc2VzdGAgbm90IHJldXNhYmxlLiBTZWUgIzE2NS5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGNvb3JkaW5hdGUgLSBUaGUgY29vcmRpbmF0ZSBpbiBwaXhlbC5cclxuXHQgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gVGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIHRoZSBjbG9zZXN0IGl0ZW0uXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5jbG9zZXN0ID0gZnVuY3Rpb24oY29vcmRpbmF0ZSkge1xyXG5cdFx0dmFyIHBvc2l0aW9uID0gLTEsIHB1bGwgPSAzMCwgd2lkdGggPSB0aGlzLndpZHRoKCksIGNvb3JkaW5hdGVzID0gdGhpcy5jb29yZGluYXRlcygpO1xyXG5cclxuXHRcdGlmICghdGhpcy5zZXR0aW5ncy5mcmVlRHJhZykge1xyXG5cdFx0XHQvLyBjaGVjayBjbG9zZXN0IGl0ZW1cclxuXHRcdFx0JC5lYWNoKGNvb3JkaW5hdGVzLCAkLnByb3h5KGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkge1xyXG5cdFx0XHRcdGlmIChjb29yZGluYXRlID4gdmFsdWUgLSBwdWxsICYmIGNvb3JkaW5hdGUgPCB2YWx1ZSArIHB1bGwpIHtcclxuXHRcdFx0XHRcdHBvc2l0aW9uID0gaW5kZXg7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLm9wKGNvb3JkaW5hdGUsICc8JywgdmFsdWUpXHJcblx0XHRcdFx0XHQmJiB0aGlzLm9wKGNvb3JkaW5hdGUsICc+JywgY29vcmRpbmF0ZXNbaW5kZXggKyAxXSB8fCB2YWx1ZSAtIHdpZHRoKSkge1xyXG5cdFx0XHRcdFx0cG9zaXRpb24gPSB0aGlzLnN0YXRlLmRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gaW5kZXggKyAxIDogaW5kZXg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBwb3NpdGlvbiA9PT0gLTE7XHJcblx0XHRcdH0sIHRoaXMpKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuc2V0dGluZ3MubG9vcCkge1xyXG5cdFx0XHQvLyBub24gbG9vcCBib3VuZHJpZXNcclxuXHRcdFx0aWYgKHRoaXMub3AoY29vcmRpbmF0ZSwgJz4nLCBjb29yZGluYXRlc1t0aGlzLm1pbmltdW0oKV0pKSB7XHJcblx0XHRcdFx0cG9zaXRpb24gPSBjb29yZGluYXRlID0gdGhpcy5taW5pbXVtKCk7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5vcChjb29yZGluYXRlLCAnPCcsIGNvb3JkaW5hdGVzW3RoaXMubWF4aW11bSgpXSkpIHtcclxuXHRcdFx0XHRwb3NpdGlvbiA9IGNvb3JkaW5hdGUgPSB0aGlzLm1heGltdW0oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBwb3NpdGlvbjtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBBbmltYXRlcyB0aGUgc3RhZ2UuXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBjb29yZGluYXRlIC0gVGhlIGNvb3JkaW5hdGUgaW4gcGl4ZWxzLlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uKGNvb3JkaW5hdGUpIHtcclxuXHRcdHRoaXMudHJpZ2dlcigndHJhbnNsYXRlJyk7XHJcblx0XHR0aGlzLnN0YXRlLmluTW90aW9uID0gdGhpcy5zcGVlZCgpID4gMDtcclxuXHJcblx0XHRpZiAodGhpcy5zdXBwb3J0M2QpIHtcclxuXHRcdFx0dGhpcy4kc3RhZ2UuY3NzKHtcclxuXHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgnICsgY29vcmRpbmF0ZSArICdweCcgKyAnLDBweCwgMHB4KScsXHJcblx0XHRcdFx0dHJhbnNpdGlvbjogKHRoaXMuc3BlZWQoKSAvIDEwMDApICsgJ3MnXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlLmlzVG91Y2gpIHtcclxuXHRcdFx0dGhpcy4kc3RhZ2UuY3NzKHtcclxuXHRcdFx0XHRsZWZ0OiBjb29yZGluYXRlICsgJ3B4J1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuJHN0YWdlLmFuaW1hdGUoe1xyXG5cdFx0XHRcdGxlZnQ6IGNvb3JkaW5hdGVcclxuXHRcdFx0fSwgdGhpcy5zcGVlZCgpIC8gMTAwMCwgdGhpcy5zZXR0aW5ncy5mYWxsYmFja0Vhc2luZywgJC5wcm94eShmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5zdGF0ZS5pbk1vdGlvbikge1xyXG5cdFx0XHRcdFx0dGhpcy50cmFuc2l0aW9uRW5kKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB0aGlzKSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogU2V0cyB0aGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgaXRlbS5cclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtwb3NpdGlvbl0gLSBUaGUgbmV3IGFic29sdXRlIHBvc2l0aW9uIG9yIG5vdGhpbmcgdG8gbGVhdmUgaXQgdW5jaGFuZ2VkLlxyXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IC0gVGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGl0ZW0uXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuXHRcdGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLl9jdXJyZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9pdGVtcy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcclxuXHRcdH1cclxuXHJcblx0XHRwb3NpdGlvbiA9IHRoaXMubm9ybWFsaXplKHBvc2l0aW9uKTtcclxuXHJcblx0XHRpZiAodGhpcy5fY3VycmVudCAhPT0gcG9zaXRpb24pIHtcclxuXHRcdFx0dmFyIGV2ZW50ID0gdGhpcy50cmlnZ2VyKCdjaGFuZ2UnLCB7IHByb3BlcnR5OiB7IG5hbWU6ICdwb3NpdGlvbicsIHZhbHVlOiBwb3NpdGlvbiB9IH0pO1xyXG5cclxuXHRcdFx0aWYgKGV2ZW50LmRhdGEgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHBvc2l0aW9uID0gdGhpcy5ub3JtYWxpemUoZXZlbnQuZGF0YSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX2N1cnJlbnQgPSBwb3NpdGlvbjtcclxuXHJcblx0XHRcdHRoaXMuaW52YWxpZGF0ZSgncG9zaXRpb24nKTtcclxuXHJcblx0XHRcdHRoaXMudHJpZ2dlcignY2hhbmdlZCcsIHsgcHJvcGVydHk6IHsgbmFtZTogJ3Bvc2l0aW9uJywgdmFsdWU6IHRoaXMuX2N1cnJlbnQgfSB9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fY3VycmVudDtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBJbnZhbGlkYXRlcyB0aGUgZ2l2ZW4gcGFydCBvZiB0aGUgdXBkYXRlIHJvdXRpbmUuXHJcblx0ICogQHBhcmFtIHtTdHJpbmd9IHBhcnQgLSBUaGUgcGFydCB0byBpbnZhbGlkYXRlLlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uKHBhcnQpIHtcclxuXHRcdHRoaXMuX2ludmFsaWRhdGVkW3BhcnRdID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlc2V0cyB0aGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgaXRlbS5cclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIC0gVGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIHRoZSBuZXcgaXRlbS5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuXHRcdHBvc2l0aW9uID0gdGhpcy5ub3JtYWxpemUocG9zaXRpb24pO1xyXG5cclxuXHRcdGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9zcGVlZCA9IDA7XHJcblx0XHR0aGlzLl9jdXJyZW50ID0gcG9zaXRpb247XHJcblxyXG5cdFx0dGhpcy5zdXBwcmVzcyhbICd0cmFuc2xhdGUnLCAndHJhbnNsYXRlZCcgXSk7XHJcblxyXG5cdFx0dGhpcy5hbmltYXRlKHRoaXMuY29vcmRpbmF0ZXMocG9zaXRpb24pKTtcclxuXHJcblx0XHR0aGlzLnJlbGVhc2UoWyAndHJhbnNsYXRlJywgJ3RyYW5zbGF0ZWQnIF0pO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIE5vcm1hbGl6ZXMgYW4gYWJzb2x1dGUgb3IgYSByZWxhdGl2ZSBwb3NpdGlvbiBmb3IgYW4gaXRlbS5cclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIC0gVGhlIGFic29sdXRlIG9yIHJlbGF0aXZlIHBvc2l0aW9uIHRvIG5vcm1hbGl6ZS5cclxuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZWxhdGl2ZT1mYWxzZV0gLSBXaGV0aGVyIHRoZSBnaXZlbiBwb3NpdGlvbiBpcyByZWxhdGl2ZSBvciBub3QuXHJcblx0ICogQHJldHVybnMge051bWJlcn0gLSBUaGUgbm9ybWFsaXplZCBwb3NpdGlvbi5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBvc2l0aW9uLCByZWxhdGl2ZSkge1xyXG5cdFx0dmFyIG4gPSAocmVsYXRpdmUgPyB0aGlzLl9pdGVtcy5sZW5ndGggOiB0aGlzLl9pdGVtcy5sZW5ndGggKyB0aGlzLl9jbG9uZXMubGVuZ3RoKTtcclxuXHJcblx0XHRpZiAoISQuaXNOdW1lcmljKHBvc2l0aW9uKSB8fCBuIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9jbG9uZXMubGVuZ3RoKSB7XHJcblx0XHRcdHBvc2l0aW9uID0gKChwb3NpdGlvbiAlIG4pICsgbikgJSBuO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cG9zaXRpb24gPSBNYXRoLm1heCh0aGlzLm1pbmltdW0ocmVsYXRpdmUpLCBNYXRoLm1pbih0aGlzLm1heGltdW0ocmVsYXRpdmUpLCBwb3NpdGlvbikpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBwb3NpdGlvbjtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0cyBhbiBhYnNvbHV0ZSBwb3NpdGlvbiBmb3IgYW4gaXRlbSBpbnRvIGEgcmVsYXRpdmUgcG9zaXRpb24uXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiAtIFRoZSBhYnNvbHV0ZSBwb3NpdGlvbiB0byBjb252ZXJ0LlxyXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IC0gVGhlIGNvbnZlcnRlZCBwb3NpdGlvbi5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLnJlbGF0aXZlID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuXHRcdHBvc2l0aW9uID0gdGhpcy5ub3JtYWxpemUocG9zaXRpb24pO1xyXG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbiAtIHRoaXMuX2Nsb25lcy5sZW5ndGggLyAyO1xyXG5cdFx0cmV0dXJuIHRoaXMubm9ybWFsaXplKHBvc2l0aW9uLCB0cnVlKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBHZXRzIHRoZSBtYXhpbXVtIHBvc2l0aW9uIGZvciBhbiBpdGVtLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZWxhdGl2ZT1mYWxzZV0gLSBXaGV0aGVyIHRvIHJldHVybiBhbiBhYnNvbHV0ZSBwb3NpdGlvbiBvciBhIHJlbGF0aXZlIHBvc2l0aW9uLlxyXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5tYXhpbXVtID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcclxuXHRcdHZhciBtYXhpbXVtLCB3aWR0aCwgaSA9IDAsIGNvb3JkaW5hdGUsXHJcblx0XHRcdHNldHRpbmdzID0gdGhpcy5zZXR0aW5ncztcclxuXHJcblx0XHRpZiAocmVsYXRpdmUpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuX2l0ZW1zLmxlbmd0aCAtIDE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFzZXR0aW5ncy5sb29wICYmIHNldHRpbmdzLmNlbnRlcikge1xyXG5cdFx0XHRtYXhpbXVtID0gdGhpcy5faXRlbXMubGVuZ3RoIC0gMTtcclxuXHRcdH0gZWxzZSBpZiAoIXNldHRpbmdzLmxvb3AgJiYgIXNldHRpbmdzLmNlbnRlcikge1xyXG5cdFx0XHRtYXhpbXVtID0gdGhpcy5faXRlbXMubGVuZ3RoIC0gc2V0dGluZ3MuaXRlbXM7XHJcblx0XHR9IGVsc2UgaWYgKHNldHRpbmdzLmxvb3AgfHwgc2V0dGluZ3MuY2VudGVyKSB7XHJcblx0XHRcdG1heGltdW0gPSB0aGlzLl9pdGVtcy5sZW5ndGggKyBzZXR0aW5ncy5pdGVtcztcclxuXHRcdH0gZWxzZSBpZiAoc2V0dGluZ3MuYXV0b1dpZHRoIHx8IHNldHRpbmdzLm1lcmdlKSB7XHJcblx0XHRcdHJldmVydCA9IHNldHRpbmdzLnJ0bCA/IDEgOiAtMTtcclxuXHRcdFx0d2lkdGggPSB0aGlzLiRzdGFnZS53aWR0aCgpIC0gdGhpcy4kZWxlbWVudC53aWR0aCgpO1xyXG5cdFx0XHR3aGlsZSAoY29vcmRpbmF0ZSA9IHRoaXMuY29vcmRpbmF0ZXMoaSkpIHtcclxuXHRcdFx0XHRpZiAoY29vcmRpbmF0ZSAqIHJldmVydCA+PSB3aWR0aCkge1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG1heGltdW0gPSArK2k7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93ICdDYW4gbm90IGRldGVjdCBtYXhpbXVtIGFic29sdXRlIHBvc2l0aW9uLidcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbWF4aW11bTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBHZXRzIHRoZSBtaW5pbXVtIHBvc2l0aW9uIGZvciBhbiBpdGVtLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZWxhdGl2ZT1mYWxzZV0gLSBXaGV0aGVyIHRvIHJldHVybiBhbiBhYnNvbHV0ZSBwb3NpdGlvbiBvciBhIHJlbGF0aXZlIHBvc2l0aW9uLlxyXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5taW5pbXVtID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcclxuXHRcdGlmIChyZWxhdGl2ZSkge1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fY2xvbmVzLmxlbmd0aCAvIDI7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogR2V0cyBhbiBpdGVtIGF0IHRoZSBzcGVjaWZpZWQgcmVsYXRpdmUgcG9zaXRpb24uXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBbcG9zaXRpb25dIC0gVGhlIHJlbGF0aXZlIHBvc2l0aW9uIG9mIHRoZSBpdGVtLlxyXG5cdCAqIEByZXR1cm4ge2pRdWVyeXxBcnJheS48alF1ZXJ5Pn0gLSBUaGUgaXRlbSBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24gb3IgYWxsIGl0ZW1zIGlmIG5vIHBvc2l0aW9uIHdhcyBnaXZlbi5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLml0ZW1zID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuXHRcdGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLl9pdGVtcy5zbGljZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBvc2l0aW9uID0gdGhpcy5ub3JtYWxpemUocG9zaXRpb24sIHRydWUpO1xyXG5cdFx0cmV0dXJuIHRoaXMuX2l0ZW1zW3Bvc2l0aW9uXTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBHZXRzIGFuIGl0ZW0gYXQgdGhlIHNwZWNpZmllZCByZWxhdGl2ZSBwb3NpdGlvbi5cclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtwb3NpdGlvbl0gLSBUaGUgcmVsYXRpdmUgcG9zaXRpb24gb2YgdGhlIGl0ZW0uXHJcblx0ICogQHJldHVybiB7alF1ZXJ5fEFycmF5LjxqUXVlcnk+fSAtIFRoZSBpdGVtIGF0IHRoZSBnaXZlbiBwb3NpdGlvbiBvciBhbGwgaXRlbXMgaWYgbm8gcG9zaXRpb24gd2FzIGdpdmVuLlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUubWVyZ2VycyA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XHJcblx0XHRpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5fbWVyZ2Vycy5zbGljZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBvc2l0aW9uID0gdGhpcy5ub3JtYWxpemUocG9zaXRpb24sIHRydWUpO1xyXG5cdFx0cmV0dXJuIHRoaXMuX21lcmdlcnNbcG9zaXRpb25dO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEdldHMgdGhlIGFic29sdXRlIHBvc2l0aW9ucyBvZiBjbG9uZXMgZm9yIGFuIGl0ZW0uXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBbcG9zaXRpb25dIC0gVGhlIHJlbGF0aXZlIHBvc2l0aW9uIG9mIHRoZSBpdGVtLlxyXG5cdCAqIEByZXR1cm5zIHtBcnJheS48TnVtYmVyPn0gLSBUaGUgYWJzb2x1dGUgcG9zaXRpb25zIG9mIGNsb25lcyBmb3IgdGhlIGl0ZW0gb3IgYWxsIGlmIG5vIHBvc2l0aW9uIHdhcyBnaXZlbi5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLmNsb25lcyA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XHJcblx0XHR2YXIgb2RkID0gdGhpcy5fY2xvbmVzLmxlbmd0aCAvIDIsXHJcblx0XHRcdGV2ZW4gPSBvZGQgKyB0aGlzLl9pdGVtcy5sZW5ndGgsXHJcblx0XHRcdG1hcCA9IGZ1bmN0aW9uKGluZGV4KSB7IHJldHVybiBpbmRleCAlIDIgPT09IDAgPyBldmVuICsgaW5kZXggLyAyIDogb2RkIC0gKGluZGV4ICsgMSkgLyAyIH07XHJcblxyXG5cdFx0aWYgKHBvc2l0aW9uID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0cmV0dXJuICQubWFwKHRoaXMuX2Nsb25lcywgZnVuY3Rpb24odiwgaSkgeyByZXR1cm4gbWFwKGkpIH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAkLm1hcCh0aGlzLl9jbG9uZXMsIGZ1bmN0aW9uKHYsIGkpIHsgcmV0dXJuIHYgPT09IHBvc2l0aW9uID8gbWFwKGkpIDogbnVsbCB9KTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBTZXRzIHRoZSBjdXJyZW50IGFuaW1hdGlvbiBzcGVlZC5cclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVlZF0gLSBUaGUgYW5pbWF0aW9uIHNwZWVkIGluIG1pbGxpc2Vjb25kcyBvciBub3RoaW5nIHRvIGxlYXZlIGl0IHVuY2hhbmdlZC5cclxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSAtIFRoZSBjdXJyZW50IGFuaW1hdGlvbiBzcGVlZCBpbiBtaWxsaXNlY29uZHMuXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5zcGVlZCA9IGZ1bmN0aW9uKHNwZWVkKSB7XHJcblx0XHRpZiAoc3BlZWQgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR0aGlzLl9zcGVlZCA9IHNwZWVkO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLl9zcGVlZDtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBHZXRzIHRoZSBjb29yZGluYXRlIG9mIGFuIGl0ZW0uXHJcblx0ICogQHRvZG8gVGhlIG5hbWUgb2YgdGhpcyBtZXRob2QgaXMgbWlzc2xlYW5kaW5nLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gLSBUaGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIGl0ZW0gd2l0aGluIGBtaW5pbXVtKClgIGFuZCBgbWF4aW11bSgpYC5cclxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfEFycmF5LjxOdW1iZXI+fSAtIFRoZSBjb29yZGluYXRlIG9mIHRoZSBpdGVtIGluIHBpeGVsIG9yIGFsbCBjb29yZGluYXRlcy5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLmNvb3JkaW5hdGVzID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuXHRcdHZhciBjb29yZGluYXRlID0gbnVsbDtcclxuXHJcblx0XHRpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRyZXR1cm4gJC5tYXAodGhpcy5fY29vcmRpbmF0ZXMsICQucHJveHkoZnVuY3Rpb24oY29vcmRpbmF0ZSwgaW5kZXgpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5jb29yZGluYXRlcyhpbmRleCk7XHJcblx0XHRcdH0sIHRoaXMpKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5jZW50ZXIpIHtcclxuXHRcdFx0Y29vcmRpbmF0ZSA9IHRoaXMuX2Nvb3JkaW5hdGVzW3Bvc2l0aW9uXTtcclxuXHRcdFx0Y29vcmRpbmF0ZSArPSAodGhpcy53aWR0aCgpIC0gY29vcmRpbmF0ZSArICh0aGlzLl9jb29yZGluYXRlc1twb3NpdGlvbiAtIDFdIHx8IDApKSAvIDIgKiAodGhpcy5zZXR0aW5ncy5ydGwgPyAtMSA6IDEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29vcmRpbmF0ZSA9IHRoaXMuX2Nvb3JkaW5hdGVzW3Bvc2l0aW9uIC0gMV0gfHwgMDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY29vcmRpbmF0ZTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBDYWxjdWxhdGVzIHRoZSBzcGVlZCBmb3IgYSB0cmFuc2xhdGlvbi5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGZyb20gLSBUaGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIHN0YXJ0IGl0ZW0uXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IHRvIC0gVGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIHRoZSB0YXJnZXQgaXRlbS5cclxuXHQgKiBAcGFyYW0ge051bWJlcn0gW2ZhY3Rvcj11bmRlZmluZWRdIC0gVGhlIHRpbWUgZmFjdG9yIGluIG1pbGxpc2Vjb25kcy5cclxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSAtIFRoZSB0aW1lIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHRyYW5zbGF0aW9uLlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUuZHVyYXRpb24gPSBmdW5jdGlvbihmcm9tLCB0bywgZmFjdG9yKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgoTWF0aC5hYnModG8gLSBmcm9tKSwgMSksIDYpICogTWF0aC5hYnMoKGZhY3RvciB8fCB0aGlzLnNldHRpbmdzLnNtYXJ0U3BlZWQpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBTbGlkZXMgdG8gdGhlIHNwZWNpZmllZCBpdGVtLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gLSBUaGUgcG9zaXRpb24gb2YgdGhlIGl0ZW0uXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVlZF0gLSBUaGUgdGltZSBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSB0cmFuc2l0aW9uLlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUudG8gPSBmdW5jdGlvbihwb3NpdGlvbiwgc3BlZWQpIHtcclxuXHRcdGlmICh0aGlzLnNldHRpbmdzLmxvb3ApIHtcclxuXHRcdFx0dmFyIGRpc3RhbmNlID0gcG9zaXRpb24gLSB0aGlzLnJlbGF0aXZlKHRoaXMuY3VycmVudCgpKSxcclxuXHRcdFx0XHRyZXZlcnQgPSB0aGlzLmN1cnJlbnQoKSxcclxuXHRcdFx0XHRiZWZvcmUgPSB0aGlzLmN1cnJlbnQoKSxcclxuXHRcdFx0XHRhZnRlciA9IHRoaXMuY3VycmVudCgpICsgZGlzdGFuY2UsXHJcblx0XHRcdFx0ZGlyZWN0aW9uID0gYmVmb3JlIC0gYWZ0ZXIgPCAwID8gdHJ1ZSA6IGZhbHNlLFxyXG5cdFx0XHRcdGl0ZW1zID0gdGhpcy5fY2xvbmVzLmxlbmd0aCArIHRoaXMuX2l0ZW1zLmxlbmd0aDtcclxuXHJcblx0XHRcdGlmIChhZnRlciA8IHRoaXMuc2V0dGluZ3MuaXRlbXMgJiYgZGlyZWN0aW9uID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdHJldmVydCA9IGJlZm9yZSArIHRoaXMuX2l0ZW1zLmxlbmd0aDtcclxuXHRcdFx0XHR0aGlzLnJlc2V0KHJldmVydCk7XHJcblx0XHRcdH0gZWxzZSBpZiAoYWZ0ZXIgPj0gaXRlbXMgLSB0aGlzLnNldHRpbmdzLml0ZW1zICYmIGRpcmVjdGlvbiA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdHJldmVydCA9IGJlZm9yZSAtIHRoaXMuX2l0ZW1zLmxlbmd0aDtcclxuXHRcdFx0XHR0aGlzLnJlc2V0KHJldmVydCk7XHJcblx0XHRcdH1cclxuXHRcdFx0d2luZG93LmNsZWFyVGltZW91dCh0aGlzLmUuX2dvVG9Mb29wKTtcclxuXHRcdFx0dGhpcy5lLl9nb1RvTG9vcCA9IHdpbmRvdy5zZXRUaW1lb3V0KCQucHJveHkoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5zcGVlZCh0aGlzLmR1cmF0aW9uKHRoaXMuY3VycmVudCgpLCByZXZlcnQgKyBkaXN0YW5jZSwgc3BlZWQpKTtcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnQocmV2ZXJ0ICsgZGlzdGFuY2UpO1xyXG5cdFx0XHRcdHRoaXMudXBkYXRlKCk7XHJcblx0XHRcdH0sIHRoaXMpLCAzMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnNwZWVkKHRoaXMuZHVyYXRpb24odGhpcy5jdXJyZW50KCksIHBvc2l0aW9uLCBzcGVlZCkpO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnQocG9zaXRpb24pO1xyXG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFNsaWRlcyB0byB0aGUgbmV4dCBpdGVtLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge051bWJlcn0gW3NwZWVkXSAtIFRoZSB0aW1lIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHRyYW5zaXRpb24uXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oc3BlZWQpIHtcclxuXHRcdHNwZWVkID0gc3BlZWQgfHwgZmFsc2U7XHJcblx0XHR0aGlzLnRvKHRoaXMucmVsYXRpdmUodGhpcy5jdXJyZW50KCkpICsgMSwgc3BlZWQpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFNsaWRlcyB0byB0aGUgcHJldmlvdXMgaXRlbS5cclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVlZF0gLSBUaGUgdGltZSBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSB0cmFuc2l0aW9uLlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uKHNwZWVkKSB7XHJcblx0XHRzcGVlZCA9IHNwZWVkIHx8IGZhbHNlO1xyXG5cdFx0dGhpcy50byh0aGlzLnJlbGF0aXZlKHRoaXMuY3VycmVudCgpKSAtIDEsIHNwZWVkKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBIYW5kbGVzIHRoZSBlbmQgb2YgYW4gYW5pbWF0aW9uLlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudCAtIFRoZSBldmVudCBhcmd1bWVudHMuXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS50cmFuc2l0aW9uRW5kID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcblx0XHQvLyBpZiBjc3MyIGFuaW1hdGlvbiB0aGVuIGV2ZW50IG9iamVjdCBpcyB1bmRlZmluZWRcclxuXHRcdGlmIChldmVudCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHRcdFx0Ly8gQ2F0Y2ggb25seSBvd2wtc3RhZ2UgdHJhbnNpdGlvbkVuZCBldmVudFxyXG5cdFx0XHRpZiAoKGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50IHx8IGV2ZW50Lm9yaWdpbmFsVGFyZ2V0KSAhPT0gdGhpcy4kc3RhZ2UuZ2V0KDApKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5zdGF0ZS5pbk1vdGlvbiA9IGZhbHNlO1xyXG5cdFx0dGhpcy50cmlnZ2VyKCd0cmFuc2xhdGVkJyk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogR2V0cyB2aWV3cG9ydCB3aWR0aC5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHJldHVybiB7TnVtYmVyfSAtIFRoZSB3aWR0aCBpbiBwaXhlbC5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLnZpZXdwb3J0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgd2lkdGg7XHJcblx0XHRpZiAodGhpcy5vcHRpb25zLnJlc3BvbnNpdmVCYXNlRWxlbWVudCAhPT0gd2luZG93KSB7XHJcblx0XHRcdHdpZHRoID0gJCh0aGlzLm9wdGlvbnMucmVzcG9uc2l2ZUJhc2VFbGVtZW50KS53aWR0aCgpO1xyXG5cdFx0fSBlbHNlIGlmICh3aW5kb3cuaW5uZXJXaWR0aCkge1xyXG5cdFx0XHR3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cdFx0fSBlbHNlIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSB7XHJcblx0XHRcdHdpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgJ0NhbiBub3QgZGV0ZWN0IHZpZXdwb3J0IHdpZHRoLic7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gd2lkdGg7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogUmVwbGFjZXMgdGhlIGN1cnJlbnQgY29udGVudC5cclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudHxqUXVlcnl8U3RyaW5nfSBjb250ZW50IC0gVGhlIG5ldyBjb250ZW50LlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuXHRcdHRoaXMuJHN0YWdlLmVtcHR5KCk7XHJcblx0XHR0aGlzLl9pdGVtcyA9IFtdO1xyXG5cclxuXHRcdGlmIChjb250ZW50KSB7XHJcblx0XHRcdGNvbnRlbnQgPSAoY29udGVudCBpbnN0YW5jZW9mIGpRdWVyeSkgPyBjb250ZW50IDogJChjb250ZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5uZXN0ZWRJdGVtU2VsZWN0b3IpIHtcclxuXHRcdFx0Y29udGVudCA9IGNvbnRlbnQuZmluZCgnLicgKyB0aGlzLnNldHRpbmdzLm5lc3RlZEl0ZW1TZWxlY3Rvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29udGVudC5maWx0ZXIoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm5vZGVUeXBlID09PSAxO1xyXG5cdFx0fSkuZWFjaCgkLnByb3h5KGZ1bmN0aW9uKGluZGV4LCBpdGVtKSB7XHJcblx0XHRcdGl0ZW0gPSB0aGlzLnByZXBhcmUoaXRlbSk7XHJcblx0XHRcdHRoaXMuJHN0YWdlLmFwcGVuZChpdGVtKTtcclxuXHRcdFx0dGhpcy5faXRlbXMucHVzaChpdGVtKTtcclxuXHRcdFx0dGhpcy5fbWVyZ2Vycy5wdXNoKGl0ZW0uZmluZCgnW2RhdGEtbWVyZ2VdJykuYW5kU2VsZignW2RhdGEtbWVyZ2VdJykuYXR0cignZGF0YS1tZXJnZScpICogMSB8fCAxKTtcclxuXHRcdH0sIHRoaXMpKTtcclxuXHJcblx0XHR0aGlzLnJlc2V0KCQuaXNOdW1lcmljKHRoaXMuc2V0dGluZ3Muc3RhcnRQb3NpdGlvbikgPyB0aGlzLnNldHRpbmdzLnN0YXJ0UG9zaXRpb24gOiAwKTtcclxuXHJcblx0XHR0aGlzLmludmFsaWRhdGUoJ2l0ZW1zJyk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQWRkcyBhbiBpdGVtLlxyXG5cdCAqIEB0b2RvIFVzZSBgaXRlbWAgaW5zdGVhZCBvZiBgY29udGVudGAgZm9yIHRoZSBldmVudCBhcmd1bWVudHMuXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8alF1ZXJ5fFN0cmluZ30gY29udGVudCAtIFRoZSBpdGVtIGNvbnRlbnQgdG8gYWRkLlxyXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBbcG9zaXRpb25dIC0gVGhlIHJlbGF0aXZlIHBvc2l0aW9uIGF0IHdoaWNoIHRvIGluc2VydCB0aGUgaXRlbSBvdGhlcndpc2UgdGhlIGl0ZW0gd2lsbCBiZSBhZGRlZCB0byB0aGUgZW5kLlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oY29udGVudCwgcG9zaXRpb24pIHtcclxuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IHRoaXMuX2l0ZW1zLmxlbmd0aCA6IHRoaXMubm9ybWFsaXplKHBvc2l0aW9uLCB0cnVlKTtcclxuXHJcblx0XHR0aGlzLnRyaWdnZXIoJ2FkZCcsIHsgY29udGVudDogY29udGVudCwgcG9zaXRpb246IHBvc2l0aW9uIH0pO1xyXG5cclxuXHRcdGlmICh0aGlzLl9pdGVtcy5sZW5ndGggPT09IDAgfHwgcG9zaXRpb24gPT09IHRoaXMuX2l0ZW1zLmxlbmd0aCkge1xyXG5cdFx0XHR0aGlzLiRzdGFnZS5hcHBlbmQoY29udGVudCk7XHJcblx0XHRcdHRoaXMuX2l0ZW1zLnB1c2goY29udGVudCk7XHJcblx0XHRcdHRoaXMuX21lcmdlcnMucHVzaChjb250ZW50LmZpbmQoJ1tkYXRhLW1lcmdlXScpLmFuZFNlbGYoJ1tkYXRhLW1lcmdlXScpLmF0dHIoJ2RhdGEtbWVyZ2UnKSAqIDEgfHwgMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9pdGVtc1twb3NpdGlvbl0uYmVmb3JlKGNvbnRlbnQpO1xyXG5cdFx0XHR0aGlzLl9pdGVtcy5zcGxpY2UocG9zaXRpb24sIDAsIGNvbnRlbnQpO1xyXG5cdFx0XHR0aGlzLl9tZXJnZXJzLnNwbGljZShwb3NpdGlvbiwgMCwgY29udGVudC5maW5kKCdbZGF0YS1tZXJnZV0nKS5hbmRTZWxmKCdbZGF0YS1tZXJnZV0nKS5hdHRyKCdkYXRhLW1lcmdlJykgKiAxIHx8IDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuaW52YWxpZGF0ZSgnaXRlbXMnKTtcclxuXHJcblx0XHR0aGlzLnRyaWdnZXIoJ2FkZGVkJywgeyBjb250ZW50OiBjb250ZW50LCBwb3NpdGlvbjogcG9zaXRpb24gfSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogUmVtb3ZlcyBhbiBpdGVtIGJ5IGl0cyBwb3NpdGlvbi5cclxuXHQgKiBAdG9kbyBVc2UgYGl0ZW1gIGluc3RlYWQgb2YgYGNvbnRlbnRgIGZvciB0aGUgZXZlbnQgYXJndW1lbnRzLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gLSBUaGUgcmVsYXRpdmUgcG9zaXRpb24gb2YgdGhlIGl0ZW0gdG8gcmVtb3ZlLlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuXHRcdHBvc2l0aW9uID0gdGhpcy5ub3JtYWxpemUocG9zaXRpb24sIHRydWUpO1xyXG5cclxuXHRcdGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnRyaWdnZXIoJ3JlbW92ZScsIHsgY29udGVudDogdGhpcy5faXRlbXNbcG9zaXRpb25dLCBwb3NpdGlvbjogcG9zaXRpb24gfSk7XHJcblxyXG5cdFx0dGhpcy5faXRlbXNbcG9zaXRpb25dLnJlbW92ZSgpO1xyXG5cdFx0dGhpcy5faXRlbXMuc3BsaWNlKHBvc2l0aW9uLCAxKTtcclxuXHRcdHRoaXMuX21lcmdlcnMuc3BsaWNlKHBvc2l0aW9uLCAxKTtcclxuXHJcblx0XHR0aGlzLmludmFsaWRhdGUoJ2l0ZW1zJyk7XHJcblxyXG5cdFx0dGhpcy50cmlnZ2VyKCdyZW1vdmVkJywgeyBjb250ZW50OiBudWxsLCBwb3NpdGlvbjogcG9zaXRpb24gfSk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQWRkcyB0cmlnZ2VyYWJsZSBldmVudHMuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUuYWRkVHJpZ2dlcmFibGVFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBoYW5kbGVyID0gJC5wcm94eShmdW5jdGlvbihjYWxsYmFjaywgZXZlbnQpIHtcclxuXHRcdFx0cmV0dXJuICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGlmIChlLnJlbGF0ZWRUYXJnZXQgIT09IHRoaXMpIHtcclxuXHRcdFx0XHRcdHRoaXMuc3VwcHJlc3MoWyBldmVudCBdKTtcclxuXHRcdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcblx0XHRcdFx0XHR0aGlzLnJlbGVhc2UoWyBldmVudCBdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRoaXMpO1xyXG5cdFx0fSwgdGhpcyk7XHJcblxyXG5cdFx0JC5lYWNoKHtcclxuXHRcdFx0J25leHQnOiB0aGlzLm5leHQsXHJcblx0XHRcdCdwcmV2JzogdGhpcy5wcmV2LFxyXG5cdFx0XHQndG8nOiB0aGlzLnRvLFxyXG5cdFx0XHQnZGVzdHJveSc6IHRoaXMuZGVzdHJveSxcclxuXHRcdFx0J3JlZnJlc2gnOiB0aGlzLnJlZnJlc2gsXHJcblx0XHRcdCdyZXBsYWNlJzogdGhpcy5yZXBsYWNlLFxyXG5cdFx0XHQnYWRkJzogdGhpcy5hZGQsXHJcblx0XHRcdCdyZW1vdmUnOiB0aGlzLnJlbW92ZVxyXG5cdFx0fSwgJC5wcm94eShmdW5jdGlvbihldmVudCwgY2FsbGJhY2spIHtcclxuXHRcdFx0dGhpcy4kZWxlbWVudC5vbihldmVudCArICcub3dsLmNhcm91c2VsJywgaGFuZGxlcihjYWxsYmFjaywgZXZlbnQgKyAnLm93bC5jYXJvdXNlbCcpKTtcclxuXHRcdH0sIHRoaXMpKTtcclxuXHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogV2F0Y2hlcyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgY2Fyb3VzZWwgZWxlbWVudC5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS53YXRjaFZpc2liaWxpdHkgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHQvLyB0ZXN0IG9uIHplcHRvXHJcblx0XHRpZiAoIWlzRWxWaXNpYmxlKHRoaXMuJGVsZW1lbnQuZ2V0KDApKSkge1xyXG5cdFx0XHR0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdvd2wtaGlkZGVuJyk7XHJcblx0XHRcdHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuZS5fY2hlY2tWaXNpYmlsZSk7XHJcblx0XHRcdHRoaXMuZS5fY2hlY2tWaXNpYmlsZSA9IHdpbmRvdy5zZXRJbnRlcnZhbCgkLnByb3h5KGNoZWNrVmlzaWJsZSwgdGhpcyksIDUwMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gaXNFbFZpc2libGUoZWwpIHtcclxuXHRcdFx0cmV0dXJuIGVsLm9mZnNldFdpZHRoID4gMCAmJiBlbC5vZmZzZXRIZWlnaHQgPiAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGNoZWNrVmlzaWJsZSgpIHtcclxuXHRcdFx0aWYgKGlzRWxWaXNpYmxlKHRoaXMuJGVsZW1lbnQuZ2V0KDApKSkge1xyXG5cdFx0XHRcdHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ293bC1oaWRkZW4nKTtcclxuXHRcdFx0XHR0aGlzLnJlZnJlc2goKTtcclxuXHRcdFx0XHR3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmUuX2NoZWNrVmlzaWJpbGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogUHJlbG9hZHMgaW1hZ2VzIHdpdGggYXV0byB3aWR0aC5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHRvZG8gU3RpbGwgdG8gdGVzdFxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUucHJlbG9hZEF1dG9XaWR0aEltYWdlcyA9IGZ1bmN0aW9uKGltZ3MpIHtcclxuXHRcdHZhciBsb2FkZWQsIHRoYXQsICRlbCwgaW1nO1xyXG5cclxuXHRcdGxvYWRlZCA9IDA7XHJcblx0XHR0aGF0ID0gdGhpcztcclxuXHRcdGltZ3MuZWFjaChmdW5jdGlvbihpLCBlbCkge1xyXG5cdFx0XHQkZWwgPSAkKGVsKTtcclxuXHRcdFx0aW1nID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0XHRpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0bG9hZGVkKys7XHJcblx0XHRcdFx0JGVsLmF0dHIoJ3NyYycsIGltZy5zcmMpO1xyXG5cdFx0XHRcdCRlbC5jc3MoJ29wYWNpdHknLCAxKTtcclxuXHRcdFx0XHRpZiAobG9hZGVkID49IGltZ3MubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHR0aGF0LnN0YXRlLmltYWdlc0xvYWRlZCA9IHRydWU7XHJcblx0XHRcdFx0XHR0aGF0LmluaXRpYWxpemUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpbWcuc3JjID0gJGVsLmF0dHIoJ3NyYycpIHx8ICRlbC5hdHRyKCdkYXRhLXNyYycpIHx8ICRlbC5hdHRyKCdkYXRhLXNyYy1yZXRpbmEnKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIERlc3Ryb3lzIHRoZSBjYXJvdXNlbC5cclxuXHQgKiBAcHVibGljXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0aWYgKHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3ModGhpcy5zZXR0aW5ncy50aGVtZUNsYXNzKSkge1xyXG5cdFx0XHR0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKHRoaXMuc2V0dGluZ3MudGhlbWVDbGFzcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MucmVzcG9uc2l2ZSAhPT0gZmFsc2UpIHtcclxuXHRcdFx0JCh3aW5kb3cpLm9mZigncmVzaXplLm93bC5jYXJvdXNlbCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLnRyYW5zaXRpb25FbmRWZW5kb3IpIHtcclxuXHRcdFx0dGhpcy5vZmYodGhpcy4kc3RhZ2UuZ2V0KDApLCB0aGlzLnRyYW5zaXRpb25FbmRWZW5kb3IsIHRoaXMuZS5fdHJhbnNpdGlvbkVuZCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICggdmFyIGkgaW4gdGhpcy5fcGx1Z2lucykge1xyXG5cdFx0XHR0aGlzLl9wbHVnaW5zW2ldLmRlc3Ryb3koKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5tb3VzZURyYWcgfHwgdGhpcy5zZXR0aW5ncy50b3VjaERyYWcpIHtcclxuXHRcdFx0dGhpcy4kc3RhZ2Uub2ZmKCdtb3VzZWRvd24gdG91Y2hzdGFydCB0b3VjaGNhbmNlbCcpO1xyXG5cdFx0XHQkKGRvY3VtZW50KS5vZmYoJy5vd2wuZHJhZ0V2ZW50cycpO1xyXG5cdFx0XHR0aGlzLiRzdGFnZS5nZXQoMCkub25zZWxlY3RzdGFydCA9IGZ1bmN0aW9uKCkge307XHJcblx0XHRcdHRoaXMuJHN0YWdlLm9mZignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oKSB7IHJldHVybiBmYWxzZSB9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyByZW1vdmUgZXZlbnQgaGFuZGxlcnMgaW4gdGhlIFwiLm93bC5jYXJvdXNlbFwiIG5hbWVzcGFjZVxyXG5cdFx0dGhpcy4kZWxlbWVudC5vZmYoJy5vd2wnKTtcclxuXHJcblx0XHR0aGlzLiRzdGFnZS5jaGlsZHJlbignLmNsb25lZCcpLnJlbW92ZSgpO1xyXG5cdFx0dGhpcy5lID0gbnVsbDtcclxuXHRcdHRoaXMuJGVsZW1lbnQucmVtb3ZlRGF0YSgnb3dsQ2Fyb3VzZWwnKTtcclxuXHJcblx0XHR0aGlzLiRzdGFnZS5jaGlsZHJlbigpLmNvbnRlbnRzKCkudW53cmFwKCk7XHJcblx0XHR0aGlzLiRzdGFnZS5jaGlsZHJlbigpLnVud3JhcCgpO1xyXG5cdFx0dGhpcy4kc3RhZ2UudW53cmFwKCk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogT3BlcmF0b3JzIHRvIGNhbGN1bGF0ZSByaWdodC10by1sZWZ0IGFuZCBsZWZ0LXRvLXJpZ2h0LlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKiBAcGFyYW0ge051bWJlcn0gW2FdIC0gVGhlIGxlZnQgc2lkZSBvcGVyYW5kLlxyXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBbb10gLSBUaGUgb3BlcmF0b3IuXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtiXSAtIFRoZSByaWdodCBzaWRlIG9wZXJhbmQuXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5vcCA9IGZ1bmN0aW9uKGEsIG8sIGIpIHtcclxuXHRcdHZhciBydGwgPSB0aGlzLnNldHRpbmdzLnJ0bDtcclxuXHRcdHN3aXRjaCAobykge1xyXG5cdFx0XHRjYXNlICc8JzpcclxuXHRcdFx0XHRyZXR1cm4gcnRsID8gYSA+IGIgOiBhIDwgYjtcclxuXHRcdFx0Y2FzZSAnPic6XHJcblx0XHRcdFx0cmV0dXJuIHJ0bCA/IGEgPCBiIDogYSA+IGI7XHJcblx0XHRcdGNhc2UgJz49JzpcclxuXHRcdFx0XHRyZXR1cm4gcnRsID8gYSA8PSBiIDogYSA+PSBiO1xyXG5cdFx0XHRjYXNlICc8PSc6XHJcblx0XHRcdFx0cmV0dXJuIHJ0bCA/IGEgPj0gYiA6IGEgPD0gYjtcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBBdHRhY2hlcyB0byBhbiBpbnRlcm5hbCBldmVudC5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFRoZSBldmVudCBzb3VyY2UuXHJcblx0ICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IC0gVGhlIGV2ZW50IG5hbWUuXHJcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgLSBUaGUgZXZlbnQgaGFuZGxlciB0byBhdHRhY2guXHJcblx0ICogQHBhcmFtIHtCb29sZWFufSBjYXB0dXJlIC0gV2V0aGVyIHRoZSBldmVudCBzaG91bGQgYmUgaGFuZGxlZCBhdCB0aGUgY2FwdHVyaW5nIHBoYXNlIG9yIG5vdC5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZWxlbWVudCwgZXZlbnQsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XHJcblx0XHRpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XHJcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGNhcHR1cmUpO1xyXG5cdFx0fSBlbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KSB7XHJcblx0XHRcdGVsZW1lbnQuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBsaXN0ZW5lcik7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogRGV0YWNoZXMgZnJvbSBhbiBpbnRlcm5hbCBldmVudC5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFRoZSBldmVudCBzb3VyY2UuXHJcblx0ICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IC0gVGhlIGV2ZW50IG5hbWUuXHJcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgLSBUaGUgYXR0YWNoZWQgZXZlbnQgaGFuZGxlciB0byBkZXRhY2guXHJcblx0ICogQHBhcmFtIHtCb29sZWFufSBjYXB0dXJlIC0gV2V0aGVyIHRoZSBhdHRhY2hlZCBldmVudCBoYW5kbGVyIHdhcyByZWdpc3RlcmVkIGFzIGEgY2FwdHVyaW5nIGxpc3RlbmVyIG9yIG5vdC5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKGVsZW1lbnQsIGV2ZW50LCBsaXN0ZW5lciwgY2FwdHVyZSkge1xyXG5cdFx0aWYgKGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xyXG5cdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBjYXB0dXJlKTtcclxuXHRcdH0gZWxzZSBpZiAoZWxlbWVudC5kZXRhY2hFdmVudCkge1xyXG5cdFx0XHRlbGVtZW50LmRldGFjaEV2ZW50KCdvbicgKyBldmVudCwgbGlzdGVuZXIpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRyaWdnZXJzIGFuIHB1YmxpYyBldmVudC5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgZXZlbnQgbmFtZS5cclxuXHQgKiBAcGFyYW0geyp9IFtkYXRhPW51bGxdIC0gVGhlIGV2ZW50IGRhdGEuXHJcblx0ICogQHBhcmFtIHtTdHJpbmd9IFtuYW1lc3BhY2U9Lm93bC5jYXJvdXNlbF0gLSBUaGUgZXZlbnQgbmFtZXNwYWNlLlxyXG5cdCAqIEByZXR1cm5zIHtFdmVudH0gLSBUaGUgZXZlbnQgYXJndW1lbnRzLlxyXG5cdCAqL1xyXG5cdE93bC5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uKG5hbWUsIGRhdGEsIG5hbWVzcGFjZSkge1xyXG5cdFx0dmFyIHN0YXR1cyA9IHtcclxuXHRcdFx0aXRlbTogeyBjb3VudDogdGhpcy5faXRlbXMubGVuZ3RoLCBpbmRleDogdGhpcy5jdXJyZW50KCkgfVxyXG5cdFx0fSwgaGFuZGxlciA9ICQuY2FtZWxDYXNlKFxyXG5cdFx0XHQkLmdyZXAoWyAnb24nLCBuYW1lLCBuYW1lc3BhY2UgXSwgZnVuY3Rpb24odikgeyByZXR1cm4gdiB9KVxyXG5cdFx0XHRcdC5qb2luKCctJykudG9Mb3dlckNhc2UoKVxyXG5cdFx0KSwgZXZlbnQgPSAkLkV2ZW50KFxyXG5cdFx0XHRbIG5hbWUsICdvd2wnLCBuYW1lc3BhY2UgfHwgJ2Nhcm91c2VsJyBdLmpvaW4oJy4nKS50b0xvd2VyQ2FzZSgpLFxyXG5cdFx0XHQkLmV4dGVuZCh7IHJlbGF0ZWRUYXJnZXQ6IHRoaXMgfSwgc3RhdHVzLCBkYXRhKVxyXG5cdFx0KTtcclxuXHJcblx0XHRpZiAoIXRoaXMuX3N1cHJlc3NbbmFtZV0pIHtcclxuXHRcdFx0JC5lYWNoKHRoaXMuX3BsdWdpbnMsIGZ1bmN0aW9uKG5hbWUsIHBsdWdpbikge1xyXG5cdFx0XHRcdGlmIChwbHVnaW4ub25UcmlnZ2VyKSB7XHJcblx0XHRcdFx0XHRwbHVnaW4ub25UcmlnZ2VyKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy4kZWxlbWVudC50cmlnZ2VyKGV2ZW50KTtcclxuXHJcblx0XHRcdGlmICh0aGlzLnNldHRpbmdzICYmIHR5cGVvZiB0aGlzLnNldHRpbmdzW2hhbmRsZXJdID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0dGhpcy5zZXR0aW5nc1toYW5kbGVyXS5hcHBseSh0aGlzLCBldmVudCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZXZlbnQ7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogU3VwcHJlc3NlcyBldmVudHMuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqIEBwYXJhbSB7QXJyYXkuPFN0cmluZz59IGV2ZW50cyAtIFRoZSBldmVudHMgdG8gc3VwcHJlc3MuXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5zdXBwcmVzcyA9IGZ1bmN0aW9uKGV2ZW50cykge1xyXG5cdFx0JC5lYWNoKGV2ZW50cywgJC5wcm94eShmdW5jdGlvbihpbmRleCwgZXZlbnQpIHtcclxuXHRcdFx0dGhpcy5fc3VwcmVzc1tldmVudF0gPSB0cnVlO1xyXG5cdFx0fSwgdGhpcykpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmVsZWFzZXMgc3VwcHJlc3NlZCBldmVudHMuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqIEBwYXJhbSB7QXJyYXkuPFN0cmluZz59IGV2ZW50cyAtIFRoZSBldmVudHMgdG8gcmVsZWFzZS5cclxuXHQgKi9cclxuXHRPd2wucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbihldmVudHMpIHtcclxuXHRcdCQuZWFjaChldmVudHMsICQucHJveHkoZnVuY3Rpb24oaW5kZXgsIGV2ZW50KSB7XHJcblx0XHRcdGRlbGV0ZSB0aGlzLl9zdXByZXNzW2V2ZW50XTtcclxuXHRcdH0sIHRoaXMpKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENoZWNrcyB0aGUgYXZhaWxhYmlsaXR5IG9mIHNvbWUgYnJvd3NlciBmZWF0dXJlcy5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICovXHJcblx0T3dsLnByb3RvdHlwZS5icm93c2VyU3VwcG9ydCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5zdXBwb3J0M2QgPSBpc1BlcnNwZWN0aXZlKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuc3VwcG9ydDNkKSB7XHJcblx0XHRcdHRoaXMudHJhbnNmb3JtVmVuZG9yID0gaXNUcmFuc2Zvcm0oKTtcclxuXHJcblx0XHRcdC8vIHRha2UgdHJhbnNpdGlvbmVuZCBldmVudCBuYW1lIGJ5IGRldGVjdGluZyB0cmFuc2l0aW9uXHJcblx0XHRcdHZhciBlbmRWZW5kb3JzID0gWyAndHJhbnNpdGlvbmVuZCcsICd3ZWJraXRUcmFuc2l0aW9uRW5kJywgJ3RyYW5zaXRpb25lbmQnLCAnb1RyYW5zaXRpb25FbmQnIF07XHJcblx0XHRcdHRoaXMudHJhbnNpdGlvbkVuZFZlbmRvciA9IGVuZFZlbmRvcnNbaXNUcmFuc2l0aW9uKCldO1xyXG5cclxuXHRcdFx0Ly8gdGFrZSB2ZW5kb3IgbmFtZSBmcm9tIHRyYW5zZm9ybSBuYW1lXHJcblx0XHRcdHRoaXMudmVuZG9yTmFtZSA9IHRoaXMudHJhbnNmb3JtVmVuZG9yLnJlcGxhY2UoL1RyYW5zZm9ybS9pLCAnJyk7XHJcblx0XHRcdHRoaXMudmVuZG9yTmFtZSA9IHRoaXMudmVuZG9yTmFtZSAhPT0gJycgPyAnLScgKyB0aGlzLnZlbmRvck5hbWUudG9Mb3dlckNhc2UoKSArICctJyA6ICcnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuc3RhdGUub3JpZW50YXRpb24gPSB3aW5kb3cub3JpZW50YXRpb247XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogR2V0IHRvdWNoL2RyYWcgY29vcmRpbmF0cy5cclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqIEBwYXJhbSB7ZXZlbnR9IC0gbW91c2Vkb3duL3RvdWNoc3RhcnQgZXZlbnRcclxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSAtIENvbnRhaW5zIFggYW5kIFkgb2YgY3VycmVudCBtb3VzZS90b3VjaCBwb3NpdGlvblxyXG5cdCAqL1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUb3VjaGVzKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQudG91Y2hlcyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0eDogZXZlbnQudG91Y2hlc1swXS5wYWdlWCxcclxuXHRcdFx0XHR5OiBldmVudC50b3VjaGVzWzBdLnBhZ2VZXHJcblx0XHRcdH07XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGV2ZW50LnRvdWNoZXMgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRpZiAoZXZlbnQucGFnZVggIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHR4OiBldmVudC5wYWdlWCxcclxuXHRcdFx0XHRcdHk6IGV2ZW50LnBhZ2VZXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdGlmIChldmVudC5wYWdlWCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHR4OiBldmVudC5jbGllbnRYLFxyXG5cdFx0XHRcdFx0eTogZXZlbnQuY2xpZW50WVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENoZWNrcyBmb3IgQ1NTIHN1cHBvcnQuXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSAtIFRoZSBDU1MgcHJvcGVydGllcyB0byBjaGVjayBmb3IuXHJcblx0ICogQHJldHVybnMge0FycmF5fSAtIENvbnRhaW5zIHRoZSBzdXBwb3J0ZWQgQ1NTIHByb3BlcnR5IG5hbWUgYW5kIGl0cyBpbmRleCBvciBgZmFsc2VgLlxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGlzU3R5bGVTdXBwb3J0ZWQoYXJyYXkpIHtcclxuXHRcdHZhciBwLCBzLCBmYWtlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIGxpc3QgPSBhcnJheTtcclxuXHRcdGZvciAocCBpbiBsaXN0KSB7XHJcblx0XHRcdHMgPSBsaXN0W3BdO1xyXG5cdFx0XHRpZiAodHlwZW9mIGZha2Uuc3R5bGVbc10gIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0ZmFrZSA9IG51bGw7XHJcblx0XHRcdFx0cmV0dXJuIFsgcywgcCBdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gWyBmYWxzZSBdO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ2hlY2tzIGZvciBDU1MgdHJhbnNpdGlvbiBzdXBwb3J0LlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICogQHRvZG8gUmVhbHkgYmFkIGRlc2lnblxyXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gaXNUcmFuc2l0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGlzU3R5bGVTdXBwb3J0ZWQoWyAndHJhbnNpdGlvbicsICdXZWJraXRUcmFuc2l0aW9uJywgJ01velRyYW5zaXRpb24nLCAnT1RyYW5zaXRpb24nIF0pWzFdO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ2hlY2tzIGZvciBDU1MgdHJhbnNmb3JtIHN1cHBvcnQuXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3VwcG9ydGVkIHByb3BlcnR5IG5hbWUgb3IgZmFsc2UuXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gaXNUcmFuc2Zvcm0oKSB7XHJcblx0XHRyZXR1cm4gaXNTdHlsZVN1cHBvcnRlZChbICd0cmFuc2Zvcm0nLCAnV2Via2l0VHJhbnNmb3JtJywgJ01velRyYW5zZm9ybScsICdPVHJhbnNmb3JtJywgJ21zVHJhbnNmb3JtJyBdKVswXTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENoZWNrcyBmb3IgQ1NTIHBlcnNwZWN0aXZlIHN1cHBvcnQuXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc3VwcG9ydGVkIHByb3BlcnR5IG5hbWUgb3IgZmFsc2UuXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gaXNQZXJzcGVjdGl2ZSgpIHtcclxuXHRcdHJldHVybiBpc1N0eWxlU3VwcG9ydGVkKFsgJ3BlcnNwZWN0aXZlJywgJ3dlYmtpdFBlcnNwZWN0aXZlJywgJ01velBlcnNwZWN0aXZlJywgJ09QZXJzcGVjdGl2ZScsICdNc1BlcnNwZWN0aXZlJyBdKVswXTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENoZWNrcyB3ZXRoZXIgdG91Y2ggaXMgc3VwcG9ydGVkIG9yIG5vdC5cclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqIEByZXR1cm5zIHtCb29sZWFufVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGlzVG91Y2hTdXBwb3J0KCkge1xyXG5cdFx0cmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCAhIShuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDaGVja3Mgd2V0aGVyIHRvdWNoIGlzIHN1cHBvcnRlZCBvciBub3QgZm9yIElFLlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICogQHJldHVybnMge0Jvb2xlYW59XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gaXNUb3VjaFN1cHBvcnRJRSgpIHtcclxuXHRcdHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgalF1ZXJ5IFBsdWdpbiBmb3IgdGhlIE93bCBDYXJvdXNlbFxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHQkLmZuLm93bENhcm91c2VsID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKCEkKHRoaXMpLmRhdGEoJ293bENhcm91c2VsJykpIHtcclxuXHRcdFx0XHQkKHRoaXMpLmRhdGEoJ293bENhcm91c2VsJywgbmV3IE93bCh0aGlzLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFRoZSBjb25zdHJ1Y3RvciBmb3IgdGhlIGpRdWVyeSBQbHVnaW5cclxuXHQgKiBAcHVibGljXHJcblx0ICovXHJcblx0JC5mbi5vd2xDYXJvdXNlbC5Db25zdHJ1Y3RvciA9IE93bDtcclxuXHJcbn0pKHdpbmRvdy5aZXB0byB8fCB3aW5kb3cualF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcclxuXHJcbi8qKlxyXG4gKiBMYXp5IFBsdWdpblxyXG4gKiBAdmVyc2lvbiAyLjAuMFxyXG4gKiBAYXV0aG9yIEJhcnRvc3ogV29qY2llY2hvd3NraVxyXG4gKiBAbGljZW5zZSBUaGUgTUlUIExpY2Vuc2UgKE1JVClcclxuICovXHJcbjsoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgdGhlIGxhenkgcGx1Z2luLlxyXG5cdCAqIEBjbGFzcyBUaGUgTGF6eSBQbHVnaW5cclxuXHQgKiBAcGFyYW0ge093bH0gY2Fyb3VzZWwgLSBUaGUgT3dsIENhcm91c2VsXHJcblx0ICovXHJcblx0dmFyIExhenkgPSBmdW5jdGlvbihjYXJvdXNlbCkge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmVmZXJlbmNlIHRvIHRoZSBjb3JlLlxyXG5cdFx0ICogQHByb3RlY3RlZFxyXG5cdFx0ICogQHR5cGUge093bH1cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5fY29yZSA9IGNhcm91c2VsO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQWxyZWFkeSBsb2FkZWQgaXRlbXMuXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKiBAdHlwZSB7QXJyYXkuPGpRdWVyeT59XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX2xvYWRlZCA9IFtdO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRXZlbnQgaGFuZGxlcnMuXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxyXG5cdFx0ICovXHJcblx0XHR0aGlzLl9oYW5kbGVycyA9IHtcclxuXHRcdFx0J2luaXRpYWxpemVkLm93bC5jYXJvdXNlbCBjaGFuZ2Uub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0aWYgKCFlLm5hbWVzcGFjZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCF0aGlzLl9jb3JlLnNldHRpbmdzIHx8ICF0aGlzLl9jb3JlLnNldHRpbmdzLmxhenlMb2FkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoKGUucHJvcGVydHkgJiYgZS5wcm9wZXJ0eS5uYW1lID09ICdwb3NpdGlvbicpIHx8IGUudHlwZSA9PSAnaW5pdGlhbGl6ZWQnKSB7XHJcblx0XHRcdFx0XHR2YXIgc2V0dGluZ3MgPSB0aGlzLl9jb3JlLnNldHRpbmdzLFxyXG5cdFx0XHRcdFx0XHRuID0gKHNldHRpbmdzLmNlbnRlciAmJiBNYXRoLmNlaWwoc2V0dGluZ3MuaXRlbXMgLyAyKSB8fCBzZXR0aW5ncy5pdGVtcyksXHJcblx0XHRcdFx0XHRcdGkgPSAoKHNldHRpbmdzLmNlbnRlciAmJiBuICogLTEpIHx8IDApLFxyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbiA9ICgoZS5wcm9wZXJ0eSAmJiBlLnByb3BlcnR5LnZhbHVlKSB8fCB0aGlzLl9jb3JlLmN1cnJlbnQoKSkgKyBpLFxyXG5cdFx0XHRcdFx0XHRjbG9uZXMgPSB0aGlzLl9jb3JlLmNsb25lcygpLmxlbmd0aCxcclxuXHRcdFx0XHRcdFx0bG9hZCA9ICQucHJveHkoZnVuY3Rpb24oaSwgdikgeyB0aGlzLmxvYWQodikgfSwgdGhpcyk7XHJcblxyXG5cdFx0XHRcdFx0d2hpbGUgKGkrKyA8IG4pIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5sb2FkKGNsb25lcyAvIDIgKyB0aGlzLl9jb3JlLnJlbGF0aXZlKHBvc2l0aW9uKSk7XHJcblx0XHRcdFx0XHRcdGNsb25lcyAmJiAkLmVhY2godGhpcy5fY29yZS5jbG9uZXModGhpcy5fY29yZS5yZWxhdGl2ZShwb3NpdGlvbisrKSksIGxvYWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdGhpcylcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gc2V0IHRoZSBkZWZhdWx0IG9wdGlvbnNcclxuXHRcdHRoaXMuX2NvcmUub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBMYXp5LkRlZmF1bHRzLCB0aGlzLl9jb3JlLm9wdGlvbnMpO1xyXG5cclxuXHRcdC8vIHJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJcclxuXHRcdHRoaXMuX2NvcmUuJGVsZW1lbnQub24odGhpcy5faGFuZGxlcnMpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRGVmYXVsdCBvcHRpb25zLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHRMYXp5LkRlZmF1bHRzID0ge1xyXG5cdFx0bGF6eUxvYWQ6IGZhbHNlXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBMb2FkcyBhbGwgcmVzb3VyY2VzIG9mIGFuIGl0ZW0gYXQgdGhlIHNwZWNpZmllZCBwb3NpdGlvbi5cclxuXHQgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gLSBUaGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIGl0ZW0uXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqL1xyXG5cdExhenkucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbihwb3NpdGlvbikge1xyXG5cdFx0dmFyICRpdGVtID0gdGhpcy5fY29yZS4kc3RhZ2UuY2hpbGRyZW4oKS5lcShwb3NpdGlvbiksXHJcblx0XHRcdCRlbGVtZW50cyA9ICRpdGVtICYmICRpdGVtLmZpbmQoJy5vd2wtbGF6eScpO1xyXG5cclxuXHRcdGlmICghJGVsZW1lbnRzIHx8ICQuaW5BcnJheSgkaXRlbS5nZXQoMCksIHRoaXMuX2xvYWRlZCkgPiAtMSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0JGVsZW1lbnRzLmVhY2goJC5wcm94eShmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG5cdFx0XHR2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpLCBpbWFnZSxcclxuXHRcdFx0XHR1cmwgPSAod2luZG93LmRldmljZVBpeGVsUmF0aW8gPiAxICYmICRlbGVtZW50LmF0dHIoJ2RhdGEtc3JjLXJldGluYScpKSB8fCAkZWxlbWVudC5hdHRyKCdkYXRhLXNyYycpO1xyXG5cclxuXHRcdFx0dGhpcy5fY29yZS50cmlnZ2VyKCdsb2FkJywgeyBlbGVtZW50OiAkZWxlbWVudCwgdXJsOiB1cmwgfSwgJ2xhenknKTtcclxuXHJcblx0XHRcdGlmICgkZWxlbWVudC5pcygnaW1nJykpIHtcclxuXHRcdFx0XHQkZWxlbWVudC5vbmUoJ2xvYWQub3dsLmxhenknLCAkLnByb3h5KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JGVsZW1lbnQuY3NzKCdvcGFjaXR5JywgMSk7XHJcblx0XHRcdFx0XHR0aGlzLl9jb3JlLnRyaWdnZXIoJ2xvYWRlZCcsIHsgZWxlbWVudDogJGVsZW1lbnQsIHVybDogdXJsIH0sICdsYXp5Jyk7XHJcblx0XHRcdFx0fSwgdGhpcykpLmF0dHIoJ3NyYycsIHVybCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0XHRpbWFnZS5vbmxvYWQgPSAkLnByb3h5KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JGVsZW1lbnQuY3NzKHtcclxuXHRcdFx0XHRcdFx0J2JhY2tncm91bmQtaW1hZ2UnOiAndXJsKCcgKyB1cmwgKyAnKScsXHJcblx0XHRcdFx0XHRcdCdvcGFjaXR5JzogJzEnXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHRoaXMuX2NvcmUudHJpZ2dlcignbG9hZGVkJywgeyBlbGVtZW50OiAkZWxlbWVudCwgdXJsOiB1cmwgfSwgJ2xhenknKTtcclxuXHRcdFx0XHR9LCB0aGlzKTtcclxuXHRcdFx0XHRpbWFnZS5zcmMgPSB1cmw7XHJcblx0XHRcdH1cclxuXHRcdH0sIHRoaXMpKTtcclxuXHJcblx0XHR0aGlzLl9sb2FkZWQucHVzaCgkaXRlbS5nZXQoMCkpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRGVzdHJveXMgdGhlIHBsdWdpbi5cclxuXHQgKiBAcHVibGljXHJcblx0ICovXHJcblx0TGF6eS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGhhbmRsZXIsIHByb3BlcnR5O1xyXG5cclxuXHRcdGZvciAoaGFuZGxlciBpbiB0aGlzLmhhbmRsZXJzKSB7XHJcblx0XHRcdHRoaXMuX2NvcmUuJGVsZW1lbnQub2ZmKGhhbmRsZXIsIHRoaXMuaGFuZGxlcnNbaGFuZGxlcl0pO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChwcm9wZXJ0eSBpbiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzKSkge1xyXG5cdFx0XHR0eXBlb2YgdGhpc1twcm9wZXJ0eV0gIT0gJ2Z1bmN0aW9uJyAmJiAodGhpc1twcm9wZXJ0eV0gPSBudWxsKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdCQuZm4ub3dsQ2Fyb3VzZWwuQ29uc3RydWN0b3IuUGx1Z2lucy5MYXp5ID0gTGF6eTtcclxuXHJcbn0pKHdpbmRvdy5aZXB0byB8fCB3aW5kb3cualF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcclxuXHJcbi8qKlxyXG4gKiBBdXRvSGVpZ2h0IFBsdWdpblxyXG4gKiBAdmVyc2lvbiAyLjAuMFxyXG4gKiBAYXV0aG9yIEJhcnRvc3ogV29qY2llY2hvd3NraVxyXG4gKiBAbGljZW5zZSBUaGUgTUlUIExpY2Vuc2UgKE1JVClcclxuICovXHJcbjsoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgdGhlIGF1dG8gaGVpZ2h0IHBsdWdpbi5cclxuXHQgKiBAY2xhc3MgVGhlIEF1dG8gSGVpZ2h0IFBsdWdpblxyXG5cdCAqIEBwYXJhbSB7T3dsfSBjYXJvdXNlbCAtIFRoZSBPd2wgQ2Fyb3VzZWxcclxuXHQgKi9cclxuXHR2YXIgQXV0b0hlaWdodCA9IGZ1bmN0aW9uKGNhcm91c2VsKSB7XHJcblx0XHQvKipcclxuXHRcdCAqIFJlZmVyZW5jZSB0byB0aGUgY29yZS5cclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEB0eXBlIHtPd2x9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX2NvcmUgPSBjYXJvdXNlbDtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFsbCBldmVudCBoYW5kbGVycy5cclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX2hhbmRsZXJzID0ge1xyXG5cdFx0XHQnaW5pdGlhbGl6ZWQub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fY29yZS5zZXR0aW5ncy5hdXRvSGVpZ2h0KSB7XHJcblx0XHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdGhpcyksXHJcblx0XHRcdCdjaGFuZ2VkLm93bC5jYXJvdXNlbCc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLl9jb3JlLnNldHRpbmdzLmF1dG9IZWlnaHQgJiYgZS5wcm9wZXJ0eS5uYW1lID09ICdwb3NpdGlvbicpe1xyXG5cdFx0XHRcdFx0dGhpcy51cGRhdGUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRoaXMpLFxyXG5cdFx0XHQnbG9hZGVkLm93bC5sYXp5JzogJC5wcm94eShmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX2NvcmUuc2V0dGluZ3MuYXV0b0hlaWdodCAmJiBlLmVsZW1lbnQuY2xvc2VzdCgnLicgKyB0aGlzLl9jb3JlLnNldHRpbmdzLml0ZW1DbGFzcylcclxuXHRcdFx0XHRcdD09PSB0aGlzLl9jb3JlLiRzdGFnZS5jaGlsZHJlbigpLmVxKHRoaXMuX2NvcmUuY3VycmVudCgpKSkge1xyXG5cdFx0XHRcdFx0dGhpcy51cGRhdGUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRoaXMpXHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcclxuXHRcdHRoaXMuX2NvcmUub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBBdXRvSGVpZ2h0LkRlZmF1bHRzLCB0aGlzLl9jb3JlLm9wdGlvbnMpO1xyXG5cclxuXHRcdC8vIHJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJzXHJcblx0XHR0aGlzLl9jb3JlLiRlbGVtZW50Lm9uKHRoaXMuX2hhbmRsZXJzKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBEZWZhdWx0IG9wdGlvbnMuXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqL1xyXG5cdEF1dG9IZWlnaHQuRGVmYXVsdHMgPSB7XHJcblx0XHRhdXRvSGVpZ2h0OiBmYWxzZSxcclxuXHRcdGF1dG9IZWlnaHRDbGFzczogJ293bC1oZWlnaHQnXHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogVXBkYXRlcyB0aGUgdmlldy5cclxuXHQgKi9cclxuXHRBdXRvSGVpZ2h0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuX2NvcmUuJHN0YWdlLnBhcmVudCgpXHJcblx0XHRcdC5oZWlnaHQodGhpcy5fY29yZS4kc3RhZ2UuY2hpbGRyZW4oKS5lcSh0aGlzLl9jb3JlLmN1cnJlbnQoKSkuaGVpZ2h0KCkpXHJcblx0XHRcdC5hZGRDbGFzcyh0aGlzLl9jb3JlLnNldHRpbmdzLmF1dG9IZWlnaHRDbGFzcyk7XHJcblx0fTtcclxuXHJcblx0QXV0b0hlaWdodC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGhhbmRsZXIsIHByb3BlcnR5O1xyXG5cclxuXHRcdGZvciAoaGFuZGxlciBpbiB0aGlzLl9oYW5kbGVycykge1xyXG5cdFx0XHR0aGlzLl9jb3JlLiRlbGVtZW50Lm9mZihoYW5kbGVyLCB0aGlzLl9oYW5kbGVyc1toYW5kbGVyXSk7XHJcblx0XHR9XHJcblx0XHRmb3IgKHByb3BlcnR5IGluIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMpKSB7XHJcblx0XHRcdHR5cGVvZiB0aGlzW3Byb3BlcnR5XSAhPSAnZnVuY3Rpb24nICYmICh0aGlzW3Byb3BlcnR5XSA9IG51bGwpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdCQuZm4ub3dsQ2Fyb3VzZWwuQ29uc3RydWN0b3IuUGx1Z2lucy5BdXRvSGVpZ2h0ID0gQXV0b0hlaWdodDtcclxuXHJcbn0pKHdpbmRvdy5aZXB0byB8fCB3aW5kb3cualF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcclxuXHJcbi8qKlxyXG4gKiBWaWRlbyBQbHVnaW5cclxuICogQHZlcnNpb24gMi4wLjBcclxuICogQGF1dGhvciBCYXJ0b3N6IFdvamNpZWNob3dza2lcclxuICogQGxpY2Vuc2UgVGhlIE1JVCBMaWNlbnNlIChNSVQpXHJcbiAqL1xyXG47KGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGVzIHRoZSB2aWRlbyBwbHVnaW4uXHJcblx0ICogQGNsYXNzIFRoZSBWaWRlbyBQbHVnaW5cclxuXHQgKiBAcGFyYW0ge093bH0gY2Fyb3VzZWwgLSBUaGUgT3dsIENhcm91c2VsXHJcblx0ICovXHJcblx0dmFyIFZpZGVvID0gZnVuY3Rpb24oY2Fyb3VzZWwpIHtcclxuXHRcdC8qKlxyXG5cdFx0ICogUmVmZXJlbmNlIHRvIHRoZSBjb3JlLlxyXG5cdFx0ICogQHByb3RlY3RlZFxyXG5cdFx0ICogQHR5cGUge093bH1cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5fY29yZSA9IGNhcm91c2VsO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ2FjaGUgYWxsIHZpZGVvIFVSTHMuXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxyXG5cdFx0ICovXHJcblx0XHR0aGlzLl92aWRlb3MgPSB7fTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEN1cnJlbnQgcGxheWluZyBpdGVtLlxyXG5cdFx0ICogQHByb3RlY3RlZFxyXG5cdFx0ICogQHR5cGUge2pRdWVyeX1cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5fcGxheWluZyA9IG51bGw7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBXaGV0aGVyIHRoaXMgaXMgaW4gZnVsbHNjcmVlbiBvciBub3QuXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKiBAdHlwZSB7Qm9vbGVhbn1cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5fZnVsbHNjcmVlbiA9IGZhbHNlO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQWxsIGV2ZW50IGhhbmRsZXJzLlxyXG5cdFx0ICogQHByb3RlY3RlZFxyXG5cdFx0ICogQHR5cGUge09iamVjdH1cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5faGFuZGxlcnMgPSB7XHJcblx0XHRcdCdyZXNpemUub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX2NvcmUuc2V0dGluZ3MudmlkZW8gJiYgIXRoaXMuaXNJbkZ1bGxTY3JlZW4oKSkge1xyXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdGhpcyksXHJcblx0XHRcdCdyZWZyZXNoLm93bC5jYXJvdXNlbCBjaGFuZ2VkLm93bC5jYXJvdXNlbCc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLl9wbGF5aW5nKSB7XHJcblx0XHRcdFx0XHR0aGlzLnN0b3AoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRoaXMpLFxyXG5cdFx0XHQncHJlcGFyZWQub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0dmFyICRlbGVtZW50ID0gJChlLmNvbnRlbnQpLmZpbmQoJy5vd2wtdmlkZW8nKTtcclxuXHRcdFx0XHRpZiAoJGVsZW1lbnQubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHQkZWxlbWVudC5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG5cdFx0XHRcdFx0dGhpcy5mZXRjaCgkZWxlbWVudCwgJChlLmNvbnRlbnQpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRoaXMpXHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcclxuXHRcdHRoaXMuX2NvcmUub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBWaWRlby5EZWZhdWx0cywgdGhpcy5fY29yZS5vcHRpb25zKTtcclxuXHJcblx0XHQvLyByZWdpc3RlciBldmVudCBoYW5kbGVyc1xyXG5cdFx0dGhpcy5fY29yZS4kZWxlbWVudC5vbih0aGlzLl9oYW5kbGVycyk7XHJcblxyXG5cdFx0dGhpcy5fY29yZS4kZWxlbWVudC5vbignY2xpY2sub3dsLnZpZGVvJywgJy5vd2wtdmlkZW8tcGxheS1pY29uJywgJC5wcm94eShmdW5jdGlvbihlKSB7XHJcblx0XHRcdHRoaXMucGxheShlKTtcclxuXHRcdH0sIHRoaXMpKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBEZWZhdWx0IG9wdGlvbnMuXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqL1xyXG5cdFZpZGVvLkRlZmF1bHRzID0ge1xyXG5cdFx0dmlkZW86IGZhbHNlLFxyXG5cdFx0dmlkZW9IZWlnaHQ6IGZhbHNlLFxyXG5cdFx0dmlkZW9XaWR0aDogZmFsc2VcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBHZXRzIHRoZSB2aWRlbyBJRCBhbmQgdGhlIHR5cGUgKFlvdVR1YmUvVmltZW8gb25seSkuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqIEBwYXJhbSB7alF1ZXJ5fSB0YXJnZXQgLSBUaGUgdGFyZ2V0IGNvbnRhaW5pbmcgdGhlIHZpZGVvIGRhdGEuXHJcblx0ICogQHBhcmFtIHtqUXVlcnl9IGl0ZW0gLSBUaGUgaXRlbSBjb250YWluaW5nIHRoZSB2aWRlby5cclxuXHQgKi9cclxuXHRWaWRlby5wcm90b3R5cGUuZmV0Y2ggPSBmdW5jdGlvbih0YXJnZXQsIGl0ZW0pIHtcclxuXHJcblx0XHR2YXIgdHlwZSA9IHRhcmdldC5hdHRyKCdkYXRhLXZpbWVvLWlkJykgPyAndmltZW8nIDogJ3lvdXR1YmUnLFxyXG5cdFx0XHRpZCA9IHRhcmdldC5hdHRyKCdkYXRhLXZpbWVvLWlkJykgfHwgdGFyZ2V0LmF0dHIoJ2RhdGEteW91dHViZS1pZCcpLFxyXG5cdFx0XHR3aWR0aCA9IHRhcmdldC5hdHRyKCdkYXRhLXdpZHRoJykgfHwgdGhpcy5fY29yZS5zZXR0aW5ncy52aWRlb1dpZHRoLFxyXG5cdFx0XHRoZWlnaHQgPSB0YXJnZXQuYXR0cignZGF0YS1oZWlnaHQnKSB8fCB0aGlzLl9jb3JlLnNldHRpbmdzLnZpZGVvSGVpZ2h0LFxyXG5cdFx0XHR1cmwgPSB0YXJnZXQuYXR0cignaHJlZicpO1xyXG5cclxuXHRcdGlmICh1cmwpIHtcclxuXHRcdFx0aWQgPSB1cmwubWF0Y2goLyhodHRwOnxodHRwczp8KVxcL1xcLyhwbGF5ZXIufHd3dy4pPyh2aW1lb1xcLmNvbXx5b3V0dShiZVxcLmNvbXxcXC5iZXxiZVxcLmdvb2dsZWFwaXNcXC5jb20pKVxcLyh2aWRlb1xcL3xlbWJlZFxcL3x3YXRjaFxcP3Y9fHZcXC8pPyhbQS1aYS16MC05Ll8lLV0qKShcXCZcXFMrKT8vKTtcclxuXHJcblx0XHRcdGlmIChpZFszXS5pbmRleE9mKCd5b3V0dScpID4gLTEpIHtcclxuXHRcdFx0XHR0eXBlID0gJ3lvdXR1YmUnO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGlkWzNdLmluZGV4T2YoJ3ZpbWVvJykgPiAtMSkge1xyXG5cdFx0XHRcdHR5cGUgPSAndmltZW8nO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignVmlkZW8gVVJMIG5vdCBzdXBwb3J0ZWQuJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWQgPSBpZFs2XTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignTWlzc2luZyB2aWRlbyBVUkwuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fdmlkZW9zW3VybF0gPSB7XHJcblx0XHRcdHR5cGU6IHR5cGUsXHJcblx0XHRcdGlkOiBpZCxcclxuXHRcdFx0d2lkdGg6IHdpZHRoLFxyXG5cdFx0XHRoZWlnaHQ6IGhlaWdodFxyXG5cdFx0fTtcclxuXHJcblx0XHRpdGVtLmF0dHIoJ2RhdGEtdmlkZW8nLCB1cmwpO1xyXG5cclxuXHRcdHRoaXMudGh1bWJuYWlsKHRhcmdldCwgdGhpcy5fdmlkZW9zW3VybF0pO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgdmlkZW8gdGh1bWJuYWlsLlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKiBAcGFyYW0ge2pRdWVyeX0gdGFyZ2V0IC0gVGhlIHRhcmdldCBjb250YWluaW5nIHRoZSB2aWRlbyBkYXRhLlxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBpbmZvIC0gVGhlIHZpZGVvIGluZm8gb2JqZWN0LlxyXG5cdCAqIEBzZWUgYGZldGNoYFxyXG5cdCAqL1xyXG5cdFZpZGVvLnByb3RvdHlwZS50aHVtYm5haWwgPSBmdW5jdGlvbih0YXJnZXQsIHZpZGVvKSB7XHJcblxyXG5cdFx0dmFyIHRuTGluayxcclxuXHRcdFx0aWNvbixcclxuXHRcdFx0cGF0aCxcclxuXHRcdFx0ZGltZW5zaW9ucyA9IHZpZGVvLndpZHRoICYmIHZpZGVvLmhlaWdodCA/ICdzdHlsZT1cIndpZHRoOicgKyB2aWRlby53aWR0aCArICdweDtoZWlnaHQ6JyArIHZpZGVvLmhlaWdodCArICdweDtcIicgOiAnJyxcclxuXHRcdFx0Y3VzdG9tVG4gPSB0YXJnZXQuZmluZCgnaW1nJyksXHJcblx0XHRcdHNyY1R5cGUgPSAnc3JjJyxcclxuXHRcdFx0bGF6eUNsYXNzID0gJycsXHJcblx0XHRcdHNldHRpbmdzID0gdGhpcy5fY29yZS5zZXR0aW5ncyxcclxuXHRcdFx0Y3JlYXRlID0gZnVuY3Rpb24ocGF0aCkge1xyXG5cdFx0XHRcdGljb24gPSAnPGRpdiBjbGFzcz1cIm93bC12aWRlby1wbGF5LWljb25cIj48L2Rpdj4nO1xyXG5cclxuXHRcdFx0XHRpZiAoc2V0dGluZ3MubGF6eUxvYWQpIHtcclxuXHRcdFx0XHRcdHRuTGluayA9ICc8ZGl2IGNsYXNzPVwib3dsLXZpZGVvLXRuICcgKyBsYXp5Q2xhc3MgKyAnXCIgJyArIHNyY1R5cGUgKyAnPVwiJyArIHBhdGggKyAnXCI+PC9kaXY+JztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dG5MaW5rID0gJzxkaXYgY2xhc3M9XCJvd2wtdmlkZW8tdG5cIiBzdHlsZT1cIm9wYWNpdHk6MTtiYWNrZ3JvdW5kLWltYWdlOnVybCgnICsgcGF0aCArICcpXCI+PC9kaXY+JztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGFyZ2V0LmFmdGVyKHRuTGluayk7XHJcblx0XHRcdFx0dGFyZ2V0LmFmdGVyKGljb24pO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdC8vIHdyYXAgdmlkZW8gY29udGVudCBpbnRvIG93bC12aWRlby13cmFwcGVyIGRpdlxyXG5cdFx0dGFyZ2V0LndyYXAoJzxkaXYgY2xhc3M9XCJvd2wtdmlkZW8td3JhcHBlclwiJyArIGRpbWVuc2lvbnMgKyAnPjwvZGl2PicpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9jb3JlLnNldHRpbmdzLmxhenlMb2FkKSB7XHJcblx0XHRcdHNyY1R5cGUgPSAnZGF0YS1zcmMnO1xyXG5cdFx0XHRsYXp5Q2xhc3MgPSAnb3dsLWxhenknO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGN1c3RvbSB0aHVtYm5haWxcclxuXHRcdGlmIChjdXN0b21Ubi5sZW5ndGgpIHtcclxuXHRcdFx0Y3JlYXRlKGN1c3RvbVRuLmF0dHIoc3JjVHlwZSkpO1xyXG5cdFx0XHRjdXN0b21Ubi5yZW1vdmUoKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh2aWRlby50eXBlID09PSAneW91dHViZScpIHtcclxuXHRcdFx0cGF0aCA9IFwiaHR0cDovL2ltZy55b3V0dWJlLmNvbS92aS9cIiArIHZpZGVvLmlkICsgXCIvaHFkZWZhdWx0LmpwZ1wiO1xyXG5cdFx0XHRjcmVhdGUocGF0aCk7XHJcblx0XHR9IGVsc2UgaWYgKHZpZGVvLnR5cGUgPT09ICd2aW1lbycpIHtcclxuXHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHR0eXBlOiAnR0VUJyxcclxuXHRcdFx0XHR1cmw6ICdodHRwOi8vdmltZW8uY29tL2FwaS92Mi92aWRlby8nICsgdmlkZW8uaWQgKyAnLmpzb24nLFxyXG5cdFx0XHRcdGpzb25wOiAnY2FsbGJhY2snLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbnAnLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRcdHBhdGggPSBkYXRhWzBdLnRodW1ibmFpbF9sYXJnZTtcclxuXHRcdFx0XHRcdGNyZWF0ZShwYXRoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIFN0b3BzIHRoZSBjdXJyZW50IHZpZGVvLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHRWaWRlby5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5fY29yZS50cmlnZ2VyKCdzdG9wJywgbnVsbCwgJ3ZpZGVvJyk7XHJcblx0XHR0aGlzLl9wbGF5aW5nLmZpbmQoJy5vd2wtdmlkZW8tZnJhbWUnKS5yZW1vdmUoKTtcclxuXHRcdHRoaXMuX3BsYXlpbmcucmVtb3ZlQ2xhc3MoJ293bC12aWRlby1wbGF5aW5nJyk7XHJcblx0XHR0aGlzLl9wbGF5aW5nID0gbnVsbDtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBTdGFydHMgdGhlIGN1cnJlbnQgdmlkZW8uXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2IC0gVGhlIGV2ZW50IGFyZ3VtZW50cy5cclxuXHQgKi9cclxuXHRWaWRlby5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKGV2KSB7XHJcblx0XHR0aGlzLl9jb3JlLnRyaWdnZXIoJ3BsYXknLCBudWxsLCAndmlkZW8nKTtcclxuXHJcblx0XHRpZiAodGhpcy5fcGxheWluZykge1xyXG5cdFx0XHR0aGlzLnN0b3AoKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdGFyZ2V0ID0gJChldi50YXJnZXQgfHwgZXYuc3JjRWxlbWVudCksXHJcblx0XHRcdGl0ZW0gPSB0YXJnZXQuY2xvc2VzdCgnLicgKyB0aGlzLl9jb3JlLnNldHRpbmdzLml0ZW1DbGFzcyksXHJcblx0XHRcdHZpZGVvID0gdGhpcy5fdmlkZW9zW2l0ZW0uYXR0cignZGF0YS12aWRlbycpXSxcclxuXHRcdFx0d2lkdGggPSB2aWRlby53aWR0aCB8fCAnMTAwJScsXHJcblx0XHRcdGhlaWdodCA9IHZpZGVvLmhlaWdodCB8fCB0aGlzLl9jb3JlLiRzdGFnZS5oZWlnaHQoKSxcclxuXHRcdFx0aHRtbCwgd3JhcDtcclxuXHJcblx0XHRpZiAodmlkZW8udHlwZSA9PT0gJ3lvdXR1YmUnKSB7XHJcblx0XHRcdGh0bWwgPSAnPGlmcmFtZSB3aWR0aD1cIicgKyB3aWR0aCArICdcIiBoZWlnaHQ9XCInICsgaGVpZ2h0ICsgJ1wiIHNyYz1cImh0dHA6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJ1xyXG5cdFx0XHRcdCsgdmlkZW8uaWQgKyAnP2F1dG9wbGF5PTEmdj0nICsgdmlkZW8uaWQgKyAnXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPic7XHJcblx0XHR9IGVsc2UgaWYgKHZpZGVvLnR5cGUgPT09ICd2aW1lbycpIHtcclxuXHRcdFx0aHRtbCA9ICc8aWZyYW1lIHNyYz1cImh0dHA6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLycgKyB2aWRlby5pZCArICc/YXV0b3BsYXk9MVwiIHdpZHRoPVwiJyArIHdpZHRoXHJcblx0XHRcdFx0KyAnXCIgaGVpZ2h0PVwiJyArIGhlaWdodFxyXG5cdFx0XHRcdCsgJ1wiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPic7XHJcblx0XHR9XHJcblxyXG5cdFx0aXRlbS5hZGRDbGFzcygnb3dsLXZpZGVvLXBsYXlpbmcnKTtcclxuXHRcdHRoaXMuX3BsYXlpbmcgPSBpdGVtO1xyXG5cclxuXHRcdHdyYXAgPSAkKCc8ZGl2IHN0eWxlPVwiaGVpZ2h0OicgKyBoZWlnaHQgKyAncHg7IHdpZHRoOicgKyB3aWR0aCArICdweFwiIGNsYXNzPVwib3dsLXZpZGVvLWZyYW1lXCI+J1xyXG5cdFx0XHQrIGh0bWwgKyAnPC9kaXY+Jyk7XHJcblx0XHR0YXJnZXQuYWZ0ZXIod3JhcCk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogQ2hlY2tzIHdoZXRoZXIgYW4gdmlkZW8gaXMgY3VycmVudGx5IGluIGZ1bGwgc2NyZWVuIG1vZGUgb3Igbm90LlxyXG5cdCAqIEB0b2RvIEJhZCBzdHlsZSBiZWNhdXNlIGxvb2tzIGxpa2UgYSByZWFkb25seSBtZXRob2QgYnV0IGNoYW5nZXMgbWVtYmVycy5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHJldHVybnMge0Jvb2xlYW59XHJcblx0ICovXHJcblx0VmlkZW8ucHJvdG90eXBlLmlzSW5GdWxsU2NyZWVuID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly8gaWYgVmltZW8gRnVsbHNjcmVlbiBtb2RlXHJcblx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8IGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50XHJcblx0XHRcdHx8IGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50O1xyXG5cclxuXHRcdGlmIChlbGVtZW50ICYmICQoZWxlbWVudCkucGFyZW50KCkuaGFzQ2xhc3MoJ293bC12aWRlby1mcmFtZScpKSB7XHJcblx0XHRcdHRoaXMuX2NvcmUuc3BlZWQoMCk7XHJcblx0XHRcdHRoaXMuX2Z1bGxzY3JlZW4gPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChlbGVtZW50ICYmIHRoaXMuX2Z1bGxzY3JlZW4gJiYgdGhpcy5fcGxheWluZykge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY29tbWluZyBiYWNrIGZyb20gZnVsbHNjcmVlblxyXG5cdFx0aWYgKHRoaXMuX2Z1bGxzY3JlZW4pIHtcclxuXHRcdFx0dGhpcy5fZnVsbHNjcmVlbiA9IGZhbHNlO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2hlY2sgZnVsbCBzY3JlZW4gbW9kZSBhbmQgd2luZG93IG9yaWVudGF0aW9uXHJcblx0XHRpZiAodGhpcy5fcGxheWluZykge1xyXG5cdFx0XHRpZiAodGhpcy5fY29yZS5zdGF0ZS5vcmllbnRhdGlvbiAhPT0gd2luZG93Lm9yaWVudGF0aW9uKSB7XHJcblx0XHRcdFx0dGhpcy5fY29yZS5zdGF0ZS5vcmllbnRhdGlvbiA9IHdpbmRvdy5vcmllbnRhdGlvbjtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBEZXN0cm95cyB0aGUgcGx1Z2luLlxyXG5cdCAqL1xyXG5cdFZpZGVvLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaGFuZGxlciwgcHJvcGVydHk7XHJcblxyXG5cdFx0dGhpcy5fY29yZS4kZWxlbWVudC5vZmYoJ2NsaWNrLm93bC52aWRlbycpO1xyXG5cclxuXHRcdGZvciAoaGFuZGxlciBpbiB0aGlzLl9oYW5kbGVycykge1xyXG5cdFx0XHR0aGlzLl9jb3JlLiRlbGVtZW50Lm9mZihoYW5kbGVyLCB0aGlzLl9oYW5kbGVyc1toYW5kbGVyXSk7XHJcblx0XHR9XHJcblx0XHRmb3IgKHByb3BlcnR5IGluIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMpKSB7XHJcblx0XHRcdHR5cGVvZiB0aGlzW3Byb3BlcnR5XSAhPSAnZnVuY3Rpb24nICYmICh0aGlzW3Byb3BlcnR5XSA9IG51bGwpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdCQuZm4ub3dsQ2Fyb3VzZWwuQ29uc3RydWN0b3IuUGx1Z2lucy5WaWRlbyA9IFZpZGVvO1xyXG5cclxufSkod2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xyXG5cclxuLyoqXHJcbiAqIEFuaW1hdGUgUGx1Z2luXHJcbiAqIEB2ZXJzaW9uIDIuMC4wXHJcbiAqIEBhdXRob3IgQmFydG9zeiBXb2pjaWVjaG93c2tpXHJcbiAqIEBsaWNlbnNlIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxyXG4gKi9cclxuOyhmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlcyB0aGUgYW5pbWF0ZSBwbHVnaW4uXHJcblx0ICogQGNsYXNzIFRoZSBOYXZpZ2F0aW9uIFBsdWdpblxyXG5cdCAqIEBwYXJhbSB7T3dsfSBzY29wZSAtIFRoZSBPd2wgQ2Fyb3VzZWxcclxuXHQgKi9cclxuXHR2YXIgQW5pbWF0ZSA9IGZ1bmN0aW9uKHNjb3BlKSB7XHJcblx0XHR0aGlzLmNvcmUgPSBzY29wZTtcclxuXHRcdHRoaXMuY29yZS5vcHRpb25zID0gJC5leHRlbmQoe30sIEFuaW1hdGUuRGVmYXVsdHMsIHRoaXMuY29yZS5vcHRpb25zKTtcclxuXHRcdHRoaXMuc3dhcHBpbmcgPSB0cnVlO1xyXG5cdFx0dGhpcy5wcmV2aW91cyA9IHVuZGVmaW5lZDtcclxuXHRcdHRoaXMubmV4dCA9IHVuZGVmaW5lZDtcclxuXHRcdHRoaXMucGFnZUFuaW1hdGlvbnMgPSBbXTtcclxuXHJcblx0XHR0aGlzLmhhbmRsZXJzID0ge1xyXG5cdFx0XHQnY2hhbmdlLm93bC5jYXJvdXNlbCc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGlmIChlLnByb3BlcnR5Lm5hbWUgPT0gJ3Bvc2l0aW9uJykge1xyXG5cdFx0XHRcdFx0dGhpcy5wcmV2aW91cyA9IHRoaXMuY29yZS5jdXJyZW50KCk7XHJcblx0XHRcdFx0XHR0aGlzLm5leHQgPSBlLnByb3BlcnR5LnZhbHVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdGhpcyksXHJcblx0XHRcdCdkcmFnLm93bC5jYXJvdXNlbCBkcmFnZ2VkLm93bC5jYXJvdXNlbCB0cmFuc2xhdGVkLm93bC5jYXJvdXNlbCc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdHRoaXMuc3dhcHBpbmcgPSBlLnR5cGUgPT0gJ3RyYW5zbGF0ZWQnO1xyXG5cdFx0XHR9LCB0aGlzKSxcclxuXHRcdFx0J3RyYW5zbGF0ZS5vd2wuY2Fyb3VzZWwnOiAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcclxuXHJcblx0XHRcdFx0dmFyIHBhZ2VBbmltYXRpb25JbmRleCA9IHRoaXMucGFnZUhhc0FuaW1hdGlvbnMoZS5wYWdlLmluZGV4KSA/IGUucGFnZS5pbmRleCA6IG51bGw7XHJcblxyXG5cdFx0XHRcdGlmIChcclxuXHRcdFx0XHRcdHRoaXMuc3dhcHBpbmdcclxuXHRcdFx0XHRcdCYmIChcclxuXHRcdFx0XHRcdFx0dGhpcy5jb3JlLm9wdGlvbnMuYW5pbWF0ZU91dFxyXG5cdFx0XHRcdFx0XHR8fCB0aGlzLmNvcmUub3B0aW9ucy5hbmltYXRlSW5cclxuXHRcdFx0XHRcdFx0fHwgcGFnZUFuaW1hdGlvbkluZGV4XHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHR0aGlzLnN3YXAocGFnZUFuaW1hdGlvbkluZGV4KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRoaXMpXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuY29yZS4kZWxlbWVudC5vbih0aGlzLmhhbmRsZXJzKTtcclxuXHRcdHRoaXMuc2V0dXBQYWdlQW5pbWF0aW9ucygpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIERlZmF1bHQgb3B0aW9ucy5cclxuXHQgKiBAcHVibGljXHJcblx0ICovXHJcblx0QW5pbWF0ZS5EZWZhdWx0cyA9IHtcclxuXHRcdGFuaW1hdGVPdXQ6IGZhbHNlLFxyXG5cdFx0YW5pbWF0ZUluOiBmYWxzZVxyXG5cdH07XHJcblxyXG5cdEFuaW1hdGUucHJvdG90eXBlLnBhZ2VIYXNBbmltYXRpb25zID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdHR5cGVvZiB0aGlzLnBhZ2VBbmltYXRpb25zW2luZGV4XSAhPT0gJ3VuZGVmaW5lZCdcclxuXHRcdFx0JiYgKHR5cGVvZiB0aGlzLnBhZ2VBbmltYXRpb25zW2luZGV4XVsnYW5pbWF0ZUluJ10gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0aGlzLnBhZ2VBbmltYXRpb25zW2luZGV4XVsnYW5pbWF0ZU91dCddID09PSAnc3RyaW5nJylcclxuXHRcdCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRBbmltYXRlLnByb3RvdHlwZS5zZXR1cFBhZ2VBbmltYXRpb25zID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIG9wdGlvbnMgPSB0aGlzLmNvcmUub3B0aW9ucztcclxuXHJcblx0XHRpZiAob3B0aW9ucy5wYWdlQW5pbWF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoISQuaXNBcnJheShvcHRpb25zLnBhZ2VBbmltYXRpb25zKSkge1xyXG5cdFx0XHR0aHJvdyBcInBhZ2VBbmltYXRpb25zIHBhc3NlZCBpbiBtdXN0IGJlIGFuIGFycmF5XCI7XHJcblx0XHR9XHJcblxyXG5cdFx0JC5lYWNoKG9wdGlvbnMucGFnZUFuaW1hdGlvbnMsIGZ1bmN0aW9uKGksIHBhZ2VBbmltYXRpb25PcHRpb25zKSB7XHJcblx0XHRcdHRoaXMucGFnZUFuaW1hdGlvbnNbcGFnZUFuaW1hdGlvbk9wdGlvbnMucGFnZV0gPSB7XHJcblx0XHRcdFx0YW5pbWF0ZUluOiBwYWdlQW5pbWF0aW9uT3B0aW9ucy5hbmltYXRlSW4sXHJcblx0XHRcdFx0YW5pbWF0ZU91dDogcGFnZUFuaW1hdGlvbk9wdGlvbnMuYW5pbWF0ZU91dCxcclxuXHRcdFx0XHRhbmltYXRpb25EdXJhdGlvbjogcGFnZUFuaW1hdGlvbk9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb25cclxuXHRcdFx0fVxyXG5cdFx0fS5iaW5kKHRoaXMpKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUb2dnbGVzIHRoZSBhbmltYXRpb24gY2xhc3NlcyB3aGVuZXZlciBhbiB0cmFuc2xhdGlvbnMgc3RhcnRzLlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKiBAcmV0dXJucyB7Qm9vbGVhbnx1bmRlZmluZWR9XHJcblx0ICovXHJcblx0QW5pbWF0ZS5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uKHBhZ2VBbmltYXRpb25JbmRleCkge1xyXG5cclxuXHRcdGlmICh0aGlzLmNvcmUuc2V0dGluZ3MuaXRlbXMgIT09IDEgfHwgIXRoaXMuY29yZS5zdXBwb3J0M2QpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuY29yZS5zcGVlZCgwKTtcclxuXHJcblx0XHR2YXIgcGFnZUFuaW1hdGlvbkluY29taW5nID0gJC5pc051bWVyaWMocGFnZUFuaW1hdGlvbkluZGV4KSA/IHRoaXMucGFnZUFuaW1hdGlvbnNbcGFnZUFuaW1hdGlvbkluZGV4XS5hbmltYXRlSW4gOiBudWxsO1xyXG5cdFx0dmFyIHBhZ2VBbmltYXRpb25PdXRnb2luZyA9ICQuaXNOdW1lcmljKHBhZ2VBbmltYXRpb25JbmRleCkgPyB0aGlzLnBhZ2VBbmltYXRpb25zW3BhZ2VBbmltYXRpb25JbmRleF0uYW5pbWF0ZU91dCA6IG51bGw7XHJcblx0XHR2YXIgcGFnZUFuaW1hdGlvbkR1cmF0aW9uID0gJC5pc051bWVyaWMocGFnZUFuaW1hdGlvbkluZGV4KSA/IHRoaXMucGFnZUFuaW1hdGlvbnNbcGFnZUFuaW1hdGlvbkluZGV4XS5hbmltYXRpb25EdXJhdGlvbiA6IG51bGw7XHJcblxyXG5cdFx0dmFyIGxlZnQsXHJcblx0XHRcdGNsZWFyID0gJC5wcm94eSh0aGlzLmNsZWFyLCB0aGlzKSxcclxuXHRcdFx0cHJldmlvdXMgPSB0aGlzLmNvcmUuJHN0YWdlLmNoaWxkcmVuKCkuZXEodGhpcy5wcmV2aW91cyksXHJcblx0XHRcdG5leHQgPSB0aGlzLmNvcmUuJHN0YWdlLmNoaWxkcmVuKCkuZXEodGhpcy5uZXh0KSxcclxuXHRcdFx0aW5jb21pbmcgPSBwYWdlQW5pbWF0aW9uSW5jb21pbmcgfHwgdGhpcy5jb3JlLnNldHRpbmdzLmFuaW1hdGVJbixcclxuXHRcdFx0b3V0Z29pbmcgPSBwYWdlQW5pbWF0aW9uT3V0Z29pbmcgfHwgdGhpcy5jb3JlLnNldHRpbmdzLmFuaW1hdGVPdXQsXHJcblx0XHRcdGR1cmF0aW9uID0gcGFnZUFuaW1hdGlvbkR1cmF0aW9uIHx8IHRoaXMuY29yZS5zZXR0aW5ncy5wYWdlQW5pbWF0aW9uRHVyYXRpb247XHJcblxyXG5cdFx0aWYgKHRoaXMuY29yZS5jdXJyZW50KCkgPT09IHRoaXMucHJldmlvdXMpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChvdXRnb2luZykge1xyXG5cdFx0XHRsZWZ0ID0gdGhpcy5jb3JlLmNvb3JkaW5hdGVzKHRoaXMucHJldmlvdXMpIC0gdGhpcy5jb3JlLmNvb3JkaW5hdGVzKHRoaXMubmV4dCk7XHJcblx0XHRcdHByZXZpb3VzLmNzcyggeyAnbGVmdCc6IGxlZnQgKyAncHgnIH0gKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnYW5pbWF0ZWQgb3dsLWFuaW1hdGVkLW91dCcpXHJcblx0XHRcdFx0LmFkZENsYXNzKG91dGdvaW5nKVxyXG5cdFx0XHRcdC5jc3Moe1xyXG5cdFx0XHRcdFx0Jy13ZWJraXQtYW5pbWF0aW9uLWR1cmF0aW9uJzogZHVyYXRpb24sXHJcblx0XHRcdFx0XHQnLW1vei1hbmltYXRpb24tZHVyYXRpb24nOiAgICBkdXJhdGlvbixcclxuXHRcdFx0XHRcdCctbXMtYW5pbWF0aW9uLWR1cmF0aW9uJzogICAgIGR1cmF0aW9uLFxyXG5cdFx0XHRcdFx0Jy1vLWFuaW1hdGlvbi1kdXJhdGlvbic6ICAgICAgZHVyYXRpb24sXHJcblx0XHRcdFx0XHQnYW5pbWF0aW9uLWR1cmF0aW9uJzogICAgICAgICBkdXJhdGlvblxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0Lm9uZSgnd2Via2l0QW5pbWF0aW9uRW5kIG1vekFuaW1hdGlvbkVuZCBNU0FuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kIGFuaW1hdGlvbmVuZCcsIGNsZWFyKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaW5jb21pbmcpIHtcclxuXHRcdFx0bmV4dC5hZGRDbGFzcygnYW5pbWF0ZWQgb3dsLWFuaW1hdGVkLWluJylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoaW5jb21pbmcpXHJcblx0XHRcdFx0LmNzcyh7XHJcblx0XHRcdFx0XHQnLXdlYmtpdC1hbmltYXRpb24tZHVyYXRpb24nOiBkdXJhdGlvbixcclxuXHRcdFx0XHRcdCctbW96LWFuaW1hdGlvbi1kdXJhdGlvbic6ICAgIGR1cmF0aW9uLFxyXG5cdFx0XHRcdFx0Jy1tcy1hbmltYXRpb24tZHVyYXRpb24nOiAgICAgZHVyYXRpb24sXHJcblx0XHRcdFx0XHQnLW8tYW5pbWF0aW9uLWR1cmF0aW9uJzogICAgICBkdXJhdGlvbixcclxuXHRcdFx0XHRcdCdhbmltYXRpb24tZHVyYXRpb24nOiAgICAgICAgIGR1cmF0aW9uXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQub25lKCd3ZWJraXRBbmltYXRpb25FbmQgbW96QW5pbWF0aW9uRW5kIE1TQW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQgYW5pbWF0aW9uZW5kJywgY2xlYXIpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdEFuaW1hdGUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oZSkge1xyXG5cclxuXHRcdHZhciBwYWdlQW5pbWF0aW9uQ2xhc3NlcyA9IFwiXCI7XHJcblx0XHR0aGlzLnBhZ2VBbmltYXRpb25zLmZvckVhY2goZnVuY3Rpb24oYW5pbWF0aW9uT3B0aW9ucyl7XHJcblx0XHRcdHBhZ2VBbmltYXRpb25DbGFzc2VzICs9IChhbmltYXRpb25PcHRpb25zLmFuaW1hdGVJbikgPyBhbmltYXRpb25PcHRpb25zLmFuaW1hdGVJbiArICcgJyA6IFwiXCI7XHJcblx0XHRcdHBhZ2VBbmltYXRpb25DbGFzc2VzICs9IChhbmltYXRpb25PcHRpb25zLmFuaW1hdGVPdXQpID8gYW5pbWF0aW9uT3B0aW9ucy5hbmltYXRlT3V0ICsgJyAnOiBcIlwiO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JChlLnRhcmdldCkuY3NzKCB7ICdsZWZ0JzogJycgfSApXHJcblx0XHRcdC5yZW1vdmVDbGFzcygnYW5pbWF0ZWQgb3dsLWFuaW1hdGVkLW91dCBvd2wtYW5pbWF0ZWQtaW4nKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3ModGhpcy5jb3JlLnNldHRpbmdzLmFuaW1hdGVJbilcclxuXHRcdFx0LnJlbW92ZUNsYXNzKHRoaXMuY29yZS5zZXR0aW5ncy5hbmltYXRlT3V0KVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MocGFnZUFuaW1hdGlvbkNsYXNzZXMpO1xyXG5cdFx0dGhpcy5jb3JlLnRyYW5zaXRpb25FbmQoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIERlc3Ryb3lzIHRoZSBwbHVnaW4uXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqL1xyXG5cdEFuaW1hdGUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBoYW5kbGVyLCBwcm9wZXJ0eTtcclxuXHJcblx0XHRmb3IgKGhhbmRsZXIgaW4gdGhpcy5oYW5kbGVycykge1xyXG5cdFx0XHR0aGlzLmNvcmUuJGVsZW1lbnQub2ZmKGhhbmRsZXIsIHRoaXMuaGFuZGxlcnNbaGFuZGxlcl0pO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChwcm9wZXJ0eSBpbiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzKSkge1xyXG5cdFx0XHR0eXBlb2YgdGhpc1twcm9wZXJ0eV0gIT0gJ2Z1bmN0aW9uJyAmJiAodGhpc1twcm9wZXJ0eV0gPSBudWxsKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQkLmZuLm93bENhcm91c2VsLkNvbnN0cnVjdG9yLlBsdWdpbnMuQW5pbWF0ZSA9IEFuaW1hdGU7XHJcblxyXG59KSh3aW5kb3cuWmVwdG8gfHwgd2luZG93LmpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XHJcblxyXG4vKipcclxuICogQXV0b3BsYXkgUGx1Z2luXHJcbiAqIEB2ZXJzaW9uIDIuMC4wXHJcbiAqIEBhdXRob3IgQmFydG9zeiBXb2pjaWVjaG93c2tpXHJcbiAqIEBsaWNlbnNlIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxyXG4gKi9cclxuOyhmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlcyB0aGUgYXV0b3BsYXkgcGx1Z2luLlxyXG5cdCAqIEBjbGFzcyBUaGUgQXV0b3BsYXkgUGx1Z2luXHJcblx0ICogQHBhcmFtIHtPd2x9IHNjb3BlIC0gVGhlIE93bCBDYXJvdXNlbFxyXG5cdCAqL1xyXG5cdHZhciBBdXRvcGxheSA9IGZ1bmN0aW9uKHNjb3BlKSB7XHJcblx0XHR0aGlzLmNvcmUgPSBzY29wZTtcclxuXHRcdHRoaXMuY29yZS5vcHRpb25zID0gJC5leHRlbmQoe30sIEF1dG9wbGF5LkRlZmF1bHRzLCB0aGlzLmNvcmUub3B0aW9ucyk7XHJcblxyXG5cdFx0dGhpcy5oYW5kbGVycyA9IHtcclxuXHRcdFx0J3RyYW5zbGF0ZWQub3dsLmNhcm91c2VsIHJlZnJlc2hlZC5vd2wuY2Fyb3VzZWwnOiAkLnByb3h5KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuYXV0b3BsYXkoKTtcclxuXHRcdFx0fSwgdGhpcyksXHJcblx0XHRcdCdwbGF5Lm93bC5hdXRvcGxheSc6ICQucHJveHkoZnVuY3Rpb24oZSwgdCwgcykge1xyXG5cdFx0XHRcdHRoaXMucGxheSh0LCBzKTtcclxuXHRcdFx0fSwgdGhpcyksXHJcblx0XHRcdCdzdG9wLm93bC5hdXRvcGxheSc6ICQucHJveHkoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5zdG9wKCk7XHJcblx0XHRcdH0sIHRoaXMpLFxyXG5cdFx0XHQnbW91c2VvdmVyLm93bC5hdXRvcGxheSc6ICQucHJveHkoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY29yZS5zZXR0aW5ncy5hdXRvcGxheUhvdmVyUGF1c2UpIHtcclxuXHRcdFx0XHRcdHRoaXMucGF1c2UoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRoaXMpLFxyXG5cdFx0XHQnbW91c2VsZWF2ZS5vd2wuYXV0b3BsYXknOiAkLnByb3h5KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmNvcmUuc2V0dGluZ3MuYXV0b3BsYXlIb3ZlclBhdXNlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmF1dG9wbGF5KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB0aGlzKVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmNvcmUuJGVsZW1lbnQub24odGhpcy5oYW5kbGVycyk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogRGVmYXVsdCBvcHRpb25zLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHRBdXRvcGxheS5EZWZhdWx0cyA9IHtcclxuXHRcdGF1dG9wbGF5OiBmYWxzZSxcclxuXHRcdGF1dG9wbGF5VGltZW91dDogNTAwMCxcclxuXHRcdGF1dG9wbGF5SG92ZXJQYXVzZTogZmFsc2UsXHJcblx0XHRhdXRvcGxheVNwZWVkOiBmYWxzZVxyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKiBAdG9kbyBNdXN0IGJlIGRvY3VtZW50ZWQuXHJcblx0ICovXHJcblx0QXV0b3BsYXkucHJvdG90eXBlLmF1dG9wbGF5ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodGhpcy5jb3JlLnNldHRpbmdzLmF1dG9wbGF5ICYmICF0aGlzLmNvcmUuc3RhdGUudmlkZW9QbGF5KSB7XHJcblx0XHRcdHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG5cclxuXHRcdFx0dGhpcy5pbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgkLnByb3h5KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMucGxheSgpO1xyXG5cdFx0XHR9LCB0aGlzKSwgdGhpcy5jb3JlLnNldHRpbmdzLmF1dG9wbGF5VGltZW91dCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBTdGFydHMgdGhlIGF1dG9wbGF5LlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVvdXRdIC0gLi4uXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVlZF0gLSAuLi5cclxuXHQgKiBAcmV0dXJucyB7Qm9vbGVhbnx1bmRlZmluZWR9IC0gLi4uXHJcblx0ICogQHRvZG8gTXVzdCBiZSBkb2N1bWVudGVkLlxyXG5cdCAqL1xyXG5cdEF1dG9wbGF5LnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24odGltZW91dCwgc3BlZWQpIHtcclxuXHRcdC8vIGlmIHRhYiBpcyBpbmFjdGl2ZSAtIGRvZXNudCB3b3JrIGluIDxJRTEwXHJcblx0XHRpZiAoZG9jdW1lbnQuaGlkZGVuID09PSB0cnVlKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5jb3JlLnN0YXRlLmlzVG91Y2ggfHwgdGhpcy5jb3JlLnN0YXRlLmlzU2Nyb2xsaW5nXHJcblx0XHRcdHx8IHRoaXMuY29yZS5zdGF0ZS5pc1N3aXBpbmcgfHwgdGhpcy5jb3JlLnN0YXRlLmluTW90aW9uKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5jb3JlLnNldHRpbmdzLmF1dG9wbGF5ID09PSBmYWxzZSkge1xyXG5cdFx0XHR3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuY29yZS5uZXh0KHRoaXMuY29yZS5zZXR0aW5ncy5hdXRvcGxheVNwZWVkKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBTdG9wcyB0aGUgYXV0b3BsYXkuXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqL1xyXG5cdEF1dG9wbGF5LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XHJcblx0XHR3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBQYXVzZXMgdGhlIGF1dG9wbGF5LlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHRBdXRvcGxheS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG5cdH07XHJcblxyXG5cdC8qKlxyXG5cdCAqIERlc3Ryb3lzIHRoZSBwbHVnaW4uXHJcblx0ICovXHJcblx0QXV0b3BsYXkucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBoYW5kbGVyLCBwcm9wZXJ0eTtcclxuXHJcblx0XHR3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcclxuXHJcblx0XHRmb3IgKGhhbmRsZXIgaW4gdGhpcy5oYW5kbGVycykge1xyXG5cdFx0XHR0aGlzLmNvcmUuJGVsZW1lbnQub2ZmKGhhbmRsZXIsIHRoaXMuaGFuZGxlcnNbaGFuZGxlcl0pO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChwcm9wZXJ0eSBpbiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzKSkge1xyXG5cdFx0XHR0eXBlb2YgdGhpc1twcm9wZXJ0eV0gIT0gJ2Z1bmN0aW9uJyAmJiAodGhpc1twcm9wZXJ0eV0gPSBudWxsKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQkLmZuLm93bENhcm91c2VsLkNvbnN0cnVjdG9yLlBsdWdpbnMuYXV0b3BsYXkgPSBBdXRvcGxheTtcclxuXHJcbn0pKHdpbmRvdy5aZXB0byB8fCB3aW5kb3cualF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0aW9uIFBsdWdpblxyXG4gKiBAdmVyc2lvbiAyLjAuMFxyXG4gKiBAYXV0aG9yIEFydHVzIEtvbGFub3dza2lcclxuICogQGxpY2Vuc2UgVGhlIE1JVCBMaWNlbnNlIChNSVQpXHJcbiAqL1xyXG47KGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlcyB0aGUgbmF2aWdhdGlvbiBwbHVnaW4uXHJcblx0ICogQGNsYXNzIFRoZSBOYXZpZ2F0aW9uIFBsdWdpblxyXG5cdCAqIEBwYXJhbSB7T3dsfSBjYXJvdXNlbCAtIFRoZSBPd2wgQ2Fyb3VzZWwuXHJcblx0ICovXHJcblx0dmFyIE5hdmlnYXRpb24gPSBmdW5jdGlvbihjYXJvdXNlbCkge1xyXG5cdFx0LyoqXHJcblx0XHQgKiBSZWZlcmVuY2UgdG8gdGhlIGNvcmUuXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKiBAdHlwZSB7T3dsfVxyXG5cdFx0ICovXHJcblx0XHR0aGlzLl9jb3JlID0gY2Fyb3VzZWw7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgcGx1Z2luIGlzIGluaXRpYWxpemVkIG9yIG5vdC5cclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEB0eXBlIHtCb29sZWFufVxyXG5cdFx0ICovXHJcblx0XHR0aGlzLl9pbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVGhlIGN1cnJlbnQgcGFnaW5nIGluZGV4ZXMuXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKiBAdHlwZSB7QXJyYXl9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX3BhZ2VzID0gW107XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBbGwgRE9NIGVsZW1lbnRzIG9mIHRoZSB1c2VyIGludGVyZmFjZS5cclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX2NvbnRyb2xzID0ge307XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBNYXJrdXAgZm9yIGFuIGluZGljYXRvci5cclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEB0eXBlIHtBcnJheS48U3RyaW5nPn1cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5fdGVtcGxhdGVzID0gW107XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBUaGUgY2Fyb3VzZWwgZWxlbWVudC5cclxuXHRcdCAqIEB0eXBlIHtqUXVlcnl9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuJGVsZW1lbnQgPSB0aGlzLl9jb3JlLiRlbGVtZW50O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogT3ZlcnJpZGRlbiBtZXRob2RzIG9mIHRoZSBjYXJvdXNlbC5cclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX292ZXJyaWRlcyA9IHtcclxuXHRcdFx0bmV4dDogdGhpcy5fY29yZS5uZXh0LFxyXG5cdFx0XHRwcmV2OiB0aGlzLl9jb3JlLnByZXYsXHJcblx0XHRcdHRvOiB0aGlzLl9jb3JlLnRvXHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQWxsIGV2ZW50IGhhbmRsZXJzLlxyXG5cdFx0ICogQHByb3RlY3RlZFxyXG5cdFx0ICogQHR5cGUge09iamVjdH1cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5faGFuZGxlcnMgPSB7XHJcblx0XHRcdCdwcmVwYXJlZC5vd2wuY2Fyb3VzZWwnOiAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fY29yZS5zZXR0aW5ncy5kb3RzRGF0YSkge1xyXG5cdFx0XHRcdFx0dGhpcy5fdGVtcGxhdGVzLnB1c2goJChlLmNvbnRlbnQpLmZpbmQoJ1tkYXRhLWRvdF0nKS5hbmRTZWxmKCdbZGF0YS1kb3RdJykuYXR0cignZGF0YS1kb3QnKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB0aGlzKSxcclxuXHRcdFx0J2FkZC5vd2wuY2Fyb3VzZWwnOiAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fY29yZS5zZXR0aW5ncy5kb3RzRGF0YSkge1xyXG5cdFx0XHRcdFx0dGhpcy5fdGVtcGxhdGVzLnNwbGljZShlLnBvc2l0aW9uLCAwLCAkKGUuY29udGVudCkuZmluZCgnW2RhdGEtZG90XScpLmFuZFNlbGYoJ1tkYXRhLWRvdF0nKS5hdHRyKCdkYXRhLWRvdCcpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRoaXMpLFxyXG5cdFx0XHQncmVtb3ZlLm93bC5jYXJvdXNlbCBwcmVwYXJlZC5vd2wuY2Fyb3VzZWwnOiAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fY29yZS5zZXR0aW5ncy5kb3RzRGF0YSkge1xyXG5cdFx0XHRcdFx0dGhpcy5fdGVtcGxhdGVzLnNwbGljZShlLnBvc2l0aW9uLCAxKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRoaXMpLFxyXG5cdFx0XHQnY2hhbmdlLm93bC5jYXJvdXNlbCc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGlmIChlLnByb3BlcnR5Lm5hbWUgPT0gJ3Bvc2l0aW9uJykge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9jb3JlLnN0YXRlLnJldmVydCAmJiAhdGhpcy5fY29yZS5zZXR0aW5ncy5sb29wICYmIHRoaXMuX2NvcmUuc2V0dGluZ3MubmF2UmV3aW5kKSB7XHJcblx0XHRcdFx0XHRcdHZhciBjdXJyZW50ID0gdGhpcy5fY29yZS5jdXJyZW50KCksXHJcblx0XHRcdFx0XHRcdFx0bWF4aW11bSA9IHRoaXMuX2NvcmUubWF4aW11bSgpLFxyXG5cdFx0XHRcdFx0XHRcdG1pbmltdW0gPSB0aGlzLl9jb3JlLm1pbmltdW0oKTtcclxuXHRcdFx0XHRcdFx0ZS5kYXRhID0gZS5wcm9wZXJ0eS52YWx1ZSA+IG1heGltdW1cclxuXHRcdFx0XHRcdFx0XHQ/IGN1cnJlbnQgPj0gbWF4aW11bSA/IG1pbmltdW0gOiBtYXhpbXVtXHJcblx0XHRcdFx0XHRcdFx0OiBlLnByb3BlcnR5LnZhbHVlIDwgbWluaW11bSA/IG1heGltdW0gOiBlLnByb3BlcnR5LnZhbHVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgdGhpcyksXHJcblx0XHRcdCdjaGFuZ2VkLm93bC5jYXJvdXNlbCc6ICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGlmIChlLnByb3BlcnR5Lm5hbWUgPT0gJ3Bvc2l0aW9uJykge1xyXG5cdFx0XHRcdFx0dGhpcy5kcmF3KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB0aGlzKSxcclxuXHRcdFx0J3JlZnJlc2hlZC5vd2wuY2Fyb3VzZWwnOiAkLnByb3h5KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICghdGhpcy5faW5pdGlhbGl6ZWQpIHtcclxuXHRcdFx0XHRcdHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cdFx0XHRcdFx0dGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLl9jb3JlLnRyaWdnZXIoJ3JlZnJlc2gnLCBudWxsLCAnbmF2aWdhdGlvbicpO1xyXG5cdFx0XHRcdHRoaXMudXBkYXRlKCk7XHJcblx0XHRcdFx0dGhpcy5kcmF3KCk7XHJcblx0XHRcdFx0dGhpcy5fY29yZS50cmlnZ2VyKCdyZWZyZXNoZWQnLCBudWxsLCAnbmF2aWdhdGlvbicpO1xyXG5cdFx0XHR9LCB0aGlzKVxyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBzZXQgZGVmYXVsdCBvcHRpb25zXHJcblx0XHR0aGlzLl9jb3JlLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgTmF2aWdhdGlvbi5EZWZhdWx0cywgdGhpcy5fY29yZS5vcHRpb25zKTtcclxuXHJcblx0XHQvLyByZWdpc3RlciBldmVudCBoYW5kbGVyc1xyXG5cdFx0dGhpcy4kZWxlbWVudC5vbih0aGlzLl9oYW5kbGVycyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBEZWZhdWx0IG9wdGlvbnMuXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqIEB0b2RvIFJlbmFtZSBgc2xpZGVCeWAgdG8gYG5hdkJ5YFxyXG5cdCAqL1xyXG5cdE5hdmlnYXRpb24uRGVmYXVsdHMgPSB7XHJcblx0XHRuYXY6IGZhbHNlLFxyXG5cdFx0bmF2UmV3aW5kOiB0cnVlLFxyXG5cdFx0bmF2VGV4dDogWyAncHJldicsICduZXh0JyBdLFxyXG5cdFx0bmF2U3BlZWQ6IGZhbHNlLFxyXG5cdFx0bmF2RWxlbWVudDogJ2RpdicsXHJcblx0XHRuYXZDb250YWluZXI6IGZhbHNlLFxyXG5cdFx0bmF2Q29udGFpbmVyQ2xhc3M6ICdvd2wtbmF2JyxcclxuXHRcdG5hdkNsYXNzOiBbICdvd2wtcHJldicsICdvd2wtbmV4dCcgXSxcclxuXHRcdHNsaWRlQnk6IDEsXHJcblx0XHRkb3RDbGFzczogJ293bC1kb3QnLFxyXG5cdFx0ZG90c0NsYXNzOiAnb3dsLWRvdHMnLFxyXG5cdFx0ZG90czogdHJ1ZSxcclxuXHRcdGRvdHNFYWNoOiBmYWxzZSxcclxuXHRcdGRvdERhdGE6IGZhbHNlLFxyXG5cdFx0ZG90c1NwZWVkOiBmYWxzZSxcclxuXHRcdGRvdHNDb250YWluZXI6IGZhbHNlLFxyXG5cdFx0Y29udHJvbHNDbGFzczogJ293bC1jb250cm9scydcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpemVzIHRoZSBsYXlvdXQgb2YgdGhlIHBsdWdpbiBhbmQgZXh0ZW5kcyB0aGUgY2Fyb3VzZWwuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqL1xyXG5cdE5hdmlnYXRpb24ucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciAkY29udGFpbmVyLCBvdmVycmlkZSxcclxuXHRcdFx0b3B0aW9ucyA9IHRoaXMuX2NvcmUuc2V0dGluZ3M7XHJcblxyXG5cdFx0Ly8gY3JlYXRlIHRoZSBpbmRpY2F0b3IgdGVtcGxhdGVcclxuXHRcdGlmICghb3B0aW9ucy5kb3RzRGF0YSkge1xyXG5cdFx0XHR0aGlzLl90ZW1wbGF0ZXMgPSBbICQoJzxkaXY+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3Mob3B0aW9ucy5kb3RDbGFzcylcclxuXHRcdFx0XHQuYXBwZW5kKCQoJzxzcGFuPicpKVxyXG5cdFx0XHRcdC5wcm9wKCdvdXRlckhUTUwnKSBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNyZWF0ZSBjb250cm9scyBjb250YWluZXIgaWYgbmVlZGVkXHJcblx0XHRpZiAoIW9wdGlvbnMubmF2Q29udGFpbmVyIHx8ICFvcHRpb25zLmRvdHNDb250YWluZXIpIHtcclxuXHRcdFx0dGhpcy5fY29udHJvbHMuJGNvbnRhaW5lciA9ICQoJzxkaXY+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3Mob3B0aW9ucy5jb250cm9sc0NsYXNzKVxyXG5cdFx0XHRcdC5hcHBlbmRUbyh0aGlzLiRlbGVtZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjcmVhdGUgRE9NIHN0cnVjdHVyZSBmb3IgYWJzb2x1dGUgbmF2aWdhdGlvblxyXG5cdFx0dGhpcy5fY29udHJvbHMuJGluZGljYXRvcnMgPSBvcHRpb25zLmRvdHNDb250YWluZXIgPyAkKG9wdGlvbnMuZG90c0NvbnRhaW5lcilcclxuXHRcdFx0OiAkKCc8ZGl2PicpLmhpZGUoKS5hZGRDbGFzcyhvcHRpb25zLmRvdHNDbGFzcykuYXBwZW5kVG8odGhpcy5fY29udHJvbHMuJGNvbnRhaW5lcik7XHJcblxyXG5cdFx0dGhpcy5fY29udHJvbHMuJGluZGljYXRvcnMub24oJ2NsaWNrJywgJ2RpdicsICQucHJveHkoZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR2YXIgaW5kZXggPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5pcyh0aGlzLl9jb250cm9scy4kaW5kaWNhdG9ycylcclxuXHRcdFx0XHQ/ICQoZS50YXJnZXQpLmluZGV4KCkgOiAkKGUudGFyZ2V0KS5wYXJlbnQoKS5pbmRleCgpO1xyXG5cclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0dGhpcy50byhpbmRleCwgb3B0aW9ucy5kb3RzU3BlZWQpO1xyXG5cdFx0fSwgdGhpcykpO1xyXG5cclxuXHRcdC8vIGNyZWF0ZSBET00gc3RydWN0dXJlIGZvciByZWxhdGl2ZSBuYXZpZ2F0aW9uXHJcblx0XHQkY29udGFpbmVyID0gb3B0aW9ucy5uYXZDb250YWluZXIgPyAkKG9wdGlvbnMubmF2Q29udGFpbmVyKVxyXG5cdFx0XHQ6ICQoJzxkaXY+JykuYWRkQ2xhc3Mob3B0aW9ucy5uYXZDb250YWluZXJDbGFzcykucHJlcGVuZFRvKHRoaXMuX2NvbnRyb2xzLiRjb250YWluZXIpO1xyXG5cclxuXHRcdHRoaXMuX2NvbnRyb2xzLiRuZXh0ID0gJCgnPCcgKyBvcHRpb25zLm5hdkVsZW1lbnQgKyAnPicpO1xyXG5cdFx0dGhpcy5fY29udHJvbHMuJHByZXZpb3VzID0gdGhpcy5fY29udHJvbHMuJG5leHQuY2xvbmUoKTtcclxuXHJcblx0XHR0aGlzLl9jb250cm9scy4kcHJldmlvdXNcclxuXHRcdFx0LmFkZENsYXNzKG9wdGlvbnMubmF2Q2xhc3NbMF0pXHJcblx0XHRcdC5odG1sKG9wdGlvbnMubmF2VGV4dFswXSlcclxuXHRcdFx0LmhpZGUoKVxyXG5cdFx0XHQucHJlcGVuZFRvKCRjb250YWluZXIpXHJcblx0XHRcdC5vbignY2xpY2snLCAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHR0aGlzLnByZXYob3B0aW9ucy5uYXZTcGVlZCk7XHJcblx0XHRcdH0sIHRoaXMpKTtcclxuXHRcdHRoaXMuX2NvbnRyb2xzLiRuZXh0XHJcblx0XHRcdC5hZGRDbGFzcyhvcHRpb25zLm5hdkNsYXNzWzFdKVxyXG5cdFx0XHQuaHRtbChvcHRpb25zLm5hdlRleHRbMV0pXHJcblx0XHRcdC5oaWRlKClcclxuXHRcdFx0LmFwcGVuZFRvKCRjb250YWluZXIpXHJcblx0XHRcdC5vbignY2xpY2snLCAkLnByb3h5KGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHR0aGlzLm5leHQob3B0aW9ucy5uYXZTcGVlZCk7XHJcblx0XHRcdH0sIHRoaXMpKTtcclxuXHJcblx0XHQvLyBvdmVycmlkZSBwdWJsaWMgbWV0aG9kcyBvZiB0aGUgY2Fyb3VzZWxcclxuXHRcdGZvciAob3ZlcnJpZGUgaW4gdGhpcy5fb3ZlcnJpZGVzKSB7XHJcblx0XHRcdHRoaXMuX2NvcmVbb3ZlcnJpZGVdID0gJC5wcm94eSh0aGlzW292ZXJyaWRlXSwgdGhpcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBEZXN0cm95cyB0aGUgcGx1Z2luLlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKi9cclxuXHROYXZpZ2F0aW9uLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaGFuZGxlciwgY29udHJvbCwgcHJvcGVydHksIG92ZXJyaWRlO1xyXG5cclxuXHRcdGZvciAoaGFuZGxlciBpbiB0aGlzLl9oYW5kbGVycykge1xyXG5cdFx0XHR0aGlzLiRlbGVtZW50Lm9mZihoYW5kbGVyLCB0aGlzLl9oYW5kbGVyc1toYW5kbGVyXSk7XHJcblx0XHR9XHJcblx0XHRmb3IgKGNvbnRyb2wgaW4gdGhpcy5fY29udHJvbHMpIHtcclxuXHRcdFx0dGhpcy5fY29udHJvbHNbY29udHJvbF0ucmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0XHRmb3IgKG92ZXJyaWRlIGluIHRoaXMub3ZlcmlkZXMpIHtcclxuXHRcdFx0dGhpcy5fY29yZVtvdmVycmlkZV0gPSB0aGlzLl9vdmVycmlkZXNbb3ZlcnJpZGVdO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChwcm9wZXJ0eSBpbiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzKSkge1xyXG5cdFx0XHR0eXBlb2YgdGhpc1twcm9wZXJ0eV0gIT0gJ2Z1bmN0aW9uJyAmJiAodGhpc1twcm9wZXJ0eV0gPSBudWxsKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFVwZGF0ZXMgdGhlIGludGVybmFsIHN0YXRlLlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKi9cclxuXHROYXZpZ2F0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpLCBqLCBrLFxyXG5cdFx0XHRvcHRpb25zID0gdGhpcy5fY29yZS5zZXR0aW5ncyxcclxuXHRcdFx0bG93ZXIgPSB0aGlzLl9jb3JlLmNsb25lcygpLmxlbmd0aCAvIDIsXHJcblx0XHRcdHVwcGVyID0gbG93ZXIgKyB0aGlzLl9jb3JlLml0ZW1zKCkubGVuZ3RoLFxyXG5cdFx0XHRzaXplID0gb3B0aW9ucy5jZW50ZXIgfHwgb3B0aW9ucy5hdXRvV2lkdGggfHwgb3B0aW9ucy5kb3REYXRhXHJcblx0XHRcdFx0PyAxIDogb3B0aW9ucy5kb3RzRWFjaCB8fCBvcHRpb25zLml0ZW1zO1xyXG5cclxuXHRcdGlmIChvcHRpb25zLnNsaWRlQnkgIT09ICdwYWdlJykge1xyXG5cdFx0XHRvcHRpb25zLnNsaWRlQnkgPSBNYXRoLm1pbihvcHRpb25zLnNsaWRlQnksIG9wdGlvbnMuaXRlbXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChvcHRpb25zLmRvdHMgfHwgb3B0aW9ucy5zbGlkZUJ5ID09ICdwYWdlJykge1xyXG5cdFx0XHR0aGlzLl9wYWdlcyA9IFtdO1xyXG5cclxuXHRcdFx0Zm9yIChpID0gbG93ZXIsIGogPSAwLCBrID0gMDsgaSA8IHVwcGVyOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoaiA+PSBzaXplIHx8IGogPT09IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuX3BhZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRzdGFydDogaSAtIGxvd2VyLFxyXG5cdFx0XHRcdFx0XHRlbmQ6IGkgLSBsb3dlciArIHNpemUgLSAxXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGogPSAwLCArK2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGogKz0gdGhpcy5fY29yZS5tZXJnZXJzKHRoaXMuX2NvcmUucmVsYXRpdmUoaSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBEcmF3cyB0aGUgdXNlciBpbnRlcmZhY2UuXHJcblx0ICogQHRvZG8gVGhlIG9wdGlvbiBgZG90RGF0YWAgd29udCB3b3JrLlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKi9cclxuXHROYXZpZ2F0aW9uLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZGlmZmVyZW5jZSwgaSwgaHRtbCA9ICcnLFxyXG5cdFx0XHRvcHRpb25zID0gdGhpcy5fY29yZS5zZXR0aW5ncyxcclxuXHRcdFx0JGl0ZW1zID0gdGhpcy5fY29yZS4kc3RhZ2UuY2hpbGRyZW4oKSxcclxuXHRcdFx0aW5kZXggPSB0aGlzLl9jb3JlLnJlbGF0aXZlKHRoaXMuX2NvcmUuY3VycmVudCgpKTtcclxuXHJcblx0XHRpZiAob3B0aW9ucy5uYXYgJiYgIW9wdGlvbnMubG9vcCAmJiAhb3B0aW9ucy5uYXZSZXdpbmQpIHtcclxuXHRcdFx0dGhpcy5fY29udHJvbHMuJHByZXZpb3VzLnRvZ2dsZUNsYXNzKCdkaXNhYmxlZCcsIGluZGV4IDw9IDApO1xyXG5cdFx0XHR0aGlzLl9jb250cm9scy4kbmV4dC50b2dnbGVDbGFzcygnZGlzYWJsZWQnLCBpbmRleCA+PSB0aGlzLl9jb3JlLm1heGltdW0oKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY29udHJvbHMuJHByZXZpb3VzLnRvZ2dsZShvcHRpb25zLm5hdik7XHJcblx0XHR0aGlzLl9jb250cm9scy4kbmV4dC50b2dnbGUob3B0aW9ucy5uYXYpO1xyXG5cclxuXHRcdGlmIChvcHRpb25zLmRvdHMpIHtcclxuXHRcdFx0ZGlmZmVyZW5jZSA9IHRoaXMuX3BhZ2VzLmxlbmd0aCAtIHRoaXMuX2NvbnRyb2xzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKCkubGVuZ3RoO1xyXG5cclxuXHRcdFx0aWYgKG9wdGlvbnMuZG90RGF0YSAmJiBkaWZmZXJlbmNlICE9PSAwKSB7XHJcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuX2NvbnRyb2xzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKCkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdGh0bWwgKz0gdGhpcy5fdGVtcGxhdGVzW3RoaXMuX2NvcmUucmVsYXRpdmUoaSldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLl9jb250cm9scy4kaW5kaWNhdG9ycy5odG1sKGh0bWwpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGRpZmZlcmVuY2UgPiAwKSB7XHJcblx0XHRcdFx0aHRtbCA9IG5ldyBBcnJheShkaWZmZXJlbmNlICsgMSkuam9pbih0aGlzLl90ZW1wbGF0ZXNbMF0pO1xyXG5cdFx0XHRcdHRoaXMuX2NvbnRyb2xzLiRpbmRpY2F0b3JzLmFwcGVuZChodG1sKTtcclxuXHRcdFx0fSBlbHNlIGlmIChkaWZmZXJlbmNlIDwgMCkge1xyXG5cdFx0XHRcdHRoaXMuX2NvbnRyb2xzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKCkuc2xpY2UoZGlmZmVyZW5jZSkucmVtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX2NvbnRyb2xzLiRpbmRpY2F0b3JzLmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdHRoaXMuX2NvbnRyb2xzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKCkuZXEoJC5pbkFycmF5KHRoaXMuY3VycmVudCgpLCB0aGlzLl9wYWdlcykpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9jb250cm9scy4kaW5kaWNhdG9ycy50b2dnbGUob3B0aW9ucy5kb3RzKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEV4dGVuZHMgZXZlbnQgZGF0YS5cclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnQgLSBUaGUgZXZlbnQgb2JqZWN0IHdoaWNoIGdldHMgdGhyb3duLlxyXG5cdCAqL1xyXG5cdE5hdmlnYXRpb24ucHJvdG90eXBlLm9uVHJpZ2dlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHR2YXIgc2V0dGluZ3MgPSB0aGlzLl9jb3JlLnNldHRpbmdzO1xyXG5cclxuXHRcdGV2ZW50LnBhZ2UgPSB7XHJcblx0XHRcdGluZGV4OiAkLmluQXJyYXkodGhpcy5jdXJyZW50KCksIHRoaXMuX3BhZ2VzKSxcclxuXHRcdFx0Y291bnQ6IHRoaXMuX3BhZ2VzLmxlbmd0aCxcclxuXHRcdFx0c2l6ZTogc2V0dGluZ3MgJiYgKHNldHRpbmdzLmNlbnRlciB8fCBzZXR0aW5ncy5hdXRvV2lkdGggfHwgc2V0dGluZ3MuZG90RGF0YVxyXG5cdFx0XHRcdD8gMSA6IHNldHRpbmdzLmRvdHNFYWNoIHx8IHNldHRpbmdzLml0ZW1zKVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEdldHMgdGhlIGN1cnJlbnQgcGFnZSBwb3NpdGlvbiBvZiB0aGUgY2Fyb3VzZWwuXHJcblx0ICogQHByb3RlY3RlZFxyXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcblx0ICovXHJcblx0TmF2aWdhdGlvbi5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGluZGV4ID0gdGhpcy5fY29yZS5yZWxhdGl2ZSh0aGlzLl9jb3JlLmN1cnJlbnQoKSk7XHJcblx0XHRyZXR1cm4gJC5ncmVwKHRoaXMuX3BhZ2VzLCBmdW5jdGlvbihvKSB7XHJcblx0XHRcdHJldHVybiBvLnN0YXJ0IDw9IGluZGV4ICYmIG8uZW5kID49IGluZGV4O1xyXG5cdFx0fSkucG9wKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBHZXRzIHRoZSBjdXJyZW50IHN1Y2Nlc29yL3ByZWRlY2Vzc29yIHBvc2l0aW9uLlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG5cdCAqL1xyXG5cdE5hdmlnYXRpb24ucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24oc3VjY2Vzc29yKSB7XHJcblx0XHR2YXIgcG9zaXRpb24sIGxlbmd0aCxcclxuXHRcdFx0b3B0aW9ucyA9IHRoaXMuX2NvcmUuc2V0dGluZ3M7XHJcblxyXG5cdFx0aWYgKG9wdGlvbnMuc2xpZGVCeSA9PSAncGFnZScpIHtcclxuXHRcdFx0cG9zaXRpb24gPSAkLmluQXJyYXkodGhpcy5jdXJyZW50KCksIHRoaXMuX3BhZ2VzKTtcclxuXHRcdFx0bGVuZ3RoID0gdGhpcy5fcGFnZXMubGVuZ3RoO1xyXG5cdFx0XHRzdWNjZXNzb3IgPyArK3Bvc2l0aW9uIDogLS1wb3NpdGlvbjtcclxuXHRcdFx0cG9zaXRpb24gPSB0aGlzLl9wYWdlc1soKHBvc2l0aW9uICUgbGVuZ3RoKSArIGxlbmd0aCkgJSBsZW5ndGhdLnN0YXJ0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cG9zaXRpb24gPSB0aGlzLl9jb3JlLnJlbGF0aXZlKHRoaXMuX2NvcmUuY3VycmVudCgpKTtcclxuXHRcdFx0bGVuZ3RoID0gdGhpcy5fY29yZS5pdGVtcygpLmxlbmd0aDtcclxuXHRcdFx0c3VjY2Vzc29yID8gcG9zaXRpb24gKz0gb3B0aW9ucy5zbGlkZUJ5IDogcG9zaXRpb24gLT0gb3B0aW9ucy5zbGlkZUJ5O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBvc2l0aW9uO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogU2xpZGVzIHRvIHRoZSBuZXh0IGl0ZW0gb3IgcGFnZS5cclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVlZD1mYWxzZV0gLSBUaGUgdGltZSBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSB0cmFuc2l0aW9uLlxyXG5cdCAqL1xyXG5cdE5hdmlnYXRpb24ucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbihzcGVlZCkge1xyXG5cdFx0JC5wcm94eSh0aGlzLl9vdmVycmlkZXMudG8sIHRoaXMuX2NvcmUpKHRoaXMuZ2V0UG9zaXRpb24odHJ1ZSksIHNwZWVkKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFNsaWRlcyB0byB0aGUgcHJldmlvdXMgaXRlbSBvciBwYWdlLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge051bWJlcn0gW3NwZWVkPWZhbHNlXSAtIFRoZSB0aW1lIGluIG1pbGxpc2Vjb25kcyBmb3IgdGhlIHRyYW5zaXRpb24uXHJcblx0ICovXHJcblx0TmF2aWdhdGlvbi5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uKHNwZWVkKSB7XHJcblx0XHQkLnByb3h5KHRoaXMuX292ZXJyaWRlcy50bywgdGhpcy5fY29yZSkodGhpcy5nZXRQb3NpdGlvbihmYWxzZSksIHNwZWVkKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFNsaWRlcyB0byB0aGUgc3BlY2lmaWVkIGl0ZW0gb3IgcGFnZS5cclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBpdGVtIG9yIHBhZ2UuXHJcblx0ICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVlZF0gLSBUaGUgdGltZSBpbiBtaWxsaXNlY29uZHMgZm9yIHRoZSB0cmFuc2l0aW9uLlxyXG5cdCAqIEBwYXJhbSB7Qm9vbGVhbn0gW3N0YW5kYXJkPWZhbHNlXSAtIFdoZXRoZXIgdG8gdXNlIHRoZSBzdGFuZGFyZCBiZWhhdmlvdXIgb3Igbm90LlxyXG5cdCAqL1xyXG5cdE5hdmlnYXRpb24ucHJvdG90eXBlLnRvID0gZnVuY3Rpb24ocG9zaXRpb24sIHNwZWVkLCBzdGFuZGFyZCkge1xyXG5cdFx0dmFyIGxlbmd0aDtcclxuXHJcblx0XHRpZiAoIXN0YW5kYXJkKSB7XHJcblx0XHRcdGxlbmd0aCA9IHRoaXMuX3BhZ2VzLmxlbmd0aDtcclxuXHRcdFx0JC5wcm94eSh0aGlzLl9vdmVycmlkZXMudG8sIHRoaXMuX2NvcmUpKHRoaXMuX3BhZ2VzWygocG9zaXRpb24gJSBsZW5ndGgpICsgbGVuZ3RoKSAlIGxlbmd0aF0uc3RhcnQsIHNwZWVkKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQucHJveHkodGhpcy5fb3ZlcnJpZGVzLnRvLCB0aGlzLl9jb3JlKShwb3NpdGlvbiwgc3BlZWQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0JC5mbi5vd2xDYXJvdXNlbC5Db25zdHJ1Y3Rvci5QbHVnaW5zLk5hdmlnYXRpb24gPSBOYXZpZ2F0aW9uO1xyXG5cclxufSkod2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xyXG5cclxuLyoqXHJcbiAqIEhhc2ggUGx1Z2luXHJcbiAqIEB2ZXJzaW9uIDIuMC4wXHJcbiAqIEBhdXRob3IgQXJ0dXMgS29sYW5vd3NraVxyXG4gKiBAbGljZW5zZSBUaGUgTUlUIExpY2Vuc2UgKE1JVClcclxuICovXHJcbjsoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGVzIHRoZSBoYXNoIHBsdWdpbi5cclxuXHQgKiBAY2xhc3MgVGhlIEhhc2ggUGx1Z2luXHJcblx0ICogQHBhcmFtIHtPd2x9IGNhcm91c2VsIC0gVGhlIE93bCBDYXJvdXNlbFxyXG5cdCAqL1xyXG5cdHZhciBIYXNoID0gZnVuY3Rpb24oY2Fyb3VzZWwpIHtcclxuXHRcdC8qKlxyXG5cdFx0ICogUmVmZXJlbmNlIHRvIHRoZSBjb3JlLlxyXG5cdFx0ICogQHByb3RlY3RlZFxyXG5cdFx0ICogQHR5cGUge093bH1cclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5fY29yZSA9IGNhcm91c2VsO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSGFzaCB0YWJsZSBmb3IgdGhlIGhhc2hlcy5cclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX2hhc2hlcyA9IHt9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVGhlIGNhcm91c2VsIGVsZW1lbnQuXHJcblx0XHQgKiBAdHlwZSB7alF1ZXJ5fVxyXG5cdFx0ICovXHJcblx0XHR0aGlzLiRlbGVtZW50ID0gdGhpcy5fY29yZS4kZWxlbWVudDtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFsbCBldmVudCBoYW5kbGVycy5cclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XHJcblx0XHQgKi9cclxuXHRcdHRoaXMuX2hhbmRsZXJzID0ge1xyXG5cdFx0XHQnaW5pdGlhbGl6ZWQub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fY29yZS5zZXR0aW5ncy5zdGFydFBvc2l0aW9uID09ICdVUkxIYXNoJykge1xyXG5cdFx0XHRcdFx0JCh3aW5kb3cpLnRyaWdnZXIoJ2hhc2hjaGFuZ2Uub3dsLm5hdmlnYXRpb24nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHRoaXMpLFxyXG5cdFx0XHQncHJlcGFyZWQub3dsLmNhcm91c2VsJzogJC5wcm94eShmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0dmFyIGhhc2ggPSAkKGUuY29udGVudCkuZmluZCgnW2RhdGEtaGFzaF0nKS5hbmRTZWxmKCdbZGF0YS1oYXNoXScpLmF0dHIoJ2RhdGEtaGFzaCcpO1xyXG5cdFx0XHRcdHRoaXMuX2hhc2hlc1toYXNoXSA9IGUuY29udGVudDtcclxuXHRcdFx0fSwgdGhpcylcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gc2V0IGRlZmF1bHQgb3B0aW9uc1xyXG5cdFx0dGhpcy5fY29yZS5vcHRpb25zID0gJC5leHRlbmQoe30sIEhhc2guRGVmYXVsdHMsIHRoaXMuX2NvcmUub3B0aW9ucyk7XHJcblxyXG5cdFx0Ly8gcmVnaXN0ZXIgdGhlIGV2ZW50IGhhbmRsZXJzXHJcblx0XHR0aGlzLiRlbGVtZW50Lm9uKHRoaXMuX2hhbmRsZXJzKTtcclxuXHJcblx0XHQvLyByZWdpc3RlciBldmVudCBsaXN0ZW5lciBmb3IgaGFzaCBuYXZpZ2F0aW9uXHJcblx0XHQkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2Uub3dsLm5hdmlnYXRpb24nLCAkLnByb3h5KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSxcclxuXHRcdFx0XHRpdGVtcyA9IHRoaXMuX2NvcmUuJHN0YWdlLmNoaWxkcmVuKCksXHJcblx0XHRcdFx0cG9zaXRpb24gPSB0aGlzLl9oYXNoZXNbaGFzaF0gJiYgaXRlbXMuaW5kZXgodGhpcy5faGFzaGVzW2hhc2hdKSB8fCAwO1xyXG5cclxuXHRcdFx0aWYgKCFoYXNoKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9jb3JlLnRvKHBvc2l0aW9uLCBmYWxzZSwgdHJ1ZSk7XHJcblx0XHR9LCB0aGlzKSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBEZWZhdWx0IG9wdGlvbnMuXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqL1xyXG5cdEhhc2guRGVmYXVsdHMgPSB7XHJcblx0XHRVUkxoYXNoTGlzdGVuZXI6IGZhbHNlXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBEZXN0cm95cyB0aGUgcGx1Z2luLlxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHRIYXNoLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaGFuZGxlciwgcHJvcGVydHk7XHJcblxyXG5cdFx0JCh3aW5kb3cpLm9mZignaGFzaGNoYW5nZS5vd2wubmF2aWdhdGlvbicpO1xyXG5cclxuXHRcdGZvciAoaGFuZGxlciBpbiB0aGlzLl9oYW5kbGVycykge1xyXG5cdFx0XHR0aGlzLl9jb3JlLiRlbGVtZW50Lm9mZihoYW5kbGVyLCB0aGlzLl9oYW5kbGVyc1toYW5kbGVyXSk7XHJcblx0XHR9XHJcblx0XHRmb3IgKHByb3BlcnR5IGluIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMpKSB7XHJcblx0XHRcdHR5cGVvZiB0aGlzW3Byb3BlcnR5XSAhPSAnZnVuY3Rpb24nICYmICh0aGlzW3Byb3BlcnR5XSA9IG51bGwpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0JC5mbi5vd2xDYXJvdXNlbC5Db25zdHJ1Y3Rvci5QbHVnaW5zLkhhc2ggPSBIYXNoO1xyXG5cclxufSkod2luZG93LlplcHRvIHx8IHdpbmRvdy5qUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpOyJdfQ==
