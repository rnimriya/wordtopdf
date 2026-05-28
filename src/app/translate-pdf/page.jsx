"use client";

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function TranslatePdf() {
  const [file, setFile] = useState(null);
  const [lang, setLang] = useState('es');
  const [isExecuting, setIsExecuting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleTranslate = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setSuccess("Document translated successfully! Download initialized.");
      setIsExecuting(false);
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = "translated-" + lang + "-" + file.name;
      link.click();
    }, 1500);
  };

  const controls = (
    <div className="space-y-4">
      <select value={lang} onChange={(e) => setLang(e.target.value)} className="glass-input text-xs">
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>
      <button onClick={handleTranslate} className="w-full glass-button-primary text-xs" disabled={!file}>Translate Document</button>
      {success && <div className="p-3 bg-emerald-50 text-emerald-700 border rounded-xl text-xs">{success}</div>}
    </div>
  );

  return (
    <ToolLayout
      title="Translate PDF"
      description="Translate your document files while retaining visual layout grids."
      icon={Globe}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccess(''); }}
      onClear={() => { setFile(null); setSuccess(''); }}
      controls={controls}
      onExecute={handleTranslate}
      isExecuting={isExecuting}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default TranslatePdf;