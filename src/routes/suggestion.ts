import express from 'express';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import sanitizedConfig from '../config';

import { admin, auth } from '../middleware/auth';
const router = express.Router();
router.use(express.json());

export const postSuggestion = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, message } = req.body;
        try {
            var msg=`User: ${email},
            
            Message: ${message}`;

            await axios.get(`https://api.telegram.org/${sanitizedConfig.TELEGRAM_BOT}/sendMessage?chat_id=512362620&text=`+msg );
            res.status(201).json({status:"ok"});
          } catch (error: any) {
                console.log(error);
              res.status(500).json({ message: 'Internal server error.' });
            }
          }
  );

router.route('/add').post(postSuggestion);

export default router;
