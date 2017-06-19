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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3QtbWludXMtY291bnRkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogVC0gQ291bnRkb3duIHYxLjUuNVxuICogaHR0cDovL3BsdWdpbnMudHdpbnBpY3R1cmVzLmRlL3BsdWdpbnMvdC1taW51cy1jb3VudGRvd24vXG4gKlxuICogQ29weXJpZ2h0IDIwMTUsIFR3aW5waWN0dXJlc1xuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYmxlbmQsIHRyYWRlLFxuICogYmFrZSwgaGFjaywgc2NyYW1ibGUsIGRpZmlidXJsYXRlLCBkaWdlc3QgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbiAqIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxuKGZ1bmN0aW9uKCQpe1xuICAkLmZuLmNvdW50RG93biA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgY29uZmlnID0ge307XG4gICAgJC5leHRlbmQoY29uZmlnLCBvcHRpb25zKTtcbiAgICB0YXJnZXRUaW1lID0gdGhpcy5zZXRUYXJnZXRUaW1lKGNvbmZpZyk7XG4gICAgLy9zZXQgZGlmZlNlY3MgYW5kIGxhdW5jaCB0aGUgY291bnRkb3duIG9uY2UgdGhlIGFqYXggZm9yIG5vdyBsb2Fkc1xuICAgIGRpZmZTZWNzID0gdGhpcy5zZXREaWZmU2Vjcyh0YXJnZXRUaW1lLCBvcHRpb25zLnRhcmdldERhdGUubG9jYWx0aW1lKTtcbiAgICBiZWZvcmUgPSBuZXcgRGF0ZSgpO1xuICAgICQuZGF0YSgkKHRoaXMpWzBdLCAnYmVmb3JlJywgYmVmb3JlKTtcbiAgICAkLmRhdGEoJCh0aGlzKVswXSwgJ3N0YXR1cycsICdwbGF5Jyk7XG4gICAgJC5kYXRhKCQodGhpcylbMF0sICdpZCcsIGNvbmZpZy5pZCk7XG4gICAgc3R5bGUgPSBjb25maWcuc3R5bGU7XG4gICAgJC5kYXRhKCQodGhpcylbMF0sICdzdHlsZScsIGNvbmZpZy5zdHlsZSk7XG5cbiAgICBpZiAoIGNvbmZpZy5ldmVudF9pZCApIHtcbiAgICAgICQuZGF0YSgkKHRoaXMpWzBdLCAnZXZlbnRfaWQnLCBjb25maWcuZXZlbnRfaWQpO1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB0Q291bnRBamF4LmFqYXh1cmwsXG4gICAgICAgIHR5cGUgOiBcInBvc3RcIixcbiAgICAgICAgZGF0YVR5cGUgOiBcImpzb25cIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGFjdGlvbiA6ICd0bWludXNldmVudHMnLFxuICAgICAgICAgIGV2ZW50X2lkIDogY29uZmlnLmV2ZW50X2lkLFxuICAgICAgICAgIGNvdW50ZG93bk5vbmNlIDogdENvdW50QWpheC5jb3VudGRvd25Ob25jZVxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiAkLnByb3h5KGZ1bmN0aW9uKCBqc29ub2JqICkge1xuICAgICAgICAgICQuZGF0YSgkKHRoaXMpWzBdLCAnZXZlbnRPYmonLCBqc29ub2JqKTtcbiAgICAgICAgfSwgdGhpcylcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmKCBjb25maWcubGF1bmNodGFyZ2V0ICkge1xuICAgICAgJC5kYXRhKCQodGhpcylbMF0sICdsYXVuY2h0YXJnZXQnLCBjb25maWcubGF1bmNodGFyZ2V0KTtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5vbkNvbXBsZXRlKXtcbiAgICAgICQuZGF0YSgkKHRoaXMpWzBdLCAnY2FsbGJhY2snLCBjb25maWcub25Db21wbGV0ZSk7XG4gICAgfVxuICAgIGlmIChjb25maWcuaGFuZ3RpbWUpe1xuICAgICAgJC5kYXRhKCQodGhpcylbMF0sICdoYW5ndGltZScsIGNvbmZpZy5oYW5ndGltZSk7XG4gICAgfVxuICAgIGlmIChjb25maWcub21pdFdlZWtzKXtcbiAgICAgICQuZGF0YSgkKHRoaXMpWzBdLCAnb21pdFdlZWtzJywgY29uZmlnLm9taXRXZWVrcyk7XG4gICAgfVxuICAgICQoJyMnICsgJCh0aGlzKS5hdHRyKCdpZCcpICsgJyAuJyArIHN0eWxlICsgJy1kaWdpdCcpLmh0bWwoJzxkaXYgY2xhc3M9XCJ0b3BcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm90dG9tXCI+PC9kaXY+Jyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgJC5mbi5zdG9wQ291bnREb3duID0gZnVuY3Rpb24gKCkge1xuICAgICQuZGF0YSh0aGlzWzBdLCAnc3RhdHVzJywgJ3N0b3AnKTtcbiAgfTtcblxuICAkLmZuLnN0YXJ0Q291bnREb3duID0gZnVuY3Rpb24gKCkge1xuICAgICQuZGF0YSh0aGlzWzBdLCAnc3RhdHVzJywgJ3BsYXknKTtcbiAgICB0aGlzLmRvQ291bnREb3duKCQodGhpcykuYXR0cignaWQnKSwkLmRhdGEodGhpc1swXSwgJ2RpZmZTZWNzJyksIDUwMCk7XG4gIH07XG5cbiAgJC5mbi5zZXREaWZmU2VjcyA9IGZ1bmN0aW9uICh0YXJnZXRUaW1lLCBiYWNrdXB0aW1lKSB7XG4gICAgdmFyIGRpZmZTZWNzID0gbnVsbDtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiAnaHR0cDovL3d3dy5ibWMuY29tL3RlbXBsYXRlcy9TZXJ2aWNlR2V0RGF0ZVRpbWVOb3cnLFxuICAgICAgdHlwZSA6IFwicG9zdFwiLFxuICAgICAgZGF0YVR5cGUgOiBcImpzb25cIixcbiAgICAgIHN1Y2Nlc3M6ICQucHJveHkoZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coZGF0YVsnbm93J10pO1xuICAgICAgICBub3dUaW1lID0gbmV3IERhdGUoZGF0YVsnbm93J10pO1xuICAgICAgICBkaWZmU2VjcyA9IE1hdGguZmxvb3IoKHRhcmdldFRpbWUudmFsdWVPZigpLW5vd1RpbWUudmFsdWVPZigpKS8xMDAwKTtcbiAgICAgICAgJCh0aGlzKS5kb0NvdW50RG93bigkKHRoaXMpLmF0dHIoJ2lkJyksIGRpZmZTZWNzLCA1MDApO1xuICAgICAgfSwgdGhpcyksXG4gICAgICBlcnJvcjogJC5wcm94eShmdW5jdGlvbiggcmVxdWVzdCwgc3RhdHVzLCBlcnJvciApIHtcbiAgICAgICAgbm93VGltZSA9IG5ldyBEYXRlKGJhY2t1cHRpbWUpO1xuICAgICAgICBkaWZmU2VjcyA9IE1hdGguZmxvb3IoKHRhcmdldFRpbWUudmFsdWVPZigpLW5vd1RpbWUudmFsdWVPZigpKS8xMDAwKTtcbiAgICAgICAgJCh0aGlzKS5kb0NvdW50RG93bigkKHRoaXMpLmF0dHIoJ2lkJyksIGRpZmZTZWNzLCA1MDApO1xuICAgICAgfSwgdGhpcylcbiAgICB9KTtcbiAgfTtcblxuICAkLmZuLnNldFRhcmdldFRpbWUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciB0YXJnZXRUaW1lID0gbmV3IERhdGUoKTtcbiAgICBpZiAob3B0aW9ucy50YXJnZXREYXRlKXtcbiAgICAgIHRhcmdldFRpbWUgPSBuZXcgRGF0ZShvcHRpb25zLnRhcmdldERhdGUubW9udGggKyAnLycgKyBvcHRpb25zLnRhcmdldERhdGUuZGF5ICsgJy8nICsgb3B0aW9ucy50YXJnZXREYXRlLnllYXIgKyAnICcgKyBvcHRpb25zLnRhcmdldERhdGUuaG91ciArICc6JyArIG9wdGlvbnMudGFyZ2V0RGF0ZS5taW4gKyAnOicgKyBvcHRpb25zLnRhcmdldERhdGUuc2VjICsgKG9wdGlvbnMudGFyZ2V0RGF0ZS51dGMgPyAnIFVUQycgOiAnJykpO1xuICAgIH1cbiAgICBlbHNlIGlmIChvcHRpb25zLnRhcmdldE9mZnNldCl7XG4gICAgICB0YXJnZXRUaW1lLnNldEZ1bGxZZWFyKG9wdGlvbnMudGFyZ2V0T2Zmc2V0LnllYXIgKyB0YXJnZXRUaW1lLmdldEZ1bGxZZWFyKCkpO1xuICAgICAgdGFyZ2V0VGltZS5zZXRNb250aChvcHRpb25zLnRhcmdldE9mZnNldC5tb250aCArIHRhcmdldFRpbWUuZ2V0TW9udGgoKSk7XG4gICAgICB0YXJnZXRUaW1lLnNldERhdGUob3B0aW9ucy50YXJnZXRPZmZzZXQuZGF5ICsgdGFyZ2V0VGltZS5nZXREYXRlKCkpO1xuICAgICAgdGFyZ2V0VGltZS5zZXRIb3VycyhvcHRpb25zLnRhcmdldE9mZnNldC5ob3VyICsgdGFyZ2V0VGltZS5nZXRIb3VycygpKTtcbiAgICAgIHRhcmdldFRpbWUuc2V0TWludXRlcyhvcHRpb25zLnRhcmdldE9mZnNldC5taW4gKyB0YXJnZXRUaW1lLmdldE1pbnV0ZXMoKSk7XG4gICAgICB0YXJnZXRUaW1lLnNldFNlY29uZHMob3B0aW9ucy50YXJnZXRPZmZzZXQuc2VjICsgdGFyZ2V0VGltZS5nZXRTZWNvbmRzKCkpO1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRUaW1lO1xuICB9O1xuXG4gICQuZm4uZG9Db3VudERvd24gPSBmdW5jdGlvbiAoaWQsIGRpZmZTZWNzLCBkdXJhdGlvbikge1xuICAgICR0aGlzID0gJCgnIycgKyBpZCk7XG5cbiAgICBpZiAoZGlmZlNlY3MgPD0gMCl7XG4gICAgICBpZiggJC5kYXRhKCR0aGlzWzBdLCAnbGF1bmNodGFyZ2V0JykgIT0gJ2NvdW50dXAnICl7XG4gICAgICAgIGRpZmZTZWNzID0gMDtcbiAgICAgICAgJC5kYXRhKCR0aGlzWzBdLCAnc3RhdHVzJywgJ3N0b3AnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VjcyA9IE1hdGguYWJzKGRpZmZTZWNzICUgNjApO1xuICAgIG1pbnMgPSBNYXRoLmZsb29yKE1hdGguYWJzKGRpZmZTZWNzLzYwKSU2MCk7XG4gICAgaG91cnMgPSBNYXRoLmZsb29yKE1hdGguYWJzKGRpZmZTZWNzLzYwLzYwKSUyNCk7XG4gICAgaWYgKCQuZGF0YSgkdGhpc1swXSwgJ29taXRXZWVrcycpID09ICd0cnVlJyl7XG4gICAgICBkYXlzID0gTWF0aC5mbG9vcihNYXRoLmFicyhkaWZmU2Vjcy82MC82MC8yNCkpO1xuICAgICAgd2Vla3MgPSAwO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgZGF5cyA9IE1hdGguZmxvb3IoTWF0aC5hYnMoZGlmZlNlY3MvNjAvNjAvMjQpJTcpO1xuICAgICAgd2Vla3MgPSBNYXRoLmZsb29yKE1hdGguYWJzKGRpZmZTZWNzLzYwLzYwLzI0LzcpKTtcbiAgICB9XG4gICAgc3R5bGUgPSAkLmRhdGEoJHRoaXNbMF0sICdzdHlsZScpO1xuICAgICR0aGlzLmRhc2hDaGFuZ2VUbyhpZCwgc3R5bGUgKyAnLXNlY29uZHNfZGFzaCcsIHNlY3MsIGR1cmF0aW9uID8gZHVyYXRpb24gOiA1MDApO1xuICAgICR0aGlzLmRhc2hDaGFuZ2VUbyhpZCwgc3R5bGUgKyAnLW1pbnV0ZXNfZGFzaCcsIG1pbnMsIGR1cmF0aW9uID8gZHVyYXRpb24gOiAxMDAwKTtcbiAgICAkdGhpcy5kYXNoQ2hhbmdlVG8oaWQsIHN0eWxlICsgJy1ob3Vyc19kYXNoJywgaG91cnMsIGR1cmF0aW9uID8gZHVyYXRpb24gOiAxMDAwKTtcbiAgICAkdGhpcy5kYXNoQ2hhbmdlVG8oaWQsIHN0eWxlICsgJy1kYXlzX2Rhc2gnLCBkYXlzLCBkdXJhdGlvbiA/IGR1cmF0aW9uIDogMTAwMCk7XG4gICAgJHRoaXMuZGFzaENoYW5nZVRvKGlkLCBzdHlsZSArICctZGF5c190cmlwX2Rhc2gnLCBkYXlzLCBkdXJhdGlvbiA/IGR1cmF0aW9uIDogMTAwMCk7XG4gICAgJHRoaXMuZGFzaENoYW5nZVRvKGlkLCBzdHlsZSArICctd2Vla3NfZGFzaCcsIHdlZWtzLCBkdXJhdGlvbiA/IGR1cmF0aW9uIDogMTAwMCk7XG4gICAgJHRoaXMuZGFzaENoYW5nZVRvKGlkLCBzdHlsZSArICctd2Vla3NfdHJpcF9kYXNoJywgd2Vla3MsIGR1cmF0aW9uID8gZHVyYXRpb24gOiAxMDAwKTtcblxuICAgICQuZGF0YSgkdGhpc1swXSwgJ2RpZmZTZWNzJywgZGlmZlNlY3MpO1xuXG4gICAgLy9ldmVudHNcbiAgICBpZiggJC5kYXRhKCR0aGlzWzBdLCAnZXZlbnRfaWQnKSApe1xuICAgICAgJHRoaXMuY2hlY2tFdmVudChpZCwgZGlmZlNlY3MpO1xuICAgIH1cblxuXG4gICAgaWYgKGRpZmZTZWNzID4gMCB8fCAkLmRhdGEoJHRoaXNbMF0sICdsYXVuY2h0YXJnZXQnKSA9PSAnY291bnR1cCcpe1xuICAgICAgaWYoJC5kYXRhKCR0aGlzWzBdLCAnc3RhdHVzJykgPT0gJ3BsYXknKXtcbiAgICAgICAgdmFyIGRlbHRhID0gMDtcbiAgICAgICAgZGVsYXkgPSAxMDAwO1xuICAgICAgICBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBiZWZvcmUgPSAkLmRhdGEoJHRoaXNbMF0sICdiZWZvcmUnKTtcbiAgICAgICAgZWxhcHNlZFRpbWUgPSAobm93LmdldFRpbWUoKSAtIGJlZm9yZS5nZXRUaW1lKCkpO1xuICAgICAgICBpZihlbGFwc2VkVGltZSA+PSBkZWxheSArIDEwMDApe1xuICAgICAgICAgIGRlbHRhICs9IE1hdGguZmxvb3IoMSooZWxhcHNlZFRpbWUvZGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGRlbHRhID0gMTtcbiAgICAgICAgfVxuICAgICAgICBiZWZvcmUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAkLmRhdGEoJHRoaXNbMF0sICdiZWZvcmUnLCBiZWZvcmUpO1xuICAgICAgICB0ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJHRoaXMuZG9Db3VudERvd24oaWQsIGRpZmZTZWNzLWRlbHRhKTtcbiAgICAgICAgICB9ICwgMTAwMCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vY2IgPSAkLmRhdGEoJHRoaXNbMF0sICdjYWxsYmFjaycpXG4gICAgZWxzZSBpZiAoJC5kYXRhKCR0aGlzWzBdLCAnY2FsbGJhY2snKSl7XG4gICAgICBpZigkLmRhdGEoJHRoaXNbMF0sICdoYW5ndGltZScpKXtcbiAgICAgICAgLy9waG9uZSdzIHJpbmdpbmcgZHVkZS5cbiAgICAgIH1cbiAgICAgICQuZGF0YSgkdGhpc1swXSwgJ2NhbGxiYWNrJykoKTtcbiAgICB9XG5cbiAgfTtcblxuICAkLmZuLmRhc2hDaGFuZ2VUbyA9IGZ1bmN0aW9uKGlkLCBkYXNoLCBuLCBkdXJhdGlvbikge1xuICAgICR0aGlzID0gJCgnIycgKyBpZCk7XG4gICAgc3R5bGUgPSAkLmRhdGEoJHRoaXNbMF0sICdzdHlsZScpO1xuICAgIGZvciAodmFyIGk9KCR0aGlzLmZpbmQoJy4nICsgZGFzaCArICcgLicgKyBzdHlsZSArICctZGlnaXQnKS5sZW5ndGgtMSk7IGk+PTA7IGktLSl7XG4gICAgICB2YXIgZCA9IG4lMTA7XG4gICAgICBuID0gKG4gLSBkKSAvIDEwO1xuICAgICAgJHRoaXMuZGlnaXRDaGFuZ2VUbygnIycgKyAkdGhpcy5hdHRyKCdpZCcpICsgJyAuJyArIGRhc2ggKyAnIC4nICsgc3R5bGUgKyAnLWRpZ2l0OmVxKCcraSsnKScsIGQsIGR1cmF0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgJC5mbi5kaWdpdENoYW5nZVRvID0gZnVuY3Rpb24gKGRpZ2l0LCBuLCBkdXJhdGlvbikge1xuICAgIGlmICghZHVyYXRpb24pe1xuICAgICAgZHVyYXRpb24gPSA1MDA7XG4gICAgfVxuICAgIGlmICgkKGRpZ2l0ICsgJyBkaXYudG9wJykuaHRtbCgpICE9IG4gKyAnJyl7XG4gICAgICAkKGRpZ2l0ICsgJyBkaXYudG9wJykuY3NzKHsnZGlzcGxheSc6ICdub25lJ30pO1xuICAgICAgJChkaWdpdCArICcgZGl2LnRvcCcpLmh0bWwoKG4gPyBuIDogJzAnKSkuc3RvcCh0cnVlLCB0cnVlKS5zbGlkZURvd24oZHVyYXRpb24pO1xuXG4gICAgICAkKGRpZ2l0ICsgJyBkaXYuYm90dG9tJykuc3RvcCh0cnVlLCB0cnVlKS5hbmltYXRlKHsnaGVpZ2h0JzogJyd9LCBkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICQoZGlnaXQgKyAnIGRpdi5ib3R0b20nKS5odG1sKCQoZGlnaXQgKyAnIGRpdi50b3AnKS5odG1sKCkpO1xuICAgICAgICAkKGRpZ2l0ICsgJyBkaXYuYm90dG9tJykuY3NzKHsnZGlzcGxheSc6ICdibG9jaycsICdoZWlnaHQnOiAnJ30pO1xuICAgICAgICAkKGRpZ2l0ICsgJyBkaXYudG9wJykuaGlkZSgpLnNsaWRlVXAoMTApO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gICQuZm4uY2hlY2tFdmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoICEgJC5kYXRhKCB0aGlzWzBdLCAnZXZlbnRPYmonICkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGV2ZW50T2JqID0gJC5kYXRhKCB0aGlzWzBdLCAnZXZlbnRPYmonICkudGV2ZW50O1xuICAgIGZvciAodmFyIGtleSBpbiBldmVudE9iaikge1xuICAgICAgaWYgKGV2ZW50T2JqW2tleV0uaGFzT3duUHJvcGVydHkoJ3RldmVudHNfZXZlbnRfdGltZScpICYmIGV2ZW50T2JqW2tleV1bJ3RldmVudHNfZXZlbnRfdGltZSddID09ICQuZGF0YSggdGhpc1swXSwgJ2RpZmZTZWNzJyApICkge1xuICAgICAgICAvL2NvbnRlbnQgKGV2ZW4gaWYgaXQncyBibGFuaylcbiAgICAgICAgaWYgKGV2ZW50T2JqW2tleV0uaGFzT3duUHJvcGVydHkoJ3RldmVudHNfdGFyZ2V0X2VsZW0nKSAmJiBldmVudE9ialtrZXldWyd0ZXZlbnRzX2V2ZW50X3RhcmdldCddID09ICdvdGhlcicpIHtcbiAgICAgICAgICB0YXJnZXRfZWxlbSA9IGV2ZW50T2JqW2tleV1bJ3RldmVudHNfdGFyZ2V0X2VsZW0nXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIHRhcmdldF9lbGVtID0gJyMnICsgJC5kYXRhKCB0aGlzWzBdLCAnaWQnICkgKyAnLScgKyBldmVudE9ialtrZXldWyd0ZXZlbnRzX2V2ZW50X3RhcmdldCddO1xuICAgICAgICB9XG4gICAgICAgICQodGFyZ2V0X2VsZW0pLmh0bWwoIGV2ZW50T2JqW2tleV1bJ3RldmVudHNfZXZlbnRfY29udGVudCddICk7XG5cbiAgICAgICAgLy9mdW5jdGlvblxuICAgICAgICBpZiAoIGV2ZW50T2JqW2tleV1bJ3RldmVudHNfZXZlbnRfZnVuY3Rpb24nXSApIHtcbiAgICAgICAgICB2YXIgZm4gPSB3aW5kb3dbIGV2ZW50T2JqW2tleV1bJ3RldmVudHNfZXZlbnRfZnVuY3Rpb24nXSBdO1xuICAgICAgICAgIGlmKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG59KShqUXVlcnkpO1xuIl19
