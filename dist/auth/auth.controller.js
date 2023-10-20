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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const auth_guard_1 = require("./auth.guard");
const refreshToken_dto_1 = require("./dto/refreshToken.dto");
const user_decorator_1 = require("../decorators/user.decorator");
const getFavoriteQuery_dto_1 = require("./dto/getFavoriteQuery.dto");
const swagger_1 = require("@nestjs/swagger");
const BadRequestException_filter_1 = require("../ExceptionFilter/BadRequestException.filter");
const platform_express_1 = require("@nestjs/platform-express");
const UpdateProfile_dto_1 = require("./dto/UpdateProfile.dto");
let AuthController = exports.AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    getUsers(req) {
        return this.authService.getProfile(req.user._id);
    }
    getFavorites(user, query) {
        const { page, limit } = query;
        return this.authService.getFavorites(user._id, page, limit);
    }
    register(dto) {
        return this.authService.register(dto);
    }
    login(dto) {
        return this.authService.login(dto);
    }
    logout(user) {
        return this.authService.logout(user._id);
    }
    refreshToken(dto) {
        return this.authService.refreshToken(dto);
    }
    updateProfile(file, data, user) {
        return this.authService.updateProfile(user._id, data, file);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Return user's profile" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getUsers", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return user's list of favorite movies",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseFilters)(BadRequestException_filter_1.BadRequestExceptionFilter),
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('favorites'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, getFavoriteQuery_dto_1.FavoriteQueryDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getFavorites", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return user's registered info",
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict' }),
    (0, common_1.UseFilters)(BadRequestException_filter_1.BadRequestExceptionFilter),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return tokens and user's info",
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseFilters)(BadRequestException_filter_1.BadRequestExceptionFilter),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('logout'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return access token and refresh token',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.UseFilters)(BadRequestException_filter_1.BadRequestExceptionFilter),
    (0, swagger_1.ApiBody)({ type: refreshToken_dto_1.RefreshTokenDto }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('refresh_token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refreshToken_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseFilters)(BadRequestException_filter_1.BadRequestExceptionFilter),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: new RegExp(/(png|jgp|jpeg)/i),
    })
        .build({
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
    }))),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateProfile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map