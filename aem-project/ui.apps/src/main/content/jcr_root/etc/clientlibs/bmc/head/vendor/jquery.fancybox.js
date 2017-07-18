(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * fancyBox - jQuery Plugin
 * version: 2.1.5 (Fri, 14 Jun 2013)
 * @requires jQuery v1.6 or later
 *
 * Examples at http://fancyapps.com/fancybox/
 * License: www.fancyapps.com/fancybox/#license
 *
 * Copyright 2012 Janis Skarnelis - janis@fancyapps.com
 *
 */

(function (window, document, $, undefined) {
	"use strict";

	var H = $("html"),
		W = $(window),
		D = $(document),
		F = $.fancybox = function () {
			F.open.apply( this, arguments );
		},
		IE =  navigator.userAgent.match(/msie/i),
		didUpdate	= null,
		isTouch		= document.createTouch !== undefined,

		isQuery	= function(obj) {
			return obj && obj.hasOwnProperty && obj instanceof $;
		},
		isString = function(str) {
			return str && $.type(str) === "string";
		},
		isPercentage = function(str) {
			return isString(str) && str.indexOf('%') > 0;
		},
		isScrollable = function(el) {
			return (el && !(el.style.overflow && el.style.overflow === 'hidden') && ((el.clientWidth && el.scrollWidth > el.clientWidth) || (el.clientHeight && el.scrollHeight > el.clientHeight)));
		},
		getScalar = function(orig, dim) {
			var value = parseInt(orig, 10) || 0;

			if (dim && isPercentage(orig)) {
				value = F.getViewport()[ dim ] / 100 * value;
			}

			return Math.ceil(value);
		},
		getValue = function(value, dim) {
			return getScalar(value, dim) + 'px';
		};

	$.extend(F, {
		// The current version of fancyBox
		version: '2.1.5',

		defaults: {
			padding : 15,
			margin  : 20,

			width     : 800,
			height    : 600,
			minWidth  : 100,
			minHeight : 100,
			maxWidth  : 9999,
			maxHeight : 9999,
			pixelRatio: 1, // Set to 2 for retina display support

			autoSize   : true,
			autoHeight : false,
			autoWidth  : false,

			autoResize  : true,
			autoCenter  : !isTouch,
			fitToView   : true,
			aspectRatio : false,
			topRatio    : 0.5,
			leftRatio   : 0.5,

			scrolling : 'auto', // 'auto', 'yes' or 'no'
			wrapCSS   : '',

			arrows     : true,
			closeBtn   : true,
			closeClick : false,
			nextClick  : false,
			mouseWheel : true,
			autoPlay   : false,
			playSpeed  : 3000,
			preload    : 3,
			modal      : false,
			loop       : true,

			ajax  : {
				dataType : 'html',
				headers  : { 'X-fancyBox': true }
			},
			iframe : {
				scrolling : 'auto',
				preload   : true
			},
			swf : {
				wmode: 'transparent',
				allowfullscreen   : 'true',
				allowscriptaccess : 'always'
			},

			keys  : {
				next : {
					13 : 'left', // enter
					34 : 'up',   // page down
					39 : 'left', // right arrow
					40 : 'up'    // down arrow
				},
				prev : {
					8  : 'right',  // backspace
					33 : 'down',   // page up
					37 : 'right',  // left arrow
					38 : 'down'    // up arrow
				},
				close  : [27], // escape key
				play   : [32], // space - start/stop slideshow
				toggle : [70]  // letter "f" - toggle fullscreen
			},

			direction : {
				next : 'left',
				prev : 'right'
			},

			scrollOutside  : true,

			// Override some properties
			index   : 0,
			type    : null,
			href    : null,
			content : null,
			title   : null,

			// HTML templates
			tpl: {
				wrap     : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
				image    : '<img class="fancybox-image" src="{href}" alt="" />',
				iframe   : '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (IE ? ' allowtransparency="true"' : '') + '></iframe>',
				error    : '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
				closeBtn : '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
				next     : '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
				prev     : '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
			},

			// Properties for each animation type
			// Opening fancyBox
			openEffect  : 'fade', // 'elastic', 'fade' or 'none'
			openSpeed   : 250,
			openEasing  : 'swing',
			openOpacity : true,
			openMethod  : 'zoomIn',

			// Closing fancyBox
			closeEffect  : 'fade', // 'elastic', 'fade' or 'none'
			closeSpeed   : 250,
			closeEasing  : 'swing',
			closeOpacity : true,
			closeMethod  : 'zoomOut',

			// Changing next gallery item
			nextEffect : 'elastic', // 'elastic', 'fade' or 'none'
			nextSpeed  : 250,
			nextEasing : 'swing',
			nextMethod : 'changeIn',

			// Changing previous gallery item
			prevEffect : 'elastic', // 'elastic', 'fade' or 'none'
			prevSpeed  : 250,
			prevEasing : 'swing',
			prevMethod : 'changeOut',

			// Enable default helpers
			helpers : {
				overlay : true,
				title   : true
			},

			// Callbacks
			onCancel     : $.noop, // If canceling
			beforeLoad   : $.noop, // Before loading
			afterLoad    : $.noop, // After loading
			beforeShow   : $.noop, // Before changing in current item
			afterShow    : $.noop, // After opening
			beforeChange : $.noop, // Before changing gallery item
			beforeClose  : $.noop, // Before closing
			afterClose   : $.noop  // After closing
		},

		//Current state
		group    : {}, // Selected group
		opts     : {}, // Group options
		previous : null,  // Previous element
		coming   : null,  // Element being loaded
		current  : null,  // Currently loaded element
		isActive : false, // Is activated
		isOpen   : false, // Is currently open
		isOpened : false, // Have been fully opened at least once

		wrap  : null,
		skin  : null,
		outer : null,
		inner : null,

		player : {
			timer    : null,
			isActive : false
		},

		// Loaders
		ajaxLoad   : null,
		imgPreload : null,

		// Some collections
		transitions : {},
		helpers     : {},

		/*
		 *	Static methods
		 */

		open: function (group, opts) {
			if (!group) {
				return;
			}

			if (!$.isPlainObject(opts)) {
				opts = {};
			}

			// Close if already active
			if (false === F.close(true)) {
				return;
			}

			// Normalize group
			if (!$.isArray(group)) {
				group = isQuery(group) ? $(group).get() : [group];
			}

			// Recheck if the type of each element is `object` and set content type (image, ajax, etc)
			$.each(group, function(i, element) {
				var obj = {},
					href,
					title,
					content,
					type,
					rez,
					hrefParts,
					selector;

				if ($.type(element) === "object") {
					// Check if is DOM element
					if (element.nodeType) {
						element = $(element);
					}

					if (isQuery(element)) {
						obj = {
							href    : element.data('fancybox-href') || element.attr('href'),
							title   : element.data('fancybox-title') || element.attr('title'),
							isDom   : true,
							element : element
						};

						if ($.metadata) {
							$.extend(true, obj, element.metadata());
						}

					} else {
						obj = element;
					}
				}

				href  = opts.href  || obj.href || (isString(element) ? element : null);
				title = opts.title !== undefined ? opts.title : obj.title || '';

				content = opts.content || obj.content;
				type    = content ? 'html' : (opts.type  || obj.type);

				if (!type && obj.isDom) {
					type = element.data('fancybox-type');

					if (!type) {
						rez  = element.prop('class').match(/fancybox\.(\w+)/);
						type = rez ? rez[1] : null;
					}
				}

				if (isString(href)) {
					// Try to guess the content type
					if (!type) {
						if (F.isImage(href)) {
							type = 'image';

						} else if (F.isSWF(href)) {
							type = 'swf';

						} else if (href.charAt(0) === '#') {
							type = 'inline';

						} else if (isString(element)) {
							type    = 'html';
							content = element;
						}
					}

					// Split url into two pieces with source url and content selector, e.g,
					// "/mypage.html #my_id" will load "/mypage.html" and display element having id "my_id"
					if (type === 'ajax') {
						hrefParts = href.split(/\s+/, 2);
						href      = hrefParts.shift();
						selector  = hrefParts.shift();
					}
				}

				if (!content) {
					if (type === 'inline') {
						if (href) {
							content = $( isString(href) ? href.replace(/.*(?=#[^\s]+$)/, '') : href ); //strip for ie7

						} else if (obj.isDom) {
							content = element;
						}

					} else if (type === 'html') {
						content = href;

					} else if (!type && !href && obj.isDom) {
						type    = 'inline';
						content = element;
					}
				}

				$.extend(obj, {
					href     : href,
					type     : type,
					content  : content,
					title    : title,
					selector : selector
				});

				group[ i ] = obj;
			});

			// Extend the defaults
			F.opts = $.extend(true, {}, F.defaults, opts);

			// All options are merged recursive except keys
			if (opts.keys !== undefined) {
				F.opts.keys = opts.keys ? $.extend({}, F.defaults.keys, opts.keys) : false;
			}

			F.group = group;

			return F._start(F.opts.index);
		},

		// Cancel image loading or abort ajax request
		cancel: function () {
			var coming = F.coming;

			if (!coming || false === F.trigger('onCancel')) {
				return;
			}

			F.hideLoading();

			if (F.ajaxLoad) {
				F.ajaxLoad.abort();
			}

			F.ajaxLoad = null;

			if (F.imgPreload) {
				F.imgPreload.onload = F.imgPreload.onerror = null;
			}

			if (coming.wrap) {
				coming.wrap.stop(true, true).trigger('onReset').remove();
			}

			F.coming = null;

			// If the first item has been canceled, then clear everything
			if (!F.current) {
				F._afterZoomOut( coming );
			}
		},

		// Start closing animation if is open; remove immediately if opening/closing
		close: function (event) {
			F.cancel();

			if (false === F.trigger('beforeClose')) {
				return;
			}

			F.unbindEvents();

			if (!F.isActive) {
				return;
			}

			if (!F.isOpen || event === true) {
				$('.fancybox-wrap').stop(true).trigger('onReset').remove();

				F._afterZoomOut();

			} else {
				F.isOpen = F.isOpened = false;
				F.isClosing = true;

				$('.fancybox-item, .fancybox-nav').remove();

				F.wrap.stop(true, true).removeClass('fancybox-opened');

				F.transitions[ F.current.closeMethod ]();
			}
		},

		// Manage slideshow:
		//   $.fancybox.play(); - toggle slideshow
		//   $.fancybox.play( true ); - start
		//   $.fancybox.play( false ); - stop
		play: function ( action ) {
			var clear = function () {
					clearTimeout(F.player.timer);
				},
				set = function () {
					clear();

					if (F.current && F.player.isActive) {
						F.player.timer = setTimeout(F.next, F.current.playSpeed);
					}
				},
				stop = function () {
					clear();

					D.unbind('.player');

					F.player.isActive = false;

					F.trigger('onPlayEnd');
				},
				start = function () {
					if (F.current && (F.current.loop || F.current.index < F.group.length - 1)) {
						F.player.isActive = true;

						D.bind({
							'onCancel.player beforeClose.player' : stop,
							'onUpdate.player'   : set,
							'beforeLoad.player' : clear
						});

						set();

						F.trigger('onPlayStart');
					}
				};

			if (action === true || (!F.player.isActive && action !== false)) {
				start();
			} else {
				stop();
			}
		},

		// Navigate to next gallery item
		next: function ( direction ) {
			var current = F.current;

			if (current) {
				if (!isString(direction)) {
					direction = current.direction.next;
				}

				F.jumpto(current.index + 1, direction, 'next');
			}
		},

		// Navigate to previous gallery item
		prev: function ( direction ) {
			var current = F.current;

			if (current) {
				if (!isString(direction)) {
					direction = current.direction.prev;
				}

				F.jumpto(current.index - 1, direction, 'prev');
			}
		},

		// Navigate to gallery item by index
		jumpto: function ( index, direction, router ) {
			var current = F.current;

			if (!current) {
				return;
			}

			index = getScalar(index);

			F.direction = direction || current.direction[ (index >= current.index ? 'next' : 'prev') ];
			F.router    = router || 'jumpto';

			if (current.loop) {
				if (index < 0) {
					index = current.group.length + (index % current.group.length);
				}

				index = index % current.group.length;
			}

			if (current.group[ index ] !== undefined) {
				F.cancel();

				F._start(index);
			}
		},

		// Center inside viewport and toggle position type to fixed or absolute if needed
		reposition: function (e, onlyAbsolute) {
			var current = F.current,
				wrap    = current ? current.wrap : null,
				pos;

			if (wrap) {
				pos = F._getPosition(onlyAbsolute);

				if (e && e.type === 'scroll') {
					delete pos.position;

					wrap.stop(true, true).animate(pos, 200);

				} else {
					wrap.css(pos);

					current.pos = $.extend({}, current.dim, pos);
				}
			}
		},

		update: function (e) {
			var type = (e && e.type),
				anyway = !type || type === 'orientationchange';

			if (anyway) {
				clearTimeout(didUpdate);

				didUpdate = null;
			}

			if (!F.isOpen || didUpdate) {
				return;
			}

			didUpdate = setTimeout(function() {
				var current = F.current;

				if (!current || F.isClosing) {
					return;
				}

				F.wrap.removeClass('fancybox-tmp');

				if (anyway || type === 'load' || (type === 'resize' && current.autoResize)) {
					F._setDimension();
				}

				if (!(type === 'scroll' && current.canShrink)) {
					F.reposition(e);
				}

				F.trigger('onUpdate');

				didUpdate = null;

			}, (anyway && !isTouch ? 0 : 300));
		},

		// Shrink content to fit inside viewport or restore if resized
		toggle: function ( action ) {
			if (F.isOpen) {
				F.current.fitToView = $.type(action) === "boolean" ? action : !F.current.fitToView;

				// Help browser to restore document dimensions
				if (isTouch) {
					F.wrap.removeAttr('style').addClass('fancybox-tmp');

					F.trigger('onUpdate');
				}

				F.update();
			}
		},

		hideLoading: function () {
			D.unbind('.loading');

			$('#fancybox-loading').remove();
		},

		showLoading: function () {
			var el, viewport;

			F.hideLoading();

			el = $('<div id="fancybox-loading"><div></div></div>').click(F.cancel).appendTo('body');

			// If user will press the escape-button, the request will be canceled
			D.bind('keydown.loading', function(e) {
				if ((e.which || e.keyCode) === 27) {
					e.preventDefault();

					F.cancel();
				}
			});

			if (!F.defaults.fixed) {
				viewport = F.getViewport();

				el.css({
					position : 'absolute',
					top  : (viewport.h * 0.5) + viewport.y,
					left : (viewport.w * 0.5) + viewport.x
				});
			}
		},

		getViewport: function () {
			var locked = (F.current && F.current.locked) || false,
				rez    = {
					x: W.scrollLeft(),
					y: W.scrollTop()
				};

			if (locked) {
				rez.w = locked[0].clientWidth;
				rez.h = locked[0].clientHeight;

			} else {
				// See http://bugs.jquery.com/ticket/6724
				rez.w = isTouch && window.innerWidth  ? window.innerWidth  : W.width();
				rez.h = isTouch && window.innerHeight ? window.innerHeight : W.height();
			}

			return rez;
		},

		// Unbind the keyboard / clicking actions
		unbindEvents: function () {
			if (F.wrap && isQuery(F.wrap)) {
				F.wrap.unbind('.fb');
			}

			D.unbind('.fb');
			W.unbind('.fb');
		},

		bindEvents: function () {
			var current = F.current,
				keys;

			if (!current) {
				return;
			}

			// Changing document height on iOS devices triggers a 'resize' event,
			// that can change document height... repeating infinitely
			W.bind('orientationchange.fb' + (isTouch ? '' : ' resize.fb') + (current.autoCenter && !current.locked ? ' scroll.fb' : ''), F.update);

			keys = current.keys;

			if (keys) {
				D.bind('keydown.fb', function (e) {
					var code   = e.which || e.keyCode,
						target = e.target || e.srcElement;

					// Skip esc key if loading, because showLoading will cancel preloading
					if (code === 27 && F.coming) {
						return false;
					}

					// Ignore key combinations and key events within form elements
					if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !(target && (target.type || $(target).is('[contenteditable]')))) {
						$.each(keys, function(i, val) {
							if (current.group.length > 1 && val[ code ] !== undefined) {
								F[ i ]( val[ code ] );

								e.preventDefault();
								return false;
							}

							if ($.inArray(code, val) > -1) {
								F[ i ] ();

								e.preventDefault();
								return false;
							}
						});
					}
				});
			}

			if ($.fn.mousewheel && current.mouseWheel) {
				F.wrap.bind('mousewheel.fb', function (e, delta, deltaX, deltaY) {
					var target = e.target || null,
						parent = $(target),
						canScroll = false;

					while (parent.length) {
						if (canScroll || parent.is('.fancybox-skin') || parent.is('.fancybox-wrap')) {
							break;
						}

						canScroll = isScrollable( parent[0] );
						parent    = $(parent).parent();
					}

					if (delta !== 0 && !canScroll) {
						if (F.group.length > 1 && !current.canShrink) {
							if (deltaY > 0 || deltaX > 0) {
								F.prev( deltaY > 0 ? 'down' : 'left' );

							} else if (deltaY < 0 || deltaX < 0) {
								F.next( deltaY < 0 ? 'up' : 'right' );
							}

							e.preventDefault();
						}
					}
				});
			}
		},

		trigger: function (event, o) {
			var ret, obj = o || F.coming || F.current;

			if (!obj) {
				return;
			}

			if ($.isFunction( obj[event] )) {
				ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1));
			}

			if (ret === false) {
				return false;
			}

			if (obj.helpers) {
				$.each(obj.helpers, function (helper, opts) {
					if (opts && F.helpers[helper] && $.isFunction(F.helpers[helper][event])) {
						F.helpers[helper][event]($.extend(true, {}, F.helpers[helper].defaults, opts), obj);
					}
				});
			}

			D.trigger(event);
		},

		isImage: function (str) {
			return isString(str) && str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
		},

		isSWF: function (str) {
			return isString(str) && str.match(/\.(swf)((\?|#).*)?$/i);
		},

		_start: function (index) {
			var coming = {},
				obj,
				href,
				type,
				margin,
				padding;

			index = getScalar( index );
			obj   = F.group[ index ] || null;

			if (!obj) {
				return false;
			}

			coming = $.extend(true, {}, F.opts, obj);

			// Convert margin and padding properties to array - top, right, bottom, left
			margin  = coming.margin;
			padding = coming.padding;

			if ($.type(margin) === 'number') {
				coming.margin = [margin, margin, margin, margin];
			}

			if ($.type(padding) === 'number') {
				coming.padding = [padding, padding, padding, padding];
			}

			// 'modal' propery is just a shortcut
			if (coming.modal) {
				$.extend(true, coming, {
					closeBtn   : false,
					closeClick : false,
					nextClick  : false,
					arrows     : false,
					mouseWheel : false,
					keys       : null,
					helpers: {
						overlay : {
							closeClick : false
						}
					}
				});
			}

			// 'autoSize' property is a shortcut, too
			if (coming.autoSize) {
				coming.autoWidth = coming.autoHeight = true;
			}

			if (coming.width === 'auto') {
				coming.autoWidth = true;
			}

			if (coming.height === 'auto') {
				coming.autoHeight = true;
			}

			/*
			 * Add reference to the group, so it`s possible to access from callbacks, example:
			 * afterLoad : function() {
			 *     this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
			 * }
			 */

			coming.group  = F.group;
			coming.index  = index;

			// Give a chance for callback or helpers to update coming item (type, title, etc)
			F.coming = coming;

			if (false === F.trigger('beforeLoad')) {
				F.coming = null;

				return;
			}

			type = coming.type;
			href = coming.href;

			if (!type) {
				F.coming = null;

				//If we can not determine content type then drop silently or display next/prev item if looping through gallery
				if (F.current && F.router && F.router !== 'jumpto') {
					F.current.index = index;

					return F[ F.router ]( F.direction );
				}

				return false;
			}

			F.isActive = true;

			if (type === 'image' || type === 'swf') {
				coming.autoHeight = coming.autoWidth = false;
				coming.scrolling  = 'visible';
			}

			if (type === 'image') {
				coming.aspectRatio = true;
			}

			if (type === 'iframe' && isTouch) {
				coming.scrolling = 'scroll';
			}

			// Build the neccessary markup
			coming.wrap = $(coming.tpl.wrap).addClass('fancybox-' + (isTouch ? 'mobile' : 'desktop') + ' fancybox-type-' + type + ' fancybox-tmp ' + coming.wrapCSS).appendTo( coming.parent || 'body' );

			$.extend(coming, {
				skin  : $('.fancybox-skin',  coming.wrap),
				outer : $('.fancybox-outer', coming.wrap),
				inner : $('.fancybox-inner', coming.wrap)
			});

			$.each(["Top", "Right", "Bottom", "Left"], function(i, v) {
				coming.skin.css('padding' + v, getValue(coming.padding[ i ]));
			});

			F.trigger('onReady');

			// Check before try to load; 'inline' and 'html' types need content, others - href
			if (type === 'inline' || type === 'html') {
				if (!coming.content || !coming.content.length) {
					return F._error( 'content' );
				}

			} else if (!href) {
				return F._error( 'href' );
			}

			if (type === 'image') {
				F._loadImage();

			} else if (type === 'ajax') {
				F._loadAjax();

			} else if (type === 'iframe') {
				F._loadIframe();

			} else {
				F._afterLoad();
			}
		},

		_error: function ( type ) {
			$.extend(F.coming, {
				type       : 'html',
				autoWidth  : true,
				autoHeight : true,
				minWidth   : 0,
				minHeight  : 0,
				scrolling  : 'no',
				hasError   : type,
				content    : F.coming.tpl.error
			});

			F._afterLoad();
		},

		_loadImage: function () {
			// Reset preload image so it is later possible to check "complete" property
			var img = F.imgPreload = new Image();

			img.onload = function () {
				this.onload = this.onerror = null;

				F.coming.width  = this.width / F.opts.pixelRatio;
				F.coming.height = this.height / F.opts.pixelRatio;

				F._afterLoad();
			};

			img.onerror = function () {
				this.onload = this.onerror = null;

				F._error( 'image' );
			};

			img.src = F.coming.href;

			if (img.complete !== true) {
				F.showLoading();
			}
		},

		_loadAjax: function () {
			var coming = F.coming;

			F.showLoading();

			F.ajaxLoad = $.ajax($.extend({}, coming.ajax, {
				url: coming.href,
				error: function (jqXHR, textStatus) {
					if (F.coming && textStatus !== 'abort') {
						F._error( 'ajax', jqXHR );

					} else {
						F.hideLoading();
					}
				},
				success: function (data, textStatus) {
					if (textStatus === 'success') {
						coming.content = data;

						F._afterLoad();
					}
				}
			}));
		},

		_loadIframe: function() {
			var coming = F.coming,
				iframe = $(coming.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime()))
					.attr('scrolling', isTouch ? 'auto' : coming.iframe.scrolling)
					.attr('src', coming.href);

			// This helps IE
			$(coming.wrap).bind('onReset', function () {
				try {
					$(this).find('iframe').hide().attr('src', '//about:blank').end().empty();
				} catch (e) {}
			});

			if (coming.iframe.preload) {
				F.showLoading();

				iframe.one('load', function() {
					$(this).data('ready', 1);

					// iOS will lose scrolling if we resize
					if (!isTouch) {
						$(this).bind('load.fb', F.update);
					}

					// Without this trick:
					//   - iframe won't scroll on iOS devices
					//   - IE7 sometimes displays empty iframe
					$(this).parents('.fancybox-wrap').width('100%').removeClass('fancybox-tmp').show();

					F._afterLoad();
				});
			}

			coming.content = iframe.appendTo( coming.inner );

			if (!coming.iframe.preload) {
				F._afterLoad();
			}
		},

		_preloadImages: function() {
			var group   = F.group,
				current = F.current,
				len     = group.length,
				cnt     = current.preload ? Math.min(current.preload, len - 1) : 0,
				item,
				i;

			for (i = 1; i <= cnt; i += 1) {
				item = group[ (current.index + i ) % len ];

				if (item.type === 'image' && item.href) {
					new Image().src = item.href;
				}
			}
		},

		_afterLoad: function () {
			var coming   = F.coming,
				previous = F.current,
				placeholder = 'fancybox-placeholder',
				current,
				content,
				type,
				scrolling,
				href,
				embed;

			F.hideLoading();

			if (!coming || F.isActive === false) {
				return;
			}

			if (false === F.trigger('afterLoad', coming, previous)) {
				coming.wrap.stop(true).trigger('onReset').remove();

				F.coming = null;

				return;
			}

			if (previous) {
				F.trigger('beforeChange', previous);

				previous.wrap.stop(true).removeClass('fancybox-opened')
					.find('.fancybox-item, .fancybox-nav')
					.remove();
			}

			F.unbindEvents();

			current   = coming;
			content   = coming.content;
			type      = coming.type;
			scrolling = coming.scrolling;

			$.extend(F, {
				wrap  : current.wrap,
				skin  : current.skin,
				outer : current.outer,
				inner : current.inner,
				current  : current,
				previous : previous
			});

			href = current.href;

			switch (type) {
				case 'inline':
				case 'ajax':
				case 'html':
					if (current.selector) {
						content = $('<div>').html(content).find(current.selector);

					} else if (isQuery(content)) {
						if (!content.data(placeholder)) {
							content.data(placeholder, $('<div class="' + placeholder + '"></div>').insertAfter( content ).hide() );
						}

						content = content.show().detach();

						current.wrap.bind('onReset', function () {
							if ($(this).find(content).length) {
								content.hide().replaceAll( content.data(placeholder) ).data(placeholder, false);
							}
						});
					}
				break;

				case 'image':
					content = current.tpl.image.replace('{href}', href);
				break;

				case 'swf':
					content = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + href + '"></param>';
					embed   = '';

					$.each(current.swf, function(name, val) {
						content += '<param name="' + name + '" value="' + val + '"></param>';
						embed   += ' ' + name + '="' + val + '"';
					});

					content += '<embed src="' + href + '" type="application/x-shockwave-flash" width="100%" height="100%"' + embed + '></embed></object>';
				break;
			}

			if (!(isQuery(content) && content.parent().is(current.inner))) {
				current.inner.append( content );
			}

			// Give a chance for helpers or callbacks to update elements
			F.trigger('beforeShow');

			// Set scrolling before calculating dimensions
			current.inner.css('overflow', scrolling === 'yes' ? 'scroll' : (scrolling === 'no' ? 'hidden' : scrolling));

			// Set initial dimensions and start position
			F._setDimension();

			F.reposition();

			F.isOpen = false;
			F.coming = null;

			F.bindEvents();

			if (!F.isOpened) {
				$('.fancybox-wrap').not( current.wrap ).stop(true).trigger('onReset').remove();

			} else if (previous.prevMethod) {
				F.transitions[ previous.prevMethod ]();
			}

			F.transitions[ F.isOpened ? current.nextMethod : current.openMethod ]();

			F._preloadImages();
		},

		_setDimension: function () {
			var viewport   = F.getViewport(),
				steps      = 0,
				canShrink  = false,
				canExpand  = false,
				wrap       = F.wrap,
				skin       = F.skin,
				inner      = F.inner,
				current    = F.current,
				width      = current.width,
				height     = current.height,
				minWidth   = current.minWidth,
				minHeight  = current.minHeight,
				maxWidth   = current.maxWidth,
				maxHeight  = current.maxHeight,
				scrolling  = current.scrolling,
				scrollOut  = current.scrollOutside ? current.scrollbarWidth : 0,
				margin     = current.margin,
				wMargin    = getScalar(margin[1] + margin[3]),
				hMargin    = getScalar(margin[0] + margin[2]),
				wPadding,
				hPadding,
				wSpace,
				hSpace,
				origWidth,
				origHeight,
				origMaxWidth,
				origMaxHeight,
				ratio,
				width_,
				height_,
				maxWidth_,
				maxHeight_,
				iframe,
				body;

			// Reset dimensions so we could re-check actual size
			wrap.add(skin).add(inner).width('auto').height('auto').removeClass('fancybox-tmp');

			wPadding = getScalar(skin.outerWidth(true)  - skin.width());
			hPadding = getScalar(skin.outerHeight(true) - skin.height());

			// Any space between content and viewport (margin, padding, border, title)
			wSpace = wMargin + wPadding;
			hSpace = hMargin + hPadding;

			origWidth  = isPercentage(width)  ? (viewport.w - wSpace) * getScalar(width)  / 100 : width;
			origHeight = isPercentage(height) ? (viewport.h - hSpace) * getScalar(height) / 100 : height;

			if (current.type === 'iframe') {
				iframe = current.content;

				if (current.autoHeight && iframe.data('ready') === 1) {
					try {
						if (iframe[0].contentWindow.document.location) {
							inner.width( origWidth ).height(9999);

							body = iframe.contents().find('body');

							if (scrollOut) {
								body.css('overflow-x', 'hidden');
							}

							origHeight = body.outerHeight(true);
						}

					} catch (e) {}
				}

			} else if (current.autoWidth || current.autoHeight) {
				inner.addClass( 'fancybox-tmp' );

				// Set width or height in case we need to calculate only one dimension
				if (!current.autoWidth) {
					inner.width( origWidth );
				}

				if (!current.autoHeight) {
					inner.height( origHeight );
				}

				if (current.autoWidth) {
					origWidth = inner.width();
				}

				if (current.autoHeight) {
					origHeight = inner.height();
				}

				inner.removeClass( 'fancybox-tmp' );
			}

			width  = getScalar( origWidth );
			height = getScalar( origHeight );

			ratio  = origWidth / origHeight;

			// Calculations for the content
			minWidth  = getScalar(isPercentage(minWidth) ? getScalar(minWidth, 'w') - wSpace : minWidth);
			maxWidth  = getScalar(isPercentage(maxWidth) ? getScalar(maxWidth, 'w') - wSpace : maxWidth);

			minHeight = getScalar(isPercentage(minHeight) ? getScalar(minHeight, 'h') - hSpace : minHeight);
			maxHeight = getScalar(isPercentage(maxHeight) ? getScalar(maxHeight, 'h') - hSpace : maxHeight);

			// These will be used to determine if wrap can fit in the viewport
			origMaxWidth  = maxWidth;
			origMaxHeight = maxHeight;

			if (current.fitToView) {
				maxWidth  = Math.min(viewport.w - wSpace, maxWidth);
				maxHeight = Math.min(viewport.h - hSpace, maxHeight);
			}

			maxWidth_  = viewport.w - wMargin;
			maxHeight_ = viewport.h - hMargin;

			if (current.aspectRatio) {
				if (width > maxWidth) {
					width  = maxWidth;
					height = getScalar(width / ratio);
				}

				if (height > maxHeight) {
					height = maxHeight;
					width  = getScalar(height * ratio);
				}

				if (width < minWidth) {
					width  = minWidth;
					height = getScalar(width / ratio);
				}

				if (height < minHeight) {
					height = minHeight;
					width  = getScalar(height * ratio);
				}

			} else {
				width = Math.max(minWidth, Math.min(width, maxWidth));

				if (current.autoHeight && current.type !== 'iframe') {
					inner.width( width );

					height = inner.height();
				}

				height = Math.max(minHeight, Math.min(height, maxHeight));
			}

			// Try to fit inside viewport (including the title)
			if (current.fitToView) {
				inner.width( width ).height( height );

				wrap.width( width + wPadding );

				// Real wrap dimensions
				width_  = wrap.width();
				height_ = wrap.height();

				if (current.aspectRatio) {
					while ((width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight) {
						if (steps++ > 19) {
							break;
						}

						height = Math.max(minHeight, Math.min(maxHeight, height - 10));
						width  = getScalar(height * ratio);

						if (width < minWidth) {
							width  = minWidth;
							height = getScalar(width / ratio);
						}

						if (width > maxWidth) {
							width  = maxWidth;
							height = getScalar(width / ratio);
						}

						inner.width( width ).height( height );

						wrap.width( width + wPadding );

						width_  = wrap.width();
						height_ = wrap.height();
					}

				} else {
					width  = Math.max(minWidth,  Math.min(width,  width  - (width_  - maxWidth_)));
					height = Math.max(minHeight, Math.min(height, height - (height_ - maxHeight_)));
				}
			}

			if (scrollOut && scrolling === 'auto' && height < origHeight && (width + wPadding + scrollOut) < maxWidth_) {
				width += scrollOut;
			}

			inner.width( width ).height( height );

			wrap.width( width + wPadding );

			width_  = wrap.width();
			height_ = wrap.height();

			canShrink = (width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight;
			canExpand = current.aspectRatio ? (width < origMaxWidth && height < origMaxHeight && width < origWidth && height < origHeight) : ((width < origMaxWidth || height < origMaxHeight) && (width < origWidth || height < origHeight));

			$.extend(current, {
				dim : {
					width	: getValue( width_ ),
					height	: getValue( height_ )
				},
				origWidth  : origWidth,
				origHeight : origHeight,
				canShrink  : canShrink,
				canExpand  : canExpand,
				wPadding   : wPadding,
				hPadding   : hPadding,
				wrapSpace  : height_ - skin.outerHeight(true),
				skinSpace  : skin.height() - height
			});

			if (!iframe && current.autoHeight && height > minHeight && height < maxHeight && !canExpand) {
				inner.height('auto');
			}
		},

		_getPosition: function (onlyAbsolute) {
			var current  = F.current,
				viewport = F.getViewport(),
				margin   = current.margin,
				width    = F.wrap.width()  + margin[1] + margin[3],
				height   = F.wrap.height() + margin[0] + margin[2],
				rez      = {
					position: 'absolute',
					top  : margin[0],
					left : margin[3]
				};

			if (current.autoCenter && current.fixed && !onlyAbsolute && height <= viewport.h && width <= viewport.w) {
				rez.position = 'fixed';

			} else if (!current.locked) {
				rez.top  += viewport.y;
				rez.left += viewport.x;
			}

			rez.top  = getValue(Math.max(rez.top,  rez.top  + ((viewport.h - height) * current.topRatio)));
			rez.left = getValue(Math.max(rez.left, rez.left + ((viewport.w - width)  * current.leftRatio)));

			return rez;
		},

		_afterZoomIn: function () {
			var current = F.current;

			if (!current) {
				return;
			}

			F.isOpen = F.isOpened = true;

			F.wrap.css('overflow', 'visible').addClass('fancybox-opened');

			F.update();

			// Assign a click event
			if ( current.closeClick || (current.nextClick && F.group.length > 1) ) {
				F.inner.css('cursor', 'pointer').bind('click.fb', function(e) {
					if (!$(e.target).is('a') && !$(e.target).parent().is('a')) {
						e.preventDefault();

						F[ current.closeClick ? 'close' : 'next' ]();
					}
				});
			}

			// Create a close button
			if (current.closeBtn) {
				$(current.tpl.closeBtn).appendTo(F.skin).bind('click.fb', function(e) {
					e.preventDefault();

					F.close();
				});
			}

			// Create navigation arrows
			if (current.arrows && F.group.length > 1) {
				if (current.loop || current.index > 0) {
					$(current.tpl.prev).appendTo(F.outer).bind('click.fb', F.prev);
				}

				if (current.loop || current.index < F.group.length - 1) {
					$(current.tpl.next).appendTo(F.outer).bind('click.fb', F.next);
				}
			}

			F.trigger('afterShow');

			// Stop the slideshow if this is the last item
			if (!current.loop && current.index === current.group.length - 1) {
				F.play( false );

			} else if (F.opts.autoPlay && !F.player.isActive) {
				F.opts.autoPlay = false;

				F.play();
			}
		},

		_afterZoomOut: function ( obj ) {
			obj = obj || F.current;

			$('.fancybox-wrap').trigger('onReset').remove();

			$.extend(F, {
				group  : {},
				opts   : {},
				router : false,
				current   : null,
				isActive  : false,
				isOpened  : false,
				isOpen    : false,
				isClosing : false,
				wrap   : null,
				skin   : null,
				outer  : null,
				inner  : null
			});

			F.trigger('afterClose', obj);
		}
	});

	/*
	 *	Default transitions
	 */

	F.transitions = {
		getOrigPosition: function () {
			var current  = F.current,
				element  = current.element,
				orig     = current.orig,
				pos      = {},
				width    = 50,
				height   = 50,
				hPadding = current.hPadding,
				wPadding = current.wPadding,
				viewport = F.getViewport();

			if (!orig && current.isDom && element.is(':visible')) {
				orig = element.find('img:first');

				if (!orig.length) {
					orig = element;
				}
			}

			if (isQuery(orig)) {
				pos = orig.offset();

				if (orig.is('img')) {
					width  = orig.outerWidth();
					height = orig.outerHeight();
				}

			} else {
				pos.top  = viewport.y + (viewport.h - height) * current.topRatio;
				pos.left = viewport.x + (viewport.w - width)  * current.leftRatio;
			}

			if (F.wrap.css('position') === 'fixed' || current.locked) {
				pos.top  -= viewport.y;
				pos.left -= viewport.x;
			}

			pos = {
				top     : getValue(pos.top  - hPadding * current.topRatio),
				left    : getValue(pos.left - wPadding * current.leftRatio),
				width   : getValue(width  + wPadding),
				height  : getValue(height + hPadding)
			};

			return pos;
		},

		step: function (now, fx) {
			var ratio,
				padding,
				value,
				prop       = fx.prop,
				current    = F.current,
				wrapSpace  = current.wrapSpace,
				skinSpace  = current.skinSpace;

			if (prop === 'width' || prop === 'height') {
				ratio = fx.end === fx.start ? 1 : (now - fx.start) / (fx.end - fx.start);

				if (F.isClosing) {
					ratio = 1 - ratio;
				}

				padding = prop === 'width' ? current.wPadding : current.hPadding;
				value   = now - padding;

				F.skin[ prop ](  getScalar( prop === 'width' ?  value : value - (wrapSpace * ratio) ) );
				F.inner[ prop ]( getScalar( prop === 'width' ?  value : value - (wrapSpace * ratio) - (skinSpace * ratio) ) );
			}
		},

		zoomIn: function () {
			var current  = F.current,
				startPos = current.pos,
				effect   = current.openEffect,
				elastic  = effect === 'elastic',
				endPos   = $.extend({opacity : 1}, startPos);

			// Remove "position" property that breaks older IE
			delete endPos.position;

			if (elastic) {
				startPos = this.getOrigPosition();

				if (current.openOpacity) {
					startPos.opacity = 0.1;
				}

			} else if (effect === 'fade') {
				startPos.opacity = 0.1;
			}

			F.wrap.css(startPos).animate(endPos, {
				duration : effect === 'none' ? 0 : current.openSpeed,
				easing   : current.openEasing,
				step     : elastic ? this.step : null,
				complete : F._afterZoomIn
			});
		},

		zoomOut: function () {
			var current  = F.current,
				effect   = current.closeEffect,
				elastic  = effect === 'elastic',
				endPos   = {opacity : 0.1};

			if (elastic) {
				endPos = this.getOrigPosition();

				if (current.closeOpacity) {
					endPos.opacity = 0.1;
				}
			}

			F.wrap.animate(endPos, {
				duration : effect === 'none' ? 0 : current.closeSpeed,
				easing   : current.closeEasing,
				step     : elastic ? this.step : null,
				complete : F._afterZoomOut
			});
		},

		changeIn: function () {
			var current   = F.current,
				effect    = current.nextEffect,
				startPos  = current.pos,
				endPos    = { opacity : 1 },
				direction = F.direction,
				distance  = 200,
				field;

			startPos.opacity = 0.1;

			if (effect === 'elastic') {
				field = direction === 'down' || direction === 'up' ? 'top' : 'left';

				if (direction === 'down' || direction === 'right') {
					startPos[ field ] = getValue(getScalar(startPos[ field ]) - distance);
					endPos[ field ]   = '+=' + distance + 'px';

				} else {
					startPos[ field ] = getValue(getScalar(startPos[ field ]) + distance);
					endPos[ field ]   = '-=' + distance + 'px';
				}
			}

			// Workaround for http://bugs.jquery.com/ticket/12273
			if (effect === 'none') {
				F._afterZoomIn();

			} else {
				F.wrap.css(startPos).animate(endPos, {
					duration : current.nextSpeed,
					easing   : current.nextEasing,
					complete : F._afterZoomIn
				});
			}
		},

		changeOut: function () {
			var previous  = F.previous,
				effect    = previous.prevEffect,
				endPos    = { opacity : 0.1 },
				direction = F.direction,
				distance  = 200;

			if (effect === 'elastic') {
				endPos[ direction === 'down' || direction === 'up' ? 'top' : 'left' ] = ( direction === 'up' || direction === 'left' ? '-' : '+' ) + '=' + distance + 'px';
			}

			previous.wrap.animate(endPos, {
				duration : effect === 'none' ? 0 : previous.prevSpeed,
				easing   : previous.prevEasing,
				complete : function () {
					$(this).trigger('onReset').remove();
				}
			});
		}
	};

	/*
	 *	Overlay helper
	 */

	F.helpers.overlay = {
		defaults : {
			closeClick : true,      // if true, fancyBox will be closed when user clicks on the overlay
			speedOut   : 200,       // duration of fadeOut animation
			showEarly  : true,      // indicates if should be opened immediately or wait until the content is ready
			css        : {},        // custom CSS properties
			locked     : !isTouch,  // if true, the content will be locked into overlay
			fixed      : true       // if false, the overlay CSS position property will not be set to "fixed"
		},

		overlay : null,      // current handle
		fixed   : false,     // indicates if the overlay has position "fixed"
		el      : $('html'), // element that contains "the lock"

		// Public methods
		create : function(opts) {
			opts = $.extend({}, this.defaults, opts);

			if (this.overlay) {
				this.close();
			}

			this.overlay = $('<div class="fancybox-overlay"></div>').appendTo( F.coming ? F.coming.parent : opts.parent );
			this.fixed   = false;

			if (opts.fixed && F.defaults.fixed) {
				this.overlay.addClass('fancybox-overlay-fixed');

				this.fixed = true;
			}
		},

		open : function(opts) {
			var that = this;

			opts = $.extend({}, this.defaults, opts);

			if (this.overlay) {
				this.overlay.unbind('.overlay').width('auto').height('auto');

			} else {
				this.create(opts);
			}

			if (!this.fixed) {
				W.bind('resize.overlay', $.proxy( this.update, this) );

				this.update();
			}

			if (opts.closeClick) {
				this.overlay.bind('click.overlay', function(e) {
					if ($(e.target).hasClass('fancybox-overlay')) {
						if (F.isActive) {
							F.close();
						} else {
							that.close();
						}

						return false;
					}
				});
			}

			this.overlay.css( opts.css ).show();
		},

		close : function() {
			var scrollV, scrollH;

			W.unbind('resize.overlay');

			if (this.el.hasClass('fancybox-lock')) {
				$('.fancybox-margin').removeClass('fancybox-margin');

				scrollV = W.scrollTop();
				scrollH = W.scrollLeft();

				this.el.removeClass('fancybox-lock');

				W.scrollTop( scrollV ).scrollLeft( scrollH );
			}

			$('.fancybox-overlay').remove().hide();

			$.extend(this, {
				overlay : null,
				fixed   : false
			});
		},

		// Private, callbacks

		update : function () {
			var width = '100%', offsetWidth;

			// Reset width/height so it will not mess
			this.overlay.width(width).height('100%');

			// jQuery does not return reliable result for IE
			if (IE) {
				offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);

				if (D.width() > offsetWidth) {
					width = D.width();
				}

			} else if (D.width() > W.width()) {
				width = D.width();
			}

			this.overlay.width(width).height(D.height());
		},

		// This is where we can manipulate DOM, because later it would cause iframes to reload
		onReady : function (opts, obj) {
			var overlay = this.overlay;

			$('.fancybox-overlay').stop(true, true);

			if (!overlay) {
				this.create(opts);
			}

			if (opts.locked && this.fixed && obj.fixed) {
				if (!overlay) {
					this.margin = D.height() > W.height() ? $('html').css('margin-right').replace("px", "") : false;
				}

				obj.locked = this.overlay.append( obj.wrap );
				obj.fixed  = false;
			}

			if (opts.showEarly === true) {
				this.beforeShow.apply(this, arguments);
			}
		},

		beforeShow : function(opts, obj) {
			var scrollV, scrollH;

			if (obj.locked) {
				if (this.margin !== false) {
					$('*').filter(function(){
						return ($(this).css('position') === 'fixed' && !$(this).hasClass("fancybox-overlay") && !$(this).hasClass("fancybox-wrap") );
					}).addClass('fancybox-margin');

					this.el.addClass('fancybox-margin');
				}

				scrollV = W.scrollTop();
				scrollH = W.scrollLeft();

				this.el.addClass('fancybox-lock');

				W.scrollTop( scrollV ).scrollLeft( scrollH );
			}

			this.open(opts);
		},

		onUpdate : function() {
			if (!this.fixed) {
				this.update();
			}
		},

		afterClose: function (opts) {
			// Remove overlay if exists and fancyBox is not opening
			// (e.g., it is not being open using afterClose callback)
			//if (this.overlay && !F.isActive) {
			if (this.overlay && !F.coming) {
				this.overlay.fadeOut(opts.speedOut, $.proxy( this.close, this ));
			}
		}
	};

	/*
	 *	Title helper
	 */

	F.helpers.title = {
		defaults : {
			type     : 'float', // 'float', 'inside', 'outside' or 'over',
			position : 'bottom' // 'top' or 'bottom'
		},

		beforeShow: function (opts) {
			var current = F.current,
				text    = current.title,
				type    = opts.type,
				title,
				target;

			if ($.isFunction(text)) {
				text = text.call(current.element, current);
			}

			if (!isString(text) || $.trim(text) === '') {
				return;
			}

			title = $('<div class="fancybox-title fancybox-title-' + type + '-wrap">' + text + '</div>');

			switch (type) {
				case 'inside':
					target = F.skin;
				break;

				case 'outside':
					target = F.wrap;
				break;

				case 'over':
					target = F.inner;
				break;

				default: // 'float'
					target = F.skin;

					title.appendTo('body');

					if (IE) {
						title.width( title.width() );
					}

					title.wrapInner('<span class="child"></span>');

					//Increase bottom margin so this title will also fit into viewport
					F.current.margin[2] += Math.abs( getScalar(title.css('margin-bottom')) );
				break;
			}

			title[ (opts.position === 'top' ? 'prependTo'  : 'appendTo') ](target);
		}
	};

	// jQuery plugin initialization
	$.fn.fancybox = function (options) {
		var index,
			that     = $(this),
			selector = this.selector || '',
			run      = function(e) {
				var what = $(this).blur(), idx = index, relType, relVal;

				if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) && !what.is('.fancybox-wrap')) {
					relType = options.groupAttr || 'data-fancybox-group';
					relVal  = what.attr(relType);

					if (!relVal) {
						relType = 'rel';
						relVal  = what.get(0)[ relType ];
					}

					if (relVal && relVal !== '' && relVal !== 'nofollow') {
						what = selector.length ? $(selector) : that;
						what = what.filter('[' + relType + '="' + relVal + '"]');
						idx  = what.index(this);
					}

					options.index = idx;

					// Stop an event from bubbling if everything is fine
					if (F.open(what, options) !== false) {
						e.preventDefault();
					}
				}
			};

		options = options || {};
		index   = options.index || 0;

		if (!selector || options.live === false) {
			that.unbind('click.fb-start').bind('click.fb-start', run);

		} else {
			D.undelegate(selector, 'click.fb-start').delegate(selector + ":not('.fancybox-item, .fancybox-nav')", 'click.fb-start', run);
		}

		this.filter('[data-fancybox-start=1]').trigger('click');

		return this;
	};

	// Tests that need a body at doc ready
	D.ready(function() {
		var w1, w2;

		if ( $.scrollbarWidth === undefined ) {
			// http://benalman.com/projects/jquery-misc-plugins/#scrollbarwidth
			$.scrollbarWidth = function() {
				var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body'),
					child  = parent.children(),
					width  = child.innerWidth() - child.height( 99 ).innerWidth();

				parent.remove();

				return width;
			};
		}

		if ( $.support.fixedPosition === undefined ) {
			$.support.fixedPosition = (function() {
				var elem  = $('<div style="position:fixed;top:20px;"></div>').appendTo('body'),
					fixed = ( elem[0].offsetTop === 20 || elem[0].offsetTop === 15 );

				elem.remove();

				return fixed;
			}());
		}

		$.extend(F.defaults, {
			scrollbarWidth : $.scrollbarWidth(),
			fixed  : $.support.fixedPosition,
			parent : $('body')
		});

		//Get real width of page scroll-bar
		w1 = $(window).width();

		H.addClass('fancybox-lock-test');

		w2 = $(window).width();

		H.removeClass('fancybox-lock-test');

		$("<style type='text/css'>.fancybox-margin{margin-right:" + (w2 - w1) + "px;}</style>").appendTo("head");
	});

}(window, document, jQuery));
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LmZhbmN5Ym94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBmYW5jeUJveCAtIGpRdWVyeSBQbHVnaW5cbiAqIHZlcnNpb246IDIuMS41IChGcmksIDE0IEp1biAyMDEzKVxuICogQHJlcXVpcmVzIGpRdWVyeSB2MS42IG9yIGxhdGVyXG4gKlxuICogRXhhbXBsZXMgYXQgaHR0cDovL2ZhbmN5YXBwcy5jb20vZmFuY3lib3gvXG4gKiBMaWNlbnNlOiB3d3cuZmFuY3lhcHBzLmNvbS9mYW5jeWJveC8jbGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAyMDEyIEphbmlzIFNrYXJuZWxpcyAtIGphbmlzQGZhbmN5YXBwcy5jb21cbiAqXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIEggPSAkKFwiaHRtbFwiKSxcblx0XHRXID0gJCh3aW5kb3cpLFxuXHRcdEQgPSAkKGRvY3VtZW50KSxcblx0XHRGID0gJC5mYW5jeWJveCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdEYub3Blbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0fSxcblx0XHRJRSA9ICBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9tc2llL2kpLFxuXHRcdGRpZFVwZGF0ZVx0PSBudWxsLFxuXHRcdGlzVG91Y2hcdFx0PSBkb2N1bWVudC5jcmVhdGVUb3VjaCAhPT0gdW5kZWZpbmVkLFxuXG5cdFx0aXNRdWVyeVx0PSBmdW5jdGlvbihvYmopIHtcblx0XHRcdHJldHVybiBvYmogJiYgb2JqLmhhc093blByb3BlcnR5ICYmIG9iaiBpbnN0YW5jZW9mICQ7XG5cdFx0fSxcblx0XHRpc1N0cmluZyA9IGZ1bmN0aW9uKHN0cikge1xuXHRcdFx0cmV0dXJuIHN0ciAmJiAkLnR5cGUoc3RyKSA9PT0gXCJzdHJpbmdcIjtcblx0XHR9LFxuXHRcdGlzUGVyY2VudGFnZSA9IGZ1bmN0aW9uKHN0cikge1xuXHRcdFx0cmV0dXJuIGlzU3RyaW5nKHN0cikgJiYgc3RyLmluZGV4T2YoJyUnKSA+IDA7XG5cdFx0fSxcblx0XHRpc1Njcm9sbGFibGUgPSBmdW5jdGlvbihlbCkge1xuXHRcdFx0cmV0dXJuIChlbCAmJiAhKGVsLnN0eWxlLm92ZXJmbG93ICYmIGVsLnN0eWxlLm92ZXJmbG93ID09PSAnaGlkZGVuJykgJiYgKChlbC5jbGllbnRXaWR0aCAmJiBlbC5zY3JvbGxXaWR0aCA+IGVsLmNsaWVudFdpZHRoKSB8fCAoZWwuY2xpZW50SGVpZ2h0ICYmIGVsLnNjcm9sbEhlaWdodCA+IGVsLmNsaWVudEhlaWdodCkpKTtcblx0XHR9LFxuXHRcdGdldFNjYWxhciA9IGZ1bmN0aW9uKG9yaWcsIGRpbSkge1xuXHRcdFx0dmFyIHZhbHVlID0gcGFyc2VJbnQob3JpZywgMTApIHx8IDA7XG5cblx0XHRcdGlmIChkaW0gJiYgaXNQZXJjZW50YWdlKG9yaWcpKSB7XG5cdFx0XHRcdHZhbHVlID0gRi5nZXRWaWV3cG9ydCgpWyBkaW0gXSAvIDEwMCAqIHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gTWF0aC5jZWlsKHZhbHVlKTtcblx0XHR9LFxuXHRcdGdldFZhbHVlID0gZnVuY3Rpb24odmFsdWUsIGRpbSkge1xuXHRcdFx0cmV0dXJuIGdldFNjYWxhcih2YWx1ZSwgZGltKSArICdweCc7XG5cdFx0fTtcblxuXHQkLmV4dGVuZChGLCB7XG5cdFx0Ly8gVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiBmYW5jeUJveFxuXHRcdHZlcnNpb246ICcyLjEuNScsXG5cblx0XHRkZWZhdWx0czoge1xuXHRcdFx0cGFkZGluZyA6IDE1LFxuXHRcdFx0bWFyZ2luICA6IDIwLFxuXG5cdFx0XHR3aWR0aCAgICAgOiA4MDAsXG5cdFx0XHRoZWlnaHQgICAgOiA2MDAsXG5cdFx0XHRtaW5XaWR0aCAgOiAxMDAsXG5cdFx0XHRtaW5IZWlnaHQgOiAxMDAsXG5cdFx0XHRtYXhXaWR0aCAgOiA5OTk5LFxuXHRcdFx0bWF4SGVpZ2h0IDogOTk5OSxcblx0XHRcdHBpeGVsUmF0aW86IDEsIC8vIFNldCB0byAyIGZvciByZXRpbmEgZGlzcGxheSBzdXBwb3J0XG5cblx0XHRcdGF1dG9TaXplICAgOiB0cnVlLFxuXHRcdFx0YXV0b0hlaWdodCA6IGZhbHNlLFxuXHRcdFx0YXV0b1dpZHRoICA6IGZhbHNlLFxuXG5cdFx0XHRhdXRvUmVzaXplICA6IHRydWUsXG5cdFx0XHRhdXRvQ2VudGVyICA6ICFpc1RvdWNoLFxuXHRcdFx0Zml0VG9WaWV3ICAgOiB0cnVlLFxuXHRcdFx0YXNwZWN0UmF0aW8gOiBmYWxzZSxcblx0XHRcdHRvcFJhdGlvICAgIDogMC41LFxuXHRcdFx0bGVmdFJhdGlvICAgOiAwLjUsXG5cblx0XHRcdHNjcm9sbGluZyA6ICdhdXRvJywgLy8gJ2F1dG8nLCAneWVzJyBvciAnbm8nXG5cdFx0XHR3cmFwQ1NTICAgOiAnJyxcblxuXHRcdFx0YXJyb3dzICAgICA6IHRydWUsXG5cdFx0XHRjbG9zZUJ0biAgIDogdHJ1ZSxcblx0XHRcdGNsb3NlQ2xpY2sgOiBmYWxzZSxcblx0XHRcdG5leHRDbGljayAgOiBmYWxzZSxcblx0XHRcdG1vdXNlV2hlZWwgOiB0cnVlLFxuXHRcdFx0YXV0b1BsYXkgICA6IGZhbHNlLFxuXHRcdFx0cGxheVNwZWVkICA6IDMwMDAsXG5cdFx0XHRwcmVsb2FkICAgIDogMyxcblx0XHRcdG1vZGFsICAgICAgOiBmYWxzZSxcblx0XHRcdGxvb3AgICAgICAgOiB0cnVlLFxuXG5cdFx0XHRhamF4ICA6IHtcblx0XHRcdFx0ZGF0YVR5cGUgOiAnaHRtbCcsXG5cdFx0XHRcdGhlYWRlcnMgIDogeyAnWC1mYW5jeUJveCc6IHRydWUgfVxuXHRcdFx0fSxcblx0XHRcdGlmcmFtZSA6IHtcblx0XHRcdFx0c2Nyb2xsaW5nIDogJ2F1dG8nLFxuXHRcdFx0XHRwcmVsb2FkICAgOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0c3dmIDoge1xuXHRcdFx0XHR3bW9kZTogJ3RyYW5zcGFyZW50Jyxcblx0XHRcdFx0YWxsb3dmdWxsc2NyZWVuICAgOiAndHJ1ZScsXG5cdFx0XHRcdGFsbG93c2NyaXB0YWNjZXNzIDogJ2Fsd2F5cydcblx0XHRcdH0sXG5cblx0XHRcdGtleXMgIDoge1xuXHRcdFx0XHRuZXh0IDoge1xuXHRcdFx0XHRcdDEzIDogJ2xlZnQnLCAvLyBlbnRlclxuXHRcdFx0XHRcdDM0IDogJ3VwJywgICAvLyBwYWdlIGRvd25cblx0XHRcdFx0XHQzOSA6ICdsZWZ0JywgLy8gcmlnaHQgYXJyb3dcblx0XHRcdFx0XHQ0MCA6ICd1cCcgICAgLy8gZG93biBhcnJvd1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRwcmV2IDoge1xuXHRcdFx0XHRcdDggIDogJ3JpZ2h0JywgIC8vIGJhY2tzcGFjZVxuXHRcdFx0XHRcdDMzIDogJ2Rvd24nLCAgIC8vIHBhZ2UgdXBcblx0XHRcdFx0XHQzNyA6ICdyaWdodCcsICAvLyBsZWZ0IGFycm93XG5cdFx0XHRcdFx0MzggOiAnZG93bicgICAgLy8gdXAgYXJyb3dcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2xvc2UgIDogWzI3XSwgLy8gZXNjYXBlIGtleVxuXHRcdFx0XHRwbGF5ICAgOiBbMzJdLCAvLyBzcGFjZSAtIHN0YXJ0L3N0b3Agc2xpZGVzaG93XG5cdFx0XHRcdHRvZ2dsZSA6IFs3MF0gIC8vIGxldHRlciBcImZcIiAtIHRvZ2dsZSBmdWxsc2NyZWVuXG5cdFx0XHR9LFxuXG5cdFx0XHRkaXJlY3Rpb24gOiB7XG5cdFx0XHRcdG5leHQgOiAnbGVmdCcsXG5cdFx0XHRcdHByZXYgOiAncmlnaHQnXG5cdFx0XHR9LFxuXG5cdFx0XHRzY3JvbGxPdXRzaWRlICA6IHRydWUsXG5cblx0XHRcdC8vIE92ZXJyaWRlIHNvbWUgcHJvcGVydGllc1xuXHRcdFx0aW5kZXggICA6IDAsXG5cdFx0XHR0eXBlICAgIDogbnVsbCxcblx0XHRcdGhyZWYgICAgOiBudWxsLFxuXHRcdFx0Y29udGVudCA6IG51bGwsXG5cdFx0XHR0aXRsZSAgIDogbnVsbCxcblxuXHRcdFx0Ly8gSFRNTCB0ZW1wbGF0ZXNcblx0XHRcdHRwbDoge1xuXHRcdFx0XHR3cmFwICAgICA6ICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtd3JhcFwiIHRhYkluZGV4PVwiLTFcIj48ZGl2IGNsYXNzPVwiZmFuY3lib3gtc2tpblwiPjxkaXYgY2xhc3M9XCJmYW5jeWJveC1vdXRlclwiPjxkaXYgY2xhc3M9XCJmYW5jeWJveC1pbm5lclwiPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PicsXG5cdFx0XHRcdGltYWdlICAgIDogJzxpbWcgY2xhc3M9XCJmYW5jeWJveC1pbWFnZVwiIHNyYz1cIntocmVmfVwiIGFsdD1cIlwiIC8+Jyxcblx0XHRcdFx0aWZyYW1lICAgOiAnPGlmcmFtZSBpZD1cImZhbmN5Ym94LWZyYW1le3JuZH1cIiBuYW1lPVwiZmFuY3lib3gtZnJhbWV7cm5kfVwiIGNsYXNzPVwiZmFuY3lib3gtaWZyYW1lXCIgZnJhbWVib3JkZXI9XCIwXCIgdnNwYWNlPVwiMFwiIGhzcGFjZT1cIjBcIiB3ZWJraXRBbGxvd0Z1bGxTY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93RnVsbFNjcmVlbicgKyAoSUUgPyAnIGFsbG93dHJhbnNwYXJlbmN5PVwidHJ1ZVwiJyA6ICcnKSArICc+PC9pZnJhbWU+Jyxcblx0XHRcdFx0ZXJyb3IgICAgOiAnPHAgY2xhc3M9XCJmYW5jeWJveC1lcnJvclwiPlRoZSByZXF1ZXN0ZWQgY29udGVudCBjYW5ub3QgYmUgbG9hZGVkLjxici8+UGxlYXNlIHRyeSBhZ2FpbiBsYXRlci48L3A+Jyxcblx0XHRcdFx0Y2xvc2VCdG4gOiAnPGEgdGl0bGU9XCJDbG9zZVwiIGNsYXNzPVwiZmFuY3lib3gtaXRlbSBmYW5jeWJveC1jbG9zZVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj48L2E+Jyxcblx0XHRcdFx0bmV4dCAgICAgOiAnPGEgdGl0bGU9XCJOZXh0XCIgY2xhc3M9XCJmYW5jeWJveC1uYXYgZmFuY3lib3gtbmV4dFwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj48c3Bhbj48L3NwYW4+PC9hPicsXG5cdFx0XHRcdHByZXYgICAgIDogJzxhIHRpdGxlPVwiUHJldmlvdXNcIiBjbGFzcz1cImZhbmN5Ym94LW5hdiBmYW5jeWJveC1wcmV2XCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiPjxzcGFuPjwvc3Bhbj48L2E+J1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gUHJvcGVydGllcyBmb3IgZWFjaCBhbmltYXRpb24gdHlwZVxuXHRcdFx0Ly8gT3BlbmluZyBmYW5jeUJveFxuXHRcdFx0b3BlbkVmZmVjdCAgOiAnZmFkZScsIC8vICdlbGFzdGljJywgJ2ZhZGUnIG9yICdub25lJ1xuXHRcdFx0b3BlblNwZWVkICAgOiAyNTAsXG5cdFx0XHRvcGVuRWFzaW5nICA6ICdzd2luZycsXG5cdFx0XHRvcGVuT3BhY2l0eSA6IHRydWUsXG5cdFx0XHRvcGVuTWV0aG9kICA6ICd6b29tSW4nLFxuXG5cdFx0XHQvLyBDbG9zaW5nIGZhbmN5Qm94XG5cdFx0XHRjbG9zZUVmZmVjdCAgOiAnZmFkZScsIC8vICdlbGFzdGljJywgJ2ZhZGUnIG9yICdub25lJ1xuXHRcdFx0Y2xvc2VTcGVlZCAgIDogMjUwLFxuXHRcdFx0Y2xvc2VFYXNpbmcgIDogJ3N3aW5nJyxcblx0XHRcdGNsb3NlT3BhY2l0eSA6IHRydWUsXG5cdFx0XHRjbG9zZU1ldGhvZCAgOiAnem9vbU91dCcsXG5cblx0XHRcdC8vIENoYW5naW5nIG5leHQgZ2FsbGVyeSBpdGVtXG5cdFx0XHRuZXh0RWZmZWN0IDogJ2VsYXN0aWMnLCAvLyAnZWxhc3RpYycsICdmYWRlJyBvciAnbm9uZSdcblx0XHRcdG5leHRTcGVlZCAgOiAyNTAsXG5cdFx0XHRuZXh0RWFzaW5nIDogJ3N3aW5nJyxcblx0XHRcdG5leHRNZXRob2QgOiAnY2hhbmdlSW4nLFxuXG5cdFx0XHQvLyBDaGFuZ2luZyBwcmV2aW91cyBnYWxsZXJ5IGl0ZW1cblx0XHRcdHByZXZFZmZlY3QgOiAnZWxhc3RpYycsIC8vICdlbGFzdGljJywgJ2ZhZGUnIG9yICdub25lJ1xuXHRcdFx0cHJldlNwZWVkICA6IDI1MCxcblx0XHRcdHByZXZFYXNpbmcgOiAnc3dpbmcnLFxuXHRcdFx0cHJldk1ldGhvZCA6ICdjaGFuZ2VPdXQnLFxuXG5cdFx0XHQvLyBFbmFibGUgZGVmYXVsdCBoZWxwZXJzXG5cdFx0XHRoZWxwZXJzIDoge1xuXHRcdFx0XHRvdmVybGF5IDogdHJ1ZSxcblx0XHRcdFx0dGl0bGUgICA6IHRydWVcblx0XHRcdH0sXG5cblx0XHRcdC8vIENhbGxiYWNrc1xuXHRcdFx0b25DYW5jZWwgICAgIDogJC5ub29wLCAvLyBJZiBjYW5jZWxpbmdcblx0XHRcdGJlZm9yZUxvYWQgICA6ICQubm9vcCwgLy8gQmVmb3JlIGxvYWRpbmdcblx0XHRcdGFmdGVyTG9hZCAgICA6ICQubm9vcCwgLy8gQWZ0ZXIgbG9hZGluZ1xuXHRcdFx0YmVmb3JlU2hvdyAgIDogJC5ub29wLCAvLyBCZWZvcmUgY2hhbmdpbmcgaW4gY3VycmVudCBpdGVtXG5cdFx0XHRhZnRlclNob3cgICAgOiAkLm5vb3AsIC8vIEFmdGVyIG9wZW5pbmdcblx0XHRcdGJlZm9yZUNoYW5nZSA6ICQubm9vcCwgLy8gQmVmb3JlIGNoYW5naW5nIGdhbGxlcnkgaXRlbVxuXHRcdFx0YmVmb3JlQ2xvc2UgIDogJC5ub29wLCAvLyBCZWZvcmUgY2xvc2luZ1xuXHRcdFx0YWZ0ZXJDbG9zZSAgIDogJC5ub29wICAvLyBBZnRlciBjbG9zaW5nXG5cdFx0fSxcblxuXHRcdC8vQ3VycmVudCBzdGF0ZVxuXHRcdGdyb3VwICAgIDoge30sIC8vIFNlbGVjdGVkIGdyb3VwXG5cdFx0b3B0cyAgICAgOiB7fSwgLy8gR3JvdXAgb3B0aW9uc1xuXHRcdHByZXZpb3VzIDogbnVsbCwgIC8vIFByZXZpb3VzIGVsZW1lbnRcblx0XHRjb21pbmcgICA6IG51bGwsICAvLyBFbGVtZW50IGJlaW5nIGxvYWRlZFxuXHRcdGN1cnJlbnQgIDogbnVsbCwgIC8vIEN1cnJlbnRseSBsb2FkZWQgZWxlbWVudFxuXHRcdGlzQWN0aXZlIDogZmFsc2UsIC8vIElzIGFjdGl2YXRlZFxuXHRcdGlzT3BlbiAgIDogZmFsc2UsIC8vIElzIGN1cnJlbnRseSBvcGVuXG5cdFx0aXNPcGVuZWQgOiBmYWxzZSwgLy8gSGF2ZSBiZWVuIGZ1bGx5IG9wZW5lZCBhdCBsZWFzdCBvbmNlXG5cblx0XHR3cmFwICA6IG51bGwsXG5cdFx0c2tpbiAgOiBudWxsLFxuXHRcdG91dGVyIDogbnVsbCxcblx0XHRpbm5lciA6IG51bGwsXG5cblx0XHRwbGF5ZXIgOiB7XG5cdFx0XHR0aW1lciAgICA6IG51bGwsXG5cdFx0XHRpc0FjdGl2ZSA6IGZhbHNlXG5cdFx0fSxcblxuXHRcdC8vIExvYWRlcnNcblx0XHRhamF4TG9hZCAgIDogbnVsbCxcblx0XHRpbWdQcmVsb2FkIDogbnVsbCxcblxuXHRcdC8vIFNvbWUgY29sbGVjdGlvbnNcblx0XHR0cmFuc2l0aW9ucyA6IHt9LFxuXHRcdGhlbHBlcnMgICAgIDoge30sXG5cblx0XHQvKlxuXHRcdCAqXHRTdGF0aWMgbWV0aG9kc1xuXHRcdCAqL1xuXG5cdFx0b3BlbjogZnVuY3Rpb24gKGdyb3VwLCBvcHRzKSB7XG5cdFx0XHRpZiAoIWdyb3VwKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCEkLmlzUGxhaW5PYmplY3Qob3B0cykpIHtcblx0XHRcdFx0b3B0cyA9IHt9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDbG9zZSBpZiBhbHJlYWR5IGFjdGl2ZVxuXHRcdFx0aWYgKGZhbHNlID09PSBGLmNsb3NlKHRydWUpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTm9ybWFsaXplIGdyb3VwXG5cdFx0XHRpZiAoISQuaXNBcnJheShncm91cCkpIHtcblx0XHRcdFx0Z3JvdXAgPSBpc1F1ZXJ5KGdyb3VwKSA/ICQoZ3JvdXApLmdldCgpIDogW2dyb3VwXTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVjaGVjayBpZiB0aGUgdHlwZSBvZiBlYWNoIGVsZW1lbnQgaXMgYG9iamVjdGAgYW5kIHNldCBjb250ZW50IHR5cGUgKGltYWdlLCBhamF4LCBldGMpXG5cdFx0XHQkLmVhY2goZ3JvdXAsIGZ1bmN0aW9uKGksIGVsZW1lbnQpIHtcblx0XHRcdFx0dmFyIG9iaiA9IHt9LFxuXHRcdFx0XHRcdGhyZWYsXG5cdFx0XHRcdFx0dGl0bGUsXG5cdFx0XHRcdFx0Y29udGVudCxcblx0XHRcdFx0XHR0eXBlLFxuXHRcdFx0XHRcdHJleixcblx0XHRcdFx0XHRocmVmUGFydHMsXG5cdFx0XHRcdFx0c2VsZWN0b3I7XG5cblx0XHRcdFx0aWYgKCQudHlwZShlbGVtZW50KSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdC8vIENoZWNrIGlmIGlzIERPTSBlbGVtZW50XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQubm9kZVR5cGUpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChpc1F1ZXJ5KGVsZW1lbnQpKSB7XG5cdFx0XHRcdFx0XHRvYmogPSB7XG5cdFx0XHRcdFx0XHRcdGhyZWYgICAgOiBlbGVtZW50LmRhdGEoJ2ZhbmN5Ym94LWhyZWYnKSB8fCBlbGVtZW50LmF0dHIoJ2hyZWYnKSxcblx0XHRcdFx0XHRcdFx0dGl0bGUgICA6IGVsZW1lbnQuZGF0YSgnZmFuY3lib3gtdGl0bGUnKSB8fCBlbGVtZW50LmF0dHIoJ3RpdGxlJyksXG5cdFx0XHRcdFx0XHRcdGlzRG9tICAgOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50IDogZWxlbWVudFxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0aWYgKCQubWV0YWRhdGEpIHtcblx0XHRcdFx0XHRcdFx0JC5leHRlbmQodHJ1ZSwgb2JqLCBlbGVtZW50Lm1ldGFkYXRhKCkpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG9iaiA9IGVsZW1lbnQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aHJlZiAgPSBvcHRzLmhyZWYgIHx8IG9iai5ocmVmIHx8IChpc1N0cmluZyhlbGVtZW50KSA/IGVsZW1lbnQgOiBudWxsKTtcblx0XHRcdFx0dGl0bGUgPSBvcHRzLnRpdGxlICE9PSB1bmRlZmluZWQgPyBvcHRzLnRpdGxlIDogb2JqLnRpdGxlIHx8ICcnO1xuXG5cdFx0XHRcdGNvbnRlbnQgPSBvcHRzLmNvbnRlbnQgfHwgb2JqLmNvbnRlbnQ7XG5cdFx0XHRcdHR5cGUgICAgPSBjb250ZW50ID8gJ2h0bWwnIDogKG9wdHMudHlwZSAgfHwgb2JqLnR5cGUpO1xuXG5cdFx0XHRcdGlmICghdHlwZSAmJiBvYmouaXNEb20pIHtcblx0XHRcdFx0XHR0eXBlID0gZWxlbWVudC5kYXRhKCdmYW5jeWJveC10eXBlJyk7XG5cblx0XHRcdFx0XHRpZiAoIXR5cGUpIHtcblx0XHRcdFx0XHRcdHJleiAgPSBlbGVtZW50LnByb3AoJ2NsYXNzJykubWF0Y2goL2ZhbmN5Ym94XFwuKFxcdyspLyk7XG5cdFx0XHRcdFx0XHR0eXBlID0gcmV6ID8gcmV6WzFdIDogbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaXNTdHJpbmcoaHJlZikpIHtcblx0XHRcdFx0XHQvLyBUcnkgdG8gZ3Vlc3MgdGhlIGNvbnRlbnQgdHlwZVxuXHRcdFx0XHRcdGlmICghdHlwZSkge1xuXHRcdFx0XHRcdFx0aWYgKEYuaXNJbWFnZShocmVmKSkge1xuXHRcdFx0XHRcdFx0XHR0eXBlID0gJ2ltYWdlJztcblxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChGLmlzU1dGKGhyZWYpKSB7XG5cdFx0XHRcdFx0XHRcdHR5cGUgPSAnc3dmJztcblxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChocmVmLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG5cdFx0XHRcdFx0XHRcdHR5cGUgPSAnaW5saW5lJztcblxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChpc1N0cmluZyhlbGVtZW50KSkge1xuXHRcdFx0XHRcdFx0XHR0eXBlICAgID0gJ2h0bWwnO1xuXHRcdFx0XHRcdFx0XHRjb250ZW50ID0gZWxlbWVudDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBTcGxpdCB1cmwgaW50byB0d28gcGllY2VzIHdpdGggc291cmNlIHVybCBhbmQgY29udGVudCBzZWxlY3RvciwgZS5nLFxuXHRcdFx0XHRcdC8vIFwiL215cGFnZS5odG1sICNteV9pZFwiIHdpbGwgbG9hZCBcIi9teXBhZ2UuaHRtbFwiIGFuZCBkaXNwbGF5IGVsZW1lbnQgaGF2aW5nIGlkIFwibXlfaWRcIlxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAnYWpheCcpIHtcblx0XHRcdFx0XHRcdGhyZWZQYXJ0cyA9IGhyZWYuc3BsaXQoL1xccysvLCAyKTtcblx0XHRcdFx0XHRcdGhyZWYgICAgICA9IGhyZWZQYXJ0cy5zaGlmdCgpO1xuXHRcdFx0XHRcdFx0c2VsZWN0b3IgID0gaHJlZlBhcnRzLnNoaWZ0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFjb250ZW50KSB7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICdpbmxpbmUnKSB7XG5cdFx0XHRcdFx0XHRpZiAoaHJlZikge1xuXHRcdFx0XHRcdFx0XHRjb250ZW50ID0gJCggaXNTdHJpbmcoaHJlZikgPyBocmVmLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sICcnKSA6IGhyZWYgKTsgLy9zdHJpcCBmb3IgaWU3XG5cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAob2JqLmlzRG9tKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgPSBlbGVtZW50O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlID09PSAnaHRtbCcpIHtcblx0XHRcdFx0XHRcdGNvbnRlbnQgPSBocmVmO1xuXG5cdFx0XHRcdFx0fSBlbHNlIGlmICghdHlwZSAmJiAhaHJlZiAmJiBvYmouaXNEb20pIHtcblx0XHRcdFx0XHRcdHR5cGUgICAgPSAnaW5saW5lJztcblx0XHRcdFx0XHRcdGNvbnRlbnQgPSBlbGVtZW50O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQuZXh0ZW5kKG9iaiwge1xuXHRcdFx0XHRcdGhyZWYgICAgIDogaHJlZixcblx0XHRcdFx0XHR0eXBlICAgICA6IHR5cGUsXG5cdFx0XHRcdFx0Y29udGVudCAgOiBjb250ZW50LFxuXHRcdFx0XHRcdHRpdGxlICAgIDogdGl0bGUsXG5cdFx0XHRcdFx0c2VsZWN0b3IgOiBzZWxlY3RvclxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRncm91cFsgaSBdID0gb2JqO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEV4dGVuZCB0aGUgZGVmYXVsdHNcblx0XHRcdEYub3B0cyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBGLmRlZmF1bHRzLCBvcHRzKTtcblxuXHRcdFx0Ly8gQWxsIG9wdGlvbnMgYXJlIG1lcmdlZCByZWN1cnNpdmUgZXhjZXB0IGtleXNcblx0XHRcdGlmIChvcHRzLmtleXMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRGLm9wdHMua2V5cyA9IG9wdHMua2V5cyA/ICQuZXh0ZW5kKHt9LCBGLmRlZmF1bHRzLmtleXMsIG9wdHMua2V5cykgOiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Ri5ncm91cCA9IGdyb3VwO1xuXG5cdFx0XHRyZXR1cm4gRi5fc3RhcnQoRi5vcHRzLmluZGV4KTtcblx0XHR9LFxuXG5cdFx0Ly8gQ2FuY2VsIGltYWdlIGxvYWRpbmcgb3IgYWJvcnQgYWpheCByZXF1ZXN0XG5cdFx0Y2FuY2VsOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY29taW5nID0gRi5jb21pbmc7XG5cblx0XHRcdGlmICghY29taW5nIHx8IGZhbHNlID09PSBGLnRyaWdnZXIoJ29uQ2FuY2VsJykpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRGLmhpZGVMb2FkaW5nKCk7XG5cblx0XHRcdGlmIChGLmFqYXhMb2FkKSB7XG5cdFx0XHRcdEYuYWpheExvYWQuYWJvcnQoKTtcblx0XHRcdH1cblxuXHRcdFx0Ri5hamF4TG9hZCA9IG51bGw7XG5cblx0XHRcdGlmIChGLmltZ1ByZWxvYWQpIHtcblx0XHRcdFx0Ri5pbWdQcmVsb2FkLm9ubG9hZCA9IEYuaW1nUHJlbG9hZC5vbmVycm9yID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbWluZy53cmFwKSB7XG5cdFx0XHRcdGNvbWluZy53cmFwLnN0b3AodHJ1ZSwgdHJ1ZSkudHJpZ2dlcignb25SZXNldCcpLnJlbW92ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRGLmNvbWluZyA9IG51bGw7XG5cblx0XHRcdC8vIElmIHRoZSBmaXJzdCBpdGVtIGhhcyBiZWVuIGNhbmNlbGVkLCB0aGVuIGNsZWFyIGV2ZXJ5dGhpbmdcblx0XHRcdGlmICghRi5jdXJyZW50KSB7XG5cdFx0XHRcdEYuX2FmdGVyWm9vbU91dCggY29taW5nICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vIFN0YXJ0IGNsb3NpbmcgYW5pbWF0aW9uIGlmIGlzIG9wZW47IHJlbW92ZSBpbW1lZGlhdGVseSBpZiBvcGVuaW5nL2Nsb3Npbmdcblx0XHRjbG9zZTogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRGLmNhbmNlbCgpO1xuXG5cdFx0XHRpZiAoZmFsc2UgPT09IEYudHJpZ2dlcignYmVmb3JlQ2xvc2UnKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdEYudW5iaW5kRXZlbnRzKCk7XG5cblx0XHRcdGlmICghRi5pc0FjdGl2ZSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICghRi5pc09wZW4gfHwgZXZlbnQgPT09IHRydWUpIHtcblx0XHRcdFx0JCgnLmZhbmN5Ym94LXdyYXAnKS5zdG9wKHRydWUpLnRyaWdnZXIoJ29uUmVzZXQnKS5yZW1vdmUoKTtcblxuXHRcdFx0XHRGLl9hZnRlclpvb21PdXQoKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ri5pc09wZW4gPSBGLmlzT3BlbmVkID0gZmFsc2U7XG5cdFx0XHRcdEYuaXNDbG9zaW5nID0gdHJ1ZTtcblxuXHRcdFx0XHQkKCcuZmFuY3lib3gtaXRlbSwgLmZhbmN5Ym94LW5hdicpLnJlbW92ZSgpO1xuXG5cdFx0XHRcdEYud3JhcC5zdG9wKHRydWUsIHRydWUpLnJlbW92ZUNsYXNzKCdmYW5jeWJveC1vcGVuZWQnKTtcblxuXHRcdFx0XHRGLnRyYW5zaXRpb25zWyBGLmN1cnJlbnQuY2xvc2VNZXRob2QgXSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvLyBNYW5hZ2Ugc2xpZGVzaG93OlxuXHRcdC8vICAgJC5mYW5jeWJveC5wbGF5KCk7IC0gdG9nZ2xlIHNsaWRlc2hvd1xuXHRcdC8vICAgJC5mYW5jeWJveC5wbGF5KCB0cnVlICk7IC0gc3RhcnRcblx0XHQvLyAgICQuZmFuY3lib3gucGxheSggZmFsc2UgKTsgLSBzdG9wXG5cdFx0cGxheTogZnVuY3Rpb24gKCBhY3Rpb24gKSB7XG5cdFx0XHR2YXIgY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KEYucGxheWVyLnRpbWVyKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c2V0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGNsZWFyKCk7XG5cblx0XHRcdFx0XHRpZiAoRi5jdXJyZW50ICYmIEYucGxheWVyLmlzQWN0aXZlKSB7XG5cdFx0XHRcdFx0XHRGLnBsYXllci50aW1lciA9IHNldFRpbWVvdXQoRi5uZXh0LCBGLmN1cnJlbnQucGxheVNwZWVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN0b3AgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Y2xlYXIoKTtcblxuXHRcdFx0XHRcdEQudW5iaW5kKCcucGxheWVyJyk7XG5cblx0XHRcdFx0XHRGLnBsYXllci5pc0FjdGl2ZSA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0Ri50cmlnZ2VyKCdvblBsYXlFbmQnKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0c3RhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKEYuY3VycmVudCAmJiAoRi5jdXJyZW50Lmxvb3AgfHwgRi5jdXJyZW50LmluZGV4IDwgRi5ncm91cC5sZW5ndGggLSAxKSkge1xuXHRcdFx0XHRcdFx0Ri5wbGF5ZXIuaXNBY3RpdmUgPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHRELmJpbmQoe1xuXHRcdFx0XHRcdFx0XHQnb25DYW5jZWwucGxheWVyIGJlZm9yZUNsb3NlLnBsYXllcicgOiBzdG9wLFxuXHRcdFx0XHRcdFx0XHQnb25VcGRhdGUucGxheWVyJyAgIDogc2V0LFxuXHRcdFx0XHRcdFx0XHQnYmVmb3JlTG9hZC5wbGF5ZXInIDogY2xlYXJcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRzZXQoKTtcblxuXHRcdFx0XHRcdFx0Ri50cmlnZ2VyKCdvblBsYXlTdGFydCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0aWYgKGFjdGlvbiA9PT0gdHJ1ZSB8fCAoIUYucGxheWVyLmlzQWN0aXZlICYmIGFjdGlvbiAhPT0gZmFsc2UpKSB7XG5cdFx0XHRcdHN0YXJ0KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzdG9wKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vIE5hdmlnYXRlIHRvIG5leHQgZ2FsbGVyeSBpdGVtXG5cdFx0bmV4dDogZnVuY3Rpb24gKCBkaXJlY3Rpb24gKSB7XG5cdFx0XHR2YXIgY3VycmVudCA9IEYuY3VycmVudDtcblxuXHRcdFx0aWYgKGN1cnJlbnQpIHtcblx0XHRcdFx0aWYgKCFpc1N0cmluZyhkaXJlY3Rpb24pKSB7XG5cdFx0XHRcdFx0ZGlyZWN0aW9uID0gY3VycmVudC5kaXJlY3Rpb24ubmV4dDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdEYuanVtcHRvKGN1cnJlbnQuaW5kZXggKyAxLCBkaXJlY3Rpb24sICduZXh0Jyk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vIE5hdmlnYXRlIHRvIHByZXZpb3VzIGdhbGxlcnkgaXRlbVxuXHRcdHByZXY6IGZ1bmN0aW9uICggZGlyZWN0aW9uICkge1xuXHRcdFx0dmFyIGN1cnJlbnQgPSBGLmN1cnJlbnQ7XG5cblx0XHRcdGlmIChjdXJyZW50KSB7XG5cdFx0XHRcdGlmICghaXNTdHJpbmcoZGlyZWN0aW9uKSkge1xuXHRcdFx0XHRcdGRpcmVjdGlvbiA9IGN1cnJlbnQuZGlyZWN0aW9uLnByZXY7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRGLmp1bXB0byhjdXJyZW50LmluZGV4IC0gMSwgZGlyZWN0aW9uLCAncHJldicpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvLyBOYXZpZ2F0ZSB0byBnYWxsZXJ5IGl0ZW0gYnkgaW5kZXhcblx0XHRqdW1wdG86IGZ1bmN0aW9uICggaW5kZXgsIGRpcmVjdGlvbiwgcm91dGVyICkge1xuXHRcdFx0dmFyIGN1cnJlbnQgPSBGLmN1cnJlbnQ7XG5cblx0XHRcdGlmICghY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGluZGV4ID0gZ2V0U2NhbGFyKGluZGV4KTtcblxuXHRcdFx0Ri5kaXJlY3Rpb24gPSBkaXJlY3Rpb24gfHwgY3VycmVudC5kaXJlY3Rpb25bIChpbmRleCA+PSBjdXJyZW50LmluZGV4ID8gJ25leHQnIDogJ3ByZXYnKSBdO1xuXHRcdFx0Ri5yb3V0ZXIgICAgPSByb3V0ZXIgfHwgJ2p1bXB0byc7XG5cblx0XHRcdGlmIChjdXJyZW50Lmxvb3ApIHtcblx0XHRcdFx0aWYgKGluZGV4IDwgMCkge1xuXHRcdFx0XHRcdGluZGV4ID0gY3VycmVudC5ncm91cC5sZW5ndGggKyAoaW5kZXggJSBjdXJyZW50Lmdyb3VwLmxlbmd0aCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpbmRleCA9IGluZGV4ICUgY3VycmVudC5ncm91cC5sZW5ndGg7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjdXJyZW50Lmdyb3VwWyBpbmRleCBdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ri5jYW5jZWwoKTtcblxuXHRcdFx0XHRGLl9zdGFydChpbmRleCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vIENlbnRlciBpbnNpZGUgdmlld3BvcnQgYW5kIHRvZ2dsZSBwb3NpdGlvbiB0eXBlIHRvIGZpeGVkIG9yIGFic29sdXRlIGlmIG5lZWRlZFxuXHRcdHJlcG9zaXRpb246IGZ1bmN0aW9uIChlLCBvbmx5QWJzb2x1dGUpIHtcblx0XHRcdHZhciBjdXJyZW50ID0gRi5jdXJyZW50LFxuXHRcdFx0XHR3cmFwICAgID0gY3VycmVudCA/IGN1cnJlbnQud3JhcCA6IG51bGwsXG5cdFx0XHRcdHBvcztcblxuXHRcdFx0aWYgKHdyYXApIHtcblx0XHRcdFx0cG9zID0gRi5fZ2V0UG9zaXRpb24ob25seUFic29sdXRlKTtcblxuXHRcdFx0XHRpZiAoZSAmJiBlLnR5cGUgPT09ICdzY3JvbGwnKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHBvcy5wb3NpdGlvbjtcblxuXHRcdFx0XHRcdHdyYXAuc3RvcCh0cnVlLCB0cnVlKS5hbmltYXRlKHBvcywgMjAwKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHdyYXAuY3NzKHBvcyk7XG5cblx0XHRcdFx0XHRjdXJyZW50LnBvcyA9ICQuZXh0ZW5kKHt9LCBjdXJyZW50LmRpbSwgcG9zKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR1cGRhdGU6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR2YXIgdHlwZSA9IChlICYmIGUudHlwZSksXG5cdFx0XHRcdGFueXdheSA9ICF0eXBlIHx8IHR5cGUgPT09ICdvcmllbnRhdGlvbmNoYW5nZSc7XG5cblx0XHRcdGlmIChhbnl3YXkpIHtcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KGRpZFVwZGF0ZSk7XG5cblx0XHRcdFx0ZGlkVXBkYXRlID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFGLmlzT3BlbiB8fCBkaWRVcGRhdGUpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRkaWRVcGRhdGUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgY3VycmVudCA9IEYuY3VycmVudDtcblxuXHRcdFx0XHRpZiAoIWN1cnJlbnQgfHwgRi5pc0Nsb3NpbmcpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRGLndyYXAucmVtb3ZlQ2xhc3MoJ2ZhbmN5Ym94LXRtcCcpO1xuXG5cdFx0XHRcdGlmIChhbnl3YXkgfHwgdHlwZSA9PT0gJ2xvYWQnIHx8ICh0eXBlID09PSAncmVzaXplJyAmJiBjdXJyZW50LmF1dG9SZXNpemUpKSB7XG5cdFx0XHRcdFx0Ri5fc2V0RGltZW5zaW9uKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoISh0eXBlID09PSAnc2Nyb2xsJyAmJiBjdXJyZW50LmNhblNocmluaykpIHtcblx0XHRcdFx0XHRGLnJlcG9zaXRpb24oZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRGLnRyaWdnZXIoJ29uVXBkYXRlJyk7XG5cblx0XHRcdFx0ZGlkVXBkYXRlID0gbnVsbDtcblxuXHRcdFx0fSwgKGFueXdheSAmJiAhaXNUb3VjaCA/IDAgOiAzMDApKTtcblx0XHR9LFxuXG5cdFx0Ly8gU2hyaW5rIGNvbnRlbnQgdG8gZml0IGluc2lkZSB2aWV3cG9ydCBvciByZXN0b3JlIGlmIHJlc2l6ZWRcblx0XHR0b2dnbGU6IGZ1bmN0aW9uICggYWN0aW9uICkge1xuXHRcdFx0aWYgKEYuaXNPcGVuKSB7XG5cdFx0XHRcdEYuY3VycmVudC5maXRUb1ZpZXcgPSAkLnR5cGUoYWN0aW9uKSA9PT0gXCJib29sZWFuXCIgPyBhY3Rpb24gOiAhRi5jdXJyZW50LmZpdFRvVmlldztcblxuXHRcdFx0XHQvLyBIZWxwIGJyb3dzZXIgdG8gcmVzdG9yZSBkb2N1bWVudCBkaW1lbnNpb25zXG5cdFx0XHRcdGlmIChpc1RvdWNoKSB7XG5cdFx0XHRcdFx0Ri53cmFwLnJlbW92ZUF0dHIoJ3N0eWxlJykuYWRkQ2xhc3MoJ2ZhbmN5Ym94LXRtcCcpO1xuXG5cdFx0XHRcdFx0Ri50cmlnZ2VyKCdvblVwZGF0ZScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ri51cGRhdGUoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0aGlkZUxvYWRpbmc6IGZ1bmN0aW9uICgpIHtcblx0XHRcdEQudW5iaW5kKCcubG9hZGluZycpO1xuXG5cdFx0XHQkKCcjZmFuY3lib3gtbG9hZGluZycpLnJlbW92ZSgpO1xuXHRcdH0sXG5cblx0XHRzaG93TG9hZGluZzogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGVsLCB2aWV3cG9ydDtcblxuXHRcdFx0Ri5oaWRlTG9hZGluZygpO1xuXG5cdFx0XHRlbCA9ICQoJzxkaXYgaWQ9XCJmYW5jeWJveC1sb2FkaW5nXCI+PGRpdj48L2Rpdj48L2Rpdj4nKS5jbGljayhGLmNhbmNlbCkuYXBwZW5kVG8oJ2JvZHknKTtcblxuXHRcdFx0Ly8gSWYgdXNlciB3aWxsIHByZXNzIHRoZSBlc2NhcGUtYnV0dG9uLCB0aGUgcmVxdWVzdCB3aWxsIGJlIGNhbmNlbGVkXG5cdFx0XHRELmJpbmQoJ2tleWRvd24ubG9hZGluZycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0aWYgKChlLndoaWNoIHx8IGUua2V5Q29kZSkgPT09IDI3KSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Ri5jYW5jZWwoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGlmICghRi5kZWZhdWx0cy5maXhlZCkge1xuXHRcdFx0XHR2aWV3cG9ydCA9IEYuZ2V0Vmlld3BvcnQoKTtcblxuXHRcdFx0XHRlbC5jc3Moe1xuXHRcdFx0XHRcdHBvc2l0aW9uIDogJ2Fic29sdXRlJyxcblx0XHRcdFx0XHR0b3AgIDogKHZpZXdwb3J0LmggKiAwLjUpICsgdmlld3BvcnQueSxcblx0XHRcdFx0XHRsZWZ0IDogKHZpZXdwb3J0LncgKiAwLjUpICsgdmlld3BvcnQueFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Z2V0Vmlld3BvcnQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBsb2NrZWQgPSAoRi5jdXJyZW50ICYmIEYuY3VycmVudC5sb2NrZWQpIHx8IGZhbHNlLFxuXHRcdFx0XHRyZXogICAgPSB7XG5cdFx0XHRcdFx0eDogVy5zY3JvbGxMZWZ0KCksXG5cdFx0XHRcdFx0eTogVy5zY3JvbGxUb3AoKVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRpZiAobG9ja2VkKSB7XG5cdFx0XHRcdHJlei53ID0gbG9ja2VkWzBdLmNsaWVudFdpZHRoO1xuXHRcdFx0XHRyZXouaCA9IGxvY2tlZFswXS5jbGllbnRIZWlnaHQ7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFNlZSBodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC82NzI0XG5cdFx0XHRcdHJlei53ID0gaXNUb3VjaCAmJiB3aW5kb3cuaW5uZXJXaWR0aCAgPyB3aW5kb3cuaW5uZXJXaWR0aCAgOiBXLndpZHRoKCk7XG5cdFx0XHRcdHJlei5oID0gaXNUb3VjaCAmJiB3aW5kb3cuaW5uZXJIZWlnaHQgPyB3aW5kb3cuaW5uZXJIZWlnaHQgOiBXLmhlaWdodCgpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmV6O1xuXHRcdH0sXG5cblx0XHQvLyBVbmJpbmQgdGhlIGtleWJvYXJkIC8gY2xpY2tpbmcgYWN0aW9uc1xuXHRcdHVuYmluZEV2ZW50czogZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKEYud3JhcCAmJiBpc1F1ZXJ5KEYud3JhcCkpIHtcblx0XHRcdFx0Ri53cmFwLnVuYmluZCgnLmZiJyk7XG5cdFx0XHR9XG5cblx0XHRcdEQudW5iaW5kKCcuZmInKTtcblx0XHRcdFcudW5iaW5kKCcuZmInKTtcblx0XHR9LFxuXG5cdFx0YmluZEV2ZW50czogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGN1cnJlbnQgPSBGLmN1cnJlbnQsXG5cdFx0XHRcdGtleXM7XG5cblx0XHRcdGlmICghY3VycmVudCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIENoYW5naW5nIGRvY3VtZW50IGhlaWdodCBvbiBpT1MgZGV2aWNlcyB0cmlnZ2VycyBhICdyZXNpemUnIGV2ZW50LFxuXHRcdFx0Ly8gdGhhdCBjYW4gY2hhbmdlIGRvY3VtZW50IGhlaWdodC4uLiByZXBlYXRpbmcgaW5maW5pdGVseVxuXHRcdFx0Vy5iaW5kKCdvcmllbnRhdGlvbmNoYW5nZS5mYicgKyAoaXNUb3VjaCA/ICcnIDogJyByZXNpemUuZmInKSArIChjdXJyZW50LmF1dG9DZW50ZXIgJiYgIWN1cnJlbnQubG9ja2VkID8gJyBzY3JvbGwuZmInIDogJycpLCBGLnVwZGF0ZSk7XG5cblx0XHRcdGtleXMgPSBjdXJyZW50LmtleXM7XG5cblx0XHRcdGlmIChrZXlzKSB7XG5cdFx0XHRcdEQuYmluZCgna2V5ZG93bi5mYicsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0dmFyIGNvZGUgICA9IGUud2hpY2ggfHwgZS5rZXlDb2RlLFxuXHRcdFx0XHRcdFx0dGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuXG5cdFx0XHRcdFx0Ly8gU2tpcCBlc2Mga2V5IGlmIGxvYWRpbmcsIGJlY2F1c2Ugc2hvd0xvYWRpbmcgd2lsbCBjYW5jZWwgcHJlbG9hZGluZ1xuXHRcdFx0XHRcdGlmIChjb2RlID09PSAyNyAmJiBGLmNvbWluZykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIElnbm9yZSBrZXkgY29tYmluYXRpb25zIGFuZCBrZXkgZXZlbnRzIHdpdGhpbiBmb3JtIGVsZW1lbnRzXG5cdFx0XHRcdFx0aWYgKCFlLmN0cmxLZXkgJiYgIWUuYWx0S2V5ICYmICFlLnNoaWZ0S2V5ICYmICFlLm1ldGFLZXkgJiYgISh0YXJnZXQgJiYgKHRhcmdldC50eXBlIHx8ICQodGFyZ2V0KS5pcygnW2NvbnRlbnRlZGl0YWJsZV0nKSkpKSB7XG5cdFx0XHRcdFx0XHQkLmVhY2goa2V5cywgZnVuY3Rpb24oaSwgdmFsKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChjdXJyZW50Lmdyb3VwLmxlbmd0aCA+IDEgJiYgdmFsWyBjb2RlIF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRcdEZbIGkgXSggdmFsWyBjb2RlIF0gKTtcblxuXHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoJC5pbkFycmF5KGNvZGUsIHZhbCkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdEZbIGkgXSAoKTtcblxuXHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgkLmZuLm1vdXNld2hlZWwgJiYgY3VycmVudC5tb3VzZVdoZWVsKSB7XG5cdFx0XHRcdEYud3JhcC5iaW5kKCdtb3VzZXdoZWVsLmZiJywgZnVuY3Rpb24gKGUsIGRlbHRhLCBkZWx0YVgsIGRlbHRhWSkge1xuXHRcdFx0XHRcdHZhciB0YXJnZXQgPSBlLnRhcmdldCB8fCBudWxsLFxuXHRcdFx0XHRcdFx0cGFyZW50ID0gJCh0YXJnZXQpLFxuXHRcdFx0XHRcdFx0Y2FuU2Nyb2xsID0gZmFsc2U7XG5cblx0XHRcdFx0XHR3aGlsZSAocGFyZW50Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aWYgKGNhblNjcm9sbCB8fCBwYXJlbnQuaXMoJy5mYW5jeWJveC1za2luJykgfHwgcGFyZW50LmlzKCcuZmFuY3lib3gtd3JhcCcpKSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjYW5TY3JvbGwgPSBpc1Njcm9sbGFibGUoIHBhcmVudFswXSApO1xuXHRcdFx0XHRcdFx0cGFyZW50ICAgID0gJChwYXJlbnQpLnBhcmVudCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChkZWx0YSAhPT0gMCAmJiAhY2FuU2Nyb2xsKSB7XG5cdFx0XHRcdFx0XHRpZiAoRi5ncm91cC5sZW5ndGggPiAxICYmICFjdXJyZW50LmNhblNocmluaykge1xuXHRcdFx0XHRcdFx0XHRpZiAoZGVsdGFZID4gMCB8fCBkZWx0YVggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ri5wcmV2KCBkZWx0YVkgPiAwID8gJ2Rvd24nIDogJ2xlZnQnICk7XG5cblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkZWx0YVkgPCAwIHx8IGRlbHRhWCA8IDApIHtcblx0XHRcdFx0XHRcdFx0XHRGLm5leHQoIGRlbHRhWSA8IDAgPyAndXAnIDogJ3JpZ2h0JyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHRyaWdnZXI6IGZ1bmN0aW9uIChldmVudCwgbykge1xuXHRcdFx0dmFyIHJldCwgb2JqID0gbyB8fCBGLmNvbWluZyB8fCBGLmN1cnJlbnQ7XG5cblx0XHRcdGlmICghb2JqKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCQuaXNGdW5jdGlvbiggb2JqW2V2ZW50XSApKSB7XG5cdFx0XHRcdHJldCA9IG9ialtldmVudF0uYXBwbHkob2JqLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHJldCA9PT0gZmFsc2UpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob2JqLmhlbHBlcnMpIHtcblx0XHRcdFx0JC5lYWNoKG9iai5oZWxwZXJzLCBmdW5jdGlvbiAoaGVscGVyLCBvcHRzKSB7XG5cdFx0XHRcdFx0aWYgKG9wdHMgJiYgRi5oZWxwZXJzW2hlbHBlcl0gJiYgJC5pc0Z1bmN0aW9uKEYuaGVscGVyc1toZWxwZXJdW2V2ZW50XSkpIHtcblx0XHRcdFx0XHRcdEYuaGVscGVyc1toZWxwZXJdW2V2ZW50XSgkLmV4dGVuZCh0cnVlLCB7fSwgRi5oZWxwZXJzW2hlbHBlcl0uZGVmYXVsdHMsIG9wdHMpLCBvYmopO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdEQudHJpZ2dlcihldmVudCk7XG5cdFx0fSxcblxuXHRcdGlzSW1hZ2U6IGZ1bmN0aW9uIChzdHIpIHtcblx0XHRcdHJldHVybiBpc1N0cmluZyhzdHIpICYmIHN0ci5tYXRjaCgvKF5kYXRhOmltYWdlXFwvLiosKXwoXFwuKGpwKGV8Z3xlZyl8Z2lmfHBuZ3xibXB8d2VicHxzdmcpKChcXD98IykuKik/JCkvaSk7XG5cdFx0fSxcblxuXHRcdGlzU1dGOiBmdW5jdGlvbiAoc3RyKSB7XG5cdFx0XHRyZXR1cm4gaXNTdHJpbmcoc3RyKSAmJiBzdHIubWF0Y2goL1xcLihzd2YpKChcXD98IykuKik/JC9pKTtcblx0XHR9LFxuXG5cdFx0X3N0YXJ0OiBmdW5jdGlvbiAoaW5kZXgpIHtcblx0XHRcdHZhciBjb21pbmcgPSB7fSxcblx0XHRcdFx0b2JqLFxuXHRcdFx0XHRocmVmLFxuXHRcdFx0XHR0eXBlLFxuXHRcdFx0XHRtYXJnaW4sXG5cdFx0XHRcdHBhZGRpbmc7XG5cblx0XHRcdGluZGV4ID0gZ2V0U2NhbGFyKCBpbmRleCApO1xuXHRcdFx0b2JqICAgPSBGLmdyb3VwWyBpbmRleCBdIHx8IG51bGw7XG5cblx0XHRcdGlmICghb2JqKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0Y29taW5nID0gJC5leHRlbmQodHJ1ZSwge30sIEYub3B0cywgb2JqKTtcblxuXHRcdFx0Ly8gQ29udmVydCBtYXJnaW4gYW5kIHBhZGRpbmcgcHJvcGVydGllcyB0byBhcnJheSAtIHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdFxuXHRcdFx0bWFyZ2luICA9IGNvbWluZy5tYXJnaW47XG5cdFx0XHRwYWRkaW5nID0gY29taW5nLnBhZGRpbmc7XG5cblx0XHRcdGlmICgkLnR5cGUobWFyZ2luKSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y29taW5nLm1hcmdpbiA9IFttYXJnaW4sIG1hcmdpbiwgbWFyZ2luLCBtYXJnaW5dO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoJC50eXBlKHBhZGRpbmcpID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRjb21pbmcucGFkZGluZyA9IFtwYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nXTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gJ21vZGFsJyBwcm9wZXJ5IGlzIGp1c3QgYSBzaG9ydGN1dFxuXHRcdFx0aWYgKGNvbWluZy5tb2RhbCkge1xuXHRcdFx0XHQkLmV4dGVuZCh0cnVlLCBjb21pbmcsIHtcblx0XHRcdFx0XHRjbG9zZUJ0biAgIDogZmFsc2UsXG5cdFx0XHRcdFx0Y2xvc2VDbGljayA6IGZhbHNlLFxuXHRcdFx0XHRcdG5leHRDbGljayAgOiBmYWxzZSxcblx0XHRcdFx0XHRhcnJvd3MgICAgIDogZmFsc2UsXG5cdFx0XHRcdFx0bW91c2VXaGVlbCA6IGZhbHNlLFxuXHRcdFx0XHRcdGtleXMgICAgICAgOiBudWxsLFxuXHRcdFx0XHRcdGhlbHBlcnM6IHtcblx0XHRcdFx0XHRcdG92ZXJsYXkgOiB7XG5cdFx0XHRcdFx0XHRcdGNsb3NlQ2xpY2sgOiBmYWxzZVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vICdhdXRvU2l6ZScgcHJvcGVydHkgaXMgYSBzaG9ydGN1dCwgdG9vXG5cdFx0XHRpZiAoY29taW5nLmF1dG9TaXplKSB7XG5cdFx0XHRcdGNvbWluZy5hdXRvV2lkdGggPSBjb21pbmcuYXV0b0hlaWdodCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjb21pbmcud2lkdGggPT09ICdhdXRvJykge1xuXHRcdFx0XHRjb21pbmcuYXV0b1dpZHRoID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbWluZy5oZWlnaHQgPT09ICdhdXRvJykge1xuXHRcdFx0XHRjb21pbmcuYXV0b0hlaWdodCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8qXG5cdFx0XHQgKiBBZGQgcmVmZXJlbmNlIHRvIHRoZSBncm91cCwgc28gaXRgcyBwb3NzaWJsZSB0byBhY2Nlc3MgZnJvbSBjYWxsYmFja3MsIGV4YW1wbGU6XG5cdFx0XHQgKiBhZnRlckxvYWQgOiBmdW5jdGlvbigpIHtcblx0XHRcdCAqICAgICB0aGlzLnRpdGxlID0gJ0ltYWdlICcgKyAodGhpcy5pbmRleCArIDEpICsgJyBvZiAnICsgdGhpcy5ncm91cC5sZW5ndGggKyAodGhpcy50aXRsZSA/ICcgLSAnICsgdGhpcy50aXRsZSA6ICcnKTtcblx0XHRcdCAqIH1cblx0XHRcdCAqL1xuXG5cdFx0XHRjb21pbmcuZ3JvdXAgID0gRi5ncm91cDtcblx0XHRcdGNvbWluZy5pbmRleCAgPSBpbmRleDtcblxuXHRcdFx0Ly8gR2l2ZSBhIGNoYW5jZSBmb3IgY2FsbGJhY2sgb3IgaGVscGVycyB0byB1cGRhdGUgY29taW5nIGl0ZW0gKHR5cGUsIHRpdGxlLCBldGMpXG5cdFx0XHRGLmNvbWluZyA9IGNvbWluZztcblxuXHRcdFx0aWYgKGZhbHNlID09PSBGLnRyaWdnZXIoJ2JlZm9yZUxvYWQnKSkge1xuXHRcdFx0XHRGLmNvbWluZyA9IG51bGw7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0eXBlID0gY29taW5nLnR5cGU7XG5cdFx0XHRocmVmID0gY29taW5nLmhyZWY7XG5cblx0XHRcdGlmICghdHlwZSkge1xuXHRcdFx0XHRGLmNvbWluZyA9IG51bGw7XG5cblx0XHRcdFx0Ly9JZiB3ZSBjYW4gbm90IGRldGVybWluZSBjb250ZW50IHR5cGUgdGhlbiBkcm9wIHNpbGVudGx5IG9yIGRpc3BsYXkgbmV4dC9wcmV2IGl0ZW0gaWYgbG9vcGluZyB0aHJvdWdoIGdhbGxlcnlcblx0XHRcdFx0aWYgKEYuY3VycmVudCAmJiBGLnJvdXRlciAmJiBGLnJvdXRlciAhPT0gJ2p1bXB0bycpIHtcblx0XHRcdFx0XHRGLmN1cnJlbnQuaW5kZXggPSBpbmRleDtcblxuXHRcdFx0XHRcdHJldHVybiBGWyBGLnJvdXRlciBdKCBGLmRpcmVjdGlvbiApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRGLmlzQWN0aXZlID0gdHJ1ZTtcblxuXHRcdFx0aWYgKHR5cGUgPT09ICdpbWFnZScgfHwgdHlwZSA9PT0gJ3N3ZicpIHtcblx0XHRcdFx0Y29taW5nLmF1dG9IZWlnaHQgPSBjb21pbmcuYXV0b1dpZHRoID0gZmFsc2U7XG5cdFx0XHRcdGNvbWluZy5zY3JvbGxpbmcgID0gJ3Zpc2libGUnO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZSA9PT0gJ2ltYWdlJykge1xuXHRcdFx0XHRjb21pbmcuYXNwZWN0UmF0aW8gPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZSA9PT0gJ2lmcmFtZScgJiYgaXNUb3VjaCkge1xuXHRcdFx0XHRjb21pbmcuc2Nyb2xsaW5nID0gJ3Njcm9sbCc7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJ1aWxkIHRoZSBuZWNjZXNzYXJ5IG1hcmt1cFxuXHRcdFx0Y29taW5nLndyYXAgPSAkKGNvbWluZy50cGwud3JhcCkuYWRkQ2xhc3MoJ2ZhbmN5Ym94LScgKyAoaXNUb3VjaCA/ICdtb2JpbGUnIDogJ2Rlc2t0b3AnKSArICcgZmFuY3lib3gtdHlwZS0nICsgdHlwZSArICcgZmFuY3lib3gtdG1wICcgKyBjb21pbmcud3JhcENTUykuYXBwZW5kVG8oIGNvbWluZy5wYXJlbnQgfHwgJ2JvZHknICk7XG5cblx0XHRcdCQuZXh0ZW5kKGNvbWluZywge1xuXHRcdFx0XHRza2luICA6ICQoJy5mYW5jeWJveC1za2luJywgIGNvbWluZy53cmFwKSxcblx0XHRcdFx0b3V0ZXIgOiAkKCcuZmFuY3lib3gtb3V0ZXInLCBjb21pbmcud3JhcCksXG5cdFx0XHRcdGlubmVyIDogJCgnLmZhbmN5Ym94LWlubmVyJywgY29taW5nLndyYXApXG5cdFx0XHR9KTtcblxuXHRcdFx0JC5lYWNoKFtcIlRvcFwiLCBcIlJpZ2h0XCIsIFwiQm90dG9tXCIsIFwiTGVmdFwiXSwgZnVuY3Rpb24oaSwgdikge1xuXHRcdFx0XHRjb21pbmcuc2tpbi5jc3MoJ3BhZGRpbmcnICsgdiwgZ2V0VmFsdWUoY29taW5nLnBhZGRpbmdbIGkgXSkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdEYudHJpZ2dlcignb25SZWFkeScpO1xuXG5cdFx0XHQvLyBDaGVjayBiZWZvcmUgdHJ5IHRvIGxvYWQ7ICdpbmxpbmUnIGFuZCAnaHRtbCcgdHlwZXMgbmVlZCBjb250ZW50LCBvdGhlcnMgLSBocmVmXG5cdFx0XHRpZiAodHlwZSA9PT0gJ2lubGluZScgfHwgdHlwZSA9PT0gJ2h0bWwnKSB7XG5cdFx0XHRcdGlmICghY29taW5nLmNvbnRlbnQgfHwgIWNvbWluZy5jb250ZW50Lmxlbmd0aCkge1xuXHRcdFx0XHRcdHJldHVybiBGLl9lcnJvciggJ2NvbnRlbnQnICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIGlmICghaHJlZikge1xuXHRcdFx0XHRyZXR1cm4gRi5fZXJyb3IoICdocmVmJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZSA9PT0gJ2ltYWdlJykge1xuXHRcdFx0XHRGLl9sb2FkSW1hZ2UoKTtcblxuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09PSAnYWpheCcpIHtcblx0XHRcdFx0Ri5fbG9hZEFqYXgoKTtcblxuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09PSAnaWZyYW1lJykge1xuXHRcdFx0XHRGLl9sb2FkSWZyYW1lKCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdEYuX2FmdGVyTG9hZCgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRfZXJyb3I6IGZ1bmN0aW9uICggdHlwZSApIHtcblx0XHRcdCQuZXh0ZW5kKEYuY29taW5nLCB7XG5cdFx0XHRcdHR5cGUgICAgICAgOiAnaHRtbCcsXG5cdFx0XHRcdGF1dG9XaWR0aCAgOiB0cnVlLFxuXHRcdFx0XHRhdXRvSGVpZ2h0IDogdHJ1ZSxcblx0XHRcdFx0bWluV2lkdGggICA6IDAsXG5cdFx0XHRcdG1pbkhlaWdodCAgOiAwLFxuXHRcdFx0XHRzY3JvbGxpbmcgIDogJ25vJyxcblx0XHRcdFx0aGFzRXJyb3IgICA6IHR5cGUsXG5cdFx0XHRcdGNvbnRlbnQgICAgOiBGLmNvbWluZy50cGwuZXJyb3Jcblx0XHRcdH0pO1xuXG5cdFx0XHRGLl9hZnRlckxvYWQoKTtcblx0XHR9LFxuXG5cdFx0X2xvYWRJbWFnZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0Ly8gUmVzZXQgcHJlbG9hZCBpbWFnZSBzbyBpdCBpcyBsYXRlciBwb3NzaWJsZSB0byBjaGVjayBcImNvbXBsZXRlXCIgcHJvcGVydHlcblx0XHRcdHZhciBpbWcgPSBGLmltZ1ByZWxvYWQgPSBuZXcgSW1hZ2UoKTtcblxuXHRcdFx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dGhpcy5vbmxvYWQgPSB0aGlzLm9uZXJyb3IgPSBudWxsO1xuXG5cdFx0XHRcdEYuY29taW5nLndpZHRoICA9IHRoaXMud2lkdGggLyBGLm9wdHMucGl4ZWxSYXRpbztcblx0XHRcdFx0Ri5jb21pbmcuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgLyBGLm9wdHMucGl4ZWxSYXRpbztcblxuXHRcdFx0XHRGLl9hZnRlckxvYWQoKTtcblx0XHRcdH07XG5cblx0XHRcdGltZy5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0aGlzLm9ubG9hZCA9IHRoaXMub25lcnJvciA9IG51bGw7XG5cblx0XHRcdFx0Ri5fZXJyb3IoICdpbWFnZScgKTtcblx0XHRcdH07XG5cblx0XHRcdGltZy5zcmMgPSBGLmNvbWluZy5ocmVmO1xuXG5cdFx0XHRpZiAoaW1nLmNvbXBsZXRlICE9PSB0cnVlKSB7XG5cdFx0XHRcdEYuc2hvd0xvYWRpbmcoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X2xvYWRBamF4OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY29taW5nID0gRi5jb21pbmc7XG5cblx0XHRcdEYuc2hvd0xvYWRpbmcoKTtcblxuXHRcdFx0Ri5hamF4TG9hZCA9ICQuYWpheCgkLmV4dGVuZCh7fSwgY29taW5nLmFqYXgsIHtcblx0XHRcdFx0dXJsOiBjb21pbmcuaHJlZixcblx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cykge1xuXHRcdFx0XHRcdGlmIChGLmNvbWluZyAmJiB0ZXh0U3RhdHVzICE9PSAnYWJvcnQnKSB7XG5cdFx0XHRcdFx0XHRGLl9lcnJvciggJ2FqYXgnLCBqcVhIUiApO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdEYuaGlkZUxvYWRpbmcoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCB0ZXh0U3RhdHVzKSB7XG5cdFx0XHRcdFx0aWYgKHRleHRTdGF0dXMgPT09ICdzdWNjZXNzJykge1xuXHRcdFx0XHRcdFx0Y29taW5nLmNvbnRlbnQgPSBkYXRhO1xuXG5cdFx0XHRcdFx0XHRGLl9hZnRlckxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pKTtcblx0XHR9LFxuXG5cdFx0X2xvYWRJZnJhbWU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNvbWluZyA9IEYuY29taW5nLFxuXHRcdFx0XHRpZnJhbWUgPSAkKGNvbWluZy50cGwuaWZyYW1lLnJlcGxhY2UoL1xce3JuZFxcfS9nLCBuZXcgRGF0ZSgpLmdldFRpbWUoKSkpXG5cdFx0XHRcdFx0LmF0dHIoJ3Njcm9sbGluZycsIGlzVG91Y2ggPyAnYXV0bycgOiBjb21pbmcuaWZyYW1lLnNjcm9sbGluZylcblx0XHRcdFx0XHQuYXR0cignc3JjJywgY29taW5nLmhyZWYpO1xuXG5cdFx0XHQvLyBUaGlzIGhlbHBzIElFXG5cdFx0XHQkKGNvbWluZy53cmFwKS5iaW5kKCdvblJlc2V0JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdCQodGhpcykuZmluZCgnaWZyYW1lJykuaGlkZSgpLmF0dHIoJ3NyYycsICcvL2Fib3V0OmJsYW5rJykuZW5kKCkuZW1wdHkoKTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoY29taW5nLmlmcmFtZS5wcmVsb2FkKSB7XG5cdFx0XHRcdEYuc2hvd0xvYWRpbmcoKTtcblxuXHRcdFx0XHRpZnJhbWUub25lKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKCdyZWFkeScsIDEpO1xuXG5cdFx0XHRcdFx0Ly8gaU9TIHdpbGwgbG9zZSBzY3JvbGxpbmcgaWYgd2UgcmVzaXplXG5cdFx0XHRcdFx0aWYgKCFpc1RvdWNoKSB7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLmJpbmQoJ2xvYWQuZmInLCBGLnVwZGF0ZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gV2l0aG91dCB0aGlzIHRyaWNrOlxuXHRcdFx0XHRcdC8vICAgLSBpZnJhbWUgd29uJ3Qgc2Nyb2xsIG9uIGlPUyBkZXZpY2VzXG5cdFx0XHRcdFx0Ly8gICAtIElFNyBzb21ldGltZXMgZGlzcGxheXMgZW1wdHkgaWZyYW1lXG5cdFx0XHRcdFx0JCh0aGlzKS5wYXJlbnRzKCcuZmFuY3lib3gtd3JhcCcpLndpZHRoKCcxMDAlJykucmVtb3ZlQ2xhc3MoJ2ZhbmN5Ym94LXRtcCcpLnNob3coKTtcblxuXHRcdFx0XHRcdEYuX2FmdGVyTG9hZCgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Y29taW5nLmNvbnRlbnQgPSBpZnJhbWUuYXBwZW5kVG8oIGNvbWluZy5pbm5lciApO1xuXG5cdFx0XHRpZiAoIWNvbWluZy5pZnJhbWUucHJlbG9hZCkge1xuXHRcdFx0XHRGLl9hZnRlckxvYWQoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X3ByZWxvYWRJbWFnZXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGdyb3VwICAgPSBGLmdyb3VwLFxuXHRcdFx0XHRjdXJyZW50ID0gRi5jdXJyZW50LFxuXHRcdFx0XHRsZW4gICAgID0gZ3JvdXAubGVuZ3RoLFxuXHRcdFx0XHRjbnQgICAgID0gY3VycmVudC5wcmVsb2FkID8gTWF0aC5taW4oY3VycmVudC5wcmVsb2FkLCBsZW4gLSAxKSA6IDAsXG5cdFx0XHRcdGl0ZW0sXG5cdFx0XHRcdGk7XG5cblx0XHRcdGZvciAoaSA9IDE7IGkgPD0gY250OyBpICs9IDEpIHtcblx0XHRcdFx0aXRlbSA9IGdyb3VwWyAoY3VycmVudC5pbmRleCArIGkgKSAlIGxlbiBdO1xuXG5cdFx0XHRcdGlmIChpdGVtLnR5cGUgPT09ICdpbWFnZScgJiYgaXRlbS5ocmVmKSB7XG5cdFx0XHRcdFx0bmV3IEltYWdlKCkuc3JjID0gaXRlbS5ocmVmO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdF9hZnRlckxvYWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjb21pbmcgICA9IEYuY29taW5nLFxuXHRcdFx0XHRwcmV2aW91cyA9IEYuY3VycmVudCxcblx0XHRcdFx0cGxhY2Vob2xkZXIgPSAnZmFuY3lib3gtcGxhY2Vob2xkZXInLFxuXHRcdFx0XHRjdXJyZW50LFxuXHRcdFx0XHRjb250ZW50LFxuXHRcdFx0XHR0eXBlLFxuXHRcdFx0XHRzY3JvbGxpbmcsXG5cdFx0XHRcdGhyZWYsXG5cdFx0XHRcdGVtYmVkO1xuXG5cdFx0XHRGLmhpZGVMb2FkaW5nKCk7XG5cblx0XHRcdGlmICghY29taW5nIHx8IEYuaXNBY3RpdmUgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZhbHNlID09PSBGLnRyaWdnZXIoJ2FmdGVyTG9hZCcsIGNvbWluZywgcHJldmlvdXMpKSB7XG5cdFx0XHRcdGNvbWluZy53cmFwLnN0b3AodHJ1ZSkudHJpZ2dlcignb25SZXNldCcpLnJlbW92ZSgpO1xuXG5cdFx0XHRcdEYuY29taW5nID0gbnVsbDtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwcmV2aW91cykge1xuXHRcdFx0XHRGLnRyaWdnZXIoJ2JlZm9yZUNoYW5nZScsIHByZXZpb3VzKTtcblxuXHRcdFx0XHRwcmV2aW91cy53cmFwLnN0b3AodHJ1ZSkucmVtb3ZlQ2xhc3MoJ2ZhbmN5Ym94LW9wZW5lZCcpXG5cdFx0XHRcdFx0LmZpbmQoJy5mYW5jeWJveC1pdGVtLCAuZmFuY3lib3gtbmF2Jylcblx0XHRcdFx0XHQucmVtb3ZlKCk7XG5cdFx0XHR9XG5cblx0XHRcdEYudW5iaW5kRXZlbnRzKCk7XG5cblx0XHRcdGN1cnJlbnQgICA9IGNvbWluZztcblx0XHRcdGNvbnRlbnQgICA9IGNvbWluZy5jb250ZW50O1xuXHRcdFx0dHlwZSAgICAgID0gY29taW5nLnR5cGU7XG5cdFx0XHRzY3JvbGxpbmcgPSBjb21pbmcuc2Nyb2xsaW5nO1xuXG5cdFx0XHQkLmV4dGVuZChGLCB7XG5cdFx0XHRcdHdyYXAgIDogY3VycmVudC53cmFwLFxuXHRcdFx0XHRza2luICA6IGN1cnJlbnQuc2tpbixcblx0XHRcdFx0b3V0ZXIgOiBjdXJyZW50Lm91dGVyLFxuXHRcdFx0XHRpbm5lciA6IGN1cnJlbnQuaW5uZXIsXG5cdFx0XHRcdGN1cnJlbnQgIDogY3VycmVudCxcblx0XHRcdFx0cHJldmlvdXMgOiBwcmV2aW91c1xuXHRcdFx0fSk7XG5cblx0XHRcdGhyZWYgPSBjdXJyZW50LmhyZWY7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlICdpbmxpbmUnOlxuXHRcdFx0XHRjYXNlICdhamF4Jzpcblx0XHRcdFx0Y2FzZSAnaHRtbCc6XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnQuc2VsZWN0b3IpIHtcblx0XHRcdFx0XHRcdGNvbnRlbnQgPSAkKCc8ZGl2PicpLmh0bWwoY29udGVudCkuZmluZChjdXJyZW50LnNlbGVjdG9yKTtcblxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoaXNRdWVyeShjb250ZW50KSkge1xuXHRcdFx0XHRcdFx0aWYgKCFjb250ZW50LmRhdGEocGxhY2Vob2xkZXIpKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQuZGF0YShwbGFjZWhvbGRlciwgJCgnPGRpdiBjbGFzcz1cIicgKyBwbGFjZWhvbGRlciArICdcIj48L2Rpdj4nKS5pbnNlcnRBZnRlciggY29udGVudCApLmhpZGUoKSApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb250ZW50ID0gY29udGVudC5zaG93KCkuZGV0YWNoKCk7XG5cblx0XHRcdFx0XHRcdGN1cnJlbnQud3JhcC5iaW5kKCdvblJlc2V0JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoJCh0aGlzKS5maW5kKGNvbnRlbnQpLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnRlbnQuaGlkZSgpLnJlcGxhY2VBbGwoIGNvbnRlbnQuZGF0YShwbGFjZWhvbGRlcikgKS5kYXRhKHBsYWNlaG9sZGVyLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdFx0XHRcdGNvbnRlbnQgPSBjdXJyZW50LnRwbC5pbWFnZS5yZXBsYWNlKCd7aHJlZn0nLCBocmVmKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAnc3dmJzpcblx0XHRcdFx0XHRjb250ZW50ID0gJzxvYmplY3QgaWQ9XCJmYW5jeWJveC1zd2ZcIiBjbGFzc2lkPVwiY2xzaWQ6RDI3Q0RCNkUtQUU2RC0xMWNmLTk2QjgtNDQ0NTUzNTQwMDAwXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPjxwYXJhbSBuYW1lPVwibW92aWVcIiB2YWx1ZT1cIicgKyBocmVmICsgJ1wiPjwvcGFyYW0+Jztcblx0XHRcdFx0XHRlbWJlZCAgID0gJyc7XG5cblx0XHRcdFx0XHQkLmVhY2goY3VycmVudC5zd2YsIGZ1bmN0aW9uKG5hbWUsIHZhbCkge1xuXHRcdFx0XHRcdFx0Y29udGVudCArPSAnPHBhcmFtIG5hbWU9XCInICsgbmFtZSArICdcIiB2YWx1ZT1cIicgKyB2YWwgKyAnXCI+PC9wYXJhbT4nO1xuXHRcdFx0XHRcdFx0ZW1iZWQgICArPSAnICcgKyBuYW1lICsgJz1cIicgKyB2YWwgKyAnXCInO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Y29udGVudCArPSAnPGVtYmVkIHNyYz1cIicgKyBocmVmICsgJ1wiIHR5cGU9XCJhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIicgKyBlbWJlZCArICc+PC9lbWJlZD48L29iamVjdD4nO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0aWYgKCEoaXNRdWVyeShjb250ZW50KSAmJiBjb250ZW50LnBhcmVudCgpLmlzKGN1cnJlbnQuaW5uZXIpKSkge1xuXHRcdFx0XHRjdXJyZW50LmlubmVyLmFwcGVuZCggY29udGVudCApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBHaXZlIGEgY2hhbmNlIGZvciBoZWxwZXJzIG9yIGNhbGxiYWNrcyB0byB1cGRhdGUgZWxlbWVudHNcblx0XHRcdEYudHJpZ2dlcignYmVmb3JlU2hvdycpO1xuXG5cdFx0XHQvLyBTZXQgc2Nyb2xsaW5nIGJlZm9yZSBjYWxjdWxhdGluZyBkaW1lbnNpb25zXG5cdFx0XHRjdXJyZW50LmlubmVyLmNzcygnb3ZlcmZsb3cnLCBzY3JvbGxpbmcgPT09ICd5ZXMnID8gJ3Njcm9sbCcgOiAoc2Nyb2xsaW5nID09PSAnbm8nID8gJ2hpZGRlbicgOiBzY3JvbGxpbmcpKTtcblxuXHRcdFx0Ly8gU2V0IGluaXRpYWwgZGltZW5zaW9ucyBhbmQgc3RhcnQgcG9zaXRpb25cblx0XHRcdEYuX3NldERpbWVuc2lvbigpO1xuXG5cdFx0XHRGLnJlcG9zaXRpb24oKTtcblxuXHRcdFx0Ri5pc09wZW4gPSBmYWxzZTtcblx0XHRcdEYuY29taW5nID0gbnVsbDtcblxuXHRcdFx0Ri5iaW5kRXZlbnRzKCk7XG5cblx0XHRcdGlmICghRi5pc09wZW5lZCkge1xuXHRcdFx0XHQkKCcuZmFuY3lib3gtd3JhcCcpLm5vdCggY3VycmVudC53cmFwICkuc3RvcCh0cnVlKS50cmlnZ2VyKCdvblJlc2V0JykucmVtb3ZlKCk7XG5cblx0XHRcdH0gZWxzZSBpZiAocHJldmlvdXMucHJldk1ldGhvZCkge1xuXHRcdFx0XHRGLnRyYW5zaXRpb25zWyBwcmV2aW91cy5wcmV2TWV0aG9kIF0oKTtcblx0XHRcdH1cblxuXHRcdFx0Ri50cmFuc2l0aW9uc1sgRi5pc09wZW5lZCA/IGN1cnJlbnQubmV4dE1ldGhvZCA6IGN1cnJlbnQub3Blbk1ldGhvZCBdKCk7XG5cblx0XHRcdEYuX3ByZWxvYWRJbWFnZXMoKTtcblx0XHR9LFxuXG5cdFx0X3NldERpbWVuc2lvbjogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHZpZXdwb3J0ICAgPSBGLmdldFZpZXdwb3J0KCksXG5cdFx0XHRcdHN0ZXBzICAgICAgPSAwLFxuXHRcdFx0XHRjYW5TaHJpbmsgID0gZmFsc2UsXG5cdFx0XHRcdGNhbkV4cGFuZCAgPSBmYWxzZSxcblx0XHRcdFx0d3JhcCAgICAgICA9IEYud3JhcCxcblx0XHRcdFx0c2tpbiAgICAgICA9IEYuc2tpbixcblx0XHRcdFx0aW5uZXIgICAgICA9IEYuaW5uZXIsXG5cdFx0XHRcdGN1cnJlbnQgICAgPSBGLmN1cnJlbnQsXG5cdFx0XHRcdHdpZHRoICAgICAgPSBjdXJyZW50LndpZHRoLFxuXHRcdFx0XHRoZWlnaHQgICAgID0gY3VycmVudC5oZWlnaHQsXG5cdFx0XHRcdG1pbldpZHRoICAgPSBjdXJyZW50Lm1pbldpZHRoLFxuXHRcdFx0XHRtaW5IZWlnaHQgID0gY3VycmVudC5taW5IZWlnaHQsXG5cdFx0XHRcdG1heFdpZHRoICAgPSBjdXJyZW50Lm1heFdpZHRoLFxuXHRcdFx0XHRtYXhIZWlnaHQgID0gY3VycmVudC5tYXhIZWlnaHQsXG5cdFx0XHRcdHNjcm9sbGluZyAgPSBjdXJyZW50LnNjcm9sbGluZyxcblx0XHRcdFx0c2Nyb2xsT3V0ICA9IGN1cnJlbnQuc2Nyb2xsT3V0c2lkZSA/IGN1cnJlbnQuc2Nyb2xsYmFyV2lkdGggOiAwLFxuXHRcdFx0XHRtYXJnaW4gICAgID0gY3VycmVudC5tYXJnaW4sXG5cdFx0XHRcdHdNYXJnaW4gICAgPSBnZXRTY2FsYXIobWFyZ2luWzFdICsgbWFyZ2luWzNdKSxcblx0XHRcdFx0aE1hcmdpbiAgICA9IGdldFNjYWxhcihtYXJnaW5bMF0gKyBtYXJnaW5bMl0pLFxuXHRcdFx0XHR3UGFkZGluZyxcblx0XHRcdFx0aFBhZGRpbmcsXG5cdFx0XHRcdHdTcGFjZSxcblx0XHRcdFx0aFNwYWNlLFxuXHRcdFx0XHRvcmlnV2lkdGgsXG5cdFx0XHRcdG9yaWdIZWlnaHQsXG5cdFx0XHRcdG9yaWdNYXhXaWR0aCxcblx0XHRcdFx0b3JpZ01heEhlaWdodCxcblx0XHRcdFx0cmF0aW8sXG5cdFx0XHRcdHdpZHRoXyxcblx0XHRcdFx0aGVpZ2h0Xyxcblx0XHRcdFx0bWF4V2lkdGhfLFxuXHRcdFx0XHRtYXhIZWlnaHRfLFxuXHRcdFx0XHRpZnJhbWUsXG5cdFx0XHRcdGJvZHk7XG5cblx0XHRcdC8vIFJlc2V0IGRpbWVuc2lvbnMgc28gd2UgY291bGQgcmUtY2hlY2sgYWN0dWFsIHNpemVcblx0XHRcdHdyYXAuYWRkKHNraW4pLmFkZChpbm5lcikud2lkdGgoJ2F1dG8nKS5oZWlnaHQoJ2F1dG8nKS5yZW1vdmVDbGFzcygnZmFuY3lib3gtdG1wJyk7XG5cblx0XHRcdHdQYWRkaW5nID0gZ2V0U2NhbGFyKHNraW4ub3V0ZXJXaWR0aCh0cnVlKSAgLSBza2luLndpZHRoKCkpO1xuXHRcdFx0aFBhZGRpbmcgPSBnZXRTY2FsYXIoc2tpbi5vdXRlckhlaWdodCh0cnVlKSAtIHNraW4uaGVpZ2h0KCkpO1xuXG5cdFx0XHQvLyBBbnkgc3BhY2UgYmV0d2VlbiBjb250ZW50IGFuZCB2aWV3cG9ydCAobWFyZ2luLCBwYWRkaW5nLCBib3JkZXIsIHRpdGxlKVxuXHRcdFx0d1NwYWNlID0gd01hcmdpbiArIHdQYWRkaW5nO1xuXHRcdFx0aFNwYWNlID0gaE1hcmdpbiArIGhQYWRkaW5nO1xuXG5cdFx0XHRvcmlnV2lkdGggID0gaXNQZXJjZW50YWdlKHdpZHRoKSAgPyAodmlld3BvcnQudyAtIHdTcGFjZSkgKiBnZXRTY2FsYXIod2lkdGgpICAvIDEwMCA6IHdpZHRoO1xuXHRcdFx0b3JpZ0hlaWdodCA9IGlzUGVyY2VudGFnZShoZWlnaHQpID8gKHZpZXdwb3J0LmggLSBoU3BhY2UpICogZ2V0U2NhbGFyKGhlaWdodCkgLyAxMDAgOiBoZWlnaHQ7XG5cblx0XHRcdGlmIChjdXJyZW50LnR5cGUgPT09ICdpZnJhbWUnKSB7XG5cdFx0XHRcdGlmcmFtZSA9IGN1cnJlbnQuY29udGVudDtcblxuXHRcdFx0XHRpZiAoY3VycmVudC5hdXRvSGVpZ2h0ICYmIGlmcmFtZS5kYXRhKCdyZWFkeScpID09PSAxKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGlmIChpZnJhbWVbMF0uY29udGVudFdpbmRvdy5kb2N1bWVudC5sb2NhdGlvbikge1xuXHRcdFx0XHRcdFx0XHRpbm5lci53aWR0aCggb3JpZ1dpZHRoICkuaGVpZ2h0KDk5OTkpO1xuXG5cdFx0XHRcdFx0XHRcdGJvZHkgPSBpZnJhbWUuY29udGVudHMoKS5maW5kKCdib2R5Jyk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKHNjcm9sbE91dCkge1xuXHRcdFx0XHRcdFx0XHRcdGJvZHkuY3NzKCdvdmVyZmxvdy14JywgJ2hpZGRlbicpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0b3JpZ0hlaWdodCA9IGJvZHkub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudC5hdXRvV2lkdGggfHwgY3VycmVudC5hdXRvSGVpZ2h0KSB7XG5cdFx0XHRcdGlubmVyLmFkZENsYXNzKCAnZmFuY3lib3gtdG1wJyApO1xuXG5cdFx0XHRcdC8vIFNldCB3aWR0aCBvciBoZWlnaHQgaW4gY2FzZSB3ZSBuZWVkIHRvIGNhbGN1bGF0ZSBvbmx5IG9uZSBkaW1lbnNpb25cblx0XHRcdFx0aWYgKCFjdXJyZW50LmF1dG9XaWR0aCkge1xuXHRcdFx0XHRcdGlubmVyLndpZHRoKCBvcmlnV2lkdGggKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghY3VycmVudC5hdXRvSGVpZ2h0KSB7XG5cdFx0XHRcdFx0aW5uZXIuaGVpZ2h0KCBvcmlnSGVpZ2h0ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY3VycmVudC5hdXRvV2lkdGgpIHtcblx0XHRcdFx0XHRvcmlnV2lkdGggPSBpbm5lci53aWR0aCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGN1cnJlbnQuYXV0b0hlaWdodCkge1xuXHRcdFx0XHRcdG9yaWdIZWlnaHQgPSBpbm5lci5oZWlnaHQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlubmVyLnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtdG1wJyApO1xuXHRcdFx0fVxuXG5cdFx0XHR3aWR0aCAgPSBnZXRTY2FsYXIoIG9yaWdXaWR0aCApO1xuXHRcdFx0aGVpZ2h0ID0gZ2V0U2NhbGFyKCBvcmlnSGVpZ2h0ICk7XG5cblx0XHRcdHJhdGlvICA9IG9yaWdXaWR0aCAvIG9yaWdIZWlnaHQ7XG5cblx0XHRcdC8vIENhbGN1bGF0aW9ucyBmb3IgdGhlIGNvbnRlbnRcblx0XHRcdG1pbldpZHRoICA9IGdldFNjYWxhcihpc1BlcmNlbnRhZ2UobWluV2lkdGgpID8gZ2V0U2NhbGFyKG1pbldpZHRoLCAndycpIC0gd1NwYWNlIDogbWluV2lkdGgpO1xuXHRcdFx0bWF4V2lkdGggID0gZ2V0U2NhbGFyKGlzUGVyY2VudGFnZShtYXhXaWR0aCkgPyBnZXRTY2FsYXIobWF4V2lkdGgsICd3JykgLSB3U3BhY2UgOiBtYXhXaWR0aCk7XG5cblx0XHRcdG1pbkhlaWdodCA9IGdldFNjYWxhcihpc1BlcmNlbnRhZ2UobWluSGVpZ2h0KSA/IGdldFNjYWxhcihtaW5IZWlnaHQsICdoJykgLSBoU3BhY2UgOiBtaW5IZWlnaHQpO1xuXHRcdFx0bWF4SGVpZ2h0ID0gZ2V0U2NhbGFyKGlzUGVyY2VudGFnZShtYXhIZWlnaHQpID8gZ2V0U2NhbGFyKG1heEhlaWdodCwgJ2gnKSAtIGhTcGFjZSA6IG1heEhlaWdodCk7XG5cblx0XHRcdC8vIFRoZXNlIHdpbGwgYmUgdXNlZCB0byBkZXRlcm1pbmUgaWYgd3JhcCBjYW4gZml0IGluIHRoZSB2aWV3cG9ydFxuXHRcdFx0b3JpZ01heFdpZHRoICA9IG1heFdpZHRoO1xuXHRcdFx0b3JpZ01heEhlaWdodCA9IG1heEhlaWdodDtcblxuXHRcdFx0aWYgKGN1cnJlbnQuZml0VG9WaWV3KSB7XG5cdFx0XHRcdG1heFdpZHRoICA9IE1hdGgubWluKHZpZXdwb3J0LncgLSB3U3BhY2UsIG1heFdpZHRoKTtcblx0XHRcdFx0bWF4SGVpZ2h0ID0gTWF0aC5taW4odmlld3BvcnQuaCAtIGhTcGFjZSwgbWF4SGVpZ2h0KTtcblx0XHRcdH1cblxuXHRcdFx0bWF4V2lkdGhfICA9IHZpZXdwb3J0LncgLSB3TWFyZ2luO1xuXHRcdFx0bWF4SGVpZ2h0XyA9IHZpZXdwb3J0LmggLSBoTWFyZ2luO1xuXG5cdFx0XHRpZiAoY3VycmVudC5hc3BlY3RSYXRpbykge1xuXHRcdFx0XHRpZiAod2lkdGggPiBtYXhXaWR0aCkge1xuXHRcdFx0XHRcdHdpZHRoICA9IG1heFdpZHRoO1xuXHRcdFx0XHRcdGhlaWdodCA9IGdldFNjYWxhcih3aWR0aCAvIHJhdGlvKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChoZWlnaHQgPiBtYXhIZWlnaHQpIHtcblx0XHRcdFx0XHRoZWlnaHQgPSBtYXhIZWlnaHQ7XG5cdFx0XHRcdFx0d2lkdGggID0gZ2V0U2NhbGFyKGhlaWdodCAqIHJhdGlvKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh3aWR0aCA8IG1pbldpZHRoKSB7XG5cdFx0XHRcdFx0d2lkdGggID0gbWluV2lkdGg7XG5cdFx0XHRcdFx0aGVpZ2h0ID0gZ2V0U2NhbGFyKHdpZHRoIC8gcmF0aW8pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGhlaWdodCA8IG1pbkhlaWdodCkge1xuXHRcdFx0XHRcdGhlaWdodCA9IG1pbkhlaWdodDtcblx0XHRcdFx0XHR3aWR0aCAgPSBnZXRTY2FsYXIoaGVpZ2h0ICogcmF0aW8pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdpZHRoID0gTWF0aC5tYXgobWluV2lkdGgsIE1hdGgubWluKHdpZHRoLCBtYXhXaWR0aCkpO1xuXG5cdFx0XHRcdGlmIChjdXJyZW50LmF1dG9IZWlnaHQgJiYgY3VycmVudC50eXBlICE9PSAnaWZyYW1lJykge1xuXHRcdFx0XHRcdGlubmVyLndpZHRoKCB3aWR0aCApO1xuXG5cdFx0XHRcdFx0aGVpZ2h0ID0gaW5uZXIuaGVpZ2h0KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRoZWlnaHQgPSBNYXRoLm1heChtaW5IZWlnaHQsIE1hdGgubWluKGhlaWdodCwgbWF4SGVpZ2h0KSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRyeSB0byBmaXQgaW5zaWRlIHZpZXdwb3J0IChpbmNsdWRpbmcgdGhlIHRpdGxlKVxuXHRcdFx0aWYgKGN1cnJlbnQuZml0VG9WaWV3KSB7XG5cdFx0XHRcdGlubmVyLndpZHRoKCB3aWR0aCApLmhlaWdodCggaGVpZ2h0ICk7XG5cblx0XHRcdFx0d3JhcC53aWR0aCggd2lkdGggKyB3UGFkZGluZyApO1xuXG5cdFx0XHRcdC8vIFJlYWwgd3JhcCBkaW1lbnNpb25zXG5cdFx0XHRcdHdpZHRoXyAgPSB3cmFwLndpZHRoKCk7XG5cdFx0XHRcdGhlaWdodF8gPSB3cmFwLmhlaWdodCgpO1xuXG5cdFx0XHRcdGlmIChjdXJyZW50LmFzcGVjdFJhdGlvKSB7XG5cdFx0XHRcdFx0d2hpbGUgKCh3aWR0aF8gPiBtYXhXaWR0aF8gfHwgaGVpZ2h0XyA+IG1heEhlaWdodF8pICYmIHdpZHRoID4gbWluV2lkdGggJiYgaGVpZ2h0ID4gbWluSGVpZ2h0KSB7XG5cdFx0XHRcdFx0XHRpZiAoc3RlcHMrKyA+IDE5KSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRoZWlnaHQgPSBNYXRoLm1heChtaW5IZWlnaHQsIE1hdGgubWluKG1heEhlaWdodCwgaGVpZ2h0IC0gMTApKTtcblx0XHRcdFx0XHRcdHdpZHRoICA9IGdldFNjYWxhcihoZWlnaHQgKiByYXRpbyk7XG5cblx0XHRcdFx0XHRcdGlmICh3aWR0aCA8IG1pbldpZHRoKSB7XG5cdFx0XHRcdFx0XHRcdHdpZHRoICA9IG1pbldpZHRoO1xuXHRcdFx0XHRcdFx0XHRoZWlnaHQgPSBnZXRTY2FsYXIod2lkdGggLyByYXRpbyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICh3aWR0aCA+IG1heFdpZHRoKSB7XG5cdFx0XHRcdFx0XHRcdHdpZHRoICA9IG1heFdpZHRoO1xuXHRcdFx0XHRcdFx0XHRoZWlnaHQgPSBnZXRTY2FsYXIod2lkdGggLyByYXRpbyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlubmVyLndpZHRoKCB3aWR0aCApLmhlaWdodCggaGVpZ2h0ICk7XG5cblx0XHRcdFx0XHRcdHdyYXAud2lkdGgoIHdpZHRoICsgd1BhZGRpbmcgKTtcblxuXHRcdFx0XHRcdFx0d2lkdGhfICA9IHdyYXAud2lkdGgoKTtcblx0XHRcdFx0XHRcdGhlaWdodF8gPSB3cmFwLmhlaWdodCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHdpZHRoICA9IE1hdGgubWF4KG1pbldpZHRoLCAgTWF0aC5taW4od2lkdGgsICB3aWR0aCAgLSAod2lkdGhfICAtIG1heFdpZHRoXykpKTtcblx0XHRcdFx0XHRoZWlnaHQgPSBNYXRoLm1heChtaW5IZWlnaHQsIE1hdGgubWluKGhlaWdodCwgaGVpZ2h0IC0gKGhlaWdodF8gLSBtYXhIZWlnaHRfKSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzY3JvbGxPdXQgJiYgc2Nyb2xsaW5nID09PSAnYXV0bycgJiYgaGVpZ2h0IDwgb3JpZ0hlaWdodCAmJiAod2lkdGggKyB3UGFkZGluZyArIHNjcm9sbE91dCkgPCBtYXhXaWR0aF8pIHtcblx0XHRcdFx0d2lkdGggKz0gc2Nyb2xsT3V0O1xuXHRcdFx0fVxuXG5cdFx0XHRpbm5lci53aWR0aCggd2lkdGggKS5oZWlnaHQoIGhlaWdodCApO1xuXG5cdFx0XHR3cmFwLndpZHRoKCB3aWR0aCArIHdQYWRkaW5nICk7XG5cblx0XHRcdHdpZHRoXyAgPSB3cmFwLndpZHRoKCk7XG5cdFx0XHRoZWlnaHRfID0gd3JhcC5oZWlnaHQoKTtcblxuXHRcdFx0Y2FuU2hyaW5rID0gKHdpZHRoXyA+IG1heFdpZHRoXyB8fCBoZWlnaHRfID4gbWF4SGVpZ2h0XykgJiYgd2lkdGggPiBtaW5XaWR0aCAmJiBoZWlnaHQgPiBtaW5IZWlnaHQ7XG5cdFx0XHRjYW5FeHBhbmQgPSBjdXJyZW50LmFzcGVjdFJhdGlvID8gKHdpZHRoIDwgb3JpZ01heFdpZHRoICYmIGhlaWdodCA8IG9yaWdNYXhIZWlnaHQgJiYgd2lkdGggPCBvcmlnV2lkdGggJiYgaGVpZ2h0IDwgb3JpZ0hlaWdodCkgOiAoKHdpZHRoIDwgb3JpZ01heFdpZHRoIHx8IGhlaWdodCA8IG9yaWdNYXhIZWlnaHQpICYmICh3aWR0aCA8IG9yaWdXaWR0aCB8fCBoZWlnaHQgPCBvcmlnSGVpZ2h0KSk7XG5cblx0XHRcdCQuZXh0ZW5kKGN1cnJlbnQsIHtcblx0XHRcdFx0ZGltIDoge1xuXHRcdFx0XHRcdHdpZHRoXHQ6IGdldFZhbHVlKCB3aWR0aF8gKSxcblx0XHRcdFx0XHRoZWlnaHRcdDogZ2V0VmFsdWUoIGhlaWdodF8gKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvcmlnV2lkdGggIDogb3JpZ1dpZHRoLFxuXHRcdFx0XHRvcmlnSGVpZ2h0IDogb3JpZ0hlaWdodCxcblx0XHRcdFx0Y2FuU2hyaW5rICA6IGNhblNocmluayxcblx0XHRcdFx0Y2FuRXhwYW5kICA6IGNhbkV4cGFuZCxcblx0XHRcdFx0d1BhZGRpbmcgICA6IHdQYWRkaW5nLFxuXHRcdFx0XHRoUGFkZGluZyAgIDogaFBhZGRpbmcsXG5cdFx0XHRcdHdyYXBTcGFjZSAgOiBoZWlnaHRfIC0gc2tpbi5vdXRlckhlaWdodCh0cnVlKSxcblx0XHRcdFx0c2tpblNwYWNlICA6IHNraW4uaGVpZ2h0KCkgLSBoZWlnaHRcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoIWlmcmFtZSAmJiBjdXJyZW50LmF1dG9IZWlnaHQgJiYgaGVpZ2h0ID4gbWluSGVpZ2h0ICYmIGhlaWdodCA8IG1heEhlaWdodCAmJiAhY2FuRXhwYW5kKSB7XG5cdFx0XHRcdGlubmVyLmhlaWdodCgnYXV0bycpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRfZ2V0UG9zaXRpb246IGZ1bmN0aW9uIChvbmx5QWJzb2x1dGUpIHtcblx0XHRcdHZhciBjdXJyZW50ICA9IEYuY3VycmVudCxcblx0XHRcdFx0dmlld3BvcnQgPSBGLmdldFZpZXdwb3J0KCksXG5cdFx0XHRcdG1hcmdpbiAgID0gY3VycmVudC5tYXJnaW4sXG5cdFx0XHRcdHdpZHRoICAgID0gRi53cmFwLndpZHRoKCkgICsgbWFyZ2luWzFdICsgbWFyZ2luWzNdLFxuXHRcdFx0XHRoZWlnaHQgICA9IEYud3JhcC5oZWlnaHQoKSArIG1hcmdpblswXSArIG1hcmdpblsyXSxcblx0XHRcdFx0cmV6ICAgICAgPSB7XG5cdFx0XHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHRcdFx0dG9wICA6IG1hcmdpblswXSxcblx0XHRcdFx0XHRsZWZ0IDogbWFyZ2luWzNdXG5cdFx0XHRcdH07XG5cblx0XHRcdGlmIChjdXJyZW50LmF1dG9DZW50ZXIgJiYgY3VycmVudC5maXhlZCAmJiAhb25seUFic29sdXRlICYmIGhlaWdodCA8PSB2aWV3cG9ydC5oICYmIHdpZHRoIDw9IHZpZXdwb3J0LncpIHtcblx0XHRcdFx0cmV6LnBvc2l0aW9uID0gJ2ZpeGVkJztcblxuXHRcdFx0fSBlbHNlIGlmICghY3VycmVudC5sb2NrZWQpIHtcblx0XHRcdFx0cmV6LnRvcCAgKz0gdmlld3BvcnQueTtcblx0XHRcdFx0cmV6LmxlZnQgKz0gdmlld3BvcnQueDtcblx0XHRcdH1cblxuXHRcdFx0cmV6LnRvcCAgPSBnZXRWYWx1ZShNYXRoLm1heChyZXoudG9wLCAgcmV6LnRvcCAgKyAoKHZpZXdwb3J0LmggLSBoZWlnaHQpICogY3VycmVudC50b3BSYXRpbykpKTtcblx0XHRcdHJlei5sZWZ0ID0gZ2V0VmFsdWUoTWF0aC5tYXgocmV6LmxlZnQsIHJlei5sZWZ0ICsgKCh2aWV3cG9ydC53IC0gd2lkdGgpICAqIGN1cnJlbnQubGVmdFJhdGlvKSkpO1xuXG5cdFx0XHRyZXR1cm4gcmV6O1xuXHRcdH0sXG5cblx0XHRfYWZ0ZXJab29tSW46IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjdXJyZW50ID0gRi5jdXJyZW50O1xuXG5cdFx0XHRpZiAoIWN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRGLmlzT3BlbiA9IEYuaXNPcGVuZWQgPSB0cnVlO1xuXG5cdFx0XHRGLndyYXAuY3NzKCdvdmVyZmxvdycsICd2aXNpYmxlJykuYWRkQ2xhc3MoJ2ZhbmN5Ym94LW9wZW5lZCcpO1xuXG5cdFx0XHRGLnVwZGF0ZSgpO1xuXG5cdFx0XHQvLyBBc3NpZ24gYSBjbGljayBldmVudFxuXHRcdFx0aWYgKCBjdXJyZW50LmNsb3NlQ2xpY2sgfHwgKGN1cnJlbnQubmV4dENsaWNrICYmIEYuZ3JvdXAubGVuZ3RoID4gMSkgKSB7XG5cdFx0XHRcdEYuaW5uZXIuY3NzKCdjdXJzb3InLCAncG9pbnRlcicpLmJpbmQoJ2NsaWNrLmZiJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGlmICghJChlLnRhcmdldCkuaXMoJ2EnKSAmJiAhJChlLnRhcmdldCkucGFyZW50KCkuaXMoJ2EnKSkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHRGWyBjdXJyZW50LmNsb3NlQ2xpY2sgPyAnY2xvc2UnIDogJ25leHQnIF0oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDcmVhdGUgYSBjbG9zZSBidXR0b25cblx0XHRcdGlmIChjdXJyZW50LmNsb3NlQnRuKSB7XG5cdFx0XHRcdCQoY3VycmVudC50cGwuY2xvc2VCdG4pLmFwcGVuZFRvKEYuc2tpbikuYmluZCgnY2xpY2suZmInLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Ri5jbG9zZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ3JlYXRlIG5hdmlnYXRpb24gYXJyb3dzXG5cdFx0XHRpZiAoY3VycmVudC5hcnJvd3MgJiYgRi5ncm91cC5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGlmIChjdXJyZW50Lmxvb3AgfHwgY3VycmVudC5pbmRleCA+IDApIHtcblx0XHRcdFx0XHQkKGN1cnJlbnQudHBsLnByZXYpLmFwcGVuZFRvKEYub3V0ZXIpLmJpbmQoJ2NsaWNrLmZiJywgRi5wcmV2KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjdXJyZW50Lmxvb3AgfHwgY3VycmVudC5pbmRleCA8IEYuZ3JvdXAubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdCQoY3VycmVudC50cGwubmV4dCkuYXBwZW5kVG8oRi5vdXRlcikuYmluZCgnY2xpY2suZmInLCBGLm5leHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdEYudHJpZ2dlcignYWZ0ZXJTaG93Jyk7XG5cblx0XHRcdC8vIFN0b3AgdGhlIHNsaWRlc2hvdyBpZiB0aGlzIGlzIHRoZSBsYXN0IGl0ZW1cblx0XHRcdGlmICghY3VycmVudC5sb29wICYmIGN1cnJlbnQuaW5kZXggPT09IGN1cnJlbnQuZ3JvdXAubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRGLnBsYXkoIGZhbHNlICk7XG5cblx0XHRcdH0gZWxzZSBpZiAoRi5vcHRzLmF1dG9QbGF5ICYmICFGLnBsYXllci5pc0FjdGl2ZSkge1xuXHRcdFx0XHRGLm9wdHMuYXV0b1BsYXkgPSBmYWxzZTtcblxuXHRcdFx0XHRGLnBsYXkoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X2FmdGVyWm9vbU91dDogZnVuY3Rpb24gKCBvYmogKSB7XG5cdFx0XHRvYmogPSBvYmogfHwgRi5jdXJyZW50O1xuXG5cdFx0XHQkKCcuZmFuY3lib3gtd3JhcCcpLnRyaWdnZXIoJ29uUmVzZXQnKS5yZW1vdmUoKTtcblxuXHRcdFx0JC5leHRlbmQoRiwge1xuXHRcdFx0XHRncm91cCAgOiB7fSxcblx0XHRcdFx0b3B0cyAgIDoge30sXG5cdFx0XHRcdHJvdXRlciA6IGZhbHNlLFxuXHRcdFx0XHRjdXJyZW50ICAgOiBudWxsLFxuXHRcdFx0XHRpc0FjdGl2ZSAgOiBmYWxzZSxcblx0XHRcdFx0aXNPcGVuZWQgIDogZmFsc2UsXG5cdFx0XHRcdGlzT3BlbiAgICA6IGZhbHNlLFxuXHRcdFx0XHRpc0Nsb3NpbmcgOiBmYWxzZSxcblx0XHRcdFx0d3JhcCAgIDogbnVsbCxcblx0XHRcdFx0c2tpbiAgIDogbnVsbCxcblx0XHRcdFx0b3V0ZXIgIDogbnVsbCxcblx0XHRcdFx0aW5uZXIgIDogbnVsbFxuXHRcdFx0fSk7XG5cblx0XHRcdEYudHJpZ2dlcignYWZ0ZXJDbG9zZScsIG9iaik7XG5cdFx0fVxuXHR9KTtcblxuXHQvKlxuXHQgKlx0RGVmYXVsdCB0cmFuc2l0aW9uc1xuXHQgKi9cblxuXHRGLnRyYW5zaXRpb25zID0ge1xuXHRcdGdldE9yaWdQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGN1cnJlbnQgID0gRi5jdXJyZW50LFxuXHRcdFx0XHRlbGVtZW50ICA9IGN1cnJlbnQuZWxlbWVudCxcblx0XHRcdFx0b3JpZyAgICAgPSBjdXJyZW50Lm9yaWcsXG5cdFx0XHRcdHBvcyAgICAgID0ge30sXG5cdFx0XHRcdHdpZHRoICAgID0gNTAsXG5cdFx0XHRcdGhlaWdodCAgID0gNTAsXG5cdFx0XHRcdGhQYWRkaW5nID0gY3VycmVudC5oUGFkZGluZyxcblx0XHRcdFx0d1BhZGRpbmcgPSBjdXJyZW50LndQYWRkaW5nLFxuXHRcdFx0XHR2aWV3cG9ydCA9IEYuZ2V0Vmlld3BvcnQoKTtcblxuXHRcdFx0aWYgKCFvcmlnICYmIGN1cnJlbnQuaXNEb20gJiYgZWxlbWVudC5pcygnOnZpc2libGUnKSkge1xuXHRcdFx0XHRvcmlnID0gZWxlbWVudC5maW5kKCdpbWc6Zmlyc3QnKTtcblxuXHRcdFx0XHRpZiAoIW9yaWcubGVuZ3RoKSB7XG5cdFx0XHRcdFx0b3JpZyA9IGVsZW1lbnQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGlzUXVlcnkob3JpZykpIHtcblx0XHRcdFx0cG9zID0gb3JpZy5vZmZzZXQoKTtcblxuXHRcdFx0XHRpZiAob3JpZy5pcygnaW1nJykpIHtcblx0XHRcdFx0XHR3aWR0aCAgPSBvcmlnLm91dGVyV2lkdGgoKTtcblx0XHRcdFx0XHRoZWlnaHQgPSBvcmlnLm91dGVySGVpZ2h0KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cG9zLnRvcCAgPSB2aWV3cG9ydC55ICsgKHZpZXdwb3J0LmggLSBoZWlnaHQpICogY3VycmVudC50b3BSYXRpbztcblx0XHRcdFx0cG9zLmxlZnQgPSB2aWV3cG9ydC54ICsgKHZpZXdwb3J0LncgLSB3aWR0aCkgICogY3VycmVudC5sZWZ0UmF0aW87XG5cdFx0XHR9XG5cblx0XHRcdGlmIChGLndyYXAuY3NzKCdwb3NpdGlvbicpID09PSAnZml4ZWQnIHx8IGN1cnJlbnQubG9ja2VkKSB7XG5cdFx0XHRcdHBvcy50b3AgIC09IHZpZXdwb3J0Lnk7XG5cdFx0XHRcdHBvcy5sZWZ0IC09IHZpZXdwb3J0Lng7XG5cdFx0XHR9XG5cblx0XHRcdHBvcyA9IHtcblx0XHRcdFx0dG9wICAgICA6IGdldFZhbHVlKHBvcy50b3AgIC0gaFBhZGRpbmcgKiBjdXJyZW50LnRvcFJhdGlvKSxcblx0XHRcdFx0bGVmdCAgICA6IGdldFZhbHVlKHBvcy5sZWZ0IC0gd1BhZGRpbmcgKiBjdXJyZW50LmxlZnRSYXRpbyksXG5cdFx0XHRcdHdpZHRoICAgOiBnZXRWYWx1ZSh3aWR0aCAgKyB3UGFkZGluZyksXG5cdFx0XHRcdGhlaWdodCAgOiBnZXRWYWx1ZShoZWlnaHQgKyBoUGFkZGluZylcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiBwb3M7XG5cdFx0fSxcblxuXHRcdHN0ZXA6IGZ1bmN0aW9uIChub3csIGZ4KSB7XG5cdFx0XHR2YXIgcmF0aW8sXG5cdFx0XHRcdHBhZGRpbmcsXG5cdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHRwcm9wICAgICAgID0gZngucHJvcCxcblx0XHRcdFx0Y3VycmVudCAgICA9IEYuY3VycmVudCxcblx0XHRcdFx0d3JhcFNwYWNlICA9IGN1cnJlbnQud3JhcFNwYWNlLFxuXHRcdFx0XHRza2luU3BhY2UgID0gY3VycmVudC5za2luU3BhY2U7XG5cblx0XHRcdGlmIChwcm9wID09PSAnd2lkdGgnIHx8IHByb3AgPT09ICdoZWlnaHQnKSB7XG5cdFx0XHRcdHJhdGlvID0gZnguZW5kID09PSBmeC5zdGFydCA/IDEgOiAobm93IC0gZnguc3RhcnQpIC8gKGZ4LmVuZCAtIGZ4LnN0YXJ0KTtcblxuXHRcdFx0XHRpZiAoRi5pc0Nsb3NpbmcpIHtcblx0XHRcdFx0XHRyYXRpbyA9IDEgLSByYXRpbztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHBhZGRpbmcgPSBwcm9wID09PSAnd2lkdGgnID8gY3VycmVudC53UGFkZGluZyA6IGN1cnJlbnQuaFBhZGRpbmc7XG5cdFx0XHRcdHZhbHVlICAgPSBub3cgLSBwYWRkaW5nO1xuXG5cdFx0XHRcdEYuc2tpblsgcHJvcCBdKCAgZ2V0U2NhbGFyKCBwcm9wID09PSAnd2lkdGgnID8gIHZhbHVlIDogdmFsdWUgLSAod3JhcFNwYWNlICogcmF0aW8pICkgKTtcblx0XHRcdFx0Ri5pbm5lclsgcHJvcCBdKCBnZXRTY2FsYXIoIHByb3AgPT09ICd3aWR0aCcgPyAgdmFsdWUgOiB2YWx1ZSAtICh3cmFwU3BhY2UgKiByYXRpbykgLSAoc2tpblNwYWNlICogcmF0aW8pICkgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0em9vbUluOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY3VycmVudCAgPSBGLmN1cnJlbnQsXG5cdFx0XHRcdHN0YXJ0UG9zID0gY3VycmVudC5wb3MsXG5cdFx0XHRcdGVmZmVjdCAgID0gY3VycmVudC5vcGVuRWZmZWN0LFxuXHRcdFx0XHRlbGFzdGljICA9IGVmZmVjdCA9PT0gJ2VsYXN0aWMnLFxuXHRcdFx0XHRlbmRQb3MgICA9ICQuZXh0ZW5kKHtvcGFjaXR5IDogMX0sIHN0YXJ0UG9zKTtcblxuXHRcdFx0Ly8gUmVtb3ZlIFwicG9zaXRpb25cIiBwcm9wZXJ0eSB0aGF0IGJyZWFrcyBvbGRlciBJRVxuXHRcdFx0ZGVsZXRlIGVuZFBvcy5wb3NpdGlvbjtcblxuXHRcdFx0aWYgKGVsYXN0aWMpIHtcblx0XHRcdFx0c3RhcnRQb3MgPSB0aGlzLmdldE9yaWdQb3NpdGlvbigpO1xuXG5cdFx0XHRcdGlmIChjdXJyZW50Lm9wZW5PcGFjaXR5KSB7XG5cdFx0XHRcdFx0c3RhcnRQb3Mub3BhY2l0eSA9IDAuMTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2UgaWYgKGVmZmVjdCA9PT0gJ2ZhZGUnKSB7XG5cdFx0XHRcdHN0YXJ0UG9zLm9wYWNpdHkgPSAwLjE7XG5cdFx0XHR9XG5cblx0XHRcdEYud3JhcC5jc3Moc3RhcnRQb3MpLmFuaW1hdGUoZW5kUG9zLCB7XG5cdFx0XHRcdGR1cmF0aW9uIDogZWZmZWN0ID09PSAnbm9uZScgPyAwIDogY3VycmVudC5vcGVuU3BlZWQsXG5cdFx0XHRcdGVhc2luZyAgIDogY3VycmVudC5vcGVuRWFzaW5nLFxuXHRcdFx0XHRzdGVwICAgICA6IGVsYXN0aWMgPyB0aGlzLnN0ZXAgOiBudWxsLFxuXHRcdFx0XHRjb21wbGV0ZSA6IEYuX2FmdGVyWm9vbUluXG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0em9vbU91dDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGN1cnJlbnQgID0gRi5jdXJyZW50LFxuXHRcdFx0XHRlZmZlY3QgICA9IGN1cnJlbnQuY2xvc2VFZmZlY3QsXG5cdFx0XHRcdGVsYXN0aWMgID0gZWZmZWN0ID09PSAnZWxhc3RpYycsXG5cdFx0XHRcdGVuZFBvcyAgID0ge29wYWNpdHkgOiAwLjF9O1xuXG5cdFx0XHRpZiAoZWxhc3RpYykge1xuXHRcdFx0XHRlbmRQb3MgPSB0aGlzLmdldE9yaWdQb3NpdGlvbigpO1xuXG5cdFx0XHRcdGlmIChjdXJyZW50LmNsb3NlT3BhY2l0eSkge1xuXHRcdFx0XHRcdGVuZFBvcy5vcGFjaXR5ID0gMC4xO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdEYud3JhcC5hbmltYXRlKGVuZFBvcywge1xuXHRcdFx0XHRkdXJhdGlvbiA6IGVmZmVjdCA9PT0gJ25vbmUnID8gMCA6IGN1cnJlbnQuY2xvc2VTcGVlZCxcblx0XHRcdFx0ZWFzaW5nICAgOiBjdXJyZW50LmNsb3NlRWFzaW5nLFxuXHRcdFx0XHRzdGVwICAgICA6IGVsYXN0aWMgPyB0aGlzLnN0ZXAgOiBudWxsLFxuXHRcdFx0XHRjb21wbGV0ZSA6IEYuX2FmdGVyWm9vbU91dFxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdGNoYW5nZUluOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY3VycmVudCAgID0gRi5jdXJyZW50LFxuXHRcdFx0XHRlZmZlY3QgICAgPSBjdXJyZW50Lm5leHRFZmZlY3QsXG5cdFx0XHRcdHN0YXJ0UG9zICA9IGN1cnJlbnQucG9zLFxuXHRcdFx0XHRlbmRQb3MgICAgPSB7IG9wYWNpdHkgOiAxIH0sXG5cdFx0XHRcdGRpcmVjdGlvbiA9IEYuZGlyZWN0aW9uLFxuXHRcdFx0XHRkaXN0YW5jZSAgPSAyMDAsXG5cdFx0XHRcdGZpZWxkO1xuXG5cdFx0XHRzdGFydFBvcy5vcGFjaXR5ID0gMC4xO1xuXG5cdFx0XHRpZiAoZWZmZWN0ID09PSAnZWxhc3RpYycpIHtcblx0XHRcdFx0ZmllbGQgPSBkaXJlY3Rpb24gPT09ICdkb3duJyB8fCBkaXJlY3Rpb24gPT09ICd1cCcgPyAndG9wJyA6ICdsZWZ0JztcblxuXHRcdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnZG93bicgfHwgZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG5cdFx0XHRcdFx0c3RhcnRQb3NbIGZpZWxkIF0gPSBnZXRWYWx1ZShnZXRTY2FsYXIoc3RhcnRQb3NbIGZpZWxkIF0pIC0gZGlzdGFuY2UpO1xuXHRcdFx0XHRcdGVuZFBvc1sgZmllbGQgXSAgID0gJys9JyArIGRpc3RhbmNlICsgJ3B4JztcblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0YXJ0UG9zWyBmaWVsZCBdID0gZ2V0VmFsdWUoZ2V0U2NhbGFyKHN0YXJ0UG9zWyBmaWVsZCBdKSArIGRpc3RhbmNlKTtcblx0XHRcdFx0XHRlbmRQb3NbIGZpZWxkIF0gICA9ICctPScgKyBkaXN0YW5jZSArICdweCc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gV29ya2Fyb3VuZCBmb3IgaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTIyNzNcblx0XHRcdGlmIChlZmZlY3QgPT09ICdub25lJykge1xuXHRcdFx0XHRGLl9hZnRlclpvb21JbigpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRGLndyYXAuY3NzKHN0YXJ0UG9zKS5hbmltYXRlKGVuZFBvcywge1xuXHRcdFx0XHRcdGR1cmF0aW9uIDogY3VycmVudC5uZXh0U3BlZWQsXG5cdFx0XHRcdFx0ZWFzaW5nICAgOiBjdXJyZW50Lm5leHRFYXNpbmcsXG5cdFx0XHRcdFx0Y29tcGxldGUgOiBGLl9hZnRlclpvb21JblxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Y2hhbmdlT3V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgcHJldmlvdXMgID0gRi5wcmV2aW91cyxcblx0XHRcdFx0ZWZmZWN0ICAgID0gcHJldmlvdXMucHJldkVmZmVjdCxcblx0XHRcdFx0ZW5kUG9zICAgID0geyBvcGFjaXR5IDogMC4xIH0sXG5cdFx0XHRcdGRpcmVjdGlvbiA9IEYuZGlyZWN0aW9uLFxuXHRcdFx0XHRkaXN0YW5jZSAgPSAyMDA7XG5cblx0XHRcdGlmIChlZmZlY3QgPT09ICdlbGFzdGljJykge1xuXHRcdFx0XHRlbmRQb3NbIGRpcmVjdGlvbiA9PT0gJ2Rvd24nIHx8IGRpcmVjdGlvbiA9PT0gJ3VwJyA/ICd0b3AnIDogJ2xlZnQnIF0gPSAoIGRpcmVjdGlvbiA9PT0gJ3VwJyB8fCBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/ICctJyA6ICcrJyApICsgJz0nICsgZGlzdGFuY2UgKyAncHgnO1xuXHRcdFx0fVxuXG5cdFx0XHRwcmV2aW91cy53cmFwLmFuaW1hdGUoZW5kUG9zLCB7XG5cdFx0XHRcdGR1cmF0aW9uIDogZWZmZWN0ID09PSAnbm9uZScgPyAwIDogcHJldmlvdXMucHJldlNwZWVkLFxuXHRcdFx0XHRlYXNpbmcgICA6IHByZXZpb3VzLnByZXZFYXNpbmcsXG5cdFx0XHRcdGNvbXBsZXRlIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQodGhpcykudHJpZ2dlcignb25SZXNldCcpLnJlbW92ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0Lypcblx0ICpcdE92ZXJsYXkgaGVscGVyXG5cdCAqL1xuXG5cdEYuaGVscGVycy5vdmVybGF5ID0ge1xuXHRcdGRlZmF1bHRzIDoge1xuXHRcdFx0Y2xvc2VDbGljayA6IHRydWUsICAgICAgLy8gaWYgdHJ1ZSwgZmFuY3lCb3ggd2lsbCBiZSBjbG9zZWQgd2hlbiB1c2VyIGNsaWNrcyBvbiB0aGUgb3ZlcmxheVxuXHRcdFx0c3BlZWRPdXQgICA6IDIwMCwgICAgICAgLy8gZHVyYXRpb24gb2YgZmFkZU91dCBhbmltYXRpb25cblx0XHRcdHNob3dFYXJseSAgOiB0cnVlLCAgICAgIC8vIGluZGljYXRlcyBpZiBzaG91bGQgYmUgb3BlbmVkIGltbWVkaWF0ZWx5IG9yIHdhaXQgdW50aWwgdGhlIGNvbnRlbnQgaXMgcmVhZHlcblx0XHRcdGNzcyAgICAgICAgOiB7fSwgICAgICAgIC8vIGN1c3RvbSBDU1MgcHJvcGVydGllc1xuXHRcdFx0bG9ja2VkICAgICA6ICFpc1RvdWNoLCAgLy8gaWYgdHJ1ZSwgdGhlIGNvbnRlbnQgd2lsbCBiZSBsb2NrZWQgaW50byBvdmVybGF5XG5cdFx0XHRmaXhlZCAgICAgIDogdHJ1ZSAgICAgICAvLyBpZiBmYWxzZSwgdGhlIG92ZXJsYXkgQ1NTIHBvc2l0aW9uIHByb3BlcnR5IHdpbGwgbm90IGJlIHNldCB0byBcImZpeGVkXCJcblx0XHR9LFxuXG5cdFx0b3ZlcmxheSA6IG51bGwsICAgICAgLy8gY3VycmVudCBoYW5kbGVcblx0XHRmaXhlZCAgIDogZmFsc2UsICAgICAvLyBpbmRpY2F0ZXMgaWYgdGhlIG92ZXJsYXkgaGFzIHBvc2l0aW9uIFwiZml4ZWRcIlxuXHRcdGVsICAgICAgOiAkKCdodG1sJyksIC8vIGVsZW1lbnQgdGhhdCBjb250YWlucyBcInRoZSBsb2NrXCJcblxuXHRcdC8vIFB1YmxpYyBtZXRob2RzXG5cdFx0Y3JlYXRlIDogZnVuY3Rpb24ob3B0cykge1xuXHRcdFx0b3B0cyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRzKTtcblxuXHRcdFx0aWYgKHRoaXMub3ZlcmxheSkge1xuXHRcdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMub3ZlcmxheSA9ICQoJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1vdmVybGF5XCI+PC9kaXY+JykuYXBwZW5kVG8oIEYuY29taW5nID8gRi5jb21pbmcucGFyZW50IDogb3B0cy5wYXJlbnQgKTtcblx0XHRcdHRoaXMuZml4ZWQgICA9IGZhbHNlO1xuXG5cdFx0XHRpZiAob3B0cy5maXhlZCAmJiBGLmRlZmF1bHRzLmZpeGVkKSB7XG5cdFx0XHRcdHRoaXMub3ZlcmxheS5hZGRDbGFzcygnZmFuY3lib3gtb3ZlcmxheS1maXhlZCcpO1xuXG5cdFx0XHRcdHRoaXMuZml4ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRvcGVuIDogZnVuY3Rpb24ob3B0cykge1xuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRvcHRzID0gJC5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdHMpO1xuXG5cdFx0XHRpZiAodGhpcy5vdmVybGF5KSB7XG5cdFx0XHRcdHRoaXMub3ZlcmxheS51bmJpbmQoJy5vdmVybGF5Jykud2lkdGgoJ2F1dG8nKS5oZWlnaHQoJ2F1dG8nKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5jcmVhdGUob3B0cyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghdGhpcy5maXhlZCkge1xuXHRcdFx0XHRXLmJpbmQoJ3Jlc2l6ZS5vdmVybGF5JywgJC5wcm94eSggdGhpcy51cGRhdGUsIHRoaXMpICk7XG5cblx0XHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9wdHMuY2xvc2VDbGljaykge1xuXHRcdFx0XHR0aGlzLm92ZXJsYXkuYmluZCgnY2xpY2sub3ZlcmxheScsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2ZhbmN5Ym94LW92ZXJsYXknKSkge1xuXHRcdFx0XHRcdFx0aWYgKEYuaXNBY3RpdmUpIHtcblx0XHRcdFx0XHRcdFx0Ri5jbG9zZSgpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGhhdC5jbG9zZSgpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5vdmVybGF5LmNzcyggb3B0cy5jc3MgKS5zaG93KCk7XG5cdFx0fSxcblxuXHRcdGNsb3NlIDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2Nyb2xsViwgc2Nyb2xsSDtcblxuXHRcdFx0Vy51bmJpbmQoJ3Jlc2l6ZS5vdmVybGF5Jyk7XG5cblx0XHRcdGlmICh0aGlzLmVsLmhhc0NsYXNzKCdmYW5jeWJveC1sb2NrJykpIHtcblx0XHRcdFx0JCgnLmZhbmN5Ym94LW1hcmdpbicpLnJlbW92ZUNsYXNzKCdmYW5jeWJveC1tYXJnaW4nKTtcblxuXHRcdFx0XHRzY3JvbGxWID0gVy5zY3JvbGxUb3AoKTtcblx0XHRcdFx0c2Nyb2xsSCA9IFcuc2Nyb2xsTGVmdCgpO1xuXG5cdFx0XHRcdHRoaXMuZWwucmVtb3ZlQ2xhc3MoJ2ZhbmN5Ym94LWxvY2snKTtcblxuXHRcdFx0XHRXLnNjcm9sbFRvcCggc2Nyb2xsViApLnNjcm9sbExlZnQoIHNjcm9sbEggKTtcblx0XHRcdH1cblxuXHRcdFx0JCgnLmZhbmN5Ym94LW92ZXJsYXknKS5yZW1vdmUoKS5oaWRlKCk7XG5cblx0XHRcdCQuZXh0ZW5kKHRoaXMsIHtcblx0XHRcdFx0b3ZlcmxheSA6IG51bGwsXG5cdFx0XHRcdGZpeGVkICAgOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdC8vIFByaXZhdGUsIGNhbGxiYWNrc1xuXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHdpZHRoID0gJzEwMCUnLCBvZmZzZXRXaWR0aDtcblxuXHRcdFx0Ly8gUmVzZXQgd2lkdGgvaGVpZ2h0IHNvIGl0IHdpbGwgbm90IG1lc3Ncblx0XHRcdHRoaXMub3ZlcmxheS53aWR0aCh3aWR0aCkuaGVpZ2h0KCcxMDAlJyk7XG5cblx0XHRcdC8vIGpRdWVyeSBkb2VzIG5vdCByZXR1cm4gcmVsaWFibGUgcmVzdWx0IGZvciBJRVxuXHRcdFx0aWYgKElFKSB7XG5cdFx0XHRcdG9mZnNldFdpZHRoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldFdpZHRoLCBkb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoKTtcblxuXHRcdFx0XHRpZiAoRC53aWR0aCgpID4gb2Zmc2V0V2lkdGgpIHtcblx0XHRcdFx0XHR3aWR0aCA9IEQud2lkdGgoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2UgaWYgKEQud2lkdGgoKSA+IFcud2lkdGgoKSkge1xuXHRcdFx0XHR3aWR0aCA9IEQud2lkdGgoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5vdmVybGF5LndpZHRoKHdpZHRoKS5oZWlnaHQoRC5oZWlnaHQoKSk7XG5cdFx0fSxcblxuXHRcdC8vIFRoaXMgaXMgd2hlcmUgd2UgY2FuIG1hbmlwdWxhdGUgRE9NLCBiZWNhdXNlIGxhdGVyIGl0IHdvdWxkIGNhdXNlIGlmcmFtZXMgdG8gcmVsb2FkXG5cdFx0b25SZWFkeSA6IGZ1bmN0aW9uIChvcHRzLCBvYmopIHtcblx0XHRcdHZhciBvdmVybGF5ID0gdGhpcy5vdmVybGF5O1xuXG5cdFx0XHQkKCcuZmFuY3lib3gtb3ZlcmxheScpLnN0b3AodHJ1ZSwgdHJ1ZSk7XG5cblx0XHRcdGlmICghb3ZlcmxheSkge1xuXHRcdFx0XHR0aGlzLmNyZWF0ZShvcHRzKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9wdHMubG9ja2VkICYmIHRoaXMuZml4ZWQgJiYgb2JqLmZpeGVkKSB7XG5cdFx0XHRcdGlmICghb3ZlcmxheSkge1xuXHRcdFx0XHRcdHRoaXMubWFyZ2luID0gRC5oZWlnaHQoKSA+IFcuaGVpZ2h0KCkgPyAkKCdodG1sJykuY3NzKCdtYXJnaW4tcmlnaHQnKS5yZXBsYWNlKFwicHhcIiwgXCJcIikgOiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG9iai5sb2NrZWQgPSB0aGlzLm92ZXJsYXkuYXBwZW5kKCBvYmoud3JhcCApO1xuXHRcdFx0XHRvYmouZml4ZWQgID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvcHRzLnNob3dFYXJseSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHR0aGlzLmJlZm9yZVNob3cuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0YmVmb3JlU2hvdyA6IGZ1bmN0aW9uKG9wdHMsIG9iaikge1xuXHRcdFx0dmFyIHNjcm9sbFYsIHNjcm9sbEg7XG5cblx0XHRcdGlmIChvYmoubG9ja2VkKSB7XG5cdFx0XHRcdGlmICh0aGlzLm1hcmdpbiAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHQkKCcqJykuZmlsdGVyKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gKCQodGhpcykuY3NzKCdwb3NpdGlvbicpID09PSAnZml4ZWQnICYmICEkKHRoaXMpLmhhc0NsYXNzKFwiZmFuY3lib3gtb3ZlcmxheVwiKSAmJiAhJCh0aGlzKS5oYXNDbGFzcyhcImZhbmN5Ym94LXdyYXBcIikgKTtcblx0XHRcdFx0XHR9KS5hZGRDbGFzcygnZmFuY3lib3gtbWFyZ2luJyk7XG5cblx0XHRcdFx0XHR0aGlzLmVsLmFkZENsYXNzKCdmYW5jeWJveC1tYXJnaW4nKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNjcm9sbFYgPSBXLnNjcm9sbFRvcCgpO1xuXHRcdFx0XHRzY3JvbGxIID0gVy5zY3JvbGxMZWZ0KCk7XG5cblx0XHRcdFx0dGhpcy5lbC5hZGRDbGFzcygnZmFuY3lib3gtbG9jaycpO1xuXG5cdFx0XHRcdFcuc2Nyb2xsVG9wKCBzY3JvbGxWICkuc2Nyb2xsTGVmdCggc2Nyb2xsSCApO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLm9wZW4ob3B0cyk7XG5cdFx0fSxcblxuXHRcdG9uVXBkYXRlIDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIXRoaXMuZml4ZWQpIHtcblx0XHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0YWZ0ZXJDbG9zZTogZnVuY3Rpb24gKG9wdHMpIHtcblx0XHRcdC8vIFJlbW92ZSBvdmVybGF5IGlmIGV4aXN0cyBhbmQgZmFuY3lCb3ggaXMgbm90IG9wZW5pbmdcblx0XHRcdC8vIChlLmcuLCBpdCBpcyBub3QgYmVpbmcgb3BlbiB1c2luZyBhZnRlckNsb3NlIGNhbGxiYWNrKVxuXHRcdFx0Ly9pZiAodGhpcy5vdmVybGF5ICYmICFGLmlzQWN0aXZlKSB7XG5cdFx0XHRpZiAodGhpcy5vdmVybGF5ICYmICFGLmNvbWluZykge1xuXHRcdFx0XHR0aGlzLm92ZXJsYXkuZmFkZU91dChvcHRzLnNwZWVkT3V0LCAkLnByb3h5KCB0aGlzLmNsb3NlLCB0aGlzICkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKlxuXHQgKlx0VGl0bGUgaGVscGVyXG5cdCAqL1xuXG5cdEYuaGVscGVycy50aXRsZSA9IHtcblx0XHRkZWZhdWx0cyA6IHtcblx0XHRcdHR5cGUgICAgIDogJ2Zsb2F0JywgLy8gJ2Zsb2F0JywgJ2luc2lkZScsICdvdXRzaWRlJyBvciAnb3ZlcicsXG5cdFx0XHRwb3NpdGlvbiA6ICdib3R0b20nIC8vICd0b3AnIG9yICdib3R0b20nXG5cdFx0fSxcblxuXHRcdGJlZm9yZVNob3c6IGZ1bmN0aW9uIChvcHRzKSB7XG5cdFx0XHR2YXIgY3VycmVudCA9IEYuY3VycmVudCxcblx0XHRcdFx0dGV4dCAgICA9IGN1cnJlbnQudGl0bGUsXG5cdFx0XHRcdHR5cGUgICAgPSBvcHRzLnR5cGUsXG5cdFx0XHRcdHRpdGxlLFxuXHRcdFx0XHR0YXJnZXQ7XG5cblx0XHRcdGlmICgkLmlzRnVuY3Rpb24odGV4dCkpIHtcblx0XHRcdFx0dGV4dCA9IHRleHQuY2FsbChjdXJyZW50LmVsZW1lbnQsIGN1cnJlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWlzU3RyaW5nKHRleHQpIHx8ICQudHJpbSh0ZXh0KSA9PT0gJycpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aXRsZSA9ICQoJzxkaXYgY2xhc3M9XCJmYW5jeWJveC10aXRsZSBmYW5jeWJveC10aXRsZS0nICsgdHlwZSArICctd3JhcFwiPicgKyB0ZXh0ICsgJzwvZGl2PicpO1xuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAnaW5zaWRlJzpcblx0XHRcdFx0XHR0YXJnZXQgPSBGLnNraW47XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgJ291dHNpZGUnOlxuXHRcdFx0XHRcdHRhcmdldCA9IEYud3JhcDtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAnb3Zlcic6XG5cdFx0XHRcdFx0dGFyZ2V0ID0gRi5pbm5lcjtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0ZGVmYXVsdDogLy8gJ2Zsb2F0J1xuXHRcdFx0XHRcdHRhcmdldCA9IEYuc2tpbjtcblxuXHRcdFx0XHRcdHRpdGxlLmFwcGVuZFRvKCdib2R5Jyk7XG5cblx0XHRcdFx0XHRpZiAoSUUpIHtcblx0XHRcdFx0XHRcdHRpdGxlLndpZHRoKCB0aXRsZS53aWR0aCgpICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dGl0bGUud3JhcElubmVyKCc8c3BhbiBjbGFzcz1cImNoaWxkXCI+PC9zcGFuPicpO1xuXG5cdFx0XHRcdFx0Ly9JbmNyZWFzZSBib3R0b20gbWFyZ2luIHNvIHRoaXMgdGl0bGUgd2lsbCBhbHNvIGZpdCBpbnRvIHZpZXdwb3J0XG5cdFx0XHRcdFx0Ri5jdXJyZW50Lm1hcmdpblsyXSArPSBNYXRoLmFicyggZ2V0U2NhbGFyKHRpdGxlLmNzcygnbWFyZ2luLWJvdHRvbScpKSApO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0dGl0bGVbIChvcHRzLnBvc2l0aW9uID09PSAndG9wJyA/ICdwcmVwZW5kVG8nICA6ICdhcHBlbmRUbycpIF0odGFyZ2V0KTtcblx0XHR9XG5cdH07XG5cblx0Ly8galF1ZXJ5IHBsdWdpbiBpbml0aWFsaXphdGlvblxuXHQkLmZuLmZhbmN5Ym94ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHR2YXIgaW5kZXgsXG5cdFx0XHR0aGF0ICAgICA9ICQodGhpcyksXG5cdFx0XHRzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3IgfHwgJycsXG5cdFx0XHRydW4gICAgICA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0dmFyIHdoYXQgPSAkKHRoaXMpLmJsdXIoKSwgaWR4ID0gaW5kZXgsIHJlbFR5cGUsIHJlbFZhbDtcblxuXHRcdFx0XHRpZiAoIShlLmN0cmxLZXkgfHwgZS5hbHRLZXkgfHwgZS5zaGlmdEtleSB8fCBlLm1ldGFLZXkpICYmICF3aGF0LmlzKCcuZmFuY3lib3gtd3JhcCcpKSB7XG5cdFx0XHRcdFx0cmVsVHlwZSA9IG9wdGlvbnMuZ3JvdXBBdHRyIHx8ICdkYXRhLWZhbmN5Ym94LWdyb3VwJztcblx0XHRcdFx0XHRyZWxWYWwgID0gd2hhdC5hdHRyKHJlbFR5cGUpO1xuXG5cdFx0XHRcdFx0aWYgKCFyZWxWYWwpIHtcblx0XHRcdFx0XHRcdHJlbFR5cGUgPSAncmVsJztcblx0XHRcdFx0XHRcdHJlbFZhbCAgPSB3aGF0LmdldCgwKVsgcmVsVHlwZSBdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChyZWxWYWwgJiYgcmVsVmFsICE9PSAnJyAmJiByZWxWYWwgIT09ICdub2ZvbGxvdycpIHtcblx0XHRcdFx0XHRcdHdoYXQgPSBzZWxlY3Rvci5sZW5ndGggPyAkKHNlbGVjdG9yKSA6IHRoYXQ7XG5cdFx0XHRcdFx0XHR3aGF0ID0gd2hhdC5maWx0ZXIoJ1snICsgcmVsVHlwZSArICc9XCInICsgcmVsVmFsICsgJ1wiXScpO1xuXHRcdFx0XHRcdFx0aWR4ICA9IHdoYXQuaW5kZXgodGhpcyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0b3B0aW9ucy5pbmRleCA9IGlkeDtcblxuXHRcdFx0XHRcdC8vIFN0b3AgYW4gZXZlbnQgZnJvbSBidWJibGluZyBpZiBldmVyeXRoaW5nIGlzIGZpbmVcblx0XHRcdFx0XHRpZiAoRi5vcGVuKHdoYXQsIG9wdGlvbnMpICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdGluZGV4ICAgPSBvcHRpb25zLmluZGV4IHx8IDA7XG5cblx0XHRpZiAoIXNlbGVjdG9yIHx8IG9wdGlvbnMubGl2ZSA9PT0gZmFsc2UpIHtcblx0XHRcdHRoYXQudW5iaW5kKCdjbGljay5mYi1zdGFydCcpLmJpbmQoJ2NsaWNrLmZiLXN0YXJ0JywgcnVuKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRELnVuZGVsZWdhdGUoc2VsZWN0b3IsICdjbGljay5mYi1zdGFydCcpLmRlbGVnYXRlKHNlbGVjdG9yICsgXCI6bm90KCcuZmFuY3lib3gtaXRlbSwgLmZhbmN5Ym94LW5hdicpXCIsICdjbGljay5mYi1zdGFydCcsIHJ1bik7XG5cdFx0fVxuXG5cdFx0dGhpcy5maWx0ZXIoJ1tkYXRhLWZhbmN5Ym94LXN0YXJ0PTFdJykudHJpZ2dlcignY2xpY2snKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8vIFRlc3RzIHRoYXQgbmVlZCBhIGJvZHkgYXQgZG9jIHJlYWR5XG5cdEQucmVhZHkoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHcxLCB3MjtcblxuXHRcdGlmICggJC5zY3JvbGxiYXJXaWR0aCA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0Ly8gaHR0cDovL2JlbmFsbWFuLmNvbS9wcm9qZWN0cy9qcXVlcnktbWlzYy1wbHVnaW5zLyNzY3JvbGxiYXJ3aWR0aFxuXHRcdFx0JC5zY3JvbGxiYXJXaWR0aCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgcGFyZW50ID0gJCgnPGRpdiBzdHlsZT1cIndpZHRoOjUwcHg7aGVpZ2h0OjUwcHg7b3ZlcmZsb3c6YXV0b1wiPjxkaXYvPjwvZGl2PicpLmFwcGVuZFRvKCdib2R5JyksXG5cdFx0XHRcdFx0Y2hpbGQgID0gcGFyZW50LmNoaWxkcmVuKCksXG5cdFx0XHRcdFx0d2lkdGggID0gY2hpbGQuaW5uZXJXaWR0aCgpIC0gY2hpbGQuaGVpZ2h0KCA5OSApLmlubmVyV2lkdGgoKTtcblxuXHRcdFx0XHRwYXJlbnQucmVtb3ZlKCk7XG5cblx0XHRcdFx0cmV0dXJuIHdpZHRoO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoICQuc3VwcG9ydC5maXhlZFBvc2l0aW9uID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHQkLnN1cHBvcnQuZml4ZWRQb3NpdGlvbiA9IChmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGVsZW0gID0gJCgnPGRpdiBzdHlsZT1cInBvc2l0aW9uOmZpeGVkO3RvcDoyMHB4O1wiPjwvZGl2PicpLmFwcGVuZFRvKCdib2R5JyksXG5cdFx0XHRcdFx0Zml4ZWQgPSAoIGVsZW1bMF0ub2Zmc2V0VG9wID09PSAyMCB8fCBlbGVtWzBdLm9mZnNldFRvcCA9PT0gMTUgKTtcblxuXHRcdFx0XHRlbGVtLnJlbW92ZSgpO1xuXG5cdFx0XHRcdHJldHVybiBmaXhlZDtcblx0XHRcdH0oKSk7XG5cdFx0fVxuXG5cdFx0JC5leHRlbmQoRi5kZWZhdWx0cywge1xuXHRcdFx0c2Nyb2xsYmFyV2lkdGggOiAkLnNjcm9sbGJhcldpZHRoKCksXG5cdFx0XHRmaXhlZCAgOiAkLnN1cHBvcnQuZml4ZWRQb3NpdGlvbixcblx0XHRcdHBhcmVudCA6ICQoJ2JvZHknKVxuXHRcdH0pO1xuXG5cdFx0Ly9HZXQgcmVhbCB3aWR0aCBvZiBwYWdlIHNjcm9sbC1iYXJcblx0XHR3MSA9ICQod2luZG93KS53aWR0aCgpO1xuXG5cdFx0SC5hZGRDbGFzcygnZmFuY3lib3gtbG9jay10ZXN0Jyk7XG5cblx0XHR3MiA9ICQod2luZG93KS53aWR0aCgpO1xuXG5cdFx0SC5yZW1vdmVDbGFzcygnZmFuY3lib3gtbG9jay10ZXN0Jyk7XG5cblx0XHQkKFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz4uZmFuY3lib3gtbWFyZ2lue21hcmdpbi1yaWdodDpcIiArICh3MiAtIHcxKSArIFwicHg7fTwvc3R5bGU+XCIpLmFwcGVuZFRvKFwiaGVhZFwiKTtcblx0fSk7XG5cbn0od2luZG93LCBkb2N1bWVudCwgalF1ZXJ5KSk7Il19
