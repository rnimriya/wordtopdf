"use client";

import React, { useState } from 'react';
import { FileText, ArrowRightLeft, Grid } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTableFromPDF, createExcelFromRows } from '../../utils/excelParser.js';
import confetti from 'canvas-confetti';

function PdfToExcel() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const clearFile = () => {
    setFile(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      // 1. Extract tabular data from PDF using coordinate grouping
      const tableRows = await extractTableFromPDF(file, (prog) => {
        setProgress(Math.round(10 + prog * 0.7)); // Map 0-100 to 10-80
      });
      
      setProgress(85);

      if (tableRows.length === 0) {
        throw new Error("No structured text table lines could be identified.");
      }

      setProgress(90);

      // 2. Generate Excel document Blob
      const excelBlob = createExcelFromRows(tableRows, "PDF Table Extracted");
      
      // 3. Download
      const url = URL.createObjectURL(excelBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace('.pdf', '')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      setSuccessMessage("PDF table data successfully converted to Excel sheet (.xlsx)! Check your downloads folder.");
      
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
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold flex items-center gap-2">
        <Grid className="h-4 w-4" />
        <span>Tabular Matrix Alignment Mode</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        This converter maps vertical alignments and horizontal word bounds to reconstruct the layout columns and rows, translating PDF lines into a structured Excel workbook (.xlsx).
      </p>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Convert PDF tables to Excel sheets client-side</h2>
      <p className="text-slate-400">
        Re-keying invoice grids, budgets, or accounting sheets from a PDF is a tedious, error-prone task. Our utility runs entirely in the browser to analyze text coordinates, group words sharing lines, segment them into spreadsheet columns, and compile them into a native, uncorrupted Excel document.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Grid Alignment Algorithm</h4>
          <p className="text-xs text-slate-500">The script groups horizontal characters within a 4-pixel margin tolerance, sorting cells left-to-right to separate values into discrete columns.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Corporate Privacy</h4>
          <p className="text-xs text-slate-500">Since no document uploads take place, your private business ledgers, customer listings, and salary reports remain protected in your browser cache.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Convert PDF to Excel"
      description="Extract aligned tables from a PDF document and compile them into an Excel workbook (.xlsx)."
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
      preview={file && <PDFPreview file={file} pageNumber={1} scale={0.8} />}
    />
  );
}

export default PdfToExcel;
