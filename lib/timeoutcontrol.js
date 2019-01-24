/*!
 * TimeoutControl
 * (c) 2019 Yong Quan Lim
 * Released under MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.TimeoutControl = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var TimeoutControl =
  /*#__PURE__*/
  function () {
    function TimeoutControl(callback, duration) {
      for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        params[_key - 2] = arguments[_key];
      }

      _classCallCheck(this, TimeoutControl);

      var instErr = 'Failed to create TimeoutControl instance:';
      if (arguments.length < 2) throw new TypeError("".concat(instErr, " at least 2 arguments required, only ").concat(arguments.length, " supplied."));
      if (typeof callback !== 'function') throw new TypeError("".concat(instErr, " first argument must be a function."));
      if (typeof duration !== 'number') throw new TypeError("".concat(instErr, " second argument must be a number greater than 0."));
      if (duration < 0) throw new RangeError("".concat(instErr, " second argument must be a number greater than 0."));
      this.params = params;
      this.duration = duration;
      this.timeStart = Date.now();
      this.timeStop = this.timeStart;

      this.callback = function (callback) {
        // Decorate to pass extra params into timeout callback
        // Params are passed here instead of directly on setTimeout
        // so that this can also act as polyfill for browsers that
        // don't support native "rest" param on setTimeout
        callback.apply(null, this.params);
        this.timeStop = Date.now();
      }.bind(this, callback);

      Object.defineProperty(this, 'timeLeft', {
        get: function get() {
          var ret = this.duration - (this.timeStop - this.timeStart);
          return ret < 0 ? 0 : ret;
        }
      });
      Object.defineProperty(this, 'done', {
        get: function get() {
          return this.timeLeft === 0;
        }
      });
      this.id = setTimeout(this.callback, this.duration);
    }

    _createClass(TimeoutControl, [{
      key: "pause",
      value: function pause() {
        clearTimeout(this.id);
        this.timeStop = Date.now();
      }
    }, {
      key: "resume",
      value: function resume() {
        this.id = setTimeout(this.callback, this.timeLeft);
      }
    }, {
      key: "clear",
      value: function clear() {
        clearTimeout(this.id);
        this.timeStart = Date.now();
        this.timeStop = this.timeStart;
        this.id = null;
      }
    }, {
      key: "restart",
      value: function restart() {
        this.clear();
        this.id = setTimeout(this.callback, this.duration);
      }
    }]);

    return TimeoutControl;
  }();

  return TimeoutControl;

}));
