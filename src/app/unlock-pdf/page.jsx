"use client";

import React, { useState } from 'react';
import { LockOpen, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function UnlockPDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [pass, setPass] = useState('');
      const handleExecute = async () => {
        if (!file) return;
        setIsExecuting(true);
        try {
          const { PDFDocument } = await import('pdf-lib');
          const doc = await PDFDocument.load(await file.arrayBuffer(), { password: pass });
          const bytes = await doc.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = "unlocked-" + file.name;
          link.click();
          setSuccessMessage("Document unlocked and downloaded!");
        } catch (err) {
          setErrorMessage("Failed to unlock: " + err.message);
        } finally {
          setIsExecuting(false);
        }
      };

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove security constraints and encryption locks from documents."
      icon={LockOpen}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password..." className="glass-input text-xs" />
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Unlock PDF</button>
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

export default UnlockPDF;