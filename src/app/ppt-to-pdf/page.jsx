"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Presentation, ArrowRightLeft, Loader2, Play } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

function PptToPdf() {
  const [file, setFile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const iframeRef = useRef(null);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setSuccessMessage('');
    setErrorMessage('');
    setSlides([]);
    setActiveSlideIdx(0);
    setLoadingPreview(true);

    try {
      if (!window.JSZip) {
        throw new Error("ZIP library (JSZip) failed to load.");
      }
      
      const buffer = await selectedFile.arrayBuffer();
      const zip = await window.JSZip.loadAsync(buffer);
      
      // Filter slide XML files
      const slideFiles = [];
      zip.forEach((path, zipEntry) => {
        if (path.startsWith('ppt/slides/slide') && path.endsWith('.xml')) {
          slideFiles.push(zipEntry);
        }
      });

      // Sort files numerically by slide index
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)[0]);
        const numB = parseInt(b.name.match(/\d+/)[0]);
        return numA - numB;
      });

      if (slideFiles.length === 0) {
        throw new Error("No presentation slides identified inside PPTX file structure.");
      }

      const parsedSlides = [];
      const parser = new DOMParser();

      for (const entry of slideFiles) {
        const xmlText = await entry.async("text");
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Find all text elements <a:t>
        const textElements = xmlDoc.getElementsByTagName("a:t");
        const slideTextItems = [];
        
        for (let i = 0; i < textElements.length; i++) {
          slideTextItems.push(textElements[i].textContent);
        }

        parsedSlides.push({
          name: `Slide ${parsedSlides.length + 1}`,
          text: slideTextItems.join(' ').trim() || "No text content identified on slide."
        });
      }

      setSlides(parsedSlides);
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not parse PPTX presentation: " + err.message);
    } finally {
      setLoadingPreview(false);
    }
  };

  // Render active slide inside iframe
  useEffect(() => {
    if (slides.length > 0 && iframeRef.current) {
      const activeSlide = slides[activeSlideIdx];
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      
      const slideHtml = `
        <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              color: #334155;
              padding: 40px;
              background: #f8fafc;
              margin: 0;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              box-sizing: border-box;
            }
            .slide-card {
              border: 1px solid #e2e8f0;
              background: #ffffff;
              border-radius: 12px;
              padding: 30px;
              height: calc(100vh - 80px);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              box-sizing: border-box;
            }
            h1 {
              font-size: 24pt;
              font-weight: bold;
              color: #4f46e5;
              margin-top: 0;
              margin-bottom: 20px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 10px;
            }
            p {
              font-size: 14pt;
              line-height: 1.6;
              margin-bottom: 0;
              text-align: left;
              flex-grow: 1;
            }
            .footer {
              font-size: 10pt;
              color: #94a3b8;
              text-align: right;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="slide-card">
            <h1>${activeSlide.name}</h1>
            <p>${activeSlide.text}</p>
            <div class="footer">${activeSlide.name} of ${slides.length}</div>
          </div>
        </body>
        </html>
      `;

      doc.open();
      doc.write(slideHtml);
      doc.close();
    }
  }, [slides, activeSlideIdx]);

  const clearFile = () => {
    setFile(null);
    setSlides([]);
    setActiveSlideIdx(0);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (!file || slides.length === 0) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(10);

    try {
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape for presentation slide ratio
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = 210; // A4 landscape height in mm

      const iframe = iframeRef.current;
      if (!iframe) throw new Error("Preview sandbox is not initialized.");

      for (let i = 0; i < slides.length; i++) {
        // Change slide page and wait for iframe DOM update
        setActiveSlideIdx(i);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const iframeBody = iframe.contentDocument.body;
        
        const canvas = await html2canvas(iframeBody, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#f8fafc'
        });

        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        setProgress(Math.round(10 + (i / slides.length) * 80));
      }

      pdf.save(`${file.name.replace('.pptx', '')}.pdf`);
      setProgress(100);
      setSuccessMessage("PowerPoint slides converted to PDF successfully! Download initialized.");
      
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
      {slides.length > 1 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Select Slide
          </label>
          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
            {slides.map((slide, index) => (
              <button
                key={slide.name}
                type="button"
                onClick={() => setActiveSlideIdx(index)}
                disabled={isExecuting}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeSlideIdx === index
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900/30'
                }`}
              >
                {slide.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 text-primary-400 text-xs font-semibold flex items-center gap-2">
        <Presentation className="h-4 w-4" />
        <span>Landscape slide layout extraction</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        This converter unzips the presentation XML slides, extracts text paragraphs client-side, and compiles pages landscape-style into standard PDF slides.
      </p>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Convert PowerPoint slides to PDF landscape documents</h2>
      <p className="text-slate-400">
        Converting PowerPoint deck files (.pptx) into printable PDFs is essential for pitching documents or class handouts. Our converter reads presentation XML nodes client-side inside your browser sandbox, guaranteeing that your deck remains secure and confidential.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Slide Layout Generation</h4>
          <p className="text-xs text-slate-500">The script unzips PPTX shapes, extracts slide structures, and compiles paragraphs. Pages are rendered landscape-style onto A4 PDF sheets, ready for presenting.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Complete Data Privacy</h4>
          <p className="text-xs text-slate-500">No servers are utilized. Your sales deck files, pitch ideas, or lecture slides remain private inside your local client machine.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Convert PPT to PDF"
      description="Convert Microsoft PowerPoint (.pptx) deck slide files into PDF documents client-side."
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
      accept=".pptx"
      preview={
        slides.length > 0 ? (
          <div className="flex flex-col space-y-3 w-full">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Slide Preview</h4>
            <div className="border border-slate-800 rounded-xl bg-white overflow-hidden w-full h-[360px] shadow-inner">
              <iframe 
                ref={iframeRef} 
                title="PPT Preview Sandbox" 
                className="w-full h-full border-none"
              />
            </div>
          </div>
        ) : loadingPreview ? (
          <div className="flex flex-col items-center justify-center p-12 text-primary-500 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-xs text-slate-400">Parsing slide vector XML files...</span>
          </div>
        ) : null
      }
    />
  );
}

export default PptToPdf;
