const screeps = require('./screeps');
const path = require('path');

export default {
  target: 'node',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main'
  },
  plugins: [screeps]
}
