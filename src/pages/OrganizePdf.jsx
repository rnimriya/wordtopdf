import React, { useState } from 'react';
import { LayoutGrid, Loader2 } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import PDFPreview from '../components/PDFPreview.jsx';

function OrganizePDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [order, setOrder] = useState('');
      const handleExecute = async () => {
        if (!file) return;
        setIsExecuting(true);
        try {
          const { PDFDocument } = await import('pdf-lib');
          const srcDoc = await PDFDocument.load(await file.arrayBuffer());
          const pageCount = srcDoc.getPageCount();
          const indices = order.split(',').map(p => Number(p.trim()) - 1).filter(idx => idx >= 0 && idx < pageCount);

          const destDoc = await PDFDocument.create();
          const copied = await destDoc.copyPages(srcDoc, indices);
          copied.forEach(p => destDoc.addPage(p));

          const bytes = await destDoc.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = "organized-" + file.name;
          link.click();
          setSuccessMessage("Reordering complete!");
        } catch (err) {
          setErrorMessage("Failed: " + err.message);
        } finally {
          setIsExecuting(false);
        }
      };

  return (
    <ToolLayout
      title="Organize PDF"
      description="Rearrange, delete, and sort pages visually in your browser."
      icon={LayoutGrid}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <input type="text" value={order} onChange={(e) => setOrder(e.target.value)} placeholder="e.g. 3, 2, 1" className="glass-input text-xs" />
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Reorder PDF</button>
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

export default OrganizePDF;