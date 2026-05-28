import React, { useState } from 'react';
import { Split, Loader2 } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import PDFPreview from '../components/PDFPreview.jsx';

function SplitPDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [splitRange, setSplitRange] = useState('');
      const handleExecute = async () => {
        if (!file) return;
        setIsExecuting(true);
        setSuccessMessage('');
        setErrorMessage('');
        setProgress(20);
        try {
          const { PDFDocument } = await import('pdf-lib');
          const arrayBuffer = await file.arrayBuffer();
          const srcDoc = await PDFDocument.load(arrayBuffer);
          const pageCount = srcDoc.getPageCount();
          setProgress(50);

          let pagesToExtract = [];
          if (splitRange.trim()) {
            splitRange.split(',').forEach(p => {
              p = p.trim();
              if (p.includes('-')) {
                const [start, end] = p.split('-').map(Number);
                for (let i = start; i <= end; i++) pagesToExtract.push(i - 1);
              } else {
                pagesToExtract.push(Number(p) - 1);
              }
            });
          } else {
            pagesToExtract.push(0);
          }

          const destDoc = await PDFDocument.create();
          const copied = await destDoc.copyPages(srcDoc, pagesToExtract.filter(idx => idx >= 0 && idx < pageCount));
          copied.forEach(p => destDoc.addPage(p));
          setProgress(80);

          const bytes = await destDoc.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = "split-" + file.name;
          link.click();
          URL.revokeObjectURL(url);
          setProgress(100);
          setSuccessMessage("PDF split completed successfully!");
        } catch (err) {
          setErrorMessage("Failed to split PDF: " + err.message);
        } finally {
          setIsExecuting(false);
        }
      };

  return (
    <ToolLayout
      title="Split PDF"
      description="Slice PDF files and extract pages locally in your browser."
      icon={Split}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <input type="text" value={splitRange} onChange={(e) => setSplitRange(e.target.value)} placeholder="e.g. 1-2, 4" className="glass-input text-xs" />
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file || isExecuting}>Split PDF</button>
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

export default SplitPDF;