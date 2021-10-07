import * as mongoose from 'mongoose';
interface BuyRequestI extends mongoose.Document {
    
    item: string,
    storageSize: string
    grading: string
    unlocked: boolean,
    price: number,
       
}
export { BuyRequestI }