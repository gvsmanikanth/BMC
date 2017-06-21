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

            // DXP-686
            // e.preventDefault();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnJlc3BvbnNpdmVUYWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiAgUHJvamVjdDoganF1ZXJ5LnJlc3BvbnNpdmVUYWJzLmpzXG4gKiAgRGVzY3JpcHRpb246IEEgcGx1Z2luIHRoYXQgY3JlYXRlcyByZXNwb25zaXZlIHRhYnMsIG9wdGltaXplZCBmb3IgYWxsIGRldmljZXNcbiAqICBBdXRob3I6IEplbGxlIEtyYWx0IChqZWxsZUBqZWxsZWtyYWx0Lm5sKVxuICogIFZlcnNpb246IDEuNC41XG4gKiAgTGljZW5zZTogTUlUXG4gKi9cblxuOyhmdW5jdGlvbiAoICQsIHdpbmRvdywgdW5kZWZpbmVkICkge1xuXG4gICAgLyoqIERlZmF1bHQgc2V0dGluZ3MgKi9cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIGFjdGl2ZTogbnVsbCxcbiAgICAgICAgZXZlbnQ6ICdjbGljaycsXG4gICAgICAgIGRpc2FibGVkOiBbXSxcbiAgICAgICAgY29sbGFwc2libGU6ICdhY2NvcmRpb24nLFxuICAgICAgICBzdGFydENvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgIHJvdGF0ZTogZmFsc2UsXG4gICAgICAgIHNldEhhc2g6IGZhbHNlLFxuICAgICAgICBhbmltYXRpb246ICdkZWZhdWx0JyxcbiAgICAgICAgYW5pbWF0aW9uUXVldWU6IGZhbHNlLFxuICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICBzY3JvbGxUb0FjY29yZGlvbjogZmFsc2UsXG4gICAgICAgIGFjdGl2YXRlOiBmdW5jdGlvbigpe30sXG4gICAgICAgIGRlYWN0aXZhdGU6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgbG9hZDogZnVuY3Rpb24oKXt9LFxuICAgICAgICBhY3RpdmF0ZVN0YXRlOiBmdW5jdGlvbigpe30sXG4gICAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgICAgIHN0YXRlRGVmYXVsdDogJ3ItdGFicy1zdGF0ZS1kZWZhdWx0JyxcbiAgICAgICAgICAgIHN0YXRlQWN0aXZlOiAnci10YWJzLXN0YXRlLWFjdGl2ZScsXG4gICAgICAgICAgICBzdGF0ZURpc2FibGVkOiAnci10YWJzLXN0YXRlLWRpc2FibGVkJyxcbiAgICAgICAgICAgIHN0YXRlRXhjbHVkZWQ6ICdyLXRhYnMtc3RhdGUtZXhjbHVkZWQnLFxuICAgICAgICAgICAgdGFiOiAnci10YWJzLXRhYicsXG4gICAgICAgICAgICBhbmNob3I6ICdyLXRhYnMtYW5jaG9yJyxcbiAgICAgICAgICAgIHBhbmVsOiAnci10YWJzLXBhbmVsJyxcbiAgICAgICAgICAgIGFjY29yZGlvblRpdGxlOiAnci10YWJzLWFjY29yZGlvbi10aXRsZSdcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXNwb25zaXZlIFRhYnNcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudCAtIFRoZSBIVE1MIGVsZW1lbnQgdGhlIHZhbGlkYXRvciBzaG91bGQgYmUgYm91bmQgdG9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIEFuIG9wdGlvbiBtYXBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBSZXNwb25zaXZlVGFicyhlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7IC8vIFNlbGVjdGVkIERPTSBlbGVtZW50XG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpOyAvLyBTZWxlY3RlZCBqUXVlcnkgZWxlbWVudFxuXG4gICAgICAgIHRoaXMudGFicyA9IFtdOyAvLyBDcmVhdGUgdGFicyBhcnJheVxuICAgICAgICB0aGlzLnN0YXRlID0gJyc7IC8vIERlZmluZSB0aGUgcGx1Z2luIHN0YXRlICh0YWJzL2FjY29yZGlvbilcbiAgICAgICAgdGhpcy5yb3RhdGVJbnRlcnZhbCA9IDA7IC8vIERlZmluZSByb3RhdGUgaW50ZXJ2YWxcbiAgICAgICAgdGhpcy4kcXVldWUgPSAkKHt9KTtcblxuICAgICAgICAvLyBFeHRlbmQgdGhlIGRlZmF1bHRzIHdpdGggdGhlIHBhc3NlZCBvcHRpb25zXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKCB7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBpbml0aWFsaXplcyB0aGUgdGFiIHBsdWdpblxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIC8vIExvYWQgYWxsIHRoZSBlbGVtZW50c1xuICAgICAgICB0aGlzLnRhYnMgPSB0aGlzLl9sb2FkRWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5fbG9hZENsYXNzZXMoKTtcbiAgICAgICAgdGhpcy5fbG9hZEV2ZW50cygpO1xuXG4gICAgICAgIC8vIFdpbmRvdyByZXNpemUgYmluZCB0byBjaGVjayBzdGF0ZVxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIF90aGlzLl9zZXRTdGF0ZShlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSGFzaGNoYW5nZSBldmVudFxuICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgdGFiUmVmID0gX3RoaXMuX2dldFRhYlJlZkJ5U2VsZWN0b3Iod2luZG93LmxvY2F0aW9uLmhhc2gpO1xuICAgICAgICAgICAgdmFyIG9UYWIgPSBfdGhpcy5fZ2V0VGFiKHRhYlJlZik7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGEgdGFiIGlzIGZvdW5kIHRoYXQgbWF0Y2hlcyB0aGUgaGFzaFxuICAgICAgICAgICAgaWYodGFiUmVmID49IDAgJiYgIW9UYWIuX2lnbm9yZUhhc2hDaGFuZ2UgJiYgIW9UYWIuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBzbywgb3BlbiB0aGUgdGFiIGFuZCBhdXRvIGNsb3NlIHRoZSBjdXJyZW50IG9uZVxuICAgICAgICAgICAgICAgIF90aGlzLl9vcGVuVGFiKGUsIF90aGlzLl9nZXRUYWIodGFiUmVmKSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFN0YXJ0IHJvdGF0ZSBldmVudCBpZiByb3RhdGUgb3B0aW9uIGlzIGRlZmluZWRcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLnJvdGF0ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRSb3RhdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRGVmaW5lIHBsdWdpbiBldmVudHNcbiAgICAgICAgLy9cblxuICAgICAgICAvLyBBY3RpdmF0ZTogdGhpcyBldmVudCBpcyBjYWxsZWQgd2hlbiBhIHRhYiBpcyBzZWxlY3RlZFxuICAgICAgICB0aGlzLiRlbGVtZW50LmJpbmQoJ3RhYnMtYWN0aXZhdGUnLCBmdW5jdGlvbihlLCBvVGFiKSB7XG4gICAgICAgICAgICBfdGhpcy5vcHRpb25zLmFjdGl2YXRlLmNhbGwodGhpcywgZSwgb1RhYik7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBEZWFjdGl2YXRlOiB0aGlzIGV2ZW50IGlzIGNhbGxlZCB3aGVuIGEgdGFiIGlzIGNsb3NlZFxuICAgICAgICB0aGlzLiRlbGVtZW50LmJpbmQoJ3RhYnMtZGVhY3RpdmF0ZScsIGZ1bmN0aW9uKGUsIG9UYWIpIHtcbiAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuZGVhY3RpdmF0ZS5jYWxsKHRoaXMsIGUsIG9UYWIpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQWN0aXZhdGUgU3RhdGU6IHRoaXMgZXZlbnQgaXMgY2FsbGVkIHdoZW4gdGhlIHBsdWdpbiBzd2l0Y2hlcyBzdGF0ZXNcbiAgICAgICAgdGhpcy4kZWxlbWVudC5iaW5kKCd0YWJzLWFjdGl2YXRlLXN0YXRlJywgZnVuY3Rpb24oZSwgc3RhdGUpIHtcbiAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuYWN0aXZhdGVTdGF0ZS5jYWxsKHRoaXMsIGUsIHN0YXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTG9hZDogdGhpcyBldmVudCBpcyBjYWxsZWQgd2hlbiB0aGUgcGx1Z2luIGhhcyBiZWVuIGxvYWRlZFxuICAgICAgICB0aGlzLiRlbGVtZW50LmJpbmQoJ3RhYnMtbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBzdGFydFRhYjtcblxuICAgICAgICAgICAgX3RoaXMuX3NldFN0YXRlKGUpOyAvLyBTZXQgc3RhdGVcblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBhbmVsIHNob3VsZCBiZSBjb2xsYXBlZCBvbiBsb2FkXG4gICAgICAgICAgICBpZihfdGhpcy5vcHRpb25zLnN0YXJ0Q29sbGFwc2VkICE9PSB0cnVlICYmICEoX3RoaXMub3B0aW9ucy5zdGFydENvbGxhcHNlZCA9PT0gJ2FjY29yZGlvbicgJiYgX3RoaXMuc3RhdGUgPT09ICdhY2NvcmRpb24nKSkge1xuXG4gICAgICAgICAgICAgICAgc3RhcnRUYWIgPSBfdGhpcy5fZ2V0U3RhcnRUYWIoKTtcblxuICAgICAgICAgICAgICAgIC8vIE9wZW4gdGhlIGluaXRpYWwgdGFiXG4gICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgc3RhcnRUYWIpOyAvLyBPcGVuIGZpcnN0IHRhYlxuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICBfdGhpcy5vcHRpb25zLmxvYWQuY2FsbCh0aGlzLCBlLCBzdGFydFRhYik7IC8vIENhbGwgdGhlIGxvYWQgY2FsbGJhY2tcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFRyaWdnZXIgbG9hZGVkIGV2ZW50XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndGFicy1sb2FkJyk7XG4gICAgfTtcblxuICAgIC8vXG4gICAgLy8gUFJJVkFURSBGVU5DVElPTlNcbiAgICAvL1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBsb2FkcyB0aGUgdGFiIGVsZW1lbnRzIGFuZCBzdG9yZXMgdGhlbSBpbiBhbiBhcnJheVxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgdGFiIGVsZW1lbnRzXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9sb2FkRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyICR1bCA9IHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oJ3VsJyk7XG4gICAgICAgIHZhciB0YWJzID0gW107XG4gICAgICAgIHZhciBpZCA9IDA7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBjbGFzc2VzIHRvIHRoZSBiYXNpYyBodG1sIGVsZW1lbnRzXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ3ItdGFicycpOyAvLyBUYWIgY29udGFpbmVyXG4gICAgICAgICR1bC5hZGRDbGFzcygnci10YWJzLW5hdicpOyAvLyBMaXN0IGNvbnRhaW5lclxuXG4gICAgICAgIC8vIEdldCB0YWIgYnV0dG9ucyBhbmQgc3RvcmUgdGhlaXIgZGF0YSBpbiBhbiBhcnJheVxuICAgICAgICAkKCdsaScsICR1bCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGFiID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBpc0V4Y2x1ZGVkID0gJHRhYi5oYXNDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVFeGNsdWRlZCk7XG4gICAgICAgICAgICB2YXIgJGFuY2hvciwgJHBhbmVsLCAkYWNjb3JkaW9uVGFiLCAkYWNjb3JkaW9uQW5jaG9yLCBwYW5lbFNlbGVjdG9yO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgdGFiIHNob3VsZCBiZSBleGNsdWRlZFxuICAgICAgICAgICAgaWYoIWlzRXhjbHVkZWQpIHtcblxuICAgICAgICAgICAgICAgICRhbmNob3IgPSAkKCdhJywgJHRhYik7XG4gICAgICAgICAgICAgICAgcGFuZWxTZWxlY3RvciA9ICRhbmNob3IuYXR0cignaHJlZicpO1xuICAgICAgICAgICAgICAgICRwYW5lbCA9ICQocGFuZWxTZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgJGFjY29yZGlvblRhYiA9ICQoJzxkaXY+PC9kaXY+JykuaW5zZXJ0QmVmb3JlKCRwYW5lbCk7XG4gICAgICAgICAgICAgICAgJGFjY29yZGlvbkFuY2hvciA9ICQoJzxhPjwvYT4nKS5hdHRyKCdocmVmJywgcGFuZWxTZWxlY3RvcikuaHRtbCgkYW5jaG9yLmh0bWwoKSkuYXBwZW5kVG8oJGFjY29yZGlvblRhYik7XG5cbiAgICAgICAgICAgICAgICB2YXIgb1RhYiA9IHtcbiAgICAgICAgICAgICAgICAgICAgX2lnbm9yZUhhc2hDaGFuZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiAoJC5pbkFycmF5KGlkLCBfdGhpcy5vcHRpb25zLmRpc2FibGVkKSAhPT0gLTEpLFxuICAgICAgICAgICAgICAgICAgICB0YWI6ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogJCgnYScsICR0YWIpLFxuICAgICAgICAgICAgICAgICAgICBwYW5lbDogJHBhbmVsLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogcGFuZWxTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgYWNjb3JkaW9uVGFiOiAkYWNjb3JkaW9uVGFiLFxuICAgICAgICAgICAgICAgICAgICBhY2NvcmRpb25BbmNob3I6ICRhY2NvcmRpb25BbmNob3IsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gMXVwIHRoZSBJRFxuICAgICAgICAgICAgICAgIGlkKys7XG4gICAgICAgICAgICAgICAgLy8gQWRkIHRvIHRhYiBhcnJheVxuICAgICAgICAgICAgICAgIHRhYnMucHVzaChvVGFiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0YWJzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBjbGFzc2VzIHRvIHRoZSB0YWIgZWxlbWVudHMgYmFzZWQgb24gdGhlIG9wdGlvbnNcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2xvYWRDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS50YWIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy50YWIpO1xuICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFuY2hvci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5hbmNob3IpO1xuICAgICAgICAgICAgdGhpcy50YWJzW2ldLnBhbmVsLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMucGFuZWwpO1xuICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFjY29yZGlvblRhYi5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5hY2NvcmRpb25UaXRsZSk7XG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0uYWNjb3JkaW9uQW5jaG9yLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmFuY2hvcik7XG4gICAgICAgICAgICBpZih0aGlzLnRhYnNbaV0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhYnNbaV0udGFiLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEaXNhYmxlZCk7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xuICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGV2ZW50cyB0byB0aGUgdGFiIGVsZW1lbnRzXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9sb2FkRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgLy8gRGVmaW5lIGFjdGl2YXRlIGV2ZW50IG9uIGEgdGFiIGVsZW1lbnRcbiAgICAgICAgdmFyIGZBY3RpdmF0ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gX3RoaXMuX2dldEN1cnJlbnRUYWIoKTsgLy8gRmV0Y2ggY3VycmVudCB0YWJcbiAgICAgICAgICAgIHZhciBhY3RpdmF0ZWRUYWIgPSBlLmRhdGEudGFiO1xuXG4gICAgICAgICAgICAvLyBEWFAtNjg2XG4gICAgICAgICAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGlzIHRhYiBpc24ndCBkaXNhYmxlZFxuICAgICAgICAgICAgaWYoIWFjdGl2YXRlZFRhYi5kaXNhYmxlZCkge1xuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgaGFzaCBoYXMgdG8gYmUgc2V0IGluIHRoZSBVUkwgbG9jYXRpb25cbiAgICAgICAgICAgICAgICBpZihfdGhpcy5vcHRpb25zLnNldEhhc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBoYXNoIHVzaW5nIHRoZSBoaXN0b3J5IGFwaSBpZiBhdmFpbGFibGUgdG8gdGFja2xlIENocm9tZXMgcmVwYWludCBidWcgb24gaGFzaCBjaGFuZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYoaGlzdG9yeS5wdXNoU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIGFjdGl2YXRlZFRhYi5zZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgZmFsbGJhY2sgdG8gdGhlIGhhc2ggdXBkYXRlIGZvciBzaXRlcyB0aGF0IGRvbid0IHN1cHBvcnQgdGhlIGhpc3RvcnkgYXBpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGFjdGl2YXRlZFRhYi5zZWxlY3RvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGUuZGF0YS50YWIuX2lnbm9yZUhhc2hDaGFuZ2UgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGFjdGl2YXRlZCB0YWIgaXNudCB0aGUgY3VycmVudCBvbmUgb3IgaWYgaXRzIGNvbGxhcHNpYmxlLiBJZiBub3QsIGRvIG5vdGhpbmdcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50ICE9PSBhY3RpdmF0ZWRUYWIgfHwgX3RoaXMuX2lzQ29sbGFwaXNibGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgYWN0aXZhdGVkIHRhYiBpcyBlaXRoZXIgYW5vdGhlciB0YWIgb2YgdGhlIGN1cnJlbnQgb25lLiBJZiBpdCdzIHRoZSBjdXJyZW50IHRhYiBpdCBpcyBjb2xsYXBzaWJsZVxuICAgICAgICAgICAgICAgICAgICAvLyBFaXRoZXIgd2F5LCB0aGUgY3VycmVudCB0YWIgY2FuIGJlIGNsb3NlZFxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY2xvc2VUYWIoZSwgY3VycmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGFjdGl2YXRlZCB0YWIgaXNudCB0aGUgY3VycmVudCBvbmUgb3IgaWYgaXQgaXNudCBjb2xsYXBzaWJsZVxuICAgICAgICAgICAgICAgICAgICBpZihjdXJyZW50ICE9PSBhY3RpdmF0ZWRUYWIgfHwgIV90aGlzLl9pc0NvbGxhcGlzYmxlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vcGVuVGFiKGUsIGFjdGl2YXRlZFRhYiwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIExvb3AgdGFic1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy50YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBBZGQgYWN0aXZhdGUgZnVuY3Rpb24gdG8gdGhlIHRhYiBhbmQgYWNjb3JkaW9uIHNlbGVjdGlvbiBlbGVtZW50XG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0uYW5jaG9yLm9uKF90aGlzLm9wdGlvbnMuZXZlbnQsIHt0YWI6IF90aGlzLnRhYnNbaV19LCBmQWN0aXZhdGUpO1xuICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFjY29yZGlvbkFuY2hvci5vbihfdGhpcy5vcHRpb25zLmV2ZW50LCB7dGFiOiBfdGhpcy50YWJzW2ldfSwgZkFjdGl2YXRlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGdldHMgdGhlIHRhYiB0aGF0IHNob3VsZCBiZSBvcGVuZWQgYXQgc3RhcnRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUYWIgb2JqZWN0XG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRTdGFydFRhYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGFiUmVmID0gdGhpcy5fZ2V0VGFiUmVmQnlTZWxlY3Rvcih3aW5kb3cubG9jYXRpb24uaGFzaCk7XG4gICAgICAgIHZhciBzdGFydFRhYjtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGFnZSBoYXMgYSBoYXNoIHNldCB0aGF0IGlzIGxpbmtlZCB0byBhIHRhYlxuICAgICAgICBpZih0YWJSZWYgPj0gMCAmJiAhdGhpcy5fZ2V0VGFiKHRhYlJlZikuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIC8vIElmIHNvLCBzZXQgdGhlIGN1cnJlbnQgdGFiIHRvIHRoZSBsaW5rZWQgdGFiXG4gICAgICAgICAgICBzdGFydFRhYiA9IHRoaXMuX2dldFRhYih0YWJSZWYpO1xuICAgICAgICB9IGVsc2UgaWYodGhpcy5vcHRpb25zLmFjdGl2ZSA+IDAgJiYgIXRoaXMuX2dldFRhYih0aGlzLm9wdGlvbnMuYWN0aXZlKS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgc3RhcnRUYWIgPSB0aGlzLl9nZXRUYWIodGhpcy5vcHRpb25zLmFjdGl2ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiBub3QsIGp1c3QgZ2V0IHRoZSBmaXJzdCBvbmVcbiAgICAgICAgICAgIHN0YXJ0VGFiID0gdGhpcy5fZ2V0VGFiKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YXJ0VGFiO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHNldHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHBsdWdpblxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBUaGUgZXZlbnQgdGhhdCB0cmlnZ2VycyB0aGUgc3RhdGUgY2hhbmdlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9zZXRTdGF0ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICR1bCA9ICQoJ3VsJywgdGhpcy4kZWxlbWVudCk7XG4gICAgICAgIHZhciBvbGRTdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHZhciBzdGFydENvbGxhcHNlZElzU3RhdGUgPSAodHlwZW9mIHRoaXMub3B0aW9ucy5zdGFydENvbGxhcHNlZCA9PT0gJ3N0cmluZycpO1xuICAgICAgICB2YXIgc3RhcnRUYWI7XG5cbiAgICAgICAgLy8gVGhlIHN0YXRlIGlzIGJhc2VkIG9uIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSB0YWJzIGxpc3RcbiAgICAgICAgaWYoJHVsLmlzKCc6dmlzaWJsZScpKXtcbiAgICAgICAgICAgIC8vIFRhYiBsaXN0IGlzIHZpc2libGUsIHNvIHRoZSBzdGF0ZSBpcyAndGFicydcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAndGFicyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUYWIgbGlzdCBpcyBpbnZpc2libGUsIHNvIHRoZSBzdGF0ZSBpcyAnYWNjb3JkaW9uJ1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdhY2NvcmRpb24nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIG5ldyBzdGF0ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgb2xkIHN0YXRlXG4gICAgICAgIGlmKHRoaXMuc3RhdGUgIT09IG9sZFN0YXRlKSB7XG4gICAgICAgICAgICAvLyBJZiBzbywgdGhlIHN0YXRlIGFjdGl2YXRlIHRyaWdnZXIgbXVzdCBiZSBjYWxsZWRcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndGFicy1hY3RpdmF0ZS1zdGF0ZScsIHtvbGRTdGF0ZTogb2xkU3RhdGUsIG5ld1N0YXRlOiB0aGlzLnN0YXRlfSk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBzdGF0ZSBzd2l0Y2ggc2hvdWxkIG9wZW4gYSB0YWJcbiAgICAgICAgICAgIGlmKG9sZFN0YXRlICYmIHN0YXJ0Q29sbGFwc2VkSXNTdGF0ZSAmJiB0aGlzLm9wdGlvbnMuc3RhcnRDb2xsYXBzZWQgIT09IHRoaXMuc3RhdGUgJiYgdGhpcy5fZ2V0Q3VycmVudFRhYigpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgaW5pdGlhbCB0YWJcbiAgICAgICAgICAgICAgICBzdGFydFRhYiA9IHRoaXMuX2dldFN0YXJ0VGFiKGUpO1xuICAgICAgICAgICAgICAgIC8vIE9wZW4gdGhlIGluaXRpYWwgdGFiXG4gICAgICAgICAgICAgICAgdGhpcy5fb3BlblRhYihlLCBzdGFydFRhYik7IC8vIE9wZW4gZmlyc3QgdGFiXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBvcGVucyBhIHRhYlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBUaGUgZXZlbnQgdGhhdCB0cmlnZ2VycyB0aGUgdGFiIG9wZW5pbmdcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1RhYiAtIFRoZSB0YWIgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIG9wZW5lZFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gY2xvc2VDdXJyZW50IC0gRGVmaW5lcyBpZiB0aGUgY3VycmVudCB0YWIgc2hvdWxkIGJlIGNsb3NlZFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gc3RvcFJvdGF0aW9uIC0gRGVmaW5lcyBpZiB0aGUgdGFiIHJvdGF0aW9uIGxvb3Agc2hvdWxkIGJlIHN0b3BwZWRcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX29wZW5UYWIgPSBmdW5jdGlvbihlLCBvVGFiLCBjbG9zZUN1cnJlbnQsIHN0b3BSb3RhdGlvbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBjdXJyZW50IHRhYiBoYXMgdG8gYmUgY2xvc2VkXG4gICAgICAgIGlmKGNsb3NlQ3VycmVudCkge1xuICAgICAgICAgICAgdGhpcy5fY2xvc2VUYWIoZSwgdGhpcy5fZ2V0Q3VycmVudFRhYigpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSByb3RhdGlvbiBoYXMgdG8gYmUgc3RvcHBlZCB3aGVuIGFjdGl2YXRlZFxuICAgICAgICBpZihzdG9wUm90YXRpb24gJiYgdGhpcy5yb3RhdGVJbnRlcnZhbCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcFJvdGF0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhpcyB0YWIgdG8gYWN0aXZlXG4gICAgICAgIG9UYWIuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgLy8gU2V0IGFjdGl2ZSBjbGFzc2VzIHRvIHRoZSB0YWIgYnV0dG9uIGFuZCBhY2NvcmRpb24gdGFiIGJ1dHRvblxuICAgICAgICBvVGFiLnRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpO1xuICAgICAgICBvVGFiLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpO1xuXG4gICAgICAgIC8vIFJ1biBwYW5lbCB0cmFuc2l0b25cbiAgICAgICAgX3RoaXMuX2RvVHJhbnNpdGlvbihvVGFiLnBhbmVsLCBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbiwgJ29wZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFdoZW4gZmluaXNoZWQsIHNldCBhY3RpdmUgY2xhc3MgdG8gdGhlIHBhbmVsXG4gICAgICAgICAgICBvVGFiLnBhbmVsLnJlbW92ZUNsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZUFjdGl2ZSk7XG5cbiAgICAgICAgICAgLy8gQW5kIGlmIGVuYWJsZWQgYW5kIHN0YXRlIGlzIGFjY29yZGlvbiwgc2Nyb2xsIHRvIHRoZSBhY2NvcmRpb24gdGFiXG4gICAgICAgICAgICBpZihfdGhpcy5nZXRTdGF0ZSgpID09PSAnYWNjb3JkaW9uJyAmJiBfdGhpcy5vcHRpb25zLnNjcm9sbFRvQWNjb3JkaW9uICYmICghX3RoaXMuX2lzSW5WaWV3KG9UYWIuYWNjb3JkaW9uVGFiKSB8fCBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbiAhPT0gJ2RlZmF1bHQnKSkge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBhbmltYXRpb24gb3B0aW9uIGlzIGVuYWJsZWQsIGFuZCBpZiB0aGUgZHVyYXRpb24gaXNuJ3QgMFxuICAgICAgICAgICAgICAgIGlmKF90aGlzLm9wdGlvbnMuYW5pbWF0aW9uICE9PSAnZGVmYXVsdCcgJiYgX3RoaXMub3B0aW9ucy5kdXJhdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgc28sIHNldCBzY3JvbGxUb3Agd2l0aCBhbmltYXRlIGFuZCB1c2UgdGhlICdhbmltYXRpb24nIGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogb1RhYi5hY2NvcmRpb25UYWIub2Zmc2V0KCkudG9wXG4gICAgICAgICAgICAgICAgICAgIH0sIF90aGlzLm9wdGlvbnMuZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICBJZiBub3QsIGp1c3Qgc2V0IHNjcm9sbFRvcFxuICAgICAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc2Nyb2xsVG9wKG9UYWIuYWNjb3JkaW9uVGFiLm9mZnNldCgpLnRvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3RhYnMtYWN0aXZhdGUnLCBvVGFiKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBjbG9zZXMgYSB0YWJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gVGhlIGV2ZW50IHRoYXQgaXMgdHJpZ2dlcmVkIHdoZW4gYSB0YWIgaXMgY2xvc2VkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9UYWIgLSBUaGUgdGFiIG9iamVjdCB0aGF0IHNob3VsZCBiZSBjbG9zZWRcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2Nsb3NlVGFiID0gZnVuY3Rpb24oZSwgb1RhYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgZG9RdWV1ZU9uU3RhdGUgPSB0eXBlb2YgX3RoaXMub3B0aW9ucy5hbmltYXRpb25RdWV1ZSA9PT0gJ3N0cmluZyc7XG4gICAgICAgIHZhciBkb1F1ZXVlO1xuXG4gICAgICAgIGlmKG9UYWIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYoZG9RdWV1ZU9uU3RhdGUgJiYgX3RoaXMuZ2V0U3RhdGUoKSA9PT0gX3RoaXMub3B0aW9ucy5hbmltYXRpb25RdWV1ZSkge1xuICAgICAgICAgICAgICAgIGRvUXVldWUgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGRvUXVldWVPblN0YXRlKSB7XG4gICAgICAgICAgICAgICAgZG9RdWV1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb1F1ZXVlID0gX3RoaXMub3B0aW9ucy5hbmltYXRpb25RdWV1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGVhY3RpdmF0ZSB0YWJcbiAgICAgICAgICAgIG9UYWIuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAvLyBTZXQgZGVmYXVsdCBjbGFzcyB0byB0aGUgdGFiIGJ1dHRvblxuICAgICAgICAgICAgb1RhYi50YWIucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KTtcblxuICAgICAgICAgICAgLy8gUnVuIHBhbmVsIHRyYW5zaXRpb25cbiAgICAgICAgICAgIF90aGlzLl9kb1RyYW5zaXRpb24ob1RhYi5wYW5lbCwgX3RoaXMub3B0aW9ucy5hbmltYXRpb24sICdjbG9zZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIFNldCBkZWZhdWx0IGNsYXNzIHRvIHRoZSBhY2NvcmRpb24gdGFiIGJ1dHRvbiBhbmQgdGFiIHBhbmVsXG4gICAgICAgICAgICAgICAgb1RhYi5hY2NvcmRpb25UYWIucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KTtcbiAgICAgICAgICAgICAgICBvVGFiLnBhbmVsLnJlbW92ZUNsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZUFjdGl2ZSkuYWRkQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCk7XG4gICAgICAgICAgICB9LCAhZG9RdWV1ZSk7XG5cbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndGFicy1kZWFjdGl2YXRlJywgb1RhYik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBydW5zIGFuIGVmZmVjdCBvbiBhIHBhbmVsXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBwYW5lbCAtIFRoZSBIVE1MIGVsZW1lbnQgb2YgdGhlIHRhYiBwYW5lbFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2QgLSBUaGUgdHJhbnNpdGlvbiBtZXRob2QgcmVmZXJlbmNlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlIC0gVGhlIHN0YXRlIChvcGVuL2Nsb3NlZCkgdGhhdCB0aGUgcGFuZWwgc2hvdWxkIHRyYW5zaXRpb24gdG9cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBhZnRlciB0aGUgdHJhbnNpdGlvblxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVxdWV1ZSAtIERlZmluZXMgaWYgdGhlIGV2ZW50IHF1ZXVlIHNob3VsZCBiZSBkZXF1ZXVlZCBhZnRlciB0aGUgdHJhbnNpdGlvblxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZG9UcmFuc2l0aW9uID0gZnVuY3Rpb24ocGFuZWwsIG1ldGhvZCwgc3RhdGUsIGNhbGxiYWNrLCBkZXF1ZXVlKSB7XG4gICAgICAgIHZhciBlZmZlY3Q7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgLy8gR2V0IGVmZmVjdCBiYXNlZCBvbiBtZXRob2RcbiAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICAgICAgY2FzZSAnc2xpZGUnOlxuICAgICAgICAgICAgICAgIGVmZmVjdCA9IChzdGF0ZSA9PT0gJ29wZW4nKSA/ICdzbGlkZURvd24nIDogJ3NsaWRlVXAnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZmFkZSc6XG4gICAgICAgICAgICAgICAgZWZmZWN0ID0gKHN0YXRlID09PSAnb3BlbicpID8gJ2ZhZGVJbicgOiAnZmFkZU91dCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGVmZmVjdCA9IChzdGF0ZSA9PT0gJ29wZW4nKSA/ICdzaG93JyA6ICdoaWRlJztcbiAgICAgICAgICAgICAgICAvLyBXaGVuIGRlZmF1bHQgaXMgdXNlZCwgc2V0IHRoZSBkdXJhdGlvbiB0byAwXG4gICAgICAgICAgICAgICAgX3RoaXMub3B0aW9ucy5kdXJhdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgdGhlIHRyYW5zaXRpb24gdG8gYSBjdXN0b20gcXVldWVcbiAgICAgICAgdGhpcy4kcXVldWUucXVldWUoJ3Jlc3BvbnNpdmUtdGFicycsZnVuY3Rpb24obmV4dCl7XG4gICAgICAgICAgICAvLyBSdW4gdGhlIHRyYW5zaXRpb24gb24gdGhlIHBhbmVsXG4gICAgICAgICAgICBwYW5lbFtlZmZlY3RdKHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogX3RoaXMub3B0aW9ucy5kdXJhdGlvbixcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwocGFuZWwsIG1ldGhvZCwgc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBSdW4gdGhlIG5leHQgZnVuY3Rpb24gaW4gdGhlIHF1ZXVlXG4gICAgICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV2hlbiB0aGUgcGFuZWwgaXMgb3BlbmVuZCwgZGVxdWV1ZSBldmVyeXRoaW5nIHNvIHRoZSBhbmltYXRpb24gc3RhcnRzXG4gICAgICAgIGlmKHN0YXRlID09PSAnb3BlbicgfHwgZGVxdWV1ZSkge1xuICAgICAgICAgICAgdGhpcy4kcXVldWUuZGVxdWV1ZSgncmVzcG9uc2l2ZS10YWJzJyk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGNvbGxhcHNpYmlsaXR5IG9mIHRoZSB0YWIgaW4gdGhpcyBzdGF0ZVxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBUaGUgY29sbGFwc2liaWxpdHkgb2YgdGhlIHRhYlxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5faXNDb2xsYXBpc2JsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHR5cGVvZiB0aGlzLm9wdGlvbnMuY29sbGFwc2libGUgPT09ICdib29sZWFuJyAmJiB0aGlzLm9wdGlvbnMuY29sbGFwc2libGUpIHx8ICh0eXBlb2YgdGhpcy5vcHRpb25zLmNvbGxhcHNpYmxlID09PSAnc3RyaW5nJyAmJiB0aGlzLm9wdGlvbnMuY29sbGFwc2libGUgPT09IHRoaXMuZ2V0U3RhdGUoKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhIHRhYiBieSBudW1lcmljIHJlZmVyZW5jZVxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gbnVtUmVmIC0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGFiIG9iamVjdFxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0VGFiID0gZnVuY3Rpb24obnVtUmVmKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhYnNbbnVtUmVmXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBudW1lcmljIHRhYiByZWZlcmVuY2UgYmFzZWQgb24gYSBoYXNoIHNlbGVjdG9yXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIC0gSGFzaCBzZWxlY3RvclxuICAgICAqIEByZXR1cm5zIHtJbnRlZ2VyfSBOdW1lcmljIHRhYiByZWZlcmVuY2VcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldFRhYlJlZkJ5U2VsZWN0b3IgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgICAvLyBMb29wIGFsbCB0YWJzXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBoYXNoIHNlbGVjdG9yIGlzIGVxdWFsIHRvIHRoZSB0YWIgc2VsZWN0b3JcbiAgICAgICAgICAgIGlmKHRoaXMudGFic1tpXS5zZWxlY3RvciA9PT0gc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBub25lIGlzIGZvdW5kIHJldHVybiBhIG5lZ2F0aXZlIGluZGV4XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBjdXJyZW50IHRhYiBlbGVtZW50XG4gICAgICogQHJldHVybnMge09iamVjdH0gQ3VycmVudCB0YWIgZWxlbWVudFxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0Q3VycmVudFRhYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VGFiKHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgbmV4dCB0YWIncyBudW1lcmljIHJlZmVyZW5jZVxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gY3VycmVudFRhYlJlZiAtIEN1cnJlbnQgbnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICogQHJldHVybnMge0ludGVnZXJ9IE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0TmV4dFRhYlJlZiA9IGZ1bmN0aW9uKGN1cnJlbnRUYWJSZWYpIHtcbiAgICAgICAgdmFyIHRhYlJlZiA9IChjdXJyZW50VGFiUmVmIHx8IHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSk7XG4gICAgICAgIHZhciBuZXh0VGFiUmVmID0gKHRhYlJlZiA9PT0gdGhpcy50YWJzLmxlbmd0aCAtIDEpID8gMCA6IHRhYlJlZiArIDE7XG4gICAgICAgIHJldHVybiAodGhpcy5fZ2V0VGFiKG5leHRUYWJSZWYpLmRpc2FibGVkKSA/IHRoaXMuX2dldE5leHRUYWJSZWYobmV4dFRhYlJlZikgOiBuZXh0VGFiUmVmO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHByZXZpb3VzIHRhYidzIG51bWVyaWMgcmVmZXJlbmNlXG4gICAgICogQHJldHVybnMge0ludGVnZXJ9IE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0UHJldmlvdXNUYWJSZWYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9nZXRDdXJyZW50VGFiUmVmKCkgPT09IDApID8gdGhpcy50YWJzLmxlbmd0aCAtIDEgOiB0aGlzLl9nZXRDdXJyZW50VGFiUmVmKCkgLSAxO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGN1cnJlbnQgdGFiJ3MgbnVtZXJpYyByZWZlcmVuY2VcbiAgICAgKiBAcmV0dXJucyB7SW50ZWdlcn0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRDdXJyZW50VGFiUmVmID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIExvb3AgYWxsIHRhYnNcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyB0YWIgaXMgYWN0aXZlLCByZXR1cm4gaXRcbiAgICAgICAgICAgIGlmKHRoaXMudGFic1tpXS5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBObyB0YWJzIGhhdmUgYmVlbiBmb3VuZCwgcmV0dXJuIG5lZ2F0aXZlIGluZGV4XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuXG4gICAgLy9cbiAgICAvLyBIRUxQRVIgRlVOQ1RJT05TXG4gICAgLy9cblxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5faXNJblZpZXcgPSBmdW5jdGlvbigkZWxlbWVudCkge1xuICAgICAgICB2YXIgZG9jVmlld1RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgIGRvY1ZpZXdCb3R0b20gPSBkb2NWaWV3VG9wICsgJCh3aW5kb3cpLmhlaWdodCgpLFxuICAgICAgICAgICAgZWxlbVRvcCA9ICRlbGVtZW50Lm9mZnNldCgpLnRvcCxcbiAgICAgICAgICAgIGVsZW1Cb3R0b20gPSBlbGVtVG9wICsgJGVsZW1lbnQuaGVpZ2h0KCk7XG4gICAgICAgIHJldHVybiAoKGVsZW1Cb3R0b20gPD0gZG9jVmlld0JvdHRvbSkgJiYgKGVsZW1Ub3AgPj0gZG9jVmlld1RvcCkpO1xuICAgIH07XG5cbiAgICAvL1xuICAgIC8vIFBVQkxJQyBGVU5DVElPTlNcbiAgICAvL1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBhY3RpdmF0ZXMgYSB0YWJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gc3RvcFJvdGF0aW9uIC0gRGVmaW5lcyBpZiB0aGUgdGFiIHJvdGF0aW9uIHNob3VsZCBzdG9wIGFmdGVyIGFjdGl2YXRpb25cbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbih0YWJSZWYsIHN0b3BSb3RhdGlvbikge1xuICAgICAgICB2YXIgZSA9IGpRdWVyeS5FdmVudCgndGFicy1hY3RpdmF0ZScpO1xuICAgICAgICB2YXIgb1RhYiA9IHRoaXMuX2dldFRhYih0YWJSZWYpO1xuICAgICAgICBpZighb1RhYi5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5fb3BlblRhYihlLCBvVGFiLCB0cnVlLCBzdG9wUm90YXRpb24gfHwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBkZWFjdGl2YXRlcyBhIHRhYlxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gdGFiUmVmIC0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbih0YWJSZWYpIHtcbiAgICAgICAgdmFyIGUgPSBqUXVlcnkuRXZlbnQoJ3RhYnMtZGVjdGl2YXRlJyk7XG4gICAgICAgIHZhciBvVGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XG4gICAgICAgIGlmKCFvVGFiLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9jbG9zZVRhYihlLCBvVGFiKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGVuYWJsZXMgYSB0YWJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbih0YWJSZWYpIHtcbiAgICAgICAgdmFyIG9UYWIgPSB0aGlzLl9nZXRUYWIodGFiUmVmKTtcbiAgICAgICAgaWYob1RhYil7XG4gICAgICAgICAgICBvVGFiLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICBvVGFiLnRhYi5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xuICAgICAgICAgICAgb1RhYi5hY2NvcmRpb25UYWIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURpc2FibGVkKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGRpc2FibGUgYSB0YWJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24odGFiUmVmKSB7XG4gICAgICAgIHZhciBvVGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XG4gICAgICAgIGlmKG9UYWIpe1xuICAgICAgICAgICAgb1RhYi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICBvVGFiLnRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xuICAgICAgICAgICAgb1RhYi5hY2NvcmRpb25UYWIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURpc2FibGVkKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGdldHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHBsdWdpblxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFN0YXRlIG9mIHRoZSBwbHVnaW5cbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gc3RhcnRzIHRoZSByb3RhdGlvbiBvZiB0aGUgdGFic1xuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gc3BlZWQgLSBUaGUgc3BlZWQgb2YgdGhlIHJvdGF0aW9uXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLnN0YXJ0Um90YXRpb24gPSBmdW5jdGlvbihzcGVlZCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAvLyBNYWtlIHN1cmUgbm90IGFsbCB0YWJzIGFyZSBkaXNhYmxlZFxuICAgICAgICBpZih0aGlzLnRhYnMubGVuZ3RoID4gdGhpcy5vcHRpb25zLmRpc2FibGVkLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5yb3RhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSBqUXVlcnkuRXZlbnQoJ3JvdGF0ZScpO1xuICAgICAgICAgICAgICAgIF90aGlzLl9vcGVuVGFiKGUsIF90aGlzLl9nZXRUYWIoX3RoaXMuX2dldE5leHRUYWJSZWYoKSksIHRydWUpO1xuICAgICAgICAgICAgfSwgc3BlZWQgfHwgKCgkLmlzTnVtZXJpYyhfdGhpcy5vcHRpb25zLnJvdGF0ZSkpID8gX3RoaXMub3B0aW9ucy5yb3RhdGUgOiA0MDAwKSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUm90YXRpb24gaXMgbm90IHBvc3NpYmxlIGlmIGFsbCB0YWJzIGFyZSBkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHN0b3BzIHRoZSByb3RhdGlvbiBvZiB0aGUgdGFic1xuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5zdG9wUm90YXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5yb3RhdGVJbnRlcnZhbCk7XG4gICAgICAgIHRoaXMucm90YXRlSW50ZXJ2YWwgPSAwO1xuICAgIH07XG5cbiAgICAvKiogalF1ZXJ5IHdyYXBwZXIgKi9cbiAgICAkLmZuLnJlc3BvbnNpdmVUYWJzID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghJC5kYXRhKHRoaXMsICdyZXNwb25zaXZldGFicycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAncmVzcG9uc2l2ZXRhYnMnLCBuZXcgUmVzcG9uc2l2ZVRhYnMoIHRoaXMsIG9wdGlvbnMgKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnICYmIG9wdGlvbnNbMF0gIT09ICdfJyAmJiBvcHRpb25zICE9PSAnaW5pdCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9ICQuZGF0YSh0aGlzLCAncmVzcG9uc2l2ZXRhYnMnKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJlc3BvbnNpdmVUYWJzICYmIHR5cGVvZiBpbnN0YW5jZVtvcHRpb25zXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVtvcHRpb25zXS5hcHBseSggaW5zdGFuY2UsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmdzLCAxICkgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBbGxvdyBpbnN0YW5jZXMgdG8gYmUgZGVzdHJveWVkIHZpYSB0aGUgJ2Rlc3Ryb3knIG1ldGhvZFxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogZGVzdHJveSBpbnN0YW5jZSBjbGFzc2VzLCBldGNcbiAgICAgICAgICAgICAgICAgICAgJC5kYXRhKHRoaXMsICdyZXNwb25zaXZldGFicycsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxufShqUXVlcnksIHdpbmRvdykpO1xuIl19
