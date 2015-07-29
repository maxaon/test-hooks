'use strict';

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
  require('./matchers.js');

  beforeEach(function () {
    browser.addMockModule('biLoggerDecorator', function () {
      angular.module('biLoggerDecorator', []).config(function ($provide) {
        /* global W */
        W.BI.DryRun = true;
        $provide.decorator('biLogger', function ($delegate) {
          ['log', 'error', 'reportOnReady', 'reportRouteChange'].forEach(function (fn) {
            var hooked = $delegate[fn];
            $delegate[fn] = function () {
              hooked.apply($delegate, arguments);
              angular.element('#bi-logger-e2e-container').append('<div bi-log="' + $delegate.getLastBiUrl().url + '" class="bi-log-mock-for-test"/>');
            };
          });

          return $delegate;
        });
      }).run(function () {
        angular.element('body').append(angular.element('<div style="display: none" id="bi-logger-e2e-container"></div>'));
      });
    });
  });

  var biErrors = {
    EMPTY: 'no more bi events!!!',
    NOT_FOUND: 'no bi for evid='
  };

  var remove = function (selector) {
    browser.executeScript(function () {
      $(arguments[0]).remove();
    }, selector);
  };

  var getSrc = function (selector, errorMsg) {
    return $(selector).isPresent().then(function (present) {
      if (present) {
        var src = $(selector).getAttribute('bi-log');
        remove(selector);
        return src.then(function (url) {
          return {url: url};
        });
      } else {
        throw errorMsg;
      }
    });
  };

  var selector = '#bi-logger-e2e-container .bi-log-mock-for-test';

  module.exports = {
    clear: function () {
      remove(selector);
    },
    shift: function () {
      return getSrc(selector + ':first-child', biErrors.EMPTY);
    },
    pop: function () {
      return getSrc(selector + ':last-child', biErrors.EMPTY);
    },
    byEventId: function (evid) {
      return getSrc(selector + '[bi-log*="evid=' + evid + '"]', biErrors.NOT_FOUND + evid);
    },
    assertEmpty: function () {
      $$(selector).count().then(function (count) {
        if (count > 0) {
          throw 'you still have unhandled bi events!!!';
        }
      });
    }
  };
}
