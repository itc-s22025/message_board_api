import createError from 'http-errors';
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
//
import session from "express-session";
import passport from "passport";
import passportConfig from "./util/auth.js";

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
// const messagesRouter = require('./routes/message');

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import messagesRouter from "./routes/message.js";

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
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));


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
app.use(passportConfig(passport));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
// app.use((err, req, res, next) => {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

const errorHandler = (err, req, res, next) => {
    console.dir(err);
    let message = "Internal server error";
    if (err.status === 401) {
        //ログインに失敗したとき
        message = "ログインしてないよ"
    } else {
        console.error(err);
    }
    res.status(err.status || 500).json({message});
};

app.use(errorHandler)

export default app;
