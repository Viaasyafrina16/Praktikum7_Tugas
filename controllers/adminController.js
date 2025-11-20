const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register admin
exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query("INSERT INTO admins (email, password) VALUES (?, ?)", [email, hash], (err) => {
    if (err) return res.json({ success: false, message: "Gagal register" });
    res.json({ success: true, message: "Admin berhasil dibuat" });
  });
};

// Login admin
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admins WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.json({ success: false, message: "Admin tidak ditemukan" });

    const admin = results[0];
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.json({ success: false, message: "Password salah" });

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  });
};

// Get all users
exports.getAllUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.json({ success: false });
    res.json({ success: true, data: results });
  });
};

// Get all API keys
exports.getAllApiKeys = (req, res) => {
  const now = new Date();
  db.query("SELECT *, CASE WHEN userId IS NULL THEN 'false' ELSE 'true' END AS used FROM api_keys", (err, results) => {
    if (err) return res.json({ success: false });
    results.forEach(r => r.status = new Date(r.out_of_date) < now ? 'off' : 'on');
    res.json({ success: true, data: results });
  });
};

// Delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) return res.json({ success: false, message: "Gagal menghapus user" });
    res.json({ success: true, message: "User berhasil dihapus" });
  });
};

// Delete API key
exports.deleteApiKey = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM api_keys WHERE id = ?", [id], (err) => {
    if (err) return res.json({ success: false, message: "Gagal menghapus API Key" });
    res.json({ success: true, message: "API Key berhasil dihapus" });
  });
};
