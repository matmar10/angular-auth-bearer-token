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

  it('should store and purge the cookie', function () {
    storage('Bearer dummy-token-9012');
    expect($cookies.get('Authorization')).toBe('Bearer dummy-token-9012');
    storage(false);
    expect($cookies.get('Authorization')).toBeUndefined();
  });

  it('should emit the session start, update, and end events', inject(function ($injector) {
    var starts = 0, updates = 0, ends = 0, events, $rootScope;

    events = $injector.get('authBearerTokenEvents');
    $rootScope = $injector.get('$rootScope');

    $rootScope.$on(events.SESSION_START, function () {
      starts++;
    });
    $rootScope.$on(events.SESSION_END, function () {
      ends++;
    });
    $rootScope.$on(events.SESSION_UPDATE, function () {
      updates++;
    });

    storage('Bearer token-number-1');
    expect(starts).toBe(1);
    expect(updates).toBe(0);
    expect(ends).toBe(0);

    storage('Bearer token-number-2');
    expect(starts).toBe(1);
    expect(updates).toBe(1);
    expect(ends).toBe(0);

    storage('Bearer token-number-3');
    expect(starts).toBe(1);
    expect(updates).toBe(2);
    expect(ends).toBe(0);

    storage(false);
    expect(starts).toBe(1);
    expect(updates).toBe(2);
    expect(ends).toBe(1);

    storage('Bearer token-number-4');
    expect(starts).toBe(2);
    expect(updates).toBe(2);
    expect(ends).toBe(1);

    storage(false);
    expect(starts).toBe(2);
    expect(updates).toBe(2);
    expect(ends).toBe(2);
  }));

});
