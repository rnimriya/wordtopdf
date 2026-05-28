import React, { useState, useEffect, useRef } from 'react';
import { FileText, ArrowRightLeft, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import { convertDocxToHtml } from '../../utils/docxParser.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

function WordToPdf() {
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
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
    setHtmlContent('');
    setLoadingPreview(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const html = await convertDocxToHtml(buffer);
      
      // Inject some styling so the preview looks nice
      const styledHtml = `
        <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              color: #1e293b;
              padding: 20px;
              background: #ffffff;
              line-height: 1.5;
            }
            h1 { font-size: 18pt; font-weight: bold; margin-bottom: 12pt; color: #0f172a; }
            h2 { font-size: 14pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; color: #1e293b; }
            p { font-size: 10pt; margin-bottom: 8pt; text-align: justify; }
            table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
            th, td { border: 1px solid #e2e8f0; padding: 6px; text-align: left; font-size: 9.5pt; }
            th { background-color: #f8fafc; font-weight: bold; }
          </style>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `;
      setHtmlContent(styledHtml);
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not render Word document preview: " + err.message);
    } finally {
      setLoadingPreview(false);
    }
  };

  // Render iframe content when htmlContent changes
  useEffect(() => {
    if (htmlContent && iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(htmlContent);
      doc.close();
    }
  }, [htmlContent]);

  const clearFile = () => {
    setFile(null);
    setHtmlContent('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (!file || !htmlContent) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(20);

    try {
      const iframe = iframeRef.current;
      if (!iframe) throw new Error("Preview sandbox is not initialized.");

      const iframeBody = iframe.contentDocument.body;
      setProgress(40);

      // Snapshot the iframe content using html2canvas
      const canvas = await html2canvas(iframeBody, {
        scale: 2, // High resolution scale
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      setProgress(70);

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate margins and layout
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
      pdf.save(`${file.name.replace('.docx', '')}.pdf`);
      setProgress(100);
      setSuccessMessage("Word document converted to PDF successfully! Download initialized.");
      
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
        <span>Mammoth XML Conversion Engine</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        This converter parses the Microsoft Word XML hierarchy directly in the browser, rendering the document's structure to a clean vector canvas snapshot before outputting the PDF file.
      </p>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Convert Microsoft Word documents to PDF locally</h2>
      <p className="text-slate-400">
        Converting Word (.docx) files to PDFs is the standard way to protect report formatting before distribution. Most online sites require uploading your files, which exposes your corporate data. Our converter translates files client-side using Mammoth.js and html2canvas, securing absolute data safety.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">HTML-to-Canvas Conversion</h4>
          <p className="text-xs text-slate-500">Mammoth.js parses Word styles and tables to clean HTML. The HTML is rendered inside an isolated iframe sandbox and printed directly to high-fidelity PDF pages in the browser.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Private & Confidential</h4>
          <p className="text-xs text-slate-500">All memory allocations are confined to your local hardware thread, making this converter ideal for secure organizational files.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Convert Word to PDF"
      description="Convert Microsoft Word (.docx) documents into standard PDF format client-side."
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
      accept=".docx"
      preview={
        htmlContent ? (
          <div className="flex flex-col space-y-3 w-full">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Document Preview</h4>
            <div className="border border-slate-800 rounded-xl bg-white overflow-hidden w-full h-[360px] shadow-inner">
              <iframe 
                ref={iframeRef} 
                title="Word Preview Sandbox" 
                className="w-full h-full border-none"
              />
            </div>
          </div>
        ) : loadingPreview ? (
          <div className="flex flex-col items-center justify-center p-12 text-primary-500 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-xs text-slate-400">Parsing Word document structures...</span>
          </div>
        ) : null
      }
    />
  );
}

export default WordToPdf;
