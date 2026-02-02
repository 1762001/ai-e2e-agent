const puppeteer = require('puppeteer');
const config = require('../config/agent.config');
const fs = require('fs-extra');
const path = require('path');

let browser;
let page;

/**
 * 🔐 Inject Angular auth state BEFORE app loads
 */
async function injectAuthState(page) {
  // ⚠️ Replace values if needed, structure must match your app
  const authState = {
    email: "kumashwini@google.com",
    name: "Ashwini Kumar",
    accessToken: "AI_TEST_TOKEN",
    idToken: "AI_TEST_TOKEN",
    user: {
      userid: "kumashwini",
      email: "kumashwini@google.com",
      domain: null
    },
    accessPrivilege: "ROLE_ADMIN"
  };

  await page.evaluateOnNewDocument((auth) => {
    localStorage.setItem('certhubuser', JSON.stringify(auth));
    localStorage.setItem('certhubls', JSON.stringify(auth));
  }, authState);
}

async function initBrowser() {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 30,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  page = await browser.newPage();
  page.setDefaultTimeout(config.puppeteer.defaultTimeout);

  // 🔥 CRITICAL: Inject auth BEFORE navigation
  await injectAuthState(page);

  await setupNetworkLogging();
  return { browser, page };
}

async function setupNetworkLogging() {
  page.on('response', (response) => {
    const url = response.url();
    const status = response.status();

    // Ignore Chrome / Google noise
    if (url.includes('google.com')) return;

    if (status >= 400) {
      console.log(`⚠️ API Issue: ${url} → ${status}`);
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
