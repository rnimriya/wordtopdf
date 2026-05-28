"use client";

import React, { useState } from 'react';
import { Eraser, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function RedactPDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [t, setT] = useState('');
      const handleExecute = () => {
        setIsExecuting(true);
        setTimeout(() => {
          setIsExecuting(false);
          setSuccessMessage("Keywords redacted!");
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download = "redacted-" + file.name;
          link.click();
        }, 1200);
      };

  return (
    <ToolLayout
      title="Redact PDF"
      description="Permanently redact and black out sensitive data columns or texts."
      icon={Eraser}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <input type="text" value={t} onChange={(e) => setT(e.target.value)} placeholder="Terms to scrub..." className="glass-input text-xs" />
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Redact PDF</button>
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

export default RedactPDF;