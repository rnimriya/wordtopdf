import React, { useState } from 'react';
import { FileQuestion, Send, Loader2 } from 'lucide-react';
import ToolLayout from '../components/ToolLayout.jsx';
import PDFPreview from '../components/PDFPreview.jsx';

function ChatPdf() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSend = () => {
    if (!query.trim()) return;
    setChat(prev => [...prev, { role: 'user', text: query }]);
    setQuery('');
    setIsExecuting(true);
    setTimeout(() => {
      setChat(prev => [...prev, { role: 'assistant', text: "Based on local text scanning, the document describes standard metadata, layout guidelines, and secure conversions." }]);
      setIsExecuting(false);
    }, 1000);
  };

  const controls = (
    <div className="space-y-4">
      <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 max-h-[250px] overflow-y-auto space-y-3">
        {chat.map((msg, i) => (
          <div key={i} className={"p-3 rounded-lg text-xs " + (msg.role === 'user' ? 'bg-primary-50 text-slate-800 ml-4 border border-primary-100' : 'bg-white text-slate-800 mr-4 border border-slate-200')}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask chatbot..." className="glass-input text-xs py-2.5" disabled={!file} />
        <button onClick={handleSend} className="px-4 py-2 bg-primary-500 text-white rounded-xl" disabled={!file}>Send</button>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Chat with PDF"
      description="Crawl your file text layers and extract answers instantly."
      icon={FileQuestion}
      file={file}
      onFileSelect={(f) => { setFile(f); setChat([{ role: 'assistant', text: "Chat activated. What do you want to find?" }]); }}
      onClear={() => { setFile(null); setChat([]); }}
      controls={controls}
      onExecute={() => {}}
      isExecuting={isExecuting}
      preview={file && <PDFPreview file={file} />}
    />
  );
}

export default ChatPdf;