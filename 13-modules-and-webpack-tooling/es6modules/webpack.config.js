module.exports = {
  mode: process.env.NODE_ENV || 'production',
  devtool: 'source-map',
  entry: {
    filename: './app.js'
  },
  output: {
    filename: 'bundle.js',
  },
};