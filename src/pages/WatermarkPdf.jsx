import React, { useState } from 'react';
import { Stamp, Loader2 } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import PDFPreview from '../components/PDFPreview.jsx';

function WatermarkPDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [watermark, setWatermark] = useState('CONFIDENTIAL');
      const handleExecute = async () => {
        if (!file) return;
        setIsExecuting(true);
        setProgress(30);
        try {
          const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
          const doc = await PDFDocument.load(await file.arrayBuffer());
          const font = await doc.embedFont(StandardFonts.HelveticaBold);
          const pages = doc.getPages();
          setProgress(60);

          pages.forEach(page => {
            const { width, height } = page.getSize();
            page.drawText(watermark, {
              x: width / 6,
              y: height / 3,
              size: 40,
              font: font,
              color: rgb(0.8, 0.1, 0.1),
              opacity: 0.15,
              rotate: { angle: 30 }
            });
          });
          setProgress(85);
          const bytes = await doc.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = "watermarked-" + file.name;
          link.click();
          setProgress(100);
          setSuccessMessage("Watermark applied successfully!");
        } catch (err) {
          setErrorMessage("Failed: " + err.message);
        } finally {
          setIsExecuting(false);
        }
      };

  return (
    <ToolLayout
      title="Watermark PDF"
      description="Overlay text watermark stamps with custom opacity levels."
      icon={Stamp}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <input type="text" value={watermark} onChange={(e) => setWatermark(e.target.value)} placeholder="Watermark text..." className="glass-input text-xs" />
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Apply Watermark</button>
      </div>)}
      onExecute={handleExecute}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default WatermarkPDF;