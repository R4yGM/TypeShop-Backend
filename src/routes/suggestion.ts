import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import sanitizedConfig from '../config';
import multer from 'multer';

const router = express.Router();

// Set up multer storage and file filter
const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only images are allowed!'));
    }
  },
});

router.use(upload.single('image'));

export const postSuggestion = asyncHandler(
  async (req: Request & { file?: Express.Multer.File }, res: Response) => {
    const { email, message } = req.body;

    if (!req.file) {
      const textMessage = `User: ${email}, Message: ${message}`;

      await Promise.all([
        axios.get(`https://api.telegram.org/${sanitizedConfig.TELEGRAM_BOT}/sendMessage?chat_id=512362620&text=${textMessage}`, {
        }),
        axios.post(`https://api.telegram.org/${sanitizedConfig.TELEGRAM_BOT}/sendMessage?chat_id=5554575228&text=${textMessage}`, {
        }),
      ]);
      res.status(201).json({ status: 'ok' });

      return;
    }

    const imageBuffer = req.file.buffer; // Access the file buffer from multer
    console.log(email);
    console.log(message);
    try {
      // Upload the image to Imgur
      
      const imgurResponse = await axios.post('https://api.imgur.com/3/image', imageBuffer, {
        headers: {
          Authorization: 'Client-ID aca6d2502f5bfd8',
        },
      });

      // Get the Imgur image URL
      const imgurUrl = imgurResponse.data.data.link;
  
      const textMessage = `User: ${email}, Message: ${message}`;

      // Send the text message and image to both chat_ids
      await Promise.all([
        axios.post(`https://api.telegram.org/${sanitizedConfig.TELEGRAM_BOT}/sendPhoto`, {
          chat_id: '512362620',
          photo: imgurUrl,
          caption: textMessage,
        }),
        axios.post(`https://api.telegram.org/${sanitizedConfig.TELEGRAM_BOT}/sendPhoto`, {
          chat_id: '5554575228',
          photo: imgurUrl,
          caption: textMessage,
        }),
      ]);

      res.status(201).json({ status: 'ok' });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

router.route('/add').post(postSuggestion);

export default router;
