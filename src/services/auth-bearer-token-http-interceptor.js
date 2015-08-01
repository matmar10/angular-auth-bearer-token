'use strict';

angular.module('auth.bearer-token').factory('authBearerTokenHttpInterceptor', [
  'authBearerTokenStorage',
  '$log',
  function (bearerTokenStorage, $log) {
    return {
      request: function (request) {
        var token = bearerTokenStorage();

        if (!token) {
          $log.debug('authBearerTokenHttpInterceptor::request - no authorization is present in storage (will NOT add to request)');
          return request;
        }

        $log.debug('authBearerTokenHttpInterceptor::request - authorization is present in storage (will add to request)');
        request.headers.Authorization = token;
        return request;
      },
      response: function (response) {
        // angular converts headers to lower case
        var token = response.headers('authorization');

        if (!token) {
          $log.debug('authBearerTokenHttpInterceptor::response - no authorization is present in response (will NOT update token in storage)');
          return response;
        }

        if (!token.match(/Bearer/)) {
          $log.debug('authBearerTokenHttpInterceptor::response - authorization is present in response but is not Bearer token (will NOT update token in storage)');
          return response;
        }

        $log.debug('authBearerTokenHttpInterceptor::response - authorization is present present in response (will update storage)');
        bearerTokenStorage(token);
        return response;
      }
    };
  }
]);