import {Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt, DeletedAt, DataType} from 'sequelize-typescript';

@Table
export class Transaction extends Model<Transaction>{
    
    
    @Column
    stockName: string;
    
    
    @Column
    isTheTranWasBuy: boolean;
    
    
    @Column
    quantity: number;
    
    
    @Column(DataType.FLOAT)
    priceAtTran: number;
    
    
    @Column
    date: string


    // @UpdatedAt
    // updatedOn: Date;
    
    // @DeletedAt
    // deletionDate: Date;
}

export default Transaction