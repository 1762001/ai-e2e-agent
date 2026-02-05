const puppeteer = require('puppeteer');
const config = require('../config/agent.config');
const fs = require('fs-extra');
const path = require('path');

let browser;
let page;

/**
 * 🔐 Inject REAL session into LocalStorage
 */
async function injectAuthState(page) {
  const session = JSON.parse(
    fs.readFileSync('./config/session.json', 'utf8')
  );

  await page.evaluateOnNewDocument((data) => {
    localStorage.setItem('certhubuser', JSON.stringify(data.user));
    localStorage.setItem('certhubls', JSON.stringify(data.session));
  }, session);
}

async function initBrowser() {

  browser = await puppeteer.launch({
    headless: false,
    slowMo: 25,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  page = await browser.newPage();
  page.setDefaultTimeout(config.puppeteer.defaultTimeout);

  // 🔥 IMPORTANT: Inject auth BEFORE page load
  await injectAuthState(page);

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
