import React, { useState } from 'react';
import { ScanEye, Languages, FileText, Download, Copy, Check, Loader2 } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import PDFPreview from '../components/PDFPreview.jsx';
import * as pdfjs from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import confetti from 'canvas-confetti';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

function OcrPdf() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('eng');
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setOcrText('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const clearFile = () => {
    setFile(null);
    setOcrText('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleOCR = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setOcrText('');
    setProgress(5);

    let worker = null;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;

      // Initialize Tesseract Worker
      worker = await createWorker(language);
      setProgress(15);

      let fullText = "";

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        
        // Render PDF page to a sharp canvas for OCR scanning
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 }); // 1.5 scale is ideal for OCR sharpness
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Perform OCR on canvas
        const { data: { text } } = await worker.recognize(canvas);
        
        fullText += `--- Page ${pageNum} ---\n\n${text}\n\n`;
        setOcrText(fullText); // Stream results to UI

        const percent = Math.round(15 + (pageNum / totalPages) * 80);
        setProgress(percent);
      }

      await worker.terminate();
      worker = null;

      setProgress(100);
      setSuccessMessage("OCR completed successfully! You can download or copy the extracted text below.");
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("OCR execution failed: " + err.message);
      if (worker) {
        await worker.terminate();
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    if (!ocrText) return;
    navigator.clipboard.writeText(ocrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!ocrText) return;
    const blob = new Blob([ocrText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name.replace('.pdf', '')}-text.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const controls = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Document Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isExecuting}
          className="glass-input select-arrow"
        >
          <option value="eng">English (ENG)</option>
          <option value="spa">Spanish (SPA)</option>
          <option value="fra">French (FRA)</option>
          <option value="deu">German (GER)</option>
          <option value="chi_sim">Chinese Simplified (CHI)</option>
          <option value="ara">Arabic (ARA)</option>
          <option value="hin">Hindi (HIN)</option>
        </select>
      </div>

      {ocrText && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 text-xs text-slate-300 hover:text-white transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-primary-500" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 text-xs text-slate-300 hover:text-white transition-all"
          >
            <Download className="h-4 w-4 text-secondary-500" />
            <span>Download .txt</span>
          </button>
        </div>
      )}
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Extract scanned text from PDFs with local OCR</h2>
      <p className="text-slate-400">
        Invoices, fax transcripts, and paper scans are often saved as images inside PDFs, meaning you cannot search, copy, or edit the text. Our tool uses **Tesseract.js** (a neural network OCR engine) to scan pages directly in the browser and translate visual pixels back to character nodes.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Offline Accuracy</h4>
          <p className="text-xs text-slate-500">Tesseract compiles complex layout geometries client-side in WebAssembly. It identifies letters, numbers, and spacings from different language sets and formats them into a clean text outline.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Security & Privacy</h4>
          <p className="text-xs text-slate-500">Since Tesseract runs inside a sandbox worker on your computer, your scanned IDs, bank bills, and private invoices never leave your computer, ensuring compliance with strict compliance standards.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="OCR PDF (Text Recognition)"
      description="Scan PDF images and convert them to copyable text files entirely client-side."
      icon={ScanEye}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={clearFile}
      controls={controls}
      onExecute={ocrText ? handleDownload : handleOCR}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
    >
      {/* Overridden split panel displaying live OCR text */}
      {ocrText ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel showing source PDF page 1 */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <h4 className="font-display font-semibold text-sm text-slate-400 border-b border-slate-800 pb-2">
              Source PDF Preview
            </h4>
            <PDFPreview file={file} pageNumber={1} scale={0.7} />
          </div>

          {/* Right panel showing extracted text streams */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-display font-semibold text-sm text-slate-400">
                Extracted Text Output
              </h4>
              {isExecuting && (
                <div className="flex items-center space-x-1.5 text-xs text-primary-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Scanning...</span>
                </div>
              )}
            </div>
            
            <textarea
              readOnly
              value={ocrText}
              placeholder="OCR text will render here during processing..."
              className="w-full h-[320px] p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-xs font-mono focus:outline-none resize-none"
            />
          </div>

        </div>
      ) : (
        <PDFPreview file={file} pageNumber={1} scale={0.8} />
      )}
    </ToolLayout>
  );
}

export default OcrPdf;
