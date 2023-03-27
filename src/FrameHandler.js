class FrameHandler {
  async getIframe(page) {
    await page.waitForSelector('#component-1011');
    const iframeElement = await page.$('#component-1011');
    const frame = await iframeElement.contentFrame();
    await frame.waitForSelector('#lstCadernos');
    await frame.waitForSelector('#lstCadernos > option');
    await frame.waitForSelector('#btnEnviar');
    return frame;
  }

  async getText(iframe) {
    const optionsOfSelect = ['A', 'S', 'C', 'I', 'E'];
    const selectText = [];
    for (const option of optionsOfSelect) {
      const selectElement = await iframe.$('#lstCadernos');
      await iframe.select('select#lstCadernos', option);
      const text = await selectElement.$eval(`option[value=${option}]`, (options) => options.textContent);
      selectText.push(text);
    }
    return selectText;
  }

  async getPDF(iframe, page) {
    const optionsOfSelect = ['A', 'S', 'C', 'I', 'E'];
    const pdfArr = [];
    // eslint-disable-next-line no-unused-vars
    for (const option of optionsOfSelect) {
      await iframe.select('select#lstCadernos', option);
      const inputElement = await iframe.$('#txtNumPagina');
      await inputElement.click({ clickCount: 3 });
      await inputElement.press('Backspace');
      await inputElement.type('-1');
      const inputBtn = await iframe.$('#btnEnviar');
      await inputBtn.click();
      const pdfFile = await page.$eval('#component-1013', (el) => el.src);
      pdfArr.push(pdfFile);
    }
    return pdfArr;
  }
}

module.exports = new FrameHandler();
