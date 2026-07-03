import createError from 'http-errors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import 'dotenv/config.js';

import indexRouter from './routes/index.js';
import { ShortenerRouter } from './modules/shortener/index.js';
import ErrorMiddleware from './shared/middleware/ErrorMiddleware.js';
import { UserRoute } from './modules/user/index.js';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
var app = express();


app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://url-shortener-app-nu.vercel.app'
  ],
  credentials: true,
  
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/health", (req, res, next) => {
  return res.json({
    status: 'Ok!'
  })
})
app.use("/", ShortenerRouter);
app.use("/user", UserRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(ErrorMiddleware);

export default app;
