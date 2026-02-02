async function findInteractiveElements(page) {
  return await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(
      'input:not([type=hidden]), textarea, select'
    )).map(el => ({
      tag: el.tagName.toLowerCase(),
      type: el.type || 'text',
      name: el.name || el.id || null
    }));

    const buttons = Array.from(document.querySelectorAll(
      'button, input[type=submit], input[type=button]'
    )).map(el => ({
      text: el.innerText || el.value || '',
      disabled: el.disabled
    }));

    return { inputs, buttons };
  });
}

module.exports = { findInteractiveElements };
