import axios from 'axios';
import { validationResult } from 'express-validator';

import User from '../models/user';
import Review from '../models/review';

const _errPass = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};

const predict = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.errors[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const sentence = req.body.sentence;
  axios
    .post('http://127.0.0.1:5000/login', {
      username: 'Tom',
      password: 'TOMandhen123',
    })
    .then(response => {
      const modelToken = response.data.access_token;
      axios
        .post(
          'http://127.0.0.1:5000/predict',
          {
            predict: sentence,
          },
          {
            headers: { Authorization: `Bearer ${modelToken}` },
          }
        )
        .then(ans => {
          const userId = req.userId;
          if (userId) {
            let creator;
            const review = new Review({
              sentence,
              result: ans.data.msg,
              creator: userId,
            });
            review
              .save()
              .then(result => {
                console.log(userId);
                return User.findById(userId);
              })
              .then(user => {
                creator = user;
                user.reviews.push(review);
                return user.save();
              })
              .then(result => {
                res.status(201).json({
                  message: 'Review created successfully',
                  review: review,
                  creator: { _id: creator._id, name: creator.name },
                  result: ans.data.msg,
                });
              })
              .catch(err => {
                _errPass(err, next);
              });
          } else {
            res.status(200).json({
              message: 'No user logged in',
              review: null,
              creator: { _id: null, name: 'Guest' },
              result: ans.data.msg,
            });
          }
        })
        .catch(err => _errPass(err, next));
    })
    .catch(err => {
      console.log('here');
      _errPass(err, next);
    });
};

export default {
  predict,
};
