const chai = require('chai');
const expect = chai.expect;
chai.should();


const TimeoutControl = require('./../lib/timeoutcontrol');


const plusMinus = (value, expected, maxDeviation = 10) => {
  const min = expected - maxDeviation;
  const max = expected + maxDeviation;
  for (let i = min; i <= max; i++){
    if (value === i)
      return true;
  }
  return false;
}
const promiseTimeout = (ms, callback) => new Promise(res => {
  setTimeout(function(){
    callback();
    res();
  }, ms);
});


describe('TimeoutControl', function(){

  describe('constructor', function(){

    const runner = (...args) => () => new TimeoutControl(...args);

    it('should throw if not invoked with `new` keyword.', function(){
      const run = () => TimeoutControl();
      expect(run).to.throw();
    });

    it('should throw if argument length is less than 2.', function(){
      expect(runner(0)).to.throw(TypeError, /at least 2 arguments/);
    });

    it('should throw if arguments[0] is not a function.', function(){
      const vals = [
        0,
        '0',
        false,
        {},
        [],
        Symbol()
      ];

      vals.forEach(val => {
        expect(runner(val, 0)).to.throw(TypeError, /first argument must be a function/);
      });
    });

    it('should throw if arguments[1] is not a number.', function(){
      const vals  = [
        '0',
        false,
        {},
        [],
        Symbol(),
        () => {}
      ];

      vals.forEach(val => {
        expect(runner(() => {}, val)).to.throw(TypeError, /must be a number/);
      });
    });

    it('should throw if arguments[1] is less than 0', function(){
      expect(runner(() => {}, -1)).to.throw(RangeError, /greater than 0/);
    });

  });

  describe('.pause & .resume', function(){

    it('should pause timeout and resume.', function(){
      return new Promise(async (resolve, reject) => {
        try {

          const duration = 500;
          const pauseAt = 100;
          const timeLeftAfterPause = duration - pauseAt;

          const timeout = new TimeoutControl(
            reject.bind(void 0, new Error('Not paused.')),
            duration
          );

          await promiseTimeout(pauseAt, () => timeout.pause());
          await promiseTimeout(50, () => {
            expect(plusMinus(timeout.timeLeft, timeLeftAfterPause, 50)).to.equal(true);
          });

          let notResumedTest;

          await promiseTimeout(timeLeftAfterPause, resolve);
          await promiseTimeout(100, () => {
            timeout.resume();
            notResumedTest = setTimeout(() => {
              throw new Error('Not resumed.');
            }, timeLeftAfterPause)
          });

          clearTimeout(notResumedTest);
          resolve();

        } catch(err){
          reject(err);
        }
      });
    }).timeout(600);

  });

  describe('.clear', function(){

    it('should clear timeout.', function(){
      return new Promise((resolve, reject) => {
        const timeout = new TimeoutControl(function(){
          reject(new Error('Not cleared.'));
        }, 100);
        timeout.clear();
        setTimeout(resolve, 200);
      });
    });

  });

  describe('.restart', function(){

    it('should be able to restart timeout.', function(done){
      let i = 0;

      const timeout = new TimeoutControl(function(){
        expect(i).to.be.greaterThan(0);
        done();
      }, 100);

      setTimeout(() => i++, 125);
      setTimeout(timeout.restart.bind(timeout), 50);
    });

  });

});
