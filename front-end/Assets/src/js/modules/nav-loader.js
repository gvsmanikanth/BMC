jQuery(function($){
	
	//Search Mobile view Initialize
	function setMobileViewForSearch(){
		if (window.matchMedia('(max-width: 767px)').matches || window.matchMedia('(max-width: 1023px)').matches) {
			//$("#bodyOverlay,.search-overlay").insertAfter("nav.layout-navigation"); 
			$(".navigation-utility .scrollTextHide").show();
			if(!$('header.layout-header .layout-inner-wrap a').hasClass("headerSearch")){
				$('header.layout-header .layout-inner-wrap').append("<a class='navigation-search js-navigation-search headerSearch mobile-only'></a>"); 
				$(".navigation-utility .scrollTextHide").show();
			}
			
		}
	}
			
	setMobileViewForSearch();
	
	// two navigation functions have been setup based on the namespacing of
	// 'nav' vs 'navigation'.
	//
	// Navigation namespacing:
	// - 'nav' refers to the earlier version of the navivgation
	// - 'navigation' refers to the newer version of the navigation
	//
	// Since both follow similar internal conventions, the javascript that loads
	// these is being isolated to being setup based on the navigation wrapper class.
	// Both should not be loaded on the same page, to avoid conflicts and unexpected
	// behavour.

	function navigationSetup() {

		var $layoutHeader = $('.layout-header'),
			headerHeight = $layoutHeader.outerHeight(),
			minNavHeight = Math.round($('.navigation-tab-controls').outerHeight()),
			viewportWidth = $(window).width(),
			viewportWidthBreakpoint = 960,
			$supplementContainer = $('.navigation-tab-content'),
			// timer to prevent multiple resize events
			resizeTimer;

		$('.layout-navigation-open').click(function(e) {
			e.preventDefault();

			$('.layout-navigation').toggleClass('navigation-active');
			$('body').toggleClass('navigation-open');

			$('.navigation-secondary.navigation-active').removeClass('navigation-active');
			$('.navigation-supplementary.navigation-active').removeClass('navigation-active');
			$('.tab-control.active').removeClass('active');
		});
		
		$('.select-country').click(function(e) {
			e.preventDefault();
			$('body').addClass('country-modal-active');
		});
		
		// added event to detect Country modal close
		$('.country-modal-close, .layout-modal-overlay').click(function(e) {
			e.preventDefault();
			$('body').removeClass('country-modal-active');
		});

		$('.contact-bmc').click(function(e) {
			e.preventDefault();
			$('body').addClass('contact-modal-active');
		});

		$('.modal-close, .layout-modal-overlay').click(function(e) {
			e.preventDefault();
			$('body').removeClass('contact-modal-active');
		});

		$('.layout-navigation-close').click(function(e) {
			e.preventDefault();

			$('.layout-navigation').toggleClass('navigation-active');
			$('body').toggleClass('navigation-open');
		});

		// toggleClass active on primary navigation links
		$('.navigation-secondary-toggle > a').click(function(e){

			var $thisNavSecondary = $(this).next('.navigation-secondary');
			var $this = $(this);
			var $thisParent = $this.parent();
			var maxNavHeight = $(window).height() - 50;
			var $thisPosition = $(this).position();
			var thisLeft = $thisPosition.left || 0;
			var thisNavSecondaryLeft;

			e.preventDefault();

			$('.navigation-primary')
				.find('.navigation-secondary')
				.not($thisNavSecondary)
				.removeClass('navigation-active')
				.attr('style', '');

			$('.navigation-primary')
				.find('.navigation-secondary-toggle.hinted')
				.not($thisParent)
				.removeClass('hinted');

			$this.parent().toggleClass('hinted');

			$thisNavSecondary.toggleClass('navigation-active');

			if ( $thisNavSecondary.hasClass('navigation-active') ) {
				$thisNavSecondary.css('max-height', maxNavHeight);
			} else {
				$thisNavSecondary.attr('style', '');
			}

			// NAV PRODUCTS & SOLUTIONS
			// set the height of the tab containers to be equal
			if ( $thisNavSecondary.hasClass('navigation-tabbed-menu') ) {
				equalHeightNavColumns(minNavHeight);
			}

			// correctly set position for secondary nav
			setSecondaryNavPosition( $this );
		});
		
		//Remove Navigation Text on Scroll
		$(window).scroll(function() {
		  if($('body').hasClass("scrolled-down") || $('body').hasClass("scrolled-up")){
				$(".navigation-utility .scrollTextHide").hide();
			}else{
				$(".navigation-utility .scrollTextHide").show();
			}
		});

		$(window).on( 'resize', function(e) {
			clearTimeout(resizeTimer);
			// https://css-tricks.com/snippets/jquery/done-resizing-event/
			resizeTimer = setTimeout(function() {
				// reset doc size based variables
				viewportWidth = $(window).width();
				minNavHeight = Math.round($('.navigation-tab-controls').outerHeight());
				// launch doc size based functions
				if ( $( '.navigation-secondary.navigation-active' ).siblings( 'a' ).length > 0 ){
					setSecondaryNavPosition( $( '.navigation-secondary.navigation-active' ).siblings( 'a' ) );
				}
				equalHeightNavColumns(minNavHeight);
			}, 250);
			setMobileViewForSearch(); 
		});

		// exposes the primary nav items when in a scrolled-down or scrolled-up state
		$('.navigation-menu-link').click(function(e) {
			e.preventDefault();
			$('body').toggleClass('display-scrolled-menu');
		});

		// Dismisses menu if taps are made outside of the menu
		$('body').on('click', function(e){
			var $target = $(e.target);
			var clickInNav = $(e.target).parents('.navigation-secondary, .layout-navigation, .layout-contact-modal').addBack('.navigation-secondary');

			if (!$target.hasClass('layout-modal-overlay')) {
				if (!clickInNav.length) {
					$('.navigation-secondary').removeClass('navigation-active').attr('style', '');
					$('.navigation-secondary-toggle').removeClass('hinted');
				}
			}

		});

		$('.navigation-secondary-close').click(function(e) {
			$parent = $(this).parents('.navigation-secondary');
			$parent
				.removeClass('navigation-active')
				.attr('style', '');
		});

		// .navigation-tabbed-menu tab functionality
		$('.tab-control').click(function(e) {
			e.preventDefault();
			$this = $(this);
			$supplementNav = $this.next('.navigation-supplementary');

			$('.navigation-supplementary').removeClass('navigation-active');
			$('.tab-control').removeClass('active-tab');
			$this.addClass('active-tab');

			// clear out the supplement container
			$supplementContainer.html('');
			// and populate it with the appropriate menu
			$supplementNav
				.clone()
				.appendTo($supplementContainer);

			// equalize the column heights
			equalHeightNavColumns(minNavHeight);

			$supplementContainer
				.find('.navigation-supplementary')
				.addClass('navigation-active'); // doesn't trigger css transition animation :(
		});
		
		
	
		//$('.navigation-search.js-navigation-search').click(function(e) {
		$(document).on("click",".navigation-search.js-navigation-search",function(e) {
			e.stopPropagation();
			$("#st-search-input").val('');
			$(".autocomplete .with_sections").remove();
			$(".resultHeading,.viewResults").hide();
			//$(".autocomplete").removeClass("autocompleteData");
			$('.search-overlay').addClass('on');
			$('body').addClass('no-scroll');
			$('#fp-nav').css("display","none");
			$('#bodyOverlay').addClass('backgroundColor');
			$(".search-overlay #search_input").focus();
			$(".search-overlay").css({"right": (-1)*$(".search-overlay").width()});
			$(".search-overlay").animate({right: '0px'});
			if($('body').hasClass("scrolled-down") || $('body').hasClass("scrolled-up")){
				$(".search-overlay").addClass("topHeader");
			}else{
				$(".search-overlay").removeClass("topHeader");
			}
		});
		
		$('.search-overlay').click(function(e) {
			e.stopPropagation();
		});
		// Search form animation WEB-2853

		// navigation-supplementary close requires a quasi rebind since it is dynamically generated
		$('.navigation-tab-content').on('click', '.navigation-close-supplementary', function() {
			$('.navigation-supplementary').removeClass('navigation-active');
		});

		// Detect when search box is focused
		var navigationSearch = $('.js-navigation-search'),
			navigationSearchFocus = navigationSearch.find('.search-focus');
		navigationSearchFocus.focusout(function() {
			navigationSearch.removeClass('on');
		});
		navigationSearchFocus.focusin(function() {
			navigationSearch.addClass('on');
		});

		// this function provides equal height to elements in the 'navigation-tabbed-menu' container
		function equalHeightNavColumns(minNavHeight) {
			if ( viewportWidth > viewportWidthBreakpoint ) {
				$supplementContainer.find('.navigation-supplementary').css('min-height', minNavHeight);
				$supplementContainer.find('.navigation-column').css('min-height', minNavHeight);
			} else {
				$supplementContainer.find('.navigation-supplementary').css('min-height', 'none');
				$supplementContainer.find('.navigation-column').css('min-height', 'none');
			}
		}

		// position is dependent on the navAnchor argument passed in.
		function setSecondaryNavPosition( navAnchor ) {

			var navAnchor = $( navAnchor ),
			$thisNavSecondary,
			thisRelativePosition,
			thisRelativeLeft,
			thisRelativePosition,
			thisNavSecondaryLeft;

			if ( viewportWidth > viewportWidthBreakpoint ) {

				$thisNavSecondary = $( navAnchor ).next( '.navigation-secondary' );
				thisRelativePosition = $( navAnchor ).position();
				thisRelativeLeft = thisRelativePosition.left || 0;

				// determine the appropriate 'left' positioning property.
				if ( thisRelativeLeft + $thisNavSecondary.width() <= $('.navigation-primary').width() ) {
					thisNavSecondaryLeft = thisRelativeLeft;
				} else {
					thisNavSecondaryLeft = 'auto';
				}

				$thisNavSecondary.css( 'left', thisNavSecondaryLeft );
			} else {
				// no additional positioning action required on mobile
			}

		}

	}; // end navigationSetup



	var navLoader = {
		shouldLoad: {
			nav: $('.nav-primary').length !== 0 ? true : false,
			navigation: $('.navigation-primary').length !== 0 ? true : false
		},
		isLoaded: {
			nav: false,
			navigation: false
		},
		loadFunctions: {
			nav: function() {
				navSetup();
			},
			navigation: function() {
				navigationSetup();
			}
		},
		load: function(navigationKey) {
			if (typeof navLoader.loadFunctions[navigationKey] !== 'undefined') {
				navLoader.loadFunctions[navigationKey]();

				// assume is loaded if the function is called
				navLoader.isLoaded[navigationKey] = true;

				// add body class based on navigation loaded
				if (typeof navigationKey === 'string') {
					// get lowercased dashed string, 'Hello World' => 'hello-world'
					var navBodyClass = navigationKey.replace(/\s+/g, '-').toLowerCase();
					$('body').addClass('bmc-nav-loader-' + navBodyClass);
				}
			}
		},
		isLoaded: function(navigationKey) {
			return (typeof navLoader.isLoaded[navigationKey] !== 'undefined') ? navLoader.isLoaded[navigationKey] : false;
		},
		isNavLoaded: function() {
			return navLoader.isLoaded('nav');
		},
		isNavigationLoaded: function() {
			return navLoader.isLoaded('navigation');
		}
	};

	// setup one or the other, not both
	if (navLoader.shouldLoad.nav) {
		navLoader.load('nav');
	} else if (navLoader.shouldLoad.navigation) {
		navLoader.load('navigation');
	} else {
		// no navigations setup
	}

	// make available globally
	window.BMCNavLoader = navLoader;
});
