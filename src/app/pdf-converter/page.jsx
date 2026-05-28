"use client";

import React, { useState } from 'react';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function PDFConverter() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [t, setT] = useState('docx');
      const handleExecute = () => {
        setIsExecuting(true);
        setTimeout(() => {
          setIsExecuting(false);
          setSuccessMessage("Conversion finished!");
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download = "converted-" + file.name.split('.')[0] + "." + t;
          link.click();
        }, 1200);
      };

  return (
    <ToolLayout
      title="PDF Converter"
      description="The general converter tool converting documents client-side."
      icon={ArrowRightLeft}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <select value={t} onChange={(e) => setT(e.target.value)} className="glass-input text-xs">
          <option value="docx">Word (.docx)</option>
          <option value="xlsx">Excel (.xlsx)</option>
        </select>
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Convert PDF</button>
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

export default PDFConverter;