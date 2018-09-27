import { Sequelize } from 'sequelize-typescript';
import { Folio } from './models/Folio.model';
import { Stock } from './models/Stock.model';
import { Transaction } from './models/Transaction.model';

export class MySequelize {
    static _instance: MySequelize = new MySequelize(); // singleton instance
    seq: Sequelize;

    constructor(){
        if(MySequelize._instance){
            throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
        }
        
        this.seq = this.createSeq();
        this.seq.addModels([__dirname + '/models']);
    }

    static getInstance(): MySequelize{
        return MySequelize._instance;
    }

    createSeq(): Sequelize{
        return new Sequelize({
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
