import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Configure the pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

/**
 * Convert a Word (.docx) file to an HTML string client-side.
 * @param {ArrayBuffer} arrayBuffer - Word file array buffer.
 * @returns {Promise<string>} - HTML representation.
 */
export async function convertDocxToHtml(arrayBuffer) {
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value; // The generated HTML
  } catch (err) {
    console.error("Mammoth error:", err);
    throw new Error("Failed to parse Word document format.");
  }
}

/**
 * Create a downloadable Word (.docx) file from raw HTML or text.
 * Uses the HTML-to-Word wrapping technique compatible with MS Word.
 * @param {string} htmlContent - HTML or formatted text content.
 * @returns {Blob} - Word document Blob.
 */
export function createDocxFromHtml(htmlContent) {
  // A clean HTML wrapper with basic Word document styles
  const documentTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>Exported PDF Text</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 1in;
        }
        h1 { font-size: 20pt; font-weight: bold; margin-bottom: 12pt; color: #1e293b; }
        h2 { font-size: 16pt; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; color: #475569; }
        p { font-size: 11pt; margin-bottom: 10pt; text-align: justify; }
        table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 10pt; }
        th { background-color: #f1f5f9; font-weight: bold; }
        .page-break { page-break-after: always; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  // Standard DOCX mime-type
  return new Blob(['\ufeff' + documentTemplate], {
    type: 'application/msword;charset=utf-8'
  });
}

/**
 * Extract clean text and structure from a PDF file.
 * @param {File} file - PDF file.
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<{text: string, pages: string[]}>} - Combined text and list of text pages.
 */
export async function extractTextFromPDF(file, onProgress) {
  if (!file) throw new Error("No file specified.");

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;

  const pagesText = [];
  
  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Group text items by their vertical coordinates (Y-positions) to respect line breaks
    const textItems = textContent.items;
    
    // Simple line grouping algorithm
    const lines = {};
    textItems.forEach(item => {
      const y = Math.round(item.transform[5]); // Y coordinate
      if (!lines[y]) {
        lines[y] = [];
      }
      lines[y].push(item);
    });

    // Sort Y coordinates descending (top of the page first)
    const sortedY = Object.keys(lines).sort((a, b) => b - a);
    
    // Map lines to final strings, sorting X coordinates ascending (left to right)
    const pageLines = sortedY.map(y => {
      const lineItems = lines[y].sort((a, b) => a.transform[4] - b.transform[4]);
      return lineItems.map(item => item.str).join(' ');
    });

    pagesText.push(pageLines.join('\n'));

    if (onProgress) {
      onProgress(Math.round((i / totalPages) * 100));
    }
  }

  return {
    text: pagesText.join('\n\n--- Page Break ---\n\n'),
    pages: pagesText
  };
}
