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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnJlc3BvbnNpdmVUYWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXHJcbiAqICBQcm9qZWN0OiBqcXVlcnkucmVzcG9uc2l2ZVRhYnMuanNcclxuICogIERlc2NyaXB0aW9uOiBBIHBsdWdpbiB0aGF0IGNyZWF0ZXMgcmVzcG9uc2l2ZSB0YWJzLCBvcHRpbWl6ZWQgZm9yIGFsbCBkZXZpY2VzXHJcbiAqICBBdXRob3I6IEplbGxlIEtyYWx0IChqZWxsZUBqZWxsZWtyYWx0Lm5sKVxyXG4gKiAgVmVyc2lvbjogMS40LjVcclxuICogIExpY2Vuc2U6IE1JVFxyXG4gKi9cclxuXHJcbjsoZnVuY3Rpb24gKCAkLCB3aW5kb3csIHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAvKiogRGVmYXVsdCBzZXR0aW5ncyAqL1xyXG4gICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICAgIGFjdGl2ZTogbnVsbCxcclxuICAgICAgICBldmVudDogJ2NsaWNrJyxcclxuICAgICAgICBkaXNhYmxlZDogW10sXHJcbiAgICAgICAgY29sbGFwc2libGU6ICdhY2NvcmRpb24nLFxyXG4gICAgICAgIHN0YXJ0Q29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgICByb3RhdGU6IGZhbHNlLFxyXG4gICAgICAgIHNldEhhc2g6IGZhbHNlLFxyXG4gICAgICAgIGFuaW1hdGlvbjogJ2RlZmF1bHQnLFxyXG4gICAgICAgIGFuaW1hdGlvblF1ZXVlOiBmYWxzZSxcclxuICAgICAgICBkdXJhdGlvbjogNTAwLFxyXG4gICAgICAgIHNjcm9sbFRvQWNjb3JkaW9uOiBmYWxzZSxcclxuICAgICAgICBhY3RpdmF0ZTogZnVuY3Rpb24oKXt9LFxyXG4gICAgICAgIGRlYWN0aXZhdGU6IGZ1bmN0aW9uKCl7fSxcclxuICAgICAgICBsb2FkOiBmdW5jdGlvbigpe30sXHJcbiAgICAgICAgYWN0aXZhdGVTdGF0ZTogZnVuY3Rpb24oKXt9LFxyXG4gICAgICAgIGNsYXNzZXM6IHtcclxuICAgICAgICAgICAgc3RhdGVEZWZhdWx0OiAnci10YWJzLXN0YXRlLWRlZmF1bHQnLFxyXG4gICAgICAgICAgICBzdGF0ZUFjdGl2ZTogJ3ItdGFicy1zdGF0ZS1hY3RpdmUnLFxyXG4gICAgICAgICAgICBzdGF0ZURpc2FibGVkOiAnci10YWJzLXN0YXRlLWRpc2FibGVkJyxcclxuICAgICAgICAgICAgc3RhdGVFeGNsdWRlZDogJ3ItdGFicy1zdGF0ZS1leGNsdWRlZCcsXHJcbiAgICAgICAgICAgIHRhYjogJ3ItdGFicy10YWInLFxyXG4gICAgICAgICAgICBhbmNob3I6ICdyLXRhYnMtYW5jaG9yJyxcclxuICAgICAgICAgICAgcGFuZWw6ICdyLXRhYnMtcGFuZWwnLFxyXG4gICAgICAgICAgICBhY2NvcmRpb25UaXRsZTogJ3ItdGFicy1hY2NvcmRpb24tdGl0bGUnXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc3BvbnNpdmUgVGFic1xyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudCAtIFRoZSBIVE1MIGVsZW1lbnQgdGhlIHZhbGlkYXRvciBzaG91bGQgYmUgYm91bmQgdG9cclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gQW4gb3B0aW9uIG1hcFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBSZXNwb25zaXZlVGFicyhlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDsgLy8gU2VsZWN0ZWQgRE9NIGVsZW1lbnRcclxuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTsgLy8gU2VsZWN0ZWQgalF1ZXJ5IGVsZW1lbnRcclxuXHJcbiAgICAgICAgdGhpcy50YWJzID0gW107IC8vIENyZWF0ZSB0YWJzIGFycmF5XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICcnOyAvLyBEZWZpbmUgdGhlIHBsdWdpbiBzdGF0ZSAodGFicy9hY2NvcmRpb24pXHJcbiAgICAgICAgdGhpcy5yb3RhdGVJbnRlcnZhbCA9IDA7IC8vIERlZmluZSByb3RhdGUgaW50ZXJ2YWxcclxuICAgICAgICB0aGlzLiRxdWV1ZSA9ICQoe30pO1xyXG5cclxuICAgICAgICAvLyBFeHRlbmQgdGhlIGRlZmF1bHRzIHdpdGggdGhlIHBhc3NlZCBvcHRpb25zXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gaW5pdGlhbGl6ZXMgdGhlIHRhYiBwbHVnaW5cclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gTG9hZCBhbGwgdGhlIGVsZW1lbnRzXHJcbiAgICAgICAgdGhpcy50YWJzID0gdGhpcy5fbG9hZEVsZW1lbnRzKCk7XHJcbiAgICAgICAgdGhpcy5fbG9hZENsYXNzZXMoKTtcclxuICAgICAgICB0aGlzLl9sb2FkRXZlbnRzKCk7XHJcblxyXG4gICAgICAgIC8vIFdpbmRvdyByZXNpemUgYmluZCB0byBjaGVjayBzdGF0ZVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBfdGhpcy5fc2V0U3RhdGUoZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEhhc2hjaGFuZ2UgZXZlbnRcclxuICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHZhciB0YWJSZWYgPSBfdGhpcy5fZ2V0VGFiUmVmQnlTZWxlY3Rvcih3aW5kb3cubG9jYXRpb24uaGFzaCk7XHJcbiAgICAgICAgICAgIHZhciBvVGFiID0gX3RoaXMuX2dldFRhYih0YWJSZWYpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYSB0YWIgaXMgZm91bmQgdGhhdCBtYXRjaGVzIHRoZSBoYXNoXHJcbiAgICAgICAgICAgIGlmKHRhYlJlZiA+PSAwICYmICFvVGFiLl9pZ25vcmVIYXNoQ2hhbmdlICYmICFvVGFiLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBzbywgb3BlbiB0aGUgdGFiIGFuZCBhdXRvIGNsb3NlIHRoZSBjdXJyZW50IG9uZVxyXG4gICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgX3RoaXMuX2dldFRhYih0YWJSZWYpLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTdGFydCByb3RhdGUgZXZlbnQgaWYgcm90YXRlIG9wdGlvbiBpcyBkZWZpbmVkXHJcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLnJvdGF0ZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydFJvdGF0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vIERlZmluZSBwbHVnaW4gZXZlbnRzXHJcbiAgICAgICAgLy9cclxuXHJcbiAgICAgICAgLy8gQWN0aXZhdGU6IHRoaXMgZXZlbnQgaXMgY2FsbGVkIHdoZW4gYSB0YWIgaXMgc2VsZWN0ZWRcclxuICAgICAgICB0aGlzLiRlbGVtZW50LmJpbmQoJ3RhYnMtYWN0aXZhdGUnLCBmdW5jdGlvbihlLCBvVGFiKSB7XHJcbiAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuYWN0aXZhdGUuY2FsbCh0aGlzLCBlLCBvVGFiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBEZWFjdGl2YXRlOiB0aGlzIGV2ZW50IGlzIGNhbGxlZCB3aGVuIGEgdGFiIGlzIGNsb3NlZFxyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYmluZCgndGFicy1kZWFjdGl2YXRlJywgZnVuY3Rpb24oZSwgb1RhYikge1xyXG4gICAgICAgICAgICBfdGhpcy5vcHRpb25zLmRlYWN0aXZhdGUuY2FsbCh0aGlzLCBlLCBvVGFiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBBY3RpdmF0ZSBTdGF0ZTogdGhpcyBldmVudCBpcyBjYWxsZWQgd2hlbiB0aGUgcGx1Z2luIHN3aXRjaGVzIHN0YXRlc1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYmluZCgndGFicy1hY3RpdmF0ZS1zdGF0ZScsIGZ1bmN0aW9uKGUsIHN0YXRlKSB7XHJcbiAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuYWN0aXZhdGVTdGF0ZS5jYWxsKHRoaXMsIGUsIHN0YXRlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gTG9hZDogdGhpcyBldmVudCBpcyBjYWxsZWQgd2hlbiB0aGUgcGx1Z2luIGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYmluZCgndGFicy1sb2FkJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRUYWI7XHJcblxyXG4gICAgICAgICAgICBfdGhpcy5fc2V0U3RhdGUoZSk7IC8vIFNldCBzdGF0ZVxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBhbmVsIHNob3VsZCBiZSBjb2xsYXBlZCBvbiBsb2FkXHJcbiAgICAgICAgICAgIGlmKF90aGlzLm9wdGlvbnMuc3RhcnRDb2xsYXBzZWQgIT09IHRydWUgJiYgIShfdGhpcy5vcHRpb25zLnN0YXJ0Q29sbGFwc2VkID09PSAnYWNjb3JkaW9uJyAmJiBfdGhpcy5zdGF0ZSA9PT0gJ2FjY29yZGlvbicpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhcnRUYWIgPSBfdGhpcy5fZ2V0U3RhcnRUYWIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBPcGVuIHRoZSBpbml0aWFsIHRhYlxyXG4gICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UYWIoZSwgc3RhcnRUYWIpOyAvLyBPcGVuIGZpcnN0IHRhYlxyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5vcHRpb25zLmxvYWQuY2FsbCh0aGlzLCBlLCBzdGFydFRhYik7IC8vIENhbGwgdGhlIGxvYWQgY2FsbGJhY2tcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIFRyaWdnZXIgbG9hZGVkIGV2ZW50XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCd0YWJzLWxvYWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLy9cclxuICAgIC8vIFBSSVZBVEUgRlVOQ1RJT05TXHJcbiAgICAvL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBsb2FkcyB0aGUgdGFiIGVsZW1lbnRzIGFuZCBzdG9yZXMgdGhlbSBpbiBhbiBhcnJheVxyXG4gICAgICogQHJldHVybnMge0FycmF5fSBBcnJheSBvZiB0YWIgZWxlbWVudHNcclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9sb2FkRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciAkdWwgPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCd1bCcpO1xyXG4gICAgICAgIHZhciB0YWJzID0gW107XHJcbiAgICAgICAgdmFyIGlkID0gMDtcclxuXHJcbiAgICAgICAgLy8gQWRkIHRoZSBjbGFzc2VzIHRvIHRoZSBiYXNpYyBodG1sIGVsZW1lbnRzXHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnci10YWJzJyk7IC8vIFRhYiBjb250YWluZXJcclxuICAgICAgICAkdWwuYWRkQ2xhc3MoJ3ItdGFicy1uYXYnKTsgLy8gTGlzdCBjb250YWluZXJcclxuXHJcbiAgICAgICAgLy8gR2V0IHRhYiBidXR0b25zIGFuZCBzdG9yZSB0aGVpciBkYXRhIGluIGFuIGFycmF5XHJcbiAgICAgICAgJCgnbGknLCAkdWwpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGFiID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGlzRXhjbHVkZWQgPSAkdGFiLmhhc0NsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZUV4Y2x1ZGVkKTtcclxuICAgICAgICAgICAgdmFyICRhbmNob3IsICRwYW5lbCwgJGFjY29yZGlvblRhYiwgJGFjY29yZGlvbkFuY2hvciwgcGFuZWxTZWxlY3RvcjtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSB0YWIgc2hvdWxkIGJlIGV4Y2x1ZGVkXHJcbiAgICAgICAgICAgIGlmKCFpc0V4Y2x1ZGVkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJGFuY2hvciA9ICQoJ2EnLCAkdGFiKTtcclxuICAgICAgICAgICAgICAgIHBhbmVsU2VsZWN0b3IgPSAkYW5jaG9yLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgICAgICAgICRwYW5lbCA9ICQocGFuZWxTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICAkYWNjb3JkaW9uVGFiID0gJCgnPGRpdj48L2Rpdj4nKS5pbnNlcnRCZWZvcmUoJHBhbmVsKTtcclxuICAgICAgICAgICAgICAgICRhY2NvcmRpb25BbmNob3IgPSAkKCc8YT48L2E+JykuYXR0cignaHJlZicsIHBhbmVsU2VsZWN0b3IpLmh0bWwoJGFuY2hvci5odG1sKCkpLmFwcGVuZFRvKCRhY2NvcmRpb25UYWIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBvVGFiID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIF9pZ25vcmVIYXNoQ2hhbmdlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6ICgkLmluQXJyYXkoaWQsIF90aGlzLm9wdGlvbnMuZGlzYWJsZWQpICE9PSAtMSksXHJcbiAgICAgICAgICAgICAgICAgICAgdGFiOiAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogJCgnYScsICR0YWIpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhbmVsOiAkcGFuZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6IHBhbmVsU2VsZWN0b3IsXHJcbiAgICAgICAgICAgICAgICAgICAgYWNjb3JkaW9uVGFiOiAkYWNjb3JkaW9uVGFiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFjY29yZGlvbkFuY2hvcjogJGFjY29yZGlvbkFuY2hvcixcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDF1cCB0aGUgSURcclxuICAgICAgICAgICAgICAgIGlkKys7XHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgdG8gdGFiIGFycmF5XHJcbiAgICAgICAgICAgICAgICB0YWJzLnB1c2gob1RhYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGFicztcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGNsYXNzZXMgdG8gdGhlIHRhYiBlbGVtZW50cyBiYXNlZCBvbiB0aGUgb3B0aW9uc1xyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2xvYWRDbGFzc2VzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0udGFiLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMudGFiKTtcclxuICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFuY2hvci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5hbmNob3IpO1xyXG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0ucGFuZWwuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5wYW5lbCk7XHJcbiAgICAgICAgICAgIHRoaXMudGFic1tpXS5hY2NvcmRpb25UYWIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuYWNjb3JkaW9uVGl0bGUpO1xyXG4gICAgICAgICAgICB0aGlzLnRhYnNbaV0uYWNjb3JkaW9uQW5jaG9yLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmFuY2hvcik7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGFic1tpXS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJzW2ldLnRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBhZGRzIGV2ZW50cyB0byB0aGUgdGFiIGVsZW1lbnRzXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fbG9hZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIERlZmluZSBhY3RpdmF0ZSBldmVudCBvbiBhIHRhYiBlbGVtZW50XHJcbiAgICAgICAgdmFyIGZBY3RpdmF0ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBfdGhpcy5fZ2V0Q3VycmVudFRhYigpOyAvLyBGZXRjaCBjdXJyZW50IHRhYlxyXG4gICAgICAgICAgICB2YXIgYWN0aXZhdGVkVGFiID0gZS5kYXRhLnRhYjtcclxuXHJcbiAgICAgICAgICAgIC8vIERYUC02ODYsIHJldmVydGluZ1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhpcyB0YWIgaXNuJ3QgZGlzYWJsZWRcclxuICAgICAgICAgICAgaWYoIWFjdGl2YXRlZFRhYi5kaXNhYmxlZCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGhhc2ggaGFzIHRvIGJlIHNldCBpbiB0aGUgVVJMIGxvY2F0aW9uXHJcbiAgICAgICAgICAgICAgICBpZihfdGhpcy5vcHRpb25zLnNldEhhc2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGhhc2ggdXNpbmcgdGhlIGhpc3RvcnkgYXBpIGlmIGF2YWlsYWJsZSB0byB0YWNrbGUgQ2hyb21lcyByZXBhaW50IGJ1ZyBvbiBoYXNoIGNoYW5nZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGhpc3RvcnkucHVzaFN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIGFjdGl2YXRlZFRhYi5zZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIGZhbGxiYWNrIHRvIHRoZSBoYXNoIHVwZGF0ZSBmb3Igc2l0ZXMgdGhhdCBkb24ndCBzdXBwb3J0IHRoZSBoaXN0b3J5IGFwaVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGFjdGl2YXRlZFRhYi5zZWxlY3RvcjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZS5kYXRhLnRhYi5faWdub3JlSGFzaENoYW5nZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGFjdGl2YXRlZCB0YWIgaXNudCB0aGUgY3VycmVudCBvbmUgb3IgaWYgaXRzIGNvbGxhcHNpYmxlLiBJZiBub3QsIGRvIG5vdGhpbmdcclxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnQgIT09IGFjdGl2YXRlZFRhYiB8fCBfdGhpcy5faXNDb2xsYXBpc2JsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGFjdGl2YXRlZCB0YWIgaXMgZWl0aGVyIGFub3RoZXIgdGFiIG9mIHRoZSBjdXJyZW50IG9uZS4gSWYgaXQncyB0aGUgY3VycmVudCB0YWIgaXQgaXMgY29sbGFwc2libGVcclxuICAgICAgICAgICAgICAgICAgICAvLyBFaXRoZXIgd2F5LCB0aGUgY3VycmVudCB0YWIgY2FuIGJlIGNsb3NlZFxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jbG9zZVRhYihlLCBjdXJyZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGFjdGl2YXRlZCB0YWIgaXNudCB0aGUgY3VycmVudCBvbmUgb3IgaWYgaXQgaXNudCBjb2xsYXBzaWJsZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGN1cnJlbnQgIT09IGFjdGl2YXRlZFRhYiB8fCAhX3RoaXMuX2lzQ29sbGFwaXNibGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb3BlblRhYihlLCBhY3RpdmF0ZWRUYWIsIGZhbHNlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBMb29wIHRhYnNcclxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy50YWJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vIEFkZCBhY3RpdmF0ZSBmdW5jdGlvbiB0byB0aGUgdGFiIGFuZCBhY2NvcmRpb24gc2VsZWN0aW9uIGVsZW1lbnRcclxuICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFuY2hvci5vbihfdGhpcy5vcHRpb25zLmV2ZW50LCB7dGFiOiBfdGhpcy50YWJzW2ldfSwgZkFjdGl2YXRlKTtcclxuICAgICAgICAgICAgdGhpcy50YWJzW2ldLmFjY29yZGlvbkFuY2hvci5vbihfdGhpcy5vcHRpb25zLmV2ZW50LCB7dGFiOiBfdGhpcy50YWJzW2ldfSwgZkFjdGl2YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBnZXRzIHRoZSB0YWIgdGhhdCBzaG91bGQgYmUgb3BlbmVkIGF0IHN0YXJ0XHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUYWIgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0U3RhcnRUYWIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdGFiUmVmID0gdGhpcy5fZ2V0VGFiUmVmQnlTZWxlY3Rvcih3aW5kb3cubG9jYXRpb24uaGFzaCk7XHJcbiAgICAgICAgdmFyIHN0YXJ0VGFiO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGFnZSBoYXMgYSBoYXNoIHNldCB0aGF0IGlzIGxpbmtlZCB0byBhIHRhYlxyXG4gICAgICAgIGlmKHRhYlJlZiA+PSAwICYmICF0aGlzLl9nZXRUYWIodGFiUmVmKS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAvLyBJZiBzbywgc2V0IHRoZSBjdXJyZW50IHRhYiB0byB0aGUgbGlua2VkIHRhYlxyXG4gICAgICAgICAgICBzdGFydFRhYiA9IHRoaXMuX2dldFRhYih0YWJSZWYpO1xyXG4gICAgICAgIH0gZWxzZSBpZih0aGlzLm9wdGlvbnMuYWN0aXZlID4gMCAmJiAhdGhpcy5fZ2V0VGFiKHRoaXMub3B0aW9ucy5hY3RpdmUpLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0VGFiID0gdGhpcy5fZ2V0VGFiKHRoaXMub3B0aW9ucy5hY3RpdmUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIElmIG5vdCwganVzdCBnZXQgdGhlIGZpcnN0IG9uZVxyXG4gICAgICAgICAgICBzdGFydFRhYiA9IHRoaXMuX2dldFRhYigwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGFydFRhYjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHNldHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHBsdWdpblxyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSAtIFRoZSBldmVudCB0aGF0IHRyaWdnZXJzIHRoZSBzdGF0ZSBjaGFuZ2VcclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9zZXRTdGF0ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgJHVsID0gJCgndWwnLCB0aGlzLiRlbGVtZW50KTtcclxuICAgICAgICB2YXIgb2xkU3RhdGUgPSB0aGlzLnN0YXRlO1xyXG4gICAgICAgIHZhciBzdGFydENvbGxhcHNlZElzU3RhdGUgPSAodHlwZW9mIHRoaXMub3B0aW9ucy5zdGFydENvbGxhcHNlZCA9PT0gJ3N0cmluZycpO1xyXG4gICAgICAgIHZhciBzdGFydFRhYjtcclxuXHJcbiAgICAgICAgLy8gVGhlIHN0YXRlIGlzIGJhc2VkIG9uIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSB0YWJzIGxpc3RcclxuICAgICAgICBpZigkdWwuaXMoJzp2aXNpYmxlJykpe1xyXG4gICAgICAgICAgICAvLyBUYWIgbGlzdCBpcyB2aXNpYmxlLCBzbyB0aGUgc3RhdGUgaXMgJ3RhYnMnXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAndGFicyc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVGFiIGxpc3QgaXMgaW52aXNpYmxlLCBzbyB0aGUgc3RhdGUgaXMgJ2FjY29yZGlvbidcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdhY2NvcmRpb24nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIG5ldyBzdGF0ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgb2xkIHN0YXRlXHJcbiAgICAgICAgaWYodGhpcy5zdGF0ZSAhPT0gb2xkU3RhdGUpIHtcclxuICAgICAgICAgICAgLy8gSWYgc28sIHRoZSBzdGF0ZSBhY3RpdmF0ZSB0cmlnZ2VyIG11c3QgYmUgY2FsbGVkXHJcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndGFicy1hY3RpdmF0ZS1zdGF0ZScsIHtvbGRTdGF0ZTogb2xkU3RhdGUsIG5ld1N0YXRlOiB0aGlzLnN0YXRlfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgc3RhdGUgc3dpdGNoIHNob3VsZCBvcGVuIGEgdGFiXHJcbiAgICAgICAgICAgIGlmKG9sZFN0YXRlICYmIHN0YXJ0Q29sbGFwc2VkSXNTdGF0ZSAmJiB0aGlzLm9wdGlvbnMuc3RhcnRDb2xsYXBzZWQgIT09IHRoaXMuc3RhdGUgJiYgdGhpcy5fZ2V0Q3VycmVudFRhYigpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIEdldCBpbml0aWFsIHRhYlxyXG4gICAgICAgICAgICAgICAgc3RhcnRUYWIgPSB0aGlzLl9nZXRTdGFydFRhYihlKTtcclxuICAgICAgICAgICAgICAgIC8vIE9wZW4gdGhlIGluaXRpYWwgdGFiXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vcGVuVGFiKGUsIHN0YXJ0VGFiKTsgLy8gT3BlbiBmaXJzdCB0YWJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIG9wZW5zIGEgdGFiXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gVGhlIGV2ZW50IHRoYXQgdHJpZ2dlcnMgdGhlIHRhYiBvcGVuaW5nXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1RhYiAtIFRoZSB0YWIgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIG9wZW5lZFxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBjbG9zZUN1cnJlbnQgLSBEZWZpbmVzIGlmIHRoZSBjdXJyZW50IHRhYiBzaG91bGQgYmUgY2xvc2VkXHJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHN0b3BSb3RhdGlvbiAtIERlZmluZXMgaWYgdGhlIHRhYiByb3RhdGlvbiBsb29wIHNob3VsZCBiZSBzdG9wcGVkXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fb3BlblRhYiA9IGZ1bmN0aW9uKGUsIG9UYWIsIGNsb3NlQ3VycmVudCwgc3RvcFJvdGF0aW9uKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgdGFiIGhhcyB0byBiZSBjbG9zZWRcclxuICAgICAgICBpZihjbG9zZUN1cnJlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2xvc2VUYWIoZSwgdGhpcy5fZ2V0Q3VycmVudFRhYigpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSByb3RhdGlvbiBoYXMgdG8gYmUgc3RvcHBlZCB3aGVuIGFjdGl2YXRlZFxyXG4gICAgICAgIGlmKHN0b3BSb3RhdGlvbiAmJiB0aGlzLnJvdGF0ZUludGVydmFsID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BSb3RhdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IHRoaXMgdGFiIHRvIGFjdGl2ZVxyXG4gICAgICAgIG9UYWIuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAvLyBTZXQgYWN0aXZlIGNsYXNzZXMgdG8gdGhlIHRhYiBidXR0b24gYW5kIGFjY29yZGlvbiB0YWIgYnV0dG9uXHJcbiAgICAgICAgb1RhYi50YWIucmVtb3ZlQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlQWN0aXZlKTtcclxuICAgICAgICBvVGFiLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpO1xyXG5cclxuICAgICAgICAvLyBSdW4gcGFuZWwgdHJhbnNpdG9uXHJcbiAgICAgICAgX3RoaXMuX2RvVHJhbnNpdGlvbihvVGFiLnBhbmVsLCBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbiwgJ29wZW4nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gV2hlbiBmaW5pc2hlZCwgc2V0IGFjdGl2ZSBjbGFzcyB0byB0aGUgcGFuZWxcclxuICAgICAgICAgICAgb1RhYi5wYW5lbC5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEZWZhdWx0KS5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpO1xyXG5cclxuICAgICAgICAgICAvLyBBbmQgaWYgZW5hYmxlZCBhbmQgc3RhdGUgaXMgYWNjb3JkaW9uLCBzY3JvbGwgdG8gdGhlIGFjY29yZGlvbiB0YWJcclxuICAgICAgICAgICAgaWYoX3RoaXMuZ2V0U3RhdGUoKSA9PT0gJ2FjY29yZGlvbicgJiYgX3RoaXMub3B0aW9ucy5zY3JvbGxUb0FjY29yZGlvbiAmJiAoIV90aGlzLl9pc0luVmlldyhvVGFiLmFjY29yZGlvblRhYikgfHwgX3RoaXMub3B0aW9ucy5hbmltYXRpb24gIT09ICdkZWZhdWx0JykpIHtcclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBhbmltYXRpb24gb3B0aW9uIGlzIGVuYWJsZWQsIGFuZCBpZiB0aGUgZHVyYXRpb24gaXNuJ3QgMFxyXG4gICAgICAgICAgICAgICAgaWYoX3RoaXMub3B0aW9ucy5hbmltYXRpb24gIT09ICdkZWZhdWx0JyAmJiBfdGhpcy5vcHRpb25zLmR1cmF0aW9uID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHNvLCBzZXQgc2Nyb2xsVG9wIHdpdGggYW5pbWF0ZSBhbmQgdXNlIHRoZSAnYW5pbWF0aW9uJyBkdXJhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBvVGFiLmFjY29yZGlvblRhYi5vZmZzZXQoKS50b3BcclxuICAgICAgICAgICAgICAgICAgICB9LCBfdGhpcy5vcHRpb25zLmR1cmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gIElmIG5vdCwganVzdCBzZXQgc2Nyb2xsVG9wXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLnNjcm9sbFRvcChvVGFiLmFjY29yZGlvblRhYi5vZmZzZXQoKS50b3ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndGFicy1hY3RpdmF0ZScsIG9UYWIpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gY2xvc2VzIGEgdGFiXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gVGhlIGV2ZW50IHRoYXQgaXMgdHJpZ2dlcmVkIHdoZW4gYSB0YWIgaXMgY2xvc2VkXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1RhYiAtIFRoZSB0YWIgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIGNsb3NlZFxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2Nsb3NlVGFiID0gZnVuY3Rpb24oZSwgb1RhYikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGRvUXVldWVPblN0YXRlID0gdHlwZW9mIF90aGlzLm9wdGlvbnMuYW5pbWF0aW9uUXVldWUgPT09ICdzdHJpbmcnO1xyXG4gICAgICAgIHZhciBkb1F1ZXVlO1xyXG5cclxuICAgICAgICBpZihvVGFiICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYoZG9RdWV1ZU9uU3RhdGUgJiYgX3RoaXMuZ2V0U3RhdGUoKSA9PT0gX3RoaXMub3B0aW9ucy5hbmltYXRpb25RdWV1ZSkge1xyXG4gICAgICAgICAgICAgICAgZG9RdWV1ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihkb1F1ZXVlT25TdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgZG9RdWV1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9RdWV1ZSA9IF90aGlzLm9wdGlvbnMuYW5pbWF0aW9uUXVldWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIERlYWN0aXZhdGUgdGFiXHJcbiAgICAgICAgICAgIG9UYWIuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIFNldCBkZWZhdWx0IGNsYXNzIHRvIHRoZSB0YWIgYnV0dG9uXHJcbiAgICAgICAgICAgIG9UYWIudGFiLnJlbW92ZUNsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZUFjdGl2ZSkuYWRkQ2xhc3MoX3RoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCk7XHJcblxyXG4gICAgICAgICAgICAvLyBSdW4gcGFuZWwgdHJhbnNpdGlvblxyXG4gICAgICAgICAgICBfdGhpcy5fZG9UcmFuc2l0aW9uKG9UYWIucGFuZWwsIF90aGlzLm9wdGlvbnMuYW5pbWF0aW9uLCAnY2xvc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNldCBkZWZhdWx0IGNsYXNzIHRvIHRoZSBhY2NvcmRpb24gdGFiIGJ1dHRvbiBhbmQgdGFiIHBhbmVsXHJcbiAgICAgICAgICAgICAgICBvVGFiLmFjY29yZGlvblRhYi5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpO1xyXG4gICAgICAgICAgICAgICAgb1RhYi5wYW5lbC5yZW1vdmVDbGFzcyhfdGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVBY3RpdmUpLmFkZENsYXNzKF90aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpO1xyXG4gICAgICAgICAgICB9LCAhZG9RdWV1ZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3RhYnMtZGVhY3RpdmF0ZScsIG9UYWIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJ1bnMgYW4gZWZmZWN0IG9uIGEgcGFuZWxcclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gcGFuZWwgLSBUaGUgSFRNTCBlbGVtZW50IG9mIHRoZSB0YWIgcGFuZWxcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2QgLSBUaGUgdHJhbnNpdGlvbiBtZXRob2QgcmVmZXJlbmNlXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RhdGUgLSBUaGUgc3RhdGUgKG9wZW4vY2xvc2VkKSB0aGF0IHRoZSBwYW5lbCBzaG91bGQgdHJhbnNpdGlvbiB0b1xyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgYWZ0ZXIgdGhlIHRyYW5zaXRpb25cclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVxdWV1ZSAtIERlZmluZXMgaWYgdGhlIGV2ZW50IHF1ZXVlIHNob3VsZCBiZSBkZXF1ZXVlZCBhZnRlciB0aGUgdHJhbnNpdGlvblxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2RvVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHBhbmVsLCBtZXRob2QsIHN0YXRlLCBjYWxsYmFjaywgZGVxdWV1ZSkge1xyXG4gICAgICAgIHZhciBlZmZlY3Q7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gR2V0IGVmZmVjdCBiYXNlZCBvbiBtZXRob2RcclxuICAgICAgICBzd2l0Y2gobWV0aG9kKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3NsaWRlJzpcclxuICAgICAgICAgICAgICAgIGVmZmVjdCA9IChzdGF0ZSA9PT0gJ29wZW4nKSA/ICdzbGlkZURvd24nIDogJ3NsaWRlVXAnO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2ZhZGUnOlxyXG4gICAgICAgICAgICAgICAgZWZmZWN0ID0gKHN0YXRlID09PSAnb3BlbicpID8gJ2ZhZGVJbicgOiAnZmFkZU91dCc7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGVmZmVjdCA9IChzdGF0ZSA9PT0gJ29wZW4nKSA/ICdzaG93JyA6ICdoaWRlJztcclxuICAgICAgICAgICAgICAgIC8vIFdoZW4gZGVmYXVsdCBpcyB1c2VkLCBzZXQgdGhlIGR1cmF0aW9uIHRvIDBcclxuICAgICAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuZHVyYXRpb24gPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBZGQgdGhlIHRyYW5zaXRpb24gdG8gYSBjdXN0b20gcXVldWVcclxuICAgICAgICB0aGlzLiRxdWV1ZS5xdWV1ZSgncmVzcG9uc2l2ZS10YWJzJyxmdW5jdGlvbihuZXh0KXtcclxuICAgICAgICAgICAgLy8gUnVuIHRoZSB0cmFuc2l0aW9uIG9uIHRoZSBwYW5lbFxyXG4gICAgICAgICAgICBwYW5lbFtlZmZlY3RdKHtcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBfdGhpcy5vcHRpb25zLmR1cmF0aW9uLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChwYW5lbCwgbWV0aG9kLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUnVuIHRoZSBuZXh0IGZ1bmN0aW9uIGluIHRoZSBxdWV1ZVxyXG4gICAgICAgICAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFdoZW4gdGhlIHBhbmVsIGlzIG9wZW5lbmQsIGRlcXVldWUgZXZlcnl0aGluZyBzbyB0aGUgYW5pbWF0aW9uIHN0YXJ0c1xyXG4gICAgICAgIGlmKHN0YXRlID09PSAnb3BlbicgfHwgZGVxdWV1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLiRxdWV1ZS5kZXF1ZXVlKCdyZXNwb25zaXZlLXRhYnMnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgY29sbGFwc2liaWxpdHkgb2YgdGhlIHRhYiBpbiB0aGlzIHN0YXRlXHJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gVGhlIGNvbGxhcHNpYmlsaXR5IG9mIHRoZSB0YWJcclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9pc0NvbGxhcGlzYmxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgdGhpcy5vcHRpb25zLmNvbGxhcHNpYmxlID09PSAnYm9vbGVhbicgJiYgdGhpcy5vcHRpb25zLmNvbGxhcHNpYmxlKSB8fCAodHlwZW9mIHRoaXMub3B0aW9ucy5jb2xsYXBzaWJsZSA9PT0gJ3N0cmluZycgJiYgdGhpcy5vcHRpb25zLmNvbGxhcHNpYmxlID09PSB0aGlzLmdldFN0YXRlKCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhIHRhYiBieSBudW1lcmljIHJlZmVyZW5jZVxyXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBudW1SZWYgLSBOdW1lcmljIHRhYiByZWZlcmVuY2VcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRhYiBvYmplY3RcclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLl9nZXRUYWIgPSBmdW5jdGlvbihudW1SZWYpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50YWJzW251bVJlZl07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBudW1lcmljIHRhYiByZWZlcmVuY2UgYmFzZWQgb24gYSBoYXNoIHNlbGVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBIYXNoIHNlbGVjdG9yXHJcbiAgICAgKiBAcmV0dXJucyB7SW50ZWdlcn0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0VGFiUmVmQnlTZWxlY3RvciA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgLy8gTG9vcCBhbGwgdGFic1xyXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGhhc2ggc2VsZWN0b3IgaXMgZXF1YWwgdG8gdGhlIHRhYiBzZWxlY3RvclxyXG4gICAgICAgICAgICBpZih0aGlzLnRhYnNbaV0uc2VsZWN0b3IgPT09IHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiBub25lIGlzIGZvdW5kIHJldHVybiBhIG5lZ2F0aXZlIGluZGV4XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgY3VycmVudCB0YWIgZWxlbWVudFxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gQ3VycmVudCB0YWIgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldEN1cnJlbnRUYWIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VGFiKHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBuZXh0IHRhYidzIG51bWVyaWMgcmVmZXJlbmNlXHJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IGN1cnJlbnRUYWJSZWYgLSBDdXJyZW50IG51bWVyaWMgdGFiIHJlZmVyZW5jZVxyXG4gICAgICogQHJldHVybnMge0ludGVnZXJ9IE51bWVyaWMgdGFiIHJlZmVyZW5jZVxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuX2dldE5leHRUYWJSZWYgPSBmdW5jdGlvbihjdXJyZW50VGFiUmVmKSB7XHJcbiAgICAgICAgdmFyIHRhYlJlZiA9IChjdXJyZW50VGFiUmVmIHx8IHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSk7XHJcbiAgICAgICAgdmFyIG5leHRUYWJSZWYgPSAodGFiUmVmID09PSB0aGlzLnRhYnMubGVuZ3RoIC0gMSkgPyAwIDogdGFiUmVmICsgMTtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX2dldFRhYihuZXh0VGFiUmVmKS5kaXNhYmxlZCkgPyB0aGlzLl9nZXROZXh0VGFiUmVmKG5leHRUYWJSZWYpIDogbmV4dFRhYlJlZjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHByZXZpb3VzIHRhYidzIG51bWVyaWMgcmVmZXJlbmNlXHJcbiAgICAgKiBAcmV0dXJucyB7SW50ZWdlcn0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0UHJldmlvdXNUYWJSZWYgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSA9PT0gMCkgPyB0aGlzLnRhYnMubGVuZ3RoIC0gMSA6IHRoaXMuX2dldEN1cnJlbnRUYWJSZWYoKSAtIDE7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBjdXJyZW50IHRhYidzIG51bWVyaWMgcmVmZXJlbmNlXHJcbiAgICAgKiBAcmV0dXJucyB7SW50ZWdlcn0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5fZ2V0Q3VycmVudFRhYlJlZiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIExvb3AgYWxsIHRhYnNcclxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy50YWJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoaXMgdGFiIGlzIGFjdGl2ZSwgcmV0dXJuIGl0XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGFic1tpXS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIE5vIHRhYnMgaGF2ZSBiZWVuIGZvdW5kLCByZXR1cm4gbmVnYXRpdmUgaW5kZXhcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vXHJcbiAgICAvLyBIRUxQRVIgRlVOQ1RJT05TXHJcbiAgICAvL1xyXG5cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5faXNJblZpZXcgPSBmdW5jdGlvbigkZWxlbWVudCkge1xyXG4gICAgICAgIHZhciBkb2NWaWV3VG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpLFxyXG4gICAgICAgICAgICBkb2NWaWV3Qm90dG9tID0gZG9jVmlld1RvcCArICQod2luZG93KS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgZWxlbVRvcCA9ICRlbGVtZW50Lm9mZnNldCgpLnRvcCxcclxuICAgICAgICAgICAgZWxlbUJvdHRvbSA9IGVsZW1Ub3AgKyAkZWxlbWVudC5oZWlnaHQoKTtcclxuICAgICAgICByZXR1cm4gKChlbGVtQm90dG9tIDw9IGRvY1ZpZXdCb3R0b20pICYmIChlbGVtVG9wID49IGRvY1ZpZXdUb3ApKTtcclxuICAgIH07XHJcblxyXG4gICAgLy9cclxuICAgIC8vIFBVQkxJQyBGVU5DVElPTlNcclxuICAgIC8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGFjdGl2YXRlcyBhIHRhYlxyXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSB0YWJSZWYgLSBOdW1lcmljIHRhYiByZWZlcmVuY2VcclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gc3RvcFJvdGF0aW9uIC0gRGVmaW5lcyBpZiB0aGUgdGFiIHJvdGF0aW9uIHNob3VsZCBzdG9wIGFmdGVyIGFjdGl2YXRpb25cclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24odGFiUmVmLCBzdG9wUm90YXRpb24pIHtcclxuICAgICAgICB2YXIgZSA9IGpRdWVyeS5FdmVudCgndGFicy1hY3RpdmF0ZScpO1xyXG4gICAgICAgIHZhciBvVGFiID0gdGhpcy5fZ2V0VGFiKHRhYlJlZik7XHJcbiAgICAgICAgaWYoIW9UYWIuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fb3BlblRhYihlLCBvVGFiLCB0cnVlLCBzdG9wUm90YXRpb24gfHwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gZGVhY3RpdmF0ZXMgYSB0YWJcclxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gdGFiUmVmIC0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24odGFiUmVmKSB7XHJcbiAgICAgICAgdmFyIGUgPSBqUXVlcnkuRXZlbnQoJ3RhYnMtZGVjdGl2YXRlJyk7XHJcbiAgICAgICAgdmFyIG9UYWIgPSB0aGlzLl9nZXRUYWIodGFiUmVmKTtcclxuICAgICAgICBpZighb1RhYi5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jbG9zZVRhYihlLCBvVGFiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBlbmFibGVzIGEgdGFiXHJcbiAgICAgKiBAcGFyYW0ge0ludGVnZXJ9IHRhYlJlZiAtIE51bWVyaWMgdGFiIHJlZmVyZW5jZVxyXG4gICAgICovXHJcbiAgICBSZXNwb25zaXZlVGFicy5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24odGFiUmVmKSB7XHJcbiAgICAgICAgdmFyIG9UYWIgPSB0aGlzLl9nZXRUYWIodGFiUmVmKTtcclxuICAgICAgICBpZihvVGFiKXtcclxuICAgICAgICAgICAgb1RhYi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvVGFiLnRhYi5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xyXG4gICAgICAgICAgICBvVGFiLmFjY29yZGlvblRhYi5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5zdGF0ZURlZmF1bHQpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGlzYWJsZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGRpc2FibGUgYSB0YWJcclxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gdGFiUmVmIC0gTnVtZXJpYyB0YWIgcmVmZXJlbmNlXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24odGFiUmVmKSB7XHJcbiAgICAgICAgdmFyIG9UYWIgPSB0aGlzLl9nZXRUYWIodGFiUmVmKTtcclxuICAgICAgICBpZihvVGFiKXtcclxuICAgICAgICAgICAgb1RhYi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIG9UYWIudGFiLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEaXNhYmxlZCk7XHJcbiAgICAgICAgICAgIG9UYWIuYWNjb3JkaW9uVGFiLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnN0YXRlRGVmYXVsdCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuc3RhdGVEaXNhYmxlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gZ2V0cyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgcGx1Z2luXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBTdGF0ZSBvZiB0aGUgcGx1Z2luXHJcbiAgICAgKi9cclxuICAgIFJlc3BvbnNpdmVUYWJzLnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gc3RhcnRzIHRoZSByb3RhdGlvbiBvZiB0aGUgdGFic1xyXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBzcGVlZCAtIFRoZSBzcGVlZCBvZiB0aGUgcm90YXRpb25cclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLnN0YXJ0Um90YXRpb24gPSBmdW5jdGlvbihzcGVlZCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIG5vdCBhbGwgdGFicyBhcmUgZGlzYWJsZWRcclxuICAgICAgICBpZih0aGlzLnRhYnMubGVuZ3RoID4gdGhpcy5vcHRpb25zLmRpc2FibGVkLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciBlID0galF1ZXJ5LkV2ZW50KCdyb3RhdGUnKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9vcGVuVGFiKGUsIF90aGlzLl9nZXRUYWIoX3RoaXMuX2dldE5leHRUYWJSZWYoKSksIHRydWUpO1xyXG4gICAgICAgICAgICB9LCBzcGVlZCB8fCAoKCQuaXNOdW1lcmljKF90aGlzLm9wdGlvbnMucm90YXRlKSkgPyBfdGhpcy5vcHRpb25zLnJvdGF0ZSA6IDQwMDApICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUm90YXRpb24gaXMgbm90IHBvc3NpYmxlIGlmIGFsbCB0YWJzIGFyZSBkaXNhYmxlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBzdG9wcyB0aGUgcm90YXRpb24gb2YgdGhlIHRhYnNcclxuICAgICAqL1xyXG4gICAgUmVzcG9uc2l2ZVRhYnMucHJvdG90eXBlLnN0b3BSb3RhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMucm90YXRlSW50ZXJ2YWwpO1xyXG4gICAgICAgIHRoaXMucm90YXRlSW50ZXJ2YWwgPSAwO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogalF1ZXJ5IHdyYXBwZXIgKi9cclxuICAgICQuZm4ucmVzcG9uc2l2ZVRhYnMgPSBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISQuZGF0YSh0aGlzLCAncmVzcG9uc2l2ZXRhYnMnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAncmVzcG9uc2l2ZXRhYnMnLCBuZXcgUmVzcG9uc2l2ZVRhYnMoIHRoaXMsIG9wdGlvbnMgKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnICYmIG9wdGlvbnNbMF0gIT09ICdfJyAmJiBvcHRpb25zICE9PSAnaW5pdCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSAkLmRhdGEodGhpcywgJ3Jlc3BvbnNpdmV0YWJzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUmVzcG9uc2l2ZVRhYnMgJiYgdHlwZW9mIGluc3RhbmNlW29wdGlvbnNdID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2Vbb3B0aW9uc10uYXBwbHkoIGluc3RhbmNlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJncywgMSApICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQWxsb3cgaW5zdGFuY2VzIHRvIGJlIGRlc3Ryb3llZCB2aWEgdGhlICdkZXN0cm95JyBtZXRob2RcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zID09PSAnZGVzdHJveScpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBkZXN0cm95IGluc3RhbmNlIGNsYXNzZXMsIGV0Y1xyXG4gICAgICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAncmVzcG9uc2l2ZXRhYnMnLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0oalF1ZXJ5LCB3aW5kb3cpKTtcclxuIl19
