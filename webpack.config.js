const screeps = require('./screeps');
const path = require('path');

module.exports = {
  target: 'node',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main'
  },
  plugins: [screeps]
}
