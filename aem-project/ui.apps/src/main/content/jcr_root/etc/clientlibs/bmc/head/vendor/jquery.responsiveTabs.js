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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnJlc3BvbnNpdmVUYWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXHJcbiAqICBQcm9qZWN0OiBqcXVlcnkucmVzcG9uc2l2ZVRhYnMuanNcclxuICogIERlc2NyaXB0aW9uOiBBIHBsdWdpbiB0aGF0IGNyZWF0ZXMgcmVzcG9uc2l2ZSB0YWJzLCBvcHRpbWl6ZWQgZm9yIGFsbCBkZXZpY2VzXHJcbiAqICBBdXRob3I6IEplbGxlIEtyYWx0IChqZWxsZUBqZWxsZWtyYWx0Lm5sKVxyXG4gKiAgVmVyc2lvbjogMS40LjVcclxuICogIExpY2Vuc2U6IE1JVFxyXG4gKi9cclxuXHJcbjsoZnVuY3Rpb24gKCAkLCB3aW5kb3csIHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAvKiogRGVmYXVsdCBzZXR0aW5ncyAqL1xyXG4gICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICAgIGFjdGl2ZTogbnVsbCxcclxuICAgICAgICBldmVudDogJ2NsaWNrJyxcclxuICAgICAgICBkaXNhYmxlZDogW10sXHJcbiAgICAgICAgY29sbGFwc2libGU6ICdhY2NvcmRpb24nLFxyXG4gICAgICAgIHN0YXJ0Q29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgICByb3RhdGU6IGZhbHNlLFxyXG4gICAgICAgIHNldEhhc2g6IGZhbHNlLFxyXG4gICAgICAgIGFuaW1hdGlvbjogJ2RlZmF1bHQnLFxyXG4gICAgICAgIGFuaW1hdGlvblF1ZXVlOiBmYWxzZSxcclxuICAgICAgICBkdXJhdGlvbjogNTAwLFxyXG4gICAgICAgIHNjcm9sbFRvQWNjb3JkaW9uOiBmYWxzZSxcclxuICAgICAgICBhY3RpdmF0ZTogZnVuY3Rpb24oKXt9LFxyXG4gICAgICAgIGRlYWN0aXZhdGU6IGZ1bmN0aW9uKCl7fSxcclxuICAgICAgICBsb2FkOiBmdW5jdGlvbigpe30sXHJcbiAgICAgICAgYWN0aXZhdGVTdGF0ZTogZnVuY3Rpb24oKXt9LFxyXG4gICAgICAgIGNsYXNzZXM6IHtcclxuICAgICAgICAgICAgc3RhdGVEZWZhdWx0OiAnci10YWJzLXN0YXRlLWRlZmF1bHQnLFxyXG4gICAgICAgICAgICBzdGF0ZUFjdGl2ZTogJ3ItdGFicy1zdGF0ZS1hY3RpdmUnLFxyXG4gICAgICAgICAgICBzdGF0ZURpc2FibGVkOiAnci10YWJzLXN0YXRlLWRpc2FibGVkJyxcclxuICAgICAgICAgICAgc3RhdGVFeGNsdWRlZDogJ3ItdGFicy1zdGF0ZS1leGNsdWRlZCcsXHJcbiAgICAgICAgICAgIHRhYjogJ3ItdGFicy10YWInLFxyXG4gICAgICAgICAgICBhbmNob3I6ICdyLXRhYnMtYW5jaG9yJyxcclxuICAgICAgICAgICAgcGFuZWw6ICdyLXRhYnMtcGFuZWwnLFxyXG4gICAgICAgICAgICBhY2NvcmRpb25UaXRsZTogJ3ItdGFicy1hY2NvcmRpb24tdGl0bGUnXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc3BvbnNpdmUgVGFic1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudCAtIFRoZSBIVE1MIGVsZW1lbnQgdGhlIHZhbGlkYXRvciBzaG91bGQgYmUgYm91bmQgdG9cclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gQW4gb3B0aW9uIG1hcFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBSZXNwb25zaXZlVGFicyhlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDsgLy8gU2VsZWN0ZWQgRE9NIGVsZW1lbnRcclxuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTsgLy8gU2VsZWN0ZWQgalF1ZXJ5IGVsZW1lbnRcclxuXHJcbiAgICAgICAgdGhpcy50YWJzID0gW107IC8vIENyZWF0ZSB0YWJzIGFycmF5XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICcnOyAvLyBEZWZpbmUgdGhlIHBsdWdpbiBzdGF0ZSAodGFicy9hY2NvcmRpb24pXHJcbiAgICAgICAgdGhpcy5yb3RhdGVJbnRlcnZhbCA9IDA7IC8vIERlZmluZSByb3RhdGUgaW50ZXJ2YWxcclxuICAgICAgICB0aGlzLiRxdWV1ZSA9ICQoe30pO1xyXG5cclxuICAgICAgICAvLyBFeHRlbmQgdGhlIGRlZmF1bHRzIHdpdGggdGhlIHBhc3NlZCBvcHRpb25zXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gaW5pdGlhbGl6ZXMgdGhlIHRhYiBwbHVnaW5cclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gTG9hZCBhbGwgdGhlIGVsZW1lbnRzXHJcbiAgICAgICAgdGhpcy50YWJzID0gdGhpcy5fbG9hZEVsZW1lbnRzKCk7XHJcbiAgICAgICAgdGhpcy5fbG9hZENsYXNzZXMoKTtcclxuICAgICAgICB0aGlzLl9sb2FkRXZlbnRzKCk7XHJcblxyXG4gICAgICAgIC8vIFdpbmRvdyByZXNpemUgYmluZCB0byBjaGVjayBzdGF0ZVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBfdGhpcy5fc2V0U3RhdGUoZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEhhc2hjaGFuZ2UgZXZlbnRcclxuICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHZhciB0YWJSZWYgPSBfdGhpcy5fZ2V0VGFiUmVmQnlTZWxlY3Rvcih3aW5kb3cubG9jYXRpb24uaGFzaCk7XHJcbiAgICAgICAgICAgIHZhciBvVGFiID0gX3RoaXMuX2dldFRhYih0YWJSZWYpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYSB0YWIgaXMgZm91bmQgdGhhdCBtYXRjaGVzIHRoZSBoYXNoXHJcbiAgICAgICAgICAgIGlmKHRhYlJlZiA+PSAwICYmICFvVGFiLl9pZ25vcmVIYXNoQ2hhbmdlICYmICFvVGFiLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBzbywgb3BlbiB0aGUgdGFiIGFuZCBhdXRvIGNsb3NlIHRoZSBjdXJyZW50IG9uZVxyXG4gICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgX3RoaXMuX2dldFRhYih0YWJSZWYpLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTdGFydCByb3RhdGUgZXZlbnQgaWYgcm90YXRlIG9wdGlvbiBpcyBkZWZpbmVkXHJcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLnJvdGF0ZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydFJvdGF0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vIERlZmluZSBwbHVnaW4gZXZlbnRzXHJcbiAgICAgICAgLy9cclxuXHJcbiAgICAgICAgLy8gQWN0aXZhdGU6IHRoaXMgZXZlbnQgaXMgY2FsbGVkIHdoZW4gYSB0YWIgaXMgc2VsZWN0ZWRcclxuICAgICAgICB0aGlzLiRlbGVtZW50LmJpbmQoJ3RhYnMtYWN0aXZhdGUnLCBmdW5jdGlvbihlLCBvVGFiKSB7XHJcbiAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuYWN0aXZhdGUuY2FsbCh0aGlzLCBlLCBvVGFiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBEZWFjdGl2YXRlOiB0aGlzIGV2ZW50IGlzIGNhbGxlZCB3aGVuIGEgdGFiIGlzIGNsb3NlZFxyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYmluZCgndGFicy1kZWFjdGl2YXRlJywgZnVuY3Rpb24oZSwgb1RhYikge1xyXG4gICAgICAgICAgICBfdGhpcy5vcHRpb25zLmRlYWN0aXZhdGUuY2FsbCh0aGlzLCBlLCBvVGFiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBBY3RpdmF0ZSBTdGF0ZTogdGhpcyBldmVudCBpcyBjYWxsZWQgd2hlbiB0aGUgcGx1Z2luIHN3aXRjaGVzIHN0YXRlc1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYmluZCgndGFicy1hY3RpdmF0ZS1zdGF0ZScsIGZ1bmN0aW9uKGUsIHN0YXRlKSB7XHJcbiAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuYWN0aXZhdGVTdGF0ZS5jYWxsKHRoaXMsIGUsIHN0YXRlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gTG9hZDogdGhpcyBldmVudCBpcyBjYWxsZWQgd2hlbiB0aGUgcGx1Z2luIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYmluZCgndGFicy1sb2FkJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRUYWI7XHJcblxyXG4gICAgICAgICAgICBfdGhpcy5fc2V0U3RhdGUoZSk7IC8vIFNldCBzdGF0ZVxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBhbmVsIHNob3VsZCBiZSBjb2xsYXBlZCBvbiBsb2FkXHJcbiAgICAgICAgICAgIGlmKF90aGlzLm9wdGlvbnMuc3RhcnRDb2xsYXBzZWQgIT09IHRydWUgJiYgIShfdGhpcy5vcHRpb25zLnN0YXJ0Q29sbGFwc2VkID09PSAnYWNjb3JkaW9uJyAmJiBfdGhpcy5zdGF0ZSA9PT0gJ2FjY29yZGlvbicpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhcnRUYWIgPSBfdGhpcy5fZ2V0U3RhcnRUYWIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBPcGVuIHRoZSBpbml0aWFsIHRhYlxyXG4gICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgc3RhcnRUYWIpOyAvLyBPcGVuIGZpcnN0IHRhYlxyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5vcHRpb25zLmxvYWQuY2FsbCh0aGlzLCBlLCBzdGFydFRhYik7IC8vIENhbGwgdGhlIGxvYWQgY2FsbGJhY2tcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIFRyaWdnZXIgbG9hZGVkIGV2ZW50XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCd0YWJzLWxvYWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLy9cclxuICAgIC8vIFBSSVZBVEUgRlVOQ1RJT05TXHJcbiAgICAvL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBsb2FkcyB0aGUgdGFiIGVsZW1lbnRzIGFuZCBzdG9yZXMgdGhlbSBpbiBhbiBhcnJheVxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBBcnJheSBvZiB0YWIgZWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9sb2FkRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciAkdWwgPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCd1bCcpO1xyXG4gICAgICAgIHZhciB0YWJzID0gW107XHJcbiAgICAgICAgdmFyIGlkID0gMDtcclxuXHJcbiAgICAgICAgLy8gQWRkIHRoZSBjbGFzc2VzIHRvIHRoZSBiYXNpYyBodG1sIGVsZW1lbnRzXHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnci10YWJzJyk7IC8vIFRhYiBjb250YWluZXJcclxuICAgICAgICAkdWwuYWRkQ2xhc3MoJ3ItdGFicy1uYXYnKTsgLy8gTGlzdCBjb250YWluZXJcclxuXHJcbiAgICAgICAgLy8gR2V0IHRhYiBidXR0b25zIGFuZCBzdG9yZSB0aGVpciBkYXRhIGluIGFuIGFycmF5XHJcbiAgICAgICAgJCgnbGknLCAkdWwpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGFiID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGlzRXhjbHVkZWQgPSAkdGFiLmhhc0NsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZUV4Y2x1ZGVkKTtcclxuICAgICAgICAgICAgdmFyICRhbmNob3IsICRwYW5lbCwgJGFjY29yZGlvblRhYiwgJGFjY29yZGlvbkFuY2hvciwgcGFuZWxTZWxlY3RvcjtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSB0YWIgc2hvdWxkIGJlIGV4Y2x1ZGVkXHJcbiAgICAgICAgICAgIGlmKCFpc0V4Y2x1ZGVkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJGFuY2hvciA9ICQoJ2EnLCAkdGFiKTtcclxuICAgICAgICAgICAgICAgIHBhbmVsU2VsZWN0b3IgPSAkYW5jaG9yLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgICAgICAgICRwYW5lbCA9ICQocGFuZWxTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICAkYWNjb3JkaW9uVGFiID0gJCgnPGRpdj48L2Rpdj4nKS5pbnNlcnRCZWZvcmUoJHBhbmVsKTtcclxuICAgICAgICAgICAgICAgICRhY2NvcmRpb25BbmNob3IgPSAkKCc8YT48L2E+JykuYXR0cignaHJlZicsIHBhbmVsU2VsZWN0b3IpLmh0bWwoJGFuY2hvci5odG1sKCkpLmFwcGVuZFRvKCRhY2NvcmRpb25UYWIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBvVGFiID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIF9pZ25vcmVIYXNoQ2hhbmdlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6ICgkLmluQXJyYXkoaWQsIF90aGlzLm9wdGlvbnMuZGlzYWJsZWQpICE9PSAtMSksXHJcbiAgICAgICAgICAgICAgICAgICAgdGFiOiAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogJCgnYScsICR0YWIpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhbmVsOiAkcGFuZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6IHBhbmVsU2VsZWN0b3IsXHJcbiAgICAgICAgICAgICAgICAgICAgYWNjb3JkaW9uVGFiOiAkYWNjb3JkaW9uVGFiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFjY29yZGlvbkFuY2hvcjogJGFjY29yZGlvbkFuY2hvcixcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDF1cCB0aGUgSURcclxuICAgICAgICAgICAgICAgIGlkKys7XHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgdG8gdGFiIGFycmF5XHJcbiAgICAgICAgICAgICAgICB0YWJzLnB1c2gob1RhYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGFicztcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNsYXNzZXMgdG8gdGhlIHRhYiBlbGVtZW50cyBiYXNlZCBvbiB0aGUgb3B0aW9uc1xyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2xvYWRDbGFzc2VzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0udGFiLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMudGFiKTtcclxuICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFuY2hvci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5hbmNob3IpO1xyXG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0ucGFuZWwuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5wYW5lbCk7XHJcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS5hY2NvcmRpb25UYWIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuYWNjb3JkaW9uVGl0bGUpO1xyXG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0uYWNjb3JkaW9uQW5jaG9yLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmFuY2hvcik7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGFic1tpXS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJzW2ldLnRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGV2ZW50cyB0byB0aGUgdGFiIGVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fbG9hZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIERlZmluZSBhY3RpdmF0ZSBldmVudCBvbiBhIHRhYiBlbGVtZW50XHJcbiAgICAgICAgdmFyIGZBY3RpdmF0ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBfdGhpcy5fZ2V0Q3VycmVudFRhYigpOyAvLyBGZXRjaCBjdXJyZW50IHRhYlxyXG4gICAgICAgICAgICB2YXIgYWN0aXZhdGVkVGFiID0gZS5kYXRhLnRhYjtcclxuXHJcbiAgICAgICAgICAgIC8vIERYUC02ODZcclxuICAgICAgICAgICAgLy8gZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoaXMgdGFiIGlzbid0IGRpc2FibGVkXHJcbiAgICAgICAgICAgIGlmKCFhY3RpdmF0ZWRUYWIuZGlzYWJsZWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBoYXNoIGhhcyB0byBiZSBzZXQgaW4gdGhlIFVSTCBsb2NhdGlvblxyXG4gICAgICAgICAgICAgICAgaWYoX3RoaXMub3B0aW9ucy5zZXRIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBoYXNoIHVzaW5nIHRoZSBoaXN0b3J5IGFwaSBpZiBhdmFpbGFibGUgdG8gdGFja2xlIENocm9tZXMgcmVwYWludCBidWcgb24gaGFzaCBjaGFuZ2VcclxuICAgICAgICAgICAgICAgICAgICBpZihoaXN0b3J5LnB1c2hTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBudWxsLCBhY3RpdmF0ZWRUYWIuc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSBmYWxsYmFjayB0byB0aGUgaGFzaCB1cGRhdGUgZm9yIHNpdGVzIHRoYXQgZG9uJ3Qgc3VwcG9ydCB0aGUgaGlzdG9yeSBhcGlcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBhY3RpdmF0ZWRUYWIuc2VsZWN0b3I7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGUuZGF0YS50YWIuX2lnbm9yZUhhc2hDaGFuZ2UgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBhY3RpdmF0ZWQgdGFiIGlzbnQgdGhlIGN1cnJlbnQgb25lIG9yIGlmIGl0cyBjb2xsYXBzaWJsZS4gSWYgbm90LCBkbyBub3RoaW5nXHJcbiAgICAgICAgICAgICAgICBpZihjdXJyZW50ICE9PSBhY3RpdmF0ZWRUYWIgfHwgX3RoaXMuX2lzQ29sbGFwaXNibGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBhY3RpdmF0ZWQgdGFiIGlzIGVpdGhlciBhbm90aGVyIHRhYiBvZiB0aGUgY3VycmVudCBvbmUuIElmIGl0J3MgdGhlIGN1cnJlbnQgdGFiIGl0IGlzIGNvbGxhcHNpYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRWl0aGVyIHdheSwgdGhlIGN1cnJlbnQgdGFiIGNhbiBiZSBjbG9zZWRcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY2xvc2VUYWIoZSwgY3VycmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBhY3RpdmF0ZWQgdGFiIGlzbnQgdGhlIGN1cnJlbnQgb25lIG9yIGlmIGl0IGlzbnQgY29sbGFwc2libGVcclxuICAgICAgICAgICAgICAgICAgICBpZihjdXJyZW50ICE9PSBhY3RpdmF0ZWRUYWIgfHwgIV90aGlzLl9pc0NvbGxhcGlzYmxlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgYWN0aXZhdGVkVGFiLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTG9vcCB0YWJzXHJcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvLyBBZGQgYWN0aXZhdGUgZnVuY3Rpb24gdG8gdGhlIHRhYiBhbmQgYWNjb3JkaW9uIHNlbGVjdGlvbiBlbGVtZW50XHJcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS5hbmNob3Iub24oX3RoaXMub3B0aW9ucy5ldmVudCwge3RhYjogX3RoaXMudGFic1tpXX0sIGZBY3RpdmF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS5hY2NvcmRpb25BbmNob3Iub24oX3RoaXMub3B0aW9ucy5ldmVudCwge3RhYjogX3RoaXMudGFic1tpXX0sIGZBY3RpdmF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gZ2V0cyB0aGUgdGFiIHRoYXQgc2hvdWxkIGJlIG9wZW5lZCBhdCBzdGFydFxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGFiIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldFN0YXJ0VGFiID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRhYlJlZiA9IHRoaXMuX2dldFRhYlJlZkJ5U2VsZWN0b3Iod2luZG93LmxvY2F0aW9uLmhhc2gpO1xyXG4gICAgICAgIHZhciBzdGFydFRhYjtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBhZ2UgaGFzIGEgaGFzaCBzZXQgdGhhdCBpcyBsaW5rZWQgdG8gYSB0YWJcclxuICAgICAgICBpZih0YWJSZWYgPj0gMCAmJiAhdGhpcy5fZ2V0VGFiKHRhYlJlZikuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgLy8gSWYgc28sIHNldCB0aGUgY3VycmVudCB0YWIgdG8gdGhlIGxpbmtlZCB0YWJcclxuICAgICAgICAgICAgc3RhcnRUYWIgPSB0aGlzLl9nZXRUYWIodGFiUmVmKTtcclxuICAgICAgICB9IGVsc2UgaWYodGhpcy5vcHRpb25zLmFjdGl2ZSA+IDAgJiYgIXRoaXMuX2dldFRhYih0aGlzLm9wdGlvbnMuYWN0aXZlKS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICBzdGFydFRhYiA9IHRoaXMuX2dldFRhYih0aGlzLm9wdGlvbnMuYWN0aXZlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBJZiBub3QsIGp1c3QgZ2V0IHRoZSBmaXJzdCBvbmVcclxuICAgICAgICAgICAgc3RhcnRUYWIgPSB0aGlzLl9nZXRUYWIoMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RhcnRUYWI7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBzZXRzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBwbHVnaW5cclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBUaGUgZXZlbnQgdGhhdCB0cmlnZ2VycyB0aGUgc3RhdGUgY2hhbmdlXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fc2V0U3RhdGUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdmFyICR1bCA9ICQoJ3VsJywgdGhpcy4kZWxlbWVudCk7XHJcbiAgICAgICAgdmFyIG9sZFN0YXRlID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICB2YXIgc3RhcnRDb2xsYXBzZWRJc1N0YXRlID0gKHR5cGVvZiB0aGlzLm9wdGlvbnMuc3RhcnRDb2xsYXBzZWQgPT09ICdzdHJpbmcnKTtcclxuICAgICAgICB2YXIgc3RhcnRUYWI7XHJcblxyXG4gICAgICAgIC8vIFRoZSBzdGF0ZSBpcyBiYXNlZCBvbiB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgdGFicyBsaXN0XHJcbiAgICAgICAgaWYoJHVsLmlzKCc6dmlzaWJsZScpKXtcclxuICAgICAgICAgICAgLy8gVGFiIGxpc3QgaXMgdmlzaWJsZSwgc28gdGhlIHN0YXRlIGlzICd0YWJzJ1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gJ3RhYnMnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFRhYiBsaXN0IGlzIGludmlzaWJsZSwgc28gdGhlIHN0YXRlIGlzICdhY2NvcmRpb24nXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAnYWNjb3JkaW9uJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBuZXcgc3RhdGUgaXMgZGlmZmVyZW50IGZyb20gdGhlIG9sZCBzdGF0ZVxyXG4gICAgICAgIGlmKHRoaXMuc3RhdGUgIT09IG9sZFN0YXRlKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHNvLCB0aGUgc3RhdGUgYWN0aXZhdGUgdHJpZ2dlciBtdXN0IGJlIGNhbGxlZFxyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3RhYnMtYWN0aXZhdGUtc3RhdGUnLCB7b2xkU3RhdGU6IG9sZFN0YXRlLCBuZXdTdGF0ZTogdGhpcy5zdGF0ZX0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHN0YXRlIHN3aXRjaCBzaG91bGQgb3BlbiBhIHRhYlxyXG4gICAgICAgICAgICBpZihvbGRTdGF0ZSAmJiBzdGFydENvbGxhcHNlZElzU3RhdGUgJiYgdGhpcy5vcHRpb25zLnN0YXJ0Q29sbGFwc2VkICE9PSB0aGlzLnN0YXRlICYmIHRoaXMuX2dldEN1cnJlbnRUYWIoKSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBHZXQgaW5pdGlhbCB0YWJcclxuICAgICAgICAgICAgICAgIHN0YXJ0VGFiID0gdGhpcy5fZ2V0U3RhcnRUYWIoZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBPcGVuIHRoZSBpbml0aWFsIHRhYlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3BlblRhYihlLCBzdGFydFRhYik7IC8vIE9wZW4gZmlyc3QgdGFiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBvcGVucyBhIHRhYlxyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSAtIFRoZSBldmVudCB0aGF0IHRyaWdnZXJzIHRoZSB0YWIgb3BlbmluZ1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9UYWIgLSBUaGUgdGFiIG9iamVjdCB0aGF0IHNob3VsZCBiZSBvcGVuZWRcclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gY2xvc2VDdXJyZW50IC0gRGVmaW5lcyBpZiB0aGUgY3VycmVudCB0YWIgc2hvdWxkIGJlIGNsb3NlZFxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBzdG9wUm90YXRpb24gLSBEZWZpbmVzIGlmIHRoZSB0YWIgcm90YXRpb24gbG9vcCBzaG91bGQgYmUgc3RvcHBlZFxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX29wZW5UYWIgPSBmdW5jdGlvbihlLCBvVGFiLCBjbG9zZUN1cnJlbnQsIHN0b3BSb3RhdGlvbikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBjdXJyZW50IHRhYiBoYXMgdG8gYmUgY2xvc2VkXHJcbiAgICAgICAgaWYoY2xvc2VDdXJyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nsb3NlVGFiKGUsIHRoaXMuX2dldEN1cnJlbnRUYWIoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgcm90YXRpb24gaGFzIHRvIGJlIHN0b3BwZWQgd2hlbiBhY3RpdmF0ZWRcclxuICAgICAgICBpZihzdG9wUm90YXRpb24gJiYgdGhpcy5yb3RhdGVJbnRlcnZhbCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wUm90YXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNldCB0aGlzIHRhYiB0byBhY3RpdmVcclxuICAgICAgICBvVGFiLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgLy8gU2V0IGFjdGl2ZSBjbGFzc2VzIHRvIHRoZSB0YWIgYnV0dG9uIGFuZCBhY2NvcmRpb24gdGFiIGJ1dHRvblxyXG4gICAgICAgIG9UYWIudGFiLnJlbW92ZUNsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZUFjdGl2ZSk7XHJcbiAgICAgICAgb1RhYi5hY2NvcmRpb25UYWIucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKTtcclxuXHJcbiAgICAgICAgLy8gUnVuIHBhbmVsIHRyYW5zaXRvblxyXG4gICAgICAgIF90aGlzLl9kb1RyYW5zaXRpb24ob1RhYi5wYW5lbCwgX3RoaXMub3B0aW9ucy5hbmltYXRpb24sICdvcGVuJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIFdoZW4gZmluaXNoZWQsIHNldCBhY3RpdmUgY2xhc3MgdG8gdGhlIHBhbmVsXHJcbiAgICAgICAgICAgIG9UYWIucGFuZWwucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKTtcclxuXHJcbiAgICAgICAgICAgLy8gQW5kIGlmIGVuYWJsZWQgYW5kIHN0YXRlIGlzIGFjY29yZGlvbiwgc2Nyb2xsIHRvIHRoZSBhY2NvcmRpb24gdGFiXHJcbiAgICAgICAgICAgIGlmKF90aGlzLmdldFN0YXRlKCkgPT09ICdhY2NvcmRpb24nICYmIF90aGlzLm9wdGlvbnMuc2Nyb2xsVG9BY2NvcmRpb24gJiYgKCFfdGhpcy5faXNJblZpZXcob1RhYi5hY2NvcmRpb25UYWIpIHx8IF90aGlzLm9wdGlvbnMuYW5pbWF0aW9uICE9PSAnZGVmYXVsdCcpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgYW5pbWF0aW9uIG9wdGlvbiBpcyBlbmFibGVkLCBhbmQgaWYgdGhlIGR1cmF0aW9uIGlzbid0IDBcclxuICAgICAgICAgICAgICAgIGlmKF90aGlzLm9wdGlvbnMuYW5pbWF0aW9uICE9PSAnZGVmYXVsdCcgJiYgX3RoaXMub3B0aW9ucy5kdXJhdGlvbiA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBzbywgc2V0IHNjcm9sbFRvcCB3aXRoIGFuaW1hdGUgYW5kIHVzZSB0aGUgJ2FuaW1hdGlvbicgZHVyYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogb1RhYi5hY2NvcmRpb25UYWIub2Zmc2V0KCkudG9wXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgX3RoaXMub3B0aW9ucy5kdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICBJZiBub3QsIGp1c3Qgc2V0IHNjcm9sbFRvcFxyXG4gICAgICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3Aob1RhYi5hY2NvcmRpb25UYWIub2Zmc2V0KCkudG9wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3RhYnMtYWN0aXZhdGUnLCBvVGFiKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGNsb3NlcyBhIHRhYlxyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSAtIFRoZSBldmVudCB0aGF0IGlzIHRyaWdnZXJlZCB3aGVuIGEgdGFiIGlzIGNsb3NlZFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9UYWIgLSBUaGUgdGFiIG9iamVjdCB0aGF0IHNob3VsZCBiZSBjbG9zZWRcclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9jbG9zZVRhYiA9IGZ1bmN0aW9uKGUsIG9UYWIpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBkb1F1ZXVlT25TdGF0ZSA9IHR5cGVvZiBfdGhpcy5vcHRpb25zLmFuaW1hdGlvblF1ZXVlID09PSAnc3RyaW5nJztcclxuICAgICAgICB2YXIgZG9RdWV1ZTtcclxuXHJcbiAgICAgICAgaWYob1RhYiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmKGRvUXVldWVPblN0YXRlICYmIF90aGlzLmdldFN0YXRlKCkgPT09IF90aGlzLm9wdGlvbnMuYW5pbWF0aW9uUXVldWUpIHtcclxuICAgICAgICAgICAgICAgIGRvUXVldWUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9RdWV1ZU9uU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIGRvUXVldWUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvUXVldWUgPSBfdGhpcy5vcHRpb25zLmFuaW1hdGlvblF1ZXVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBEZWFjdGl2YXRlIHRhYlxyXG4gICAgICAgICAgICBvVGFiLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAvLyBTZXQgZGVmYXVsdCBjbGFzcyB0byB0aGUgdGFiIGJ1dHRvblxyXG4gICAgICAgICAgICBvVGFiLnRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpO1xyXG5cclxuICAgICAgICAgICAgLy8gUnVuIHBhbmVsIHRyYW5zaXRpb25cclxuICAgICAgICAgICAgX3RoaXMuX2RvVHJhbnNpdGlvbihvVGFiLnBhbmVsLCBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbiwgJ2Nsb3NlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgZGVmYXVsdCBjbGFzcyB0byB0aGUgYWNjb3JkaW9uIHRhYiBidXR0b24gYW5kIHRhYiBwYW5lbFxyXG4gICAgICAgICAgICAgICAgb1RhYi5hY2NvcmRpb25UYWIucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KTtcclxuICAgICAgICAgICAgICAgIG9UYWIucGFuZWwucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KTtcclxuICAgICAgICAgICAgfSwgIWRvUXVldWUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCd0YWJzLWRlYWN0aXZhdGUnLCBvVGFiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBydW5zIGFuIGVmZmVjdCBvbiBhIHBhbmVsXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IHBhbmVsIC0gVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgdGFiIHBhbmVsXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kIC0gVGhlIHRyYW5zaXRpb24gbWV0aG9kIHJlZmVyZW5jZVxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0YXRlIC0gVGhlIHN0YXRlIChvcGVuL2Nsb3NlZCkgdGhhdCB0aGUgcGFuZWwgc2hvdWxkIHRyYW5zaXRpb24gdG9cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIGFmdGVyIHRoZSB0cmFuc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRlcXVldWUgLSBEZWZpbmVzIGlmIHRoZSBldmVudCBxdWV1ZSBzaG91bGQgYmUgZGVxdWV1ZWQgYWZ0ZXIgdGhlIHRyYW5zaXRpb25cclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9kb1RyYW5zaXRpb24gPSBmdW5jdGlvbihwYW5lbCwgbWV0aG9kLCBzdGF0ZSwgY2FsbGJhY2ssIGRlcXVldWUpIHtcclxuICAgICAgICB2YXIgZWZmZWN0O1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIEdldCBlZmZlY3QgYmFzZWQgb24gbWV0aG9kXHJcbiAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xyXG4gICAgICAgICAgICBjYXNlICdzbGlkZSc6XHJcbiAgICAgICAgICAgICAgICBlZmZlY3QgPSAoc3RhdGUgPT09ICdvcGVuJykgPyAnc2xpZGVEb3duJyA6ICdzbGlkZVVwJztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdmYWRlJzpcclxuICAgICAgICAgICAgICAgIGVmZmVjdCA9IChzdGF0ZSA9PT0gJ29wZW4nKSA/ICdmYWRlSW4nIDogJ2ZhZGVPdXQnO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBlZmZlY3QgPSAoc3RhdGUgPT09ICdvcGVuJykgPyAnc2hvdycgOiAnaGlkZSc7XHJcbiAgICAgICAgICAgICAgICAvLyBXaGVuIGRlZmF1bHQgaXMgdXNlZCwgc2V0IHRoZSBkdXJhdGlvbiB0byAwXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5vcHRpb25zLmR1cmF0aW9uID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWRkIHRoZSB0cmFuc2l0aW9uIHRvIGEgY3VzdG9tIHF1ZXVlXHJcbiAgICAgICAgdGhpcy4kcXVldWUucXVldWUoJ3Jlc3BvbnNpdmUtdGFicycsZnVuY3Rpb24obmV4dCl7XHJcbiAgICAgICAgICAgIC8vIFJ1biB0aGUgdHJhbnNpdGlvbiBvbiB0aGUgcGFuZWxcclxuICAgICAgICAgICAgcGFuZWxbZWZmZWN0XSh7XHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogX3RoaXMub3B0aW9ucy5kdXJhdGlvbixcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwocGFuZWwsIG1ldGhvZCwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biB0aGUgbmV4dCBmdW5jdGlvbiBpbiB0aGUgcXVldWVcclxuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBXaGVuIHRoZSBwYW5lbCBpcyBvcGVuZW5kLCBkZXF1ZXVlIGV2ZXJ5dGhpbmcgc28gdGhlIGFuaW1hdGlvbiBzdGFydHNcclxuICAgICAgICBpZihzdGF0ZSA9PT0gJ29wZW4nIHx8IGRlcXVldWUpIHtcclxuICAgICAgICAgICAgdGhpcy4kcXVldWUuZGVxdWV1ZSgncmVzcG9uc2l2ZS10YWJzJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGNvbGxhcHNpYmlsaXR5IG9mIHRoZSB0YWIgaW4gdGhpcyBzdGF0ZVxyXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IFRoZSBjb2xsYXBzaWJpbGl0eSBvZiB0aGUgdGFiXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5faXNDb2xsYXBpc2JsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAodHlwZW9mIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSA9PT0gJ2Jvb2xlYW4nICYmIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSkgfHwgKHR5cGVvZiB0aGlzLm9wdGlvbnMuY29sbGFwc2libGUgPT09ICdzdHJpbmcnICYmIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSA9PT0gdGhpcy5nZXRTdGF0ZSgpKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSB0YWIgYnkgbnVtZXJpYyByZWZlcmVuY2VcclxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gbnVtUmVmIC0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUYWIgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0VGFiID0gZnVuY3Rpb24obnVtUmVmKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFic1tudW1SZWZdO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgbnVtZXJpYyB0YWIgcmVmZXJlbmNlIGJhc2VkIG9uIGEgaGFzaCBzZWxlY3RvclxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIC0gSGFzaCBzZWxlY3RvclxyXG4gICAgICogQHJldHVybnMge0ludGVnZXJ9IE51bWVyaWMgdGFiIHJlZmVyZW5jZVxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldFRhYlJlZkJ5U2VsZWN0b3IgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgIC8vIExvb3AgYWxsIHRhYnNcclxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy50YWJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBoYXNoIHNlbGVjdG9yIGlzIGVxdWFsIHRvIHRoZSB0YWIgc2VsZWN0b3JcclxuICAgICAgICAgICAgaWYodGhpcy50YWJzW2ldLnNlbGVjdG9yID09PSBzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgbm9uZSBpcyBmb3VuZCByZXR1cm4gYSBuZWdhdGl2ZSBpbmRleFxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGN1cnJlbnQgdGFiIGVsZW1lbnRcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IEN1cnJlbnQgdGFiIGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRDdXJyZW50VGFiID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFRhYih0aGlzLl9nZXRDdXJyZW50VGFiUmVmKCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgbmV4dCB0YWIncyBudW1lcmljIHJlZmVyZW5jZVxyXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBjdXJyZW50VGFiUmVmIC0gQ3VycmVudCBudW1lcmljIHRhYiByZWZlcmVuY2VcclxuICAgICAqIEByZXR1cm5zIHtJbnRlZ2VyfSBOdW1lcmljIHRhYiByZWZlcmVuY2VcclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXROZXh0VGFiUmVmID0gZnVuY3Rpb24oY3VycmVudFRhYlJlZikge1xyXG4gICAgICAgIHZhciB0YWJSZWYgPSAoY3VycmVudFRhYlJlZiB8fCB0aGlzLl9nZXRDdXJyZW50VGFiUmVmKCkpO1xyXG4gICAgICAgIHZhciBuZXh0VGFiUmVmID0gKHRhYlJlZiA9PT0gdGhpcy50YWJzLmxlbmd0aCAtIDEpID8gMCA6IHRhYlJlZiArIDE7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9nZXRUYWIobmV4dFRhYlJlZikuZGlzYWJsZWQpID8gdGhpcy5fZ2V0TmV4dFRhYlJlZihuZXh0VGFiUmVmKSA6IG5leHRUYWJSZWY7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBwcmV2aW91cyB0YWIncyBudW1lcmljIHJlZmVyZW5jZVxyXG4gICAgICogQHJldHVybnMge0ludGVnZXJ9IE51bWVyaWMgdGFiIHJlZmVyZW5jZVxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldFByZXZpb3VzVGFiUmVmID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9nZXRDdXJyZW50VGFiUmVmKCkgPT09IDApID8gdGhpcy50YWJzLmxlbmd0aCAtIDEgOiB0aGlzLl9nZXRDdXJyZW50VGFiUmVmKCkgLSAxO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgY3VycmVudCB0YWIncyBudW1lcmljIHJlZmVyZW5jZVxyXG4gICAgICogQHJldHVybnMge0ludGVnZXJ9IE51bWVyaWMgdGFiIHJlZmVyZW5jZVxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldEN1cnJlbnRUYWJSZWYgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBMb29wIGFsbCB0YWJzXHJcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGlzIHRhYiBpcyBhY3RpdmUsIHJldHVybiBpdFxyXG4gICAgICAgICAgICBpZih0aGlzLnRhYnNbaV0uYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBObyB0YWJzIGhhdmUgYmVlbiBmb3VuZCwgcmV0dXJuIG5lZ2F0aXZlIGluZGV4XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL1xyXG4gICAgLy8gSEVMUEVSIEZVTkNUSU9OU1xyXG4gICAgLy9cclxuXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2lzSW5WaWV3ID0gZnVuY3Rpb24oJGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgZG9jVmlld1RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcclxuICAgICAgICAgICAgZG9jVmlld0JvdHRvbSA9IGRvY1ZpZXdUb3AgKyAkKHdpbmRvdykuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgIGVsZW1Ub3AgPSAkZWxlbWVudC5vZmZzZXQoKS50b3AsXHJcbiAgICAgICAgICAgIGVsZW1Cb3R0b20gPSBlbGVtVG9wICsgJGVsZW1lbnQuaGVpZ2h0KCk7XHJcbiAgICAgICAgcmV0dXJuICgoZWxlbUJvdHRvbSA8PSBkb2NWaWV3Qm90dG9tKSAmJiAoZWxlbVRvcCA+PSBkb2NWaWV3VG9wKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vXHJcbiAgICAvLyBQVUJMSUMgRlVOQ1RJT05TXHJcbiAgICAvL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBhY3RpdmF0ZXMgYSB0YWJcclxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gdGFiUmVmIC0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXHJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHN0b3BSb3RhdGlvbiAtIERlZmluZXMgaWYgdGhlIHRhYiByb3RhdGlvbiBzaG91bGQgc3RvcCBhZnRlciBhY3RpdmF0aW9uXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uKHRhYlJlZiwgc3RvcFJvdGF0aW9uKSB7XHJcbiAgICAgICAgdmFyIGUgPSBqUXVlcnkuRXZlbnQoJ3RhYnMtYWN0aXZhdGUnKTtcclxuICAgICAgICB2YXIgb1RhYiA9IHRoaXMuX2dldFRhYih0YWJSZWYpO1xyXG4gICAgICAgIGlmKCFvVGFiLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29wZW5UYWIoZSwgb1RhYiwgdHJ1ZSwgc3RvcFJvdGF0aW9uIHx8IHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGRlYWN0aXZhdGVzIGEgdGFiXHJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uKHRhYlJlZikge1xyXG4gICAgICAgIHZhciBlID0galF1ZXJ5LkV2ZW50KCd0YWJzLWRlY3RpdmF0ZScpO1xyXG4gICAgICAgIHZhciBvVGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XHJcbiAgICAgICAgaWYoIW9UYWIuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2xvc2VUYWIoZSwgb1RhYik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gZW5hYmxlcyBhIHRhYlxyXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSB0YWJSZWYgLSBOdW1lcmljIHRhYiByZWZlcmVuY2VcclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKHRhYlJlZikge1xyXG4gICAgICAgIHZhciBvVGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XHJcbiAgICAgICAgaWYob1RhYil7XHJcbiAgICAgICAgICAgIG9UYWIuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgb1RhYi50YWIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURpc2FibGVkKTtcclxuICAgICAgICAgICAgb1RhYi5hY2NvcmRpb25UYWIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURpc2FibGVkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBkaXNhYmxlIGEgdGFiXHJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKHRhYlJlZikge1xyXG4gICAgICAgIHZhciBvVGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XHJcbiAgICAgICAgaWYob1RhYil7XHJcbiAgICAgICAgICAgIG9UYWIuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBvVGFiLnRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xyXG4gICAgICAgICAgICBvVGFiLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGdldHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHBsdWdpblxyXG4gICAgICogQHJldHVybnMge1N0cmluZ30gU3RhdGUgb2YgdGhlIHBsdWdpblxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHN0YXJ0cyB0aGUgcm90YXRpb24gb2YgdGhlIHRhYnNcclxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gc3BlZWQgLSBUaGUgc3BlZWQgb2YgdGhlIHJvdGF0aW9uXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5zdGFydFJvdGF0aW9uID0gZnVuY3Rpb24oc3BlZWQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBub3QgYWxsIHRhYnMgYXJlIGRpc2FibGVkXHJcbiAgICAgICAgaWYodGhpcy50YWJzLmxlbmd0aCA+IHRoaXMub3B0aW9ucy5kaXNhYmxlZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGpRdWVyeS5FdmVudCgncm90YXRlJyk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fb3BlblRhYihlLCBfdGhpcy5fZ2V0VGFiKF90aGlzLl9nZXROZXh0VGFiUmVmKCkpLCB0cnVlKTtcclxuICAgICAgICAgICAgfSwgc3BlZWQgfHwgKCgkLmlzTnVtZXJpYyhfdGhpcy5vcHRpb25zLnJvdGF0ZSkpID8gX3RoaXMub3B0aW9ucy5yb3RhdGUgOiA0MDAwKSApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlJvdGF0aW9uIGlzIG5vdCBwb3NzaWJsZSBpZiBhbGwgdGFicyBhcmUgZGlzYWJsZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gc3RvcHMgdGhlIHJvdGF0aW9uIG9mIHRoZSB0YWJzXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5zdG9wUm90YXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLnJvdGF0ZUludGVydmFsKTtcclxuICAgICAgICB0aGlzLnJvdGF0ZUludGVydmFsID0gMDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIGpRdWVyeSB3cmFwcGVyICovXHJcbiAgICAkLmZuLnJlc3BvbnNpdmVUYWJzID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xyXG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEkLmRhdGEodGhpcywgJ3Jlc3BvbnNpdmV0YWJzJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkLmRhdGEodGhpcywgJ3Jlc3BvbnNpdmV0YWJzJywgbmV3IFJlc3BvbnNpdmVUYWJzKCB0aGlzLCBvcHRpb25zICkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyAmJiBvcHRpb25zWzBdICE9PSAnXycgJiYgb3B0aW9ucyAhPT0gJ2luaXQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gJC5kYXRhKHRoaXMsICdyZXNwb25zaXZldGFicycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJlc3BvbnNpdmVUYWJzICYmIHR5cGVvZiBpbnN0YW5jZVtvcHRpb25zXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlW29wdGlvbnNdLmFwcGx5KCBpbnN0YW5jZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3MsIDEgKSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFsbG93IGluc3RhbmNlcyB0byBiZSBkZXN0cm95ZWQgdmlhIHRoZSAnZGVzdHJveScgbWV0aG9kXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyA9PT0gJ2Rlc3Ryb3knKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogZGVzdHJveSBpbnN0YW5jZSBjbGFzc2VzLCBldGNcclxuICAgICAgICAgICAgICAgICAgICAkLmRhdGEodGhpcywgJ3Jlc3BvbnNpdmV0YWJzJywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59KGpRdWVyeSwgd2luZG93KSk7XHJcbiJdfQ==
