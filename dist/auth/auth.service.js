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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const favorite_schema_1 = require("../schemas/favorite.schema");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let AuthService = exports.AuthService = class AuthService {
    constructor(userModel, favoriteModel, jwtService, config, cloudinaryService) {
        this.userModel = userModel;
        this.favoriteModel = favoriteModel;
        this.jwtService = jwtService;
        this.config = config;
        this.cloudinaryService = cloudinaryService;
    }
    async register(data) {
        try {
            const existUser = await this.userModel.findOne({ email: data.email });
            if (existUser)
                throw new common_1.ConflictException('email exist!');
            const hash = bcrypt.hashSync(data.password, 10);
            const user = await this.userModel.create({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: hash,
                avatar_url: this.generateAvatarUrl(`${data.first_name} ${data.last_name}`),
            });
            const tokens = await this.generateToken({
                _id: user._id.toString(),
                email: user.email,
            });
            user.refresh_token = tokens.refresh_token;
            await user.save();
            user.password = undefined;
            return { ...user.toObject(), ...tokens };
        }
        catch (error) {
            throw error;
        }
    }
    async login(data) {
        try {
            const user = await this.userModel.findOne({ email: data.email });
            if (!user)
                throw new common_1.UnauthorizedException('email or password invalid');
            const checkPassword = bcrypt.compareSync(data.password, user.password);
            if (!checkPassword)
                throw new common_1.UnauthorizedException('email or password invalid');
            const payload = { _id: user._id.toString(), email: user.email };
            const tokens = await this.generateToken(payload);
            user.refresh_token = tokens.refresh_token;
            await user.save();
            return {
                ...user.toObject(),
                password: undefined,
                ...tokens,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async logout(userId) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user)
                throw new common_1.UnauthorizedException();
            user.refresh_token = null;
            await user.save();
            return {
                message: 'Successfully logged out',
                statusCode: 200,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getProfile(_id) {
        try {
            const user = await this.userModel.findById(_id);
            return {
                ...user.toObject(),
                refresh_token: undefined,
                password: undefined,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async refreshToken(data) {
        try {
            const payload = await this.jwtService.verifyAsync(data.refresh_token, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.userModel.findById(payload._id);
            if (data.refresh_token !== user.refresh_token) {
                throw new common_1.UnauthorizedException();
            }
            const tokens = await this.generateToken({
                _id: payload._id,
                email: payload.email,
            });
            return tokens;
        }
        catch (error) {
            throw error;
        }
    }
    async getFavorites(userId, page, limit) {
        const startIndex = (page - 1) * limit;
        try {
            const totalCountPromise = this.favoriteModel.count({ userId });
            const favoriteMoviesPromise = this.favoriteModel
                .find({ userId })
                .skip(startIndex)
                .limit(limit)
                .sort('createdAt');
            const [favoriteMovies, totalCount] = await Promise.all([
                favoriteMoviesPromise,
                totalCountPromise,
            ]);
            const prev_page = page <= 1 ? null : page - 1;
            const next_page = page * limit >= totalCount ? null : page + 1;
            return {
                totalDoc: totalCount,
                page,
                limit,
                docs: favoriteMovies,
                prev_page,
                next_page,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async updateProfile(userId, data, avatar) {
        try {
            const user = await this.userModel.findById(userId);
            console.log(user.toJSON());
            if (avatar) {
                if (user.avatar_url.includes('res.cloudinary.com')) {
                    const arrSplit = user.avatar_url.split('/');
                    const file = arrSplit[arrSplit.length - 1];
                    const [fileName, type] = file.split('.');
                    this.cloudinaryService.deleteImage(fileName);
                }
                const result = await this.cloudinaryService.uploadImage(avatar);
                user.avatar_url = result.url;
            }
            if (data.first_name && data.last_name) {
                user.first_name = data.first_name;
                user.last_name = data.last_name;
            }
            if (data.old_password && data.new_password) {
                const isValidPw = bcrypt.compareSync(data.old_password, user.password);
                if (!isValidPw)
                    throw new common_1.UnauthorizedException('Password invalid');
                user.password = bcrypt.hashSync(data.new_password, 10);
            }
            await user.save();
            return {
                ...user.toObject(),
                password: undefined,
                refresh_token: undefined,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Internal Server Error');
        }
    }
    async generateToken(payload) {
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: '100d',
            }),
        ]);
        return {
            access_token,
            refresh_token,
        };
    }
    generateAvatarUrl(name) {
        return 'https://ui-avatars.com/api/?background=random&name=' + name;
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(favorite_schema_1.Favorite.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService,
        cloudinary_service_1.CloudinaryService])
], AuthService);
//# sourceMappingURL=auth.service.js.map