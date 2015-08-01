'use strict';

describe('Service: authBearerTokenHttpInterceptor', function () {
  var $cookies, storage;

  // load the controller's module
  beforeEach(module('auth.bearer-token'));

  // Initialize the service and a mock scope
  beforeEach(inject(function (authBearerTokenStorage, _$cookies_) {
    storage = authBearerTokenStorage;
    $cookies = _$cookies_;
  }));

  it('should be defined', function () {
    expect(storage).toBeDefined();
  });

  it('should act as a setter that returns the stored content', function () {
    expect(storage('Bearer dummy-token-1234')).toBe('Bearer dummy-token-1234');
  });

  it('should act as a getter', function () {
    storage('Bearer dummy-token-5678');
    expect(storage()).toBe('Bearer dummy-token-5678');
  });

  it('should clear the cookie when argument false is provided', function () {
    storage('Bearer dummy-token-5678');
    storage(false);
    expect(storage()).toBeUndefined();
    expect($cookies.bearerToken).toBeUndefined();
  });

});
