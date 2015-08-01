# Angular Auth Bearer Token Strategy

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

## TODO

* Only store authorization if header matches `Bearer`
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



