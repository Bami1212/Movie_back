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
exports.FavoriteService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const favorite_schema_1 = require("../schemas/favorite.schema");
let FavoriteService = exports.FavoriteService = class FavoriteService {
    constructor(favoriteModel) {
        this.favoriteModel = favoriteModel;
    }
    async createFavorite(dto, user) {
        try {
            const favoriteMovie = this.favoriteModel.findOneAndUpdate({ userId: user._id, id: dto.id, type: dto.type }, {
                $set: {
                    id: dto.id,
                    userId: user._id,
                    type: dto.type,
                },
            }, {
                upsert: true,
                new: true,
            });
            return favoriteMovie;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteFavorite(dto, user) {
        try {
            return this.favoriteModel.findOneAndDelete({
                id: dto.id,
                userId: user._id,
                type: dto.type,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async checkAddedToFavorites(dto, user) {
        try {
            const favoriteMovie = await this.favoriteModel.findOne({
                userId: user._id,
                id: dto.id,
                type: dto.type,
            });
            return {
                added: favoriteMovie ? true : false,
            };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.FavoriteService = FavoriteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(favorite_schema_1.Favorite.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FavoriteService);
//# sourceMappingURL=favorite.service.js.map