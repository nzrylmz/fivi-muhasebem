const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gelir = new Schema({
    miktar: Number,
    kasa: Schema.Types.ObjectId(),
    tarih: {
        type:
    }
});