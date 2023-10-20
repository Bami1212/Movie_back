import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(config: ConfigService) {
    // cloudinary.v2.config({
    //   secure: true,
    //   cloud_name: config.getOrThrow('dfx12wket'),
    //   api_key: config.getOrThrow('592754252158455'),
    //   api_secret: config.getOrThrow('_BKkrJB0-4edOhFvQLt1HJTLoFk'),
    // });
    cloudinary.v2.config({ 
      cloud_name: 'dfx12wket', 
      api_key: '592754252158455', 
      api_secret: '_BKkrJB0-4edOhFvQLt1HJTLoFk' 
    });
  }

  uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({}, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        })
        .end(file.buffer);
    });
  }

  deleteImage(publicId: string) {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }
}
