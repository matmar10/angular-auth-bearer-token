'use strict';

angular.module('auth.bearer-token').factory('authBearerTokenStorage', [
  '$cookies',
  '$log',
  '$rootScope',
  'authBearerTokenEvents',
  function ($cookies, $log, $rootScope, authBearerTokenEvents) {
    return function (newToken) {
      var event;

      if (false === newToken || null === newToken) {
        delete $cookies.bearerToken;
        $rootScope.$broadcast(authBearerTokenEvents.SESSION_END);
        return null;
      }

      if (newToken) {
        $log.debug('authBearerTokenStorage - saving new token in cookie');

        event = authBearerTokenEvents.SESSION_UPDATE;

        // if no token exists yet, we're starting the session
        if (!$cookies.bearerToken) {
          event = authBearerTokenEvents.SESSION_START;
        }

        $cookies.bearerToken = newToken;
        $rootScope.$broadcast(event);
      }

      return $cookies.bearerToken;
    };
  }
]);
