const createError = require('http-errors');
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
const messagesRouter = require('./routes/message');

const app = express();
//cors
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
        sameSite: "None",
    }
));

//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//axios bypass
// app.use('/axios', express.static(path.join(
//     __dirname, "node_modules", "axios", "dist"
// )));

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
app.use('/messages', messagesRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
