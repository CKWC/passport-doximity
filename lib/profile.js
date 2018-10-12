/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};
  profile.id = json.id;
  profile.username = json.email;
  profile.displayName = json.full_name;
  profile.name = json.full_name;
  profile.gender = json.gender;
  
  if (json.email) {
    profile.emails = [{ value: json.email }];
  }

  if (json.profile_photo) {
    profile.photos = [{ value: json.profile_photo }];
  }

  return profile;
};
