"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FileText, ArrowRightLeft, Loader2, Grid } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import { convertExcelToHtml } from '../../utils/excelParser.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

function ExcelToPdf() {
  const [file, setFile] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [activeSheetIdx, setActiveSheetIdx] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const iframeRef = useRef(null);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setSuccessMessage('');
    setErrorMessage('');
    setSheets([]);
    setActiveSheetIdx(0);
    setLoadingPreview(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const { sheets: parsedSheets } = await convertExcelToHtml(buffer);
      setSheets(parsedSheets);
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not parse Excel document: " + err.message);
    } finally {
      setLoadingPreview(false);
    }
  };

  // Render active sheet inside iframe
  useEffect(() => {
    if (sheets.length > 0 && iframeRef.current) {
      const activeSheet = sheets[activeSheetIdx];
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      
      const sheetHtml = `
        <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              color: #1e293b;
              padding: 20px;
              background: #ffffff;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 8px;
              text-align: left;
              font-size: 11px;
              white-space: nowrap;
            }
            th {
              background-color: #f1f5f9;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
          </style>
        </head>
        <body>
          <h2>Sheet: ${activeSheet.name}</h2>
          <div style="overflow-x: auto;">
            ${activeSheet.html}
          </div>
        </body>
        </html>
      `;

      doc.open();
      doc.write(sheetHtml);
      doc.close();
    }
  }, [sheets, activeSheetIdx]);

  const clearFile = () => {
    setFile(null);
    setSheets([]);
    setActiveSheetIdx(0);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (!file || sheets.length === 0) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(20);

    try {
      const iframe = iframeRef.current;
      if (!iframe) throw new Error("Preview sandbox is not initialized.");

      const iframeBody = iframe.contentDocument.body;
      setProgress(40);

      // Snapshot Excel sheet view using html2canvas
      const canvas = await html2canvas(iframeBody, {
        scale: 2, // High resolution scale
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      setProgress(70);

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate layout
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      setProgress(85);

      // Multi-page handling
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      pdf.save(`${file.name.replace('.xlsx', '').replace('.xls', '')}.pdf`);
      setProgress(100);
      setSuccessMessage("Excel sheet successfully converted to PDF! Download initialized.");
      
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("Conversion failed: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      {sheets.length > 1 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Select Sheet
          </label>
          <div className="flex flex-wrap gap-2">
            {sheets.map((sheet, index) => (
              <button
                key={sheet.name}
                type="button"
                onClick={() => setActiveSheetIdx(index)}
                disabled={isExecuting}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeSheetIdx === index
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900/30'
                }`}
              >
                {sheet.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold flex items-center gap-2">
        <Grid className="h-4 w-4" />
        <span>SheetJS Workbook Matrix Render</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        This converter parses the binary workbook and extracts tabular ranges client-side, compiling cells into standard vector page snapshots before exporting the PDF file.
      </p>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Convert Excel workbooks to PDF documents securely</h2>
      <p className="text-slate-400">
        Converting spreadsheet ranges (.xlsx/.xls) to printable PDF sheets is essential when sharing financial updates, ledger charts, or tables. Most online sites require uploading your files, which exposes corporate details. Our converter translates files client-side, maintaining complete data safety.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Automated Grid Layouts</h4>
          <p className="text-xs text-slate-500">SheetJS reads sheet rows, formatting them as HTML table layouts. The layout parses cell paddings, border grids, and text colors and exports them directly into PDF page layers.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Secure Client Sandbox</h4>
          <p className="text-xs text-slate-500">No network data egress. The sheet processing operates locally inside your computer browser memory, ensuring compliance with strict compliance standards.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Convert Excel to PDF"
      description="Convert Microsoft Excel (.xlsx/.xls) spreadsheet grids into clean PDF documents client-side."
      icon={Grid}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={clearFile}
      controls={controls}
      onExecute={handleConvert}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
      accept=".xlsx,.xls,.csv"
      preview={
        sheets.length > 0 ? (
          <div className="flex flex-col space-y-3 w-full">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Document Preview</h4>
            <div className="border border-slate-800 rounded-xl bg-white overflow-hidden w-full h-[360px] shadow-inner">
              <iframe 
                ref={iframeRef} 
                title="Excel Preview Sandbox" 
                className="w-full h-full border-none"
              />
            </div>
          </div>
        ) : loadingPreview ? (
          <div className="flex flex-col items-center justify-center p-12 text-primary-500 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-xs text-slate-400">Parsing spreadsheet cell matrices...</span>
          </div>
        ) : null
      }
    />
  );
}

export default ExcelToPdf;
