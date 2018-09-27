"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
class MySequelize {
    constructor() {
        if (MySequelize._instance) {
            throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
        }
        this.seq = this.createSeq();
        this.seq.addModels([__dirname + '/models']);
    }
    static getInstance() {
        return MySequelize._instance;
    }
    createSeq() {
        return new sequelize_typescript_1.Sequelize({
            database: 'stock_db',
            dialect: 'postgres',
            host: 'localhost',
            username: 'postgres',
            password: '',
            storage: ':memory:',
            modelPaths: [__dirname + '/models']
        });
    }
}
MySequelize._instance = new MySequelize(); // singleton instance
exports.MySequelize = MySequelize;
