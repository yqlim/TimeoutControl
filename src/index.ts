class TimeoutControl {

  protected readonly params: any[];
  protected readonly callback: (this: TimeoutControl, callback: (...params: any[]) => void) => void;

  private readonly duration: number;

  /**
   * `.timeStop` exists solely for the purpose of calculating `.timeLeft`.
   * So every value that it get assigned is for that purpose,
   * though it might look weird in some cases.
   */
  private timeStop: number;
  private timeStart: number;
  private id: ReturnType<typeof setTimeout>;

  constructor(callback: (...params: any[]) => void, duration: number, ...params: any[]){
    const instErr: string = 'Failed to create TimeoutControl instance:';

    if (arguments.length < 2)
      throw new TypeError(`${instErr} at least 2 arguments required, only ${arguments.length} supplied.`);

    if (typeof callback !== 'function')
      throw new TypeError(`${instErr} first argument must be a function.`);

    if (typeof duration !== 'number')
      throw new TypeError(`${instErr} second argument must be a number.`);

    if (duration < 0)
      throw new RangeError(`${instErr} second argument must be a number greater than 0.`);

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
    this.callback = function(this: TimeoutControl, callback: (...params: any[]) => void): void {
      callback.apply(void 0, this.params);
      this.timeStop = Date.now();
    }.bind(this, callback);

    this.id = setTimeout(this.callback, this.duration);
  }

  protected get timeLeft(): number {
    const ret = this.duration - (this.timeStop - this.timeStart);
    return ret < 0
      ? 0
      : ret;
  }

  done(): boolean {
    return this.timeLeft === 0;
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
  }

  restart(){
    this.clear();
    this.id = setTimeout(this.callback, this.duration);
  }

}


export default TimeoutControl;
