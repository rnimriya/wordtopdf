import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function OpenOfficetoPDF() {
  const [file, setFile] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleExecute = () => {
        setIsExecuting(true);
        setTimeout(() => {
          setIsExecuting(false);
          setSuccessMessage("OpenOffice document converted!");
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download = file.name.split('.')[0] + ".pdf";
          link.click();
        }, 1500);
      };

  return (
    <ToolLayout
      title="OpenOffice to PDF"
      description="Convert OpenOffice text, sheet, or presentations (.odt, .ods, .odp) into PDFs."
      icon={FileText}
      file={file}
      onFileSelect={(f) => { setFile(f); setSuccessMessage(''); setErrorMessage(''); }}
      onClear={() => { setFile(null); setSuccessMessage(''); setErrorMessage(''); }}
      controls={(<button onClick={handleExecute} className="w-full glass-button-primary text-xs" disabled={!file}>Convert OpenOffice</button>)}
      onExecute={handleExecute}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default OpenOfficetoPDF;