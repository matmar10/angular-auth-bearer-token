'use strict';

angular.module('auth.bearer-token', ['ngStorage'])
  .config([
    '$httpProvider',
    function ($httpProvider) {
      $httpProvider.interceptors.push('authBearerTokenHttpInterceptor');
    }
  ])
  .constant('authBearerTokenCookieName', 'Authorization')
  .constant('authBearerTokenEvents', {
    SESSION_START: 'auth:session-start',
    SESSION_END: 'auth:session-end',
    SESSION_UPDATE: 'auth:session-update'
  });