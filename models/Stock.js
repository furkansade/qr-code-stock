const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stockSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    quantity: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: false
    },
    qrCodeUrl: { // QR kod görüntüsünün Cloudinary URL'si
        type: String,
        required: false
    },
    qrCodePublicId: { // Cloudinary'de resmi tanımlamak için kullanılacak public_id
        type: String,
        required: false
    },

}, { timestamps: true });


const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;