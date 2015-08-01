'use strict';

angular.module('auth.bearer-token', ['ngCookies']).config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.interceptors.push('authBearerTokenHttpInterceptor');
  }
]);