import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const BuyRequestSchema = new Schema({
    item: String,
    storageSize: String,
    grading: String,
    unlocked: Boolean,
    price: Number,
    
 

},
    { timestamps: true }
);

BuyRequestSchema.index({ item:'text', storageSize:'text', grading:'text', unlocked:'text', price:'text' });