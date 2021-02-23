const express = require('express');

const app = express();

const isLogin = (req, res, next) => {
  console.log('the user is is Login');
  next();
};

app.use(isLogin);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
