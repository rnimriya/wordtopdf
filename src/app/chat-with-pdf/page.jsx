"use client";

import React, { useState } from 'react';
import { FileQuestion, Send, Loader2 } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';
import { extractTextFromPdf } from '../../utils/textExtractor.js';

function ChatPdf() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [loadingText, setLoadingText] = useState(false);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setLoadingText(true);
    setChat([
      { role: 'assistant', text: "Initializing context tracker..." }
    ]);
    const text = await extractTextFromPdf(selectedFile);
    setDocumentText(text);
    setLoadingText(false);
    setChat([
      { role: 'assistant', text: "Chat activated. I have parsed the text layer. Ask me anything!" }
    ]);
  };

  const handleSend = async () => {
    if (!query.trim() || isExecuting || loadingText) return;

    const userMessageText = query.trim();
    setChat(prev => [...prev, { role: 'user', text: userMessageText }]);
    setQuery('');
    setIsExecuting(true);

    try {
      const history = chat.map(c => ({
        role: c.role === 'user' ? 'user' : 'assistant',
        content: c.text
      })).concat({ role: 'user', content: userMessageText });

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          documentText
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI request failed');
      }

      setChat(prev => [...prev, { role: 'assistant', text: data.content }]);
    } catch (err) {
      console.error(err);
      setChat(prev => [...prev, { 
        role: 'assistant', 
        text: `Error: ${err.message || 'Unable to load reply. Make sure you are subscribed to Pro.'}` 
      }]);
    } finally {
      setIsExecuting(false);
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 max-h-[300px] overflow-y-auto space-y-3">
        {chat.map((msg, i) => (
          <div key={i} className={"p-3 rounded-lg text-xs " + (msg.role === 'user' ? 'bg-primary-50 text-slate-800 ml-4 border border-primary-100' : 'bg-white text-slate-800 mr-4 border border-slate-200')}>
            <span className="font-bold block mb-1 uppercase tracking-wider text-[9px] text-slate-400">{msg.role === 'user' ? 'You' : 'AI'}</span>
            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
          </div>
        ))}
        {isExecuting && (
          <div className="p-3 rounded-lg text-xs bg-white text-slate-400 mr-4 border border-slate-100 flex items-center space-x-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Ask chatbot..." 
          className="glass-input text-xs py-2.5" 
          disabled={!file || loadingText || isExecuting} 
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <button 
          onClick={handleSend} 
          className="px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 text-xs font-bold shrink-0" 
          disabled={!file || !query.trim() || loadingText || isExecuting}
        >
          Send
        </button>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Chat with PDF"
      description="Crawl your file text layers and extract answers instantly using smart AI indexing."
      icon={FileQuestion}
      file={file}
      onFileSelect={handleFileSelect}
      onClear={() => { setFile(null); setChat([]); setDocumentText(''); }}
      controls={controls}
      onExecute={() => {}}
      isExecuting={isExecuting || loadingText}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default ChatPdf;