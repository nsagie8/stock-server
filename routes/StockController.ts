import { Controller, Param, Body, Get, Post, Put, Delete ,Res, Req, HttpCode, UseBefore } from "routing-controllers";
import { Stock } from "../models/Stock.model"; 
import { DataManager } from "../DataManager";
// const cors = require('cors');

const manager: DataManager = DataManager.getInstance();

@Controller()
export class StockController {    

    @Get("/stock")
    // @UseBefore(cors())
    async getAll() {
        // console.log('someone get!!!');
        return manager.getAll();
        // return ans;
    }

    @Get("/history")
    // @UseBefore(cors())
    getHistory() {
        return manager.getHistory();
    }

    @Get("/folio")
    // @UseBefore(cors())
    getFolio() {
        return manager.getFolio();
    }

    @Put("/buy/:name/:quantity")
    // @UseBefore(cors())
    buy(@Param("name") name: string, @Param("quantity") quantity: string, @Body() user: any) {
        // console.log("inside controller    "+typeof(quantity));
        return manager.buy(name, parseInt(quantity));
    }

    @Put("/sell/:name/:quantity")
    // @UseBefore(cors())
    sell(@Param("name") name: string, @Param("quantity") quantity: string, @Body() user: any) {
        return manager.sell(name, parseInt(quantity));
    }

}