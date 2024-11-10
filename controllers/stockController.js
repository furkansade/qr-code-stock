const Stock = require('../models/Stock.js'); // Stock modelini import ediyoruz
const Category = require('../models/Category.js'); // Category modelini import ediyoruz
const cloudinary = require('cloudinary').v2;
const QRCode = require('qrcode');

exports.getStockById = async (req, res) => {
    const { id } = req.params;

    try {
        const stock = await Stock.findById(id).populate('category');

        if (!stock) {
            return res.status(404).json({ message: "Stok bulunamadı." });
        }

        res.status(200).render("/stockDetail", {
             stock
        });
    } catch (error) {
        res.status(500).json({ message: "Stok getirilirken bir hata oluştu.", error: error.message });
    }
};

exports.createStock = async (req, res) => {

    const { name, price, quantity, description, category } = req.body;

    // Gerekli alanların kontrolü
    if (!name || !price || !quantity) {
        return res.status(400).json({ message: "Lütfen gerekli tüm alanları doldurunuz." });
    }

    try {
        // Stock kaydını veritabanına kaydet ve _id değerini al
        const newStock = new Stock({
            name,
            price,
            quantity,
            description,
            category
        });

        await newStock.save();

        // QR kod verisi olarak stok detay URL'sini kullan (.env'den domain alınıyor)
        const stockDetailUrl = `${process.env.BASE_URL}/stocks/${newStock._id}`;

        // QR kodu veri URL olarak oluştur
        const qrCodeDataUrl = await QRCode.toDataURL(stockDetailUrl, {
            width: 300,
        });

        // QR kodu Cloudinary'ye yükleme
        const uploadResult = await cloudinary.uploader.upload(qrCodeDataUrl, {
            folder: "qr_code_stock_management/qr_codes",
            resource_type: "image",
            format: "png",
        });

        // QR kod URL ve public_id'sini stock kaydına ekleyip güncelle
        newStock.qrCodeUrl = uploadResult.secure_url; // Cloudinary URL'si
        newStock.qrCodePublicId = uploadResult.public_id; // Cloudinary public_id
        await newStock.save();

        req.flash('success', 'Stok başarıyla oluşturuldu.');
        res.status(201).redirect('/stocks');

    } catch (error) {
        req.flash('error', 'Stok oluşturulurken bir hata oluştu.');
        res.status(500).redirect('/stocks');
    }
};


