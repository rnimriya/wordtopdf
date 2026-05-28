"use client";

import React, { useState } from 'react';
import { Printer, Camera } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';

function PdfScanner() {
  const [image, setImage] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCompile = async () => {
    if (!image) return;
    setIsExecuting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.addImage(image, 'JPEG', 10, 10, 190, 277);
      doc.save('scan-output.pdf');
      setSuccess("Scan successfully compiled to PDF!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <label className="flex items-center justify-center space-x-2 w-full p-4 border border-dashed rounded-xl cursor-pointer text-xs bg-slate-50 text-slate-700">
        <Camera className="h-4 w-4" />
        <span>Capture from Camera</span>
        <input type="file" accept="image/*" capture="environment" onChange={handleCapture} className="hidden" />
      </label>
      <button onClick={handleCompile} className="w-full glass-button-primary text-xs" disabled={!image}>Compile to PDF</button>
    </div>
  );

  return (
    <ToolLayout
      title="PDF Scanner"
      description="Scan documents using your device webcam or camera."
      icon={Printer}
      file={image ? new File([], 'captured.jpg') : null}
      onFileSelect={() => {}}
      onClear={() => { setImage(null); setSuccess(''); }}
      controls={controls}
      onExecute={handleCompile}
      isExecuting={isExecuting}
      successMessage={success}
      preview={image && <div className="p-4 border rounded-xl bg-slate-50"><img src={image} className="max-h-60 mx-auto" /></div>}
    />
  );
}

export default PdfScanner;