export default class TimeoutControl {

  constructor(callback, duration, ...params){
    const instErr = 'Failed to create TimeoutControl instance:';

    if (arguments.length < 2)
      throw new TypeError(`${instErr} at least 2 arguments required, only ${arguments.length} supplied.`);

    if (typeof callback !== 'function')
      throw new TypeError(`${instErr} first argument must be a function.`);

    if (typeof duration !== 'number')
      throw new TypeError(`${instErr} second argument must be a number greater than 0.`);

    if (duration < 0)
      throw new RangeError(`${instErr} second argument must be a number greater than 0.`);


    this.params = params;
    this.duration = duration;
    this.timeStart = Date.now();
    this.timeStop = this.timeStart;

    this.callback = function(callback){

      // Decorate to pass extra params into timeout callback
      // Params are passed here instead of directly on setTimeout
      // so that this can also act as polyfill for browsers that
      // don't support native "rest" param on setTimeout
      callback.apply(null, this.params);

      this.timeStop = Date.now();

    }.bind(this, callback);

    Object.defineProperty(this, 'timeLeft', {
      get: function(){
        const ret = this.duration - (this.timeStop - this.timeStart);
        return ret < 0
          ? 0
          : ret;
      }
    });

    Object.defineProperty(this, 'done', {
      get: function(){
        return this.timeLeft === 0
      }
    })

    this.id = setTimeout(this.callback, this.duration);
  }

  pause(){
    clearTimeout(this.id);
    this.timeStop = Date.now();
  }

  resume(){
    this.id = setTimeout(this.callback, this.timeLeft);
  }

  clear(){
    clearTimeout(this.id);
    this.timeStart = Date.now();
    this.timeStop = this.timeStart;
    this.id = null;
  }

  restart(){
    this.clear();
    this.id = setTimeout(this.callback, this.duration);
  }

}
