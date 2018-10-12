# passport-doximity

[Passport](http://passportjs.org/) strategy for authenticating with [Doximity](https://www.doximity.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Doximity in your Node.js applications.
By plugging into Passport, Doximity authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-doximity

## Usage

#### Create an Application

Before using `passport-doximity`, you must apply to use the Doximity API at
[Doximity Developers](https://www.doximity.com/developers/). An approved application will
be issued a Client ID and secret, which need to be provided to the strategy.
You will also need to configure a redirect URI which matches the route in your
application.

#### Configure Strategy

The Doximity authentication strategy authenticates users using their Doximity
account and OAuth 2.0 tokens.  The Client ID and secret issued to your application 
by Doximity are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
Facebook profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```js
passport.use(new DoximityStrategy({
    clientID: DOXIMITY_CLIENT_ID,
    clientSecret: DOXIMITY_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/doximity/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ doximityId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'doximity'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/doximity',
  passport.authenticate('doximity'));

app.get('/auth/doximity/callback',
  passport.authenticate('doximity', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```
## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2018 Connecting Kids With Care, Inc. <[http://connectingkidswithcare.org/](http://connectingkidswithcare.org/)>
