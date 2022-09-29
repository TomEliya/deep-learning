import express from 'express';
import { body } from 'express-validator';

import User from '../models/user';
import authController from '../controllers/auth';

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exist.');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Password must contain at least 5 characters.'),
    body('name').trim().not().isEmpty().withMessage('Name cannot be empty.'),
  ],
  authController.signup
);

router.post('/login', authController.login);

export default router;
