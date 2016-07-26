'use strict';

angular.module('auth.bearer-token').provider('authBearerTokenStorage', ['authBearerTokenHttpInterceptorProvider',
  function authBearerTokenStorageProvider(authBearerTokenHttpInterceptorProvider) {
    this.$get = ['$cookies', '$log', '$rootScope', 'authBearerTokenEvents', 'authBearerTokenCookieName',
      function($cookies, $log, $rootScope, authBearerTokenEvents, authBearerTokenCookieName) {

        var log = authBearerTokenHttpInterceptorProvider.options.log ?
          $log[authBearerTokenHttpInterceptorProvider.options.log] : function () {};

        /**
         * Get or set the auth token to be included in
         * @param  {string|false|null} newToken     - New token or false/null to clear the token
         * @param  {object}            authResponse - The HTTP Response; used by the interceptor
         * @return {object}                         - The current token
         */
        return function(newToken, authResponse) {
          var existingCookie;

          if (false === newToken || null === newToken) {
            log('authBearerTokenStorage - removing token from cookie');
            $cookies.remove(authBearerTokenCookieName);
            $rootScope.$broadcast(authBearerTokenEvents.SESSION_END);
            return null;
          }

          if (newToken) {

            existingCookie = $cookies.get(authBearerTokenCookieName);
            if (!existingCookie) {
              // if no token exists yet, we're starting the session
              log('authBearerTokenStorage - saving token into cookie');
              $cookies.put(authBearerTokenCookieName, newToken);
              $rootScope.$broadcast(authBearerTokenEvents.SESSION_START, authResponse);
            } else if (newToken !== existingCookie) {
              // if token exists but it has changed, we're updating the session
              log('authBearerTokenStorage - saving updated token into cookie');
              $cookies.put(authBearerTokenCookieName, newToken);
              $rootScope.$broadcast(authBearerTokenEvents.SESSION_UPDATE, authResponse);
            } else {
              // if token is the same, no session event has occurred
              log('authBearerTokenStorage - token matches existing; no event triggered');
              $cookies.put(authBearerTokenCookieName, newToken);
            }
          }

          return $cookies.get(authBearerTokenCookieName);
        };
      }
    ];
  }
]);