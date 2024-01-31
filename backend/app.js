const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {config} = require('./util/auth')
const cors = require('cors');
//
const session = require('express-session');
const passport = require('passport');
const passportConfig = config(passport);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

const app = express();
//cors
app.use(cors());

//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//axios bypass
app.use('/axios', express.static(path.join(
    __dirname, "node_modules", "axios", "dist"
)));

//テストデータ
app.get("/test", (req, res, next) => {
    res.json({test: "テストメッセージ"});
});


//sessionの設定
app.use(session({
    secret: "1ZGpEhHGzcFqZrCC+rmunS7GVxf6xmSyXDZIXgEu28qtwq7P",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60 * 60 * 1000}
}))
//passport
app.use(passport.authenticate("session"));
//importしたauth.js
app.use(passportConfig);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

module.exports = app;
