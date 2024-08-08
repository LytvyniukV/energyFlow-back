import { CLOUDINARY } from '../constants/index.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloud } from 'cloudinary';
import multer from 'multer';

cloud.config({
  secure: true,
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloud,
  params: async (req, file) => {
    const { _id } = req.user;
    const originalnameWithoutType = file.originalname.replace(
      /\.(jpe?g|png)$/i,
      '',
    );

    let fileName = originalnameWithoutType;
    let folder;

    if (file.fieldname === 'avatar') {
      folder = 'avatars';
      fileName = `${_id}_${originalnameWithoutType}`;
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg'],
      public_id: fileName,
    };
  },
});

export const upload = multer({ storage });
