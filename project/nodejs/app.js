import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import personalData from './routes/personal-data';
import predictRoutes from './routes/predict';

const app = express();

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/', predictRoutes, personalData);
app.use('*', (req, res, next) => {
  res.status(400).json({ message: "You shouldn't be here" });
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect(
    'mongodb+srv://tomeliya:Tom3779899e@cluster0.luq4g.mongodb.net/messages?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
