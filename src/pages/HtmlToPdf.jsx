import React, { useState, useRef, useEffect } from 'react';
import { FileCode, Globe, Play, Download, Loader2 } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      color: #1e293b;
      padding: 30px;
      background: #ffffff;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #4f46e5;
    }
    .title {
      font-size: 28px;
      font-weight: 700;
      margin-top: 10px;
      color: #0f172a;
    }
    .subtitle {
      font-size: 14px;
      color: #64748b;
    }
    .content {
      margin-bottom: 30px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }
    .card {
      border: 1px solid #e2e8f0;
      padding: 15px;
      border-radius: 8px;
      background: #f8fafc;
    }
    .card-title {
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 10px;
      text-align: left;
      font-size: 13px;
    }
    th {
      background-color: #f1f5f9;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">WordToPDFConvertor</div>
    <div class="title">HTML to PDF Document</div>
    <div class="subtitle">Generated client-side inside your browser</div>
  </div>
  
  <div class="content">
    <p>This is a live preview of the HTML content. You can write custom markup, inline CSS styles, and tables, and download it instantly as a high-fidelity PDF document.</p>
    
    <div class="grid">
      <div class="card">
        <div class="card-title">Browser-Only Execution</div>
        <p style="font-size: 12px; margin: 0;">Calculated locally. Perfect for keeping secure business reports, statements, or invoices confidential.</p>
      </div>
      <div class="card">
        <div class="card-title">Fully Editable</div>
        <p style="font-size: 12px; margin: 0;">Change the text markup in the editor panel to the right and watch it update live.</p>
      </div>
    </div>
    
    <h3>Project Deliverable Scope</h3>
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Status</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Client-side compilation setup</td>
          <td style="color: #059669; font-weight: bold;">Completed</td>
          <td>High</td>
        </tr>
        <tr>
          <td>Premium dark layout design</td>
          <td style="color: #059669; font-weight: bold;">Completed</td>
          <td>High</td>
        </tr>
        <tr>
          <td>OCR PDF character extraction</td>
          <td style="color: #4f46e5; font-weight: bold;">Active</td>
          <td>Medium</td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <div class="footer">
    PDF generated via WordToPDFConvertor HTML compilation engine.
  </div>
</body>
</html>`;

function HtmlToPdf() {
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const iframeRef = useRef(null);

  // Update iframe preview when htmlCode changes
  useEffect(() => {
    updateIframe();
  }, [htmlCode]);

  const updateIframe = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(htmlCode);
    doc.close();
  };

  const handleFileSelect = () => {}; // Not used for this tool
  const clearFile = () => {
    setHtmlCode(DEFAULT_HTML);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (!htmlCode.trim()) {
      setErrorMessage("HTML content cannot be empty.");
      return;
    }

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
        scale: 2, // High resolution scale for clear text rendering
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      setProgress(70);

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate margins and document layout
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

      // Handle multi-page layouts
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      pdf.save(`html-document-${Date.now()}.pdf`);
      setProgress(100);
      setSuccessMessage("HTML content successfully compiled to PDF! Your download has started.");
      
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("HTML compilation failed: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Write HTML Code
        </label>
        <textarea
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          disabled={isExecuting}
          placeholder="Paste or write HTML code here..."
          className="w-full h-[280px] p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-xs font-mono focus:outline-none resize-none"
        />
      </div>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Convert HTML code to PDFs locally</h2>
      <p className="text-slate-400">
        Converting HTML layout markup to PDF format is ideal for saving website posts, reports, receipt lists, or code mockups. Our parser compiles HTML and renders it onto a virtual canvas, printing page-by-page matrices directly into a downloadable document inside your browser.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Inline CSS Styles</h4>
          <p className="text-xs text-slate-500">The converter supports inline style grids, margins, custom tables, backgrounds, and standard font declarations. Keep CSS structures clean inside the `head` tags for best accuracy.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Security Assured</h4>
          <p className="text-xs text-slate-500">Traditional online converters parse HTML by rendering it on their servers, exposing your parameters and databases. This layout compiles locally on your desktop thread, ensuring absolute privacy.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="HTML to PDF Converter"
      description="Write or paste raw HTML code, preview it live, and download it as a PDF."
      icon={FileCode}
      file={htmlCode ? true : null} // Bypass check
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
              title="Preview Sandbox" 
              className="w-full h-full border-none"
            />
          </div>
        </div>
      }
    />
  );
}

export default HtmlToPdf;
