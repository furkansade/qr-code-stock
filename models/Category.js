const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
}, { timestamps: true });


// üst kategori silinirse alt kategorileri de silinir
categorySchema.pre('findOneAndDelete', async function(next) {
    const categoryId = this.getQuery()._id;
    await mongoose.model('Category').deleteMany({ parentCategory: categoryId });
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;