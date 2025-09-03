import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    cloudinary.config({
      cloud_name: 'dtrgwsenn',
      api_key: '155746649162217',
      api_secret: 'yFGFS8olLBY4DzaaJm9dL42qH1o',
    });

    return cloudinary;
  },
};
