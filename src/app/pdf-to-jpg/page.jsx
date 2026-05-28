"use client";

import React, { useState } from 'react';
import { Image, Download, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import * as pdfjs from 'pdfjs-dist';
import confetti from 'canvas-confetti';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

function PdfToJpg() {
  const [file, setFile] = useState(null);
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

  const handleConvert = async () => {
    if (!file) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;

      const imageBlobs = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        
        // Render PDF page to canvas at high scale (2.0) for high-resolution images
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 2.0 });
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
        if (blob) {
          imageBlobs.push(blob);
        }

        setProgress(Math.round(10 + (pageNum / totalPages) * 70));
      }

      setProgress(85);

      if (imageBlobs.length === 1) {
        // Direct download for single page
        const url = URL.createObjectURL(imageBlobs[0]);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.name.replace('.pdf', '')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // ZIP download for multiple pages
        if (!window.JSZip) {
          throw new Error("ZIP library (JSZip) failed to load.");
        }
        
        const zip = new window.JSZip();
        imageBlobs.forEach((blob, idx) => {
          zip.file(`page_${idx + 1}.jpg`, blob);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.name.replace('.pdf', '')}-jpg.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setProgress(100);
      setSuccessMessage(`Successfully rendered ${imageBlobs.length} page(s) to high-resolution JPEG images! Check your downloads.`);
      
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("Conversion failed: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 text-primary-400 text-xs font-semibold flex items-center gap-2">
        <Image className="h-4 w-4" />
        <span>High-Resolution Rendering Mode (2.0x)</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        This converter renders every page vector layout onto a canvas at double scaling, downloading a crystal-clear JPEG image file for each page.
      </p>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Convert PDF pages to high-quality JPEG images locally</h2>
      <p className="text-slate-400">
        If you need to share a PDF document as pictures on social media, upload page layouts to forms, or store slides as image attachments, this tool renders them client-side. Pages are compiled into high-resolution JPG images and packaged into a ZIP archive without any server uploading.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Crisp Rendering Scale</h4>
          <p className="text-xs text-slate-500">The script renders vector glyphs, borders, and margins at a double layout scale, ensuring text is legible even when zoomed in.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Absolute File Safety</h4>
          <p className="text-xs text-slate-500">Documents remain private. All canvas allocations take place inside your local computer's browser window sandbox.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Convert PDF to JPG"
      description="Render PDF document pages into high-resolution JPG image files client-side."
      icon={Image}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={clearFile}
      controls={controls}
      onExecute={handleConvert}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
      preview={file && <PDFPreview file={file} pageNumber={1} scale={0.8} />}
    />
  );
}

export default PdfToJpg;
