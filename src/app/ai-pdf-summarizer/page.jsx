"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTextFromPdf } from '../../utils/textExtractor.js';

function SummarizePdf() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [loadingText, setLoadingText] = useState(false);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setLoadingText(true);
    setSummary('');
    const text = await extractTextFromPdf(selectedFile);
    setDocumentText(text);
    setLoadingText(false);
  };

  const handleSummarize = async () => {
    if (!file || isExecuting || loadingText) return;
    setIsExecuting(true);
    setSummary('');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'user', 
              content: 'Please summarize this document. Provide a brief overview, list 3-5 key takeaways, and outline the core topics in a structured list format.' 
            }
          ],
          documentText
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setSummary(data.content);
    } catch (err) {
      console.error(err);
      setSummary(`Error: ${err.message || 'Unable to retrieve summary. Make sure you are subscribed to Pro.'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <button 
        onClick={handleSummarize} 
        className="w-full glass-button-primary text-xs flex items-center justify-center space-x-2" 
        disabled={!file || loadingText || isExecuting}
      >
        {isExecuting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Summarizing...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Generate Summary</span>
          </>
        )}
      </button>
      
      {loadingText && (
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-500 text-center animate-pulse">
          Extracting text from PDF layout...
        </div>
      )}

      {summary && (
        <div className="p-4 border rounded-xl bg-slate-50 text-xs text-slate-750 font-mono whitespace-pre-wrap leading-relaxed animate-in fade-in duration-300">
          {summary}
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="AI PDF Summarizer"
      description="Create concise structured text summaries and key outlines of any PDF document."
      icon={Sparkles}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={() => { setFile(null); setSummary(''); setDocumentText(''); }}
      controls={controls}
      onExecute={handleSummarize}
      isExecuting={isExecuting || loadingText}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default SummarizePdf;