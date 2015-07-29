'use strict';

beforeEach(function () {

  function getDomainFromUrl(url) {
    var index = url.indexOf('?');
    return url.slice(0, index === -1 ? url.length : index);
  }

  this.addMatchers({
    toMatchBiAdapter: function (expectedUrl) {
      return getDomainFromUrl(this.actual.url) === getDomainFromUrl(expectedUrl);
    },
    toMatchBiUrl: function (expectedUrl) {
      //remove msid and metaSiteId when solving CE-2337
      var ignoredKeys = ['_', 'ts', 'msid', 'metaSiteId', 'cat', 'sev', 'iss', 'ver'];

      function getUrlParams(url) {
        if (url.jasmineMatches) {
          return url;
        } else if (typeof url !== 'string') {
          Object.keys(url).forEach(function (key) {
            if (url[key] instanceof RegExp) {
              var regexp = url[key];
              url[key] = {
                jasmineMatches: function (value) {
                  return regexp.test(value);
                }
              };
            } else if (!url[key] || !url[key].jasmineMatches) {
              url[key] = url[key] + '';
            }
          });
          return url;
        }

        var params = {};
        var paramsString = url.slice(url.indexOf('?'));

        paramsString.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
          params[key] = decodeURIComponent(value);
        });

        return params;
      }

      var actualUrlParams = getUrlParams(this.actual.url);
      var expectedUrlParams = getUrlParams(expectedUrl);

      if (typeof expectedUrl === 'string' &&
        getDomainFromUrl(this.actual.url) !== getDomainFromUrl(expectedUrl)) {
        return false;
      }

      ignoredKeys.forEach(function (key) {
        if (actualUrlParams.hasOwnProperty(key)) {
          expectedUrlParams[key] = expectedUrlParams[key] || jasmine.any(String);
        }
      });

      // this.actual = actualUrlParams;
      if (expectedUrlParams.jasmineMatches) {
        return expectedUrlParams.jasmineMatches(actualUrlParams);
      } else {
        return jasmine.objectContaining(expectedUrlParams).jasmineMatches(actualUrlParams) &&
               Object.keys(expectedUrlParams).length === Object.keys(actualUrlParams).length;
      }
    }
  });
});
