const isLogin = (req, res, next) => {
  console.log('the user is is Login');
  next();
};

module.exports = isLogin;
