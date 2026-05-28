"use client";

import React, { useState } from 'react';
import { Shrink, Sparkles, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { compressPDF } from '../../utils/pdfProcessor.js';
import confetti from 'canvas-confetti';

function CompressPdf() {
  const [file, setFile] = useState(null);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const clearFile = () => {
    setFile(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(20);

    try {
      const compressedBlob = await compressPDF(file, { removeMetadata }, (prog) => {
        setProgress(Math.round(20 + prog * 0.7));
      });
      
      setProgress(95);

      const url = URL.createObjectURL(compressedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compressed-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      
      // Calculate compression stats
      const originalSize = file.size;
      const compressedSize = compressedBlob.size;
      const reduction = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

      setSuccessMessage(`PDF compressed successfully! File size reduced by ${reduction}% (from ${(originalSize/1024/1024).toFixed(2)} MB to ${(compressedSize/1024/1024).toFixed(2)} MB).`);
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("Compression failed: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Compression Mode
        </label>
        <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 text-primary-400 text-xs font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Optimal Client-Side Stream Compression</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
        <input
          type="checkbox"
          id="removeMetadata"
          checked={removeMetadata}
          onChange={(e) => setRemoveMetadata(e.target.checked)}
          disabled={isExecuting}
          className="h-4.5 w-4.5 rounded border-slate-700 bg-slate-900 text-primary-500 focus:ring-primary-500"
        />
        <label htmlFor="removeMetadata" className="text-xs text-slate-300 font-medium select-none cursor-pointer">
          Scrub document metadata (Author, Subject, Keywords)
        </label>
      </div>

      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1.5">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-secondary-500" />
          What is compressed?
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          This tool runs stream compression algorithms on the structural data of the document and clears indexing metadata to optimize layout sizes without downscaling vector text.
        </p>
      </div>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Optimize and reduce PDF size locally</h2>
      <p className="text-slate-400">
        Large PDF files can be difficult to send via email or upload to online forms. Our compressor optimizes structural elements in your PDF document, removing duplicate objects and cleaning metadata to reduce file sizes safely, all right inside your web browser.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Safe and Private</h4>
          <p className="text-xs text-slate-500">Because your files are never transmitted across the network to external servers, your secure financial audits, credentials, or private documents stay completely confidential inside your browser tab.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Visual Preservation</h4>
          <p className="text-xs text-slate-500">Vector fonts, mathematical charts, and geometric lines are preserved exactly as they are. The structural page tree is reorganized for fast web viewing without modifying printable layouts.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Compress PDF File"
      description="Reduce PDF file size in your browser without sacrificing formatting quality."
      icon={Shrink}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={clearFile}
      controls={controls}
      onExecute={handleCompress}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
      preview={file && <PDFPreview file={file} pageNumber={1} scale={0.8} />}
    />
  );
}

export default CompressPdf;
