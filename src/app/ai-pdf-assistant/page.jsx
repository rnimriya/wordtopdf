"use client";

import React, { useState } from 'react';
import { Cpu, Send, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function AiAssistant() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setChat([
      { role: 'assistant', text: "Hello! I am your local AI Assistant. How can I help you analyze this document?" }
    ]);
  };

  const handleSend = () => {
    if (!query.trim() || isExecuting) return;
    setChat(prev => [...prev, { role: 'user', text: query }]);
    setQuery('');
    setIsExecuting(true);
    setTimeout(() => {
      setChat(prev => [...prev, { role: 'assistant', text: "Analyzing your document... Key takeaways point to strict client-side encryption and browser sandboxing protocols." }]);
      setIsExecuting(false);
    }, 1000);
  };

  const controls = (
    <div className="space-y-4">
      <div className="border border-slate-250 rounded-xl bg-slate-50 p-4 max-h-[250px] overflow-y-auto space-y-3">
        {chat.map((msg, i) => (
          <div key={i} className={"p-3 rounded-lg text-xs " + (msg.role === 'user' ? 'bg-primary-50 text-slate-800 ml-4 border border-primary-100' : 'bg-white text-slate-800 mr-4 border border-slate-200')}>
            <span className="font-bold block mb-1 uppercase tracking-wider text-[9px] text-slate-400">{msg.role === 'user' ? 'You' : 'AI'}</span>
            <p className="leading-relaxed">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
          className="glass-input text-xs py-2.5"
          disabled={!file}
        />
        <button onClick={handleSend} className="px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50" disabled={!file || !query.trim()}>Send</button>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="AI PDF Assistant"
      description="Summarize, consult, and analyze document layers entirely client-side."
      icon={Cpu}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={() => { setFile(null); setChat([]); }}
      controls={controls}
      onExecute={() => {}}
      isExecuting={isExecuting}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default AiAssistant;