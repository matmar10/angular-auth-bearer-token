'use strict';

angular.module('auth.bearer-token').factory('authBearerTokenStorage', [
  '$cookies',
  '$log',
  function ($cookies, $log) {
    return function (newToken) {

      if (false === newToken || null === newToken) {
        delete $cookies.bearerToken;
        return null;
      }

      if (newToken) {
        $log.debug('authBearerTokenStorage - saving new token in cookie');
        $cookies.bearerToken = newToken;
      }

      return $cookies.bearerToken;
    };
  }
]);