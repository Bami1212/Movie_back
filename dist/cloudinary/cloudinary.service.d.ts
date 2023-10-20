/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    constructor(config: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<UploadApiResponse>;
    deleteImage(publicId: string): Promise<unknown>;
}
