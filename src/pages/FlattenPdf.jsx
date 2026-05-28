import React, { useState } from 'react';
import { Scaling, Loader2 } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import PDFPreview from '../components/PDFPreview.jsx';

function FlattenPDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleExecute = async () => {
        if (!file) return;
        setIsExecuting(true);
        try {
          const { PDFDocument } = await import('pdf-lib');
          const doc = await PDFDocument.load(await file.arrayBuffer());
          const form = doc.getForm();
          form.flatten();
          
          const bytes = await doc.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = "flattened-" + file.name;
          link.click();
          setSuccessMessage("Forms flattened successfully!");
        } catch (err) {
          setErrorMessage("Failed: " + err.message);
        } finally {
          setIsExecuting(false);
        }
      };

  return (
    <ToolLayout
      title="Flatten PDF"
      description="Flatten PDF forms and annotations into non-editable vector paths."
      icon={Scaling}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Flatten PDF</button>
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

export default FlattenPDF;