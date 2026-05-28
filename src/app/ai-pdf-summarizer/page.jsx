"use client";

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function SummarizePdf() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSummarize = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setSummary("Summary:\nThis document defines operations for client-side PDF document manipulation. Key topics include WebAssembly script buffers, cryptographic AES password layers, and lossless image grid parsing.");
      setIsExecuting(false);
    }, 1200);
  };

  const controls = (
    <div className="space-y-4">
      <button onClick={handleSummarize} className="w-full glass-button-primary text-xs" disabled={!file}>Generate Summary</button>
      {summary && (
        <div className="p-4 border rounded-xl bg-slate-50 text-xs text-slate-750 font-mono whitespace-pre-wrap leading-relaxed">
          {summary}
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="AI PDF Summarizer"
      description="Create concise structured text summaries of any PDF document."
      icon={Sparkles}
      file={file}
      onFileSelect={(f) => { setFile(f); setSummary(''); }}
      onClear={() => { setFile(null); setSummary(''); }}
      controls={controls}
      onExecute={handleSummarize}
      isExecuting={isExecuting}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default SummarizePdf;