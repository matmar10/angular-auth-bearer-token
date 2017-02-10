'use strict';

describe('Service: authBearerTokenHttpInterceptor', function () {
  var $localStorage, storage;

  // load the controller's module
  beforeEach(module('auth.bearer-token'));

  // Initialize the service and a mock scope
  beforeEach(inject(function (authBearerTokenStorage, _$localStorage_) {
    storage = authBearerTokenStorage;
    $localStorage = _$localStorage_;
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
    expect($localStorage.Authorization).toBeUndefined();
  });

  it('should store and purge the cookie', function () {
    storage('Bearer dummy-token-9012');
    expect($localStorage.Authorization).toBe('Bearer dummy-token-9012');
    storage(false);
    expect($localStorage.Authorization).toBeUndefined();
  });

  it('should emit the session start, update, and end events', inject(function ($injector) {
    var starts = [], updates = [], ends = [], events, $rootScope;

    events = $injector.get('authBearerTokenEvents');
    $rootScope = $injector.get('$rootScope');

    $rootScope.$on(events.SESSION_START, function () {
      starts.push(arguments);
    });
    $rootScope.$on(events.SESSION_END, function () {
      ends.push(arguments);
    });
    $rootScope.$on(events.SESSION_UPDATE, function () {
      updates.push(arguments);
    });

    storage('Bearer token-number-1', {
      data: {
        foo: 'bar'
      }
    });
    expect(starts.length).toBe(1);
    expect(starts[0][0].name).toBe('auth:session-start');
    expect(starts[0][1]).toEqual({
      data: {
        foo: 'bar'
      }
    });
    expect(updates.length).toBe(0);
    expect(ends.length).toBe(0);

    storage('Bearer token-number-2', {
      data: {
        other: 'something'
      }
    });
    expect(starts.length).toBe(1);
    expect(updates.length).toBe(1);
    expect(updates[0][0].name).toBe('auth:session-update');
    expect(updates[0][1]).toEqual({
      data: {
        other: 'something'
      }
    });
    expect(ends.length).toBe(0);

    storage('Bearer token-number-3', {
      data: {
        other: 'something else'
      }
    });
    expect(starts.length).toBe(1);
    expect(updates.length).toBe(2);
    expect(updates[1][0].name).toBe('auth:session-update');
    expect(updates[1][1]).toEqual({
      data: {
        other: 'something else'
      }
    });
    expect(ends.length).toBe(0);

    storage(false);
    expect(starts.length).toBe(1);
    expect(updates.length).toBe(2);
    expect(ends.length).toBe(1);

    storage('Bearer token-number-4', {
      data: {
        a: 'b'
      }
    });
    expect(starts.length).toBe(2);
    expect(starts[1][0].name).toBe('auth:session-start');
    expect(starts[1][1]).toEqual({
      data: {
        a: 'b'
      }
    });
    expect(updates.length).toBe(2);
    expect(ends.length).toBe(1);

    storage(false);
    expect(starts.length).toBe(2);
    expect(updates.length).toBe(2);
    expect(ends.length).toBe(2);
  }));

});
