const jwt = require('jsonwebtoken');

const secret = 'myDog';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJ0aWVyIiwiaWF0IjoxNzAzNjgyMzM0fQ.52TyquE5CASildMnRw6ouleRpAzfT1zqOmgPlRcZWNY';

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
console.log(payload)
