'use strict';

describe('Provider: authBearerTokenHttpInterceptorProvider', function () {

  var fakeModule, provider;

  // @see http://stackoverflow.com/questions/14771810/how-to-test-angularjs-custom-provider
  beforeEach(function () {

    // Initialize the service provider by injecting it to a fake module's config block
    fakeModule = angular.module('testApp', []);
    fakeModule.config(function (authBearerTokenHttpInterceptorProvider) {
      provider = authBearerTokenHttpInterceptorProvider;
    });

    module('auth.bearer-token', 'testApp');

    // Kickstart the injectors previously registered with calls to angular.mock.module
    inject(function () {});
  });

  it('configures header', function () {
      provider.configure({
        header: 'Foo'
      });
      expect(provider.options.header).toBe('Foo');
      expect(provider.options.log).toBe('debug');
      expect(provider.options.tokenRegex).toEqual(/Bearer/);
  });

  it('configures log', function () {
      provider.configure({
        log: false
      });
      expect(provider.options.header).toBe('Authorization');
      expect(provider.options.log).toBe(false);
      expect(provider.options.tokenRegex).toEqual(/Bearer/);
  });

  it('configures tokenRegex', function () {
      provider.configure({
        tokenRegex: /qc/i
      });
      expect(provider.options.header).toBe('Authorization');
      expect(provider.options.log).toBe('debug');
      expect(provider.options.tokenRegex).toEqual(/qc/i);
  });
});

describe('Provider: authBearerTokenHttpInterceptorProvider', function () {

  var fakeModule, provider;

  describe('authBearerTokenHttpInterceptor', function () {

    var provider;

    // @see http://stackoverflow.com/questions/14771810/how-to-test-angularjs-custom-provider
    beforeEach(function () {

      // Initialize the service provider by injecting it to a fake module's config block
      fakeModule = angular.module('testApp', []);
      fakeModule.config(function (authBearerTokenHttpInterceptorProvider) {
        provider = authBearerTokenHttpInterceptorProvider;
      });

      module('auth.bearer-token', 'testApp');

      // Kickstart the injectors previously registered with calls to angular.mock.module
      inject(function () {});

    });

    it('respects configured `log` option', function () {

      provider.configure({
        header: 'QC'
      });

      inject(function(authBearerTokenHttpInterceptor, authBearerTokenStorage) {

        it('stores the token if one is in the response', function () {
          authBearerTokenHttpInterceptor.response({ headers: function (header) {
            expect(header).toBe('qc');
            return 'Bearer dummy-token-9012';
          }});
          expect(authBearerTokenStorage()).toBe('Bearer dummy-token-9012');
        });

      });
    });

    it('respects configured `header` option', function (done) {

      provider.configure({
        header: 'QC'
      });

      inject(function($log, authBearerTokenHttpInterceptor, authBearerTokenStorage) {
        authBearerTokenHttpInterceptor.response({
          headers: function (header) {
            expect(header).toBe('qc');
            return 'Bearer dummy-token-9012';
          }
        });
        expect(authBearerTokenStorage()).toBe('Bearer dummy-token-9012');
        done();
      });
    });

    it('respects configured `regex` option', function (done) {

      provider.configure({
        tokenRegex: /Foo/
      });

      inject(function($log, authBearerTokenHttpInterceptor, authBearerTokenStorage) {
        authBearerTokenHttpInterceptor.response({
          headers: function () {
            return 'Bearer dummy-token-1234';
          }
        });
        expect(authBearerTokenStorage()).toBeUndefined;
        done();
      });
    });

  });
});

