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
const Stock_model_1 = require("./models/Stock.model");
const Transaction_model_1 = require("./models/Transaction.model");
const events_1 = require("events");
const Folio_model_1 = require("./models/Folio.model");
const MySequelize_1 = require("./MySequelize");
const timestamp = require('time-stamp');
const seq = MySequelize_1.MySequelize.getInstance();
class DataManager {
    constructor() {
        this.updateStockEmmiter = new events_1.EventEmitter();
        if (DataManager._instance) {
            throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
        }
        DataManager._instance = this;
        this.initStocks();
        this.initFolio();
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            let stocksList = yield Stock_model_1.Stock.findAll();
            for (let stock of stocksList) {
                let ran = Math.random() * 2;
                ran -= 1;
                stock.changePercentage = ran;
                stock.currentPrice = stock.currentPrice + (ran * stock.currentPrice) / 100;
                try {
                    yield Stock_model_1.Stock.update({
                        'companyName': stock.companyName,
                        'startPrice': stock.startPrice,
                        'currentPrice': stock.currentPrice,
                        'changePercentage': stock.changePercentage
                    }, { where: { companyName: stock.companyName } });
                }
                catch (e) {
                    console.log(e);
                }
            }
            this.updateStockEmmiter.emit('updateStock', stocksList);
        }), 10000);
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let ans = yield Stock_model_1.Stock.findAll();
            return ans.map((stock) => {
                return {
                    'companyName': stock.companyName,
                    'startPrice': stock.startPrice,
                    'currentPrice': stock.currentPrice,
                    'changePercentage': stock.changePercentage
                };
            });
        });
    }
    getHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            let ans = yield Transaction_model_1.Transaction.findAll();
            return ans.map((tran) => {
                return {
                    'stockName': tran.stockName,
                    'isTheTranWasBuy': tran.isTheTranWasBuy,
                    'quantity': tran.quantity,
                    'priceAtTran': tran.priceAtTran,
                    'date': tran.date
                };
            });
        });
    }
    getFolio() {
        return __awaiter(this, void 0, void 0, function* () {
            let ans = yield Folio_model_1.Folio.findAll();
            return ans.map((folio) => {
                return {
                    'companyName': folio.companyName,
                    'amount': folio.amount,
                    'avaragePrice': folio.avaragePrice,
                    'profits': folio.profits
                };
            });
        });
    }
    static getInstance() {
        return DataManager._instance;
    }
    initStocks() {
        return __awaiter(this, void 0, void 0, function* () {
            let array = yield Stock_model_1.Stock.findAll();
            if (array.length == 0) { // check if data dont exist
                let mockStocks = require('/Users/nsagie/stocks-project/stocks-project-server/stocks.json');
                (() => __awaiter(this, void 0, void 0, function* () {
                    for (let stock of mockStocks) {
                        yield Stock_model_1.Stock.create(stock);
                    }
                }))();
            }
        });
    }
    initFolio() {
        return __awaiter(this, void 0, void 0, function* () {
            let array = yield Folio_model_1.Folio.findAll();
            if (array.length == 0) { // check if data dont exist
                let stocksList = yield Stock_model_1.Stock.findAll();
                for (const st of stocksList) {
                    yield Folio_model_1.Folio.create({
                        "companyName": st.companyName, "amount": 0, "avaragePrice": 0, "profits": 0
                    });
                }
            }
        });
    }
    buy(companyName, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const fl = yield Folio_model_1.Folio.find({ where: { companyName } });
            const st = yield Stock_model_1.Stock.find({ where: { companyName } });
            if (quantity == 0 || !st || !fl) {
                return false;
            }
            // @ts-ignore
            let tran = {
                "stockName": companyName,
                "isTheTranWasBuy": true,
                "quantity": quantity,
                "priceAtTran": st.currentPrice,
                "date": timestamp.utc('DD/MM/YYYY HH:mm')
            };
            yield Transaction_model_1.Transaction.create(tran);
            fl.avaragePrice = (fl.avaragePrice * fl.amount + st.currentPrice * quantity) / (fl.amount + quantity);
            fl.amount += quantity;
            yield Folio_model_1.Folio.update({
                'companyName': fl.companyName,
                'amount': fl.amount,
                'avaragePrice': fl.avaragePrice,
                'profits': fl.profits
            }, { where: { companyName: fl.companyName } });
            return true;
        });
    }
    sell(companyName, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const fl = yield Folio_model_1.Folio.find({ where: { companyName } });
            const st = yield Stock_model_1.Stock.find({ where: { companyName } });
            if (quantity == 0 || !fl || !st || (fl.amount < quantity)) {
                return false;
            }
            //@ts-ignore
            let tran = {
                "stockName": companyName,
                "isTheTranWasBuy": false,
                "quantity": quantity,
                "priceAtTran": st.currentPrice,
                "date": timestamp.utc('DD/MM/YYYY HH:mm')
            };
            yield Transaction_model_1.Transaction.create(tran);
            fl.profits += (st.currentPrice - fl.avaragePrice) * quantity;
            fl.amount -= quantity;
            fl.amount === 0 ? fl.avaragePrice = 0 : fl.avaragePrice = fl.avaragePrice;
            yield Folio_model_1.Folio.update({
                'companyName': fl.companyName,
                'amount': fl.amount,
                'avaragePrice': fl.avaragePrice,
                'profits': fl.profits
            }, { where: { companyName: fl.companyName } });
            return true;
        });
    }
}
DataManager._instance = new DataManager(); // singleton instance
exports.DataManager = DataManager;
