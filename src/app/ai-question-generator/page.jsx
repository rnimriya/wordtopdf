"use client";

import React, { useState } from 'react';
import { FileCode } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function QuestionGen() {
  const [file, setFile] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleGenerate = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setQuiz([
        { q: "What security layer is applied?", a: "Direct local browser memory sandboxing." },
        { q: "Do files upload to Word To PDF Convertor?", a: "No, they compile strictly inside client WebAssembly." }
      ]);
      setIsExecuting(false);
    }, 1500);
  };

  const controls = (
    <div className="space-y-4">
      <button onClick={handleGenerate} className="w-full glass-button-primary text-xs" disabled={!file}>Generate Flashcards</button>
      {quiz.map((item, idx) => (
        <div key={idx} className="p-3 border rounded-xl bg-slate-50 text-xs">
          <p className="font-bold text-slate-800">Q: {item.q}</p>
          <p className="text-slate-650 mt-1">A: {item.a}</p>
        </div>
      ))}
    </div>
  );

  return (
    <ToolLayout
      title="AI Question Generator"
      description="Create study questions and flashcards from document content."
      icon={FileCode}
      file={file}
      onFileSelect={(f) => { setFile(f); setQuiz([]); }}
      onClear={() => { setFile(null); setQuiz([]); }}
      controls={controls}
      onExecute={handleGenerate}
      isExecuting={isExecuting}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default QuestionGen;