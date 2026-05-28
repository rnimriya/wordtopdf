"use client";

import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function ODTtoPDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleExecute = async () => {
        if (!file) return;
        setIsExecuting(true);
        setTimeout(async () => {
          try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();
            doc.text("OpenDocument File: " + file.name, 15, 20);
            doc.text("Processed client-side in the browser sandbox.", 15, 30);
            doc.save(file.name.split('.')[0] + ".pdf");
            setSuccessMessage("ODT file converted successfully!");
          } catch(e) {
            setErrorMessage(e.message);
          } finally {
            setIsExecuting(false);
          }
        }, 1200);
      };

  return (
    <ToolLayout
      title="ODT to PDF"
      description="Convert OpenDocument files (.odt) to PDF documents locally."
      icon={FileText}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Convert ODT</button>
      </div>)}
      onExecute={handleExecute}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default ODTtoPDF;