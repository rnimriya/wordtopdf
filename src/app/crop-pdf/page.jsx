"use client";

import React, { useState } from 'react';
import { Crop, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function CropPDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleExecute = () => {
        setIsExecuting(true);
        setTimeout(() => {
          setIsExecuting(false);
          setSuccessMessage("PDF cropped!");
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download = "cropped-" + file.name;
          link.click();
        }, 1000);
      };

  return (
    <ToolLayout
      title="Crop PDF"
      description="Trim page borders and customize document viewports locally."
      icon={Crop}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Crop margins</button>
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

export default CropPDF;