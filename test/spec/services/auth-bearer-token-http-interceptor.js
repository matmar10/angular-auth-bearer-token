'use strict';

describe('Service: authBearerTokenHttpInterceptor', function () {
  var interceptor, storage;

  // load the controller's module
  beforeEach(module('auth.bearer-token'));

  // Initialize the service and a mock scope
  beforeEach(inject(function (authBearerTokenHttpInterceptor, authBearerTokenStorage) {
    interceptor = authBearerTokenHttpInterceptor;
    storage = authBearerTokenStorage;
    // clear storage before each pass
    storage(false);
  }));

  it('is defined', function () {
    expect(interceptor).toBeDefined();
  });

  it('adds the token header if one is in storage', function () {
    storage('Bearer dummy-token-1234');
    expect(interceptor.request({ headers: {} }).headers.Authorization).toBe('Bearer dummy-token-1234');
  });

  it('adds the token header after it has been cleared from storage', function () {
    storage('Bearer dummy-token-5678');
    storage(false);
    expect(interceptor.request({ headers: {} }).headers.Authorization).toBeUndefined();
  });

  it('stores the token if one is in the response', function () {
    interceptor.response({ headers: function () {
      return 'Bearer dummy-token-9012';
    }});
    expect(storage()).toBe('Bearer dummy-token-9012');
  });

  it('stors nothing if no new token is in the response', function () {
    storage('Bearer dummy-token-3456');
    interceptor.response({ headers: function () {
      return false;
    }});
    expect(storage()).toBe('Bearer dummy-token-3456');
  });

  it('ignores non-Bearer tokens', function () {
    interceptor.response({ headers: function () {
      return 'foobar';
    }});
    expect(storage()).toBeUndefined();
  });

});