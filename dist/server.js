"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataManager_1 = require("./DataManager");
const StockController_1 = require("./routes/StockController");
const routing_controllers_1 = require("routing-controllers");
require("reflect-metadata");
const MySequelize_1 = require("./MySequelize");
const sequelize = MySequelize_1.MySequelize.getInstance();
const app = routing_controllers_1.createExpressServer({
    cors: true,
    controllers: [StockController_1.StockController]
});
let http = require('http').Server(app);
let io = require('socket.io')(http);
let ServerSocket;
const manager = DataManager_1.DataManager.getInstance();
io.on('connection', (socket) => {
    ServerSocket = socket;
    console.log('someone connected!!!');
});
sequelize.seq.sync().then(() => {
    http.listen(3000, () => {
        manager.updateStockEmmiter.on('updateStock', () => __awaiter(this, void 0, void 0, function* () {
            if (ServerSocket) {
                let list = yield manager.getAll();
                ServerSocket.emit('updateStock', list);
            }
        }));
        console.log('started on port 3000');
    });
});
