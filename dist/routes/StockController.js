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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const DataManager_1 = require("../DataManager");
// const cors = require('cors');
const manager = DataManager_1.DataManager.getInstance();
let StockController = class StockController {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('someone get!!!');
            return manager.getAll();
            // return ans;
        });
    }
    // @UseBefore(cors())
    getHistory() {
        return manager.getHistory();
    }
    // @UseBefore(cors())
    getFolio() {
        return manager.getFolio();
    }
    // @UseBefore(cors())
    buy(name, quantity, user) {
        // console.log("inside controller    "+typeof(quantity));
        return manager.buy(name, parseInt(quantity));
    }
    // @UseBefore(cors())
    sell(name, quantity, user) {
        return manager.sell(name, parseInt(quantity));
    }
};
__decorate([
    routing_controllers_1.Get("/stock")
    // @UseBefore(cors())
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StockController.prototype, "getAll", null);
__decorate([
    routing_controllers_1.Get("/history")
    // @UseBefore(cors())
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getHistory", null);
__decorate([
    routing_controllers_1.Get("/folio")
    // @UseBefore(cors())
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getFolio", null);
__decorate([
    routing_controllers_1.Put("/buy/:name/:quantity")
    // @UseBefore(cors())
    ,
    __param(0, routing_controllers_1.Param("name")), __param(1, routing_controllers_1.Param("quantity")), __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StockController.prototype, "buy", null);
__decorate([
    routing_controllers_1.Put("/sell/:name/:quantity")
    // @UseBefore(cors())
    ,
    __param(0, routing_controllers_1.Param("name")), __param(1, routing_controllers_1.Param("quantity")), __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StockController.prototype, "sell", null);
StockController = __decorate([
    routing_controllers_1.Controller()
], StockController);
exports.StockController = StockController;
