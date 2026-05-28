import * as XLSX from 'xlsx';
import * as pdfjs from 'pdfjs-dist';

// Configure the pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

/**
 * Parse an Excel (.xlsx/.xls/.csv) file and convert its sheets to HTML tables.
 * @param {ArrayBuffer} arrayBuffer - File data.
 * @returns {Promise<{sheets: {name: string, html: string}[]}>} - Parsed sheets.
 */
export async function convertExcelToHtml(arrayBuffer) {
  try {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheets = workbook.SheetNames.map(name => {
      const worksheet = workbook.Sheets[name];
      const html = XLSX.utils.sheet_to_html(worksheet, {
        header: '<table>',
        footer: '</table>'
      });
      return { name, html };
    });
    return { sheets };
  } catch (err) {
    console.error("SheetJS parsing error:", err);
    throw new Error("Failed to read Excel workbook format.");
  }
}

/**
 * Generate a downloadable Excel (.xlsx) file from a 2D array of data.
 * @param {Array[][]} rows - 2D matrix representing Excel grid rows.
 * @param {string} sheetName - Target worksheet name.
 * @returns {Blob} - XLSX file Blob.
 */
export function createExcelFromRows(rows, sheetName = "Sheet 1") {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });
  
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

/**
 * Extract structured tables from a PDF using coordinate alignment.
 * Group text items that share horizontal lines into rows, and split columns.
 * @param {File} file - PDF file.
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<Array[][]>} - 2D grid matrix of cell data.
 */
export async function extractTableFromPDF(file, onProgress) {
  if (!file) throw new Error("No file selected.");

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;

  const allRows = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const textItems = textContent.items;

    if (textItems.length === 0) continue;

    // Group items by horizontal alignment Y (within 4 pixels tolerance)
    const rowGroups = [];
    textItems.forEach(item => {
      const y = item.transform[5]; // Y position
      const x = item.transform[4]; // X position
      
      // Find an existing row group that is within Y tolerance
      let group = rowGroups.find(g => Math.abs(g.y - y) <= 4);
      if (!group) {
        group = { y, items: [] };
        rowGroups.push(group);
      }
      group.items.push({ x, str: item.str });
    });

    // Sort rows descending (top to bottom)
    rowGroups.sort((a, b) => b.y - a.y);

    // Process each row group, sorting cells left-to-right
    rowGroups.forEach(group => {
      // Sort items by X position
      group.items.sort((a, b) => a.x - b.x);

      // Group cells if they are very close horizontally, or treat as new columns
      const rowCells = [];
      let currentCell = "";
      let lastX = -1;

      group.items.forEach(item => {
        // If lastX is -1, it's the first word.
        // If the gap between items is small (e.g. less than 15 units), merge words.
        if (lastX === -1) {
          currentCell = item.str;
        } else if (item.x - lastX < 18) {
          currentCell += (currentCell.endsWith(" ") ? "" : " ") + item.str;
        } else {
          rowCells.push(currentCell.trim());
          currentCell = item.str;
        }
        lastX = item.x + item.str.length * 5; // Rough estimate of text width
      });

      if (currentCell) {
        rowCells.push(currentCell.trim());
      }

      if (rowCells.length > 0) {
        allRows.push(rowCells);
      }
    });

    // Add empty row separator between PDF pages
    if (pageNum < totalPages) {
      allRows.push([`--- End of Page ${pageNum} ---`]);
    }

    if (onProgress) {
      onProgress(Math.round((pageNum / totalPages) * 100));
    }
  }

  return allRows;
}
