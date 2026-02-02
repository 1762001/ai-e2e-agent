const fs = require('fs-extra');
const path = require('path');

async function generateHTMLReport(summary, bugs) {
  const rows = bugs.map(bug => `
    <tr>
      <td>${bug.id}</td>
      <td>${bug.severity}</td>
      <td>${bug.type}</td>
      <td>${bug.description}</td>
      <td>${bug.screenshot ? `<img src="../screenshots/${bug.screenshot}" width="200"/>` : 'N/A'}</td>
    </tr>
  `).join('');

  const html = `
  <html>
  <head>
    <title>AI E2E Test Report</title>
    <style>
      body { font-family: Arial; padding: 20px; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ccc; padding: 8px; }
      th { background: #f4f4f4; }
      .CRITICAL { background: #ffcccc; }
      .HIGH { background: #ffe0b2; }
      .MEDIUM { background: #fff9c4; }
    </style>
  </head>
  <body>
    <h1>AI E2E Test Report</h1>
    <p><strong>App:</strong> ${summary.appName}</p>
    <p><strong>Total Tests:</strong> ${summary.total}</p>
    <p><strong>Passed:</strong> ${summary.passed}</p>
    <p><strong>Failed:</strong> ${summary.failed}</p>

    <h2>Detected Bugs</h2>
    <table>
      <tr>
        <th>ID</th>
        <th>Severity</th>
        <th>Type</th>
        <th>Description</th>
        <th>Evidence</th>
      </tr>
      ${rows}
    </table>
  </body>
  </html>
  `;

  const filePath = path.join('report', 'report.html');
  await fs.ensureDir('report');
  await fs.writeFile(filePath, html);

  return filePath;
}

module.exports = { generateHTMLReport };
