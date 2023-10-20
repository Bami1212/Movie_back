"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary = require("cloudinary");
let CloudinaryService = exports.CloudinaryService = class CloudinaryService {
    constructor(config) {
        cloudinary.v2.config({
            cloud_name: 'dfx12wket',
            api_key: '592754252158455',
            api_secret: '_BKkrJB0-4edOhFvQLt1HJTLoFk'
        });
    }
    uploadImage(file) {
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
    deleteImage(publicId) {
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(publicId, (error, result) => {
                if (error)
                    return reject(error);
                return resolve(result);
            });
        });
    }
};
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map