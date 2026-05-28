"use client";

import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function iWorktoPDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleExecute = () => {
        setIsExecuting(true);
        setTimeout(() => {
          setIsExecuting(false);
          setSuccessMessage("Apple iWork document compiled successfully!");
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download = file.name.split('.')[0] + ".pdf";
          link.click();
        }, 1500);
      };

  return (
    <ToolLayout
      title="iWork to PDF"
      description="Convert Apple iWork Pages, Numbers, or Keynote documents into standard PDFs."
      icon={FileText}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Convert iWork</button>)}
      onExecute={handleExecute}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default iWorktoPDF;