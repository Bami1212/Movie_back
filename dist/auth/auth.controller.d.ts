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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { FavoriteQueryDto } from './dto/getFavoriteQuery.dto';
import { AuthData } from 'src/express';
import { UpdateProfileDto } from './dto/UpdateProfile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getUsers(req: Request): Promise<{
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
    getFavorites(user: {
        _id: string;
        email: string;
    }, query: FavoriteQueryDto): Promise<{
        totalDoc: number;
        page: number;
        limit: number;
        docs: (import("mongoose").Document<unknown, {}, import("../schemas/favorite.schema").Favorite> & import("../schemas/favorite.schema").Favorite & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        prev_page: number;
        next_page: number;
    }>;
    register(dto: RegisterDto): Promise<{
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
    login(dto: LoginDto): Promise<{
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
    logout(user: AuthData): Promise<{
        message: string;
        statusCode: number;
    }>;
    refreshToken(dto: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    updateProfile(file: Express.Multer.File, data: UpdateProfileDto, user: AuthData): Promise<{
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
}
