import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import PDFPreview from '../components/PDFPreview.jsx';

function DeletePDFPages() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [pagesToDelete, setPagesToDelete] = useState('');
      const handleExecute = async () => {
        if (!file) return;
        setIsExecuting(true);
        setProgress(25);
        try {
          const { PDFDocument } = await import('pdf-lib');
          const doc = await PDFDocument.load(await file.arrayBuffer());
          const pageCount = doc.getPageCount();
          setProgress(55);

          const toRemove = pagesToDelete.split(',')
            .map(p => Number(p.trim()) - 1)
            .filter(idx => idx >= 0 && idx < pageCount)
            .sort((a, b) => b - a);

          toRemove.forEach(idx => doc.removePage(idx));
          setProgress(80);

          const bytes = await doc.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = "deleted-" + file.name;
          link.click();
          URL.revokeObjectURL(url);
          setProgress(100);
          setSuccessMessage("Selected pages deleted successfully!");
        } catch (err) {
          setErrorMessage("Failed: " + err.message);
        } finally {
          setIsExecuting(false);
        }
      };

  return (
    <ToolLayout
      title="Delete PDF Pages"
      description="Remove specific pages from a PDF document client-side."
      icon={Trash2}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <input type="text" value={pagesToDelete} onChange={(e) => setPagesToDelete(e.target.value)} placeholder="e.g. 2, 4" className="glass-input text-xs" />
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file || isExecuting}>Delete Pages</button>
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

export default DeletePDFPages;