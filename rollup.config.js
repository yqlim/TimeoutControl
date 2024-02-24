import typescript from 'rollup-plugin-typescript2';

module.exports = {
  input: './src/index.ts',
  output: {
    name: 'TimeoutControl',
    file: './dist/index.js',
    format: 'umd',
    banner: '/*!\n * TimeoutControl\n * (c) 2019 Yong Quan Lim\n * Released under MIT License.\n */'
  },
  plugins: [
    typescript()
  ]
}
