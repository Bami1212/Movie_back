"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteModule = void 0;
const common_1 = require("@nestjs/common");
const favorite_controller_1 = require("./favorite.controller");
const favorite_service_1 = require("./favorite.service");
const mongoose_1 = require("@nestjs/mongoose");
const favorite_schema_1 = require("../schemas/favorite.schema");
let FavoriteModule = exports.FavoriteModule = class FavoriteModule {
};
exports.FavoriteModule = FavoriteModule = __decorate([
    (0, common_1.Module)({
        controllers: [favorite_controller_1.FavoriteController],
        providers: [favorite_service_1.FavoriteService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: favorite_schema_1.Favorite.name, schema: favorite_schema_1.FavoriteSchema },
            ]),
        ],
    })
], FavoriteModule);
//# sourceMappingURL=favorite.module.js.map