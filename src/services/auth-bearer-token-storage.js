'use strict';

angular.module('auth.bearer-token').provider('authBearerTokenStorage', ['authBearerTokenHttpInterceptorProvider',
  function authBearerTokenStorageProvider(authBearerTokenHttpInterceptorProvider) {
    this.$get = ['$cookies', '$log', '$rootScope', 'authBearerTokenEvents', 'authBearerTokenCookieName',
      function($cookies, $log, $rootScope, authBearerTokenEvents, authBearerTokenCookieName) {

        var log = authBearerTokenHttpInterceptorProvider.options.log ?
          $log[authBearerTokenHttpInterceptorProvider.options.log] : function () {};

        return function(newToken) {
          var event, existingCookie;

          if (false === newToken || null === newToken) {
            log('authBearerTokenStorage - removing token from cookie');
            $cookies.remove(authBearerTokenCookieName);
            $rootScope.$broadcast(authBearerTokenEvents.SESSION_END);
            return null;
          }

          if (newToken) {

            event = authBearerTokenEvents.SESSION_UPDATE;

            // if no token exists yet, we're starting the session
            existingCookie = $cookies.get(authBearerTokenCookieName);
            if (!existingCookie) {
              log('authBearerTokenStorage - saving token into cookie');
              event = authBearerTokenEvents.SESSION_START;
            } else {
              log('authBearerTokenStorage - saving updated token into cookie');
            }

            $cookies.put(authBearerTokenCookieName, newToken);
            $rootScope.$broadcast(event);
          }

          return $cookies.get(authBearerTokenCookieName);
        };
      }
    ];
  }
]);