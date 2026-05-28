"use client";

import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function RTFtoPDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleExecute = async () => {
        if (!file) return;
        setIsExecuting(true);
        try {
          const { jsPDF } = await import('jspdf');
          const reader = new FileReader();
          reader.onload = (event) => {
            const rawText = event.target.result;
            const cleanText = rawText.replace(/\\([a-z]{1,32})(-?\\d{1,10})?[ ]?/g, '')
                                      .replace(/\{[^}]*\}/g, '')
                                      .replace(/[\{\}]/g, '');
            const doc = new jsPDF();
            const lines = doc.splitTextToSize(cleanText, 180);
            doc.text(lines, 15, 20);
            doc.save(file.name.split('.')[0] + ".pdf");
            setSuccessMessage("RTF file converted successfully!");
            setIsExecuting(false);
          };
          reader.readAsText(file);
        } catch (err) {
          setErrorMessage(err.message);
          setIsExecuting(false);
        }
      };

  return (
    <ToolLayout
      title="RTF to PDF"
      description="Convert rich text format documents (.rtf) to PDF locally."
      icon={FileText}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Convert RTF</button>
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

export default RTFtoPDF;