const fs = require('fs');
const axios = require('axios');
const path = require('path');
const pdfParser = require('pdf-parse');

class PDFParser {
  async readPDF(PDF_PATH) {
    fs.readFile(PDF_PATH, (error, pdfData) => {
      if (error) {
        console.error(error);
        return;
      }
      pdfParser(pdfData)
        .then((data) => {
          const pdfText = data.text;
          console.log(pdfText); // log the extracted text to the console
        })
        .catch((e) => {
          console.error(e);
        });
    });
  }

  async downloadPDF(saveText, files) {
    let i = 0;
    for (const file of files) {
      const PDF_FOLDER = './pdfs';
      const PDF_FILE_NAME = `${saveText[i]}.pdf`;
      const PDF_PATH = path.join(PDF_FOLDER, PDF_FILE_NAME);

      if (!fs.existsSync(PDF_FOLDER)) {
        fs.mkdirSync(PDF_FOLDER);
      }

      await axios({
        method: 'GET',
        url: file,
        responseType: 'stream',
      })
        .then((response) => {
          const pdfWriter = fs.createWriteStream(PDF_PATH);
          response.data.pipe(pdfWriter);
          pdfWriter.on('finish', async () => {
            await this.readPDF(PDF_PATH);
            await this.deletePDF(PDF_PATH);
          });
        })
        .catch((error) => {
          console.error(error);
        });
      i += 1;
    }
  }

  async deletePDF(pdfPath) {
    try {
      fs.unlinkSync(pdfPath);
      console.log(`File ${pdfPath} deleted successfully.`);
    } catch (err) {
      console.error(`Error deleting file ${pdfPath}: ${err}`);
    }
  }
}

module.exports = new PDFParser();
