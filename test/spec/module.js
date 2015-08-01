'use strict';

describe('auth.bearer-token', function () {

  beforeEach(module('auth.bearer-token'));

  describe('config', function () {
    var httpProvider;

    beforeEach(function () {
      module(function($httpProvider) {
        httpProvider = $httpProvider;
      });
    });

    beforeEach(inject());

    it('should register the interceptor', function () {
      expect(httpProvider.interceptors).toContain('authBearerTokenHttpInterceptor');
    });
  });


  describe('behavior of $http with interceptor', function () {
    var $cookies, $http, $httpBackend, storage;

    // Initialize the service and a mock scope
    beforeEach(inject(function ($injector) {
      $cookies = $injector.get('$cookies');
      $http = $injector.get('$http');
      $httpBackend = $injector.get('$httpBackend');
      storage = $injector.get('authBearerTokenStorage');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should store the token from the response and add as a header in the next request', function () {
      $httpBackend.when('POST', '/auth').respond({ message: 'success' }, { 'Authorization': 'Bearer abracadabra' });
      $httpBackend.when('GET', '/user').respond({ name: 'Matthew' }, {});
      $httpBackend.when('PUT', '/user').respond({ name: 'Matthew' }, { 'Authorization': 'Bearer newtoken' });

      $http({
        method: 'POST',
        url: '/auth'
      });
      $httpBackend.flush();
      expect($cookies.bearerToken).toBe('Bearer abracadabra');
      expect(storage()).toBe('Bearer abracadabra');

      $http({
        method: 'GET',
        url: '/user'
      });
      $httpBackend.flush();
      expect($cookies.bearerToken).toBe('Bearer abracadabra');
      expect(storage()).toBe('Bearer abracadabra');

      $http({
        method: 'PUT',
        url: '/user'
      });
      $httpBackend.flush();
      expect($cookies.bearerToken).toBe('Bearer newtoken');
      expect(storage()).toBe('Bearer newtoken');

    });
  });
});
