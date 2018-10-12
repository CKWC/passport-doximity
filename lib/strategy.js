// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , uri = require('url')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Doximity authentication strategy authenticates requests by delegating to
 * Doximity using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Doximity Client ID
 *   - `clientSecret`  your Doximity Client Secret
 *   - `callbackURL`   URL to which Doximity will redirect the user after granting authorization
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://auth.doximity.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://auth.doximity.com/oauth/token';
  options.scope = options.scope || ['basic', 'email'];
  options.scopeSeparator = options.scopeSeparator || ' ';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'doximity';
  this._profileURL = options.profileURL || 'https://www.doximity.com/api/v1/users/current';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

/**
 * Return extra Doximity-specific parameters to be included in the authorization
 * request.
 *
 * Options:
 *  - `type`  Controls which landing page is presented to the user, { `verify` or `login` }.
 *
 * @param {object} options
 * @return {object}
 * @access protected
 */
Strategy.prototype.authorizationParams = function (options) {
  var params = {};

  if (options.type) {
    params.type = options.type;
  }
  
  return params;
};

/**
 * Retrieve user profile from Doximity.
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {

  var url = uri.parse(this._profileURL);
  this._oauth2.get(url, accessToken, function (err, body, res) {
    
    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    var json;
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile = Profile.parse(json);
    profile.provider = 'doximity';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};

// Expose constructor.
module.exports = Strategy;
