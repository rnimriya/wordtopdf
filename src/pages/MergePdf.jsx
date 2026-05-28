import React, { useState } from 'react';
import { Combine, Trash2, ArrowUp, ArrowDown, Plus, FileText, ArrowRight } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import { mergePDFs } from '../utils/pdfProcessor.js';
import confetti from 'canvas-confetti';

function MergePdf() {
  const [files, setFiles] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFiles) => {
    setSuccessMessage('');
    setErrorMessage('');
    const newFiles = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
    
    // Validate file types
    const validFiles = newFiles.filter(f => f.type === 'application/pdf');
    if (validFiles.length !== newFiles.length) {
      setErrorMessage("Some selected files were not valid PDFs and were skipped.");
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const clearFiles = () => {
    setFiles([]);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const moveFile = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    const newFiles = [...files];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIdx];
    newFiles[targetIdx] = temp;
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setErrorMessage("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const mergedBlob = await mergePDFs(files, (prog) => {
        setProgress(Math.round(10 + prog * 0.8)); // map 0-100 to 10-90
      });
      
      setProgress(95);
      
      // Download file
      const url = URL.createObjectURL(mergedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged-document-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      setSuccessMessage("PDF files merged successfully! Your download should start automatically.");
      
      // Explosion confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("Error merging PDF documents: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">How to merge PDF files online safely</h2>
      <p className="text-slate-400">
        Merging multiple documents is one of the most common tasks. However, conventional websites force you to upload your files, putting your privacy at risk. Our tool performs all operations directly in your browser. Files are loaded into local memory, merged via client-side scripts, and downloaded instantly.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">1. Select PDFs</h4>
          <p className="text-xs text-slate-500">Drag and drop your PDF files into the compiler space above. You can add more files at any point.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">2. Organize Order</h4>
          <p className="text-xs text-slate-500">Reorder your files using the Up/Down keys. The final PDF will stack in the exact list order.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">3. Download Merged File</h4>
          <p className="text-xs text-slate-500">Click the Merge button. Compilation runs client-side and triggers a direct browser download.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Merge PDF Documents"
      description="Combine multiple PDF documents into a single file directly in your browser."
      icon={Combine}
      file={files.length > 0 ? files : null}
      onFileSelect={handleFileSelect}
      onClear={clearFiles}
      onExecute={handleMerge}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
      multiple={true}
    >
      {/* Custom Multiple File Workspace */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="font-display font-bold text-lg text-white">Selected PDF Files</h3>
          <button
            onClick={clearFiles}
            disabled={isExecuting}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* File List */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {files.map((file, idx) => (
            <div 
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-slate-800 transition-all"
            >
              <div className="flex items-center space-x-3 truncate">
                <FileText className="h-5 w-5 text-primary-500 shrink-0" />
                <div className="truncate">
                  <h4 className="font-medium text-white text-sm truncate max-w-[200px] sm:max-w-[400px]">
                    {file.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => moveFile(idx, 'up')}
                  disabled={idx === 0 || isExecuting}
                  className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveFile(idx, 'down')}
                  disabled={idx === files.length - 1 || isExecuting}
                  className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  disabled={isExecuting}
                  className="p-1.5 rounded-lg border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/5 text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Append more files area */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full">
            <label className="flex items-center justify-center space-x-2 w-full p-4 border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 hover:bg-slate-950/40 rounded-xl cursor-pointer text-sm text-slate-400 hover:text-white transition-all">
              <Plus className="h-4 w-4 text-primary-500" />
              <span>Add more PDF files</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                multiple
                onChange={(e) => e.target.files && handleFileSelect(Array.from(e.target.files))}
                disabled={isExecuting}
              />
            </label>
          </div>
          
          <button
            onClick={handleMerge}
            disabled={files.length < 2 || isExecuting}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none shadow-lg shadow-primary-500/10"
          >
            <span>Merge Documents</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}

export default MergePdf;
