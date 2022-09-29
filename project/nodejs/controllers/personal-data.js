import Review from '../models/review';

const _errPass = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};

const personalData = (req, res, next) => {
  Review.find()
    .then(reviews => {
      const reviewsList = [];
      for (const review of reviews) {
        if (review.creator.toString() === req.userId) {
          reviewsList.push(review);
        }
      }
      res.json({ reviewsList });
    })
    .catch(err => {
      _errPass(err, next);
    });
};

export default {
  personalData,
};
