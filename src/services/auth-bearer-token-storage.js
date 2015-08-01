'use strict';

angular.module('auth.bearer-token').factory('authBearerTokenStorage', [
  '$cookies',
  '$log',
  '$rootScope',
  'authBearerTokenEvents',
  'authBearerTokenCookieName',
  function ($cookies, $log, $rootScope, authBearerTokenEvents, authBearerTokenCookieName) {
    return function (newToken) {
      var event, existingCookie;

      if (false === newToken || null === newToken) {
        $cookies.remove(authBearerTokenCookieName);
        $rootScope.$broadcast(authBearerTokenEvents.SESSION_END);
        return null;
      }

      if (newToken) {
        $log.debug('authBearerTokenStorage - saving new token in cookie');

        event = authBearerTokenEvents.SESSION_UPDATE;

        // if no token exists yet, we're starting the session
        existingCookie = $cookies.get(authBearerTokenCookieName);
        if (!existingCookie) {
          event = authBearerTokenEvents.SESSION_START;
        }

        $cookies.put(authBearerTokenCookieName, newToken);
        $rootScope.$broadcast(event);
      }

      return $cookies.get(authBearerTokenCookieName);
    };
  }
]);
