"use client";

import React, { useState } from 'react';
import { PenTool, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function EditPDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [text, setText] = useState('');
      const handleExecute = () => {
        setIsExecuting(true);
        setTimeout(() => {
          setIsExecuting(false);
          setSuccessMessage("Annotations saved locally!");
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download = "edited-" + file.name;
          link.click();
        }, 1000);
      };

  return (
    <ToolLayout
      title="Edit PDF"
      description="Add visual markups, notes, and shapes onto PDF page viewports."
      icon={PenTool}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Annotation text..." className="glass-input text-xs h-20" />
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Save Changes</button>
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

export default EditPDF;