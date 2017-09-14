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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LmZhbmN5Ym94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXHJcbiAqIGZhbmN5Qm94IC0galF1ZXJ5IFBsdWdpblxyXG4gKiB2ZXJzaW9uOiAyLjEuNSAoRnJpLCAxNCBKdW4gMjAxMylcclxuICogQHJlcXVpcmVzIGpRdWVyeSB2MS42IG9yIGxhdGVyXHJcbiAqXHJcbiAqIEV4YW1wbGVzIGF0IGh0dHA6Ly9mYW5jeWFwcHMuY29tL2ZhbmN5Ym94L1xyXG4gKiBMaWNlbnNlOiB3d3cuZmFuY3lhcHBzLmNvbS9mYW5jeWJveC8jbGljZW5zZVxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxMiBKYW5pcyBTa2FybmVsaXMgLSBqYW5pc0BmYW5jeWFwcHMuY29tXHJcbiAqXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0dmFyIEggPSAkKFwiaHRtbFwiKSxcclxuXHRcdFcgPSAkKHdpbmRvdyksXHJcblx0XHREID0gJChkb2N1bWVudCksXHJcblx0XHRGID0gJC5mYW5jeWJveCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Ri5vcGVuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcclxuXHRcdH0sXHJcblx0XHRJRSA9ICBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9tc2llL2kpLFxyXG5cdFx0ZGlkVXBkYXRlXHQ9IG51bGwsXHJcblx0XHRpc1RvdWNoXHRcdD0gZG9jdW1lbnQuY3JlYXRlVG91Y2ggIT09IHVuZGVmaW5lZCxcclxuXHJcblx0XHRpc1F1ZXJ5XHQ9IGZ1bmN0aW9uKG9iaikge1xyXG5cdFx0XHRyZXR1cm4gb2JqICYmIG9iai5oYXNPd25Qcm9wZXJ0eSAmJiBvYmogaW5zdGFuY2VvZiAkO1xyXG5cdFx0fSxcclxuXHRcdGlzU3RyaW5nID0gZnVuY3Rpb24oc3RyKSB7XHJcblx0XHRcdHJldHVybiBzdHIgJiYgJC50eXBlKHN0cikgPT09IFwic3RyaW5nXCI7XHJcblx0XHR9LFxyXG5cdFx0aXNQZXJjZW50YWdlID0gZnVuY3Rpb24oc3RyKSB7XHJcblx0XHRcdHJldHVybiBpc1N0cmluZyhzdHIpICYmIHN0ci5pbmRleE9mKCclJykgPiAwO1xyXG5cdFx0fSxcclxuXHRcdGlzU2Nyb2xsYWJsZSA9IGZ1bmN0aW9uKGVsKSB7XHJcblx0XHRcdHJldHVybiAoZWwgJiYgIShlbC5zdHlsZS5vdmVyZmxvdyAmJiBlbC5zdHlsZS5vdmVyZmxvdyA9PT0gJ2hpZGRlbicpICYmICgoZWwuY2xpZW50V2lkdGggJiYgZWwuc2Nyb2xsV2lkdGggPiBlbC5jbGllbnRXaWR0aCkgfHwgKGVsLmNsaWVudEhlaWdodCAmJiBlbC5zY3JvbGxIZWlnaHQgPiBlbC5jbGllbnRIZWlnaHQpKSk7XHJcblx0XHR9LFxyXG5cdFx0Z2V0U2NhbGFyID0gZnVuY3Rpb24ob3JpZywgZGltKSB7XHJcblx0XHRcdHZhciB2YWx1ZSA9IHBhcnNlSW50KG9yaWcsIDEwKSB8fCAwO1xyXG5cclxuXHRcdFx0aWYgKGRpbSAmJiBpc1BlcmNlbnRhZ2Uob3JpZykpIHtcclxuXHRcdFx0XHR2YWx1ZSA9IEYuZ2V0Vmlld3BvcnQoKVsgZGltIF0gLyAxMDAgKiB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIE1hdGguY2VpbCh2YWx1ZSk7XHJcblx0XHR9LFxyXG5cdFx0Z2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSwgZGltKSB7XHJcblx0XHRcdHJldHVybiBnZXRTY2FsYXIodmFsdWUsIGRpbSkgKyAncHgnO1xyXG5cdFx0fTtcclxuXHJcblx0JC5leHRlbmQoRiwge1xyXG5cdFx0Ly8gVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiBmYW5jeUJveFxyXG5cdFx0dmVyc2lvbjogJzIuMS41JyxcclxuXHJcblx0XHRkZWZhdWx0czoge1xyXG5cdFx0XHRwYWRkaW5nIDogMTUsXHJcblx0XHRcdG1hcmdpbiAgOiAyMCxcclxuXHJcblx0XHRcdHdpZHRoICAgICA6IDgwMCxcclxuXHRcdFx0aGVpZ2h0ICAgIDogNjAwLFxyXG5cdFx0XHRtaW5XaWR0aCAgOiAxMDAsXHJcblx0XHRcdG1pbkhlaWdodCA6IDEwMCxcclxuXHRcdFx0bWF4V2lkdGggIDogOTk5OSxcclxuXHRcdFx0bWF4SGVpZ2h0IDogOTk5OSxcclxuXHRcdFx0cGl4ZWxSYXRpbzogMSwgLy8gU2V0IHRvIDIgZm9yIHJldGluYSBkaXNwbGF5IHN1cHBvcnRcclxuXHJcblx0XHRcdGF1dG9TaXplICAgOiB0cnVlLFxyXG5cdFx0XHRhdXRvSGVpZ2h0IDogZmFsc2UsXHJcblx0XHRcdGF1dG9XaWR0aCAgOiBmYWxzZSxcclxuXHJcblx0XHRcdGF1dG9SZXNpemUgIDogdHJ1ZSxcclxuXHRcdFx0YXV0b0NlbnRlciAgOiAhaXNUb3VjaCxcclxuXHRcdFx0Zml0VG9WaWV3ICAgOiB0cnVlLFxyXG5cdFx0XHRhc3BlY3RSYXRpbyA6IGZhbHNlLFxyXG5cdFx0XHR0b3BSYXRpbyAgICA6IDAuNSxcclxuXHRcdFx0bGVmdFJhdGlvICAgOiAwLjUsXHJcblxyXG5cdFx0XHRzY3JvbGxpbmcgOiAnYXV0bycsIC8vICdhdXRvJywgJ3llcycgb3IgJ25vJ1xyXG5cdFx0XHR3cmFwQ1NTICAgOiAnJyxcclxuXHJcblx0XHRcdGFycm93cyAgICAgOiB0cnVlLFxyXG5cdFx0XHRjbG9zZUJ0biAgIDogdHJ1ZSxcclxuXHRcdFx0Y2xvc2VDbGljayA6IGZhbHNlLFxyXG5cdFx0XHRuZXh0Q2xpY2sgIDogZmFsc2UsXHJcblx0XHRcdG1vdXNlV2hlZWwgOiB0cnVlLFxyXG5cdFx0XHRhdXRvUGxheSAgIDogZmFsc2UsXHJcblx0XHRcdHBsYXlTcGVlZCAgOiAzMDAwLFxyXG5cdFx0XHRwcmVsb2FkICAgIDogMyxcclxuXHRcdFx0bW9kYWwgICAgICA6IGZhbHNlLFxyXG5cdFx0XHRsb29wICAgICAgIDogdHJ1ZSxcclxuXHJcblx0XHRcdGFqYXggIDoge1xyXG5cdFx0XHRcdGRhdGFUeXBlIDogJ2h0bWwnLFxyXG5cdFx0XHRcdGhlYWRlcnMgIDogeyAnWC1mYW5jeUJveCc6IHRydWUgfVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRpZnJhbWUgOiB7XHJcblx0XHRcdFx0c2Nyb2xsaW5nIDogJ2F1dG8nLFxyXG5cdFx0XHRcdHByZWxvYWQgICA6IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0c3dmIDoge1xyXG5cdFx0XHRcdHdtb2RlOiAndHJhbnNwYXJlbnQnLFxyXG5cdFx0XHRcdGFsbG93ZnVsbHNjcmVlbiAgIDogJ3RydWUnLFxyXG5cdFx0XHRcdGFsbG93c2NyaXB0YWNjZXNzIDogJ2Fsd2F5cydcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGtleXMgIDoge1xyXG5cdFx0XHRcdG5leHQgOiB7XHJcblx0XHRcdFx0XHQxMyA6ICdsZWZ0JywgLy8gZW50ZXJcclxuXHRcdFx0XHRcdDM0IDogJ3VwJywgICAvLyBwYWdlIGRvd25cclxuXHRcdFx0XHRcdDM5IDogJ2xlZnQnLCAvLyByaWdodCBhcnJvd1xyXG5cdFx0XHRcdFx0NDAgOiAndXAnICAgIC8vIGRvd24gYXJyb3dcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHByZXYgOiB7XHJcblx0XHRcdFx0XHQ4ICA6ICdyaWdodCcsICAvLyBiYWNrc3BhY2VcclxuXHRcdFx0XHRcdDMzIDogJ2Rvd24nLCAgIC8vIHBhZ2UgdXBcclxuXHRcdFx0XHRcdDM3IDogJ3JpZ2h0JywgIC8vIGxlZnQgYXJyb3dcclxuXHRcdFx0XHRcdDM4IDogJ2Rvd24nICAgIC8vIHVwIGFycm93XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRjbG9zZSAgOiBbMjddLCAvLyBlc2NhcGUga2V5XHJcblx0XHRcdFx0cGxheSAgIDogWzMyXSwgLy8gc3BhY2UgLSBzdGFydC9zdG9wIHNsaWRlc2hvd1xyXG5cdFx0XHRcdHRvZ2dsZSA6IFs3MF0gIC8vIGxldHRlciBcImZcIiAtIHRvZ2dsZSBmdWxsc2NyZWVuXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRkaXJlY3Rpb24gOiB7XHJcblx0XHRcdFx0bmV4dCA6ICdsZWZ0JyxcclxuXHRcdFx0XHRwcmV2IDogJ3JpZ2h0J1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0c2Nyb2xsT3V0c2lkZSAgOiB0cnVlLFxyXG5cclxuXHRcdFx0Ly8gT3ZlcnJpZGUgc29tZSBwcm9wZXJ0aWVzXHJcblx0XHRcdGluZGV4ICAgOiAwLFxyXG5cdFx0XHR0eXBlICAgIDogbnVsbCxcclxuXHRcdFx0aHJlZiAgICA6IG51bGwsXHJcblx0XHRcdGNvbnRlbnQgOiBudWxsLFxyXG5cdFx0XHR0aXRsZSAgIDogbnVsbCxcclxuXHJcblx0XHRcdC8vIEhUTUwgdGVtcGxhdGVzXHJcblx0XHRcdHRwbDoge1xyXG5cdFx0XHRcdHdyYXAgICAgIDogJzxkaXYgY2xhc3M9XCJmYW5jeWJveC13cmFwXCIgdGFiSW5kZXg9XCItMVwiPjxkaXYgY2xhc3M9XCJmYW5jeWJveC1za2luXCI+PGRpdiBjbGFzcz1cImZhbmN5Ym94LW91dGVyXCI+PGRpdiBjbGFzcz1cImZhbmN5Ym94LWlubmVyXCI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+JyxcclxuXHRcdFx0XHRpbWFnZSAgICA6ICc8aW1nIGNsYXNzPVwiZmFuY3lib3gtaW1hZ2VcIiBzcmM9XCJ7aHJlZn1cIiBhbHQ9XCJcIiAvPicsXHJcblx0XHRcdFx0aWZyYW1lICAgOiAnPGlmcmFtZSBpZD1cImZhbmN5Ym94LWZyYW1le3JuZH1cIiBuYW1lPVwiZmFuY3lib3gtZnJhbWV7cm5kfVwiIGNsYXNzPVwiZmFuY3lib3gtaWZyYW1lXCIgZnJhbWVib3JkZXI9XCIwXCIgdnNwYWNlPVwiMFwiIGhzcGFjZT1cIjBcIiB3ZWJraXRBbGxvd0Z1bGxTY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93RnVsbFNjcmVlbicgKyAoSUUgPyAnIGFsbG93dHJhbnNwYXJlbmN5PVwidHJ1ZVwiJyA6ICcnKSArICc+PC9pZnJhbWU+JyxcclxuXHRcdFx0XHRlcnJvciAgICA6ICc8cCBjbGFzcz1cImZhbmN5Ym94LWVycm9yXCI+VGhlIHJlcXVlc3RlZCBjb250ZW50IGNhbm5vdCBiZSBsb2FkZWQuPGJyLz5QbGVhc2UgdHJ5IGFnYWluIGxhdGVyLjwvcD4nLFxyXG5cdFx0XHRcdGNsb3NlQnRuIDogJzxhIHRpdGxlPVwiQ2xvc2VcIiBjbGFzcz1cImZhbmN5Ym94LWl0ZW0gZmFuY3lib3gtY2xvc2VcIiBocmVmPVwiamF2YXNjcmlwdDo7XCI+PC9hPicsXHJcblx0XHRcdFx0bmV4dCAgICAgOiAnPGEgdGl0bGU9XCJOZXh0XCIgY2xhc3M9XCJmYW5jeWJveC1uYXYgZmFuY3lib3gtbmV4dFwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj48c3Bhbj48L3NwYW4+PC9hPicsXHJcblx0XHRcdFx0cHJldiAgICAgOiAnPGEgdGl0bGU9XCJQcmV2aW91c1wiIGNsYXNzPVwiZmFuY3lib3gtbmF2IGZhbmN5Ym94LXByZXZcIiBocmVmPVwiamF2YXNjcmlwdDo7XCI+PHNwYW4+PC9zcGFuPjwvYT4nXHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQvLyBQcm9wZXJ0aWVzIGZvciBlYWNoIGFuaW1hdGlvbiB0eXBlXHJcblx0XHRcdC8vIE9wZW5pbmcgZmFuY3lCb3hcclxuXHRcdFx0b3BlbkVmZmVjdCAgOiAnZmFkZScsIC8vICdlbGFzdGljJywgJ2ZhZGUnIG9yICdub25lJ1xyXG5cdFx0XHRvcGVuU3BlZWQgICA6IDI1MCxcclxuXHRcdFx0b3BlbkVhc2luZyAgOiAnc3dpbmcnLFxyXG5cdFx0XHRvcGVuT3BhY2l0eSA6IHRydWUsXHJcblx0XHRcdG9wZW5NZXRob2QgIDogJ3pvb21JbicsXHJcblxyXG5cdFx0XHQvLyBDbG9zaW5nIGZhbmN5Qm94XHJcblx0XHRcdGNsb3NlRWZmZWN0ICA6ICdmYWRlJywgLy8gJ2VsYXN0aWMnLCAnZmFkZScgb3IgJ25vbmUnXHJcblx0XHRcdGNsb3NlU3BlZWQgICA6IDI1MCxcclxuXHRcdFx0Y2xvc2VFYXNpbmcgIDogJ3N3aW5nJyxcclxuXHRcdFx0Y2xvc2VPcGFjaXR5IDogdHJ1ZSxcclxuXHRcdFx0Y2xvc2VNZXRob2QgIDogJ3pvb21PdXQnLFxyXG5cclxuXHRcdFx0Ly8gQ2hhbmdpbmcgbmV4dCBnYWxsZXJ5IGl0ZW1cclxuXHRcdFx0bmV4dEVmZmVjdCA6ICdlbGFzdGljJywgLy8gJ2VsYXN0aWMnLCAnZmFkZScgb3IgJ25vbmUnXHJcblx0XHRcdG5leHRTcGVlZCAgOiAyNTAsXHJcblx0XHRcdG5leHRFYXNpbmcgOiAnc3dpbmcnLFxyXG5cdFx0XHRuZXh0TWV0aG9kIDogJ2NoYW5nZUluJyxcclxuXHJcblx0XHRcdC8vIENoYW5naW5nIHByZXZpb3VzIGdhbGxlcnkgaXRlbVxyXG5cdFx0XHRwcmV2RWZmZWN0IDogJ2VsYXN0aWMnLCAvLyAnZWxhc3RpYycsICdmYWRlJyBvciAnbm9uZSdcclxuXHRcdFx0cHJldlNwZWVkICA6IDI1MCxcclxuXHRcdFx0cHJldkVhc2luZyA6ICdzd2luZycsXHJcblx0XHRcdHByZXZNZXRob2QgOiAnY2hhbmdlT3V0JyxcclxuXHJcblx0XHRcdC8vIEVuYWJsZSBkZWZhdWx0IGhlbHBlcnNcclxuXHRcdFx0aGVscGVycyA6IHtcclxuXHRcdFx0XHRvdmVybGF5IDogdHJ1ZSxcclxuXHRcdFx0XHR0aXRsZSAgIDogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0Ly8gQ2FsbGJhY2tzXHJcblx0XHRcdG9uQ2FuY2VsICAgICA6ICQubm9vcCwgLy8gSWYgY2FuY2VsaW5nXHJcblx0XHRcdGJlZm9yZUxvYWQgICA6ICQubm9vcCwgLy8gQmVmb3JlIGxvYWRpbmdcclxuXHRcdFx0YWZ0ZXJMb2FkICAgIDogJC5ub29wLCAvLyBBZnRlciBsb2FkaW5nXHJcblx0XHRcdGJlZm9yZVNob3cgICA6ICQubm9vcCwgLy8gQmVmb3JlIGNoYW5naW5nIGluIGN1cnJlbnQgaXRlbVxyXG5cdFx0XHRhZnRlclNob3cgICAgOiAkLm5vb3AsIC8vIEFmdGVyIG9wZW5pbmdcclxuXHRcdFx0YmVmb3JlQ2hhbmdlIDogJC5ub29wLCAvLyBCZWZvcmUgY2hhbmdpbmcgZ2FsbGVyeSBpdGVtXHJcblx0XHRcdGJlZm9yZUNsb3NlICA6ICQubm9vcCwgLy8gQmVmb3JlIGNsb3NpbmdcclxuXHRcdFx0YWZ0ZXJDbG9zZSAgIDogJC5ub29wICAvLyBBZnRlciBjbG9zaW5nXHJcblx0XHR9LFxyXG5cclxuXHRcdC8vQ3VycmVudCBzdGF0ZVxyXG5cdFx0Z3JvdXAgICAgOiB7fSwgLy8gU2VsZWN0ZWQgZ3JvdXBcclxuXHRcdG9wdHMgICAgIDoge30sIC8vIEdyb3VwIG9wdGlvbnNcclxuXHRcdHByZXZpb3VzIDogbnVsbCwgIC8vIFByZXZpb3VzIGVsZW1lbnRcclxuXHRcdGNvbWluZyAgIDogbnVsbCwgIC8vIEVsZW1lbnQgYmVpbmcgbG9hZGVkXHJcblx0XHRjdXJyZW50ICA6IG51bGwsICAvLyBDdXJyZW50bHkgbG9hZGVkIGVsZW1lbnRcclxuXHRcdGlzQWN0aXZlIDogZmFsc2UsIC8vIElzIGFjdGl2YXRlZFxyXG5cdFx0aXNPcGVuICAgOiBmYWxzZSwgLy8gSXMgY3VycmVudGx5IG9wZW5cclxuXHRcdGlzT3BlbmVkIDogZmFsc2UsIC8vIEhhdmUgYmVlbiBmdWxseSBvcGVuZWQgYXQgbGVhc3Qgb25jZVxyXG5cclxuXHRcdHdyYXAgIDogbnVsbCxcclxuXHRcdHNraW4gIDogbnVsbCxcclxuXHRcdG91dGVyIDogbnVsbCxcclxuXHRcdGlubmVyIDogbnVsbCxcclxuXHJcblx0XHRwbGF5ZXIgOiB7XHJcblx0XHRcdHRpbWVyICAgIDogbnVsbCxcclxuXHRcdFx0aXNBY3RpdmUgOiBmYWxzZVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBMb2FkZXJzXHJcblx0XHRhamF4TG9hZCAgIDogbnVsbCxcclxuXHRcdGltZ1ByZWxvYWQgOiBudWxsLFxyXG5cclxuXHRcdC8vIFNvbWUgY29sbGVjdGlvbnNcclxuXHRcdHRyYW5zaXRpb25zIDoge30sXHJcblx0XHRoZWxwZXJzICAgICA6IHt9LFxyXG5cclxuXHRcdC8qXHJcblx0XHQgKlx0U3RhdGljIG1ldGhvZHNcclxuXHRcdCAqL1xyXG5cclxuXHRcdG9wZW46IGZ1bmN0aW9uIChncm91cCwgb3B0cykge1xyXG5cdFx0XHRpZiAoIWdyb3VwKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoISQuaXNQbGFpbk9iamVjdChvcHRzKSkge1xyXG5cdFx0XHRcdG9wdHMgPSB7fTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2xvc2UgaWYgYWxyZWFkeSBhY3RpdmVcclxuXHRcdFx0aWYgKGZhbHNlID09PSBGLmNsb3NlKHRydWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBOb3JtYWxpemUgZ3JvdXBcclxuXHRcdFx0aWYgKCEkLmlzQXJyYXkoZ3JvdXApKSB7XHJcblx0XHRcdFx0Z3JvdXAgPSBpc1F1ZXJ5KGdyb3VwKSA/ICQoZ3JvdXApLmdldCgpIDogW2dyb3VwXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gUmVjaGVjayBpZiB0aGUgdHlwZSBvZiBlYWNoIGVsZW1lbnQgaXMgYG9iamVjdGAgYW5kIHNldCBjb250ZW50IHR5cGUgKGltYWdlLCBhamF4LCBldGMpXHJcblx0XHRcdCQuZWFjaChncm91cCwgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xyXG5cdFx0XHRcdHZhciBvYmogPSB7fSxcclxuXHRcdFx0XHRcdGhyZWYsXHJcblx0XHRcdFx0XHR0aXRsZSxcclxuXHRcdFx0XHRcdGNvbnRlbnQsXHJcblx0XHRcdFx0XHR0eXBlLFxyXG5cdFx0XHRcdFx0cmV6LFxyXG5cdFx0XHRcdFx0aHJlZlBhcnRzLFxyXG5cdFx0XHRcdFx0c2VsZWN0b3I7XHJcblxyXG5cdFx0XHRcdGlmICgkLnR5cGUoZWxlbWVudCkgPT09IFwib2JqZWN0XCIpIHtcclxuXHRcdFx0XHRcdC8vIENoZWNrIGlmIGlzIERPTSBlbGVtZW50XHJcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5ub2RlVHlwZSkge1xyXG5cdFx0XHRcdFx0XHRlbGVtZW50ID0gJChlbGVtZW50KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoaXNRdWVyeShlbGVtZW50KSkge1xyXG5cdFx0XHRcdFx0XHRvYmogPSB7XHJcblx0XHRcdFx0XHRcdFx0aHJlZiAgICA6IGVsZW1lbnQuZGF0YSgnZmFuY3lib3gtaHJlZicpIHx8IGVsZW1lbnQuYXR0cignaHJlZicpLFxyXG5cdFx0XHRcdFx0XHRcdHRpdGxlICAgOiBlbGVtZW50LmRhdGEoJ2ZhbmN5Ym94LXRpdGxlJykgfHwgZWxlbWVudC5hdHRyKCd0aXRsZScpLFxyXG5cdFx0XHRcdFx0XHRcdGlzRG9tICAgOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQgOiBlbGVtZW50XHJcblx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoJC5tZXRhZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdCQuZXh0ZW5kKHRydWUsIG9iaiwgZWxlbWVudC5tZXRhZGF0YSgpKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdG9iaiA9IGVsZW1lbnQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRocmVmICA9IG9wdHMuaHJlZiAgfHwgb2JqLmhyZWYgfHwgKGlzU3RyaW5nKGVsZW1lbnQpID8gZWxlbWVudCA6IG51bGwpO1xyXG5cdFx0XHRcdHRpdGxlID0gb3B0cy50aXRsZSAhPT0gdW5kZWZpbmVkID8gb3B0cy50aXRsZSA6IG9iai50aXRsZSB8fCAnJztcclxuXHJcblx0XHRcdFx0Y29udGVudCA9IG9wdHMuY29udGVudCB8fCBvYmouY29udGVudDtcclxuXHRcdFx0XHR0eXBlICAgID0gY29udGVudCA/ICdodG1sJyA6IChvcHRzLnR5cGUgIHx8IG9iai50eXBlKTtcclxuXHJcblx0XHRcdFx0aWYgKCF0eXBlICYmIG9iai5pc0RvbSkge1xyXG5cdFx0XHRcdFx0dHlwZSA9IGVsZW1lbnQuZGF0YSgnZmFuY3lib3gtdHlwZScpO1xyXG5cclxuXHRcdFx0XHRcdGlmICghdHlwZSkge1xyXG5cdFx0XHRcdFx0XHRyZXogID0gZWxlbWVudC5wcm9wKCdjbGFzcycpLm1hdGNoKC9mYW5jeWJveFxcLihcXHcrKS8pO1xyXG5cdFx0XHRcdFx0XHR0eXBlID0gcmV6ID8gcmV6WzFdIDogbnVsbDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChpc1N0cmluZyhocmVmKSkge1xyXG5cdFx0XHRcdFx0Ly8gVHJ5IHRvIGd1ZXNzIHRoZSBjb250ZW50IHR5cGVcclxuXHRcdFx0XHRcdGlmICghdHlwZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoRi5pc0ltYWdlKGhyZWYpKSB7XHJcblx0XHRcdFx0XHRcdFx0dHlwZSA9ICdpbWFnZSc7XHJcblxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKEYuaXNTV0YoaHJlZikpIHtcclxuXHRcdFx0XHRcdFx0XHR0eXBlID0gJ3N3Zic7XHJcblxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGhyZWYuY2hhckF0KDApID09PSAnIycpIHtcclxuXHRcdFx0XHRcdFx0XHR0eXBlID0gJ2lubGluZSc7XHJcblxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGlzU3RyaW5nKGVsZW1lbnQpKSB7XHJcblx0XHRcdFx0XHRcdFx0dHlwZSAgICA9ICdodG1sJztcclxuXHRcdFx0XHRcdFx0XHRjb250ZW50ID0gZWxlbWVudDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIFNwbGl0IHVybCBpbnRvIHR3byBwaWVjZXMgd2l0aCBzb3VyY2UgdXJsIGFuZCBjb250ZW50IHNlbGVjdG9yLCBlLmcsXHJcblx0XHRcdFx0XHQvLyBcIi9teXBhZ2UuaHRtbCAjbXlfaWRcIiB3aWxsIGxvYWQgXCIvbXlwYWdlLmh0bWxcIiBhbmQgZGlzcGxheSBlbGVtZW50IGhhdmluZyBpZCBcIm15X2lkXCJcclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAnYWpheCcpIHtcclxuXHRcdFx0XHRcdFx0aHJlZlBhcnRzID0gaHJlZi5zcGxpdCgvXFxzKy8sIDIpO1xyXG5cdFx0XHRcdFx0XHRocmVmICAgICAgPSBocmVmUGFydHMuc2hpZnQoKTtcclxuXHRcdFx0XHRcdFx0c2VsZWN0b3IgID0gaHJlZlBhcnRzLnNoaWZ0KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoIWNvbnRlbnQpIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAnaW5saW5lJykge1xyXG5cdFx0XHRcdFx0XHRpZiAoaHJlZikge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnRlbnQgPSAkKCBpc1N0cmluZyhocmVmKSA/IGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIDogaHJlZiApOyAvL3N0cmlwIGZvciBpZTdcclxuXHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAob2JqLmlzRG9tKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29udGVudCA9IGVsZW1lbnQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdodG1sJykge1xyXG5cdFx0XHRcdFx0XHRjb250ZW50ID0gaHJlZjtcclxuXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCF0eXBlICYmICFocmVmICYmIG9iai5pc0RvbSkge1xyXG5cdFx0XHRcdFx0XHR0eXBlICAgID0gJ2lubGluZSc7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQgPSBlbGVtZW50O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JC5leHRlbmQob2JqLCB7XHJcblx0XHRcdFx0XHRocmVmICAgICA6IGhyZWYsXHJcblx0XHRcdFx0XHR0eXBlICAgICA6IHR5cGUsXHJcblx0XHRcdFx0XHRjb250ZW50ICA6IGNvbnRlbnQsXHJcblx0XHRcdFx0XHR0aXRsZSAgICA6IHRpdGxlLFxyXG5cdFx0XHRcdFx0c2VsZWN0b3IgOiBzZWxlY3RvclxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRncm91cFsgaSBdID0gb2JqO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIEV4dGVuZCB0aGUgZGVmYXVsdHNcclxuXHRcdFx0Ri5vcHRzID0gJC5leHRlbmQodHJ1ZSwge30sIEYuZGVmYXVsdHMsIG9wdHMpO1xyXG5cclxuXHRcdFx0Ly8gQWxsIG9wdGlvbnMgYXJlIG1lcmdlZCByZWN1cnNpdmUgZXhjZXB0IGtleXNcclxuXHRcdFx0aWYgKG9wdHMua2V5cyAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0Ri5vcHRzLmtleXMgPSBvcHRzLmtleXMgPyAkLmV4dGVuZCh7fSwgRi5kZWZhdWx0cy5rZXlzLCBvcHRzLmtleXMpIDogZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEYuZ3JvdXAgPSBncm91cDtcclxuXHJcblx0XHRcdHJldHVybiBGLl9zdGFydChGLm9wdHMuaW5kZXgpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBDYW5jZWwgaW1hZ2UgbG9hZGluZyBvciBhYm9ydCBhamF4IHJlcXVlc3RcclxuXHRcdGNhbmNlbDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgY29taW5nID0gRi5jb21pbmc7XHJcblxyXG5cdFx0XHRpZiAoIWNvbWluZyB8fCBmYWxzZSA9PT0gRi50cmlnZ2VyKCdvbkNhbmNlbCcpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRGLmhpZGVMb2FkaW5nKCk7XHJcblxyXG5cdFx0XHRpZiAoRi5hamF4TG9hZCkge1xyXG5cdFx0XHRcdEYuYWpheExvYWQuYWJvcnQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ri5hamF4TG9hZCA9IG51bGw7XHJcblxyXG5cdFx0XHRpZiAoRi5pbWdQcmVsb2FkKSB7XHJcblx0XHRcdFx0Ri5pbWdQcmVsb2FkLm9ubG9hZCA9IEYuaW1nUHJlbG9hZC5vbmVycm9yID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGNvbWluZy53cmFwKSB7XHJcblx0XHRcdFx0Y29taW5nLndyYXAuc3RvcCh0cnVlLCB0cnVlKS50cmlnZ2VyKCdvblJlc2V0JykucmVtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEYuY29taW5nID0gbnVsbDtcclxuXHJcblx0XHRcdC8vIElmIHRoZSBmaXJzdCBpdGVtIGhhcyBiZWVuIGNhbmNlbGVkLCB0aGVuIGNsZWFyIGV2ZXJ5dGhpbmdcclxuXHRcdFx0aWYgKCFGLmN1cnJlbnQpIHtcclxuXHRcdFx0XHRGLl9hZnRlclpvb21PdXQoIGNvbWluZyApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIFN0YXJ0IGNsb3NpbmcgYW5pbWF0aW9uIGlmIGlzIG9wZW47IHJlbW92ZSBpbW1lZGlhdGVseSBpZiBvcGVuaW5nL2Nsb3NpbmdcclxuXHRcdGNsb3NlOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0Ri5jYW5jZWwoKTtcclxuXHJcblx0XHRcdGlmIChmYWxzZSA9PT0gRi50cmlnZ2VyKCdiZWZvcmVDbG9zZScpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRGLnVuYmluZEV2ZW50cygpO1xyXG5cclxuXHRcdFx0aWYgKCFGLmlzQWN0aXZlKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIUYuaXNPcGVuIHx8IGV2ZW50ID09PSB0cnVlKSB7XHJcblx0XHRcdFx0JCgnLmZhbmN5Ym94LXdyYXAnKS5zdG9wKHRydWUpLnRyaWdnZXIoJ29uUmVzZXQnKS5yZW1vdmUoKTtcclxuXHJcblx0XHRcdFx0Ri5fYWZ0ZXJab29tT3V0KCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEYuaXNPcGVuID0gRi5pc09wZW5lZCA9IGZhbHNlO1xyXG5cdFx0XHRcdEYuaXNDbG9zaW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0JCgnLmZhbmN5Ym94LWl0ZW0sIC5mYW5jeWJveC1uYXYnKS5yZW1vdmUoKTtcclxuXHJcblx0XHRcdFx0Ri53cmFwLnN0b3AodHJ1ZSwgdHJ1ZSkucmVtb3ZlQ2xhc3MoJ2ZhbmN5Ym94LW9wZW5lZCcpO1xyXG5cclxuXHRcdFx0XHRGLnRyYW5zaXRpb25zWyBGLmN1cnJlbnQuY2xvc2VNZXRob2QgXSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIE1hbmFnZSBzbGlkZXNob3c6XHJcblx0XHQvLyAgICQuZmFuY3lib3gucGxheSgpOyAtIHRvZ2dsZSBzbGlkZXNob3dcclxuXHRcdC8vICAgJC5mYW5jeWJveC5wbGF5KCB0cnVlICk7IC0gc3RhcnRcclxuXHRcdC8vICAgJC5mYW5jeWJveC5wbGF5KCBmYWxzZSApOyAtIHN0b3BcclxuXHRcdHBsYXk6IGZ1bmN0aW9uICggYWN0aW9uICkge1xyXG5cdFx0XHR2YXIgY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoRi5wbGF5ZXIudGltZXIpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0c2V0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0Y2xlYXIoKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoRi5jdXJyZW50ICYmIEYucGxheWVyLmlzQWN0aXZlKSB7XHJcblx0XHRcdFx0XHRcdEYucGxheWVyLnRpbWVyID0gc2V0VGltZW91dChGLm5leHQsIEYuY3VycmVudC5wbGF5U3BlZWQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0c3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGNsZWFyKCk7XHJcblxyXG5cdFx0XHRcdFx0RC51bmJpbmQoJy5wbGF5ZXInKTtcclxuXHJcblx0XHRcdFx0XHRGLnBsYXllci5pc0FjdGl2ZSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRcdEYudHJpZ2dlcignb25QbGF5RW5kJyk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRzdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGlmIChGLmN1cnJlbnQgJiYgKEYuY3VycmVudC5sb29wIHx8IEYuY3VycmVudC5pbmRleCA8IEYuZ3JvdXAubGVuZ3RoIC0gMSkpIHtcclxuXHRcdFx0XHRcdFx0Ri5wbGF5ZXIuaXNBY3RpdmUgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0RC5iaW5kKHtcclxuXHRcdFx0XHRcdFx0XHQnb25DYW5jZWwucGxheWVyIGJlZm9yZUNsb3NlLnBsYXllcicgOiBzdG9wLFxyXG5cdFx0XHRcdFx0XHRcdCdvblVwZGF0ZS5wbGF5ZXInICAgOiBzZXQsXHJcblx0XHRcdFx0XHRcdFx0J2JlZm9yZUxvYWQucGxheWVyJyA6IGNsZWFyXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0c2V0KCk7XHJcblxyXG5cdFx0XHRcdFx0XHRGLnRyaWdnZXIoJ29uUGxheVN0YXJ0Jyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdGlmIChhY3Rpb24gPT09IHRydWUgfHwgKCFGLnBsYXllci5pc0FjdGl2ZSAmJiBhY3Rpb24gIT09IGZhbHNlKSkge1xyXG5cdFx0XHRcdHN0YXJ0KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c3RvcCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIE5hdmlnYXRlIHRvIG5leHQgZ2FsbGVyeSBpdGVtXHJcblx0XHRuZXh0OiBmdW5jdGlvbiAoIGRpcmVjdGlvbiApIHtcclxuXHRcdFx0dmFyIGN1cnJlbnQgPSBGLmN1cnJlbnQ7XHJcblxyXG5cdFx0XHRpZiAoY3VycmVudCkge1xyXG5cdFx0XHRcdGlmICghaXNTdHJpbmcoZGlyZWN0aW9uKSkge1xyXG5cdFx0XHRcdFx0ZGlyZWN0aW9uID0gY3VycmVudC5kaXJlY3Rpb24ubmV4dDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdEYuanVtcHRvKGN1cnJlbnQuaW5kZXggKyAxLCBkaXJlY3Rpb24sICduZXh0Jyk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gTmF2aWdhdGUgdG8gcHJldmlvdXMgZ2FsbGVyeSBpdGVtXHJcblx0XHRwcmV2OiBmdW5jdGlvbiAoIGRpcmVjdGlvbiApIHtcclxuXHRcdFx0dmFyIGN1cnJlbnQgPSBGLmN1cnJlbnQ7XHJcblxyXG5cdFx0XHRpZiAoY3VycmVudCkge1xyXG5cdFx0XHRcdGlmICghaXNTdHJpbmcoZGlyZWN0aW9uKSkge1xyXG5cdFx0XHRcdFx0ZGlyZWN0aW9uID0gY3VycmVudC5kaXJlY3Rpb24ucHJldjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdEYuanVtcHRvKGN1cnJlbnQuaW5kZXggLSAxLCBkaXJlY3Rpb24sICdwcmV2Jyk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gTmF2aWdhdGUgdG8gZ2FsbGVyeSBpdGVtIGJ5IGluZGV4XHJcblx0XHRqdW1wdG86IGZ1bmN0aW9uICggaW5kZXgsIGRpcmVjdGlvbiwgcm91dGVyICkge1xyXG5cdFx0XHR2YXIgY3VycmVudCA9IEYuY3VycmVudDtcclxuXHJcblx0XHRcdGlmICghY3VycmVudCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aW5kZXggPSBnZXRTY2FsYXIoaW5kZXgpO1xyXG5cclxuXHRcdFx0Ri5kaXJlY3Rpb24gPSBkaXJlY3Rpb24gfHwgY3VycmVudC5kaXJlY3Rpb25bIChpbmRleCA+PSBjdXJyZW50LmluZGV4ID8gJ25leHQnIDogJ3ByZXYnKSBdO1xyXG5cdFx0XHRGLnJvdXRlciAgICA9IHJvdXRlciB8fCAnanVtcHRvJztcclxuXHJcblx0XHRcdGlmIChjdXJyZW50Lmxvb3ApIHtcclxuXHRcdFx0XHRpZiAoaW5kZXggPCAwKSB7XHJcblx0XHRcdFx0XHRpbmRleCA9IGN1cnJlbnQuZ3JvdXAubGVuZ3RoICsgKGluZGV4ICUgY3VycmVudC5ncm91cC5sZW5ndGgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aW5kZXggPSBpbmRleCAlIGN1cnJlbnQuZ3JvdXAubGVuZ3RoO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoY3VycmVudC5ncm91cFsgaW5kZXggXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0Ri5jYW5jZWwoKTtcclxuXHJcblx0XHRcdFx0Ri5fc3RhcnQoaW5kZXgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIENlbnRlciBpbnNpZGUgdmlld3BvcnQgYW5kIHRvZ2dsZSBwb3NpdGlvbiB0eXBlIHRvIGZpeGVkIG9yIGFic29sdXRlIGlmIG5lZWRlZFxyXG5cdFx0cmVwb3NpdGlvbjogZnVuY3Rpb24gKGUsIG9ubHlBYnNvbHV0ZSkge1xyXG5cdFx0XHR2YXIgY3VycmVudCA9IEYuY3VycmVudCxcclxuXHRcdFx0XHR3cmFwICAgID0gY3VycmVudCA/IGN1cnJlbnQud3JhcCA6IG51bGwsXHJcblx0XHRcdFx0cG9zO1xyXG5cclxuXHRcdFx0aWYgKHdyYXApIHtcclxuXHRcdFx0XHRwb3MgPSBGLl9nZXRQb3NpdGlvbihvbmx5QWJzb2x1dGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoZSAmJiBlLnR5cGUgPT09ICdzY3JvbGwnKSB7XHJcblx0XHRcdFx0XHRkZWxldGUgcG9zLnBvc2l0aW9uO1xyXG5cclxuXHRcdFx0XHRcdHdyYXAuc3RvcCh0cnVlLCB0cnVlKS5hbmltYXRlKHBvcywgMjAwKTtcclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHdyYXAuY3NzKHBvcyk7XHJcblxyXG5cdFx0XHRcdFx0Y3VycmVudC5wb3MgPSAkLmV4dGVuZCh7fSwgY3VycmVudC5kaW0sIHBvcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdHVwZGF0ZTogZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0dmFyIHR5cGUgPSAoZSAmJiBlLnR5cGUpLFxyXG5cdFx0XHRcdGFueXdheSA9ICF0eXBlIHx8IHR5cGUgPT09ICdvcmllbnRhdGlvbmNoYW5nZSc7XHJcblxyXG5cdFx0XHRpZiAoYW55d2F5KSB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KGRpZFVwZGF0ZSk7XHJcblxyXG5cdFx0XHRcdGRpZFVwZGF0ZSA9IG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghRi5pc09wZW4gfHwgZGlkVXBkYXRlKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRkaWRVcGRhdGUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBjdXJyZW50ID0gRi5jdXJyZW50O1xyXG5cclxuXHRcdFx0XHRpZiAoIWN1cnJlbnQgfHwgRi5pc0Nsb3NpbmcpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdEYud3JhcC5yZW1vdmVDbGFzcygnZmFuY3lib3gtdG1wJyk7XHJcblxyXG5cdFx0XHRcdGlmIChhbnl3YXkgfHwgdHlwZSA9PT0gJ2xvYWQnIHx8ICh0eXBlID09PSAncmVzaXplJyAmJiBjdXJyZW50LmF1dG9SZXNpemUpKSB7XHJcblx0XHRcdFx0XHRGLl9zZXREaW1lbnNpb24oKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICghKHR5cGUgPT09ICdzY3JvbGwnICYmIGN1cnJlbnQuY2FuU2hyaW5rKSkge1xyXG5cdFx0XHRcdFx0Ri5yZXBvc2l0aW9uKGUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ri50cmlnZ2VyKCdvblVwZGF0ZScpO1xyXG5cclxuXHRcdFx0XHRkaWRVcGRhdGUgPSBudWxsO1xyXG5cclxuXHRcdFx0fSwgKGFueXdheSAmJiAhaXNUb3VjaCA/IDAgOiAzMDApKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gU2hyaW5rIGNvbnRlbnQgdG8gZml0IGluc2lkZSB2aWV3cG9ydCBvciByZXN0b3JlIGlmIHJlc2l6ZWRcclxuXHRcdHRvZ2dsZTogZnVuY3Rpb24gKCBhY3Rpb24gKSB7XHJcblx0XHRcdGlmIChGLmlzT3Blbikge1xyXG5cdFx0XHRcdEYuY3VycmVudC5maXRUb1ZpZXcgPSAkLnR5cGUoYWN0aW9uKSA9PT0gXCJib29sZWFuXCIgPyBhY3Rpb24gOiAhRi5jdXJyZW50LmZpdFRvVmlldztcclxuXHJcblx0XHRcdFx0Ly8gSGVscCBicm93c2VyIHRvIHJlc3RvcmUgZG9jdW1lbnQgZGltZW5zaW9uc1xyXG5cdFx0XHRcdGlmIChpc1RvdWNoKSB7XHJcblx0XHRcdFx0XHRGLndyYXAucmVtb3ZlQXR0cignc3R5bGUnKS5hZGRDbGFzcygnZmFuY3lib3gtdG1wJyk7XHJcblxyXG5cdFx0XHRcdFx0Ri50cmlnZ2VyKCdvblVwZGF0ZScpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ri51cGRhdGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRoaWRlTG9hZGluZzogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRELnVuYmluZCgnLmxvYWRpbmcnKTtcclxuXHJcblx0XHRcdCQoJyNmYW5jeWJveC1sb2FkaW5nJykucmVtb3ZlKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNob3dMb2FkaW5nOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBlbCwgdmlld3BvcnQ7XHJcblxyXG5cdFx0XHRGLmhpZGVMb2FkaW5nKCk7XHJcblxyXG5cdFx0XHRlbCA9ICQoJzxkaXYgaWQ9XCJmYW5jeWJveC1sb2FkaW5nXCI+PGRpdj48L2Rpdj48L2Rpdj4nKS5jbGljayhGLmNhbmNlbCkuYXBwZW5kVG8oJ2JvZHknKTtcclxuXHJcblx0XHRcdC8vIElmIHVzZXIgd2lsbCBwcmVzcyB0aGUgZXNjYXBlLWJ1dHRvbiwgdGhlIHJlcXVlc3Qgd2lsbCBiZSBjYW5jZWxlZFxyXG5cdFx0XHRELmJpbmQoJ2tleWRvd24ubG9hZGluZycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRpZiAoKGUud2hpY2ggfHwgZS5rZXlDb2RlKSA9PT0gMjcpIHtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0XHRGLmNhbmNlbCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAoIUYuZGVmYXVsdHMuZml4ZWQpIHtcclxuXHRcdFx0XHR2aWV3cG9ydCA9IEYuZ2V0Vmlld3BvcnQoKTtcclxuXHJcblx0XHRcdFx0ZWwuY3NzKHtcclxuXHRcdFx0XHRcdHBvc2l0aW9uIDogJ2Fic29sdXRlJyxcclxuXHRcdFx0XHRcdHRvcCAgOiAodmlld3BvcnQuaCAqIDAuNSkgKyB2aWV3cG9ydC55LFxyXG5cdFx0XHRcdFx0bGVmdCA6ICh2aWV3cG9ydC53ICogMC41KSArIHZpZXdwb3J0LnhcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRWaWV3cG9ydDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgbG9ja2VkID0gKEYuY3VycmVudCAmJiBGLmN1cnJlbnQubG9ja2VkKSB8fCBmYWxzZSxcclxuXHRcdFx0XHRyZXogICAgPSB7XHJcblx0XHRcdFx0XHR4OiBXLnNjcm9sbExlZnQoKSxcclxuXHRcdFx0XHRcdHk6IFcuc2Nyb2xsVG9wKClcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKGxvY2tlZCkge1xyXG5cdFx0XHRcdHJlei53ID0gbG9ja2VkWzBdLmNsaWVudFdpZHRoO1xyXG5cdFx0XHRcdHJlei5oID0gbG9ja2VkWzBdLmNsaWVudEhlaWdodDtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gU2VlIGh0dHA6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzY3MjRcclxuXHRcdFx0XHRyZXoudyA9IGlzVG91Y2ggJiYgd2luZG93LmlubmVyV2lkdGggID8gd2luZG93LmlubmVyV2lkdGggIDogVy53aWR0aCgpO1xyXG5cdFx0XHRcdHJlei5oID0gaXNUb3VjaCAmJiB3aW5kb3cuaW5uZXJIZWlnaHQgPyB3aW5kb3cuaW5uZXJIZWlnaHQgOiBXLmhlaWdodCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gcmV6O1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBVbmJpbmQgdGhlIGtleWJvYXJkIC8gY2xpY2tpbmcgYWN0aW9uc1xyXG5cdFx0dW5iaW5kRXZlbnRzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmIChGLndyYXAgJiYgaXNRdWVyeShGLndyYXApKSB7XHJcblx0XHRcdFx0Ri53cmFwLnVuYmluZCgnLmZiJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEQudW5iaW5kKCcuZmInKTtcclxuXHRcdFx0Vy51bmJpbmQoJy5mYicpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRiaW5kRXZlbnRzOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBjdXJyZW50ID0gRi5jdXJyZW50LFxyXG5cdFx0XHRcdGtleXM7XHJcblxyXG5cdFx0XHRpZiAoIWN1cnJlbnQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENoYW5naW5nIGRvY3VtZW50IGhlaWdodCBvbiBpT1MgZGV2aWNlcyB0cmlnZ2VycyBhICdyZXNpemUnIGV2ZW50LFxyXG5cdFx0XHQvLyB0aGF0IGNhbiBjaGFuZ2UgZG9jdW1lbnQgaGVpZ2h0Li4uIHJlcGVhdGluZyBpbmZpbml0ZWx5XHJcblx0XHRcdFcuYmluZCgnb3JpZW50YXRpb25jaGFuZ2UuZmInICsgKGlzVG91Y2ggPyAnJyA6ICcgcmVzaXplLmZiJykgKyAoY3VycmVudC5hdXRvQ2VudGVyICYmICFjdXJyZW50LmxvY2tlZCA/ICcgc2Nyb2xsLmZiJyA6ICcnKSwgRi51cGRhdGUpO1xyXG5cclxuXHRcdFx0a2V5cyA9IGN1cnJlbnQua2V5cztcclxuXHJcblx0XHRcdGlmIChrZXlzKSB7XHJcblx0XHRcdFx0RC5iaW5kKCdrZXlkb3duLmZiJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0XHRcdHZhciBjb2RlICAgPSBlLndoaWNoIHx8IGUua2V5Q29kZSxcclxuXHRcdFx0XHRcdFx0dGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG5cclxuXHRcdFx0XHRcdC8vIFNraXAgZXNjIGtleSBpZiBsb2FkaW5nLCBiZWNhdXNlIHNob3dMb2FkaW5nIHdpbGwgY2FuY2VsIHByZWxvYWRpbmdcclxuXHRcdFx0XHRcdGlmIChjb2RlID09PSAyNyAmJiBGLmNvbWluZykge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gSWdub3JlIGtleSBjb21iaW5hdGlvbnMgYW5kIGtleSBldmVudHMgd2l0aGluIGZvcm0gZWxlbWVudHNcclxuXHRcdFx0XHRcdGlmICghZS5jdHJsS2V5ICYmICFlLmFsdEtleSAmJiAhZS5zaGlmdEtleSAmJiAhZS5tZXRhS2V5ICYmICEodGFyZ2V0ICYmICh0YXJnZXQudHlwZSB8fCAkKHRhcmdldCkuaXMoJ1tjb250ZW50ZWRpdGFibGVdJykpKSkge1xyXG5cdFx0XHRcdFx0XHQkLmVhY2goa2V5cywgZnVuY3Rpb24oaSwgdmFsKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGN1cnJlbnQuZ3JvdXAubGVuZ3RoID4gMSAmJiB2YWxbIGNvZGUgXSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRGWyBpIF0oIHZhbFsgY29kZSBdICk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCQuaW5BcnJheShjb2RlLCB2YWwpID4gLTEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdEZbIGkgXSAoKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCQuZm4ubW91c2V3aGVlbCAmJiBjdXJyZW50Lm1vdXNlV2hlZWwpIHtcclxuXHRcdFx0XHRGLndyYXAuYmluZCgnbW91c2V3aGVlbC5mYicsIGZ1bmN0aW9uIChlLCBkZWx0YSwgZGVsdGFYLCBkZWx0YVkpIHtcclxuXHRcdFx0XHRcdHZhciB0YXJnZXQgPSBlLnRhcmdldCB8fCBudWxsLFxyXG5cdFx0XHRcdFx0XHRwYXJlbnQgPSAkKHRhcmdldCksXHJcblx0XHRcdFx0XHRcdGNhblNjcm9sbCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRcdHdoaWxlIChwYXJlbnQubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjYW5TY3JvbGwgfHwgcGFyZW50LmlzKCcuZmFuY3lib3gtc2tpbicpIHx8IHBhcmVudC5pcygnLmZhbmN5Ym94LXdyYXAnKSkge1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRjYW5TY3JvbGwgPSBpc1Njcm9sbGFibGUoIHBhcmVudFswXSApO1xyXG5cdFx0XHRcdFx0XHRwYXJlbnQgICAgPSAkKHBhcmVudCkucGFyZW50KCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKGRlbHRhICE9PSAwICYmICFjYW5TY3JvbGwpIHtcclxuXHRcdFx0XHRcdFx0aWYgKEYuZ3JvdXAubGVuZ3RoID4gMSAmJiAhY3VycmVudC5jYW5TaHJpbmspIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZGVsdGFZID4gMCB8fCBkZWx0YVggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRGLnByZXYoIGRlbHRhWSA+IDAgPyAnZG93bicgOiAnbGVmdCcgKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChkZWx0YVkgPCAwIHx8IGRlbHRhWCA8IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdEYubmV4dCggZGVsdGFZIDwgMCA/ICd1cCcgOiAncmlnaHQnICk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHR0cmlnZ2VyOiBmdW5jdGlvbiAoZXZlbnQsIG8pIHtcclxuXHRcdFx0dmFyIHJldCwgb2JqID0gbyB8fCBGLmNvbWluZyB8fCBGLmN1cnJlbnQ7XHJcblxyXG5cdFx0XHRpZiAoIW9iaikge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCQuaXNGdW5jdGlvbiggb2JqW2V2ZW50XSApKSB7XHJcblx0XHRcdFx0cmV0ID0gb2JqW2V2ZW50XS5hcHBseShvYmosIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocmV0ID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG9iai5oZWxwZXJzKSB7XHJcblx0XHRcdFx0JC5lYWNoKG9iai5oZWxwZXJzLCBmdW5jdGlvbiAoaGVscGVyLCBvcHRzKSB7XHJcblx0XHRcdFx0XHRpZiAob3B0cyAmJiBGLmhlbHBlcnNbaGVscGVyXSAmJiAkLmlzRnVuY3Rpb24oRi5oZWxwZXJzW2hlbHBlcl1bZXZlbnRdKSkge1xyXG5cdFx0XHRcdFx0XHRGLmhlbHBlcnNbaGVscGVyXVtldmVudF0oJC5leHRlbmQodHJ1ZSwge30sIEYuaGVscGVyc1toZWxwZXJdLmRlZmF1bHRzLCBvcHRzKSwgb2JqKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0RC50cmlnZ2VyKGV2ZW50KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0aXNJbWFnZTogZnVuY3Rpb24gKHN0cikge1xyXG5cdFx0XHRyZXR1cm4gaXNTdHJpbmcoc3RyKSAmJiBzdHIubWF0Y2goLyheZGF0YTppbWFnZVxcLy4qLCl8KFxcLihqcChlfGd8ZWcpfGdpZnxwbmd8Ym1wfHdlYnB8c3ZnKSgoXFw/fCMpLiopPyQpL2kpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRpc1NXRjogZnVuY3Rpb24gKHN0cikge1xyXG5cdFx0XHRyZXR1cm4gaXNTdHJpbmcoc3RyKSAmJiBzdHIubWF0Y2goL1xcLihzd2YpKChcXD98IykuKik/JC9pKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0X3N0YXJ0OiBmdW5jdGlvbiAoaW5kZXgpIHtcclxuXHRcdFx0dmFyIGNvbWluZyA9IHt9LFxyXG5cdFx0XHRcdG9iaixcclxuXHRcdFx0XHRocmVmLFxyXG5cdFx0XHRcdHR5cGUsXHJcblx0XHRcdFx0bWFyZ2luLFxyXG5cdFx0XHRcdHBhZGRpbmc7XHJcblxyXG5cdFx0XHRpbmRleCA9IGdldFNjYWxhciggaW5kZXggKTtcclxuXHRcdFx0b2JqICAgPSBGLmdyb3VwWyBpbmRleCBdIHx8IG51bGw7XHJcblxyXG5cdFx0XHRpZiAoIW9iaikge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29taW5nID0gJC5leHRlbmQodHJ1ZSwge30sIEYub3B0cywgb2JqKTtcclxuXHJcblx0XHRcdC8vIENvbnZlcnQgbWFyZ2luIGFuZCBwYWRkaW5nIHByb3BlcnRpZXMgdG8gYXJyYXkgLSB0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnRcclxuXHRcdFx0bWFyZ2luICA9IGNvbWluZy5tYXJnaW47XHJcblx0XHRcdHBhZGRpbmcgPSBjb21pbmcucGFkZGluZztcclxuXHJcblx0XHRcdGlmICgkLnR5cGUobWFyZ2luKSA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRjb21pbmcubWFyZ2luID0gW21hcmdpbiwgbWFyZ2luLCBtYXJnaW4sIG1hcmdpbl07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICgkLnR5cGUocGFkZGluZykgPT09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0Y29taW5nLnBhZGRpbmcgPSBbcGFkZGluZywgcGFkZGluZywgcGFkZGluZywgcGFkZGluZ107XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vICdtb2RhbCcgcHJvcGVyeSBpcyBqdXN0IGEgc2hvcnRjdXRcclxuXHRcdFx0aWYgKGNvbWluZy5tb2RhbCkge1xyXG5cdFx0XHRcdCQuZXh0ZW5kKHRydWUsIGNvbWluZywge1xyXG5cdFx0XHRcdFx0Y2xvc2VCdG4gICA6IGZhbHNlLFxyXG5cdFx0XHRcdFx0Y2xvc2VDbGljayA6IGZhbHNlLFxyXG5cdFx0XHRcdFx0bmV4dENsaWNrICA6IGZhbHNlLFxyXG5cdFx0XHRcdFx0YXJyb3dzICAgICA6IGZhbHNlLFxyXG5cdFx0XHRcdFx0bW91c2VXaGVlbCA6IGZhbHNlLFxyXG5cdFx0XHRcdFx0a2V5cyAgICAgICA6IG51bGwsXHJcblx0XHRcdFx0XHRoZWxwZXJzOiB7XHJcblx0XHRcdFx0XHRcdG92ZXJsYXkgOiB7XHJcblx0XHRcdFx0XHRcdFx0Y2xvc2VDbGljayA6IGZhbHNlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gJ2F1dG9TaXplJyBwcm9wZXJ0eSBpcyBhIHNob3J0Y3V0LCB0b29cclxuXHRcdFx0aWYgKGNvbWluZy5hdXRvU2l6ZSkge1xyXG5cdFx0XHRcdGNvbWluZy5hdXRvV2lkdGggPSBjb21pbmcuYXV0b0hlaWdodCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjb21pbmcud2lkdGggPT09ICdhdXRvJykge1xyXG5cdFx0XHRcdGNvbWluZy5hdXRvV2lkdGggPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoY29taW5nLmhlaWdodCA9PT0gJ2F1dG8nKSB7XHJcblx0XHRcdFx0Y29taW5nLmF1dG9IZWlnaHQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBBZGQgcmVmZXJlbmNlIHRvIHRoZSBncm91cCwgc28gaXRgcyBwb3NzaWJsZSB0byBhY2Nlc3MgZnJvbSBjYWxsYmFja3MsIGV4YW1wbGU6XHJcblx0XHRcdCAqIGFmdGVyTG9hZCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQgKiAgICAgdGhpcy50aXRsZSA9ICdJbWFnZSAnICsgKHRoaXMuaW5kZXggKyAxKSArICcgb2YgJyArIHRoaXMuZ3JvdXAubGVuZ3RoICsgKHRoaXMudGl0bGUgPyAnIC0gJyArIHRoaXMudGl0bGUgOiAnJyk7XHJcblx0XHRcdCAqIH1cclxuXHRcdFx0ICovXHJcblxyXG5cdFx0XHRjb21pbmcuZ3JvdXAgID0gRi5ncm91cDtcclxuXHRcdFx0Y29taW5nLmluZGV4ICA9IGluZGV4O1xyXG5cclxuXHRcdFx0Ly8gR2l2ZSBhIGNoYW5jZSBmb3IgY2FsbGJhY2sgb3IgaGVscGVycyB0byB1cGRhdGUgY29taW5nIGl0ZW0gKHR5cGUsIHRpdGxlLCBldGMpXHJcblx0XHRcdEYuY29taW5nID0gY29taW5nO1xyXG5cclxuXHRcdFx0aWYgKGZhbHNlID09PSBGLnRyaWdnZXIoJ2JlZm9yZUxvYWQnKSkge1xyXG5cdFx0XHRcdEYuY29taW5nID0gbnVsbDtcclxuXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0eXBlID0gY29taW5nLnR5cGU7XHJcblx0XHRcdGhyZWYgPSBjb21pbmcuaHJlZjtcclxuXHJcblx0XHRcdGlmICghdHlwZSkge1xyXG5cdFx0XHRcdEYuY29taW5nID0gbnVsbDtcclxuXHJcblx0XHRcdFx0Ly9JZiB3ZSBjYW4gbm90IGRldGVybWluZSBjb250ZW50IHR5cGUgdGhlbiBkcm9wIHNpbGVudGx5IG9yIGRpc3BsYXkgbmV4dC9wcmV2IGl0ZW0gaWYgbG9vcGluZyB0aHJvdWdoIGdhbGxlcnlcclxuXHRcdFx0XHRpZiAoRi5jdXJyZW50ICYmIEYucm91dGVyICYmIEYucm91dGVyICE9PSAnanVtcHRvJykge1xyXG5cdFx0XHRcdFx0Ri5jdXJyZW50LmluZGV4ID0gaW5kZXg7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIEZbIEYucm91dGVyIF0oIEYuZGlyZWN0aW9uICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEYuaXNBY3RpdmUgPSB0cnVlO1xyXG5cclxuXHRcdFx0aWYgKHR5cGUgPT09ICdpbWFnZScgfHwgdHlwZSA9PT0gJ3N3ZicpIHtcclxuXHRcdFx0XHRjb21pbmcuYXV0b0hlaWdodCA9IGNvbWluZy5hdXRvV2lkdGggPSBmYWxzZTtcclxuXHRcdFx0XHRjb21pbmcuc2Nyb2xsaW5nICA9ICd2aXNpYmxlJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHR5cGUgPT09ICdpbWFnZScpIHtcclxuXHRcdFx0XHRjb21pbmcuYXNwZWN0UmF0aW8gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodHlwZSA9PT0gJ2lmcmFtZScgJiYgaXNUb3VjaCkge1xyXG5cdFx0XHRcdGNvbWluZy5zY3JvbGxpbmcgPSAnc2Nyb2xsJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQnVpbGQgdGhlIG5lY2Nlc3NhcnkgbWFya3VwXHJcblx0XHRcdGNvbWluZy53cmFwID0gJChjb21pbmcudHBsLndyYXApLmFkZENsYXNzKCdmYW5jeWJveC0nICsgKGlzVG91Y2ggPyAnbW9iaWxlJyA6ICdkZXNrdG9wJykgKyAnIGZhbmN5Ym94LXR5cGUtJyArIHR5cGUgKyAnIGZhbmN5Ym94LXRtcCAnICsgY29taW5nLndyYXBDU1MpLmFwcGVuZFRvKCBjb21pbmcucGFyZW50IHx8ICdib2R5JyApO1xyXG5cclxuXHRcdFx0JC5leHRlbmQoY29taW5nLCB7XHJcblx0XHRcdFx0c2tpbiAgOiAkKCcuZmFuY3lib3gtc2tpbicsICBjb21pbmcud3JhcCksXHJcblx0XHRcdFx0b3V0ZXIgOiAkKCcuZmFuY3lib3gtb3V0ZXInLCBjb21pbmcud3JhcCksXHJcblx0XHRcdFx0aW5uZXIgOiAkKCcuZmFuY3lib3gtaW5uZXInLCBjb21pbmcud3JhcClcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkLmVhY2goW1wiVG9wXCIsIFwiUmlnaHRcIiwgXCJCb3R0b21cIiwgXCJMZWZ0XCJdLCBmdW5jdGlvbihpLCB2KSB7XHJcblx0XHRcdFx0Y29taW5nLnNraW4uY3NzKCdwYWRkaW5nJyArIHYsIGdldFZhbHVlKGNvbWluZy5wYWRkaW5nWyBpIF0pKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRGLnRyaWdnZXIoJ29uUmVhZHknKTtcclxuXHJcblx0XHRcdC8vIENoZWNrIGJlZm9yZSB0cnkgdG8gbG9hZDsgJ2lubGluZScgYW5kICdodG1sJyB0eXBlcyBuZWVkIGNvbnRlbnQsIG90aGVycyAtIGhyZWZcclxuXHRcdFx0aWYgKHR5cGUgPT09ICdpbmxpbmUnIHx8IHR5cGUgPT09ICdodG1sJykge1xyXG5cdFx0XHRcdGlmICghY29taW5nLmNvbnRlbnQgfHwgIWNvbWluZy5jb250ZW50Lmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIEYuX2Vycm9yKCAnY29udGVudCcgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCFocmVmKSB7XHJcblx0XHRcdFx0cmV0dXJuIEYuX2Vycm9yKCAnaHJlZicgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHR5cGUgPT09ICdpbWFnZScpIHtcclxuXHRcdFx0XHRGLl9sb2FkSW1hZ2UoKTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ2FqYXgnKSB7XHJcblx0XHRcdFx0Ri5fbG9hZEFqYXgoKTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ2lmcmFtZScpIHtcclxuXHRcdFx0XHRGLl9sb2FkSWZyYW1lKCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEYuX2FmdGVyTG9hZCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdF9lcnJvcjogZnVuY3Rpb24gKCB0eXBlICkge1xyXG5cdFx0XHQkLmV4dGVuZChGLmNvbWluZywge1xyXG5cdFx0XHRcdHR5cGUgICAgICAgOiAnaHRtbCcsXHJcblx0XHRcdFx0YXV0b1dpZHRoICA6IHRydWUsXHJcblx0XHRcdFx0YXV0b0hlaWdodCA6IHRydWUsXHJcblx0XHRcdFx0bWluV2lkdGggICA6IDAsXHJcblx0XHRcdFx0bWluSGVpZ2h0ICA6IDAsXHJcblx0XHRcdFx0c2Nyb2xsaW5nICA6ICdubycsXHJcblx0XHRcdFx0aGFzRXJyb3IgICA6IHR5cGUsXHJcblx0XHRcdFx0Y29udGVudCAgICA6IEYuY29taW5nLnRwbC5lcnJvclxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdEYuX2FmdGVyTG9hZCgpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRfbG9hZEltYWdlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdC8vIFJlc2V0IHByZWxvYWQgaW1hZ2Ugc28gaXQgaXMgbGF0ZXIgcG9zc2libGUgdG8gY2hlY2sgXCJjb21wbGV0ZVwiIHByb3BlcnR5XHJcblx0XHRcdHZhciBpbWcgPSBGLmltZ1ByZWxvYWQgPSBuZXcgSW1hZ2UoKTtcclxuXHJcblx0XHRcdGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy5vbmxvYWQgPSB0aGlzLm9uZXJyb3IgPSBudWxsO1xyXG5cclxuXHRcdFx0XHRGLmNvbWluZy53aWR0aCAgPSB0aGlzLndpZHRoIC8gRi5vcHRzLnBpeGVsUmF0aW87XHJcblx0XHRcdFx0Ri5jb21pbmcuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgLyBGLm9wdHMucGl4ZWxSYXRpbztcclxuXHJcblx0XHRcdFx0Ri5fYWZ0ZXJMb2FkKCk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpbWcub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLm9ubG9hZCA9IHRoaXMub25lcnJvciA9IG51bGw7XHJcblxyXG5cdFx0XHRcdEYuX2Vycm9yKCAnaW1hZ2UnICk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpbWcuc3JjID0gRi5jb21pbmcuaHJlZjtcclxuXHJcblx0XHRcdGlmIChpbWcuY29tcGxldGUgIT09IHRydWUpIHtcclxuXHRcdFx0XHRGLnNob3dMb2FkaW5nKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0X2xvYWRBamF4OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBjb21pbmcgPSBGLmNvbWluZztcclxuXHJcblx0XHRcdEYuc2hvd0xvYWRpbmcoKTtcclxuXHJcblx0XHRcdEYuYWpheExvYWQgPSAkLmFqYXgoJC5leHRlbmQoe30sIGNvbWluZy5hamF4LCB7XHJcblx0XHRcdFx0dXJsOiBjb21pbmcuaHJlZixcclxuXHRcdFx0XHRlcnJvcjogZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzKSB7XHJcblx0XHRcdFx0XHRpZiAoRi5jb21pbmcgJiYgdGV4dFN0YXR1cyAhPT0gJ2Fib3J0Jykge1xyXG5cdFx0XHRcdFx0XHRGLl9lcnJvciggJ2FqYXgnLCBqcVhIUiApO1xyXG5cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdEYuaGlkZUxvYWRpbmcoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCB0ZXh0U3RhdHVzKSB7XHJcblx0XHRcdFx0XHRpZiAodGV4dFN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcblx0XHRcdFx0XHRcdGNvbWluZy5jb250ZW50ID0gZGF0YTtcclxuXHJcblx0XHRcdFx0XHRcdEYuX2FmdGVyTG9hZCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRfbG9hZElmcmFtZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBjb21pbmcgPSBGLmNvbWluZyxcclxuXHRcdFx0XHRpZnJhbWUgPSAkKGNvbWluZy50cGwuaWZyYW1lLnJlcGxhY2UoL1xce3JuZFxcfS9nLCBuZXcgRGF0ZSgpLmdldFRpbWUoKSkpXHJcblx0XHRcdFx0XHQuYXR0cignc2Nyb2xsaW5nJywgaXNUb3VjaCA/ICdhdXRvJyA6IGNvbWluZy5pZnJhbWUuc2Nyb2xsaW5nKVxyXG5cdFx0XHRcdFx0LmF0dHIoJ3NyYycsIGNvbWluZy5ocmVmKTtcclxuXHJcblx0XHRcdC8vIFRoaXMgaGVscHMgSUVcclxuXHRcdFx0JChjb21pbmcud3JhcCkuYmluZCgnb25SZXNldCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5maW5kKCdpZnJhbWUnKS5oaWRlKCkuYXR0cignc3JjJywgJy8vYWJvdXQ6YmxhbmsnKS5lbmQoKS5lbXB0eSgpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYgKGNvbWluZy5pZnJhbWUucHJlbG9hZCkge1xyXG5cdFx0XHRcdEYuc2hvd0xvYWRpbmcoKTtcclxuXHJcblx0XHRcdFx0aWZyYW1lLm9uZSgnbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKCdyZWFkeScsIDEpO1xyXG5cclxuXHRcdFx0XHRcdC8vIGlPUyB3aWxsIGxvc2Ugc2Nyb2xsaW5nIGlmIHdlIHJlc2l6ZVxyXG5cdFx0XHRcdFx0aWYgKCFpc1RvdWNoKSB7XHJcblx0XHRcdFx0XHRcdCQodGhpcykuYmluZCgnbG9hZC5mYicsIEYudXBkYXRlKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBXaXRob3V0IHRoaXMgdHJpY2s6XHJcblx0XHRcdFx0XHQvLyAgIC0gaWZyYW1lIHdvbid0IHNjcm9sbCBvbiBpT1MgZGV2aWNlc1xyXG5cdFx0XHRcdFx0Ly8gICAtIElFNyBzb21ldGltZXMgZGlzcGxheXMgZW1wdHkgaWZyYW1lXHJcblx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudHMoJy5mYW5jeWJveC13cmFwJykud2lkdGgoJzEwMCUnKS5yZW1vdmVDbGFzcygnZmFuY3lib3gtdG1wJykuc2hvdygpO1xyXG5cclxuXHRcdFx0XHRcdEYuX2FmdGVyTG9hZCgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb21pbmcuY29udGVudCA9IGlmcmFtZS5hcHBlbmRUbyggY29taW5nLmlubmVyICk7XHJcblxyXG5cdFx0XHRpZiAoIWNvbWluZy5pZnJhbWUucHJlbG9hZCkge1xyXG5cdFx0XHRcdEYuX2FmdGVyTG9hZCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdF9wcmVsb2FkSW1hZ2VzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGdyb3VwICAgPSBGLmdyb3VwLFxyXG5cdFx0XHRcdGN1cnJlbnQgPSBGLmN1cnJlbnQsXHJcblx0XHRcdFx0bGVuICAgICA9IGdyb3VwLmxlbmd0aCxcclxuXHRcdFx0XHRjbnQgICAgID0gY3VycmVudC5wcmVsb2FkID8gTWF0aC5taW4oY3VycmVudC5wcmVsb2FkLCBsZW4gLSAxKSA6IDAsXHJcblx0XHRcdFx0aXRlbSxcclxuXHRcdFx0XHRpO1xyXG5cclxuXHRcdFx0Zm9yIChpID0gMTsgaSA8PSBjbnQ7IGkgKz0gMSkge1xyXG5cdFx0XHRcdGl0ZW0gPSBncm91cFsgKGN1cnJlbnQuaW5kZXggKyBpICkgJSBsZW4gXTtcclxuXHJcblx0XHRcdFx0aWYgKGl0ZW0udHlwZSA9PT0gJ2ltYWdlJyAmJiBpdGVtLmhyZWYpIHtcclxuXHRcdFx0XHRcdG5ldyBJbWFnZSgpLnNyYyA9IGl0ZW0uaHJlZjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0X2FmdGVyTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgY29taW5nICAgPSBGLmNvbWluZyxcclxuXHRcdFx0XHRwcmV2aW91cyA9IEYuY3VycmVudCxcclxuXHRcdFx0XHRwbGFjZWhvbGRlciA9ICdmYW5jeWJveC1wbGFjZWhvbGRlcicsXHJcblx0XHRcdFx0Y3VycmVudCxcclxuXHRcdFx0XHRjb250ZW50LFxyXG5cdFx0XHRcdHR5cGUsXHJcblx0XHRcdFx0c2Nyb2xsaW5nLFxyXG5cdFx0XHRcdGhyZWYsXHJcblx0XHRcdFx0ZW1iZWQ7XHJcblxyXG5cdFx0XHRGLmhpZGVMb2FkaW5nKCk7XHJcblxyXG5cdFx0XHRpZiAoIWNvbWluZyB8fCBGLmlzQWN0aXZlID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGZhbHNlID09PSBGLnRyaWdnZXIoJ2FmdGVyTG9hZCcsIGNvbWluZywgcHJldmlvdXMpKSB7XHJcblx0XHRcdFx0Y29taW5nLndyYXAuc3RvcCh0cnVlKS50cmlnZ2VyKCdvblJlc2V0JykucmVtb3ZlKCk7XHJcblxyXG5cdFx0XHRcdEYuY29taW5nID0gbnVsbDtcclxuXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocHJldmlvdXMpIHtcclxuXHRcdFx0XHRGLnRyaWdnZXIoJ2JlZm9yZUNoYW5nZScsIHByZXZpb3VzKTtcclxuXHJcblx0XHRcdFx0cHJldmlvdXMud3JhcC5zdG9wKHRydWUpLnJlbW92ZUNsYXNzKCdmYW5jeWJveC1vcGVuZWQnKVxyXG5cdFx0XHRcdFx0LmZpbmQoJy5mYW5jeWJveC1pdGVtLCAuZmFuY3lib3gtbmF2JylcclxuXHRcdFx0XHRcdC5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ri51bmJpbmRFdmVudHMoKTtcclxuXHJcblx0XHRcdGN1cnJlbnQgICA9IGNvbWluZztcclxuXHRcdFx0Y29udGVudCAgID0gY29taW5nLmNvbnRlbnQ7XHJcblx0XHRcdHR5cGUgICAgICA9IGNvbWluZy50eXBlO1xyXG5cdFx0XHRzY3JvbGxpbmcgPSBjb21pbmcuc2Nyb2xsaW5nO1xyXG5cclxuXHRcdFx0JC5leHRlbmQoRiwge1xyXG5cdFx0XHRcdHdyYXAgIDogY3VycmVudC53cmFwLFxyXG5cdFx0XHRcdHNraW4gIDogY3VycmVudC5za2luLFxyXG5cdFx0XHRcdG91dGVyIDogY3VycmVudC5vdXRlcixcclxuXHRcdFx0XHRpbm5lciA6IGN1cnJlbnQuaW5uZXIsXHJcblx0XHRcdFx0Y3VycmVudCAgOiBjdXJyZW50LFxyXG5cdFx0XHRcdHByZXZpb3VzIDogcHJldmlvdXNcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRocmVmID0gY3VycmVudC5ocmVmO1xyXG5cclxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XHJcblx0XHRcdFx0Y2FzZSAnaW5saW5lJzpcclxuXHRcdFx0XHRjYXNlICdhamF4JzpcclxuXHRcdFx0XHRjYXNlICdodG1sJzpcclxuXHRcdFx0XHRcdGlmIChjdXJyZW50LnNlbGVjdG9yKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQgPSAkKCc8ZGl2PicpLmh0bWwoY29udGVudCkuZmluZChjdXJyZW50LnNlbGVjdG9yKTtcclxuXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGlzUXVlcnkoY29udGVudCkpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCFjb250ZW50LmRhdGEocGxhY2Vob2xkZXIpKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29udGVudC5kYXRhKHBsYWNlaG9sZGVyLCAkKCc8ZGl2IGNsYXNzPVwiJyArIHBsYWNlaG9sZGVyICsgJ1wiPjwvZGl2PicpLmluc2VydEFmdGVyKCBjb250ZW50ICkuaGlkZSgpICk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGNvbnRlbnQgPSBjb250ZW50LnNob3coKS5kZXRhY2goKTtcclxuXHJcblx0XHRcdFx0XHRcdGN1cnJlbnQud3JhcC5iaW5kKCdvblJlc2V0JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICgkKHRoaXMpLmZpbmQoY29udGVudCkubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjb250ZW50LmhpZGUoKS5yZXBsYWNlQWxsKCBjb250ZW50LmRhdGEocGxhY2Vob2xkZXIpICkuZGF0YShwbGFjZWhvbGRlciwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgJ2ltYWdlJzpcclxuXHRcdFx0XHRcdGNvbnRlbnQgPSBjdXJyZW50LnRwbC5pbWFnZS5yZXBsYWNlKCd7aHJlZn0nLCBocmVmKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnc3dmJzpcclxuXHRcdFx0XHRcdGNvbnRlbnQgPSAnPG9iamVjdCBpZD1cImZhbmN5Ym94LXN3ZlwiIGNsYXNzaWQ9XCJjbHNpZDpEMjdDREI2RS1BRTZELTExY2YtOTZCOC00NDQ1NTM1NDAwMDBcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCI+PHBhcmFtIG5hbWU9XCJtb3ZpZVwiIHZhbHVlPVwiJyArIGhyZWYgKyAnXCI+PC9wYXJhbT4nO1xyXG5cdFx0XHRcdFx0ZW1iZWQgICA9ICcnO1xyXG5cclxuXHRcdFx0XHRcdCQuZWFjaChjdXJyZW50LnN3ZiwgZnVuY3Rpb24obmFtZSwgdmFsKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQgKz0gJzxwYXJhbSBuYW1lPVwiJyArIG5hbWUgKyAnXCIgdmFsdWU9XCInICsgdmFsICsgJ1wiPjwvcGFyYW0+JztcclxuXHRcdFx0XHRcdFx0ZW1iZWQgICArPSAnICcgKyBuYW1lICsgJz1cIicgKyB2YWwgKyAnXCInO1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0Y29udGVudCArPSAnPGVtYmVkIHNyYz1cIicgKyBocmVmICsgJ1wiIHR5cGU9XCJhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIicgKyBlbWJlZCArICc+PC9lbWJlZD48L29iamVjdD4nO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIShpc1F1ZXJ5KGNvbnRlbnQpICYmIGNvbnRlbnQucGFyZW50KCkuaXMoY3VycmVudC5pbm5lcikpKSB7XHJcblx0XHRcdFx0Y3VycmVudC5pbm5lci5hcHBlbmQoIGNvbnRlbnQgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gR2l2ZSBhIGNoYW5jZSBmb3IgaGVscGVycyBvciBjYWxsYmFja3MgdG8gdXBkYXRlIGVsZW1lbnRzXHJcblx0XHRcdEYudHJpZ2dlcignYmVmb3JlU2hvdycpO1xyXG5cclxuXHRcdFx0Ly8gU2V0IHNjcm9sbGluZyBiZWZvcmUgY2FsY3VsYXRpbmcgZGltZW5zaW9uc1xyXG5cdFx0XHRjdXJyZW50LmlubmVyLmNzcygnb3ZlcmZsb3cnLCBzY3JvbGxpbmcgPT09ICd5ZXMnID8gJ3Njcm9sbCcgOiAoc2Nyb2xsaW5nID09PSAnbm8nID8gJ2hpZGRlbicgOiBzY3JvbGxpbmcpKTtcclxuXHJcblx0XHRcdC8vIFNldCBpbml0aWFsIGRpbWVuc2lvbnMgYW5kIHN0YXJ0IHBvc2l0aW9uXHJcblx0XHRcdEYuX3NldERpbWVuc2lvbigpO1xyXG5cclxuXHRcdFx0Ri5yZXBvc2l0aW9uKCk7XHJcblxyXG5cdFx0XHRGLmlzT3BlbiA9IGZhbHNlO1xyXG5cdFx0XHRGLmNvbWluZyA9IG51bGw7XHJcblxyXG5cdFx0XHRGLmJpbmRFdmVudHMoKTtcclxuXHJcblx0XHRcdGlmICghRi5pc09wZW5lZCkge1xyXG5cdFx0XHRcdCQoJy5mYW5jeWJveC13cmFwJykubm90KCBjdXJyZW50LndyYXAgKS5zdG9wKHRydWUpLnRyaWdnZXIoJ29uUmVzZXQnKS5yZW1vdmUoKTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAocHJldmlvdXMucHJldk1ldGhvZCkge1xyXG5cdFx0XHRcdEYudHJhbnNpdGlvbnNbIHByZXZpb3VzLnByZXZNZXRob2QgXSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRGLnRyYW5zaXRpb25zWyBGLmlzT3BlbmVkID8gY3VycmVudC5uZXh0TWV0aG9kIDogY3VycmVudC5vcGVuTWV0aG9kIF0oKTtcclxuXHJcblx0XHRcdEYuX3ByZWxvYWRJbWFnZXMoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0X3NldERpbWVuc2lvbjogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgdmlld3BvcnQgICA9IEYuZ2V0Vmlld3BvcnQoKSxcclxuXHRcdFx0XHRzdGVwcyAgICAgID0gMCxcclxuXHRcdFx0XHRjYW5TaHJpbmsgID0gZmFsc2UsXHJcblx0XHRcdFx0Y2FuRXhwYW5kICA9IGZhbHNlLFxyXG5cdFx0XHRcdHdyYXAgICAgICAgPSBGLndyYXAsXHJcblx0XHRcdFx0c2tpbiAgICAgICA9IEYuc2tpbixcclxuXHRcdFx0XHRpbm5lciAgICAgID0gRi5pbm5lcixcclxuXHRcdFx0XHRjdXJyZW50ICAgID0gRi5jdXJyZW50LFxyXG5cdFx0XHRcdHdpZHRoICAgICAgPSBjdXJyZW50LndpZHRoLFxyXG5cdFx0XHRcdGhlaWdodCAgICAgPSBjdXJyZW50LmhlaWdodCxcclxuXHRcdFx0XHRtaW5XaWR0aCAgID0gY3VycmVudC5taW5XaWR0aCxcclxuXHRcdFx0XHRtaW5IZWlnaHQgID0gY3VycmVudC5taW5IZWlnaHQsXHJcblx0XHRcdFx0bWF4V2lkdGggICA9IGN1cnJlbnQubWF4V2lkdGgsXHJcblx0XHRcdFx0bWF4SGVpZ2h0ICA9IGN1cnJlbnQubWF4SGVpZ2h0LFxyXG5cdFx0XHRcdHNjcm9sbGluZyAgPSBjdXJyZW50LnNjcm9sbGluZyxcclxuXHRcdFx0XHRzY3JvbGxPdXQgID0gY3VycmVudC5zY3JvbGxPdXRzaWRlID8gY3VycmVudC5zY3JvbGxiYXJXaWR0aCA6IDAsXHJcblx0XHRcdFx0bWFyZ2luICAgICA9IGN1cnJlbnQubWFyZ2luLFxyXG5cdFx0XHRcdHdNYXJnaW4gICAgPSBnZXRTY2FsYXIobWFyZ2luWzFdICsgbWFyZ2luWzNdKSxcclxuXHRcdFx0XHRoTWFyZ2luICAgID0gZ2V0U2NhbGFyKG1hcmdpblswXSArIG1hcmdpblsyXSksXHJcblx0XHRcdFx0d1BhZGRpbmcsXHJcblx0XHRcdFx0aFBhZGRpbmcsXHJcblx0XHRcdFx0d1NwYWNlLFxyXG5cdFx0XHRcdGhTcGFjZSxcclxuXHRcdFx0XHRvcmlnV2lkdGgsXHJcblx0XHRcdFx0b3JpZ0hlaWdodCxcclxuXHRcdFx0XHRvcmlnTWF4V2lkdGgsXHJcblx0XHRcdFx0b3JpZ01heEhlaWdodCxcclxuXHRcdFx0XHRyYXRpbyxcclxuXHRcdFx0XHR3aWR0aF8sXHJcblx0XHRcdFx0aGVpZ2h0XyxcclxuXHRcdFx0XHRtYXhXaWR0aF8sXHJcblx0XHRcdFx0bWF4SGVpZ2h0XyxcclxuXHRcdFx0XHRpZnJhbWUsXHJcblx0XHRcdFx0Ym9keTtcclxuXHJcblx0XHRcdC8vIFJlc2V0IGRpbWVuc2lvbnMgc28gd2UgY291bGQgcmUtY2hlY2sgYWN0dWFsIHNpemVcclxuXHRcdFx0d3JhcC5hZGQoc2tpbikuYWRkKGlubmVyKS53aWR0aCgnYXV0bycpLmhlaWdodCgnYXV0bycpLnJlbW92ZUNsYXNzKCdmYW5jeWJveC10bXAnKTtcclxuXHJcblx0XHRcdHdQYWRkaW5nID0gZ2V0U2NhbGFyKHNraW4ub3V0ZXJXaWR0aCh0cnVlKSAgLSBza2luLndpZHRoKCkpO1xyXG5cdFx0XHRoUGFkZGluZyA9IGdldFNjYWxhcihza2luLm91dGVySGVpZ2h0KHRydWUpIC0gc2tpbi5oZWlnaHQoKSk7XHJcblxyXG5cdFx0XHQvLyBBbnkgc3BhY2UgYmV0d2VlbiBjb250ZW50IGFuZCB2aWV3cG9ydCAobWFyZ2luLCBwYWRkaW5nLCBib3JkZXIsIHRpdGxlKVxyXG5cdFx0XHR3U3BhY2UgPSB3TWFyZ2luICsgd1BhZGRpbmc7XHJcblx0XHRcdGhTcGFjZSA9IGhNYXJnaW4gKyBoUGFkZGluZztcclxuXHJcblx0XHRcdG9yaWdXaWR0aCAgPSBpc1BlcmNlbnRhZ2Uod2lkdGgpICA/ICh2aWV3cG9ydC53IC0gd1NwYWNlKSAqIGdldFNjYWxhcih3aWR0aCkgIC8gMTAwIDogd2lkdGg7XHJcblx0XHRcdG9yaWdIZWlnaHQgPSBpc1BlcmNlbnRhZ2UoaGVpZ2h0KSA/ICh2aWV3cG9ydC5oIC0gaFNwYWNlKSAqIGdldFNjYWxhcihoZWlnaHQpIC8gMTAwIDogaGVpZ2h0O1xyXG5cclxuXHRcdFx0aWYgKGN1cnJlbnQudHlwZSA9PT0gJ2lmcmFtZScpIHtcclxuXHRcdFx0XHRpZnJhbWUgPSBjdXJyZW50LmNvbnRlbnQ7XHJcblxyXG5cdFx0XHRcdGlmIChjdXJyZW50LmF1dG9IZWlnaHQgJiYgaWZyYW1lLmRhdGEoJ3JlYWR5JykgPT09IDEpIHtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdGlmIChpZnJhbWVbMF0uY29udGVudFdpbmRvdy5kb2N1bWVudC5sb2NhdGlvbikge1xyXG5cdFx0XHRcdFx0XHRcdGlubmVyLndpZHRoKCBvcmlnV2lkdGggKS5oZWlnaHQoOTk5OSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGJvZHkgPSBpZnJhbWUuY29udGVudHMoKS5maW5kKCdib2R5Jyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChzY3JvbGxPdXQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGJvZHkuY3NzKCdvdmVyZmxvdy14JywgJ2hpZGRlbicpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0b3JpZ0hlaWdodCA9IGJvZHkub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudC5hdXRvV2lkdGggfHwgY3VycmVudC5hdXRvSGVpZ2h0KSB7XHJcblx0XHRcdFx0aW5uZXIuYWRkQ2xhc3MoICdmYW5jeWJveC10bXAnICk7XHJcblxyXG5cdFx0XHRcdC8vIFNldCB3aWR0aCBvciBoZWlnaHQgaW4gY2FzZSB3ZSBuZWVkIHRvIGNhbGN1bGF0ZSBvbmx5IG9uZSBkaW1lbnNpb25cclxuXHRcdFx0XHRpZiAoIWN1cnJlbnQuYXV0b1dpZHRoKSB7XHJcblx0XHRcdFx0XHRpbm5lci53aWR0aCggb3JpZ1dpZHRoICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoIWN1cnJlbnQuYXV0b0hlaWdodCkge1xyXG5cdFx0XHRcdFx0aW5uZXIuaGVpZ2h0KCBvcmlnSGVpZ2h0ICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoY3VycmVudC5hdXRvV2lkdGgpIHtcclxuXHRcdFx0XHRcdG9yaWdXaWR0aCA9IGlubmVyLndpZHRoKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoY3VycmVudC5hdXRvSGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRvcmlnSGVpZ2h0ID0gaW5uZXIuaGVpZ2h0KCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpbm5lci5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LXRtcCcgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0d2lkdGggID0gZ2V0U2NhbGFyKCBvcmlnV2lkdGggKTtcclxuXHRcdFx0aGVpZ2h0ID0gZ2V0U2NhbGFyKCBvcmlnSGVpZ2h0ICk7XHJcblxyXG5cdFx0XHRyYXRpbyAgPSBvcmlnV2lkdGggLyBvcmlnSGVpZ2h0O1xyXG5cclxuXHRcdFx0Ly8gQ2FsY3VsYXRpb25zIGZvciB0aGUgY29udGVudFxyXG5cdFx0XHRtaW5XaWR0aCAgPSBnZXRTY2FsYXIoaXNQZXJjZW50YWdlKG1pbldpZHRoKSA/IGdldFNjYWxhcihtaW5XaWR0aCwgJ3cnKSAtIHdTcGFjZSA6IG1pbldpZHRoKTtcclxuXHRcdFx0bWF4V2lkdGggID0gZ2V0U2NhbGFyKGlzUGVyY2VudGFnZShtYXhXaWR0aCkgPyBnZXRTY2FsYXIobWF4V2lkdGgsICd3JykgLSB3U3BhY2UgOiBtYXhXaWR0aCk7XHJcblxyXG5cdFx0XHRtaW5IZWlnaHQgPSBnZXRTY2FsYXIoaXNQZXJjZW50YWdlKG1pbkhlaWdodCkgPyBnZXRTY2FsYXIobWluSGVpZ2h0LCAnaCcpIC0gaFNwYWNlIDogbWluSGVpZ2h0KTtcclxuXHRcdFx0bWF4SGVpZ2h0ID0gZ2V0U2NhbGFyKGlzUGVyY2VudGFnZShtYXhIZWlnaHQpID8gZ2V0U2NhbGFyKG1heEhlaWdodCwgJ2gnKSAtIGhTcGFjZSA6IG1heEhlaWdodCk7XHJcblxyXG5cdFx0XHQvLyBUaGVzZSB3aWxsIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIHdyYXAgY2FuIGZpdCBpbiB0aGUgdmlld3BvcnRcclxuXHRcdFx0b3JpZ01heFdpZHRoICA9IG1heFdpZHRoO1xyXG5cdFx0XHRvcmlnTWF4SGVpZ2h0ID0gbWF4SGVpZ2h0O1xyXG5cclxuXHRcdFx0aWYgKGN1cnJlbnQuZml0VG9WaWV3KSB7XHJcblx0XHRcdFx0bWF4V2lkdGggID0gTWF0aC5taW4odmlld3BvcnQudyAtIHdTcGFjZSwgbWF4V2lkdGgpO1xyXG5cdFx0XHRcdG1heEhlaWdodCA9IE1hdGgubWluKHZpZXdwb3J0LmggLSBoU3BhY2UsIG1heEhlaWdodCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG1heFdpZHRoXyAgPSB2aWV3cG9ydC53IC0gd01hcmdpbjtcclxuXHRcdFx0bWF4SGVpZ2h0XyA9IHZpZXdwb3J0LmggLSBoTWFyZ2luO1xyXG5cclxuXHRcdFx0aWYgKGN1cnJlbnQuYXNwZWN0UmF0aW8pIHtcclxuXHRcdFx0XHRpZiAod2lkdGggPiBtYXhXaWR0aCkge1xyXG5cdFx0XHRcdFx0d2lkdGggID0gbWF4V2lkdGg7XHJcblx0XHRcdFx0XHRoZWlnaHQgPSBnZXRTY2FsYXIod2lkdGggLyByYXRpbyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoaGVpZ2h0ID4gbWF4SGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRoZWlnaHQgPSBtYXhIZWlnaHQ7XHJcblx0XHRcdFx0XHR3aWR0aCAgPSBnZXRTY2FsYXIoaGVpZ2h0ICogcmF0aW8pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHdpZHRoIDwgbWluV2lkdGgpIHtcclxuXHRcdFx0XHRcdHdpZHRoICA9IG1pbldpZHRoO1xyXG5cdFx0XHRcdFx0aGVpZ2h0ID0gZ2V0U2NhbGFyKHdpZHRoIC8gcmF0aW8pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGhlaWdodCA8IG1pbkhlaWdodCkge1xyXG5cdFx0XHRcdFx0aGVpZ2h0ID0gbWluSGVpZ2h0O1xyXG5cdFx0XHRcdFx0d2lkdGggID0gZ2V0U2NhbGFyKGhlaWdodCAqIHJhdGlvKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHdpZHRoID0gTWF0aC5tYXgobWluV2lkdGgsIE1hdGgubWluKHdpZHRoLCBtYXhXaWR0aCkpO1xyXG5cclxuXHRcdFx0XHRpZiAoY3VycmVudC5hdXRvSGVpZ2h0ICYmIGN1cnJlbnQudHlwZSAhPT0gJ2lmcmFtZScpIHtcclxuXHRcdFx0XHRcdGlubmVyLndpZHRoKCB3aWR0aCApO1xyXG5cclxuXHRcdFx0XHRcdGhlaWdodCA9IGlubmVyLmhlaWdodCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aGVpZ2h0ID0gTWF0aC5tYXgobWluSGVpZ2h0LCBNYXRoLm1pbihoZWlnaHQsIG1heEhlaWdodCkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBUcnkgdG8gZml0IGluc2lkZSB2aWV3cG9ydCAoaW5jbHVkaW5nIHRoZSB0aXRsZSlcclxuXHRcdFx0aWYgKGN1cnJlbnQuZml0VG9WaWV3KSB7XHJcblx0XHRcdFx0aW5uZXIud2lkdGgoIHdpZHRoICkuaGVpZ2h0KCBoZWlnaHQgKTtcclxuXHJcblx0XHRcdFx0d3JhcC53aWR0aCggd2lkdGggKyB3UGFkZGluZyApO1xyXG5cclxuXHRcdFx0XHQvLyBSZWFsIHdyYXAgZGltZW5zaW9uc1xyXG5cdFx0XHRcdHdpZHRoXyAgPSB3cmFwLndpZHRoKCk7XHJcblx0XHRcdFx0aGVpZ2h0XyA9IHdyYXAuaGVpZ2h0KCk7XHJcblxyXG5cdFx0XHRcdGlmIChjdXJyZW50LmFzcGVjdFJhdGlvKSB7XHJcblx0XHRcdFx0XHR3aGlsZSAoKHdpZHRoXyA+IG1heFdpZHRoXyB8fCBoZWlnaHRfID4gbWF4SGVpZ2h0XykgJiYgd2lkdGggPiBtaW5XaWR0aCAmJiBoZWlnaHQgPiBtaW5IZWlnaHQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHN0ZXBzKysgPiAxOSkge1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRoZWlnaHQgPSBNYXRoLm1heChtaW5IZWlnaHQsIE1hdGgubWluKG1heEhlaWdodCwgaGVpZ2h0IC0gMTApKTtcclxuXHRcdFx0XHRcdFx0d2lkdGggID0gZ2V0U2NhbGFyKGhlaWdodCAqIHJhdGlvKTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICh3aWR0aCA8IG1pbldpZHRoKSB7XHJcblx0XHRcdFx0XHRcdFx0d2lkdGggID0gbWluV2lkdGg7XHJcblx0XHRcdFx0XHRcdFx0aGVpZ2h0ID0gZ2V0U2NhbGFyKHdpZHRoIC8gcmF0aW8pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAod2lkdGggPiBtYXhXaWR0aCkge1xyXG5cdFx0XHRcdFx0XHRcdHdpZHRoICA9IG1heFdpZHRoO1xyXG5cdFx0XHRcdFx0XHRcdGhlaWdodCA9IGdldFNjYWxhcih3aWR0aCAvIHJhdGlvKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aW5uZXIud2lkdGgoIHdpZHRoICkuaGVpZ2h0KCBoZWlnaHQgKTtcclxuXHJcblx0XHRcdFx0XHRcdHdyYXAud2lkdGgoIHdpZHRoICsgd1BhZGRpbmcgKTtcclxuXHJcblx0XHRcdFx0XHRcdHdpZHRoXyAgPSB3cmFwLndpZHRoKCk7XHJcblx0XHRcdFx0XHRcdGhlaWdodF8gPSB3cmFwLmhlaWdodCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0d2lkdGggID0gTWF0aC5tYXgobWluV2lkdGgsICBNYXRoLm1pbih3aWR0aCwgIHdpZHRoICAtICh3aWR0aF8gIC0gbWF4V2lkdGhfKSkpO1xyXG5cdFx0XHRcdFx0aGVpZ2h0ID0gTWF0aC5tYXgobWluSGVpZ2h0LCBNYXRoLm1pbihoZWlnaHQsIGhlaWdodCAtIChoZWlnaHRfIC0gbWF4SGVpZ2h0XykpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChzY3JvbGxPdXQgJiYgc2Nyb2xsaW5nID09PSAnYXV0bycgJiYgaGVpZ2h0IDwgb3JpZ0hlaWdodCAmJiAod2lkdGggKyB3UGFkZGluZyArIHNjcm9sbE91dCkgPCBtYXhXaWR0aF8pIHtcclxuXHRcdFx0XHR3aWR0aCArPSBzY3JvbGxPdXQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlubmVyLndpZHRoKCB3aWR0aCApLmhlaWdodCggaGVpZ2h0ICk7XHJcblxyXG5cdFx0XHR3cmFwLndpZHRoKCB3aWR0aCArIHdQYWRkaW5nICk7XHJcblxyXG5cdFx0XHR3aWR0aF8gID0gd3JhcC53aWR0aCgpO1xyXG5cdFx0XHRoZWlnaHRfID0gd3JhcC5oZWlnaHQoKTtcclxuXHJcblx0XHRcdGNhblNocmluayA9ICh3aWR0aF8gPiBtYXhXaWR0aF8gfHwgaGVpZ2h0XyA+IG1heEhlaWdodF8pICYmIHdpZHRoID4gbWluV2lkdGggJiYgaGVpZ2h0ID4gbWluSGVpZ2h0O1xyXG5cdFx0XHRjYW5FeHBhbmQgPSBjdXJyZW50LmFzcGVjdFJhdGlvID8gKHdpZHRoIDwgb3JpZ01heFdpZHRoICYmIGhlaWdodCA8IG9yaWdNYXhIZWlnaHQgJiYgd2lkdGggPCBvcmlnV2lkdGggJiYgaGVpZ2h0IDwgb3JpZ0hlaWdodCkgOiAoKHdpZHRoIDwgb3JpZ01heFdpZHRoIHx8IGhlaWdodCA8IG9yaWdNYXhIZWlnaHQpICYmICh3aWR0aCA8IG9yaWdXaWR0aCB8fCBoZWlnaHQgPCBvcmlnSGVpZ2h0KSk7XHJcblxyXG5cdFx0XHQkLmV4dGVuZChjdXJyZW50LCB7XHJcblx0XHRcdFx0ZGltIDoge1xyXG5cdFx0XHRcdFx0d2lkdGhcdDogZ2V0VmFsdWUoIHdpZHRoXyApLFxyXG5cdFx0XHRcdFx0aGVpZ2h0XHQ6IGdldFZhbHVlKCBoZWlnaHRfIClcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdG9yaWdXaWR0aCAgOiBvcmlnV2lkdGgsXHJcblx0XHRcdFx0b3JpZ0hlaWdodCA6IG9yaWdIZWlnaHQsXHJcblx0XHRcdFx0Y2FuU2hyaW5rICA6IGNhblNocmluayxcclxuXHRcdFx0XHRjYW5FeHBhbmQgIDogY2FuRXhwYW5kLFxyXG5cdFx0XHRcdHdQYWRkaW5nICAgOiB3UGFkZGluZyxcclxuXHRcdFx0XHRoUGFkZGluZyAgIDogaFBhZGRpbmcsXHJcblx0XHRcdFx0d3JhcFNwYWNlICA6IGhlaWdodF8gLSBza2luLm91dGVySGVpZ2h0KHRydWUpLFxyXG5cdFx0XHRcdHNraW5TcGFjZSAgOiBza2luLmhlaWdodCgpIC0gaGVpZ2h0XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYgKCFpZnJhbWUgJiYgY3VycmVudC5hdXRvSGVpZ2h0ICYmIGhlaWdodCA+IG1pbkhlaWdodCAmJiBoZWlnaHQgPCBtYXhIZWlnaHQgJiYgIWNhbkV4cGFuZCkge1xyXG5cdFx0XHRcdGlubmVyLmhlaWdodCgnYXV0bycpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdF9nZXRQb3NpdGlvbjogZnVuY3Rpb24gKG9ubHlBYnNvbHV0ZSkge1xyXG5cdFx0XHR2YXIgY3VycmVudCAgPSBGLmN1cnJlbnQsXHJcblx0XHRcdFx0dmlld3BvcnQgPSBGLmdldFZpZXdwb3J0KCksXHJcblx0XHRcdFx0bWFyZ2luICAgPSBjdXJyZW50Lm1hcmdpbixcclxuXHRcdFx0XHR3aWR0aCAgICA9IEYud3JhcC53aWR0aCgpICArIG1hcmdpblsxXSArIG1hcmdpblszXSxcclxuXHRcdFx0XHRoZWlnaHQgICA9IEYud3JhcC5oZWlnaHQoKSArIG1hcmdpblswXSArIG1hcmdpblsyXSxcclxuXHRcdFx0XHRyZXogICAgICA9IHtcclxuXHRcdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG5cdFx0XHRcdFx0dG9wICA6IG1hcmdpblswXSxcclxuXHRcdFx0XHRcdGxlZnQgOiBtYXJnaW5bM11cclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKGN1cnJlbnQuYXV0b0NlbnRlciAmJiBjdXJyZW50LmZpeGVkICYmICFvbmx5QWJzb2x1dGUgJiYgaGVpZ2h0IDw9IHZpZXdwb3J0LmggJiYgd2lkdGggPD0gdmlld3BvcnQudykge1xyXG5cdFx0XHRcdHJlei5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCFjdXJyZW50LmxvY2tlZCkge1xyXG5cdFx0XHRcdHJlei50b3AgICs9IHZpZXdwb3J0Lnk7XHJcblx0XHRcdFx0cmV6LmxlZnQgKz0gdmlld3BvcnQueDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV6LnRvcCAgPSBnZXRWYWx1ZShNYXRoLm1heChyZXoudG9wLCAgcmV6LnRvcCAgKyAoKHZpZXdwb3J0LmggLSBoZWlnaHQpICogY3VycmVudC50b3BSYXRpbykpKTtcclxuXHRcdFx0cmV6LmxlZnQgPSBnZXRWYWx1ZShNYXRoLm1heChyZXoubGVmdCwgcmV6LmxlZnQgKyAoKHZpZXdwb3J0LncgLSB3aWR0aCkgICogY3VycmVudC5sZWZ0UmF0aW8pKSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gcmV6O1xyXG5cdFx0fSxcclxuXHJcblx0XHRfYWZ0ZXJab29tSW46IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnQgPSBGLmN1cnJlbnQ7XHJcblxyXG5cdFx0XHRpZiAoIWN1cnJlbnQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdEYuaXNPcGVuID0gRi5pc09wZW5lZCA9IHRydWU7XHJcblxyXG5cdFx0XHRGLndyYXAuY3NzKCdvdmVyZmxvdycsICd2aXNpYmxlJykuYWRkQ2xhc3MoJ2ZhbmN5Ym94LW9wZW5lZCcpO1xyXG5cclxuXHRcdFx0Ri51cGRhdGUoKTtcclxuXHJcblx0XHRcdC8vIEFzc2lnbiBhIGNsaWNrIGV2ZW50XHJcblx0XHRcdGlmICggY3VycmVudC5jbG9zZUNsaWNrIHx8IChjdXJyZW50Lm5leHRDbGljayAmJiBGLmdyb3VwLmxlbmd0aCA+IDEpICkge1xyXG5cdFx0XHRcdEYuaW5uZXIuY3NzKCdjdXJzb3InLCAncG9pbnRlcicpLmJpbmQoJ2NsaWNrLmZiJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0aWYgKCEkKGUudGFyZ2V0KS5pcygnYScpICYmICEkKGUudGFyZ2V0KS5wYXJlbnQoKS5pcygnYScpKSB7XHJcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0XHRcdEZbIGN1cnJlbnQuY2xvc2VDbGljayA/ICdjbG9zZScgOiAnbmV4dCcgXSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDcmVhdGUgYSBjbG9zZSBidXR0b25cclxuXHRcdFx0aWYgKGN1cnJlbnQuY2xvc2VCdG4pIHtcclxuXHRcdFx0XHQkKGN1cnJlbnQudHBsLmNsb3NlQnRuKS5hcHBlbmRUbyhGLnNraW4pLmJpbmQoJ2NsaWNrLmZiJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRcdEYuY2xvc2UoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ3JlYXRlIG5hdmlnYXRpb24gYXJyb3dzXHJcblx0XHRcdGlmIChjdXJyZW50LmFycm93cyAmJiBGLmdyb3VwLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHRpZiAoY3VycmVudC5sb29wIHx8IGN1cnJlbnQuaW5kZXggPiAwKSB7XHJcblx0XHRcdFx0XHQkKGN1cnJlbnQudHBsLnByZXYpLmFwcGVuZFRvKEYub3V0ZXIpLmJpbmQoJ2NsaWNrLmZiJywgRi5wcmV2KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChjdXJyZW50Lmxvb3AgfHwgY3VycmVudC5pbmRleCA8IEYuZ3JvdXAubGVuZ3RoIC0gMSkge1xyXG5cdFx0XHRcdFx0JChjdXJyZW50LnRwbC5uZXh0KS5hcHBlbmRUbyhGLm91dGVyKS5iaW5kKCdjbGljay5mYicsIEYubmV4dCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRGLnRyaWdnZXIoJ2FmdGVyU2hvdycpO1xyXG5cclxuXHRcdFx0Ly8gU3RvcCB0aGUgc2xpZGVzaG93IGlmIHRoaXMgaXMgdGhlIGxhc3QgaXRlbVxyXG5cdFx0XHRpZiAoIWN1cnJlbnQubG9vcCAmJiBjdXJyZW50LmluZGV4ID09PSBjdXJyZW50Lmdyb3VwLmxlbmd0aCAtIDEpIHtcclxuXHRcdFx0XHRGLnBsYXkoIGZhbHNlICk7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKEYub3B0cy5hdXRvUGxheSAmJiAhRi5wbGF5ZXIuaXNBY3RpdmUpIHtcclxuXHRcdFx0XHRGLm9wdHMuYXV0b1BsYXkgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0Ri5wbGF5KCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0X2FmdGVyWm9vbU91dDogZnVuY3Rpb24gKCBvYmogKSB7XHJcblx0XHRcdG9iaiA9IG9iaiB8fCBGLmN1cnJlbnQ7XHJcblxyXG5cdFx0XHQkKCcuZmFuY3lib3gtd3JhcCcpLnRyaWdnZXIoJ29uUmVzZXQnKS5yZW1vdmUoKTtcclxuXHJcblx0XHRcdCQuZXh0ZW5kKEYsIHtcclxuXHRcdFx0XHRncm91cCAgOiB7fSxcclxuXHRcdFx0XHRvcHRzICAgOiB7fSxcclxuXHRcdFx0XHRyb3V0ZXIgOiBmYWxzZSxcclxuXHRcdFx0XHRjdXJyZW50ICAgOiBudWxsLFxyXG5cdFx0XHRcdGlzQWN0aXZlICA6IGZhbHNlLFxyXG5cdFx0XHRcdGlzT3BlbmVkICA6IGZhbHNlLFxyXG5cdFx0XHRcdGlzT3BlbiAgICA6IGZhbHNlLFxyXG5cdFx0XHRcdGlzQ2xvc2luZyA6IGZhbHNlLFxyXG5cdFx0XHRcdHdyYXAgICA6IG51bGwsXHJcblx0XHRcdFx0c2tpbiAgIDogbnVsbCxcclxuXHRcdFx0XHRvdXRlciAgOiBudWxsLFxyXG5cdFx0XHRcdGlubmVyICA6IG51bGxcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRGLnRyaWdnZXIoJ2FmdGVyQ2xvc2UnLCBvYmopO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQvKlxyXG5cdCAqXHREZWZhdWx0IHRyYW5zaXRpb25zXHJcblx0ICovXHJcblxyXG5cdEYudHJhbnNpdGlvbnMgPSB7XHJcblx0XHRnZXRPcmlnUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnQgID0gRi5jdXJyZW50LFxyXG5cdFx0XHRcdGVsZW1lbnQgID0gY3VycmVudC5lbGVtZW50LFxyXG5cdFx0XHRcdG9yaWcgICAgID0gY3VycmVudC5vcmlnLFxyXG5cdFx0XHRcdHBvcyAgICAgID0ge30sXHJcblx0XHRcdFx0d2lkdGggICAgPSA1MCxcclxuXHRcdFx0XHRoZWlnaHQgICA9IDUwLFxyXG5cdFx0XHRcdGhQYWRkaW5nID0gY3VycmVudC5oUGFkZGluZyxcclxuXHRcdFx0XHR3UGFkZGluZyA9IGN1cnJlbnQud1BhZGRpbmcsXHJcblx0XHRcdFx0dmlld3BvcnQgPSBGLmdldFZpZXdwb3J0KCk7XHJcblxyXG5cdFx0XHRpZiAoIW9yaWcgJiYgY3VycmVudC5pc0RvbSAmJiBlbGVtZW50LmlzKCc6dmlzaWJsZScpKSB7XHJcblx0XHRcdFx0b3JpZyA9IGVsZW1lbnQuZmluZCgnaW1nOmZpcnN0Jyk7XHJcblxyXG5cdFx0XHRcdGlmICghb3JpZy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdG9yaWcgPSBlbGVtZW50O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGlzUXVlcnkob3JpZykpIHtcclxuXHRcdFx0XHRwb3MgPSBvcmlnLm9mZnNldCgpO1xyXG5cclxuXHRcdFx0XHRpZiAob3JpZy5pcygnaW1nJykpIHtcclxuXHRcdFx0XHRcdHdpZHRoICA9IG9yaWcub3V0ZXJXaWR0aCgpO1xyXG5cdFx0XHRcdFx0aGVpZ2h0ID0gb3JpZy5vdXRlckhlaWdodCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cG9zLnRvcCAgPSB2aWV3cG9ydC55ICsgKHZpZXdwb3J0LmggLSBoZWlnaHQpICogY3VycmVudC50b3BSYXRpbztcclxuXHRcdFx0XHRwb3MubGVmdCA9IHZpZXdwb3J0LnggKyAodmlld3BvcnQudyAtIHdpZHRoKSAgKiBjdXJyZW50LmxlZnRSYXRpbztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKEYud3JhcC5jc3MoJ3Bvc2l0aW9uJykgPT09ICdmaXhlZCcgfHwgY3VycmVudC5sb2NrZWQpIHtcclxuXHRcdFx0XHRwb3MudG9wICAtPSB2aWV3cG9ydC55O1xyXG5cdFx0XHRcdHBvcy5sZWZ0IC09IHZpZXdwb3J0Lng7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHBvcyA9IHtcclxuXHRcdFx0XHR0b3AgICAgIDogZ2V0VmFsdWUocG9zLnRvcCAgLSBoUGFkZGluZyAqIGN1cnJlbnQudG9wUmF0aW8pLFxyXG5cdFx0XHRcdGxlZnQgICAgOiBnZXRWYWx1ZShwb3MubGVmdCAtIHdQYWRkaW5nICogY3VycmVudC5sZWZ0UmF0aW8pLFxyXG5cdFx0XHRcdHdpZHRoICAgOiBnZXRWYWx1ZSh3aWR0aCAgKyB3UGFkZGluZyksXHJcblx0XHRcdFx0aGVpZ2h0ICA6IGdldFZhbHVlKGhlaWdodCArIGhQYWRkaW5nKVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIHBvcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c3RlcDogZnVuY3Rpb24gKG5vdywgZngpIHtcclxuXHRcdFx0dmFyIHJhdGlvLFxyXG5cdFx0XHRcdHBhZGRpbmcsXHJcblx0XHRcdFx0dmFsdWUsXHJcblx0XHRcdFx0cHJvcCAgICAgICA9IGZ4LnByb3AsXHJcblx0XHRcdFx0Y3VycmVudCAgICA9IEYuY3VycmVudCxcclxuXHRcdFx0XHR3cmFwU3BhY2UgID0gY3VycmVudC53cmFwU3BhY2UsXHJcblx0XHRcdFx0c2tpblNwYWNlICA9IGN1cnJlbnQuc2tpblNwYWNlO1xyXG5cclxuXHRcdFx0aWYgKHByb3AgPT09ICd3aWR0aCcgfHwgcHJvcCA9PT0gJ2hlaWdodCcpIHtcclxuXHRcdFx0XHRyYXRpbyA9IGZ4LmVuZCA9PT0gZnguc3RhcnQgPyAxIDogKG5vdyAtIGZ4LnN0YXJ0KSAvIChmeC5lbmQgLSBmeC5zdGFydCk7XHJcblxyXG5cdFx0XHRcdGlmIChGLmlzQ2xvc2luZykge1xyXG5cdFx0XHRcdFx0cmF0aW8gPSAxIC0gcmF0aW87XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRwYWRkaW5nID0gcHJvcCA9PT0gJ3dpZHRoJyA/IGN1cnJlbnQud1BhZGRpbmcgOiBjdXJyZW50LmhQYWRkaW5nO1xyXG5cdFx0XHRcdHZhbHVlICAgPSBub3cgLSBwYWRkaW5nO1xyXG5cclxuXHRcdFx0XHRGLnNraW5bIHByb3AgXSggIGdldFNjYWxhciggcHJvcCA9PT0gJ3dpZHRoJyA/ICB2YWx1ZSA6IHZhbHVlIC0gKHdyYXBTcGFjZSAqIHJhdGlvKSApICk7XHJcblx0XHRcdFx0Ri5pbm5lclsgcHJvcCBdKCBnZXRTY2FsYXIoIHByb3AgPT09ICd3aWR0aCcgPyAgdmFsdWUgOiB2YWx1ZSAtICh3cmFwU3BhY2UgKiByYXRpbykgLSAoc2tpblNwYWNlICogcmF0aW8pICkgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHR6b29tSW46IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnQgID0gRi5jdXJyZW50LFxyXG5cdFx0XHRcdHN0YXJ0UG9zID0gY3VycmVudC5wb3MsXHJcblx0XHRcdFx0ZWZmZWN0ICAgPSBjdXJyZW50Lm9wZW5FZmZlY3QsXHJcblx0XHRcdFx0ZWxhc3RpYyAgPSBlZmZlY3QgPT09ICdlbGFzdGljJyxcclxuXHRcdFx0XHRlbmRQb3MgICA9ICQuZXh0ZW5kKHtvcGFjaXR5IDogMX0sIHN0YXJ0UG9zKTtcclxuXHJcblx0XHRcdC8vIFJlbW92ZSBcInBvc2l0aW9uXCIgcHJvcGVydHkgdGhhdCBicmVha3Mgb2xkZXIgSUVcclxuXHRcdFx0ZGVsZXRlIGVuZFBvcy5wb3NpdGlvbjtcclxuXHJcblx0XHRcdGlmIChlbGFzdGljKSB7XHJcblx0XHRcdFx0c3RhcnRQb3MgPSB0aGlzLmdldE9yaWdQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0XHRpZiAoY3VycmVudC5vcGVuT3BhY2l0eSkge1xyXG5cdFx0XHRcdFx0c3RhcnRQb3Mub3BhY2l0eSA9IDAuMTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKGVmZmVjdCA9PT0gJ2ZhZGUnKSB7XHJcblx0XHRcdFx0c3RhcnRQb3Mub3BhY2l0eSA9IDAuMTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ri53cmFwLmNzcyhzdGFydFBvcykuYW5pbWF0ZShlbmRQb3MsIHtcclxuXHRcdFx0XHRkdXJhdGlvbiA6IGVmZmVjdCA9PT0gJ25vbmUnID8gMCA6IGN1cnJlbnQub3BlblNwZWVkLFxyXG5cdFx0XHRcdGVhc2luZyAgIDogY3VycmVudC5vcGVuRWFzaW5nLFxyXG5cdFx0XHRcdHN0ZXAgICAgIDogZWxhc3RpYyA/IHRoaXMuc3RlcCA6IG51bGwsXHJcblx0XHRcdFx0Y29tcGxldGUgOiBGLl9hZnRlclpvb21JblxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0em9vbU91dDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgY3VycmVudCAgPSBGLmN1cnJlbnQsXHJcblx0XHRcdFx0ZWZmZWN0ICAgPSBjdXJyZW50LmNsb3NlRWZmZWN0LFxyXG5cdFx0XHRcdGVsYXN0aWMgID0gZWZmZWN0ID09PSAnZWxhc3RpYycsXHJcblx0XHRcdFx0ZW5kUG9zICAgPSB7b3BhY2l0eSA6IDAuMX07XHJcblxyXG5cdFx0XHRpZiAoZWxhc3RpYykge1xyXG5cdFx0XHRcdGVuZFBvcyA9IHRoaXMuZ2V0T3JpZ1Bvc2l0aW9uKCk7XHJcblxyXG5cdFx0XHRcdGlmIChjdXJyZW50LmNsb3NlT3BhY2l0eSkge1xyXG5cdFx0XHRcdFx0ZW5kUG9zLm9wYWNpdHkgPSAwLjE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRGLndyYXAuYW5pbWF0ZShlbmRQb3MsIHtcclxuXHRcdFx0XHRkdXJhdGlvbiA6IGVmZmVjdCA9PT0gJ25vbmUnID8gMCA6IGN1cnJlbnQuY2xvc2VTcGVlZCxcclxuXHRcdFx0XHRlYXNpbmcgICA6IGN1cnJlbnQuY2xvc2VFYXNpbmcsXHJcblx0XHRcdFx0c3RlcCAgICAgOiBlbGFzdGljID8gdGhpcy5zdGVwIDogbnVsbCxcclxuXHRcdFx0XHRjb21wbGV0ZSA6IEYuX2FmdGVyWm9vbU91dFxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Y2hhbmdlSW46IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnQgICA9IEYuY3VycmVudCxcclxuXHRcdFx0XHRlZmZlY3QgICAgPSBjdXJyZW50Lm5leHRFZmZlY3QsXHJcblx0XHRcdFx0c3RhcnRQb3MgID0gY3VycmVudC5wb3MsXHJcblx0XHRcdFx0ZW5kUG9zICAgID0geyBvcGFjaXR5IDogMSB9LFxyXG5cdFx0XHRcdGRpcmVjdGlvbiA9IEYuZGlyZWN0aW9uLFxyXG5cdFx0XHRcdGRpc3RhbmNlICA9IDIwMCxcclxuXHRcdFx0XHRmaWVsZDtcclxuXHJcblx0XHRcdHN0YXJ0UG9zLm9wYWNpdHkgPSAwLjE7XHJcblxyXG5cdFx0XHRpZiAoZWZmZWN0ID09PSAnZWxhc3RpYycpIHtcclxuXHRcdFx0XHRmaWVsZCA9IGRpcmVjdGlvbiA9PT0gJ2Rvd24nIHx8IGRpcmVjdGlvbiA9PT0gJ3VwJyA/ICd0b3AnIDogJ2xlZnQnO1xyXG5cclxuXHRcdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnZG93bicgfHwgZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcblx0XHRcdFx0XHRzdGFydFBvc1sgZmllbGQgXSA9IGdldFZhbHVlKGdldFNjYWxhcihzdGFydFBvc1sgZmllbGQgXSkgLSBkaXN0YW5jZSk7XHJcblx0XHRcdFx0XHRlbmRQb3NbIGZpZWxkIF0gICA9ICcrPScgKyBkaXN0YW5jZSArICdweCc7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzdGFydFBvc1sgZmllbGQgXSA9IGdldFZhbHVlKGdldFNjYWxhcihzdGFydFBvc1sgZmllbGQgXSkgKyBkaXN0YW5jZSk7XHJcblx0XHRcdFx0XHRlbmRQb3NbIGZpZWxkIF0gICA9ICctPScgKyBkaXN0YW5jZSArICdweCc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBXb3JrYXJvdW5kIGZvciBodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xMjI3M1xyXG5cdFx0XHRpZiAoZWZmZWN0ID09PSAnbm9uZScpIHtcclxuXHRcdFx0XHRGLl9hZnRlclpvb21JbigpO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRGLndyYXAuY3NzKHN0YXJ0UG9zKS5hbmltYXRlKGVuZFBvcywge1xyXG5cdFx0XHRcdFx0ZHVyYXRpb24gOiBjdXJyZW50Lm5leHRTcGVlZCxcclxuXHRcdFx0XHRcdGVhc2luZyAgIDogY3VycmVudC5uZXh0RWFzaW5nLFxyXG5cdFx0XHRcdFx0Y29tcGxldGUgOiBGLl9hZnRlclpvb21JblxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGNoYW5nZU91dDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgcHJldmlvdXMgID0gRi5wcmV2aW91cyxcclxuXHRcdFx0XHRlZmZlY3QgICAgPSBwcmV2aW91cy5wcmV2RWZmZWN0LFxyXG5cdFx0XHRcdGVuZFBvcyAgICA9IHsgb3BhY2l0eSA6IDAuMSB9LFxyXG5cdFx0XHRcdGRpcmVjdGlvbiA9IEYuZGlyZWN0aW9uLFxyXG5cdFx0XHRcdGRpc3RhbmNlICA9IDIwMDtcclxuXHJcblx0XHRcdGlmIChlZmZlY3QgPT09ICdlbGFzdGljJykge1xyXG5cdFx0XHRcdGVuZFBvc1sgZGlyZWN0aW9uID09PSAnZG93bicgfHwgZGlyZWN0aW9uID09PSAndXAnID8gJ3RvcCcgOiAnbGVmdCcgXSA9ICggZGlyZWN0aW9uID09PSAndXAnIHx8IGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gJy0nIDogJysnICkgKyAnPScgKyBkaXN0YW5jZSArICdweCc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHByZXZpb3VzLndyYXAuYW5pbWF0ZShlbmRQb3MsIHtcclxuXHRcdFx0XHRkdXJhdGlvbiA6IGVmZmVjdCA9PT0gJ25vbmUnID8gMCA6IHByZXZpb3VzLnByZXZTcGVlZCxcclxuXHRcdFx0XHRlYXNpbmcgICA6IHByZXZpb3VzLnByZXZFYXNpbmcsXHJcblx0XHRcdFx0Y29tcGxldGUgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHQkKHRoaXMpLnRyaWdnZXIoJ29uUmVzZXQnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8qXHJcblx0ICpcdE92ZXJsYXkgaGVscGVyXHJcblx0ICovXHJcblxyXG5cdEYuaGVscGVycy5vdmVybGF5ID0ge1xyXG5cdFx0ZGVmYXVsdHMgOiB7XHJcblx0XHRcdGNsb3NlQ2xpY2sgOiB0cnVlLCAgICAgIC8vIGlmIHRydWUsIGZhbmN5Qm94IHdpbGwgYmUgY2xvc2VkIHdoZW4gdXNlciBjbGlja3Mgb24gdGhlIG92ZXJsYXlcclxuXHRcdFx0c3BlZWRPdXQgICA6IDIwMCwgICAgICAgLy8gZHVyYXRpb24gb2YgZmFkZU91dCBhbmltYXRpb25cclxuXHRcdFx0c2hvd0Vhcmx5ICA6IHRydWUsICAgICAgLy8gaW5kaWNhdGVzIGlmIHNob3VsZCBiZSBvcGVuZWQgaW1tZWRpYXRlbHkgb3Igd2FpdCB1bnRpbCB0aGUgY29udGVudCBpcyByZWFkeVxyXG5cdFx0XHRjc3MgICAgICAgIDoge30sICAgICAgICAvLyBjdXN0b20gQ1NTIHByb3BlcnRpZXNcclxuXHRcdFx0bG9ja2VkICAgICA6ICFpc1RvdWNoLCAgLy8gaWYgdHJ1ZSwgdGhlIGNvbnRlbnQgd2lsbCBiZSBsb2NrZWQgaW50byBvdmVybGF5XHJcblx0XHRcdGZpeGVkICAgICAgOiB0cnVlICAgICAgIC8vIGlmIGZhbHNlLCB0aGUgb3ZlcmxheSBDU1MgcG9zaXRpb24gcHJvcGVydHkgd2lsbCBub3QgYmUgc2V0IHRvIFwiZml4ZWRcIlxyXG5cdFx0fSxcclxuXHJcblx0XHRvdmVybGF5IDogbnVsbCwgICAgICAvLyBjdXJyZW50IGhhbmRsZVxyXG5cdFx0Zml4ZWQgICA6IGZhbHNlLCAgICAgLy8gaW5kaWNhdGVzIGlmIHRoZSBvdmVybGF5IGhhcyBwb3NpdGlvbiBcImZpeGVkXCJcclxuXHRcdGVsICAgICAgOiAkKCdodG1sJyksIC8vIGVsZW1lbnQgdGhhdCBjb250YWlucyBcInRoZSBsb2NrXCJcclxuXHJcblx0XHQvLyBQdWJsaWMgbWV0aG9kc1xyXG5cdFx0Y3JlYXRlIDogZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0XHRvcHRzID0gJC5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIG9wdHMpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMub3ZlcmxheSkge1xyXG5cdFx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vdmVybGF5ID0gJCgnPGRpdiBjbGFzcz1cImZhbmN5Ym94LW92ZXJsYXlcIj48L2Rpdj4nKS5hcHBlbmRUbyggRi5jb21pbmcgPyBGLmNvbWluZy5wYXJlbnQgOiBvcHRzLnBhcmVudCApO1xyXG5cdFx0XHR0aGlzLmZpeGVkICAgPSBmYWxzZTtcclxuXHJcblx0XHRcdGlmIChvcHRzLmZpeGVkICYmIEYuZGVmYXVsdHMuZml4ZWQpIHtcclxuXHRcdFx0XHR0aGlzLm92ZXJsYXkuYWRkQ2xhc3MoJ2ZhbmN5Ym94LW92ZXJsYXktZml4ZWQnKTtcclxuXHJcblx0XHRcdFx0dGhpcy5maXhlZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0b3BlbiA6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdFx0b3B0cyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRzKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLm92ZXJsYXkpIHtcclxuXHRcdFx0XHR0aGlzLm92ZXJsYXkudW5iaW5kKCcub3ZlcmxheScpLndpZHRoKCdhdXRvJykuaGVpZ2h0KCdhdXRvJyk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuY3JlYXRlKG9wdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuZml4ZWQpIHtcclxuXHRcdFx0XHRXLmJpbmQoJ3Jlc2l6ZS5vdmVybGF5JywgJC5wcm94eSggdGhpcy51cGRhdGUsIHRoaXMpICk7XHJcblxyXG5cdFx0XHRcdHRoaXMudXBkYXRlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChvcHRzLmNsb3NlQ2xpY2spIHtcclxuXHRcdFx0XHR0aGlzLm92ZXJsYXkuYmluZCgnY2xpY2sub3ZlcmxheScsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdGlmICgkKGUudGFyZ2V0KS5oYXNDbGFzcygnZmFuY3lib3gtb3ZlcmxheScpKSB7XHJcblx0XHRcdFx0XHRcdGlmIChGLmlzQWN0aXZlKSB7XHJcblx0XHRcdFx0XHRcdFx0Ri5jbG9zZSgpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoYXQuY2xvc2UoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm92ZXJsYXkuY3NzKCBvcHRzLmNzcyApLnNob3coKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Y2xvc2UgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNjcm9sbFYsIHNjcm9sbEg7XHJcblxyXG5cdFx0XHRXLnVuYmluZCgncmVzaXplLm92ZXJsYXknKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmVsLmhhc0NsYXNzKCdmYW5jeWJveC1sb2NrJykpIHtcclxuXHRcdFx0XHQkKCcuZmFuY3lib3gtbWFyZ2luJykucmVtb3ZlQ2xhc3MoJ2ZhbmN5Ym94LW1hcmdpbicpO1xyXG5cclxuXHRcdFx0XHRzY3JvbGxWID0gVy5zY3JvbGxUb3AoKTtcclxuXHRcdFx0XHRzY3JvbGxIID0gVy5zY3JvbGxMZWZ0KCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuZWwucmVtb3ZlQ2xhc3MoJ2ZhbmN5Ym94LWxvY2snKTtcclxuXHJcblx0XHRcdFx0Vy5zY3JvbGxUb3AoIHNjcm9sbFYgKS5zY3JvbGxMZWZ0KCBzY3JvbGxIICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQoJy5mYW5jeWJveC1vdmVybGF5JykucmVtb3ZlKCkuaGlkZSgpO1xyXG5cclxuXHRcdFx0JC5leHRlbmQodGhpcywge1xyXG5cdFx0XHRcdG92ZXJsYXkgOiBudWxsLFxyXG5cdFx0XHRcdGZpeGVkICAgOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gUHJpdmF0ZSwgY2FsbGJhY2tzXHJcblxyXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgd2lkdGggPSAnMTAwJScsIG9mZnNldFdpZHRoO1xyXG5cclxuXHRcdFx0Ly8gUmVzZXQgd2lkdGgvaGVpZ2h0IHNvIGl0IHdpbGwgbm90IG1lc3NcclxuXHRcdFx0dGhpcy5vdmVybGF5LndpZHRoKHdpZHRoKS5oZWlnaHQoJzEwMCUnKTtcclxuXHJcblx0XHRcdC8vIGpRdWVyeSBkb2VzIG5vdCByZXR1cm4gcmVsaWFibGUgcmVzdWx0IGZvciBJRVxyXG5cdFx0XHRpZiAoSUUpIHtcclxuXHRcdFx0XHRvZmZzZXRXaWR0aCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRXaWR0aCwgZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aCk7XHJcblxyXG5cdFx0XHRcdGlmIChELndpZHRoKCkgPiBvZmZzZXRXaWR0aCkge1xyXG5cdFx0XHRcdFx0d2lkdGggPSBELndpZHRoKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIGlmIChELndpZHRoKCkgPiBXLndpZHRoKCkpIHtcclxuXHRcdFx0XHR3aWR0aCA9IEQud2lkdGgoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vdmVybGF5LndpZHRoKHdpZHRoKS5oZWlnaHQoRC5oZWlnaHQoKSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIFRoaXMgaXMgd2hlcmUgd2UgY2FuIG1hbmlwdWxhdGUgRE9NLCBiZWNhdXNlIGxhdGVyIGl0IHdvdWxkIGNhdXNlIGlmcmFtZXMgdG8gcmVsb2FkXHJcblx0XHRvblJlYWR5IDogZnVuY3Rpb24gKG9wdHMsIG9iaikge1xyXG5cdFx0XHR2YXIgb3ZlcmxheSA9IHRoaXMub3ZlcmxheTtcclxuXHJcblx0XHRcdCQoJy5mYW5jeWJveC1vdmVybGF5Jykuc3RvcCh0cnVlLCB0cnVlKTtcclxuXHJcblx0XHRcdGlmICghb3ZlcmxheSkge1xyXG5cdFx0XHRcdHRoaXMuY3JlYXRlKG9wdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAob3B0cy5sb2NrZWQgJiYgdGhpcy5maXhlZCAmJiBvYmouZml4ZWQpIHtcclxuXHRcdFx0XHRpZiAoIW92ZXJsYXkpIHtcclxuXHRcdFx0XHRcdHRoaXMubWFyZ2luID0gRC5oZWlnaHQoKSA+IFcuaGVpZ2h0KCkgPyAkKCdodG1sJykuY3NzKCdtYXJnaW4tcmlnaHQnKS5yZXBsYWNlKFwicHhcIiwgXCJcIikgOiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG9iai5sb2NrZWQgPSB0aGlzLm92ZXJsYXkuYXBwZW5kKCBvYmoud3JhcCApO1xyXG5cdFx0XHRcdG9iai5maXhlZCAgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG9wdHMuc2hvd0Vhcmx5ID09PSB0cnVlKSB7XHJcblx0XHRcdFx0dGhpcy5iZWZvcmVTaG93LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0YmVmb3JlU2hvdyA6IGZ1bmN0aW9uKG9wdHMsIG9iaikge1xyXG5cdFx0XHR2YXIgc2Nyb2xsViwgc2Nyb2xsSDtcclxuXHJcblx0XHRcdGlmIChvYmoubG9ja2VkKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubWFyZ2luICE9PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0JCgnKicpLmZpbHRlcihmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gKCQodGhpcykuY3NzKCdwb3NpdGlvbicpID09PSAnZml4ZWQnICYmICEkKHRoaXMpLmhhc0NsYXNzKFwiZmFuY3lib3gtb3ZlcmxheVwiKSAmJiAhJCh0aGlzKS5oYXNDbGFzcyhcImZhbmN5Ym94LXdyYXBcIikgKTtcclxuXHRcdFx0XHRcdH0pLmFkZENsYXNzKCdmYW5jeWJveC1tYXJnaW4nKTtcclxuXHJcblx0XHRcdFx0XHR0aGlzLmVsLmFkZENsYXNzKCdmYW5jeWJveC1tYXJnaW4nKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHNjcm9sbFYgPSBXLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRcdHNjcm9sbEggPSBXLnNjcm9sbExlZnQoKTtcclxuXHJcblx0XHRcdFx0dGhpcy5lbC5hZGRDbGFzcygnZmFuY3lib3gtbG9jaycpO1xyXG5cclxuXHRcdFx0XHRXLnNjcm9sbFRvcCggc2Nyb2xsViApLnNjcm9sbExlZnQoIHNjcm9sbEggKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vcGVuKG9wdHMpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRvblVwZGF0ZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoIXRoaXMuZml4ZWQpIHtcclxuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGFmdGVyQ2xvc2U6IGZ1bmN0aW9uIChvcHRzKSB7XHJcblx0XHRcdC8vIFJlbW92ZSBvdmVybGF5IGlmIGV4aXN0cyBhbmQgZmFuY3lCb3ggaXMgbm90IG9wZW5pbmdcclxuXHRcdFx0Ly8gKGUuZy4sIGl0IGlzIG5vdCBiZWluZyBvcGVuIHVzaW5nIGFmdGVyQ2xvc2UgY2FsbGJhY2spXHJcblx0XHRcdC8vaWYgKHRoaXMub3ZlcmxheSAmJiAhRi5pc0FjdGl2ZSkge1xyXG5cdFx0XHRpZiAodGhpcy5vdmVybGF5ICYmICFGLmNvbWluZykge1xyXG5cdFx0XHRcdHRoaXMub3ZlcmxheS5mYWRlT3V0KG9wdHMuc3BlZWRPdXQsICQucHJveHkoIHRoaXMuY2xvc2UsIHRoaXMgKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKlxyXG5cdCAqXHRUaXRsZSBoZWxwZXJcclxuXHQgKi9cclxuXHJcblx0Ri5oZWxwZXJzLnRpdGxlID0ge1xyXG5cdFx0ZGVmYXVsdHMgOiB7XHJcblx0XHRcdHR5cGUgICAgIDogJ2Zsb2F0JywgLy8gJ2Zsb2F0JywgJ2luc2lkZScsICdvdXRzaWRlJyBvciAnb3ZlcicsXHJcblx0XHRcdHBvc2l0aW9uIDogJ2JvdHRvbScgLy8gJ3RvcCcgb3IgJ2JvdHRvbSdcclxuXHRcdH0sXHJcblxyXG5cdFx0YmVmb3JlU2hvdzogZnVuY3Rpb24gKG9wdHMpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnQgPSBGLmN1cnJlbnQsXHJcblx0XHRcdFx0dGV4dCAgICA9IGN1cnJlbnQudGl0bGUsXHJcblx0XHRcdFx0dHlwZSAgICA9IG9wdHMudHlwZSxcclxuXHRcdFx0XHR0aXRsZSxcclxuXHRcdFx0XHR0YXJnZXQ7XHJcblxyXG5cdFx0XHRpZiAoJC5pc0Z1bmN0aW9uKHRleHQpKSB7XHJcblx0XHRcdFx0dGV4dCA9IHRleHQuY2FsbChjdXJyZW50LmVsZW1lbnQsIGN1cnJlbnQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIWlzU3RyaW5nKHRleHQpIHx8ICQudHJpbSh0ZXh0KSA9PT0gJycpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRpdGxlID0gJCgnPGRpdiBjbGFzcz1cImZhbmN5Ym94LXRpdGxlIGZhbmN5Ym94LXRpdGxlLScgKyB0eXBlICsgJy13cmFwXCI+JyArIHRleHQgKyAnPC9kaXY+Jyk7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcclxuXHRcdFx0XHRjYXNlICdpbnNpZGUnOlxyXG5cdFx0XHRcdFx0dGFyZ2V0ID0gRi5za2luO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlICdvdXRzaWRlJzpcclxuXHRcdFx0XHRcdHRhcmdldCA9IEYud3JhcDtcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSAnb3Zlcic6XHJcblx0XHRcdFx0XHR0YXJnZXQgPSBGLmlubmVyO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRkZWZhdWx0OiAvLyAnZmxvYXQnXHJcblx0XHRcdFx0XHR0YXJnZXQgPSBGLnNraW47XHJcblxyXG5cdFx0XHRcdFx0dGl0bGUuYXBwZW5kVG8oJ2JvZHknKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoSUUpIHtcclxuXHRcdFx0XHRcdFx0dGl0bGUud2lkdGgoIHRpdGxlLndpZHRoKCkgKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR0aXRsZS53cmFwSW5uZXIoJzxzcGFuIGNsYXNzPVwiY2hpbGRcIj48L3NwYW4+Jyk7XHJcblxyXG5cdFx0XHRcdFx0Ly9JbmNyZWFzZSBib3R0b20gbWFyZ2luIHNvIHRoaXMgdGl0bGUgd2lsbCBhbHNvIGZpdCBpbnRvIHZpZXdwb3J0XHJcblx0XHRcdFx0XHRGLmN1cnJlbnQubWFyZ2luWzJdICs9IE1hdGguYWJzKCBnZXRTY2FsYXIodGl0bGUuY3NzKCdtYXJnaW4tYm90dG9tJykpICk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRpdGxlWyAob3B0cy5wb3NpdGlvbiA9PT0gJ3RvcCcgPyAncHJlcGVuZFRvJyAgOiAnYXBwZW5kVG8nKSBdKHRhcmdldCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8galF1ZXJ5IHBsdWdpbiBpbml0aWFsaXphdGlvblxyXG5cdCQuZm4uZmFuY3lib3ggPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cdFx0dmFyIGluZGV4LFxyXG5cdFx0XHR0aGF0ICAgICA9ICQodGhpcyksXHJcblx0XHRcdHNlbGVjdG9yID0gdGhpcy5zZWxlY3RvciB8fCAnJyxcclxuXHRcdFx0cnVuICAgICAgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0dmFyIHdoYXQgPSAkKHRoaXMpLmJsdXIoKSwgaWR4ID0gaW5kZXgsIHJlbFR5cGUsIHJlbFZhbDtcclxuXHJcblx0XHRcdFx0aWYgKCEoZS5jdHJsS2V5IHx8IGUuYWx0S2V5IHx8IGUuc2hpZnRLZXkgfHwgZS5tZXRhS2V5KSAmJiAhd2hhdC5pcygnLmZhbmN5Ym94LXdyYXAnKSkge1xyXG5cdFx0XHRcdFx0cmVsVHlwZSA9IG9wdGlvbnMuZ3JvdXBBdHRyIHx8ICdkYXRhLWZhbmN5Ym94LWdyb3VwJztcclxuXHRcdFx0XHRcdHJlbFZhbCAgPSB3aGF0LmF0dHIocmVsVHlwZSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFyZWxWYWwpIHtcclxuXHRcdFx0XHRcdFx0cmVsVHlwZSA9ICdyZWwnO1xyXG5cdFx0XHRcdFx0XHRyZWxWYWwgID0gd2hhdC5nZXQoMClbIHJlbFR5cGUgXTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAocmVsVmFsICYmIHJlbFZhbCAhPT0gJycgJiYgcmVsVmFsICE9PSAnbm9mb2xsb3cnKSB7XHJcblx0XHRcdFx0XHRcdHdoYXQgPSBzZWxlY3Rvci5sZW5ndGggPyAkKHNlbGVjdG9yKSA6IHRoYXQ7XHJcblx0XHRcdFx0XHRcdHdoYXQgPSB3aGF0LmZpbHRlcignWycgKyByZWxUeXBlICsgJz1cIicgKyByZWxWYWwgKyAnXCJdJyk7XHJcblx0XHRcdFx0XHRcdGlkeCAgPSB3aGF0LmluZGV4KHRoaXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdG9wdGlvbnMuaW5kZXggPSBpZHg7XHJcblxyXG5cdFx0XHRcdFx0Ly8gU3RvcCBhbiBldmVudCBmcm9tIGJ1YmJsaW5nIGlmIGV2ZXJ5dGhpbmcgaXMgZmluZVxyXG5cdFx0XHRcdFx0aWYgKEYub3Blbih3aGF0LCBvcHRpb25zKSAhPT0gZmFsc2UpIHtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHRcdGluZGV4ICAgPSBvcHRpb25zLmluZGV4IHx8IDA7XHJcblxyXG5cdFx0aWYgKCFzZWxlY3RvciB8fCBvcHRpb25zLmxpdmUgPT09IGZhbHNlKSB7XHJcblx0XHRcdHRoYXQudW5iaW5kKCdjbGljay5mYi1zdGFydCcpLmJpbmQoJ2NsaWNrLmZiLXN0YXJ0JywgcnVuKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRELnVuZGVsZWdhdGUoc2VsZWN0b3IsICdjbGljay5mYi1zdGFydCcpLmRlbGVnYXRlKHNlbGVjdG9yICsgXCI6bm90KCcuZmFuY3lib3gtaXRlbSwgLmZhbmN5Ym94LW5hdicpXCIsICdjbGljay5mYi1zdGFydCcsIHJ1bik7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5maWx0ZXIoJ1tkYXRhLWZhbmN5Ym94LXN0YXJ0PTFdJykudHJpZ2dlcignY2xpY2snKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cclxuXHQvLyBUZXN0cyB0aGF0IG5lZWQgYSBib2R5IGF0IGRvYyByZWFkeVxyXG5cdEQucmVhZHkoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdzEsIHcyO1xyXG5cclxuXHRcdGlmICggJC5zY3JvbGxiYXJXaWR0aCA9PT0gdW5kZWZpbmVkICkge1xyXG5cdFx0XHQvLyBodHRwOi8vYmVuYWxtYW4uY29tL3Byb2plY3RzL2pxdWVyeS1taXNjLXBsdWdpbnMvI3Njcm9sbGJhcndpZHRoXHJcblx0XHRcdCQuc2Nyb2xsYmFyV2lkdGggPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgcGFyZW50ID0gJCgnPGRpdiBzdHlsZT1cIndpZHRoOjUwcHg7aGVpZ2h0OjUwcHg7b3ZlcmZsb3c6YXV0b1wiPjxkaXYvPjwvZGl2PicpLmFwcGVuZFRvKCdib2R5JyksXHJcblx0XHRcdFx0XHRjaGlsZCAgPSBwYXJlbnQuY2hpbGRyZW4oKSxcclxuXHRcdFx0XHRcdHdpZHRoICA9IGNoaWxkLmlubmVyV2lkdGgoKSAtIGNoaWxkLmhlaWdodCggOTkgKS5pbm5lcldpZHRoKCk7XHJcblxyXG5cdFx0XHRcdHBhcmVudC5yZW1vdmUoKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHdpZHRoO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggJC5zdXBwb3J0LmZpeGVkUG9zaXRpb24gPT09IHVuZGVmaW5lZCApIHtcclxuXHRcdFx0JC5zdXBwb3J0LmZpeGVkUG9zaXRpb24gPSAoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGVsZW0gID0gJCgnPGRpdiBzdHlsZT1cInBvc2l0aW9uOmZpeGVkO3RvcDoyMHB4O1wiPjwvZGl2PicpLmFwcGVuZFRvKCdib2R5JyksXHJcblx0XHRcdFx0XHRmaXhlZCA9ICggZWxlbVswXS5vZmZzZXRUb3AgPT09IDIwIHx8IGVsZW1bMF0ub2Zmc2V0VG9wID09PSAxNSApO1xyXG5cclxuXHRcdFx0XHRlbGVtLnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gZml4ZWQ7XHJcblx0XHRcdH0oKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0JC5leHRlbmQoRi5kZWZhdWx0cywge1xyXG5cdFx0XHRzY3JvbGxiYXJXaWR0aCA6ICQuc2Nyb2xsYmFyV2lkdGgoKSxcclxuXHRcdFx0Zml4ZWQgIDogJC5zdXBwb3J0LmZpeGVkUG9zaXRpb24sXHJcblx0XHRcdHBhcmVudCA6ICQoJ2JvZHknKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly9HZXQgcmVhbCB3aWR0aCBvZiBwYWdlIHNjcm9sbC1iYXJcclxuXHRcdHcxID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcblxyXG5cdFx0SC5hZGRDbGFzcygnZmFuY3lib3gtbG9jay10ZXN0Jyk7XHJcblxyXG5cdFx0dzIgPSAkKHdpbmRvdykud2lkdGgoKTtcclxuXHJcblx0XHRILnJlbW92ZUNsYXNzKCdmYW5jeWJveC1sb2NrLXRlc3QnKTtcclxuXHJcblx0XHQkKFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz4uZmFuY3lib3gtbWFyZ2lue21hcmdpbi1yaWdodDpcIiArICh3MiAtIHcxKSArIFwicHg7fTwvc3R5bGU+XCIpLmFwcGVuZFRvKFwiaGVhZFwiKTtcclxuXHR9KTtcclxuXHJcbn0od2luZG93LCBkb2N1bWVudCwgalF1ZXJ5KSk7Il19
