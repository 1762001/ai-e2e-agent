function attachApiScanner(page, apiMap) {
  page.on('requestfinished', async (request) => {
    const response = request.response();
    if (!response) return;

    const url = request.url();
    if (!url.includes('/api')) return;

    apiMap.push({
      url,
      method: request.method(),
      status: response.status()
    });
  });
}

module.exports = { attachApiScanner };
