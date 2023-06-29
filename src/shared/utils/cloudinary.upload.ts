import cloudinary from "cloudinary";

export function uploadImage(file: any): any {
  return new Promise((resolve, reject) => {
    try {
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      )

      file.pipe(uploadStream);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
