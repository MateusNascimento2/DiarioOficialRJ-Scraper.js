// https://www3.tjrj.jus.br/consultadje/consultaDJE.aspx?dtPub=5/1/2022&caderno=A&pagina=-1
// Page.$ === document.querySelector

const puppeteer = require('puppeteer');
const FrameHandler = require('./FrameHandler');
const PDFParser = require('./PDFParser');

const date = new Date().toLocaleDateString('pt-BR');
console.log(date);

(async () => {
  let browser;
  try {
    const url = `https://www3.tjrj.jus.br/consultadje/consultaDJE.aspx?dtPub=${date}&caderno=A&pagina=-1`;
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const iframe = await FrameHandler.getIframe(page);

    const text = await FrameHandler.getText(iframe);
    console.log(text);

    const urls = await FrameHandler.getPDF(iframe, page);
    console.log(urls);

    await PDFParser.downloadPDF(text, urls);
    await PDFParser.deletePDF();
    await browser.close();
  } catch {
    await browser.close();
  }
})();
