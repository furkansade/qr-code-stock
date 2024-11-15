const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const connectToDatabase = require('./config/db.js');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');

dotenv.config();
require('./config/cloudinary.js');
connectToDatabase();

// Routes
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const stockRoutes = require('./routes/stockRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');

// Express app
const app = express();

// ejs view engine
app.set('view engine', 'ejs');
app.use(express.static('public')); // Statik dosyaları ilk sırada tanımla

// JSON ve URL Encoded veriyi işlemek için middleware ekleniyor
app.use(express.json()); // JSON verisi için
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

// Session ve Flash mesajları için middleware ekleniyor
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});

// Kullanıcı bilgisini tüm sayfalarda erişilebilir hale getirmek için checkUser middleware'i ekleniyor
const { checkUser } = require('./middlewares/checkUser.js');
app.use(checkUser);

// File Upload middleware
app.use(fileUpload({ useTempFiles: true })); // En sonlarda olması uygundur

// Routes 
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/stocks', stockRoutes);
app.use('/categories', categoryRoutes);

// route olmayan yollarda 404 hatası ver ve /auth/login sayfasına yönlendir
app.get('*', (req, res) => {
    res.status(404).redirect('/auth');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});