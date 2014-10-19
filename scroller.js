// Scroller © 2014 Andrey Polischuk
// https://github.com/andrepolischuk/scroller

!function(undefined) {

  function Scroller(params) {

    /**
     * Reverse scroll
     */

    params.reverse  = params.reverse || false;

    /**
     * Scroll interval (px)
     */

    params.interval = params.interval || 50;

    /**
     * DOM object
     */

    var el = this.el = document.getElementById(params.element);
    var cont;

    /**
     * Get dimensions
     * @return {Object}
     * @api private
     */

    var dimensions = function() {

      var result = {
        el   : {},
        cont : {}
      };

      // element params
      result.el.offset   = el.offsetTop;
      result.el.size     = el.clientHeight;

      // container params
      result.cont.offset = cont.offsetTop;
      result.cont.size   = cont.clientHeight;

      return result;

    };

    /**
     * Start touchmove
     * @api private
     */

    var touchScrollStart = function(e) {

      e = e || window.event;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      e = e.type === 'touchmove' ? e.changedTouches[0] : e;

      el.setAttribute('data-touch', e.clientY - el.offsetTop);

    };

    /**
     * Moving by touchmove
     * @api private
     */

    var touchScroll = function(e) {

      e = e || window.event;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      e = e.type === 'touchmove' ? e.changedTouches[0] : e;

      if (el.getAttribute('data-touch')) {

        var pre = parseInt(el.getAttribute('data-touch'));

        // touch delta
        var delta  = e.clientY - el.offsetTop - pre;
        delta = params.reverse ? -delta : delta;

        var offset = offsetNormalize(delta);

        scrollByOffset(offset, function() {
          el.setAttribute('data-touch', e.clientY - el.offsetTop);
        });

      }

    };

    /**
     * Stop touchmove
     * @api private
     */

    var touchScrollEnd = function(e) {

      e = e || window.event;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      e = e.type === 'touchmove' ? e.changedTouches[0] : e;

      el.removeAttribute('data-touch');

    };

    /**
     * Moving by scroll
     * @api private
     */

    var wheelScroll = function(e) {

      e = e || window.event;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      // scroll delta
      var delta = e.deltaY || e.detail || (-e.wheelDelta);
      delta = delta / Math.abs(delta);
      delta = params.reverse ? -delta : delta;

      var offset = offsetNormalize(params.interval * -delta);

      scrollByOffset(offset);

    };

    /**
     * Scroll by offset
     * @param  {Number}   offset
     * @param  {Function} callback
     * @api private
     */

    var scrollByOffset = function(offset, callback) {

      if (offset !== 0) {

        var dim = dimensions();

        offset = (dim.cont.offset - dim.el.offset) + offset;

        // scroll by offset
        cont.style.top = offset + 'px';

        if (typeof params.callback === 'function') {
          params.callback(dim.cont.offset - dim.el.offset);
        }

        if (typeof callback === 'function') {
          callback();
        }

      }

    };

    /**
     * Normalize offset values
     * @param  {Number} offset
     * @return {Number}
     * @api private
     */

    var offsetNormalize = function(offset) {

      var dim = dimensions();

      if (offset > 0 && dim.el.offset - dim.cont.offset < Math.abs(offset)) {
        offset = dim.el.offset - dim.cont.offset;
      } else if (offset < 0 && (dim.cont.offset + dim.cont.size) - (dim.el.offset + dim.el.size) < Math.abs(offset)) {
        offset = (dim.el.offset + dim.el.size) - (dim.cont.offset + dim.cont.size);
      }

      return offset;

    };

    /**
     * Scroll to px
     * @param  {String} value
     * @api public
     */

    this.go = function(value) {

      var dim = dimensions();
      var max = dim.cont.size - dim.el.size;

      value = value === '100%' ? max : parseInt(value);
      value = value > max ? max : value;

      // scroll by px
      cont.style.top = '-' + value + 'px';

    };

    /**
     * Initialize
     */

    // adding container
    cont = document.createElement('div');
    cont.innerHTML = el.innerHTML;

    // cont.style.width    = '100%';
    cont.style.display  = 'inline-block';
    cont.style.position = 'relative';

    el.innerHTML = '';
    el.appendChild(cont);

    // init events
    if ('ontouchstart' in window || 'onmsgesturechange' in window) {

      // touch events

      // start move
      el.addEventListener('touchstart', touchScrollStart, false);

      // move
      el.addEventListener('touchmove', touchScroll, false);

      // stop move
      el.addEventListener('touchend', touchScrollEnd, false);

    } else {

      // scroll events

      if ('function' === typeof window.addEventListener) {

        if ('onwheel' in window) {

          el.addEventListener('wheel', wheelScroll, false);

        } else if ('onmousewheel' in window) {

          el.addEventListener('mousewheel', wheelScroll, false);

        } else if ('onscroll' in window) {

          el.addEventListener('scroll', wheelScroll, false);

        } else {

          el.addEventListener('DOMMouseScroll', wheelScroll, false);

        }

      } else {

        el.attachEvent('onmousewheel', wheelScroll);

      }

    }


  }

  /**
   * Example scroller creator
   */

  function Creator(element, params, callback) {

    if (typeof params === 'function') {

      callback = params;
      params   = {};

    } else {

      params   = params || {};
      callback = callback || undefined;

    }

    params.element  = element;
    params.callback = callback;

    return new Scroller(params);

  }

  /**
   * Module exports
   */

  if (typeof define === 'function' && define.amd) {

    define([], function() {
      return Creator;
    });

  } else if (typeof module !== 'undefined' && module.exports) {

    module.exports = Creator;

  } else {

    this.scroller = Creator;

  }

}.call(this);
