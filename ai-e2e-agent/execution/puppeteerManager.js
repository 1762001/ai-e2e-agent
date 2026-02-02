const puppeteer = require('puppeteer');
const config = require('../config/agent.config');
const fs = require('fs-extra');
const path = require('path');
const { getAuthHeader } = require('../auth/tokenManager');

let browser;
let page;

async function initBrowser() {
  browser = await puppeteer.launch({
    headless: config.puppeteer.headless,
    slowMo: config.puppeteer.slowMo,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  page = await browser.newPage();
  page.setDefaultTimeout(config.puppeteer.defaultTimeout);

  await setupAuthHeader();
  await setupNetworkLogging();

  return { browser, page };
}

async function setupAuthHeader() {
  await page.setExtraHTTPHeaders({
    Authorization: getAuthHeader()
  });
}

async function setupNetworkLogging() {
  page.on('response', async (response) => {
    const status = response.status();
    if (status >= 400) {
      console.log(`⚠️ API Issue: ${response.url()} → ${status}`);
    }
  });
}

async function navigate(url) {
  await page.goto(url, { waitUntil: 'networkidle2' });
}

async function screenshot(name) {
  const filePath = path.join(config.screenshots.path, name);
  await fs.ensureDir(config.screenshots.path);
  await page.screenshot({ path: filePath, fullPage: true });
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
