const Stock = require('../models/Stock.js'); // Stock modelini import ediyoruz
const Category = require('../models/Category.js'); // Category modelini import ediyoruz
const cloudinary = require('cloudinary').v2;
const QRCode = require('qrcode');
const axios = require('axios');


// page render fonksiyonları

exports.stocksPage = async (req, res) => {
    try {
        const stocks = await Stock.find().populate('category');
        const categories = await Category.find().populate('parentCategory');

        res.status(200).render("stocks", {
            pageTitle: "Stoklar",
            sidebarTitle: "stocks",
            stocks,
            categories
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Stoklar getirilirken bir hata oluştu.');
        res.location(req.get('Referrer') || '/');
        res.status(500).redirect(req.get('Referrer') || '/');
    }
};

exports.getStockById = async (req, res) => {
    const { id } = req.params;

    try {
        const stock = await Stock.findById(id).populate('category');
        const categories = await Category.find().populate('parentCategory');

        if (!stock) {
            return res.status(404).json({ message: "Stok bulunamadı." });
        }

        res.status(200).render("stock_detail", {
            pageTitle: stock.name,
            sidebarTitle: "stock_detail",
            stock,
            categories
        });
    } catch (error) {
        res.status(500).json({ message: "Stok getirilirken bir hata oluştu.", error: error.message });
    }
};

// download QR code

exports.downloadQRCode = async (req, res) => {
    const { id } = req.params;
    try {
        const stock = await Stock.findById(id);
        if (!stock) {
            req.flash('error', 'Stok bulunamadı.');
            return res.status(404).redirect('/stocks');
        }

        const response = await axios.get(stock.qrCodeUrl, {
            responseType: 'arraybuffer'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${stock.name}-QRCode.png"`);
        res.setHeader('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error(error);
        req.flash('error', 'QR kod indirilirken bir hata oluştu.');
        res.status(500).redirect('/stocks');
    }
};

exports.printQrCode = async (req, res) => {
    const { id } = req.params;
    try {
        const stock = await Stock.findById(id).select('name qrCodeUrl');
        if (!stock) {
            req.flash('error', 'Stok bulunamadı.');
            return res.status(404).redirect('/stocks');
        }

        // QR kod sayfasını render edin
        res.render('printQRCode', { stock });
    } catch (error) {
        console.error(error);
        req.flash('error', 'QR kod yazdırılırken bir hata oluştu.');
        res.status(500).redirect('/stocks');
    }
};


// crud fonksiyonları

exports.createStock = async (req, res) => {

    const { name, price, quantity, description, category } = req.body;

    // Gerekli alanların kontrolü
    if (!name || !category) {
        req.flash('error', 'Lütfen gerekli alanları doldurunuz.');
        res.location(req.get('Referrer') || '/');
        return res.status(400).redirect(req.get('Referrer') || '/');
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

exports.updateStock = async (req, res) => {
    const { id } = req.params;
    const { name, price, quantity, description, category } = req.body;

    if (!name || !category) {
        req.flash('error', 'Lütfen gerekli alanları doldurunuz.');
        res.location(req.get('Referrer') || '/');
        return res.status(400).redirect(req.get('Referrer') || '/');
    }

    try {
        const stock = await Stock.findById(id);

        if (!stock) {
            req.flash('error', 'Stok bulunamadı.');
            return res.status(404).redirect('/stocks');
        }

        stock.name = name;
        stock.price = price;
        stock.quantity = quantity;
        stock.description = description;
        stock.category = category;

        await stock.save();

        req.flash('success', 'Stok başarıyla güncellendi.');
        res.status(200).redirect(`/stocks/${id}`);

    } catch (error) {
        req.flash('error', 'Stok güncellenirken bir hata oluştu.');
        res.status(500).redirect('/stocks');
    }
};

exports.deleteStock = async (req, res) => {
    const { id } = req.params;

    try {
        const stock = await Stock.findById(id);

        if (!stock) {
            req.flash('error', 'Stok bulunamadı.');
            return res.status(404).redirect('/stocks');
        }

        // Cloudinary'den QR kodu sil
        await cloudinary.uploader.destroy(stock.qrCodePublicId);

        await Stock.findByIdAndDelete(id);

        req.flash('success', 'Stok başarıyla silindi.');
        res.status(200).redirect('/stocks');

    } catch (error) {
        console.error(error);
        req.flash('error', 'Stok silinirken bir hata oluştu.');
        res.status(500).redirect('/stocks');
    }
};


