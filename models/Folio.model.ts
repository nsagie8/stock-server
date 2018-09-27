import {Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt, DeletedAt, DataType} from 'sequelize-typescript';
import { FLOAT } from 'sequelize';

@Table
export class Folio extends Model<Folio> {
    
    
    @PrimaryKey
    @Column
    companyName: string;
    
    
    @Column
    amount: number;
    
    
    @Column(DataType.FLOAT)
    avaragePrice: number;
    
    
    @Column(DataType.FLOAT)
    profits: number;

    // @CreatedAt
    // creationDate: Date;
   
    // @UpdatedAt
    // updatedOn: Date;
    
    // @DeletedAt
    // deletionDate: Date;
}

export default Folio