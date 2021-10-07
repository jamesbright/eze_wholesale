import * as mongoose from 'mongoose';
interface SellRequestI extends mongoose.Document {

    item: string,
    storageSize: string
    grading: string
    unlocked: boolean,
    price: number,

}
export { SellRequestI }