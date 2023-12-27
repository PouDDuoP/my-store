const boom = require('@hapi/boom');
const { config } = require('../config/config');

function checkApiKey(req, res, next) {
  const apiKey = req.headers['api'];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
}

function checkAdminProfile(req, res, next) {
  console.log("checkAdminProfile:", req.user);
  const user = req.user;
  if (user.profile === 'admin') {
    next();
  } else {
    next(boom.unauthorized());
  }
}

function checkProfile(...profiles) {
  return (req, res, next) => {
    console.log("checkProfile:", req.user, profiles.includes(req.user.profile), profiles);
    const user = req.user;
    if (profiles.includes(user.profile)) {
      next();
    } else {
      next(boom.unauthorized());
    }
  }
}


module.exports = { checkApiKey, checkAdminProfile, checkProfile }
