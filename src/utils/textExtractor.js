import * as pdfjs from 'pdfjs-dist';

// Ensure worker path is configured
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

/**
 * Extracts text from the first 15 pages of a PDF file client-side.
 * @param {File|Blob} file - PDF file to extract text from.
 * @returns {Promise<string>} - Extracted text contents.
 */
export async function extractTextFromPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    // Extract text from up to 15 pages to keep token limits reasonable
    const maxPages = Math.min(pdf.numPages, 15);
    
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += `\n--- Page ${i} ---\n` + pageText;
    }
    return fullText;
  } catch (err) {
    console.error("Text extraction failed:", err);
    return "";
  }
}
