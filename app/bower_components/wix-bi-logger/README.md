# Installation

Install using bower

`bower install --save wix-bi-logger`

Include script tag in your html document.

```html
<script src="bower_components/wix-bi-logger/dist/scripts/bi-logger/wix-bi-angular.js"></script>
```

Add a dependency to your application module.

```javascript
angular.module('myApp', ['wix.common.bi']);
```

# Usage (Angular only, see non-Angular below)

```js
wixBiLoggerProvider.setConfig({
  eventMap: {
    EVENT_1: {evid: 1, param1: 'value1', param2: func, param3: 3}
  },
  errorMap: {
    ERR_1: {errc: 1, param1: 'value1', param2: func, param3: 3}
  },
  defaultEventArgs: {
    param4: 'value1', param5: func, param6: 3
  },
  defaultErrorArgs: {
    param4: 'value1', param5: func, param6: 3
  },
  adapter: 'shahata'
});
```

```js
//all of those methods return a promise!
wixBiLogger.log(wixBiLogger.events.EVENT_1);
wixBiLogger.log(wixBiLogger.events.EVENT_1, {additionalParam: 1});
wixBiLogger.log({evid: 1});
wixBiLogger.log({evid: 1});

wixBiLogger.error(wixBiLogger.errors.ERR_1);
wixBiLogger.error(wixBiLogger.errors.ERR_1, {additionalParam: 1});
wixBiLogger.error({errc: 1});

wixBiLogger.reportOnReady('viewName', {additionalParam: 1});

wixBiLogger.reportRouteChange('viewName', {additionalParam: 1});
```

```html
<div wix-bi="event-name"></div> <!-- defaults to onclick -->
<div wix-bi="event-name" wix-bi-args="params"></div>
<div wix-bi="event-name" wix-bi-args="params" wix-bi-event="mouseenter"></div>
```
### With DI

Note that `func` can have dependency injection, so you can do:

```js
/* @ngInject */
function func(someService) {
  return someService.someMethod();
}

wixBiLoggerProvider.setConfig({
  defaultEventArgs: {
    someParam: func
  }
});
```

## Test Kit

Add those file to your `karma.conf.js`:
```js
{
  'app/bower_components/wix-bi-logger/test/lib/matchers.js',
  'app/bower_components/wix-bi-logger/dist/scripts/bi-logger/wix-bi-angular.js'
}
```

In your unit tests you can do:
```js
expect(wixBiLogger.getLastBiUrl()).toMatchBiAdapter('//frog.wix.com/shahata');
expect(wixBiLogger.getLastBiUrl()).toMatchBiUrl({evid: 1});
expect(wixBiLogger.getLastBiUrl()).toMatchBiUrl({evid: 1, xxx: jasmine.any(String)});
expect(wixBiLogger.getLastBiUrl()).toMatchBiUrl({evid: 1, xxx: /\d+/});
expect(wixBiLogger.getLastBiUrl()).toMatchBiUrl(jasmine.objectContaining({evid: '1'}));
wixBiLogger.getLastBiUrl().assertEmpty();
wixBiLogger.getLastBiUrl().clear();
wixBiLogger.getLastBiUrl().resolve(); //will resolve the promise immediately
```

In your e2e tests you can do:
```js
var biLoggerDriver = require('../../../app/bower_components/wix-bi-logger/test/lib/driver.js');
expect(biLoggerDriver.shift()).toMatchBiUrl({evid: 1}); //verify first bi event
expect(biLoggerDriver.pop()).toMatchBiUrl({evid: 1}); //verify last bi event
biLoggerDriver.assertEmpty(); //check for unhandled events (add in afterEach)
biLoggerDriver.clear(); //drop all unhandled events
```

# Pure JS API (non-Angular)

## Send BI events from JS code

```js
// Init the BI component
var biLogger = new W.BI.Logger({
  defaultEventArgs: {src: 2},
  defaultErrorArgs: {src: 2},
  adapter: 'default' 
});
 
biLogger.log({evid: 140, param: 'val', adapter: 'unique'}, callback);
biLogger.error({errc: 666, desc: 'something really wrong happened', param: 'val'}, callback);

biLogger.reportOnReady('viewName', {additionalParam: 1}, callback);

biLogger.reportRouteChange('viewName', {additionalParam: 1}, callback);
```

## Bind DOM elements events to BI events

```html
<div wix-bi="EVENT_NAME3" wix-bi-args="{'custom_param': 'val'}"></div>
```

```js
var biDomHandler = new W.BI.DomEventHandler(biLogger, {
  eventMap: {
    EVENT_NAME1: { evid: 3 },
    EVENT_NAME2: { evid: 4, custom: 'hello world' },
    EVENT_NAME3: { evid: 5, dynamic: function() { return new Date().getTime(); } }
  },
  errorMap: {
    ERROR_NAME1: {errc: 1, errscp: 'fine scope', trgt: 'fine target'},
    ERROR_NAME2: {errc: 5}
  }
});
 
// Bind/Unbind DOM events
biDomHandler.bind();
biDomHandler.unbind();
  
biDomHandler.log('EVENT_NAME1', {param: 'val'}, callback);
biDomHandler.error('ERROR_NAME1', {param: 'val'}, callback);
```
