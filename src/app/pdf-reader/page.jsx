"use client";

import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import ToolLayout from '../../components/ToolLayout.jsx';
import PDFPreview from '../../components/PDFPreview.jsx';

function PdfReader() {
  const [file, setFile] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const controls = (
    <div className="space-y-4">
      {file && (
        <div className="flex items-center justify-between p-3 border rounded-xl bg-slate-50 text-xs">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} className="p-2 border rounded-lg bg-white" disabled={page === 1}>Prev</button>
          <span className="font-bold">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="p-2 border rounded-lg bg-white" disabled={page === totalPages}>Next</button>
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      title="PDF Reader"
      description="Read and search contents inside document sandboxes."
      icon={Eye}
      file={file}
      onFileSelect={(f) => { setFile(f); setPage(1); }}
      onClear={() => { setFile(null); setPage(1); }}
      controls={controls}
      onExecute={() => {}}
      isExecuting={false}
      preview={file && <PDFPreview file={file} pageNumber={page} onLoadSuccess={({ numPages }) => setTotalPages(numPages)} />}
    />
  );
}

export default PdfReader;