// Scroller © 2014 Andrey Polischuk
// https://github.com/andrepolischuk/scroller

!function() {

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

    var el = this.el = params.element;
    var cont;

    /**
     * Exclude dumlication
     */

    el.setAttribute('data-scroller', true);

    /**
     * Set request animation frame
     */

    var requestFrame = (function(){

      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback, element){
          window.setTimeout(callback, 1000 / 60);
        };

    })();


    /**
     * Get dimensions
     * @return {Object}
     * @api private
     */

    function dimensions() {

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

    }

    /**
     * Start touchmove
     * @param {Object} e
     * @api private
     */

    function touchScrollStart(e) {

      e = e || window.event;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      e = e.type === 'touchmove' ? e.changedTouches[0] : e;

      el.setAttribute('data-touch', e.clientY - el.offsetTop);

    }

    /**
     * Moving by touchmove
     * @param {Object} e
     * @api private
     */

    function touchScroll(e) {

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

    }

    /**
     * Stop touchmove
     * @param {Object} e
     * @api private
     */

    function touchScrollEnd(e) {

      e = e || window.event;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      e = e.type === 'touchmove' ? e.changedTouches[0] : e;

      el.removeAttribute('data-touch');

    }

    /**
     * Moving by scroll
     * @param {Object} e
     * @api private
     */

    function wheelScroll(e) {

      e = e || window.event;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      // scroll delta
      var delta = e.deltaY || e.detail || (-e.wheelDelta);
      delta /= Math.abs(delta);
      delta = params.reverse ? -delta : delta;

      var offset = offsetNormalize(params.interval * -delta);

      scrollByOffset(offset);

    }

    /**
     * Scroll by offset
     * @param  {Number}   offset
     * @param  {Function} callback
     * @api private
     */

    function scrollByOffset(offset, callback) {

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

    }

    /**
     * Normalize offset values
     * @param  {Number} offset
     * @return {Number}
     * @api private
     */

    function offsetNormalize(offset) {

      var dim = dimensions();

      if (offset > 0 && dim.el.offset - dim.cont.offset < Math.abs(offset)) {
        offset = dim.el.offset - dim.cont.offset;
      } else if (offset < 0 && (dim.cont.offset + dim.cont.size) - (dim.el.offset + dim.el.size) < Math.abs(offset)) {
        offset = (dim.el.offset + dim.el.size) - (dim.cont.offset + dim.cont.size);
      }

      return offset;

    }

    /**
     * Scroll to px
     * @param  {String} value
     * @api public
     */

    this.go = function(value) {

      var exp = /^(\d+)(px|%)?$/;
      var dim = dimensions();
      var max = dim.cont.size - dim.el.size;

      var measure = ('' + value).replace(exp, "$2");
      measure = measure || 'px';

      value = parseInt(('' + value).replace(exp, "$1"));
      value = measure === '%' ? max * value / 100 : value;
      value = value > max ? max : value;

      var offset = el.offsetTop - cont.offsetTop;
      var step = max / 1000 * 60;

      !function interval(pos) {

        if (pos === value) {
          return;
        }

        pos = offset < value ? pos + step : pos - step;
        pos = pos < 0 ? 0 : pos;
        pos = pos > max ? max : pos;

        cont.style.top = -pos + 'px';

        requestFrame(function() {
          interval(pos);
        });

      }(offset);

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

    element = document.getElementById(element);

    if (element.getAttribute('data-scroller')) {
      return;
    }

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
