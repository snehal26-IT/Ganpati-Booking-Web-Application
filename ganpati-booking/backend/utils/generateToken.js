const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'super_secret_ganpati_key_2025';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d'
  });
};

module.exports = generateToken;
