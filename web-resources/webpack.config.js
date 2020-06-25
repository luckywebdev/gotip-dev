require('@babel/register')

module.exports = env => {
  console.log(`Starting transpile for ${ env.target ? env.target : 'default' }`)
  switch (env.target) {
    default:
      return require('./webpackdev');
      break;
  } 
}