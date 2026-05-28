import { PDFDocument, degrees } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';

/**
 * Merge multiple PDF documents client-side.
 * @param {File[]} files - Selected PDF files.
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<Blob>} - Merged PDF Blob.
 */
export async function mergePDFs(files, onProgress) {
  if (!files || files.length === 0) throw new Error("No files selected for merging.");
  
  const mergedDoc = await PDFDocument.create();
  let processedFilesCount = 0;

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const docToMerge = await PDFDocument.load(arrayBuffer);
    
    // Copy all pages
    const pagesToCopy = docToMerge.getPages();
    const copiedPages = await mergedDoc.copyPages(
      docToMerge, 
      pagesToCopy.map((_, index) => index)
    );
    
    // Add pages to merged document
    copiedPages.forEach((page) => mergedDoc.addPage(page));
    
    processedFilesCount++;
    if (onProgress) {
      onProgress(Math.round((processedFilesCount / files.length) * 100));
    }
  }

  const mergedPdfBytes = await mergedDoc.save();
  return new Blob([mergedPdfBytes], { type: 'application/pdf' });
}

/**
 * Rotate pages of a PDF document client-side.
 * @param {File} file - Selected PDF file.
 * @param {Object} rotationMap - Keys are 0-indexed page indices, values are degrees to rotate (90, 180, 270).
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<Blob>} - Rotated PDF Blob.
 */
export async function rotatePDF(file, rotationMap, onProgress) {
  if (!file) throw new Error("No file selected.");
  
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(30);

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  if (onProgress) onProgress(60);

  const pages = pdfDoc.getPages();

  // Apply rotations
  Object.entries(rotationMap).forEach(([indexStr, deg]) => {
    const pageIndex = parseInt(indexStr);
    if (pageIndex >= 0 && pageIndex < pages.length) {
      const page = pages[pageIndex];
      const currentRotation = page.getRotation().angle;
      const targetRotation = (currentRotation + deg) % 360;
      page.setRotation(degrees(targetRotation));
    }
  });
  if (onProgress) onProgress(80);

  const pdfBytes = await pdfDoc.save();
  if (onProgress) onProgress(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Encrypt and password protect a PDF document client-side.
 * @param {File} file - Selected PDF file.
 * @param {string} userPassword - Password needed to open PDF.
 * @param {string} ownerPassword - Password needed to modify PDF permissions.
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<Blob>} - Protected PDF Blob.
 */
export async function protectPDF(file, userPassword, ownerPassword = "", onProgress) {
  if (!file) throw new Error("No file selected.");
  if (!userPassword) throw new Error("User password is required.");

  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(40);

  // encryptPDF takes Uint8Array or ArrayBuffer and applies password encryption
  const encryptedBytes = await encryptPDF(
    new Uint8Array(arrayBuffer), 
    userPassword, 
    ownerPassword || userPassword
  );
  if (onProgress) onProgress(90);

  const protectedBlob = new Blob([encryptedBytes], { type: 'application/pdf' });
  if (onProgress) onProgress(100);

  return protectedBlob;
}

/**
 * Compress a PDF document client-side.
 * @param {File} file - Selected PDF file.
 * @param {Object} settings - Compression parameters (e.g. removeMetadata).
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<Blob>} - Compressed PDF Blob.
 */
export async function compressPDF(file, settings, onProgress) {
  if (!file) throw new Error("No file selected.");

  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(30);

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  if (onProgress) onProgress(60);

  // Scrub standard metadata fields
  if (settings.removeMetadata) {
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setCreator('');
    pdfDoc.setProducer('');
  }
  if (onProgress) onProgress(80);

  // save with object streams enabled (which squeezes PDF size structural tables)
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
  });
  if (onProgress) onProgress(100);

  return new Blob([compressedBytes], { type: 'application/pdf' });
}
