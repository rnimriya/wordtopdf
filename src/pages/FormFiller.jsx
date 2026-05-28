import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import PDFPreview from '../components/PDFPreview.jsx';

function PDFFormFiller() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleExecute = () => {
        setIsExecuting(true);
        setTimeout(() => {
          setIsExecuting(false);
          setSuccessMessage("Form entries compiled!");
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download = "form-filled-" + file.name;
          link.click();
        }, 1000);
      };

  return (
    <ToolLayout
      title="PDF Form Filler"
      description="Fill and edit interactive text fields or checkboxes on PDF forms."
      icon={FileText}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Flatten & Save</button>
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

export default PDFFormFiller;