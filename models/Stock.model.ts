import {Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt, DeletedAt, DataType} from 'sequelize-typescript';

@Table
export class Stock extends Model<Stock>{
    
    
    @Column
    companyName: string;
    
    
    @Column(DataType.FLOAT)
    startPrice: number;
    
    
    @Column(DataType.FLOAT)
    currentPrice: number;
    
    
    @Column(DataType.FLOAT)
    changePercentage: number;

    // @UpdatedAt
    // updatedOn: Date;
    
    // @DeletedAt
    // deletionDate: Date;
}

export default Stock