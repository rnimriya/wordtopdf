import React, { useState } from 'react';
import { FileDigit, Loader2 } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import PDFPreview from '../components/PDFPreview.jsx';

function NumberPages() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [pos, setPos] = useState('bottom-center');
      const handleExecute = async () => {
        if (!file) return;
        setIsExecuting(true);
        setProgress(30);
        try {
          const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
          const doc = await PDFDocument.load(await file.arrayBuffer());
          const pages = doc.getPages();
          const pageCount = pages.length;
          const font = await doc.embedFont(StandardFonts.Helvetica);
          setProgress(60);

          for (let i = 0; i < pageCount; i++) {
            const page = pages[i];
            const { width } = page.getSize();
            const text = "Page " + (i + 1) + " of " + pageCount;
            const textWidth = font.widthOfTextAtSize(text, 9);
            const x = pos === 'bottom-center' ? (width / 2 - textWidth / 2) : (width - textWidth - 30);
            
            page.drawText(text, {
              x: x,
              y: 20,
              size: 9,
              font: font,
              color: rgb(0.2, 0.2, 0.2)
            });
          }
          setProgress(85);
          const bytes = await doc.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = "numbered-" + file.name;
          link.click();
          setProgress(100);
          setSuccessMessage("Pages stamped successfully!");
        } catch (err) {
          setErrorMessage("Failed: " + err.message);
        } finally {
          setIsExecuting(false);
        }
      };

  return (
    <ToolLayout
      title="Number Pages"
      description="Stamp page numbers programmatically in PDF document headers/footers."
      icon={FileDigit}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<div className="space-y-4">
        <select value={pos} onChange={(e) => setPos(e.target.value)} className="glass-input text-xs">
          <option value="bottom-center">Bottom Center</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
        <button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Number Pages</button>
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

export default NumberPages;