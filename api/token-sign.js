const jwt = require('jsonwebtoken');

const secret = 'myDog';
const payload = {
  sub: 1,
  role: 'tier'
}

function signToken(payload, secret) {
  return jwt.sign(payload, secret);
}

const token = signToken(payload, secret);
console.log(token)
