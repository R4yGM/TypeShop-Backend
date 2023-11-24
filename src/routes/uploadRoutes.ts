import express from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Importa la libreria uuid
import * as admin from 'firebase-admin';
const storageBucketUrl = "rep-project-1337.appspot.com"
import sanitizedConfig from '../config';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: sanitizedConfig.FIREBASE_projectId,
    clientEmail: sanitizedConfig.FIREBASE_clientEmail,
    privateKey: sanitizedConfig.FIREBASE_privateKey,
  }),
  storageBucket: storageBucketUrl.replace(/^gs:\/\//g, ''), // remove gs:// at the beginning of the url
});

const router = express.Router();

const storage = multer.memoryStorage();
const uploadImg = multer({ storage });


function checkFileType(file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const uploadImage = async (destination: string, image: Buffer, ContentType: string) => {
  const file = admin.storage().bucket().file(destination);
  await file.save(image, { contentType: ContentType });
  console.log(file.publicUrl())
  return file.publicUrl();
};
gs://rep-project-1337.appspot.com/a97d24af-4891-4b3a-9f2a-43447ca4f09d-1696942897314-353px-Database-icon.png
// @desc    upload image
// @route   Post /api/image
// @access  Private
router.post('/image', uploadImg.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    var fileId = uuidv4();
    const objectKey = `${fileId}-${Date.now()}-${req.file.originalname}`;

    const imageBuffer = req.file.buffer;


    var resp = await uploadImage(objectKey,imageBuffer,req.file.mimetype)
    .then(() => console.log(`'${objectKey}' uploaded successfully`))
    .catch(err => console.error(`failed to upload '${objectKey}'`, err));
    console.log(resp)
    res.status(200).json({ url: `https://firebasestorage.googleapis.com/v0/b/rep-project-1337.appspot.com/o/${objectKey}?alt=media` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;
