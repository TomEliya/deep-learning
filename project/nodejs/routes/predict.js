import express from 'express';
import { body } from 'express-validator';

import predictController from '../controllers/predict';
import auth from '../middleware/is-auth';

const router = express.Router();

router.post(
  '/',
  auth.isAuthToSaveSentence,
  [
    body('sentence')
      .not()
      .isEmpty()
      .withMessage('Review cannot be empty.')
      .bail()
      .escape(),
  ],
  predictController.predict
);

export default router;
