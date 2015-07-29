"use strict";

(function() {
    angular.module("wix.common", [ "wix.common.bi" ]).config([ "wixBiLoggerProvider", function(wixBiLoggerProvider) {
        wixBiLoggerProvider.setConfig({
            hostName: "frog.wixpress.com",
            defaultEventArgs: {
                src: 2
            },
            defaultErrorArgs: {
                src: 2
            },
            eventMap: {
                EVENT_NAME: {
                    evid: 3
                }
            },
            errorMap: {
                ERROR_NAME: {
                    errc: 1,
                    errscp: "fine scope",
                    trgt: "fine target",
                    cat: 3,
                    ver: "1.1"
                }
            },
            adapter: "default"
        });
    } ]);
    function MyCtrl(wixBiLogger) {
        this.sendBi = function() {
            wixBiLogger.log({
                evid: 100
            });
            wixBiLogger.log(wixBiLogger.events.EVENT_NAME);
            wixBiLogger.error(wixBiLogger.errors.ERROR_NAME);
        };
    }
    MyCtrl.$inject = [ "wixBiLogger" ];
    angular.module("wix.common").controller("MyCtrl", MyCtrl);
})();