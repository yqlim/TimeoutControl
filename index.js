/*!
 * TimeoutControl
 * Copyright (c) by Yong Quan Lim
 * Distributed under MIT license: https://github.com/yqlim/TimeoutControl
 */
(function(global, factory){

    if (typeof exports === 'object' && typeof module !== 'undefined')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define(factory);
    else
        global.TimeoutControl = factory();

})(this, function(){

    'use strict';

    if (typeof setTimeout !== 'function')
        throw new Error('Your environment does not support setTimeout.');


    // Polyfill for Object.defineProperties 
    function defineProperties(obj, desc){
        var prop;

        for (prop in desc){
            Object.defineProperty(obj, prop, desc[prop]);
        }

        return obj;
    }


    function TimeoutControl(callback, duration){
        if (!(this instanceof TimeoutControl))
            throw new SyntaxError('TimeoutControl must be called with the keyword "new".');

        if (arguments.length < 2)
            throw new TypeError('Failed to create TimeoutControl instance: at least 2 arguments required, but only ' + arguments.length + ' present.');

        if (typeof callback !== 'function')
            throw new TypeError('Failed to create TimeoutControl instance: first argument must be a callback function.');

        if (typeof duration !== 'number' || duration < 0)
            throw new RangeError('Failed to create TimeoutControl instance: second argument must be a positive number.');


        defineProperties(this, {

            // id of timeout
            id: {
                writable: true,
                value: null
            },

            // Params to be passed to `callback`
            params: {
                value: Array.prototype.slice.call(arguments, 2)
            },

            duration: {
                value: duration
            },

            timeStart: {
                writable: true,
                value: new Date().getTime()
            }

        });

        // Create these props separately
        // because they depends on the above props
        defineProperties(this, {

            timeStop: {
                writable: true,
                value: this.timeStart
            },

            timeLeft: {
                get: function(){
                    var ret = this.duration - (this.timeStop - this.timeStart);
                    return ret < 0 ? 0 : ret;
                }
            },

            callback: {
                value: function(callback){

                    // [null].concat(this.params) to pass extra params into timeout callback
                    // Params are passed here instead of directly on setTimeout
                    // so that this can also act as polyfill for browsers that
                    // don't support rest params on setTimeout
                    callback.apply(null, this.params);

                    this.timeStop = new Date().getTime();

                }.bind(this, callback)
            },

            done: {
                get: function(){
                    return this.timeLeft === 0;
                }
            }

        });


        this.id = setTimeout(this.callback, this.duration);
    }


    defineProperties(TimeoutControl.prototype, {

        pause: {
            writable: true,
            configurable: true,
            value: function(){
                clearTimeout(this.id);
                this.timeStop = new Date().getTime();
            }
        },

        resume: {
            writable: true,
            configurable: true,
            value: function(){
                this.id = setTimeout(this.callback, this.timeLeft)
            }
        },

        restart: {
            writable: true,
            configurable: true,
            value: function(){
                clearTimeout(this.id);
                this.timeStart = new Date().getTime();
                this.timeStop = this.timeStart;
                this.id = setTimeout(this.callback, this.duration);
            }
        },

        clear: {
            writable: true,
            configurable: true,
            value: function(){
                clearTimeout(this.id);
                this.timeStart = new Date().getTime();
                this.timeStop = this.timeStart;
                this.id = null;
                this.done = true;
            }
        }

    });


    return TimeoutControl;

});