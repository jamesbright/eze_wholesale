import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const SellRequestSchema = new Schema({
    item: String,
    storageSize: String,
    grading: String,
    unlocked: Boolean,
    price: Number,



},
    { timestamps: true }
);