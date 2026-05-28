"use client";

import React, { useState } from 'react';
import { FileText, ArrowRightLeft, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTextFromPDF, createDocxFromHtml } from '../../utils/docxParser.js';
import confetti from 'canvas-confetti';

function PdfToWord() {
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
      // 1. Extract text and structure from PDF
      const { pages } = await extractTextFromPDF(file, (prog) => {
        setProgress(Math.round(10 + prog * 0.7)); // Map 0-100 to 10-80
      });
      
      setProgress(85);

      // 2. Format as HTML for Word conversion
      const htmlContent = pages.map((pageText, idx) => {
        const paragraphs = pageText.split('\n')
          .filter(p => p.trim())
          .map(p => `<p>${p.trim()}</p>`)
          .join('\n');
        
        return `
          <div class="${idx > 0 ? 'page-break' : ''}">
            <h1>Page ${idx + 1}</h1>
            ${paragraphs}
          </div>
        `;
      }).join('\n');

      setProgress(90);

      // 3. Create DOCX Blob and trigger download
      const wordBlob = createDocxFromHtml(htmlContent);
      const url = URL.createObjectURL(wordBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace('.pdf', '')}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      setSuccessMessage("PDF successfully converted to editable Word document (.docx)! Check your downloads folder.");
      
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
      <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 text-primary-400 text-xs font-semibold flex items-center gap-2">
        <ArrowRightLeft className="h-4 w-4" />
        <span>Text Layout Reconstruction Mode</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        This converter extracts the textual structures and page hierarchies client-side, compiling them into a fully editable Microsoft Word document (.docx).
      </p>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Convert PDF to Word DOCX documents securely</h2>
      <p className="text-slate-400">
        Copying text manually from a PDF can be frustrating. Our converter parses the text coordinate streams page-by-page, mapping them back to standard paragraphs and headings, and writes them into a Microsoft Word file directly inside your browser cache.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Editable Text Paragraphs</h4>
          <p className="text-xs text-slate-500">The generated DOCX file preserves formatting headings, text outlines, and lists as editable Microsoft Word paragraphs rather than flat image representations.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Browser Cryptography</h4>
          <p className="text-xs text-slate-500">Unlike cloud PDF converters, your confidential letters, legal briefs, and business records are analyzed in your browser, maintaining absolute data isolation.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Convert PDF to Word"
      description="Extract text from a PDF document and compile it into an editable Word document (.docx)."
      icon={FileText}
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

export default PdfToWord;
