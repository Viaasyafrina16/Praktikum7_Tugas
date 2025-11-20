const db = require('../db');
const generateApiKey = require('../utils/generateApiKey');

exports.createApiKey = (req, res) => {
  const api_key = generateApiKey();
  const out_of_date = new Date();
  out_of_date.setMonth(out_of_date.getMonth() + 1);

  db.query("INSERT INTO api_keys (api_key, out_of_date) VALUES (?, ?)", [api_key, out_of_date], (err) => {
    if(err) return res.json({ success: false });
    res.json({ success: true, data: { apiKey: api_key } });
  });
};

exports.deleteApiKey = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM api_keys WHERE id = ?", [id], (err) => {
    if(err) return res.json({ success: false, message: "Gagal hapus API key" });
    res.json({ success: true, message: "API key berhasil dihapus" });
  });
};
