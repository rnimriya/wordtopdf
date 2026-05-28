"use client";

import React, { useState } from 'react';
import { Presentation, ArrowRightLeft, FileText } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTextFromPDF } from '../../utils/docxParser.js';
import pptxgen from 'pptxgenjs';
import confetti from 'canvas-confetti';

function PdfToPpt() {
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
      // 1. Extract text and pages from PDF
      const { pages } = await extractTextFromPDF(file, (prog) => {
        setProgress(Math.round(10 + prog * 0.7)); // Map 0-100 to 10-80
      });
      
      setProgress(85);

      // 2. Instantiate PPTX presentation client-side
      const pres = new pptxgen();
      
      pages.forEach((pageText, idx) => {
        const slide = pres.addSlide();
        
        // Add slide background
        slide.background = { fill: "F8FAFC" };
        
        // Add header title
        slide.addText(`Slide ${idx + 1}`, { 
          x: 0.5, 
          y: 0.4, 
          w: "90%", 
          fontSize: 24, 
          bold: true,
          color: "4F46E5" 
        });

        // Filter text and add to slide body
        const filteredLines = pageText.split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 2);
          
        const textContent = filteredLines.join('\n\n');

        // Add body text container
        slide.addText(textContent || "No text identified on page.", { 
          x: 0.5, 
          y: 1.2, 
          w: "90%", 
          h: "75%", 
          fontSize: 12,
          color: "334155",
          align: "left",
          valign: "top",
          lineSpacing: 18
        });
      });

      setProgress(95);

      // 3. Save / Download PowerPoint File
      await pres.writeFile({ fileName: `${file.name.replace('.pdf', '')}.pptx` });

      setProgress(100);
      setSuccessMessage("PDF pages successfully converted to PowerPoint presentation (.pptx)! Check your downloads folder.");
      
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
        <Presentation className="h-4 w-4" />
        <span>Presentation Slide Assembly Mode</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        This converter maps each page of the source PDF into a structured slide, embedding extracted text blocks dynamically as editable PowerPoint layout shapes.
      </p>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Convert PDF documents to PowerPoint presentations client-side</h2>
      <p className="text-slate-400">
        If you need to present slides from a PDF report, copy-pasting text slide-by-slide is exhausting. Our parser parses the page tree structure, extracts paragraphs, and instantiates a native PowerPoint presentation (.pptx) entirely in your browser cache.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Editable Text Blocks</h4>
          <p className="text-xs text-slate-500">The PowerPoint document features actual text boxes that you can click, customize, recolor, and format using MS PowerPoint or Google Slides, rather than static image snapshots.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Zero Network Footprint</h4>
          <p className="text-xs text-slate-500">Calculated locally. Perfect for corporate audits, deck pitches, or class lessons where document data must remain private.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Convert PDF to PowerPoint"
      description="Extract text from a PDF document pages and compile them into a PowerPoint presentation (.pptx)."
      icon={Presentation}
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

export default PdfToPpt;
