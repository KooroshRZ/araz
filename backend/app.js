const express = require('express');
const multer = require('multer');
const path = require('path');
const { runScanner } = require('./python_runner/runScanner');

const app = express();
const PORT = 3000;

// Multer setup
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Serve reports statically
app.use('/reports', express.static(path.join(__dirname, 'reports')));

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Upload route
app.post('/upload', upload.single('sourceZip'), async (req, res) => {
    const zipPath = req.file.path;

    try {
        const reportId = await runScanner(zipPath);
        const reportUrl = `/reports/${reportId}.html`;
        res.json({ success: true, reportUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
