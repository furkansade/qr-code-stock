const Category = require('../models/Category.js');

exports.createCategory = async (req, res) => {
    const { name, parentCategory } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Lütfen kategori adını giriniz." });
    }

    try {
        const newCategory = new Category({
            name,
            parentCategory
        });

        await newCategory.save();

        req.flash('success', 'Kategori başarıyla oluşturuldu.');
        res.status(201).redirect('/categories');
    } catch (error) {
        req.flash('error', 'Kategori oluşturulurken bir hata oluştu.');
        res.status(500).redirect('/categories');
    }
};