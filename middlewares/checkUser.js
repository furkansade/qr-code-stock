const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Kullanıcıyı doğrula ve user bilgilerini yerel olarak sakla
const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        try {
          const user = await User.findById(decodedToken.userId);
          res.locals.user = user; // Kullanıcı bilgilerini yerel değişkene ekle
          next();
        } catch (error) {
          console.error("Kullanıcı doğrulama hatası:", error);
          res.locals.user = null;
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// Giriş yapmamış kullanıcıları login sayfasına yönlendirme
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.redirect("/auth/login");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.redirect("/auth/login");
    } else {
      req.userId = decodedToken.userId;
      next();
    }
  });
};

// Sadece admin kullanıcılar için erişim izni sağlama
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user && user.role === "admin") {
      next(); // Admin ise işleme devam
    } else {
      req.flash("error", "Bu işlemi gerçekleştirmek için yetkiniz yok.");
      return res.redirect("/stocks");
    }
  } catch (error) {
    console.error("Admin kontrol hatası:", error);
    res.redirect("/auth/login");
  }
};

module.exports = { checkUser, requireAuth, requireAdmin };