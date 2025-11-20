const db = require('../db');
const crypto = require('crypto');

exports.createUserWithApiKey = (req, res) => {
    const { firstname, lastname, email } = req.body;

    if (!firstname || !lastname || !email) {
        return res.status(400).json({ success: false, message: "Semua field wajib diisi" });
    }

    // Simpan user
    const queryUser = 'INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)';
    db.query(queryUser, [firstname, lastname, email], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        const userId = result.insertId;

        // Auto-generate API key
        const apiKey = crypto.randomBytes(16).toString('hex');

        // out_of_date = 1 bulan dari sekarang
        const outOfDate = new Date();
        outOfDate.setMonth(outOfDate.getMonth() + 1);

        const queryApiKey = 'INSERT INTO api_keys (api_key, userId, out_of_date) VALUES (?, ?, ?)';
        db.query(queryApiKey, [apiKey, userId, outOfDate], (err2, result2) => {
            if (err2) return res.status(500).json({ success: false, message: err2.message });

            res.json({
                success: true,
                message: 'User & API key berhasil dibuat',
                data: { userId, apiKey, outOfDate }
            });
        });
    });
};
