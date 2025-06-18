const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get token from command line argument
const token = process.argv[2];

if (!token) {
  console.log('Please provide a token as an argument');
  console.log('Usage: node scripts/testToken.js <your-token>');
  process.exit(1);
}

console.log('Testing JWT token...');
console.log('Token:', token.substring(0, 20) + '...');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✅ Token is valid!');
  console.log('Decoded payload:', decoded);
} catch (error) {
  console.log('❌ Token verification failed:');
  console.log('Error:', error.message);
  
  if (error.name === 'JsonWebTokenError') {
    console.log('This usually means the JWT_SECRET is wrong or the token is malformed');
  } else if (error.name === 'TokenExpiredError') {
    console.log('The token has expired');
  }
} 