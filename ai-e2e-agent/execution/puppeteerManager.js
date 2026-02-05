const puppeteer = require('puppeteer');
const config = require('../config/agent.config');
const fs = require('fs-extra');
const path = require('path');

let browser;
let page;

// 🔥 Persistent Chrome Profile (stores OAuth session)
const USER_DATA_DIR = path.join(__dirname, '../chrome-profile');

async function initBrowser() {

  browser = await puppeteer.launch({
    headless: false,
    slowMo: 25,

    // ✅ Reuse Google login session
    userDataDir: USER_DATA_DIR,

    defaultViewport: null,

    args: [
      '--start-maximized',
      '--disable-web-security'
    ]
  });

  page = await browser.newPage();

  page.setDefaultTimeout(60000);

  await setupNetworkLogging();

  return { browser, page };
}

async function setupNetworkLogging() {

  page.on('response', (res) => {

    const url = res.url();
    const status = res.status();

    if (url.includes('google.com')) return;

    if (status >= 400) {
      console.log(`⚠️ API: ${status} → ${url}`);
    }
  });
}

async function navigate(url) {
  await page.goto(url, { waitUntil: 'networkidle2' });
}

async function screenshot(name) {

  const filePath =
    path.join(config.screenshots.path, name);

  await fs.ensureDir(config.screenshots.path);

  await page.screenshot({
    path: filePath,
    fullPage: true
  });
}

async function closeBrowser() {
  if (browser) await browser.close();
}

module.exports = {
  initBrowser,
  navigate,
  screenshot,
  closeBrowser
};
