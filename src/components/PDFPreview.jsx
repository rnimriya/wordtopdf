import React, { useState, useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Loader2, AlertCircle } from 'lucide-react';

// Configure the pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

function PDFPreview({ file, pageNumber = 1, scale = 1.0, onLoadSuccess, className = "" }) {
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  // Load the PDF Document
  useEffect(() => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const loadDocument = async () => {
      try {
        let loadingTask;

        if (file instanceof File || file instanceof Blob) {
          const arrayBuffer = await file.arrayBuffer();
          loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        } else if (typeof file === 'string') {
          // Assume it is a Blob URL or standard URL
          loadingTask = pdfjs.getDocument(file);
        } else if (file instanceof ArrayBuffer || ArrayBuffer.isView(file)) {
          loadingTask = pdfjs.getDocument({ data: file });
        } else {
          throw new Error("Unsupported file type for preview");
        }

        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);
        setLoading(false);

        if (onLoadSuccess) {
          onLoadSuccess({ numPages: loadedPdf.numPages });
        }
      } catch (err) {
        console.error("PDF loading error:", err);
        setError("Failed to load PDF file preview.");
        setLoading(false);
      }
    };

    loadDocument();
  }, [file]);

  // Render the specific Page
  useEffect(() => {
    if (!pdf) return;

    const renderPage = async () => {
      try {
        // Cancel existing render task if running
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await pdf.getPage(pageNumber);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        
        // Calculate dimensions
        const viewport = page.getViewport({ scale });
        
        // Handle High-DPI screens
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : null;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          transform: transform
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        
        await renderTask.promise;
        renderTaskRef.current = null;
      } catch (err) {
        if (err.name !== 'RenderingCancelledException') {
          console.error("PDF rendering error:", err);
          setError("Failed to render page preview.");
        }
      }
    };

    renderPage();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdf, pageNumber, scale]);

  return (
    <div className={`flex items-center justify-center p-4 border border-slate-200 bg-slate-50/50 rounded-xl min-h-[300px] relative ${className}`}>
      {loading && (
        <div className="flex flex-col items-center space-y-2 text-primary-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xs text-slate-600">Loading document preview...</span>
        </div>
      )}
      
      {error && (
        <div className="flex flex-col items-center space-y-2 text-rose-500 max-w-xs text-center">
          <AlertCircle className="h-8 w-8" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        className={`shadow-lg bg-white rounded-md max-w-full ${loading || error ? 'hidden' : 'block'}`}
      />
    </div>
  );
}

export default PDFPreview;
