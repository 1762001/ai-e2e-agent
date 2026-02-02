const fs = require('fs-extra');
const path = require('path');

async function generateJSONReport(summary, bugs, results) {
  const report = {
    meta: {
      generatedAt: new Date().toISOString(),
      app: summary.appName
    },
    summary,
    bugs,
    results
  };

  const filePath = path.join('report', 'report.json');
  await fs.ensureDir('report');
  await fs.writeJson(filePath, report, { spaces: 2 });

  return filePath;
}

module.exports = { generateJSONReport };
