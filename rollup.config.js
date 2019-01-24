const babel = require('rollup-plugin-babel');

module.exports = {
  input: './src/index.js',
  output: {
    name: 'TimeoutControl',
    file: './lib/timeoutcontrol.js',
    format: 'umd',
    banner: '/*!\n * TimeoutControl\n * (c) 2019 Yong Quan Lim\n * Released under MIT License.\n */'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
