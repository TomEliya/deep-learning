import express from 'express';
import { body } from 'express-validator';

import personalDataController from '../controllers/personal-data';
import auth from '../middleware/is-auth';

const router = express.Router();

router.post('/personal-data', auth.isAuth, personalDataController.personalData);

export default router;
