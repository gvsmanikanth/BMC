(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * T- Countdown v1.5.5
 * http://plugins.twinpictures.de/plugins/t-minus-countdown/
 *
 * Copyright 2015, Twinpictures
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, blend, trade,
 * bake, hack, scramble, difiburlate, digest and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function($){
  $.fn.countDown = function (options) {
    config = {};
    $.extend(config, options);
    targetTime = this.setTargetTime(config);
    //set diffSecs and launch the countdown once the ajax for now loads
    diffSecs = this.setDiffSecs(targetTime, options.targetDate.localtime);
    before = new Date();
    $.data($(this)[0], 'before', before);
    $.data($(this)[0], 'status', 'play');
    $.data($(this)[0], 'id', config.id);
    style = config.style;
    $.data($(this)[0], 'style', config.style);

    if ( config.event_id ) {
      $.data($(this)[0], 'event_id', config.event_id);
      $.ajax({
        url: tCountAjax.ajaxurl,
        type : "post",
        dataType : "json",
        data: {
          action : 'tminusevents',
          event_id : config.event_id,
          countdownNonce : tCountAjax.countdownNonce
        },
        success: $.proxy(function( jsonobj ) {
          $.data($(this)[0], 'eventObj', jsonobj);
        }, this)
      });
    }

    if( config.launchtarget ) {
      $.data($(this)[0], 'launchtarget', config.launchtarget);
    }
    if (config.onComplete){
      $.data($(this)[0], 'callback', config.onComplete);
    }
    if (config.hangtime){
      $.data($(this)[0], 'hangtime', config.hangtime);
    }
    if (config.omitWeeks){
      $.data($(this)[0], 'omitWeeks', config.omitWeeks);
    }
    $('#' + $(this).attr('id') + ' .' + style + '-digit').html('<div class="top"></div><div class="bottom"></div>');
    return this;
  };

  $.fn.stopCountDown = function () {
    $.data(this[0], 'status', 'stop');
  };

  $.fn.startCountDown = function () {
    $.data(this[0], 'status', 'play');
    this.doCountDown($(this).attr('id'),$.data(this[0], 'diffSecs'), 500);
  };

  $.fn.setDiffSecs = function (targetTime, backuptime) {
    var diffSecs = null;
    $.ajax({
      url: 'http://www.bmc.com/templates/ServiceGetDateTimeNow',
      type : "post",
      dataType : "json",
      success: $.proxy(function( data ) {
        //console.log(data['now']);
        nowTime = new Date(data['now']);
        diffSecs = Math.floor((targetTime.valueOf()-nowTime.valueOf())/1000);
        $(this).doCountDown($(this).attr('id'), diffSecs, 500);
      }, this),
      error: $.proxy(function( request, status, error ) {
        nowTime = new Date(backuptime);
        diffSecs = Math.floor((targetTime.valueOf()-nowTime.valueOf())/1000);
        $(this).doCountDown($(this).attr('id'), diffSecs, 500);
      }, this)
    });
  };

  $.fn.setTargetTime = function (options) {
    var targetTime = new Date();
    if (options.targetDate){
      targetTime = new Date(options.targetDate.month + '/' + options.targetDate.day + '/' + options.targetDate.year + ' ' + options.targetDate.hour + ':' + options.targetDate.min + ':' + options.targetDate.sec + (options.targetDate.utc ? ' UTC' : ''));
    }
    else if (options.targetOffset){
      targetTime.setFullYear(options.targetOffset.year + targetTime.getFullYear());
      targetTime.setMonth(options.targetOffset.month + targetTime.getMonth());
      targetTime.setDate(options.targetOffset.day + targetTime.getDate());
      targetTime.setHours(options.targetOffset.hour + targetTime.getHours());
      targetTime.setMinutes(options.targetOffset.min + targetTime.getMinutes());
      targetTime.setSeconds(options.targetOffset.sec + targetTime.getSeconds());
    }

    return targetTime;
  };

  $.fn.doCountDown = function (id, diffSecs, duration) {
    $this = $('#' + id);

    if (diffSecs <= 0){
      if( $.data($this[0], 'launchtarget') != 'countup' ){
        diffSecs = 0;
        $.data($this[0], 'status', 'stop');
      }
    }
    secs = Math.abs(diffSecs % 60);
    mins = Math.floor(Math.abs(diffSecs/60)%60);
    hours = Math.floor(Math.abs(diffSecs/60/60)%24);
    if ($.data($this[0], 'omitWeeks') == 'true'){
      days = Math.floor(Math.abs(diffSecs/60/60/24));
      weeks = 0;
    }
    else{
      days = Math.floor(Math.abs(diffSecs/60/60/24)%7);
      weeks = Math.floor(Math.abs(diffSecs/60/60/24/7));
    }
    style = $.data($this[0], 'style');
    $this.dashChangeTo(id, style + '-seconds_dash', secs, duration ? duration : 500);
    $this.dashChangeTo(id, style + '-minutes_dash', mins, duration ? duration : 1000);
    $this.dashChangeTo(id, style + '-hours_dash', hours, duration ? duration : 1000);
    $this.dashChangeTo(id, style + '-days_dash', days, duration ? duration : 1000);
    $this.dashChangeTo(id, style + '-days_trip_dash', days, duration ? duration : 1000);
    $this.dashChangeTo(id, style + '-weeks_dash', weeks, duration ? duration : 1000);
    $this.dashChangeTo(id, style + '-weeks_trip_dash', weeks, duration ? duration : 1000);

    $.data($this[0], 'diffSecs', diffSecs);

    //events
    if( $.data($this[0], 'event_id') ){
      $this.checkEvent(id, diffSecs);
    }


    if (diffSecs > 0 || $.data($this[0], 'launchtarget') == 'countup'){
      if($.data($this[0], 'status') == 'play'){
        var delta = 0;
        delay = 1000;
        now = new Date();
        before = $.data($this[0], 'before');
        elapsedTime = (now.getTime() - before.getTime());
        if(elapsedTime >= delay + 1000){
          delta += Math.floor(1*(elapsedTime/delay));
        }
        else{
          delta = 1;
        }
        before = new Date();
        $.data($this[0], 'before', before);
        t = setTimeout( function() {
          $this.doCountDown(id, diffSecs-delta);
          } , 1000);
      }
    }
    //cb = $.data($this[0], 'callback')
    else if ($.data($this[0], 'callback')){
      if($.data($this[0], 'hangtime')){
        //phone's ringing dude.
      }
      $.data($this[0], 'callback')();
    }

  };

  $.fn.dashChangeTo = function(id, dash, n, duration) {
    $this = $('#' + id);
    style = $.data($this[0], 'style');
    for (var i=($this.find('.' + dash + ' .' + style + '-digit').length-1); i>=0; i--){
      var d = n%10;
      n = (n - d) / 10;
      $this.digitChangeTo('#' + $this.attr('id') + ' .' + dash + ' .' + style + '-digit:eq('+i+')', d, duration);
    }
  };

  $.fn.digitChangeTo = function (digit, n, duration) {
    if (!duration){
      duration = 500;
    }
    if ($(digit + ' div.top').html() != n + ''){
      $(digit + ' div.top').css({'display': 'none'});
      $(digit + ' div.top').html((n ? n : '0')).stop(true, true).slideDown(duration);

      $(digit + ' div.bottom').stop(true, true).animate({'height': ''}, duration, function() {
        $(digit + ' div.bottom').html($(digit + ' div.top').html());
        $(digit + ' div.bottom').css({'display': 'block', 'height': ''});
        $(digit + ' div.top').hide().slideUp(10);
      });
    }
  };

  $.fn.checkEvent = function () {
    if ( ! $.data( this[0], 'eventObj' ) ) {
      return;
    }

    var eventObj = $.data( this[0], 'eventObj' ).tevent;
    for (var key in eventObj) {
      if (eventObj[key].hasOwnProperty('tevents_event_time') && eventObj[key]['tevents_event_time'] == $.data( this[0], 'diffSecs' ) ) {
        //content (even if it's blank)
        if (eventObj[key].hasOwnProperty('tevents_target_elem') && eventObj[key]['tevents_event_target'] == 'other') {
          target_elem = eventObj[key]['tevents_target_elem'];
        }
        else{
          target_elem = '#' + $.data( this[0], 'id' ) + '-' + eventObj[key]['tevents_event_target'];
        }
        $(target_elem).html( eventObj[key]['tevents_event_content'] );

        //function
        if ( eventObj[key]['tevents_event_function'] ) {
          var fn = window[ eventObj[key]['tevents_event_function'] ];
          if(typeof fn === 'function') {
              fn();
          }
        }
      }
    }
  }

})(jQuery);

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3QtbWludXMtY291bnRkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxyXG4gKiBULSBDb3VudGRvd24gdjEuNS41XHJcbiAqIGh0dHA6Ly9wbHVnaW5zLnR3aW5waWN0dXJlcy5kZS9wbHVnaW5zL3QtbWludXMtY291bnRkb3duL1xyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNSwgVHdpbnBpY3R1cmVzXHJcbiAqXHJcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYmxlbmQsIHRyYWRlLFxyXG4gKiBiYWtlLCBoYWNrLCBzY3JhbWJsZSwgZGlmaWJ1cmxhdGUsIGRpZ2VzdCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxyXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXHJcbiAqIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuICpcclxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cclxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbiAqXHJcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuICogVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigkKXtcclxuICAkLmZuLmNvdW50RG93biA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBjb25maWcgPSB7fTtcclxuICAgICQuZXh0ZW5kKGNvbmZpZywgb3B0aW9ucyk7XHJcbiAgICB0YXJnZXRUaW1lID0gdGhpcy5zZXRUYXJnZXRUaW1lKGNvbmZpZyk7XHJcbiAgICAvL3NldCBkaWZmU2VjcyBhbmQgbGF1bmNoIHRoZSBjb3VudGRvd24gb25jZSB0aGUgYWpheCBmb3Igbm93IGxvYWRzXHJcbiAgICBkaWZmU2VjcyA9IHRoaXMuc2V0RGlmZlNlY3ModGFyZ2V0VGltZSwgb3B0aW9ucy50YXJnZXREYXRlLmxvY2FsdGltZSk7XHJcbiAgICBiZWZvcmUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgJC5kYXRhKCQodGhpcylbMF0sICdiZWZvcmUnLCBiZWZvcmUpO1xyXG4gICAgJC5kYXRhKCQodGhpcylbMF0sICdzdGF0dXMnLCAncGxheScpO1xyXG4gICAgJC5kYXRhKCQodGhpcylbMF0sICdpZCcsIGNvbmZpZy5pZCk7XHJcbiAgICBzdHlsZSA9IGNvbmZpZy5zdHlsZTtcclxuICAgICQuZGF0YSgkKHRoaXMpWzBdLCAnc3R5bGUnLCBjb25maWcuc3R5bGUpO1xyXG5cclxuICAgIGlmICggY29uZmlnLmV2ZW50X2lkICkge1xyXG4gICAgICAkLmRhdGEoJCh0aGlzKVswXSwgJ2V2ZW50X2lkJywgY29uZmlnLmV2ZW50X2lkKTtcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IHRDb3VudEFqYXguYWpheHVybCxcclxuICAgICAgICB0eXBlIDogXCJwb3N0XCIsXHJcbiAgICAgICAgZGF0YVR5cGUgOiBcImpzb25cIixcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBhY3Rpb24gOiAndG1pbnVzZXZlbnRzJyxcclxuICAgICAgICAgIGV2ZW50X2lkIDogY29uZmlnLmV2ZW50X2lkLFxyXG4gICAgICAgICAgY291bnRkb3duTm9uY2UgOiB0Q291bnRBamF4LmNvdW50ZG93bk5vbmNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWNjZXNzOiAkLnByb3h5KGZ1bmN0aW9uKCBqc29ub2JqICkge1xyXG4gICAgICAgICAgJC5kYXRhKCQodGhpcylbMF0sICdldmVudE9iaicsIGpzb25vYmopO1xyXG4gICAgICAgIH0sIHRoaXMpXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBjb25maWcubGF1bmNodGFyZ2V0ICkge1xyXG4gICAgICAkLmRhdGEoJCh0aGlzKVswXSwgJ2xhdW5jaHRhcmdldCcsIGNvbmZpZy5sYXVuY2h0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbmZpZy5vbkNvbXBsZXRlKXtcclxuICAgICAgJC5kYXRhKCQodGhpcylbMF0sICdjYWxsYmFjaycsIGNvbmZpZy5vbkNvbXBsZXRlKTtcclxuICAgIH1cclxuICAgIGlmIChjb25maWcuaGFuZ3RpbWUpe1xyXG4gICAgICAkLmRhdGEoJCh0aGlzKVswXSwgJ2hhbmd0aW1lJywgY29uZmlnLmhhbmd0aW1lKTtcclxuICAgIH1cclxuICAgIGlmIChjb25maWcub21pdFdlZWtzKXtcclxuICAgICAgJC5kYXRhKCQodGhpcylbMF0sICdvbWl0V2Vla3MnLCBjb25maWcub21pdFdlZWtzKTtcclxuICAgIH1cclxuICAgICQoJyMnICsgJCh0aGlzKS5hdHRyKCdpZCcpICsgJyAuJyArIHN0eWxlICsgJy1kaWdpdCcpLmh0bWwoJzxkaXYgY2xhc3M9XCJ0b3BcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm90dG9tXCI+PC9kaXY+Jyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAkLmZuLnN0b3BDb3VudERvd24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkLmRhdGEodGhpc1swXSwgJ3N0YXR1cycsICdzdG9wJyk7XHJcbiAgfTtcclxuXHJcbiAgJC5mbi5zdGFydENvdW50RG93biA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQuZGF0YSh0aGlzWzBdLCAnc3RhdHVzJywgJ3BsYXknKTtcclxuICAgIHRoaXMuZG9Db3VudERvd24oJCh0aGlzKS5hdHRyKCdpZCcpLCQuZGF0YSh0aGlzWzBdLCAnZGlmZlNlY3MnKSwgNTAwKTtcclxuICB9O1xyXG5cclxuICAkLmZuLnNldERpZmZTZWNzID0gZnVuY3Rpb24gKHRhcmdldFRpbWUsIGJhY2t1cHRpbWUpIHtcclxuICAgIHZhciBkaWZmU2VjcyA9IG51bGw7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6ICdodHRwOi8vd3d3LmJtYy5jb20vdGVtcGxhdGVzL1NlcnZpY2VHZXREYXRlVGltZU5vdycsXHJcbiAgICAgIHR5cGUgOiBcInBvc3RcIixcclxuICAgICAgZGF0YVR5cGUgOiBcImpzb25cIixcclxuICAgICAgc3VjY2VzczogJC5wcm94eShmdW5jdGlvbiggZGF0YSApIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFbJ25vdyddKTtcclxuICAgICAgICBub3dUaW1lID0gbmV3IERhdGUoZGF0YVsnbm93J10pO1xyXG4gICAgICAgIGRpZmZTZWNzID0gTWF0aC5mbG9vcigodGFyZ2V0VGltZS52YWx1ZU9mKCktbm93VGltZS52YWx1ZU9mKCkpLzEwMDApO1xyXG4gICAgICAgICQodGhpcykuZG9Db3VudERvd24oJCh0aGlzKS5hdHRyKCdpZCcpLCBkaWZmU2VjcywgNTAwKTtcclxuICAgICAgfSwgdGhpcyksXHJcbiAgICAgIGVycm9yOiAkLnByb3h5KGZ1bmN0aW9uKCByZXF1ZXN0LCBzdGF0dXMsIGVycm9yICkge1xyXG4gICAgICAgIG5vd1RpbWUgPSBuZXcgRGF0ZShiYWNrdXB0aW1lKTtcclxuICAgICAgICBkaWZmU2VjcyA9IE1hdGguZmxvb3IoKHRhcmdldFRpbWUudmFsdWVPZigpLW5vd1RpbWUudmFsdWVPZigpKS8xMDAwKTtcclxuICAgICAgICAkKHRoaXMpLmRvQ291bnREb3duKCQodGhpcykuYXR0cignaWQnKSwgZGlmZlNlY3MsIDUwMCk7XHJcbiAgICAgIH0sIHRoaXMpXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICAkLmZuLnNldFRhcmdldFRpbWUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdmFyIHRhcmdldFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgaWYgKG9wdGlvbnMudGFyZ2V0RGF0ZSl7XHJcbiAgICAgIHRhcmdldFRpbWUgPSBuZXcgRGF0ZShvcHRpb25zLnRhcmdldERhdGUubW9udGggKyAnLycgKyBvcHRpb25zLnRhcmdldERhdGUuZGF5ICsgJy8nICsgb3B0aW9ucy50YXJnZXREYXRlLnllYXIgKyAnICcgKyBvcHRpb25zLnRhcmdldERhdGUuaG91ciArICc6JyArIG9wdGlvbnMudGFyZ2V0RGF0ZS5taW4gKyAnOicgKyBvcHRpb25zLnRhcmdldERhdGUuc2VjICsgKG9wdGlvbnMudGFyZ2V0RGF0ZS51dGMgPyAnIFVUQycgOiAnJykpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAob3B0aW9ucy50YXJnZXRPZmZzZXQpe1xyXG4gICAgICB0YXJnZXRUaW1lLnNldEZ1bGxZZWFyKG9wdGlvbnMudGFyZ2V0T2Zmc2V0LnllYXIgKyB0YXJnZXRUaW1lLmdldEZ1bGxZZWFyKCkpO1xyXG4gICAgICB0YXJnZXRUaW1lLnNldE1vbnRoKG9wdGlvbnMudGFyZ2V0T2Zmc2V0Lm1vbnRoICsgdGFyZ2V0VGltZS5nZXRNb250aCgpKTtcclxuICAgICAgdGFyZ2V0VGltZS5zZXREYXRlKG9wdGlvbnMudGFyZ2V0T2Zmc2V0LmRheSArIHRhcmdldFRpbWUuZ2V0RGF0ZSgpKTtcclxuICAgICAgdGFyZ2V0VGltZS5zZXRIb3VycyhvcHRpb25zLnRhcmdldE9mZnNldC5ob3VyICsgdGFyZ2V0VGltZS5nZXRIb3VycygpKTtcclxuICAgICAgdGFyZ2V0VGltZS5zZXRNaW51dGVzKG9wdGlvbnMudGFyZ2V0T2Zmc2V0Lm1pbiArIHRhcmdldFRpbWUuZ2V0TWludXRlcygpKTtcclxuICAgICAgdGFyZ2V0VGltZS5zZXRTZWNvbmRzKG9wdGlvbnMudGFyZ2V0T2Zmc2V0LnNlYyArIHRhcmdldFRpbWUuZ2V0U2Vjb25kcygpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGFyZ2V0VGltZTtcclxuICB9O1xyXG5cclxuICAkLmZuLmRvQ291bnREb3duID0gZnVuY3Rpb24gKGlkLCBkaWZmU2VjcywgZHVyYXRpb24pIHtcclxuICAgICR0aGlzID0gJCgnIycgKyBpZCk7XHJcblxyXG4gICAgaWYgKGRpZmZTZWNzIDw9IDApe1xyXG4gICAgICBpZiggJC5kYXRhKCR0aGlzWzBdLCAnbGF1bmNodGFyZ2V0JykgIT0gJ2NvdW50dXAnICl7XHJcbiAgICAgICAgZGlmZlNlY3MgPSAwO1xyXG4gICAgICAgICQuZGF0YSgkdGhpc1swXSwgJ3N0YXR1cycsICdzdG9wJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHNlY3MgPSBNYXRoLmFicyhkaWZmU2VjcyAlIDYwKTtcclxuICAgIG1pbnMgPSBNYXRoLmZsb29yKE1hdGguYWJzKGRpZmZTZWNzLzYwKSU2MCk7XHJcbiAgICBob3VycyA9IE1hdGguZmxvb3IoTWF0aC5hYnMoZGlmZlNlY3MvNjAvNjApJTI0KTtcclxuICAgIGlmICgkLmRhdGEoJHRoaXNbMF0sICdvbWl0V2Vla3MnKSA9PSAndHJ1ZScpe1xyXG4gICAgICBkYXlzID0gTWF0aC5mbG9vcihNYXRoLmFicyhkaWZmU2Vjcy82MC82MC8yNCkpO1xyXG4gICAgICB3ZWVrcyA9IDA7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBkYXlzID0gTWF0aC5mbG9vcihNYXRoLmFicyhkaWZmU2Vjcy82MC82MC8yNCklNyk7XHJcbiAgICAgIHdlZWtzID0gTWF0aC5mbG9vcihNYXRoLmFicyhkaWZmU2Vjcy82MC82MC8yNC83KSk7XHJcbiAgICB9XHJcbiAgICBzdHlsZSA9ICQuZGF0YSgkdGhpc1swXSwgJ3N0eWxlJyk7XHJcbiAgICAkdGhpcy5kYXNoQ2hhbmdlVG8oaWQsIHN0eWxlICsgJy1zZWNvbmRzX2Rhc2gnLCBzZWNzLCBkdXJhdGlvbiA/IGR1cmF0aW9uIDogNTAwKTtcclxuICAgICR0aGlzLmRhc2hDaGFuZ2VUbyhpZCwgc3R5bGUgKyAnLW1pbnV0ZXNfZGFzaCcsIG1pbnMsIGR1cmF0aW9uID8gZHVyYXRpb24gOiAxMDAwKTtcclxuICAgICR0aGlzLmRhc2hDaGFuZ2VUbyhpZCwgc3R5bGUgKyAnLWhvdXJzX2Rhc2gnLCBob3VycywgZHVyYXRpb24gPyBkdXJhdGlvbiA6IDEwMDApO1xyXG4gICAgJHRoaXMuZGFzaENoYW5nZVRvKGlkLCBzdHlsZSArICctZGF5c19kYXNoJywgZGF5cywgZHVyYXRpb24gPyBkdXJhdGlvbiA6IDEwMDApO1xyXG4gICAgJHRoaXMuZGFzaENoYW5nZVRvKGlkLCBzdHlsZSArICctZGF5c190cmlwX2Rhc2gnLCBkYXlzLCBkdXJhdGlvbiA/IGR1cmF0aW9uIDogMTAwMCk7XHJcbiAgICAkdGhpcy5kYXNoQ2hhbmdlVG8oaWQsIHN0eWxlICsgJy13ZWVrc19kYXNoJywgd2Vla3MsIGR1cmF0aW9uID8gZHVyYXRpb24gOiAxMDAwKTtcclxuICAgICR0aGlzLmRhc2hDaGFuZ2VUbyhpZCwgc3R5bGUgKyAnLXdlZWtzX3RyaXBfZGFzaCcsIHdlZWtzLCBkdXJhdGlvbiA/IGR1cmF0aW9uIDogMTAwMCk7XHJcblxyXG4gICAgJC5kYXRhKCR0aGlzWzBdLCAnZGlmZlNlY3MnLCBkaWZmU2Vjcyk7XHJcblxyXG4gICAgLy9ldmVudHNcclxuICAgIGlmKCAkLmRhdGEoJHRoaXNbMF0sICdldmVudF9pZCcpICl7XHJcbiAgICAgICR0aGlzLmNoZWNrRXZlbnQoaWQsIGRpZmZTZWNzKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKGRpZmZTZWNzID4gMCB8fCAkLmRhdGEoJHRoaXNbMF0sICdsYXVuY2h0YXJnZXQnKSA9PSAnY291bnR1cCcpe1xyXG4gICAgICBpZigkLmRhdGEoJHRoaXNbMF0sICdzdGF0dXMnKSA9PSAncGxheScpe1xyXG4gICAgICAgIHZhciBkZWx0YSA9IDA7XHJcbiAgICAgICAgZGVsYXkgPSAxMDAwO1xyXG4gICAgICAgIG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgYmVmb3JlID0gJC5kYXRhKCR0aGlzWzBdLCAnYmVmb3JlJyk7XHJcbiAgICAgICAgZWxhcHNlZFRpbWUgPSAobm93LmdldFRpbWUoKSAtIGJlZm9yZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGlmKGVsYXBzZWRUaW1lID49IGRlbGF5ICsgMTAwMCl7XHJcbiAgICAgICAgICBkZWx0YSArPSBNYXRoLmZsb29yKDEqKGVsYXBzZWRUaW1lL2RlbGF5KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBkZWx0YSA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJlZm9yZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgJC5kYXRhKCR0aGlzWzBdLCAnYmVmb3JlJywgYmVmb3JlKTtcclxuICAgICAgICB0ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAkdGhpcy5kb0NvdW50RG93bihpZCwgZGlmZlNlY3MtZGVsdGEpO1xyXG4gICAgICAgICAgfSAsIDEwMDApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvL2NiID0gJC5kYXRhKCR0aGlzWzBdLCAnY2FsbGJhY2snKVxyXG4gICAgZWxzZSBpZiAoJC5kYXRhKCR0aGlzWzBdLCAnY2FsbGJhY2snKSl7XHJcbiAgICAgIGlmKCQuZGF0YSgkdGhpc1swXSwgJ2hhbmd0aW1lJykpe1xyXG4gICAgICAgIC8vcGhvbmUncyByaW5naW5nIGR1ZGUuXHJcbiAgICAgIH1cclxuICAgICAgJC5kYXRhKCR0aGlzWzBdLCAnY2FsbGJhY2snKSgpO1xyXG4gICAgfVxyXG5cclxuICB9O1xyXG5cclxuICAkLmZuLmRhc2hDaGFuZ2VUbyA9IGZ1bmN0aW9uKGlkLCBkYXNoLCBuLCBkdXJhdGlvbikge1xyXG4gICAgJHRoaXMgPSAkKCcjJyArIGlkKTtcclxuICAgIHN0eWxlID0gJC5kYXRhKCR0aGlzWzBdLCAnc3R5bGUnKTtcclxuICAgIGZvciAodmFyIGk9KCR0aGlzLmZpbmQoJy4nICsgZGFzaCArICcgLicgKyBzdHlsZSArICctZGlnaXQnKS5sZW5ndGgtMSk7IGk+PTA7IGktLSl7XHJcbiAgICAgIHZhciBkID0gbiUxMDtcclxuICAgICAgbiA9IChuIC0gZCkgLyAxMDtcclxuICAgICAgJHRoaXMuZGlnaXRDaGFuZ2VUbygnIycgKyAkdGhpcy5hdHRyKCdpZCcpICsgJyAuJyArIGRhc2ggKyAnIC4nICsgc3R5bGUgKyAnLWRpZ2l0OmVxKCcraSsnKScsIGQsIGR1cmF0aW9uKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkLmZuLmRpZ2l0Q2hhbmdlVG8gPSBmdW5jdGlvbiAoZGlnaXQsIG4sIGR1cmF0aW9uKSB7XHJcbiAgICBpZiAoIWR1cmF0aW9uKXtcclxuICAgICAgZHVyYXRpb24gPSA1MDA7XHJcbiAgICB9XHJcbiAgICBpZiAoJChkaWdpdCArICcgZGl2LnRvcCcpLmh0bWwoKSAhPSBuICsgJycpe1xyXG4gICAgICAkKGRpZ2l0ICsgJyBkaXYudG9wJykuY3NzKHsnZGlzcGxheSc6ICdub25lJ30pO1xyXG4gICAgICAkKGRpZ2l0ICsgJyBkaXYudG9wJykuaHRtbCgobiA/IG4gOiAnMCcpKS5zdG9wKHRydWUsIHRydWUpLnNsaWRlRG93bihkdXJhdGlvbik7XHJcblxyXG4gICAgICAkKGRpZ2l0ICsgJyBkaXYuYm90dG9tJykuc3RvcCh0cnVlLCB0cnVlKS5hbmltYXRlKHsnaGVpZ2h0JzogJyd9LCBkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChkaWdpdCArICcgZGl2LmJvdHRvbScpLmh0bWwoJChkaWdpdCArICcgZGl2LnRvcCcpLmh0bWwoKSk7XHJcbiAgICAgICAgJChkaWdpdCArICcgZGl2LmJvdHRvbScpLmNzcyh7J2Rpc3BsYXknOiAnYmxvY2snLCAnaGVpZ2h0JzogJyd9KTtcclxuICAgICAgICAkKGRpZ2l0ICsgJyBkaXYudG9wJykuaGlkZSgpLnNsaWRlVXAoMTApO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAkLmZuLmNoZWNrRXZlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoICEgJC5kYXRhKCB0aGlzWzBdLCAnZXZlbnRPYmonICkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZXZlbnRPYmogPSAkLmRhdGEoIHRoaXNbMF0sICdldmVudE9iaicgKS50ZXZlbnQ7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gZXZlbnRPYmopIHtcclxuICAgICAgaWYgKGV2ZW50T2JqW2tleV0uaGFzT3duUHJvcGVydHkoJ3RldmVudHNfZXZlbnRfdGltZScpICYmIGV2ZW50T2JqW2tleV1bJ3RldmVudHNfZXZlbnRfdGltZSddID09ICQuZGF0YSggdGhpc1swXSwgJ2RpZmZTZWNzJyApICkge1xyXG4gICAgICAgIC8vY29udGVudCAoZXZlbiBpZiBpdCdzIGJsYW5rKVxyXG4gICAgICAgIGlmIChldmVudE9ialtrZXldLmhhc093blByb3BlcnR5KCd0ZXZlbnRzX3RhcmdldF9lbGVtJykgJiYgZXZlbnRPYmpba2V5XVsndGV2ZW50c19ldmVudF90YXJnZXQnXSA9PSAnb3RoZXInKSB7XHJcbiAgICAgICAgICB0YXJnZXRfZWxlbSA9IGV2ZW50T2JqW2tleV1bJ3RldmVudHNfdGFyZ2V0X2VsZW0nXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIHRhcmdldF9lbGVtID0gJyMnICsgJC5kYXRhKCB0aGlzWzBdLCAnaWQnICkgKyAnLScgKyBldmVudE9ialtrZXldWyd0ZXZlbnRzX2V2ZW50X3RhcmdldCddO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKHRhcmdldF9lbGVtKS5odG1sKCBldmVudE9ialtrZXldWyd0ZXZlbnRzX2V2ZW50X2NvbnRlbnQnXSApO1xyXG5cclxuICAgICAgICAvL2Z1bmN0aW9uXHJcbiAgICAgICAgaWYgKCBldmVudE9ialtrZXldWyd0ZXZlbnRzX2V2ZW50X2Z1bmN0aW9uJ10gKSB7XHJcbiAgICAgICAgICB2YXIgZm4gPSB3aW5kb3dbIGV2ZW50T2JqW2tleV1bJ3RldmVudHNfZXZlbnRfZnVuY3Rpb24nXSBdO1xyXG4gICAgICAgICAgaWYodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgZm4oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG59KShqUXVlcnkpO1xyXG4iXX0=
