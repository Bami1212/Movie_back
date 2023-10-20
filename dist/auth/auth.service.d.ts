/// <reference types="multer" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { Favorite } from 'src/schemas/favorite.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/UpdateProfile.dto';
export declare class AuthService {
    private readonly userModel;
    private readonly favoriteModel;
    private readonly jwtService;
    private readonly config;
    private readonly cloudinaryService;
    constructor(userModel: Model<User>, favoriteModel: Model<Favorite>, jwtService: JwtService, config: ConfigService, cloudinaryService: CloudinaryService);
    register(data: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        avatar_url: string;
        createdAt?: Date;
        updatedAt?: Date;
        _id: import("mongoose").Types.ObjectId;
    }>;
    login(data: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        password: any;
        email: string;
        first_name: string;
        last_name: string;
        avatar_url: string;
        createdAt?: Date;
        updatedAt?: Date;
        _id: import("mongoose").Types.ObjectId;
    }>;
    logout(userId: string): Promise<{
        message: string;
        statusCode: number;
    }>;
    getProfile(_id: string): Promise<{
        refresh_token: any;
        password: any;
        email: string;
        first_name: string;
        last_name: string;
        avatar_url: string;
        createdAt?: Date;
        updatedAt?: Date;
        _id: import("mongoose").Types.ObjectId;
    }>;
    refreshToken(data: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getFavorites(userId: string, page: number, limit: number): Promise<{
        totalDoc: number;
        page: number;
        limit: number;
        docs: (import("mongoose").Document<unknown, {}, Favorite> & Favorite & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        prev_page: number;
        next_page: number;
    }>;
    updateProfile(userId: string, data: UpdateProfileDto, avatar?: Express.Multer.File): Promise<{
        password: any;
        refresh_token: any;
        email: string;
        first_name: string;
        last_name: string;
        avatar_url: string;
        createdAt?: Date;
        updatedAt?: Date;
        _id: import("mongoose").Types.ObjectId;
    }>;
    private generateToken;
    private generateAvatarUrl;
}
