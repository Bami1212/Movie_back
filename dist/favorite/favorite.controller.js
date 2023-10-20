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
exports.FavoriteController = void 0;
const common_1 = require("@nestjs/common");
const favorite_service_1 = require("./favorite.service");
const auth_guard_1 = require("../auth/auth.guard");
const user_decorator_1 = require("../decorators/user.decorator");
const Favorite_dto_1 = require("./dto/Favorite.dto");
const swagger_1 = require("@nestjs/swagger");
const BadRequestException_filter_1 = require("../ExceptionFilter/BadRequestException.filter");
let FavoriteController = exports.FavoriteController = class FavoriteController {
    constructor(favoriteService) {
        this.favoriteService = favoriteService;
    }
    checkFavorite(dto, user) {
        return this.favoriteService.checkAddedToFavorites(dto, user);
    }
    createFavorite(dto, user) {
        return this.favoriteService.createFavorite(dto, user);
    }
    deleteFavorite(dto, user) {
        return this.favoriteService.deleteFavorite(dto, user);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseFilters)(BadRequestException_filter_1.BadRequestExceptionFilter),
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('check'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Favorite_dto_1.FavoriteDto, Object]),
    __metadata("design:returntype", void 0)
], FavoriteController.prototype, "checkFavorite", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseFilters)(BadRequestException_filter_1.BadRequestExceptionFilter),
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Favorite_dto_1.FavoriteDto, Object]),
    __metadata("design:returntype", void 0)
], FavoriteController.prototype, "createFavorite", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseFilters)(BadRequestException_filter_1.BadRequestExceptionFilter),
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Favorite_dto_1.FavoriteDto, Object]),
    __metadata("design:returntype", void 0)
], FavoriteController.prototype, "deleteFavorite", null);
exports.FavoriteController = FavoriteController = __decorate([
    (0, swagger_1.ApiTags)('Favorites'),
    (0, common_1.Controller)('favorites'),
    __metadata("design:paramtypes", [favorite_service_1.FavoriteService])
], FavoriteController);
//# sourceMappingURL=favorite.controller.js.map