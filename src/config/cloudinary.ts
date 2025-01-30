import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRECT, // Click 'View API Keys' above to copy your API secret
});

export default cloudinary