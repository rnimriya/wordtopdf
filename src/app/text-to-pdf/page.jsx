"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

const SAMPLE_TEXT = `CONTRACT SUMMARY & AGREEMENT
----------------------------

Date: May 28, 2026

This document serves as the formal agreement between the Project Sponsor and Developer regarding the final delivery parameters of the PDF utility software platform.

1. Scope of Work
The Developer is tasked with transitioning 20+ frontend mock simulations into fully functional client-side document processing widgets.

2. Deliverable Quality Standards
All widgets must utilize local browser memory sandboxes (via WebAssembly libraries like pdf-lib, pdfjs-dist, and Tesseract.js) to guarantee 100% data safety.

3. Signature
Project Sponsor: ________________________
Developer:       ________________________`;

function TextToPdf() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const iframeRef = useRef(null);

  // Update preview iframe
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      
      const styledText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br/>");

      const previewHtml = `
        <html>
        <head>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 11.5pt;
              line-height: 1.5;
              color: #1e293b;
              padding: 25px;
              white-space: pre-wrap;
              background: #ffffff;
            }
          </style>
        </head>
        <body>${styledText}</body>
        </html>
      `;

      doc.open();
      doc.write(previewHtml);
      doc.close();
    }
  }, [text]);

  const handleFileSelect = () => {};
  const clearFile = () => {
    setText('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (!text.trim()) {
      setErrorMessage("Please write some text to compile.");
      return;
    }

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(30);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 20; // 20mm margins
      const pdfWidth = 210; // A4 width
      const maxLineWidth = pdfWidth - (margin * 2);
      
      pdf.setFont("courier", "normal");
      pdf.setFontSize(11);

      // Split long lines of text to fit page bounds automatically
      const sourceLines = text.split('\n');
      const wrappedLines = [];

      sourceLines.forEach(line => {
        if (line.trim() === '') {
          wrappedLines.push('');
        } else {
          const splitLines = pdf.splitTextToSize(line, maxLineWidth);
          wrappedLines.push(...splitLines);
        }
      });
      setProgress(60);

      let yPosition = margin;
      const pageHeight = 295;
      const maxYPosition = pageHeight - margin;
      const lineSpacing = 6; // 6mm line spacing

      wrappedLines.forEach((line, idx) => {
        if (yPosition + lineSpacing > maxYPosition) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineSpacing;
      });
      setProgress(90);

      pdf.save(`text-document-${Date.now()}.pdf`);
      setProgress(100);
      setSuccessMessage("Text successfully compiled to A4 PDF document! Download initiated.");
      
      confetti({
        particleCount: 80,
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
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Document Content
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isExecuting}
          placeholder="Type or paste plain text documents here..."
          className="w-full h-[280px] p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-xs font-mono focus:outline-none resize-none"
        />
      </div>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Generate formatted PDF files from plain text locally</h2>
      <p className="text-slate-400">
        If you have code files, text agreements, email transcripts, or lists that you need to convert into clean, standard A4 PDFs, this plain text converter handles formatting details in the browser. Wrap lines automatically, set custom monospace layouts, and export.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Monospace Alignment</h4>
          <p className="text-xs text-slate-500">The compiler outputs clean, grid-aligned text spacing using a standardized Courier monospace typeface, ideal for reports, logs, and summaries.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Data Isolation</h4>
          <p className="text-xs text-slate-500">No external servers compile your inputs. The PDF document is written in memory inside your browser window context.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Convert Text to PDF"
      description="Write or paste plain text content and convert it into a standard A4 PDF document."
      icon={FileText}
      file={text ? true : null} // Bypass check
      onFileSelect={() => {}}
      onClear={clearFile}
      controls={controls}
      onExecute={handleConvert}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
      preview={
        <div className="flex flex-col space-y-3 w-full">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Document Preview</h4>
          <div className="border border-slate-800 rounded-xl bg-white overflow-hidden w-full h-[360px] shadow-inner">
            <iframe 
              ref={iframeRef} 
              title="Text Preview Sandbox" 
              className="w-full h-full border-none"
            />
          </div>
        </div>
      }
    />
  );
}

export default TextToPdf;
