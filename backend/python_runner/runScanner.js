const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const { v4: uuidv4 } = require('uuid');

async function runScanner(zipPath) {
    // Generate unique report ID
    const reportId = uuidv4();

    // Extract ZIP
    const extractDir = path.join(__dirname, '../extracted', reportId);
    await fs.promises.mkdir(extractDir, { recursive: true });
    await fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: extractDir }))
        .promise();

    // Create reports directory
    const reportsDir = path.join(__dirname, '../reports');
    await fs.promises.mkdir(reportsDir, { recursive: true });
    const reportPath = path.join(reportsDir, `${reportId}.html`);

    // Run Python scanner
    return new Promise((resolve, reject) => {
        exec(
            `/Users/kourosh/me/AI/final_fucker/venv/bin/python3 ../sec_tool/main.py "${extractDir}" "${reportPath}"`,
            // { cwd: path.join(__dirname, '../gpt_sec_tool') },
            (error, stdout, stderr) => {
                if (error) return reject(error);
                console.log(stdout, stderr);
                resolve(reportId);
            }
        );
    });
}

module.exports = { runScanner };
