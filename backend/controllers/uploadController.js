const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const { runScanner } = require('../python_runner/runScanner');

exports.handleUpload = async (req, res) => {
    try {
        const zipPath = req.file.path;
        const jobId = Date.now().toString();

        const extractPath = path.join(__dirname, '..', 'extracted', jobId);
        const reportDir = path.join(__dirname, '..', 'reports', jobId);

        await fs.promises.mkdir(extractPath, { recursive: true });
        await fs.promises.mkdir(reportDir, { recursive: true });

        // unzip uploaded file
        await fs.createReadStream(zipPath)
            .pipe(unzipper.Extract({ path: extractPath }))
            .promise();

        // run python scanner
        const reportFile = await runScanner(extractPath, reportDir, jobId);

        return res.json({
            success: true,
            report_url: `/reports/${jobId}/${reportFile}`
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};
