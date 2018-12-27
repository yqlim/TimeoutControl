# TimeoutControl

A JavaScript tool to imitate `setTimeout` functionality to extend control over it.


# Install

## NPM

`npm install timeoutcontrol`

# API

## Invoking

`TimeoutControl` accepts any parameters that the native `setTimeout` will accept.

```javascript
const timeout = new TimeoutControl(callback[, delay[, param1, param2, ...]]);
```

## Properties

### .id

Returns the id of the timeout.

### .params

Returns an array of all params (i.e., `param1`, `param2`, ...).

### .duration

Returns the duration of the timeout.

### .timeStart

Returns the time the timeout starts.

### .timeStop

Returns the time the timeout is paused/stopped.

### .callback

Returns the callback function to run when the timeout ends.

### .timeLeft

Returns the time left before the timeout ends.

### .done

Returns a boolean of whether the timeout has ended.

## Methods

### .pause()

Pause the ongoing timeout.

### .resume()

Resume the paused timeout.

### .restart()

Restart the timeout from the beginning. `.timeStart`, `.timeStop` and `.id` will be updated.

### .clear()

Cancel the timeout. `.done` will be updated to `true`.

# Demo

```javascript
const duration = 5000;
const callback = function(){
    console.log(...arguments);
}

const timeout = new TimeoutControl(callback, duration, 1, 2, 3, 4, 5);

/* ...SOME OPERATIONS / CONDITIONS */

timeout.pause();

/* ...SOME OPERATIONS / CONDITIONS */

timeout.resume();

/* ...SOME OPERATIONS / CONDITIONS */

timeout.clear();

/* ...SOME OPERATIONS / CONDITIONS */

timeout.restart();
```
