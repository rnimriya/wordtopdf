import React, { useState, useEffect } from 'react';
import { Image, Download, Loader2, ArrowRight } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

function JpgToPdf() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (selectedFiles) => {
    setSuccessMessage('');
    setErrorMessage('');
    const newFiles = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
    
    // Validate image format
    const validFiles = newFiles.filter(f => f.type.startsWith('image/'));
    if (validFiles.length !== newFiles.length) {
      setErrorMessage("Some files were not valid images and were skipped.");
    }
    
    setFiles(prev => [...prev, ...validFiles]);

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const clearFiles = () => {
    setFiles([]);
    setPreviews([]);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setErrorMessage("Please select at least one image file.");
      return;
    }

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(15);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210; // mm
      const pdfHeight = 295; // mm

      for (let i = 0; i < previews.length; i++) {
        const imgData = previews[i];

        if (i > 0) {
          pdf.addPage();
        }

        // We load the image to read its dimensions to fit nicely on the A4 page
        const img = await new Promise((resolve, reject) => {
          const image = new window.Image();
          image.onload = () => resolve(image);
          image.onerror = (e) => reject(new Error("Could not load image resource."));
          image.src = imgData;
        });

        // Calculate aspect ratios to fit the image on the PDF page
        const ratio = img.width / img.height;
        let w = pdfWidth - 20; // 10mm margins
        let h = w / ratio;

        if (h > pdfHeight - 20) {
          h = pdfHeight - 20;
          w = h * ratio;
        }

        const x = (pdfWidth - w) / 2;
        const y = (pdfHeight - h) / 2;

        pdf.addImage(imgData, 'JPEG', x, y, w, h);
        setProgress(Math.round(15 + (i / previews.length) * 75));
      }

      pdf.save(`images-${Date.now()}.pdf`);
      setProgress(100);
      setSuccessMessage("Images successfully compiled to PDF! Download initialized.");
      
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
        <span>A4 Layout auto-fitting mode</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        This compiler automatically scales your images to fit within standard A4 PDF pages while maintaining original visual aspect ratios and image qualities.
      </p>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Convert photos and images to PDFs locally</h2>
      <p className="text-slate-400">
        If you have scanned pictures, document photos, or layouts that you need to compile into a single printable PDF file, this tool processes them directly client-side. Select multiple images and download them compiled as a single PDF.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Lossless Image Fitting</h4>
          <p className="text-xs text-slate-500">Images are positioned on standard A4 layout sheets, centered with automatic safety margins, preserving high resolution details without layout clipping.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Privacy Guaranteed</h4>
          <p className="text-xs text-slate-500">Image bytes remain stored in local buffer memories inside your browser sandbox, keeping your private snapshots safe.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Convert JPG/PNG to PDF"
      description="Convert photo and image files into a single compiled PDF document client-side."
      icon={Image}
      file={files.length > 0 ? files : null}
      onFileSelect={handleFileSelect}
      onClear={clearFiles}
      controls={controls}
      onExecute={handleConvert}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
      accept="image/*"
      multiple={true}
    >
      {/* Overridden multi-image list workspace */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="font-display font-bold text-lg text-white">Selected Images</h3>
          <button
            onClick={clearFiles}
            disabled={isExecuting}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Thumbnail Preview Area */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 max-h-[300px] overflow-y-auto pr-2">
          {previews.map((src, idx) => (
            <div 
              key={`img-pre-${idx}`}
              className="relative border border-slate-800 rounded-xl overflow-hidden p-2 bg-slate-950/40"
            >
              <div className="absolute top-2 right-2 bg-slate-950/80 px-1.5 py-0.5 rounded text-[8px] font-semibold text-slate-400 border border-slate-800">
                #{idx + 1}
              </div>
              <div className="flex items-center justify-center p-1 min-h-[90px]">
                <img 
                  src={src} 
                  alt="preview"
                  className="max-h-20 object-contain shadow rounded bg-slate-900"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full">
            <label className="flex items-center justify-center space-x-2 w-full p-4 border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 hover:bg-slate-950/40 rounded-xl cursor-pointer text-sm text-slate-400 hover:text-white transition-all">
              <PlusIcon className="h-4 w-4 text-primary-500" />
              <span>Add more images</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFileSelect(Array.from(e.target.files))}
                disabled={isExecuting}
              />
            </label>
          </div>
          
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || isExecuting}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg"
          >
            <span>Convert to PDF</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}

// Simple internal helper icon to prevent missing reference compiles
function PlusIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

export default JpgToPdf;
