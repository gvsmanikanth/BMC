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

            // DXP-686, reverting
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnJlc3BvbnNpdmVUYWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiAgUHJvamVjdDoganF1ZXJ5LnJlc3BvbnNpdmVUYWJzLmpzXG4gKiAgRGVzY3JpcHRpb246IEEgcGx1Z2luIHRoYXQgY3JlYXRlcyByZXNwb25zaXZlIHRhYnMsIG9wdGltaXplZCBmb3IgYWxsIGRldmljZXNcbiAqICBBdXRob3I6IEplbGxlIEtyYWx0IChqZWxsZUBqZWxsZWtyYWx0Lm5sKVxuICogIFZlcnNpb246IDEuNC41XG4gKiAgTGljZW5zZTogTUlUXG4gKi9cblxuOyhmdW5jdGlvbiAoICQsIHdpbmRvdywgdW5kZWZpbmVkICkge1xuXG4gICAgLyoqIERlZmF1bHQgc2V0dGluZ3MgKi9cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIGFjdGl2ZTogbnVsbCxcbiAgICAgICAgZXZlbnQ6ICdjbGljaycsXG4gICAgICAgIGRpc2FibGVkOiBbXSxcbiAgICAgICAgY29sbGFwc2libGU6ICdhY2NvcmRpb24nLFxuICAgICAgICBzdGFydENvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgIHJvdGF0ZTogZmFsc2UsXG4gICAgICAgIHNldEhhc2g6IGZhbHNlLFxuICAgICAgICBhbmltYXRpb246ICdkZWZhdWx0JyxcbiAgICAgICAgYW5pbWF0aW9uUXVldWU6IGZhbHNlLFxuICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICBzY3JvbGxUb0FjY29yZGlvbjogZmFsc2UsXG4gICAgICAgIGFjdGl2YXRlOiBmdW5jdGlvbigpe30sXG4gICAgICAgIGRlYWN0aXZhdGU6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgbG9hZDogZnVuY3Rpb24oKXt9LFxuICAgICAgICBhY3RpdmF0ZVN0YXRlOiBmdW5jdGlvbigpe30sXG4gICAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgICAgIHN0YXRlRGVmYXVsdDogJ3ItdGFicy1zdGF0ZS1kZWZhdWx0JyxcbiAgICAgICAgICAgIHN0YXRlQWN0aXZlOiAnci10YWJzLXN0YXRlLWFjdGl2ZScsXG4gICAgICAgICAgICBzdGF0ZURpc2FibGVkOiAnci10YWJzLXN0YXRlLWRpc2FibGVkJyxcbiAgICAgICAgICAgIHN0YXRlRXhjbHVkZWQ6ICdyLXRhYnMtc3RhdGUtZXhjbHVkZWQnLFxuICAgICAgICAgICAgdGFiOiAnci10YWJzLXRhYicsXG4gICAgICAgICAgICBhbmNob3I6ICdyLXRhYnMtYW5jaG9yJyxcbiAgICAgICAgICAgIHBhbmVsOiAnci10YWJzLXBhbmVsJyxcbiAgICAgICAgICAgIGFjY29yZGlvblRpdGxlOiAnci10YWJzLWFjY29yZGlvbi10aXRsZSdcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXNwb25zaXZlIFRhYnNcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudCAtIFRoZSBIVE1MIGVsZW1lbnQgdGhlIHZhbGlkYXRvciBzaG91bGQgYmUgYm91bmQgdG9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIEFuIG9wdGlvbiBtYXBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBSZXNwb25zaXZlVGFicyhlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7IC8vIFNlbGVjdGVkIERPTSBlbGVtZW50XG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpOyAvLyBTZWxlY3RlZCBqUXVlcnkgZWxlbWVudFxuXG4gICAgICAgIHRoaXMudGFicyA9IFtdOyAvLyBDcmVhdGUgdGFicyBhcnJheVxuICAgICAgICB0aGlzLnN0YXRlID0gJyc7IC8vIERlZmluZSB0aGUgcGx1Z2luIHN0YXRlICh0YWJzL2FjY29yZGlvbilcbiAgICAgICAgdGhpcy5yb3RhdGVJbnRlcnZhbCA9IDA7IC8vIERlZmluZSByb3RhdGUgaW50ZXJ2YWxcbiAgICAgICAgdGhpcy4kcXVldWUgPSAkKHt9KTtcblxuICAgICAgICAvLyBFeHRlbmQgdGhlIGRlZmF1bHRzIHdpdGggdGhlIHBhc3NlZCBvcHRpb25zXG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKCB7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBpbml0aWFsaXplcyB0aGUgdGFiIHBsdWdpblxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIC8vIExvYWQgYWxsIHRoZSBlbGVtZW50c1xuICAgICAgICB0aGlzLnRhYnMgPSB0aGlzLl9sb2FkRWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5fbG9hZENsYXNzZXMoKTtcbiAgICAgICAgdGhpcy5fbG9hZEV2ZW50cygpO1xuXG4gICAgICAgIC8vIFdpbmRvdyByZXNpemUgYmluZCB0byBjaGVjayBzdGF0ZVxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIF90aGlzLl9zZXRTdGF0ZShlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSGFzaGNoYW5nZSBldmVudFxuICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgdGFiUmVmID0gX3RoaXMuX2dldFRhYlJlZkJ5U2VsZWN0b3Iod2luZG93LmxvY2F0aW9uLmhhc2gpO1xuICAgICAgICAgICAgdmFyIG9UYWIgPSBfdGhpcy5fZ2V0VGFiKHRhYlJlZik7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGEgdGFiIGlzIGZvdW5kIHRoYXQgbWF0Y2hlcyB0aGUgaGFzaFxuICAgICAgICAgICAgaWYodGFiUmVmID49IDAgJiYgIW9UYWIuX2lnbm9yZUhhc2hDaGFuZ2UgJiYgIW9UYWIuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBzbywgb3BlbiB0aGUgdGFiIGFuZCBhdXRvIGNsb3NlIHRoZSBjdXJyZW50IG9uZVxuICAgICAgICAgICAgICAgIF90aGlzLl9vcGVuVGFiKGUsIF90aGlzLl9nZXRUYWIodGFiUmVmKSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFN0YXJ0IHJvdGF0ZSBldmVudCBpZiByb3RhdGUgb3B0aW9uIGlzIGRlZmluZWRcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLnJvdGF0ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRSb3RhdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRGVmaW5lIHBsdWdpbiBldmVudHNcbiAgICAgICAgLy9cblxuICAgICAgICAvLyBBY3RpdmF0ZTogdGhpcyBldmVudCBpcyBjYWxsZWQgd2hlbiBhIHRhYiBpcyBzZWxlY3RlZFxuICAgICAgICB0aGlzLiRlbGVtZW50LmJpbmQoJ3RhYnMtYWN0aXZhdGUnLCBmdW5jdGlvbihlLCBvVGFiKSB7XG4gICAgICAgICAgICBfdGhpcy5vcHRpb25zLmFjdGl2YXRlLmNhbGwodGhpcywgZSwgb1RhYik7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBEZWFjdGl2YXRlOiB0aGlzIGV2ZW50IGlzIGNhbGxlZCB3aGVuIGEgdGFiIGlzIGNsb3NlZFxuICAgICAgICB0aGlzLiRlbGVtZW50LmJpbmQoJ3RhYnMtZGVhY3RpdmF0ZScsIGZ1bmN0aW9uKGUsIG9UYWIpIHtcbiAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuZGVhY3RpdmF0ZS5jYWxsKHRoaXMsIGUsIG9UYWIpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQWN0aXZhdGUgU3RhdGU6IHRoaXMgZXZlbnQgaXMgY2FsbGVkIHdoZW4gdGhlIHBsdWdpbiBzd2l0Y2hlcyBzdGF0ZXNcbiAgICAgICAgdGhpcy4kZWxlbWVudC5iaW5kKCd0YWJzLWFjdGl2YXRlLXN0YXRlJywgZnVuY3Rpb24oZSwgc3RhdGUpIHtcbiAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuYWN0aXZhdGVTdGF0ZS5jYWxsKHRoaXMsIGUsIHN0YXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTG9hZDogdGhpcyBldmVudCBpcyBjYWxsZWQgd2hlbiB0aGUgcGx1Z2luIGhhcyBiZWVuIGxvYWRlZFxuICAgICAgICB0aGlzLiRlbGVtZW50LmJpbmQoJ3RhYnMtbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBzdGFydFRhYjtcblxuICAgICAgICAgICAgX3RoaXMuX3NldFN0YXRlKGUpOyAvLyBTZXQgc3RhdGVcblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBhbmVsIHNob3VsZCBiZSBjb2xsYXBlZCBvbiBsb2FkXG4gICAgICAgICAgICBpZihfdGhpcy5vcHRpb25zLnN0YXJ0Q29sbGFwc2VkICE9PSB0cnVlICYmICEoX3RoaXMub3B0aW9ucy5zdGFydENvbGxhcHNlZCA9PT0gJ2FjY29yZGlvbicgJiYgX3RoaXMuc3RhdGUgPT09ICdhY2NvcmRpb24nKSkge1xuXG4gICAgICAgICAgICAgICAgc3RhcnRUYWIgPSBfdGhpcy5fZ2V0U3RhcnRUYWIoKTtcblxuICAgICAgICAgICAgICAgIC8vIE9wZW4gdGhlIGluaXRpYWwgdGFiXG4gICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgc3RhcnRUYWIpOyAvLyBPcGVuIGZpcnN0IHRhYlxuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICBfdGhpcy5vcHRpb25zLmxvYWQuY2FsbCh0aGlzLCBlLCBzdGFydFRhYik7IC8vIENhbGwgdGhlIGxvYWQgY2FsbGJhY2tcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFRyaWdnZXIgbG9hZGVkIGV2ZW50XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndGFicy1sb2FkJyk7XG4gICAgfTtcblxuICAgIC8vXG4gICAgLy8gUFJJVkFURSBGVU5DVElPTlNcbiAgICAvL1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBsb2FkcyB0aGUgdGFiIGVsZW1lbnRzIGFuZCBzdG9yZXMgdGhlbSBpbiBhbiBhcnJheVxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2YgdGFiIGVsZW1lbnRzXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9sb2FkRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyICR1bCA9IHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oJ3VsJyk7XG4gICAgICAgIHZhciB0YWJzID0gW107XG4gICAgICAgIHZhciBpZCA9IDA7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBjbGFzc2VzIHRvIHRoZSBiYXNpYyBodG1sIGVsZW1lbnRzXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ3ItdGFicycpOyAvLyBUYWIgY29udGFpbmVyXG4gICAgICAgICR1bC5hZGRDbGFzcygnci10YWJzLW5hdicpOyAvLyBMaXN0IGNvbnRhaW5lclxuXG4gICAgICAgIC8vIEdldCB0YWIgYnV0dG9ucyBhbmQgc3RvcmUgdGhlaXIgZGF0YSBpbiBhbiBhcnJheVxuICAgICAgICAkKCdsaScsICR1bCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGFiID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBpc0V4Y2x1ZGVkID0gJHRhYi5oYXNDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVFeGNsdWRlZCk7XG4gICAgICAgICAgICB2YXIgJGFuY2hvciwgJHBhbmVsLCAkYWNjb3JkaW9uVGFiLCAkYWNjb3JkaW9uQW5jaG9yLCBwYW5lbFNlbGVjdG9yO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgdGFiIHNob3VsZCBiZSBleGNsdWRlZFxuICAgICAgICAgICAgaWYoIWlzRXhjbHVkZWQpIHtcblxuICAgICAgICAgICAgICAgICRhbmNob3IgPSAkKCdhJywgJHRhYik7XG4gICAgICAgICAgICAgICAgcGFuZWxTZWxlY3RvciA9ICRhbmNob3IuYXR0cignaHJlZicpO1xuICAgICAgICAgICAgICAgICRwYW5lbCA9ICQocGFuZWxTZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgJGFjY29yZGlvblRhYiA9ICQoJzxkaXY+PC9kaXY+JykuaW5zZXJ0QmVmb3JlKCRwYW5lbCk7XG4gICAgICAgICAgICAgICAgJGFjY29yZGlvbkFuY2hvciA9ICQoJzxhPjwvYT4nKS5hdHRyKCdocmVmJywgcGFuZWxTZWxlY3RvcikuaHRtbCgkYW5jaG9yLmh0bWwoKSkuYXBwZW5kVG8oJGFjY29yZGlvblRhYik7XG5cbiAgICAgICAgICAgICAgICB2YXIgb1RhYiA9IHtcbiAgICAgICAgICAgICAgICAgICAgX2lnbm9yZUhhc2hDaGFuZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiAoJC5pbkFycmF5KGlkLCBfdGhpcy5vcHRpb25zLmRpc2FibGVkKSAhPT0gLTEpLFxuICAgICAgICAgICAgICAgICAgICB0YWI6ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogJCgnYScsICR0YWIpLFxuICAgICAgICAgICAgICAgICAgICBwYW5lbDogJHBhbmVsLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogcGFuZWxTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgYWNjb3JkaW9uVGFiOiAkYWNjb3JkaW9uVGFiLFxuICAgICAgICAgICAgICAgICAgICBhY2NvcmRpb25BbmNob3I6ICRhY2NvcmRpb25BbmNob3IsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gMXVwIHRoZSBJRFxuICAgICAgICAgICAgICAgIGlkKys7XG4gICAgICAgICAgICAgICAgLy8gQWRkIHRvIHRhYiBhcnJheVxuICAgICAgICAgICAgICAgIHRhYnMucHVzaChvVGFiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0YWJzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gYWRkcyBjbGFzc2VzIHRvIHRoZSB0YWIgZWxlbWVudHMgYmFzZWQgb24gdGhlIG9wdGlvbnNcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2xvYWRDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS50YWIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy50YWIpO1xuICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFuY2hvci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5hbmNob3IpO1xuICAgICAgICAgICAgdGhpcy50YWJzW2ldLnBhbmVsLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMucGFuZWwpO1xuICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFjY29yZGlvblRhYi5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5hY2NvcmRpb25UaXRsZSk7XG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0uYWNjb3JkaW9uQW5jaG9yLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmFuY2hvcik7XG4gICAgICAgICAgICBpZih0aGlzLnRhYnNbaV0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhYnNbaV0udGFiLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEaXNhYmxlZCk7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xuICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGV2ZW50cyB0byB0aGUgdGFiIGVsZW1lbnRzXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9sb2FkRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgLy8gRGVmaW5lIGFjdGl2YXRlIGV2ZW50IG9uIGEgdGFiIGVsZW1lbnRcbiAgICAgICAgdmFyIGZBY3RpdmF0ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gX3RoaXMuX2dldEN1cnJlbnRUYWIoKTsgLy8gRmV0Y2ggY3VycmVudCB0YWJcbiAgICAgICAgICAgIHZhciBhY3RpdmF0ZWRUYWIgPSBlLmRhdGEudGFiO1xuXG4gICAgICAgICAgICAvLyBEWFAtNjg2LCByZXZlcnRpbmdcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoaXMgdGFiIGlzbid0IGRpc2FibGVkXG4gICAgICAgICAgICBpZighYWN0aXZhdGVkVGFiLmRpc2FibGVkKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBoYXNoIGhhcyB0byBiZSBzZXQgaW4gdGhlIFVSTCBsb2NhdGlvblxuICAgICAgICAgICAgICAgIGlmKF90aGlzLm9wdGlvbnMuc2V0SGFzaCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGhhc2ggdXNpbmcgdGhlIGhpc3RvcnkgYXBpIGlmIGF2YWlsYWJsZSB0byB0YWNrbGUgQ2hyb21lcyByZXBhaW50IGJ1ZyBvbiBoYXNoIGNoYW5nZVxuICAgICAgICAgICAgICAgICAgICBpZihoaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgYWN0aXZhdGVkVGFiLnNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSBmYWxsYmFjayB0byB0aGUgaGFzaCB1cGRhdGUgZm9yIHNpdGVzIHRoYXQgZG9uJ3Qgc3VwcG9ydCB0aGUgaGlzdG9yeSBhcGlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYWN0aXZhdGVkVGFiLnNlbGVjdG9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZS5kYXRhLnRhYi5faWdub3JlSGFzaENoYW5nZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgYWN0aXZhdGVkIHRhYiBpc250IHRoZSBjdXJyZW50IG9uZSBvciBpZiBpdHMgY29sbGFwc2libGUuIElmIG5vdCwgZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnQgIT09IGFjdGl2YXRlZFRhYiB8fCBfdGhpcy5faXNDb2xsYXBpc2JsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBhY3RpdmF0ZWQgdGFiIGlzIGVpdGhlciBhbm90aGVyIHRhYiBvZiB0aGUgY3VycmVudCBvbmUuIElmIGl0J3MgdGhlIGN1cnJlbnQgdGFiIGl0IGlzIGNvbGxhcHNpYmxlXG4gICAgICAgICAgICAgICAgICAgIC8vIEVpdGhlciB3YXksIHRoZSBjdXJyZW50IHRhYiBjYW4gYmUgY2xvc2VkXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jbG9zZVRhYihlLCBjdXJyZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgYWN0aXZhdGVkIHRhYiBpc250IHRoZSBjdXJyZW50IG9uZSBvciBpZiBpdCBpc250IGNvbGxhcHNpYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmKGN1cnJlbnQgIT09IGFjdGl2YXRlZFRhYiB8fCAhX3RoaXMuX2lzQ29sbGFwaXNibGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgYWN0aXZhdGVkVGFiLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTG9vcCB0YWJzXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIEFkZCBhY3RpdmF0ZSBmdW5jdGlvbiB0byB0aGUgdGFiIGFuZCBhY2NvcmRpb24gc2VsZWN0aW9uIGVsZW1lbnRcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS5hbmNob3Iub24oX3RoaXMub3B0aW9ucy5ldmVudCwge3RhYjogX3RoaXMudGFic1tpXX0sIGZBY3RpdmF0ZSk7XG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0uYWNjb3JkaW9uQW5jaG9yLm9uKF90aGlzLm9wdGlvbnMuZXZlbnQsIHt0YWI6IF90aGlzLnRhYnNbaV19LCBmQWN0aXZhdGUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gZ2V0cyB0aGUgdGFiIHRoYXQgc2hvdWxkIGJlIG9wZW5lZCBhdCBzdGFydFxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRhYiBvYmplY3RcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldFN0YXJ0VGFiID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0YWJSZWYgPSB0aGlzLl9nZXRUYWJSZWZCeVNlbGVjdG9yKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcbiAgICAgICAgdmFyIHN0YXJ0VGFiO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBwYWdlIGhhcyBhIGhhc2ggc2V0IHRoYXQgaXMgbGlua2VkIHRvIGEgdGFiXG4gICAgICAgIGlmKHRhYlJlZiA+PSAwICYmICF0aGlzLl9nZXRUYWIodGFiUmVmKS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgLy8gSWYgc28sIHNldCB0aGUgY3VycmVudCB0YWIgdG8gdGhlIGxpbmtlZCB0YWJcbiAgICAgICAgICAgIHN0YXJ0VGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XG4gICAgICAgIH0gZWxzZSBpZih0aGlzLm9wdGlvbnMuYWN0aXZlID4gMCAmJiAhdGhpcy5fZ2V0VGFiKHRoaXMub3B0aW9ucy5hY3RpdmUpLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBzdGFydFRhYiA9IHRoaXMuX2dldFRhYih0aGlzLm9wdGlvbnMuYWN0aXZlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIG5vdCwganVzdCBnZXQgdGhlIGZpcnN0IG9uZVxuICAgICAgICAgICAgc3RhcnRUYWIgPSB0aGlzLl9nZXRUYWIoMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhcnRUYWI7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gc2V0cyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgcGx1Z2luXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSAtIFRoZSBldmVudCB0aGF0IHRyaWdnZXJzIHRoZSBzdGF0ZSBjaGFuZ2VcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX3NldFN0YXRlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgJHVsID0gJCgndWwnLCB0aGlzLiRlbGVtZW50KTtcbiAgICAgICAgdmFyIG9sZFN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgdmFyIHN0YXJ0Q29sbGFwc2VkSXNTdGF0ZSA9ICh0eXBlb2YgdGhpcy5vcHRpb25zLnN0YXJ0Q29sbGFwc2VkID09PSAnc3RyaW5nJyk7XG4gICAgICAgIHZhciBzdGFydFRhYjtcblxuICAgICAgICAvLyBUaGUgc3RhdGUgaXMgYmFzZWQgb24gdGhlIHZpc2liaWxpdHkgb2YgdGhlIHRhYnMgbGlzdFxuICAgICAgICBpZigkdWwuaXMoJzp2aXNpYmxlJykpe1xuICAgICAgICAgICAgLy8gVGFiIGxpc3QgaXMgdmlzaWJsZSwgc28gdGhlIHN0YXRlIGlzICd0YWJzJ1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICd0YWJzJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRhYiBsaXN0IGlzIGludmlzaWJsZSwgc28gdGhlIHN0YXRlIGlzICdhY2NvcmRpb24nXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2FjY29yZGlvbic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgbmV3IHN0YXRlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBvbGQgc3RhdGVcbiAgICAgICAgaWYodGhpcy5zdGF0ZSAhPT0gb2xkU3RhdGUpIHtcbiAgICAgICAgICAgIC8vIElmIHNvLCB0aGUgc3RhdGUgYWN0aXZhdGUgdHJpZ2dlciBtdXN0IGJlIGNhbGxlZFxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCd0YWJzLWFjdGl2YXRlLXN0YXRlJywge29sZFN0YXRlOiBvbGRTdGF0ZSwgbmV3U3RhdGU6IHRoaXMuc3RhdGV9KTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHN0YXRlIHN3aXRjaCBzaG91bGQgb3BlbiBhIHRhYlxuICAgICAgICAgICAgaWYob2xkU3RhdGUgJiYgc3RhcnRDb2xsYXBzZWRJc1N0YXRlICYmIHRoaXMub3B0aW9ucy5zdGFydENvbGxhcHNlZCAhPT0gdGhpcy5zdGF0ZSAmJiB0aGlzLl9nZXRDdXJyZW50VGFiKCkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIEdldCBpbml0aWFsIHRhYlxuICAgICAgICAgICAgICAgIHN0YXJ0VGFiID0gdGhpcy5fZ2V0U3RhcnRUYWIoZSk7XG4gICAgICAgICAgICAgICAgLy8gT3BlbiB0aGUgaW5pdGlhbCB0YWJcbiAgICAgICAgICAgICAgICB0aGlzLl9vcGVuVGFiKGUsIHN0YXJ0VGFiKTsgLy8gT3BlbiBmaXJzdCB0YWJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIG9wZW5zIGEgdGFiXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSAtIFRoZSBldmVudCB0aGF0IHRyaWdnZXJzIHRoZSB0YWIgb3BlbmluZ1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvVGFiIC0gVGhlIHRhYiBvYmplY3QgdGhhdCBzaG91bGQgYmUgb3BlbmVkXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBjbG9zZUN1cnJlbnQgLSBEZWZpbmVzIGlmIHRoZSBjdXJyZW50IHRhYiBzaG91bGQgYmUgY2xvc2VkXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBzdG9wUm90YXRpb24gLSBEZWZpbmVzIGlmIHRoZSB0YWIgcm90YXRpb24gbG9vcCBzaG91bGQgYmUgc3RvcHBlZFxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fb3BlblRhYiA9IGZ1bmN0aW9uKGUsIG9UYWIsIGNsb3NlQ3VycmVudCwgc3RvcFJvdGF0aW9uKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgdGFiIGhhcyB0byBiZSBjbG9zZWRcbiAgICAgICAgaWYoY2xvc2VDdXJyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9jbG9zZVRhYihlLCB0aGlzLl9nZXRDdXJyZW50VGFiKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHJvdGF0aW9uIGhhcyB0byBiZSBzdG9wcGVkIHdoZW4gYWN0aXZhdGVkXG4gICAgICAgIGlmKHN0b3BSb3RhdGlvbiAmJiB0aGlzLnJvdGF0ZUludGVydmFsID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wUm90YXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCB0aGlzIHRhYiB0byBhY3RpdmVcbiAgICAgICAgb1RhYi5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAvLyBTZXQgYWN0aXZlIGNsYXNzZXMgdG8gdGhlIHRhYiBidXR0b24gYW5kIGFjY29yZGlvbiB0YWIgYnV0dG9uXG4gICAgICAgIG9UYWIudGFiLnJlbW92ZUNsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZUFjdGl2ZSk7XG4gICAgICAgIG9UYWIuYWNjb3JkaW9uVGFiLnJlbW92ZUNsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZUFjdGl2ZSk7XG5cbiAgICAgICAgLy8gUnVuIHBhbmVsIHRyYW5zaXRvblxuICAgICAgICBfdGhpcy5fZG9UcmFuc2l0aW9uKG9UYWIucGFuZWwsIF90aGlzLm9wdGlvbnMuYW5pbWF0aW9uLCAnb3BlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gV2hlbiBmaW5pc2hlZCwgc2V0IGFjdGl2ZSBjbGFzcyB0byB0aGUgcGFuZWxcbiAgICAgICAgICAgIG9UYWIucGFuZWwucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKTtcblxuICAgICAgICAgICAvLyBBbmQgaWYgZW5hYmxlZCBhbmQgc3RhdGUgaXMgYWNjb3JkaW9uLCBzY3JvbGwgdG8gdGhlIGFjY29yZGlvbiB0YWJcbiAgICAgICAgICAgIGlmKF90aGlzLmdldFN0YXRlKCkgPT09ICdhY2NvcmRpb24nICYmIF90aGlzLm9wdGlvbnMuc2Nyb2xsVG9BY2NvcmRpb24gJiYgKCFfdGhpcy5faXNJblZpZXcob1RhYi5hY2NvcmRpb25UYWIpIHx8IF90aGlzLm9wdGlvbnMuYW5pbWF0aW9uICE9PSAnZGVmYXVsdCcpKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGFuaW1hdGlvbiBvcHRpb24gaXMgZW5hYmxlZCwgYW5kIGlmIHRoZSBkdXJhdGlvbiBpc24ndCAwXG4gICAgICAgICAgICAgICAgaWYoX3RoaXMub3B0aW9ucy5hbmltYXRpb24gIT09ICdkZWZhdWx0JyAmJiBfdGhpcy5vcHRpb25zLmR1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBzbywgc2V0IHNjcm9sbFRvcCB3aXRoIGFuaW1hdGUgYW5kIHVzZSB0aGUgJ2FuaW1hdGlvbicgZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBvVGFiLmFjY29yZGlvblRhYi5vZmZzZXQoKS50b3BcbiAgICAgICAgICAgICAgICAgICAgfSwgX3RoaXMub3B0aW9ucy5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gIElmIG5vdCwganVzdCBzZXQgc2Nyb2xsVG9wXG4gICAgICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zY3JvbGxUb3Aob1RhYi5hY2NvcmRpb25UYWIub2Zmc2V0KCkudG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndGFicy1hY3RpdmF0ZScsIG9UYWIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGNsb3NlcyBhIHRhYlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBUaGUgZXZlbnQgdGhhdCBpcyB0cmlnZ2VyZWQgd2hlbiBhIHRhYiBpcyBjbG9zZWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1RhYiAtIFRoZSB0YWIgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIGNsb3NlZFxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fY2xvc2VUYWIgPSBmdW5jdGlvbihlLCBvVGFiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBkb1F1ZXVlT25TdGF0ZSA9IHR5cGVvZiBfdGhpcy5vcHRpb25zLmFuaW1hdGlvblF1ZXVlID09PSAnc3RyaW5nJztcbiAgICAgICAgdmFyIGRvUXVldWU7XG5cbiAgICAgICAgaWYob1RhYiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZihkb1F1ZXVlT25TdGF0ZSAmJiBfdGhpcy5nZXRTdGF0ZSgpID09PSBfdGhpcy5vcHRpb25zLmFuaW1hdGlvblF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgZG9RdWV1ZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYoZG9RdWV1ZU9uU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBkb1F1ZXVlID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvUXVldWUgPSBfdGhpcy5vcHRpb25zLmFuaW1hdGlvblF1ZXVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEZWFjdGl2YXRlIHRhYlxuICAgICAgICAgICAgb1RhYi5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIFNldCBkZWZhdWx0IGNsYXNzIHRvIHRoZSB0YWIgYnV0dG9uXG4gICAgICAgICAgICBvVGFiLnRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpO1xuXG4gICAgICAgICAgICAvLyBSdW4gcGFuZWwgdHJhbnNpdGlvblxuICAgICAgICAgICAgX3RoaXMuX2RvVHJhbnNpdGlvbihvVGFiLnBhbmVsLCBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbiwgJ2Nsb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0IGRlZmF1bHQgY2xhc3MgdG8gdGhlIGFjY29yZGlvbiB0YWIgYnV0dG9uIGFuZCB0YWIgcGFuZWxcbiAgICAgICAgICAgICAgICBvVGFiLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpO1xuICAgICAgICAgICAgICAgIG9UYWIucGFuZWwucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KTtcbiAgICAgICAgICAgIH0sICFkb1F1ZXVlKTtcblxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCd0YWJzLWRlYWN0aXZhdGUnLCBvVGFiKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJ1bnMgYW4gZWZmZWN0IG9uIGEgcGFuZWxcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IHBhbmVsIC0gVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgdGFiIHBhbmVsXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZCAtIFRoZSB0cmFuc2l0aW9uIG1ldGhvZCByZWZlcmVuY2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RhdGUgLSBUaGUgc3RhdGUgKG9wZW4vY2xvc2VkKSB0aGF0IHRoZSBwYW5lbCBzaG91bGQgdHJhbnNpdGlvbiB0b1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIGFmdGVyIHRoZSB0cmFuc2l0aW9uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBkZXF1ZXVlIC0gRGVmaW5lcyBpZiB0aGUgZXZlbnQgcXVldWUgc2hvdWxkIGJlIGRlcXVldWVkIGFmdGVyIHRoZSB0cmFuc2l0aW9uXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9kb1RyYW5zaXRpb24gPSBmdW5jdGlvbihwYW5lbCwgbWV0aG9kLCBzdGF0ZSwgY2FsbGJhY2ssIGRlcXVldWUpIHtcbiAgICAgICAgdmFyIGVmZmVjdDtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBHZXQgZWZmZWN0IGJhc2VkIG9uIG1ldGhvZFxuICAgICAgICBzd2l0Y2gobWV0aG9kKSB7XG4gICAgICAgICAgICBjYXNlICdzbGlkZSc6XG4gICAgICAgICAgICAgICAgZWZmZWN0ID0gKHN0YXRlID09PSAnb3BlbicpID8gJ3NsaWRlRG93bicgOiAnc2xpZGVVcCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmYWRlJzpcbiAgICAgICAgICAgICAgICBlZmZlY3QgPSAoc3RhdGUgPT09ICdvcGVuJykgPyAnZmFkZUluJyA6ICdmYWRlT3V0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZWZmZWN0ID0gKHN0YXRlID09PSAnb3BlbicpID8gJ3Nob3cnIDogJ2hpZGUnO1xuICAgICAgICAgICAgICAgIC8vIFdoZW4gZGVmYXVsdCBpcyB1c2VkLCBzZXQgdGhlIGR1cmF0aW9uIHRvIDBcbiAgICAgICAgICAgICAgICBfdGhpcy5vcHRpb25zLmR1cmF0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0aGUgdHJhbnNpdGlvbiB0byBhIGN1c3RvbSBxdWV1ZVxuICAgICAgICB0aGlzLiRxdWV1ZS5xdWV1ZSgncmVzcG9uc2l2ZS10YWJzJyxmdW5jdGlvbihuZXh0KXtcbiAgICAgICAgICAgIC8vIFJ1biB0aGUgdHJhbnNpdGlvbiBvbiB0aGUgcGFuZWxcbiAgICAgICAgICAgIHBhbmVsW2VmZmVjdF0oe1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBfdGhpcy5vcHRpb25zLmR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChwYW5lbCwgbWV0aG9kLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biB0aGUgbmV4dCBmdW5jdGlvbiBpbiB0aGUgcXVldWVcbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXaGVuIHRoZSBwYW5lbCBpcyBvcGVuZW5kLCBkZXF1ZXVlIGV2ZXJ5dGhpbmcgc28gdGhlIGFuaW1hdGlvbiBzdGFydHNcbiAgICAgICAgaWYoc3RhdGUgPT09ICdvcGVuJyB8fCBkZXF1ZXVlKSB7XG4gICAgICAgICAgICB0aGlzLiRxdWV1ZS5kZXF1ZXVlKCdyZXNwb25zaXZlLXRhYnMnKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgY29sbGFwc2liaWxpdHkgb2YgdGhlIHRhYiBpbiB0aGlzIHN0YXRlXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IFRoZSBjb2xsYXBzaWJpbGl0eSBvZiB0aGUgdGFiXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9pc0NvbGxhcGlzYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAodHlwZW9mIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSA9PT0gJ2Jvb2xlYW4nICYmIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSkgfHwgKHR5cGVvZiB0aGlzLm9wdGlvbnMuY29sbGFwc2libGUgPT09ICdzdHJpbmcnICYmIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSA9PT0gdGhpcy5nZXRTdGF0ZSgpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgdGFiIGJ5IG51bWVyaWMgcmVmZXJlbmNlXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBudW1SZWYgLSBOdW1lcmljIHRhYiByZWZlcmVuY2VcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUYWIgb2JqZWN0XG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRUYWIgPSBmdW5jdGlvbihudW1SZWYpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFic1tudW1SZWZdO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIG51bWVyaWMgdGFiIHJlZmVyZW5jZSBiYXNlZCBvbiBhIGhhc2ggc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBIYXNoIHNlbGVjdG9yXG4gICAgICogQHJldHVybnMge0ludGVnZXJ9IE51bWVyaWMgdGFiIHJlZmVyZW5jZVxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0VGFiUmVmQnlTZWxlY3RvciA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICAgIC8vIExvb3AgYWxsIHRhYnNcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGhhc2ggc2VsZWN0b3IgaXMgZXF1YWwgdG8gdGhlIHRhYiBzZWxlY3RvclxuICAgICAgICAgICAgaWYodGhpcy50YWJzW2ldLnNlbGVjdG9yID09PSBzZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIG5vbmUgaXMgZm91bmQgcmV0dXJuIGEgbmVnYXRpdmUgaW5kZXhcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGN1cnJlbnQgdGFiIGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBDdXJyZW50IHRhYiBlbGVtZW50XG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRDdXJyZW50VGFiID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRUYWIodGhpcy5fZ2V0Q3VycmVudFRhYlJlZigpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBuZXh0IHRhYidzIG51bWVyaWMgcmVmZXJlbmNlXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBjdXJyZW50VGFiUmVmIC0gQ3VycmVudCBudW1lcmljIHRhYiByZWZlcmVuY2VcbiAgICAgKiBAcmV0dXJucyB7SW50ZWdlcn0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXROZXh0VGFiUmVmID0gZnVuY3Rpb24oY3VycmVudFRhYlJlZikge1xuICAgICAgICB2YXIgdGFiUmVmID0gKGN1cnJlbnRUYWJSZWYgfHwgdGhpcy5fZ2V0Q3VycmVudFRhYlJlZigpKTtcbiAgICAgICAgdmFyIG5leHRUYWJSZWYgPSAodGFiUmVmID09PSB0aGlzLnRhYnMubGVuZ3RoIC0gMSkgPyAwIDogdGFiUmVmICsgMTtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9nZXRUYWIobmV4dFRhYlJlZikuZGlzYWJsZWQpID8gdGhpcy5fZ2V0TmV4dFRhYlJlZihuZXh0VGFiUmVmKSA6IG5leHRUYWJSZWY7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcHJldmlvdXMgdGFiJ3MgbnVtZXJpYyByZWZlcmVuY2VcbiAgICAgKiBAcmV0dXJucyB7SW50ZWdlcn0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRQcmV2aW91c1RhYlJlZiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSA9PT0gMCkgPyB0aGlzLnRhYnMubGVuZ3RoIC0gMSA6IHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSAtIDE7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgY3VycmVudCB0YWIncyBudW1lcmljIHJlZmVyZW5jZVxuICAgICAqIEByZXR1cm5zIHtJbnRlZ2VyfSBOdW1lcmljIHRhYiByZWZlcmVuY2VcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldEN1cnJlbnRUYWJSZWYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gTG9vcCBhbGwgdGFic1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy50YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIHRhYiBpcyBhY3RpdmUsIHJldHVybiBpdFxuICAgICAgICAgICAgaWYodGhpcy50YWJzW2ldLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE5vIHRhYnMgaGF2ZSBiZWVuIGZvdW5kLCByZXR1cm4gbmVnYXRpdmUgaW5kZXhcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICAvL1xuICAgIC8vIEhFTFBFUiBGVU5DVElPTlNcbiAgICAvL1xuXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9pc0luVmlldyA9IGZ1bmN0aW9uKCRlbGVtZW50KSB7XG4gICAgICAgIHZhciBkb2NWaWV3VG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpLFxuICAgICAgICAgICAgZG9jVmlld0JvdHRvbSA9IGRvY1ZpZXdUb3AgKyAkKHdpbmRvdykuaGVpZ2h0KCksXG4gICAgICAgICAgICBlbGVtVG9wID0gJGVsZW1lbnQub2Zmc2V0KCkudG9wLFxuICAgICAgICAgICAgZWxlbUJvdHRvbSA9IGVsZW1Ub3AgKyAkZWxlbWVudC5oZWlnaHQoKTtcbiAgICAgICAgcmV0dXJuICgoZWxlbUJvdHRvbSA8PSBkb2NWaWV3Qm90dG9tKSAmJiAoZWxlbVRvcCA+PSBkb2NWaWV3VG9wKSk7XG4gICAgfTtcblxuICAgIC8vXG4gICAgLy8gUFVCTElDIEZVTkNUSU9OU1xuICAgIC8vXG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGFjdGl2YXRlcyBhIHRhYlxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gdGFiUmVmIC0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBzdG9wUm90YXRpb24gLSBEZWZpbmVzIGlmIHRoZSB0YWIgcm90YXRpb24gc2hvdWxkIHN0b3AgYWZ0ZXIgYWN0aXZhdGlvblxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uKHRhYlJlZiwgc3RvcFJvdGF0aW9uKSB7XG4gICAgICAgIHZhciBlID0galF1ZXJ5LkV2ZW50KCd0YWJzLWFjdGl2YXRlJyk7XG4gICAgICAgIHZhciBvVGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XG4gICAgICAgIGlmKCFvVGFiLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9vcGVuVGFiKGUsIG9UYWIsIHRydWUsIHN0b3BSb3RhdGlvbiB8fCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGRlYWN0aXZhdGVzIGEgdGFiXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSB0YWJSZWYgLSBOdW1lcmljIHRhYiByZWZlcmVuY2VcbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uKHRhYlJlZikge1xuICAgICAgICB2YXIgZSA9IGpRdWVyeS5FdmVudCgndGFicy1kZWN0aXZhdGUnKTtcbiAgICAgICAgdmFyIG9UYWIgPSB0aGlzLl9nZXRUYWIodGFiUmVmKTtcbiAgICAgICAgaWYoIW9UYWIuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2Nsb3NlVGFiKGUsIG9UYWIpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gZW5hYmxlcyBhIHRhYlxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gdGFiUmVmIC0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKHRhYlJlZikge1xuICAgICAgICB2YXIgb1RhYiA9IHRoaXMuX2dldFRhYih0YWJSZWYpO1xuICAgICAgICBpZihvVGFiKXtcbiAgICAgICAgICAgIG9UYWIuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIG9UYWIudGFiLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEaXNhYmxlZCk7XG4gICAgICAgICAgICBvVGFiLmFjY29yZGlvblRhYi5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gZGlzYWJsZSBhIHRhYlxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gdGFiUmVmIC0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbih0YWJSZWYpIHtcbiAgICAgICAgdmFyIG9UYWIgPSB0aGlzLl9nZXRUYWIodGFiUmVmKTtcbiAgICAgICAgaWYob1RhYil7XG4gICAgICAgICAgICBvVGFiLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG9UYWIudGFiLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEaXNhYmxlZCk7XG4gICAgICAgICAgICBvVGFiLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gZ2V0cyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgcGx1Z2luXG4gICAgICogQHJldHVybnMge1N0cmluZ30gU3RhdGUgb2YgdGhlIHBsdWdpblxuICAgICAqL1xuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiBzdGFydHMgdGhlIHJvdGF0aW9uIG9mIHRoZSB0YWJzXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBzcGVlZCAtIFRoZSBzcGVlZCBvZiB0aGUgcm90YXRpb25cbiAgICAgKi9cbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuc3RhcnRSb3RhdGlvbiA9IGZ1bmN0aW9uKHNwZWVkKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBub3QgYWxsIHRhYnMgYXJlIGRpc2FibGVkXG4gICAgICAgIGlmKHRoaXMudGFicy5sZW5ndGggPiB0aGlzLm9wdGlvbnMuZGlzYWJsZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGpRdWVyeS5FdmVudCgncm90YXRlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgX3RoaXMuX2dldFRhYihfdGhpcy5fZ2V0TmV4dFRhYlJlZigpKSwgdHJ1ZSk7XG4gICAgICAgICAgICB9LCBzcGVlZCB8fCAoKCQuaXNOdW1lcmljKF90aGlzLm9wdGlvbnMucm90YXRlKSkgPyBfdGhpcy5vcHRpb25zLnJvdGF0ZSA6IDQwMDApICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSb3RhdGlvbiBpcyBub3QgcG9zc2libGUgaWYgYWxsIHRhYnMgYXJlIGRpc2FibGVkXCIpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gc3RvcHMgdGhlIHJvdGF0aW9uIG9mIHRoZSB0YWJzXG4gICAgICovXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLnN0b3BSb3RhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLnJvdGF0ZUludGVydmFsKTtcbiAgICAgICAgdGhpcy5yb3RhdGVJbnRlcnZhbCA9IDA7XG4gICAgfTtcblxuICAgIC8qKiBqUXVlcnkgd3JhcHBlciAqL1xuICAgICQuZm4ucmVzcG9uc2l2ZVRhYnMgPSBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkLmRhdGEodGhpcywgJ3Jlc3BvbnNpdmV0YWJzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5kYXRhKHRoaXMsICdyZXNwb25zaXZldGFicycsIG5ldyBSZXNwb25zaXZlVGFicyggdGhpcywgb3B0aW9ucyApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycgJiYgb3B0aW9uc1swXSAhPT0gJ18nICYmIG9wdGlvbnMgIT09ICdpbml0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gJC5kYXRhKHRoaXMsICdyZXNwb25zaXZldGFicycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUmVzcG9uc2l2ZVRhYnMgJiYgdHlwZW9mIGluc3RhbmNlW29wdGlvbnNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlW29wdGlvbnNdLmFwcGx5KCBpbnN0YW5jZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3MsIDEgKSApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFsbG93IGluc3RhbmNlcyB0byBiZSBkZXN0cm95ZWQgdmlhIHRoZSAnZGVzdHJveScgbWV0aG9kXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgPT09ICdkZXN0cm95Jykge1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBkZXN0cm95IGluc3RhbmNlIGNsYXNzZXMsIGV0Y1xuICAgICAgICAgICAgICAgICAgICAkLmRhdGEodGhpcywgJ3Jlc3BvbnNpdmV0YWJzJywgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KGpRdWVyeSwgd2luZG93KSk7XG4iXX0=
