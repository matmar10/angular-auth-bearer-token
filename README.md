# Angular Auth Bearer Token Strategy

[![Build Status](https://travis-ci.org/matmar10/angular-auth-bearer-token.svg?branch=master)](https://travis-ci.org/matmar10/angular-auth-bearer-token)

AKA RFC 6750: https://tools.ietf.org/html/rfc6750

A simple an unobtrusive way to add bearer token authentication strategy to your angular project.

## Installation

Install via Bower:

```
bower install angular-auth-bearer-token --save
```

Require the module in your app:

```
angular.module('yourApp', ['auth.bearer-token']);
```

## How it works

An HTTP interceptor will automatically store the authorization header from
any request with an `Authorization`  header.

Future requests will always include the authorization token.

### Event system

The following events are emitted via `$emit` on `$rootScope`:

* `auth:session-start` - triggered when a token gets stored but no previous token existed
* `auth:session-end` - triggered when the token is cleared
* `auth:session-update` - triggered when a new token is stored

For `auth:session-start` and `auth:session-update`, the HTTP configuration
is passed to the handler:

```
$rootScope.$on('auth:session-start', function (ev, response) {
  // logs the HTTP body returned that triggered the session start event
  $log.debug('The data from session start is:', response.body);
});
```

## Configuration Options

* `header` [default: `Authorization`] - What header should be checked/set for requests
* `log` [default: `debug`] - Log level for logging; set to `false` to disable
* `tokenRegex` [default: `/Bearer/`] - Regular expression to check if returned authorization header is suitable

### Example

#### Disable logging

```
angular.module('myApp').config(function ('authBearerTokenHttpInterceptorProvider') {
  authBearerTokenHttpInterceptorProvider.configure({
    log: false
  });
});
```

#### Customize header and regex

```
angular.module('myApp').config(function ('authBearerTokenHttpInterceptorProvider') {
  authBearerTokenHttpInterceptorProvider.configure({
    // look/set `Auth` header
    header: 'Auth',
    // match anything
    tokenRegex: /[\s\S]*
  });
});
```

## TODO

* Check the RFC to see if we're missing anything here
* What do you need? Let me know!

## Testing

Clone it:

```
git clone https://github.com/matmar10/angular-auth-bearer-token.git
```

Install deps:

```
npm install && bower install
```

Test it:

```
grunt test
```

## Contributing

Please adhere to JSHint code quality standard as specified in .jshintrc

## Releases

* **1.1.0**: Add configuration options and examples in README
* **1.0.2**: Add build status to README
* **1.0.1**: Add travis CI
* **1.0.0**: Upgrade to Angular 1.4 and use new `$cookies` API
* **0.2.1**: Downgrade all log levels to `debug` to allow supression in client apps
* **0.2.0**: Add event system
* **0.1.1**: Add JSHint as default task
* **0.1.0**: Initial release

