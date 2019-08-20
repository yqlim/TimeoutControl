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

  var TimeoutControl = /** @class */ (function () {
      function TimeoutControl(callback, duration) {
          var params = [];
          for (var _i = 2; _i < arguments.length; _i++) {
              params[_i - 2] = arguments[_i];
          }
          var instErr = 'Failed to create TimeoutControl instance:';
          if (arguments.length < 2)
              throw new TypeError(instErr + " at least 2 arguments required, only " + arguments.length + " supplied.");
          if (typeof callback !== 'function')
              throw new TypeError(instErr + " first argument must be a function.");
          if (typeof duration !== 'number')
              throw new TypeError(instErr + " second argument must be a number.");
          if (duration < 0)
              throw new RangeError(instErr + " second argument must be a number greater than 0.");
          this.params = params;
          this.duration = duration;
          this.timeStart = Date.now();
          /**
           * Init `.timeStop` with `.timeStart` value
           * so that `.timeLeft` can equal to `.duration` on init.
           */
          this.timeStop = this.timeStart;
          /**
           * Decorate to pass extra params into timeout callback.
           * Params are passed here instead of directly on `setTimeout`,
           * so that this can also act as shim for browsers that
           * don't support native "rest" param on `setTimeout`.
           */
          this.callback = function (callback) {
              callback.apply(void 0, this.params);
              this.timeStop = Date.now();
          }.bind(this, callback);
          this.id = setTimeout(this.callback, this.duration);
      }
      Object.defineProperty(TimeoutControl.prototype, "timeLeft", {
          get: function () {
              var ret = this.duration - (this.timeStop - this.timeStart);
              return ret < 0
                  ? 0
                  : ret;
          },
          enumerable: true,
          configurable: true
      });
      TimeoutControl.prototype.done = function () {
          return this.timeLeft === 0;
      };
      TimeoutControl.prototype.pause = function () {
          clearTimeout(this.id);
          this.timeStop = Date.now();
      };
      TimeoutControl.prototype.resume = function () {
          this.id = setTimeout(this.callback, this.timeLeft);
      };
      TimeoutControl.prototype.clear = function () {
          clearTimeout(this.id);
          this.timeStart = Date.now();
          this.timeStop = this.timeStart;
      };
      TimeoutControl.prototype.restart = function () {
          this.clear();
          this.id = setTimeout(this.callback, this.duration);
      };
      return TimeoutControl;
  }());

  return TimeoutControl;

}));
