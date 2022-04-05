const path = require('path');
const webpack = require('webpack');

// create the main config object
module.exports ={
  // create entry property: root of the bunle and the beginning of the dependency graph (the relative path to the client's code)
  entry: './assets/js/script.js',
  // bundle the code from the entry point that we provided and output it to a folder that we specify
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  // include webpack
  plugins:[
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
  ],  
  // provide the mode in which we want webpack to run 
  mode: 'development'
};