import { DataManager } from "./DataManager";
import { Socket } from "net";
import { StockController } from "./routes/StockController";
import { Application, Request, Response } from 'express';
import { createExpressServer } from "routing-controllers";
import "reflect-metadata";
import { MySequelize } from "./MySequelize";
import { Stock } from "./models/Stock.model";

const sequelize: MySequelize = MySequelize.getInstance();

const app: Application = createExpressServer({
    cors: true,
    controllers: [StockController]
});


let http = require('http').Server(app);
let io = require('socket.io')(http);
let ServerSocket: Socket;

const manager: DataManager = DataManager.getInstance();

io.on('connection', (socket: Socket) => {
    ServerSocket = socket;
    console.log('someone connected!!!');
});

sequelize.seq.sync().then(()=>{
        http.listen(3000, () => {
            manager.updateStockEmmiter.on('updateStock', async ()=>{
                if(ServerSocket){
                    let list = await manager.getAll();
                    ServerSocket.emit('updateStock', list);
                }
            });
            console.log('started on port 3000');
        });
}); 
