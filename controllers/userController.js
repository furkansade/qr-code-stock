const User = require("../models/User.js");

// email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.usersPage = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).render("users", {
      pageTitle: "Kullanıcılar",
      sidebarTitle: "users",
      users,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Stoklar getirilirken bir hata oluştu.");
    res.location(req.get("Referrer") || "/");
    res.status(500).redirect(req.get("Referrer") || "/");
  }
};

exports.createUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    req.flash("error", "Lütfen tüm alanları doldurunuz.");
    return res.status(400).redirect(req.get("Referrer") || "/");
  }

  if (!["employee", "admin"].includes(role)) {
    req.flash("error", "Geçerli bir rol giriniz.");
    return res.status(400).redirect(req.get("Referrer") || "/");
  }

  if (!emailRegex.test(email)) {
    req.flash("error", "Geçerli bir e-posta adresi giriniz.");
    return res.status(400).redirect(req.get("Referrer") || "/");
  }

  // Check if user already exists
  const user = await User.findOne({ email });

  if (user) {
    req.flash("error", "Bu e-posta adresi zaten kullanılmakta.");
    return res.status(400).redirect(req.get("Referrer") || "/");
  }

  try {
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    await newUser.save();

    req.flash("success", "Kullanıcı başarıyla oluşturuldu.");
    res.status(201).redirect("/users");
  } catch (error) {
    req.flash("error", "Kullanıcı oluşturulurken bir hata oluştu.");
    res.status(500).redirect("/users");
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      req.flash("error", "Kullanıcı bulunamadı.");
      return res.status(404).redirect("/users");
    }

    await User.findByIdAndDelete(id);

    req.flash("success", "Kullanıcı başarıyla silindi.");
    res.status(200).redirect("/users");
  } catch (error) {
    req.flash("error", "Kullanıcı silinirken bir hata oluştu.");
    res.status(500).redirect("/users");
  }
};
