'use strict';

angular.module('auth.bearer-token').provider('authBearerTokenHttpInterceptor', function authBearerTokenHttpInterceptorProvider () {

  var defaults = {
      header: 'Authorization',
      log: 'debug',
      tokenRegex: /Bearer/
    },
    log = function () {},
    provider = this;

  this.options = angular.copy(defaults);

  this.configure = function (config) {
    this.options = angular.extend(this.options, defaults, config);
  };

  this.$get = [
    'authBearerTokenStorage',
    '$log',
    function(bearerTokenStorage, $log) {

      if (provider.options.log) {
        log = $log[provider.options.log];
      }

      return {
        request: function (request) {
          var token = bearerTokenStorage();

          if (!token) {
            log('authBearerTokenHttpInterceptor::request - no authorization is present in storage (will NOT add to request)');
            return request;
          }

          log('authBearerTokenHttpInterceptor::request - authorization is present in storage (will add to request)');
          request.headers[provider.options.header] = token;
          return request;
        },
        response: function (response) {

          // angular converts headers to lower case
          var token = response.headers(provider.options.header.toLowerCase());

          if (!token) {
            log('authBearerTokenHttpInterceptor::response - no authorization is present in response (will NOT update token in storage)');
            return response;
          }

          if (!token.match(provider.options.tokenRegex)) {
            log('authBearerTokenHttpInterceptor::response - authorization is present in response but is not Bearer token (will NOT update token in storage)');
            return response;
          }

          log('authBearerTokenHttpInterceptor::response - authorization is present present in response (will update storage)');
          bearerTokenStorage(token);
          return response;
        }
      };
    }
  ];
});