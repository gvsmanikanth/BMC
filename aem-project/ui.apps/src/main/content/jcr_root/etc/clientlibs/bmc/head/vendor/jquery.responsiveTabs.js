(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *  Project: jquery.responsiveTabs.js
 *  Description: A plugin that creates responsive tabs, optimized for all devices
 *  Author: Jelle Kralt (jelle@jellekralt.nl)
 *  Version: 1.4.5
 *  License: MIT
 */

;(function ( $, window, undefined ) {

    /** Default settings */
    var defaults = {
        active: null,
        event: 'click',
        disabled: [],
        collapsible: 'accordion',
        startCollapsed: false,
        rotate: false,
        setHash: false,
        animation: 'default',
        animationQueue: false,
        duration: 500,
        scrollToAccordion: false,
        activate: function(){},
        deactivate: function(){},
        load: function(){},
        activateState: function(){},
        classes: {
            stateDefault: 'r-tabs-state-default',
            stateActive: 'r-tabs-state-active',
            stateDisabled: 'r-tabs-state-disabled',
            stateExcluded: 'r-tabs-state-excluded',
            tab: 'r-tabs-tab',
            anchor: 'r-tabs-anchor',
            panel: 'r-tabs-panel',
            accordionTitle: 'r-tabs-accordion-title'
        }
    };

    /**
     * Responsive Tabs
     * @constructor
     * @param {object} element - The HTML element the validator should be bound to
     * @param {object} options - An option map
     */
    function ResponsiveTabs(element, options) {
        this.element = element; // Selected DOM element
        this.$element = $(element); // Selected jQuery element

        this.tabs = []; // Create tabs array
        this.state = ''; // Define the plugin state (tabs/accordion)
        this.rotateInterval = 0; // Define rotate interval
        this.$queue = $({});

        // Extend the defaults with the passed options
        this.options = $.extend( {}, defaults, options);

        this.init();
    }


    /**
     * This function initializes the tab plugin
     */
    ResponsiveTabs.prototype.init = function () {
        var _this = this;

        // Load all the elements
        this.tabs = this._loadElements();
        this._loadClasses();
        this._loadEvents();

        // Window resize bind to check state
        $(window).on('resize', function(e) {
            _this._setState(e);
        });

        // Hashchange event
        $(window).on('hashchange', function(e) {
            var tabRef = _this._getTabRefBySelector(window.location.hash);
            var oTab = _this._getTab(tabRef);

            // Check if a tab is found that matches the hash
            if(tabRef >= 0 && !oTab._ignoreHashChange && !oTab.disabled) {
                // If so, open the tab and auto close the current one
                _this._openTab(e, _this._getTab(tabRef), true);
            }
        });

        // Start rotate event if rotate option is defined
        if(this.options.rotate !== false) {
            this.startRotation();
        }

        // --------------------
        // Define plugin events
        //

        // Activate: this event is called when a tab is selected
        this.$element.bind('tabs-activate', function(e, oTab) {
            _this.options.activate.call(this, e, oTab);
        });
        // Deactivate: this event is called when a tab is closed
        this.$element.bind('tabs-deactivate', function(e, oTab) {
            _this.options.deactivate.call(this, e, oTab);
        });
        // Activate State: this event is called when the plugin switches states
        this.$element.bind('tabs-activate-state', function(e, state) {
            _this.options.activateState.call(this, e, state);
        });

        // Load: this event is called when the plugin has been loaded
        this.$element.bind('tabs-load', function(e) {
            var startTab;

            _this._setState(e); // Set state

            // Check if the panel should be collaped on load
            if(_this.options.startCollapsed !== true && !(_this.options.startCollapsed === 'accordion' && _this.state === 'accordion')) {

                startTab = _this._getStartTab();

                // Open the initial tab
                _this._openTab(e, startTab); // Open first tab

                // Call the callback function
                _this.options.load.call(this, e, startTab); // Call the load callback
            }
        });
        // Trigger loaded event
        this.$element.trigger('tabs-load');
    };
    
    //
    // PRIVATE FUNCTIONS
    //

    /**
     * This function loads the tab elements and stores them in an array
     * @returns {Array} Array of tab elements
     */
    ResponsiveTabs.prototype._loadElements = function() {
        var _this = this;
        var $ul = this.$element.children('ul');
        var tabs = [];
        var id = 0;

        // Add the classes to the basic html elements
        this.$element.addClass('r-tabs'); // Tab container
        $ul.addClass('r-tabs-nav'); // List container

        // Get tab buttons and store their data in an array
        $('li', $ul).each(function() {
            var $tab = $(this);
            var isExcluded = $tab.hasClass(_this.options.classes.stateExcluded);
            var $anchor, $panel, $accordionTab, $accordionAnchor, panelSelector;

            // Check if the tab should be excluded
            if(!isExcluded) {

                $anchor = $('a', $tab);
                panelSelector = $anchor.attr('href');
                $panel = $(panelSelector);
                $accordionTab = $('<div></div>').insertBefore($panel);
                $accordionAnchor = $('<a></a>').attr('href', panelSelector).html($anchor.html()).appendTo($accordionTab);

                var oTab = {
                    _ignoreHashChange: false,
                    id: id,
                    disabled: ($.inArray(id, _this.options.disabled) !== -1),
                    tab: $(this),
                    anchor: $('a', $tab),
                    panel: $panel,
                    selector: panelSelector,
                    accordionTab: $accordionTab,
                    accordionAnchor: $accordionAnchor,
                    active: false
                };

                // 1up the ID
                id++;
                // Add to tab array
                tabs.push(oTab);
            }
        });
        return tabs;
    };


    /**
     * This function adds classes to the tab elements based on the options
     */
    ResponsiveTabs.prototype._loadClasses = function() {
        for (var i=0; i<this.tabs.length; i++) {
            this.tabs[i].tab.addClass(this.options.classes.stateDefault).addClass(this.options.classes.tab);
            this.tabs[i].anchor.addClass(this.options.classes.anchor);
            this.tabs[i].panel.addClass(this.options.classes.stateDefault).addClass(this.options.classes.panel);
            this.tabs[i].accordionTab.addClass(this.options.classes.accordionTitle);
            this.tabs[i].accordionAnchor.addClass(this.options.classes.anchor);
            if(this.tabs[i].disabled) {
                this.tabs[i].tab.removeClass(this.options.classes.stateDefault).addClass(this.options.classes.stateDisabled);
                this.tabs[i].accordionTab.removeClass(this.options.classes.stateDefault).addClass(this.options.classes.stateDisabled);
           }
        }
    };

    /**
     * This function adds events to the tab elements
     */
    ResponsiveTabs.prototype._loadEvents = function() {
        var _this = this;

        // Define activate event on a tab element
        var fActivate = function(e) {
            var current = _this._getCurrentTab(); // Fetch current tab
            var activatedTab = e.data.tab;

            e.preventDefault();

            // Make sure this tab isn't disabled
            if(!activatedTab.disabled) {

                // Check if hash has to be set in the URL location
                if(_this.options.setHash) {
                    // Set the hash using the history api if available to tackle Chromes repaint bug on hash change
                    if(history.pushState) {
                        history.pushState(null, null, activatedTab.selector);
                    } else {
                        // Otherwise fallback to the hash update for sites that don't support the history api
                        window.location.hash = activatedTab.selector;
                    }
                }

                e.data.tab._ignoreHashChange = true;

                // Check if the activated tab isnt the current one or if its collapsible. If not, do nothing
                if(current !== activatedTab || _this._isCollapisble()) {
                    // The activated tab is either another tab of the current one. If it's the current tab it is collapsible
                    // Either way, the current tab can be closed
                    _this._closeTab(e, current);

                    // Check if the activated tab isnt the current one or if it isnt collapsible
                    if(current !== activatedTab || !_this._isCollapisble()) {
                        _this._openTab(e, activatedTab, false, true);
                    }
                }
            }
        };

        // Loop tabs
        for (var i=0; i<this.tabs.length; i++) {
            // Add activate function to the tab and accordion selection element
            this.tabs[i].anchor.on(_this.options.event, {tab: _this.tabs[i]}, fActivate);
            this.tabs[i].accordionAnchor.on(_this.options.event, {tab: _this.tabs[i]}, fActivate);
        }
    };

    /**
     * This function gets the tab that should be opened at start
     * @returns {Object} Tab object
     */
    ResponsiveTabs.prototype._getStartTab = function() {
        var tabRef = this._getTabRefBySelector(window.location.hash);
        var startTab;
        
        // Check if the page has a hash set that is linked to a tab
        if(tabRef >= 0 && !this._getTab(tabRef).disabled) {
            // If so, set the current tab to the linked tab
            startTab = this._getTab(tabRef);
        } else if(this.options.active > 0 && !this._getTab(this.options.active).disabled) {
            startTab = this._getTab(this.options.active);
        } else {
            // If not, just get the first one
            startTab = this._getTab(0);
        }

        return startTab;
    };

    /**
     * This function sets the current state of the plugin
     * @param {Event} e - The event that triggers the state change
     */
    ResponsiveTabs.prototype._setState = function(e) {
        var $ul = $('ul', this.$element);
        var oldState = this.state;
        var startCollapsedIsState = (typeof this.options.startCollapsed === 'string');
        var startTab;

        // The state is based on the visibility of the tabs list
        if($ul.is(':visible')){
            // Tab list is visible, so the state is 'tabs'
            this.state = 'tabs';
        } else {
            // Tab list is invisible, so the state is 'accordion'
            this.state = 'accordion';
        }

        // If the new state is different from the old state
        if(this.state !== oldState) {
            // If so, the state activate trigger must be called
            this.$element.trigger('tabs-activate-state', {oldState: oldState, newState: this.state});

            // Check if the state switch should open a tab
            if(oldState && startCollapsedIsState && this.options.startCollapsed !== this.state && this._getCurrentTab() === undefined) {
                // Get initial tab
                startTab = this._getStartTab(e);
                // Open the initial tab
                this._openTab(e, startTab); // Open first tab
            }
        }
    };

    /**
     * This function opens a tab
     * @param {Event} e - The event that triggers the tab opening
     * @param {Object} oTab - The tab object that should be opened
     * @param {Boolean} closeCurrent - Defines if the current tab should be closed
     * @param {Boolean} stopRotation - Defines if the tab rotation loop should be stopped
     */
    ResponsiveTabs.prototype._openTab = function(e, oTab, closeCurrent, stopRotation) {
        var _this = this;

        // Check if the current tab has to be closed
        if(closeCurrent) {
            this._closeTab(e, this._getCurrentTab());
        }

        // Check if the rotation has to be stopped when activated
        if(stopRotation && this.rotateInterval > 0) {
            this.stopRotation();
        }

        // Set this tab to active
        oTab.active = true;
        // Set active classes to the tab button and accordion tab button
        oTab.tab.removeClass(_this.options.classes.stateDefault).addClass(_this.options.classes.stateActive);
        oTab.accordionTab.removeClass(_this.options.classes.stateDefault).addClass(_this.options.classes.stateActive);

        // Run panel transiton
        _this._doTransition(oTab.panel, _this.options.animation, 'open', function() {
            // When finished, set active class to the panel
            oTab.panel.removeClass(_this.options.classes.stateDefault).addClass(_this.options.classes.stateActive);
          
           // And if enabled and state is accordion, scroll to the accordion tab
            if(_this.getState() === 'accordion' && _this.options.scrollToAccordion && (!_this._isInView(oTab.accordionTab) || _this.options.animation !== 'default')) {
                // Check if the animation option is enabled, and if the duration isn't 0
                if(_this.options.animation !== 'default' && _this.options.duration > 0) {
                    // If so, set scrollTop with animate and use the 'animation' duration
                    $('html, body').animate({
                        scrollTop: oTab.accordionTab.offset().top
                    }, _this.options.duration);
                } else {
                    //  If not, just set scrollTop
                    $('html, body').scrollTop(oTab.accordionTab.offset().top);
                }
            }
        });

        this.$element.trigger('tabs-activate', oTab);
    };

    /**
     * This function closes a tab
     * @param {Event} e - The event that is triggered when a tab is closed
     * @param {Object} oTab - The tab object that should be closed
     */
    ResponsiveTabs.prototype._closeTab = function(e, oTab) {
        var _this = this;
        var doQueueOnState = typeof _this.options.animationQueue === 'string';
        var doQueue;

        if(oTab !== undefined) {
            if(doQueueOnState && _this.getState() === _this.options.animationQueue) {
                doQueue = true;
            } else if(doQueueOnState) {
                doQueue = false;
            } else {
                doQueue = _this.options.animationQueue;
            }

            // Deactivate tab
            oTab.active = false;
            // Set default class to the tab button
            oTab.tab.removeClass(_this.options.classes.stateActive).addClass(_this.options.classes.stateDefault);

            // Run panel transition
            _this._doTransition(oTab.panel, _this.options.animation, 'close', function() {
                // Set default class to the accordion tab button and tab panel
                oTab.accordionTab.removeClass(_this.options.classes.stateActive).addClass(_this.options.classes.stateDefault);
                oTab.panel.removeClass(_this.options.classes.stateActive).addClass(_this.options.classes.stateDefault);
            }, !doQueue);

            this.$element.trigger('tabs-deactivate', oTab);
        }
    };

    /**
     * This function runs an effect on a panel
     * @param {Element} panel - The HTML element of the tab panel
     * @param {String} method - The transition method reference
     * @param {String} state - The state (open/closed) that the panel should transition to
     * @param {Function} callback - The callback function that is called after the transition
     * @param {Boolean} dequeue - Defines if the event queue should be dequeued after the transition
     */
    ResponsiveTabs.prototype._doTransition = function(panel, method, state, callback, dequeue) {
        var effect;
        var _this = this;

        // Get effect based on method
        switch(method) {
            case 'slide':
                effect = (state === 'open') ? 'slideDown' : 'slideUp';
                break;
            case 'fade':
                effect = (state === 'open') ? 'fadeIn' : 'fadeOut';
                break;
            default:
                effect = (state === 'open') ? 'show' : 'hide';
                // When default is used, set the duration to 0
                _this.options.duration = 0;
                break;
        }

        // Add the transition to a custom queue
        this.$queue.queue('responsive-tabs',function(next){
            // Run the transition on the panel
            panel[effect]({
                duration: _this.options.duration,
                complete: function() {
                    // Call the callback function
                    callback.call(panel, method, state);
                    // Run the next function in the queue
                    next();
                }
            });
        });

        // When the panel is openend, dequeue everything so the animation starts
        if(state === 'open' || dequeue) {
            this.$queue.dequeue('responsive-tabs');
        }

    };

    /**
     * This function returns the collapsibility of the tab in this state
     * @returns {Boolean} The collapsibility of the tab
     */
    ResponsiveTabs.prototype._isCollapisble = function() {
        return (typeof this.options.collapsible === 'boolean' && this.options.collapsible) || (typeof this.options.collapsible === 'string' && this.options.collapsible === this.getState());
    };

    /**
     * This function returns a tab by numeric reference
     * @param {Integer} numRef - Numeric tab reference
     * @returns {Object} Tab object
     */
    ResponsiveTabs.prototype._getTab = function(numRef) {
        return this.tabs[numRef];
    };

    /**
     * This function returns the numeric tab reference based on a hash selector
     * @param {String} selector - Hash selector
     * @returns {Integer} Numeric tab reference
     */
    ResponsiveTabs.prototype._getTabRefBySelector = function(selector) {
        // Loop all tabs
        for (var i=0; i<this.tabs.length; i++) {
            // Check if the hash selector is equal to the tab selector
            if(this.tabs[i].selector === selector) {
                return i;
            }
        }
        // If none is found return a negative index
        return -1;
    };

    /**
     * This function returns the current tab element
     * @returns {Object} Current tab element
     */
    ResponsiveTabs.prototype._getCurrentTab = function() {
        return this._getTab(this._getCurrentTabRef());
    };

    /**
     * This function returns the next tab's numeric reference
     * @param {Integer} currentTabRef - Current numeric tab reference
     * @returns {Integer} Numeric tab reference
     */
    ResponsiveTabs.prototype._getNextTabRef = function(currentTabRef) {
        var tabRef = (currentTabRef || this._getCurrentTabRef());
        var nextTabRef = (tabRef === this.tabs.length - 1) ? 0 : tabRef + 1;
        return (this._getTab(nextTabRef).disabled) ? this._getNextTabRef(nextTabRef) : nextTabRef;
    };

    /**
     * This function returns the previous tab's numeric reference
     * @returns {Integer} Numeric tab reference
     */
    ResponsiveTabs.prototype._getPreviousTabRef = function() {
        return (this._getCurrentTabRef() === 0) ? this.tabs.length - 1 : this._getCurrentTabRef() - 1;
    };

    /**
     * This function returns the current tab's numeric reference
     * @returns {Integer} Numeric tab reference
     */
    ResponsiveTabs.prototype._getCurrentTabRef = function() {
        // Loop all tabs
        for (var i=0; i<this.tabs.length; i++) {
            // If this tab is active, return it
            if(this.tabs[i].active) {
                return i;
            }
        }
        // No tabs have been found, return negative index
        return -1;
    };

    //
    // HELPER FUNCTIONS
    // 

    ResponsiveTabs.prototype._isInView = function($element) {
        var docViewTop = $(window).scrollTop(),
            docViewBottom = docViewTop + $(window).height(),
            elemTop = $element.offset().top,
            elemBottom = elemTop + $element.height();
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    };

    //
    // PUBLIC FUNCTIONS
    //

    /**
     * This function activates a tab
     * @param {Integer} tabRef - Numeric tab reference
     * @param {Boolean} stopRotation - Defines if the tab rotation should stop after activation
     */
    ResponsiveTabs.prototype.activate = function(tabRef, stopRotation) {
        var e = jQuery.Event('tabs-activate');
        var oTab = this._getTab(tabRef);
        if(!oTab.disabled) {
            this._openTab(e, oTab, true, stopRotation || true);
        }
    };

    /**
     * This function deactivates a tab
     * @param {Integer} tabRef - Numeric tab reference
     */
    ResponsiveTabs.prototype.deactivate = function(tabRef) {
        var e = jQuery.Event('tabs-dectivate');
        var oTab = this._getTab(tabRef);
        if(!oTab.disabled) {
            this._closeTab(e, oTab);
        }
    };

    /**
     * This function enables a tab
     * @param {Integer} tabRef - Numeric tab reference
     */
    ResponsiveTabs.prototype.enable = function(tabRef) {
        var oTab = this._getTab(tabRef);
        if(oTab){
            oTab.disabled = false;
            oTab.tab.addClass(this.options.classes.stateDefault).removeClass(this.options.classes.stateDisabled);
            oTab.accordionTab.addClass(this.options.classes.stateDefault).removeClass(this.options.classes.stateDisabled);
        }
    };

    /**
     * This function disable a tab
     * @param {Integer} tabRef - Numeric tab reference
     */
    ResponsiveTabs.prototype.disable = function(tabRef) {
        var oTab = this._getTab(tabRef);
        if(oTab){
            oTab.disabled = true;
            oTab.tab.removeClass(this.options.classes.stateDefault).addClass(this.options.classes.stateDisabled);
            oTab.accordionTab.removeClass(this.options.classes.stateDefault).addClass(this.options.classes.stateDisabled);
        }
    };

    /**
     * This function gets the current state of the plugin
     * @returns {String} State of the plugin
     */
    ResponsiveTabs.prototype.getState = function() {
        return this.state;
    };

    /**
     * This function starts the rotation of the tabs
     * @param {Integer} speed - The speed of the rotation
     */
    ResponsiveTabs.prototype.startRotation = function(speed) {
        var _this = this;
        // Make sure not all tabs are disabled
        if(this.tabs.length > this.options.disabled.length) {
            this.rotateInterval = setInterval(function(){
                var e = jQuery.Event('rotate');
                _this._openTab(e, _this._getTab(_this._getNextTabRef()), true);
            }, speed || (($.isNumeric(_this.options.rotate)) ? _this.options.rotate : 4000) );
        } else {
            throw new Error("Rotation is not possible if all tabs are disabled");
        }
    };

    /**
     * This function stops the rotation of the tabs
     */
    ResponsiveTabs.prototype.stopRotation = function() {
        window.clearInterval(this.rotateInterval);
        this.rotateInterval = 0;
    };

    /** jQuery wrapper */
    $.fn.responsiveTabs = function ( options ) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'responsivetabs')) {
                    $.data(this, 'responsivetabs', new ResponsiveTabs( this, options ));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            return this.each(function () {
                var instance = $.data(this, 'responsivetabs');

                if (instance instanceof ResponsiveTabs && typeof instance[options] === 'function') {
                    instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                    // TODO: destroy instance classes, etc
                    $.data(this, 'responsivetabs', null);
                }
            });
        }
    };

}(jQuery, window));

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnJlc3BvbnNpdmVUYWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogIFByb2plY3Q6IGpxdWVyeS5yZXNwb25zaXZlVGFicy5qc1xuICogIERlc2NyaXB0aW9uOiBBIHBsdWdpbiB0aGF0IGNyZWF0ZXMgcmVzcG9uc2l2ZSB0YWJzLCBvcHRpbWl6ZWQgZm9yIGFsbCBkZXZpY2VzXG4gKiAgQXV0aG9yOiBKZWxsZSBLcmFsdCAoamVsbGVAamVsbGVrcmFsdC5ubClcbiAqICBWZXJzaW9uOiAxLjQuNVxuICogIExpY2Vuc2U6IE1JVFxuICovXG5cbjsoZnVuY3Rpb24gKCAkLCB3aW5kb3csIHVuZGVmaW5lZCApIHtcblxuICAgIC8qKiBEZWZhdWx0IHNldHRpbmdzICovXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICBhY3RpdmU6IG51bGwsXG4gICAgICAgIGV2ZW50OiAnY2xpY2snLFxuICAgICAgICBkaXNhYmxlZDogW10sXG4gICAgICAgIGNvbGxhcHNpYmxlOiAnYWNjb3JkaW9uJyxcbiAgICAgICAgc3RhcnRDb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgICByb3RhdGU6IGZhbHNlLFxuICAgICAgICBzZXRIYXNoOiBmYWxzZSxcbiAgICAgICAgYW5pbWF0aW9uOiAnZGVmYXVsdCcsXG4gICAgICAgIGFuaW1hdGlvblF1ZXVlOiBmYWxzZSxcbiAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgc2Nyb2xsVG9BY2NvcmRpb246IGZhbHNlLFxuICAgICAgICBhY3RpdmF0ZTogZnVuY3Rpb24oKXt9LFxuICAgICAgICBkZWFjdGl2YXRlOiBmdW5jdGlvbigpe30sXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgYWN0aXZhdGVTdGF0ZTogZnVuY3Rpb24oKXt9LFxuICAgICAgICBjbGFzc2VzOiB7XG4gICAgICAgICAgICBzdGF0ZURlZmF1bHQ6ICdyLXRhYnMtc3RhdGUtZGVmYXVsdCcsXG4gICAgICAgICAgICBzdGF0ZUFjdGl2ZTogJ3ItdGFicy1zdGF0ZS1hY3RpdmUnLFxuICAgICAgICAgICAgc3RhdGVEaXNhYmxlZDogJ3ItdGFicy1zdGF0ZS1kaXNhYmxlZCcsXG4gICAgICAgICAgICBzdGF0ZUV4Y2x1ZGVkOiAnci10YWJzLXN0YXRlLWV4Y2x1ZGVkJyxcbiAgICAgICAgICAgIHRhYjogJ3ItdGFicy10YWInLFxuICAgICAgICAgICAgYW5jaG9yOiAnci10YWJzLWFuY2hvcicsXG4gICAgICAgICAgICBwYW5lbDogJ3ItdGFicy1wYW5lbCcsXG4gICAgICAgICAgICBhY2NvcmRpb25UaXRsZTogJ3ItdGFicy1hY2NvcmRpb24tdGl0bGUnXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzcG9uc2l2ZSBUYWJzXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnQgLSBUaGUgSFRNTCBlbGVtZW50IHRoZSB2YWxpZGF0b3Igc2hvdWxkIGJlIGJvdW5kIHRvXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBBbiBvcHRpb24gbWFwXG4gICAgICovXG4gICAgZnVuY3Rpb24gUmVzcG9uc2l2ZVRhYnMoZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50OyAvLyBTZWxlY3RlZCBET00gZWxlbWVudFxuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTsgLy8gU2VsZWN0ZWQgalF1ZXJ5IGVsZW1lbnRcblxuICAgICAgICB0aGlzLnRhYnMgPSBbXTsgLy8gQ3JlYXRlIHRhYnMgYXJyYXlcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICcnOyAvLyBEZWZpbmUgdGhlIHBsdWdpbiBzdGF0ZSAodGFicy9hY2NvcmRpb24pXG4gICAgICAgIHRoaXMucm90YXRlSW50ZXJ2YWwgPSAwOyAvLyBEZWZpbmUgcm90YXRlIGludGVydmFsXG4gICAgICAgIHRoaXMuJHF1ZXVlID0gJCh7fSk7XG5cbiAgICAgICAgLy8gRXh0ZW5kIHRoZSBkZWZhdWx0cyB3aXRoIHRoZSBwYXNzZWQgb3B0aW9uc1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCgge30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gaW5pdGlhbGl6ZXMgdGhlIHRhYiBwbHVnaW5cbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBMb2FkIGFsbCB0aGUgZWxlbWVudHNcbiAgICAgICAgdGhpcy50YWJzID0gdGhpcy5fbG9hZEVsZW1lbnRzKCk7XG4gICAgICAgIHRoaXMuX2xvYWRDbGFzc2VzKCk7XG4gICAgICAgIHRoaXMuX2xvYWRFdmVudHMoKTtcblxuICAgICAgICAvLyBXaW5kb3cgcmVzaXplIGJpbmQgdG8gY2hlY2sgc3RhdGVcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBfdGhpcy5fc2V0U3RhdGUoZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEhhc2hjaGFuZ2UgZXZlbnRcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIHRhYlJlZiA9IF90aGlzLl9nZXRUYWJSZWZCeVNlbGVjdG9yKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcbiAgICAgICAgICAgIHZhciBvVGFiID0gX3RoaXMuX2dldFRhYih0YWJSZWYpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBhIHRhYiBpcyBmb3VuZCB0aGF0IG1hdGNoZXMgdGhlIGhhc2hcbiAgICAgICAgICAgIGlmKHRhYlJlZiA+PSAwICYmICFvVGFiLl9pZ25vcmVIYXNoQ2hhbmdlICYmICFvVGFiLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgc28sIG9wZW4gdGhlIHRhYiBhbmQgYXV0byBjbG9zZSB0aGUgY3VycmVudCBvbmVcbiAgICAgICAgICAgICAgICBfdGhpcy5fb3BlblRhYihlLCBfdGhpcy5fZ2V0VGFiKHRhYlJlZiksIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTdGFydCByb3RhdGUgZXZlbnQgaWYgcm90YXRlIG9wdGlvbiBpcyBkZWZpbmVkXG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5yb3RhdGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Um90YXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIERlZmluZSBwbHVnaW4gZXZlbnRzXG4gICAgICAgIC8vXG5cbiAgICAgICAgLy8gQWN0aXZhdGU6IHRoaXMgZXZlbnQgaXMgY2FsbGVkIHdoZW4gYSB0YWIgaXMgc2VsZWN0ZWRcbiAgICAgICAgdGhpcy4kZWxlbWVudC5iaW5kKCd0YWJzLWFjdGl2YXRlJywgZnVuY3Rpb24oZSwgb1RhYikge1xuICAgICAgICAgICAgX3RoaXMub3B0aW9ucy5hY3RpdmF0ZS5jYWxsKHRoaXMsIGUsIG9UYWIpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gRGVhY3RpdmF0ZTogdGhpcyBldmVudCBpcyBjYWxsZWQgd2hlbiBhIHRhYiBpcyBjbG9zZWRcbiAgICAgICAgdGhpcy4kZWxlbWVudC5iaW5kKCd0YWJzLWRlYWN0aXZhdGUnLCBmdW5jdGlvbihlLCBvVGFiKSB7XG4gICAgICAgICAgICBfdGhpcy5vcHRpb25zLmRlYWN0aXZhdGUuY2FsbCh0aGlzLCBlLCBvVGFiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEFjdGl2YXRlIFN0YXRlOiB0aGlzIGV2ZW50IGlzIGNhbGxlZCB3aGVuIHRoZSBwbHVnaW4gc3dpdGNoZXMgc3RhdGVzXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYmluZCgndGFicy1hY3RpdmF0ZS1zdGF0ZScsIGZ1bmN0aW9uKGUsIHN0YXRlKSB7XG4gICAgICAgICAgICBfdGhpcy5vcHRpb25zLmFjdGl2YXRlU3RhdGUuY2FsbCh0aGlzLCBlLCBzdGF0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIExvYWQ6IHRoaXMgZXZlbnQgaXMgY2FsbGVkIHdoZW4gdGhlIHBsdWdpbiBoYXMgYmVlbiBsb2FkZWRcbiAgICAgICAgdGhpcy4kZWxlbWVudC5iaW5kKCd0YWJzLWxvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnRUYWI7XG5cbiAgICAgICAgICAgIF90aGlzLl9zZXRTdGF0ZShlKTsgLy8gU2V0IHN0YXRlXG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBwYW5lbCBzaG91bGQgYmUgY29sbGFwZWQgb24gbG9hZFxuICAgICAgICAgICAgaWYoX3RoaXMub3B0aW9ucy5zdGFydENvbGxhcHNlZCAhPT0gdHJ1ZSAmJiAhKF90aGlzLm9wdGlvbnMuc3RhcnRDb2xsYXBzZWQgPT09ICdhY2NvcmRpb24nICYmIF90aGlzLnN0YXRlID09PSAnYWNjb3JkaW9uJykpIHtcblxuICAgICAgICAgICAgICAgIHN0YXJ0VGFiID0gX3RoaXMuX2dldFN0YXJ0VGFiKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBPcGVuIHRoZSBpbml0aWFsIHRhYlxuICAgICAgICAgICAgICAgIF90aGlzLl9vcGVuVGFiKGUsIHN0YXJ0VGFiKTsgLy8gT3BlbiBmaXJzdCB0YWJcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgX3RoaXMub3B0aW9ucy5sb2FkLmNhbGwodGhpcywgZSwgc3RhcnRUYWIpOyAvLyBDYWxsIHRoZSBsb2FkIGNhbGxiYWNrXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBUcmlnZ2VyIGxvYWRlZCBldmVudFxuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3RhYnMtbG9hZCcpO1xuICAgIH07XG4gICAgXG4gICAgLy9cbiAgICAvLyBQUklWQVRFIEZVTkNUSU9OU1xuICAgIC8vXG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGxvYWRzIHRoZSB0YWIgZWxlbWVudHMgYW5kIHN0b3JlcyB0aGVtIGluIGFuIGFycmF5XG4gICAgICogQHJldHVybnMge0FycmF5fSBBcnJheSBvZiB0YWIgZWxlbWVudHNcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2xvYWRFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgJHVsID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbigndWwnKTtcbiAgICAgICAgdmFyIHRhYnMgPSBbXTtcbiAgICAgICAgdmFyIGlkID0gMDtcblxuICAgICAgICAvLyBBZGQgdGhlIGNsYXNzZXMgdG8gdGhlIGJhc2ljIGh0bWwgZWxlbWVudHNcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnci10YWJzJyk7IC8vIFRhYiBjb250YWluZXJcbiAgICAgICAgJHVsLmFkZENsYXNzKCdyLXRhYnMtbmF2Jyk7IC8vIExpc3QgY29udGFpbmVyXG5cbiAgICAgICAgLy8gR2V0IHRhYiBidXR0b25zIGFuZCBzdG9yZSB0aGVpciBkYXRhIGluIGFuIGFycmF5XG4gICAgICAgICQoJ2xpJywgJHVsKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICR0YWIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIGlzRXhjbHVkZWQgPSAkdGFiLmhhc0NsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZUV4Y2x1ZGVkKTtcbiAgICAgICAgICAgIHZhciAkYW5jaG9yLCAkcGFuZWwsICRhY2NvcmRpb25UYWIsICRhY2NvcmRpb25BbmNob3IsIHBhbmVsU2VsZWN0b3I7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSB0YWIgc2hvdWxkIGJlIGV4Y2x1ZGVkXG4gICAgICAgICAgICBpZighaXNFeGNsdWRlZCkge1xuXG4gICAgICAgICAgICAgICAgJGFuY2hvciA9ICQoJ2EnLCAkdGFiKTtcbiAgICAgICAgICAgICAgICBwYW5lbFNlbGVjdG9yID0gJGFuY2hvci5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICAgICAgJHBhbmVsID0gJChwYW5lbFNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAkYWNjb3JkaW9uVGFiID0gJCgnPGRpdj48L2Rpdj4nKS5pbnNlcnRCZWZvcmUoJHBhbmVsKTtcbiAgICAgICAgICAgICAgICAkYWNjb3JkaW9uQW5jaG9yID0gJCgnPGE+PC9hPicpLmF0dHIoJ2hyZWYnLCBwYW5lbFNlbGVjdG9yKS5odG1sKCRhbmNob3IuaHRtbCgpKS5hcHBlbmRUbygkYWNjb3JkaW9uVGFiKTtcblxuICAgICAgICAgICAgICAgIHZhciBvVGFiID0ge1xuICAgICAgICAgICAgICAgICAgICBfaWdub3JlSGFzaENoYW5nZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6ICgkLmluQXJyYXkoaWQsIF90aGlzLm9wdGlvbnMuZGlzYWJsZWQpICE9PSAtMSksXG4gICAgICAgICAgICAgICAgICAgIHRhYjogJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiAkKCdhJywgJHRhYiksXG4gICAgICAgICAgICAgICAgICAgIHBhbmVsOiAkcGFuZWwsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwYW5lbFNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICBhY2NvcmRpb25UYWI6ICRhY2NvcmRpb25UYWIsXG4gICAgICAgICAgICAgICAgICAgIGFjY29yZGlvbkFuY2hvcjogJGFjY29yZGlvbkFuY2hvcixcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyAxdXAgdGhlIElEXG4gICAgICAgICAgICAgICAgaWQrKztcbiAgICAgICAgICAgICAgICAvLyBBZGQgdG8gdGFiIGFycmF5XG4gICAgICAgICAgICAgICAgdGFicy5wdXNoKG9UYWIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRhYnM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNsYXNzZXMgdG8gdGhlIHRhYiBlbGVtZW50cyBiYXNlZCBvbiB0aGUgb3B0aW9uc1xuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fbG9hZENsYXNzZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy50YWJzW2ldLnRhYi5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnRhYik7XG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0uYW5jaG9yLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmFuY2hvcik7XG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0ucGFuZWwuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5wYW5lbCk7XG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0uYWNjb3JkaW9uVGFiLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmFjY29yZGlvblRpdGxlKTtcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS5hY2NvcmRpb25BbmNob3IuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuYW5jaG9yKTtcbiAgICAgICAgICAgIGlmKHRoaXMudGFic1tpXS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFic1tpXS50YWIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURpc2FibGVkKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhYnNbaV0uYWNjb3JkaW9uVGFiLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEaXNhYmxlZCk7XG4gICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGFkZHMgZXZlbnRzIHRvIHRoZSB0YWIgZWxlbWVudHNcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2xvYWRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBEZWZpbmUgYWN0aXZhdGUgZXZlbnQgb24gYSB0YWIgZWxlbWVudFxuICAgICAgICB2YXIgZkFjdGl2YXRlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBfdGhpcy5fZ2V0Q3VycmVudFRhYigpOyAvLyBGZXRjaCBjdXJyZW50IHRhYlxuICAgICAgICAgICAgdmFyIGFjdGl2YXRlZFRhYiA9IGUuZGF0YS50YWI7XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoaXMgdGFiIGlzbid0IGRpc2FibGVkXG4gICAgICAgICAgICBpZighYWN0aXZhdGVkVGFiLmRpc2FibGVkKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBoYXNoIGhhcyB0byBiZSBzZXQgaW4gdGhlIFVSTCBsb2NhdGlvblxuICAgICAgICAgICAgICAgIGlmKF90aGlzLm9wdGlvbnMuc2V0SGFzaCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGhhc2ggdXNpbmcgdGhlIGhpc3RvcnkgYXBpIGlmIGF2YWlsYWJsZSB0byB0YWNrbGUgQ2hyb21lcyByZXBhaW50IGJ1ZyBvbiBoYXNoIGNoYW5nZVxuICAgICAgICAgICAgICAgICAgICBpZihoaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgYWN0aXZhdGVkVGFiLnNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSBmYWxsYmFjayB0byB0aGUgaGFzaCB1cGRhdGUgZm9yIHNpdGVzIHRoYXQgZG9uJ3Qgc3VwcG9ydCB0aGUgaGlzdG9yeSBhcGlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYWN0aXZhdGVkVGFiLnNlbGVjdG9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZS5kYXRhLnRhYi5faWdub3JlSGFzaENoYW5nZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgYWN0aXZhdGVkIHRhYiBpc250IHRoZSBjdXJyZW50IG9uZSBvciBpZiBpdHMgY29sbGFwc2libGUuIElmIG5vdCwgZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnQgIT09IGFjdGl2YXRlZFRhYiB8fCBfdGhpcy5faXNDb2xsYXBpc2JsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBhY3RpdmF0ZWQgdGFiIGlzIGVpdGhlciBhbm90aGVyIHRhYiBvZiB0aGUgY3VycmVudCBvbmUuIElmIGl0J3MgdGhlIGN1cnJlbnQgdGFiIGl0IGlzIGNvbGxhcHNpYmxlXG4gICAgICAgICAgICAgICAgICAgIC8vIEVpdGhlciB3YXksIHRoZSBjdXJyZW50IHRhYiBjYW4gYmUgY2xvc2VkXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jbG9zZVRhYihlLCBjdXJyZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgYWN0aXZhdGVkIHRhYiBpc250IHRoZSBjdXJyZW50IG9uZSBvciBpZiBpdCBpc250IGNvbGxhcHNpYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmKGN1cnJlbnQgIT09IGFjdGl2YXRlZFRhYiB8fCAhX3RoaXMuX2lzQ29sbGFwaXNibGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgYWN0aXZhdGVkVGFiLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTG9vcCB0YWJzXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIEFkZCBhY3RpdmF0ZSBmdW5jdGlvbiB0byB0aGUgdGFiIGFuZCBhY2NvcmRpb24gc2VsZWN0aW9uIGVsZW1lbnRcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS5hbmNob3Iub24oX3RoaXMub3B0aW9ucy5ldmVudCwge3RhYjogX3RoaXMudGFic1tpXX0sIGZBY3RpdmF0ZSk7XG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0uYWNjb3JkaW9uQW5jaG9yLm9uKF90aGlzLm9wdGlvbnMuZXZlbnQsIHt0YWI6IF90aGlzLnRhYnNbaV19LCBmQWN0aXZhdGUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gZ2V0cyB0aGUgdGFiIHRoYXQgc2hvdWxkIGJlIG9wZW5lZCBhdCBzdGFydFxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRhYiBvYmplY3RcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldFN0YXJ0VGFiID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0YWJSZWYgPSB0aGlzLl9nZXRUYWJSZWZCeVNlbGVjdG9yKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcbiAgICAgICAgdmFyIHN0YXJ0VGFiO1xuICAgICAgICBcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBhZ2UgaGFzIGEgaGFzaCBzZXQgdGhhdCBpcyBsaW5rZWQgdG8gYSB0YWJcbiAgICAgICAgaWYodGFiUmVmID49IDAgJiYgIXRoaXMuX2dldFRhYih0YWJSZWYpLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAvLyBJZiBzbywgc2V0IHRoZSBjdXJyZW50IHRhYiB0byB0aGUgbGlua2VkIHRhYlxuICAgICAgICAgICAgc3RhcnRUYWIgPSB0aGlzLl9nZXRUYWIodGFiUmVmKTtcbiAgICAgICAgfSBlbHNlIGlmKHRoaXMub3B0aW9ucy5hY3RpdmUgPiAwICYmICF0aGlzLl9nZXRUYWIodGhpcy5vcHRpb25zLmFjdGl2ZSkuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHN0YXJ0VGFiID0gdGhpcy5fZ2V0VGFiKHRoaXMub3B0aW9ucy5hY3RpdmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSWYgbm90LCBqdXN0IGdldCB0aGUgZmlyc3Qgb25lXG4gICAgICAgICAgICBzdGFydFRhYiA9IHRoaXMuX2dldFRhYigwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFydFRhYjtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBzZXRzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBwbHVnaW5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gVGhlIGV2ZW50IHRoYXQgdHJpZ2dlcnMgdGhlIHN0YXRlIGNoYW5nZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fc2V0U3RhdGUgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciAkdWwgPSAkKCd1bCcsIHRoaXMuJGVsZW1lbnQpO1xuICAgICAgICB2YXIgb2xkU3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgICAgICB2YXIgc3RhcnRDb2xsYXBzZWRJc1N0YXRlID0gKHR5cGVvZiB0aGlzLm9wdGlvbnMuc3RhcnRDb2xsYXBzZWQgPT09ICdzdHJpbmcnKTtcbiAgICAgICAgdmFyIHN0YXJ0VGFiO1xuXG4gICAgICAgIC8vIFRoZSBzdGF0ZSBpcyBiYXNlZCBvbiB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgdGFicyBsaXN0XG4gICAgICAgIGlmKCR1bC5pcygnOnZpc2libGUnKSl7XG4gICAgICAgICAgICAvLyBUYWIgbGlzdCBpcyB2aXNpYmxlLCBzbyB0aGUgc3RhdGUgaXMgJ3RhYnMnXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gJ3RhYnMnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGFiIGxpc3QgaXMgaW52aXNpYmxlLCBzbyB0aGUgc3RhdGUgaXMgJ2FjY29yZGlvbidcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAnYWNjb3JkaW9uJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSBuZXcgc3RhdGUgaXMgZGlmZmVyZW50IGZyb20gdGhlIG9sZCBzdGF0ZVxuICAgICAgICBpZih0aGlzLnN0YXRlICE9PSBvbGRTdGF0ZSkge1xuICAgICAgICAgICAgLy8gSWYgc28sIHRoZSBzdGF0ZSBhY3RpdmF0ZSB0cmlnZ2VyIG11c3QgYmUgY2FsbGVkXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3RhYnMtYWN0aXZhdGUtc3RhdGUnLCB7b2xkU3RhdGU6IG9sZFN0YXRlLCBuZXdTdGF0ZTogdGhpcy5zdGF0ZX0pO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgc3RhdGUgc3dpdGNoIHNob3VsZCBvcGVuIGEgdGFiXG4gICAgICAgICAgICBpZihvbGRTdGF0ZSAmJiBzdGFydENvbGxhcHNlZElzU3RhdGUgJiYgdGhpcy5vcHRpb25zLnN0YXJ0Q29sbGFwc2VkICE9PSB0aGlzLnN0YXRlICYmIHRoaXMuX2dldEN1cnJlbnRUYWIoKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gR2V0IGluaXRpYWwgdGFiXG4gICAgICAgICAgICAgICAgc3RhcnRUYWIgPSB0aGlzLl9nZXRTdGFydFRhYihlKTtcbiAgICAgICAgICAgICAgICAvLyBPcGVuIHRoZSBpbml0aWFsIHRhYlxuICAgICAgICAgICAgICAgIHRoaXMuX29wZW5UYWIoZSwgc3RhcnRUYWIpOyAvLyBPcGVuIGZpcnN0IHRhYlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gb3BlbnMgYSB0YWJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gVGhlIGV2ZW50IHRoYXQgdHJpZ2dlcnMgdGhlIHRhYiBvcGVuaW5nXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9UYWIgLSBUaGUgdGFiIG9iamVjdCB0aGF0IHNob3VsZCBiZSBvcGVuZWRcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGNsb3NlQ3VycmVudCAtIERlZmluZXMgaWYgdGhlIGN1cnJlbnQgdGFiIHNob3VsZCBiZSBjbG9zZWRcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHN0b3BSb3RhdGlvbiAtIERlZmluZXMgaWYgdGhlIHRhYiByb3RhdGlvbiBsb29wIHNob3VsZCBiZSBzdG9wcGVkXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9vcGVuVGFiID0gZnVuY3Rpb24oZSwgb1RhYiwgY2xvc2VDdXJyZW50LCBzdG9wUm90YXRpb24pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgY3VycmVudCB0YWIgaGFzIHRvIGJlIGNsb3NlZFxuICAgICAgICBpZihjbG9zZUN1cnJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2Nsb3NlVGFiKGUsIHRoaXMuX2dldEN1cnJlbnRUYWIoKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgcm90YXRpb24gaGFzIHRvIGJlIHN0b3BwZWQgd2hlbiBhY3RpdmF0ZWRcbiAgICAgICAgaWYoc3RvcFJvdGF0aW9uICYmIHRoaXMucm90YXRlSW50ZXJ2YWwgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BSb3RhdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHRoaXMgdGFiIHRvIGFjdGl2ZVxuICAgICAgICBvVGFiLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIC8vIFNldCBhY3RpdmUgY2xhc3NlcyB0byB0aGUgdGFiIGJ1dHRvbiBhbmQgYWNjb3JkaW9uIHRhYiBidXR0b25cbiAgICAgICAgb1RhYi50YWIucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKTtcbiAgICAgICAgb1RhYi5hY2NvcmRpb25UYWIucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKTtcblxuICAgICAgICAvLyBSdW4gcGFuZWwgdHJhbnNpdG9uXG4gICAgICAgIF90aGlzLl9kb1RyYW5zaXRpb24ob1RhYi5wYW5lbCwgX3RoaXMub3B0aW9ucy5hbmltYXRpb24sICdvcGVuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBXaGVuIGZpbmlzaGVkLCBzZXQgYWN0aXZlIGNsYXNzIHRvIHRoZSBwYW5lbFxuICAgICAgICAgICAgb1RhYi5wYW5lbC5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpO1xuICAgICAgICAgIFxuICAgICAgICAgICAvLyBBbmQgaWYgZW5hYmxlZCBhbmQgc3RhdGUgaXMgYWNjb3JkaW9uLCBzY3JvbGwgdG8gdGhlIGFjY29yZGlvbiB0YWJcbiAgICAgICAgICAgIGlmKF90aGlzLmdldFN0YXRlKCkgPT09ICdhY2NvcmRpb24nICYmIF90aGlzLm9wdGlvbnMuc2Nyb2xsVG9BY2NvcmRpb24gJiYgKCFfdGhpcy5faXNJblZpZXcob1RhYi5hY2NvcmRpb25UYWIpIHx8IF90aGlzLm9wdGlvbnMuYW5pbWF0aW9uICE9PSAnZGVmYXVsdCcpKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGFuaW1hdGlvbiBvcHRpb24gaXMgZW5hYmxlZCwgYW5kIGlmIHRoZSBkdXJhdGlvbiBpc24ndCAwXG4gICAgICAgICAgICAgICAgaWYoX3RoaXMub3B0aW9ucy5hbmltYXRpb24gIT09ICdkZWZhdWx0JyAmJiBfdGhpcy5vcHRpb25zLmR1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBzbywgc2V0IHNjcm9sbFRvcCB3aXRoIGFuaW1hdGUgYW5kIHVzZSB0aGUgJ2FuaW1hdGlvbicgZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBvVGFiLmFjY29yZGlvblRhYi5vZmZzZXQoKS50b3BcbiAgICAgICAgICAgICAgICAgICAgfSwgX3RoaXMub3B0aW9ucy5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gIElmIG5vdCwganVzdCBzZXQgc2Nyb2xsVG9wXG4gICAgICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3Aob1RhYi5hY2NvcmRpb25UYWIub2Zmc2V0KCkudG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndGFicy1hY3RpdmF0ZScsIG9UYWIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGNsb3NlcyBhIHRhYlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBUaGUgZXZlbnQgdGhhdCBpcyB0cmlnZ2VyZWQgd2hlbiBhIHRhYiBpcyBjbG9zZWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1RhYiAtIFRoZSB0YWIgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIGNsb3NlZFxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fY2xvc2VUYWIgPSBmdW5jdGlvbihlLCBvVGFiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBkb1F1ZXVlT25TdGF0ZSA9IHR5cGVvZiBfdGhpcy5vcHRpb25zLmFuaW1hdGlvblF1ZXVlID09PSAnc3RyaW5nJztcbiAgICAgICAgdmFyIGRvUXVldWU7XG5cbiAgICAgICAgaWYob1RhYiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZihkb1F1ZXVlT25TdGF0ZSAmJiBfdGhpcy5nZXRTdGF0ZSgpID09PSBfdGhpcy5vcHRpb25zLmFuaW1hdGlvblF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgZG9RdWV1ZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9RdWV1ZU9uU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBkb1F1ZXVlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvUXVldWUgPSBfdGhpcy5vcHRpb25zLmFuaW1hdGlvblF1ZXVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEZWFjdGl2YXRlIHRhYlxuICAgICAgICAgICAgb1RhYi5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIFNldCBkZWZhdWx0IGNsYXNzIHRvIHRoZSB0YWIgYnV0dG9uXG4gICAgICAgICAgICBvVGFiLnRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpO1xuXG4gICAgICAgICAgICAvLyBSdW4gcGFuZWwgdHJhbnNpdGlvblxuICAgICAgICAgICAgX3RoaXMuX2RvVHJhbnNpdGlvbihvVGFiLnBhbmVsLCBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbiwgJ2Nsb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0IGRlZmF1bHQgY2xhc3MgdG8gdGhlIGFjY29yZGlvbiB0YWIgYnV0dG9uIGFuZCB0YWIgcGFuZWxcbiAgICAgICAgICAgICAgICBvVGFiLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpO1xuICAgICAgICAgICAgICAgIG9UYWIucGFuZWwucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KTtcbiAgICAgICAgICAgIH0sICFkb1F1ZXVlKTtcblxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCd0YWJzLWRlYWN0aXZhdGUnLCBvVGFiKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJ1bnMgYW4gZWZmZWN0IG9uIGEgcGFuZWxcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IHBhbmVsIC0gVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgdGFiIHBhbmVsXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZCAtIFRoZSB0cmFuc2l0aW9uIG1ldGhvZCByZWZlcmVuY2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RhdGUgLSBUaGUgc3RhdGUgKG9wZW4vY2xvc2VkKSB0aGF0IHRoZSBwYW5lbCBzaG91bGQgdHJhbnNpdGlvbiB0b1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIGFmdGVyIHRoZSB0cmFuc2l0aW9uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBkZXF1ZXVlIC0gRGVmaW5lcyBpZiB0aGUgZXZlbnQgcXVldWUgc2hvdWxkIGJlIGRlcXVldWVkIGFmdGVyIHRoZSB0cmFuc2l0aW9uXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9kb1RyYW5zaXRpb24gPSBmdW5jdGlvbihwYW5lbCwgbWV0aG9kLCBzdGF0ZSwgY2FsbGJhY2ssIGRlcXVldWUpIHtcbiAgICAgICAgdmFyIGVmZmVjdDtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBHZXQgZWZmZWN0IGJhc2VkIG9uIG1ldGhvZFxuICAgICAgICBzd2l0Y2gobWV0aG9kKSB7XG4gICAgICAgICAgICBjYXNlICdzbGlkZSc6XG4gICAgICAgICAgICAgICAgZWZmZWN0ID0gKHN0YXRlID09PSAnb3BlbicpID8gJ3NsaWRlRG93bicgOiAnc2xpZGVVcCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmYWRlJzpcbiAgICAgICAgICAgICAgICBlZmZlY3QgPSAoc3RhdGUgPT09ICdvcGVuJykgPyAnZmFkZUluJyA6ICdmYWRlT3V0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZWZmZWN0ID0gKHN0YXRlID09PSAnb3BlbicpID8gJ3Nob3cnIDogJ2hpZGUnO1xuICAgICAgICAgICAgICAgIC8vIFdoZW4gZGVmYXVsdCBpcyB1c2VkLCBzZXQgdGhlIGR1cmF0aW9uIHRvIDBcbiAgICAgICAgICAgICAgICBfdGhpcy5vcHRpb25zLmR1cmF0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0aGUgdHJhbnNpdGlvbiB0byBhIGN1c3RvbSBxdWV1ZVxuICAgICAgICB0aGlzLiRxdWV1ZS5xdWV1ZSgncmVzcG9uc2l2ZS10YWJzJyxmdW5jdGlvbihuZXh0KXtcbiAgICAgICAgICAgIC8vIFJ1biB0aGUgdHJhbnNpdGlvbiBvbiB0aGUgcGFuZWxcbiAgICAgICAgICAgIHBhbmVsW2VmZmVjdF0oe1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBfdGhpcy5vcHRpb25zLmR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChwYW5lbCwgbWV0aG9kLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biB0aGUgbmV4dCBmdW5jdGlvbiBpbiB0aGUgcXVldWVcbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXaGVuIHRoZSBwYW5lbCBpcyBvcGVuZW5kLCBkZXF1ZXVlIGV2ZXJ5dGhpbmcgc28gdGhlIGFuaW1hdGlvbiBzdGFydHNcbiAgICAgICAgaWYoc3RhdGUgPT09ICdvcGVuJyB8fCBkZXF1ZXVlKSB7XG4gICAgICAgICAgICB0aGlzLiRxdWV1ZS5kZXF1ZXVlKCdyZXNwb25zaXZlLXRhYnMnKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgY29sbGFwc2liaWxpdHkgb2YgdGhlIHRhYiBpbiB0aGlzIHN0YXRlXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IFRoZSBjb2xsYXBzaWJpbGl0eSBvZiB0aGUgdGFiXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9pc0NvbGxhcGlzYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAodHlwZW9mIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSA9PT0gJ2Jvb2xlYW4nICYmIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSkgfHwgKHR5cGVvZiB0aGlzLm9wdGlvbnMuY29sbGFwc2libGUgPT09ICdzdHJpbmcnICYmIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSA9PT0gdGhpcy5nZXRTdGF0ZSgpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgdGFiIGJ5IG51bWVyaWMgcmVmZXJlbmNlXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBudW1SZWYgLSBOdW1lcmljIHRhYiByZWZlcmVuY2VcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUYWIgb2JqZWN0XG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRUYWIgPSBmdW5jdGlvbihudW1SZWYpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFic1tudW1SZWZdO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIG51bWVyaWMgdGFiIHJlZmVyZW5jZSBiYXNlZCBvbiBhIGhhc2ggc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBIYXNoIHNlbGVjdG9yXG4gICAgICogQHJldHVybnMge0ludGVnZXJ9IE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0VGFiUmVmQnlTZWxlY3RvciA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICAgIC8vIExvb3AgYWxsIHRhYnNcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGhhc2ggc2VsZWN0b3IgaXMgZXF1YWwgdG8gdGhlIHRhYiBzZWxlY3RvclxuICAgICAgICAgICAgaWYodGhpcy50YWJzW2ldLnNlbGVjdG9yID09PSBzZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIG5vbmUgaXMgZm91bmQgcmV0dXJuIGEgbmVnYXRpdmUgaW5kZXhcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGN1cnJlbnQgdGFiIGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBDdXJyZW50IHRhYiBlbGVtZW50XG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRDdXJyZW50VGFiID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRUYWIodGhpcy5fZ2V0Q3VycmVudFRhYlJlZigpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBuZXh0IHRhYidzIG51bWVyaWMgcmVmZXJlbmNlXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBjdXJyZW50VGFiUmVmIC0gQ3VycmVudCBudW1lcmljIHRhYiByZWZlcmVuY2VcbiAgICAgKiBAcmV0dXJucyB7SW50ZWdlcn0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXROZXh0VGFiUmVmID0gZnVuY3Rpb24oY3VycmVudFRhYlJlZikge1xuICAgICAgICB2YXIgdGFiUmVmID0gKGN1cnJlbnRUYWJSZWYgfHwgdGhpcy5fZ2V0Q3VycmVudFRhYlJlZigpKTtcbiAgICAgICAgdmFyIG5leHRUYWJSZWYgPSAodGFiUmVmID09PSB0aGlzLnRhYnMubGVuZ3RoIC0gMSkgPyAwIDogdGFiUmVmICsgMTtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9nZXRUYWIobmV4dFRhYlJlZikuZGlzYWJsZWQpID8gdGhpcy5fZ2V0TmV4dFRhYlJlZihuZXh0VGFiUmVmKSA6IG5leHRUYWJSZWY7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcHJldmlvdXMgdGFiJ3MgbnVtZXJpYyByZWZlcmVuY2VcbiAgICAgKiBAcmV0dXJucyB7SW50ZWdlcn0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRQcmV2aW91c1RhYlJlZiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSA9PT0gMCkgPyB0aGlzLnRhYnMubGVuZ3RoIC0gMSA6IHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSAtIDE7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgY3VycmVudCB0YWIncyBudW1lcmljIHJlZmVyZW5jZVxuICAgICAqIEByZXR1cm5zIHtJbnRlZ2VyfSBOdW1lcmljIHRhYiByZWZlcmVuY2VcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldEN1cnJlbnRUYWJSZWYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gTG9vcCBhbGwgdGFic1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy50YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIHRhYiBpcyBhY3RpdmUsIHJldHVybiBpdFxuICAgICAgICAgICAgaWYodGhpcy50YWJzW2ldLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE5vIHRhYnMgaGF2ZSBiZWVuIGZvdW5kLCByZXR1cm4gbmVnYXRpdmUgaW5kZXhcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICAvL1xuICAgIC8vIEhFTFBFUiBGVU5DVElPTlNcbiAgICAvLyBcblxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5faXNJblZpZXcgPSBmdW5jdGlvbigkZWxlbWVudCkge1xuICAgICAgICB2YXIgZG9jVmlld1RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgIGRvY1ZpZXdCb3R0b20gPSBkb2NWaWV3VG9wICsgJCh3aW5kb3cpLmhlaWdodCgpLFxuICAgICAgICAgICAgZWxlbVRvcCA9ICRlbGVtZW50Lm9mZnNldCgpLnRvcCxcbiAgICAgICAgICAgIGVsZW1Cb3R0b20gPSBlbGVtVG9wICsgJGVsZW1lbnQuaGVpZ2h0KCk7XG4gICAgICAgIHJldHVybiAoKGVsZW1Cb3R0b20gPD0gZG9jVmlld0JvdHRvbSkgJiYgKGVsZW1Ub3AgPj0gZG9jVmlld1RvcCkpO1xuICAgIH07XG5cbiAgICAvL1xuICAgIC8vIFBVQkxJQyBGVU5DVElPTlNcbiAgICAvL1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBhY3RpdmF0ZXMgYSB0YWJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gc3RvcFJvdGF0aW9uIC0gRGVmaW5lcyBpZiB0aGUgdGFiIHJvdGF0aW9uIHNob3VsZCBzdG9wIGFmdGVyIGFjdGl2YXRpb25cbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbih0YWJSZWYsIHN0b3BSb3RhdGlvbikge1xuICAgICAgICB2YXIgZSA9IGpRdWVyeS5FdmVudCgndGFicy1hY3RpdmF0ZScpO1xuICAgICAgICB2YXIgb1RhYiA9IHRoaXMuX2dldFRhYih0YWJSZWYpO1xuICAgICAgICBpZighb1RhYi5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5fb3BlblRhYihlLCBvVGFiLCB0cnVlLCBzdG9wUm90YXRpb24gfHwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBkZWFjdGl2YXRlcyBhIHRhYlxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gdGFiUmVmIC0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbih0YWJSZWYpIHtcbiAgICAgICAgdmFyIGUgPSBqUXVlcnkuRXZlbnQoJ3RhYnMtZGVjdGl2YXRlJyk7XG4gICAgICAgIHZhciBvVGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XG4gICAgICAgIGlmKCFvVGFiLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9jbG9zZVRhYihlLCBvVGFiKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGVuYWJsZXMgYSB0YWJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbih0YWJSZWYpIHtcbiAgICAgICAgdmFyIG9UYWIgPSB0aGlzLl9nZXRUYWIodGFiUmVmKTtcbiAgICAgICAgaWYob1RhYil7XG4gICAgICAgICAgICBvVGFiLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICBvVGFiLnRhYi5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xuICAgICAgICAgICAgb1RhYi5hY2NvcmRpb25UYWIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURpc2FibGVkKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGRpc2FibGUgYSB0YWJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24odGFiUmVmKSB7XG4gICAgICAgIHZhciBvVGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XG4gICAgICAgIGlmKG9UYWIpe1xuICAgICAgICAgICAgb1RhYi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBvVGFiLnRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xuICAgICAgICAgICAgb1RhYi5hY2NvcmRpb25UYWIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURpc2FibGVkKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGdldHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHBsdWdpblxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFN0YXRlIG9mIHRoZSBwbHVnaW5cbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gc3RhcnRzIHRoZSByb3RhdGlvbiBvZiB0aGUgdGFic1xuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gc3BlZWQgLSBUaGUgc3BlZWQgb2YgdGhlIHJvdGF0aW9uXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLnN0YXJ0Um90YXRpb24gPSBmdW5jdGlvbihzcGVlZCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyBNYWtlIHN1cmUgbm90IGFsbCB0YWJzIGFyZSBkaXNhYmxlZFxuICAgICAgICBpZih0aGlzLnRhYnMubGVuZ3RoID4gdGhpcy5vcHRpb25zLmRpc2FibGVkLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5yb3RhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSBqUXVlcnkuRXZlbnQoJ3JvdGF0ZScpO1xuICAgICAgICAgICAgICAgIF90aGlzLl9vcGVuVGFiKGUsIF90aGlzLl9nZXRUYWIoX3RoaXMuX2dldE5leHRUYWJSZWYoKSksIHRydWUpO1xuICAgICAgICAgICAgfSwgc3BlZWQgfHwgKCgkLmlzTnVtZXJpYyhfdGhpcy5vcHRpb25zLnJvdGF0ZSkpID8gX3RoaXMub3B0aW9ucy5yb3RhdGUgOiA0MDAwKSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUm90YXRpb24gaXMgbm90IHBvc3NpYmxlIGlmIGFsbCB0YWJzIGFyZSBkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHN0b3BzIHRoZSByb3RhdGlvbiBvZiB0aGUgdGFic1xuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5zdG9wUm90YXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yb3RhdGVJbnRlcnZhbCk7XG4gICAgICAgIHRoaXMucm90YXRlSW50ZXJ2YWwgPSAwO1xuICAgIH07XG5cbiAgICAvKiogalF1ZXJ5IHdyYXBwZXIgKi9cbiAgICAkLmZuLnJlc3BvbnNpdmVUYWJzID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghJC5kYXRhKHRoaXMsICdyZXNwb25zaXZldGFicycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAncmVzcG9uc2l2ZXRhYnMnLCBuZXcgUmVzcG9uc2l2ZVRhYnMoIHRoaXMsIG9wdGlvbnMgKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnICYmIG9wdGlvbnNbMF0gIT09ICdfJyAmJiBvcHRpb25zICE9PSAnaW5pdCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9ICQuZGF0YSh0aGlzLCAncmVzcG9uc2l2ZXRhYnMnKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJlc3BvbnNpdmVUYWJzICYmIHR5cGVvZiBpbnN0YW5jZVtvcHRpb25zXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVtvcHRpb25zXS5hcHBseSggaW5zdGFuY2UsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmdzLCAxICkgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBbGxvdyBpbnN0YW5jZXMgdG8gYmUgZGVzdHJveWVkIHZpYSB0aGUgJ2Rlc3Ryb3knIG1ldGhvZFxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogZGVzdHJveSBpbnN0YW5jZSBjbGFzc2VzLCBldGNcbiAgICAgICAgICAgICAgICAgICAgJC5kYXRhKHRoaXMsICdyZXNwb25zaXZldGFicycsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxufShqUXVlcnksIHdpbmRvdykpO1xuIl19
