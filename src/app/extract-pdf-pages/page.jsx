"use client";

import React, { useState } from 'react';
import { Scissors, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function ExtractPDFPages() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [keep, setKeep] = useState('');
      const handleExecute = async () => {
        if (!file) return;
        setIsExecuting(true);
        try {
          const { PDFDocument } = await import('pdf-lib');
          const srcDoc = await PDFDocument.load(await file.arrayBuffer());
          const pageCount = srcDoc.getPageCount();
          const toKeep = keep.split(',').map(p => Number(p.trim()) - 1).filter(idx => idx >= 0 && idx < pageCount);

          const destDoc = await PDFDocument.create();
          const copied = await destDoc.copyPages(srcDoc, toKeep);
          copied.forEach(p => destDoc.addPage(p));

          const bytes = await destDoc.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = "extracted-" + file.name;
          link.click();
          setSuccessMessage("Pages extracted successfully!");
        } catch (err) {
          setErrorMessage("Failed: " + err.message);
        } finally {
          setIsExecuting(false);
        }
      };

  return (
    <ToolLayout
      title="Extract PDF Pages"
      description="Select and extract specific pages into a new PDF document."
      icon={Scissors}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <input type="text" value={keep} onChange={(e) => setKeep(e.target.value)} placeholder="e.g. 1, 3" className="glass-input text-xs" />
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Extract Pages</button>
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

export default ExtractPDFPages;