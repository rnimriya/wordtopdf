import React, { useState } from 'react';
import { KeyRound, Lock, Eye, EyeOff } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import PDFPreview from '../components/PDFPreview.jsx';
import { protectPDF } from '../utils/pdfProcessor.js';
import confetti from 'canvas-confetti';

function ProtectPdf() {
  const [file, setFile] = useState(null);
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    setUserPassword('');
    setConfirmPassword('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleProtect = async () => {
    if (!file) return;
    if (!userPassword) {
      setErrorMessage("Please enter a password to protect your PDF file.");
      return;
    }
    if (userPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify passwords.");
      return;
    }

    setIsExecuting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setProgress(15);

    try {
      const protectedBlob = await protectPDF(file, userPassword, userPassword, (prog) => {
        setProgress(Math.round(15 + prog * 0.8));
      });
      
      setProgress(95);

      const url = URL.createObjectURL(protectedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `protected-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      setSuccessMessage("PDF password protection applied successfully! Document download initialized.");
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMessage("Encryption failed: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Set Open Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            disabled={isExecuting}
            placeholder="Enter password"
            className="glass-input pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Confirm Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isExecuting}
          placeholder="Re-enter password"
          className="glass-input"
        />
      </div>

      <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Lock className="h-3 w-3 text-primary-500" />
          Real Encryption (AES/RC4)
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          This applies a real cryptographic lock to the document. Any standard PDF viewer (e.g. Acrobat Reader, Chrome, macOS Preview) will require this password to open it.
        </p>
      </div>
    </div>
  );

  const seoContent = (
    <div className="prose prose-invert max-w-none space-y-6">
      <h2 className="text-2xl font-bold font-display text-white">Secure your PDF files directly in the browser</h2>
      <p className="text-slate-400">
        Password protecting files is vital when handling sensitive information like tax returns, medical files, legal agreements, or financial budgets. Our tool operates purely on the client side, meaning the cryptographic calculations take place in your browser cache.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">How is it secured?</h4>
          <p className="text-xs text-slate-500">The PDF is encrypted using a cryptographic dictionary handler. This means the actual contents of the page objects are scrambled. Standard PDF applications cannot parse the contents without the corresponding password key.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Best Practices</h4>
          <p className="text-xs text-slate-500">Always use a strong, unique password of at least 8 characters containing numbers and symbols. Make sure to remember your password, as client-side encryption cannot be recovered by us.</p>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Protect PDF Document"
      description="Add password encryption to your PDF document client-side for maximum security."
      icon={KeyRound}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={clearFile}
      controls={controls}
      onExecute={handleProtect}
      isExecuting={isExecuting}
      progress={progress}
      successMessage={successMessage}
      errorMessage={errorMessage}
      seoContent={seoContent}
      preview={file && <PDFPreview file={file} pageNumber={1} scale={0.8} />}
    />
  );
}

export default ProtectPdf;
