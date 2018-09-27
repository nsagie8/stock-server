import { Stock } from "./models/Stock.model";
import { Transaction } from "./models/Transaction.model";
import { EventEmitter } from "events";
import { Folio } from "./models/Folio.model";
import { MySequelize } from "./MySequelize";
const timestamp = require('time-stamp');
const seq: MySequelize = MySequelize.getInstance();

export class DataManager{
    updateStockEmmiter: EventEmitter = new EventEmitter();
    
    static _instance: DataManager = new DataManager(); // singleton instance

    constructor() {
        if(DataManager._instance){
            throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
        }
        DataManager._instance = this;

        this.initStocks();
        this.initFolio();

        setInterval(async ()=>{
            let stocksList: Stock[] = await Stock.findAll();
            for(let stock of stocksList){

                let ran: number = Math.random()*2; 
                ran -= 1;
                stock.changePercentage = ran;
                stock.currentPrice = stock.currentPrice+(ran*stock.currentPrice) / 100;
                try{
                    await Stock.update(
                    {
                        'companyName': stock.companyName,
                        'startPrice': stock.startPrice,
                        'currentPrice': stock.currentPrice,
                        'changePercentage': stock.changePercentage
                    }, {where: {companyName: stock.companyName}});
                }
                catch(e){
                    console.log(e);
                }
            }

            this.updateStockEmmiter.emit('updateStock', stocksList);
        }, 10000);
    }


    async getAll(){
        let ans:Array<Stock> = await Stock.findAll();
        
        return ans.map((stock)=>{
            return {
                'companyName': stock.companyName,
                'startPrice': stock.startPrice,
                'currentPrice': stock.currentPrice,
                'changePercentage': stock.changePercentage
            }
        });
    }

    async getHistory() {
        let ans: Array<Transaction> = await Transaction.findAll();
        return ans.map((tran)=>{
            return {
                'stockName': tran.stockName,
                'isTheTranWasBuy': tran.isTheTranWasBuy,
                'quantity': tran.quantity,
                'priceAtTran': tran.priceAtTran,
                'date': tran.date
            }
        });
    }

    async getFolio(){
        
        let ans: Array<Folio> = await Folio.findAll();
        return ans.map((folio)=>{
            return{
                'companyName': folio.companyName,
                'amount': folio.amount,
                'avaragePrice': folio.avaragePrice,
                'profits': folio.profits
            }
        })
    }

    static getInstance():DataManager{
        return DataManager._instance;
    }

    async initStocks(){
        let array: Stock[] = await Stock.findAll();
        if(array.length == 0){   // check if data dont exist
            
            let mockStocks: Stock[] = require('/Users/nsagie/stocks-project/stocks-project-server/stocks.json');
            (async ()=>{
                for(let stock of mockStocks){
                    await Stock.create(stock);
                }
            })()
        }
    }

    async initFolio(){
        
        let array: Folio[] = await Folio.findAll();
        
        if(array.length == 0){    // check if data dont exist

            let stocksList: Stock[] = await Stock.findAll();
        
            for (const st of stocksList){
                await Folio.create({
                    "companyName": st.companyName, "amount": 0, "avaragePrice": 0, "profits": 0
                });
            }
        }
        
    }


    async buy(companyName: string, quantity: number){ //return true if success
        
        const fl: Folio | null = await Folio.find({where: {companyName}});
        const st: Stock | null = await Stock.find({where: {companyName}});


        if(quantity==0 || !st || !fl){
            return false;
        }


        // @ts-ignore
        let tran: Transaction = {
            "stockName": companyName,
            "isTheTranWasBuy": true,
            "quantity": quantity,
            "priceAtTran": st.currentPrice,
            "date": timestamp.utc('DD/MM/YYYY HH:mm')
        }; 
        
        await Transaction.create(tran);

        fl.avaragePrice = (fl.avaragePrice*fl.amount + st.currentPrice*quantity) / (fl.amount + quantity);
        fl.amount += quantity;

        await Folio.update(
            {
                'companyName': fl.companyName,
                'amount': fl.amount,
                'avaragePrice': fl.avaragePrice,
                'profits': fl.profits
            }
            , {where: {companyName: fl.companyName}});

        return true;
    }

    async sell(companyName: string, quantity: number) {
        const fl: Folio | null = await Folio.find({where: {companyName}});
        const st: Stock | null = await Stock.find({where: {companyName}});

        if(quantity==0 || !fl || !st || (fl.amount<quantity)){ 
            return false 
        }
                
        //@ts-ignore
        let tran: Transaction = {
            "stockName": companyName,
            "isTheTranWasBuy": false,
            "quantity": quantity,
            "priceAtTran": st.currentPrice,
            "date": timestamp.utc('DD/MM/YYYY HH:mm')
        }; 

        await Transaction.create(tran);
        
        fl.profits += (st.currentPrice - fl.avaragePrice) * quantity;        
        fl.amount -= quantity;
        fl.amount === 0 ? fl.avaragePrice = 0 : fl.avaragePrice = fl.avaragePrice;


        await Folio.update(
            {
                'companyName': fl.companyName,
                'amount': fl.amount,
                'avaragePrice': fl.avaragePrice,
                'profits': fl.profits
            }
            , {where: {companyName: fl.companyName}});

        return true;
    }
}