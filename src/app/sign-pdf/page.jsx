"use client";

import React, { useState, useRef } from 'react';
import { PenTool } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function SignPdf() {
  const [file, setFile] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [success, setSuccess] = useState('');
  const canvasRef = useRef(null);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000';
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleSign = async () => {
    if (!file) return;
    setIsExecuting(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const page = doc.getPages()[0];
      const image = await doc.embedPng(dataUrl);
      const { width } = page.getSize();
      
      page.drawImage(image, {
        x: width - 170,
        y: 40,
        width: 120,
        height: 50
      });

      const bytes = await doc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "signed-" + file.name;
      link.click();
      setSuccess("Signature applied successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500">Draw Signature below</label>
        <canvas ref={canvasRef} width={280} height={100} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)} className="border border-dashed rounded-lg bg-slate-50 w-full" />
      </div>
      <button onClick={handleSign} className="w-full glass-button-primary text-xs" disabled={!file}>Sign PDF</button>
    </div>
  );

  return (
    <ToolLayout
      title="Sign PDF"
      description="Place visual drawn signatures on your document pages in your browser."
      icon={PenTool}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccess(''); }}
      onClear={() => { setFile(null); setSuccess(''); }}
      controls={controls}
      onExecute={handleSign}
      isExecuting={isExecuting}
      successMessage={success}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default SignPdf;