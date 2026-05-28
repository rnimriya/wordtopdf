import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Combine, RotateCw, KeyRound, Shrink, ScanEye, Image, 
  FileText, ArrowRightLeft, FileCode, Shield, Zap, Sparkles, CheckCircle,
  Split, Trash2, Scissors, LayoutGrid, Eye, FileDigit, Crop, Eraser, Stamp,
  PenTool, Share2, Cpu, FileQuestion, Globe, FileSpreadsheet, LockOpen, Scaling, Printer
} from 'lucide-react';

function Home() {
  // Removed unused filter state

  const tools = [
    // AI PDF
    {
      name: 'AI PDF Assistant',
      description: 'Interact with your document using a smart client-side conversational assistant.',
      path: '/ai-pdf-assistant',
      icon: Cpu,
      category: 'ai',
      badge: 'New',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      name: 'Chat with PDF',
      description: 'Ask questions, find answers, and extract facts from PDFs locally in real-time.',
      path: '/chat-with-pdf',
      icon: FileQuestion,
      category: 'ai',
      badge: 'New',
      color: 'from-violet-500 to-purple-600'
    },
    {
      name: 'AI PDF Summarizer',
      description: 'Instantly condense large PDFs into structured text outlines and key takeaways.',
      path: '/ai-pdf-summarizer',
      icon: Sparkles,
      category: 'ai',
      badge: 'Popular',
      color: 'from-rose-500 to-pink-600'
    },
    {
      name: 'Translate PDF',
      description: 'Translate documents between 50+ languages while preserving layout alignment.',
      path: '/translate-pdf',
      icon: Globe,
      category: 'ai',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'AI Question Generator',
      description: 'Automatically generate quiz questions and flashcards directly from PDF content.',
      path: '/ai-question-generator',
      icon: FileCode,
      category: 'ai',
      color: 'from-amber-500 to-orange-600'
    },

    // Organize
    {
      name: 'Merge PDF',
      description: 'Combine multiple PDF files into a single document seamlessly.',
      path: '/merge-pdf',
      icon: Combine,
      category: 'organize',
      badge: 'Popular',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      name: 'Split PDF',
      description: 'Extract specific pages or slice a PDF into multiple separate files.',
      path: '/split-pdf',
      icon: Split,
      category: 'organize',
      color: 'from-teal-500 to-emerald-600'
    },
    {
      name: 'Rotate PDF',
      description: 'Rotate and save individual or all pages of a PDF document.',
      path: '/rotate-pdf',
      icon: RotateCw,
      category: 'organize',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Delete PDF Pages',
      description: 'Remove unwanted pages from your document and download the cleaned version.',
      path: '/delete-pdf-pages',
      icon: Trash2,
      category: 'organize',
      color: 'from-rose-500 to-red-600'
    },
    {
      name: 'Extract PDF Pages',
      description: 'Extract specific page numbers or ranges and save as a new PDF.',
      path: '/extract-pdf-pages',
      icon: Scissors,
      category: 'organize',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      name: 'Organize PDF',
      description: 'Rearrange page orders, drag-and-drop sequence, or delete pages visually.',
      path: '/organize-pdf',
      icon: LayoutGrid,
      category: 'organize',
      color: 'from-fuchsia-500 to-pink-600'
    },
    {
      name: 'Repair PDF',
      description: 'Recover metadata structure and rebuild damaged PDF files locally.',
      path: '/repair-pdf',
      icon: FileText,
      category: 'organize',
      color: 'from-rose-500 to-red-600'
    },
    {
      name: 'Print-Ready PDF',
      description: 'Optimize color profiles (CMYK) and trim marks to prepare PDFs for professional printing.',
      path: '/print-ready-pdf',
      icon: Printer,
      category: 'organize',
      color: 'from-emerald-500 to-teal-500'
    },

    // View & Edit
    {
      name: 'Edit PDF',
      description: 'Add shapes, notes, custom headers, and text edits to PDF document viewports.',
      path: '/edit-pdf',
      icon: PenTool,
      category: 'edit',
      badge: 'Editor',
      color: 'from-orange-500 to-amber-600'
    },
    {
      name: 'PDF Annotator',
      description: 'Highlight text, draw shapes, and add markup commentary to your files.',
      path: '/pdf-annotator',
      icon: Sparkles,
      category: 'edit',
      color: 'from-violet-500 to-indigo-600'
    },
    {
      name: 'PDF Reader',
      description: 'Open, search text, and read PDF books or files with high-performance scrolling.',
      path: '/pdf-reader',
      icon: Eye,
      category: 'edit',
      color: 'from-slate-600 to-slate-700'
    },
    {
      name: 'Number Pages',
      description: 'Stamp custom page numbering configurations (e.g. Page X of Y) onto footer layouts.',
      path: '/number-pages',
      icon: FileDigit,
      category: 'edit',
      color: 'from-cyan-500 to-teal-600'
    },
    {
      name: 'Crop PDF',
      description: 'Adjust page boundaries, trim empty white margins, or crop canvas sections.',
      path: '/crop-pdf',
      icon: Crop,
      category: 'edit',
      color: 'from-teal-500 to-emerald-600'
    },
    {
      name: 'Redact PDF',
      description: 'Permanently black out and scrub sensitive text, PII, or data fields.',
      path: '/redact-pdf',
      icon: Eraser,
      category: 'edit',
      color: 'from-red-600 to-rose-700'
    },
    {
      name: 'Watermark PDF',
      description: 'Apply text or image watermark stamps with custom opacity levels.',
      path: '/watermark-pdf',
      icon: Stamp,
      category: 'edit',
      color: 'from-indigo-600 to-violet-650'
    },
    {
      name: 'PDF Form Filler',
      description: 'Interactively fill in text fields, select options, and save PDF forms.',
      path: '/pdf-form-filler',
      icon: FileText,
      category: 'edit',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Share PDF',
      description: 'Generate temporary secure preview files or transfer client-side PDFs easily.',
      path: '/share-pdf',
      icon: Share2,
      category: 'edit',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      name: 'Sign PDF',
      description: 'Draw your signature, upload image initials, and sign documents client-side.',
      path: '/sign-pdf',
      icon: PenTool,
      category: 'edit',
      badge: 'Sign',
      color: 'from-rose-500 to-pink-600'
    },
    {
      name: 'Request Signatures',
      description: 'Prepare signature placeholders and request document signatures online.',
      path: '/request-signatures',
      icon: CheckCircle,
      category: 'edit',
      color: 'from-indigo-500 to-indigo-700'
    },

    // Convert to PDF
    {
      name: 'Word to PDF',
      description: 'Convert Microsoft Word (.docx) files into clean PDF documents.',
      path: '/word-to-pdf',
      icon: FileText,
      category: 'to-pdf',
      color: 'from-blue-600 to-indigo-500'
    },
    {
      name: 'Excel to PDF',
      description: 'Convert spreadsheets (.xlsx) into structured PDF document grids.',
      path: '/excel-to-pdf',
      icon: FileSpreadsheet,
      category: 'to-pdf',
      color: 'from-emerald-600 to-teal-500'
    },
    {
      name: 'PPT to PDF',
      description: 'Convert PowerPoint (.pptx) slide files into presentation PDFs.',
      path: '/ppt-to-pdf',
      icon: FileText,
      category: 'to-pdf',
      color: 'from-orange-500 to-rose-500'
    },
    {
      name: 'JPG to PDF',
      description: 'Convert JPG photos and images into printable PDF format.',
      path: '/jpg-to-pdf',
      icon: Image,
      category: 'to-pdf',
      color: 'from-pink-500 to-purple-500'
    },
    {
      name: 'Text to PDF',
      description: 'Write or paste plain text blocks and download them as a PDF document.',
      path: '/text-to-pdf',
      icon: FileText,
      category: 'to-pdf',
      color: 'from-slate-500 to-slate-700'
    },
    {
      name: 'HTML to PDF',
      description: 'Convert webpage URLs or raw HTML codes into formatted PDFs.',
      path: '/html-to-pdf',
      icon: FileCode,
      category: 'to-pdf',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'RTF to PDF',
      description: 'Convert rich text formatting (.rtf) documents into clean PDFs.',
      path: '/rtf-to-pdf',
      icon: FileText,
      category: 'to-pdf',
      color: 'from-blue-500 to-indigo-550'
    },
    {
      name: 'ODT to PDF',
      description: 'Convert OpenDocument text files (.odt) into standard PDFs.',
      path: '/odt-to-pdf',
      icon: FileText,
      category: 'to-pdf',
      color: 'from-sky-500 to-blue-600'
    },
    {
      name: 'PDF OCR',
      description: 'Recognize and extract text from scanned PDFs client-side.',
      path: '/ocr-pdf',
      icon: ScanEye,
      category: 'to-pdf',
      badge: 'Popular',
      color: 'from-violet-500 to-purple-500'
    },
    {
      name: 'PDF Scanner',
      description: 'Capture documents using your camera and save them instantly as PDFs.',
      path: '/pdf-scanner',
      icon: Printer,
      category: 'to-pdf',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'AutoCAD to PDF',
      description: 'Convert AutoCAD CAD files (.dwg, .dxf) into clean PDF layouts.',
      path: '/autocad-to-pdf',
      icon: FileText,
      category: 'to-pdf',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'OpenOffice to PDF',
      description: 'Convert OpenOffice ODT, ODS, and ODP documents to PDF files.',
      path: '/openoffice-to-pdf',
      icon: FileText,
      category: 'to-pdf',
      color: 'from-sky-500 to-blue-600'
    },
    {
      name: 'eBooks to PDF',
      description: 'Convert EPUB, MOBI, and other eBook formats to PDF layout formats.',
      path: '/ebooks-to-pdf',
      icon: FileText,
      category: 'to-pdf',
      color: 'from-violet-500 to-purple-650'
    },
    {
      name: 'iWork to PDF',
      description: 'Convert Apple Keynote, Pages, and Numbers files into high-quality PDFs.',
      path: '/iwork-to-pdf',
      icon: FileText,
      category: 'to-pdf',
      color: 'from-amber-500 to-orange-600'
    },

    // Convert from PDF
    {
      name: 'PDF to Word',
      description: 'Convert PDF files into Microsoft Word (.docx) documents.',
      path: '/pdf-to-word',
      icon: ArrowRightLeft,
      category: 'from-pdf',
      badge: 'Popular',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'PDF to Excel',
      description: 'Extract tables from PDFs and write them into spreadsheet grids.',
      path: '/pdf-to-excel',
      icon: ArrowRightLeft,
      category: 'from-pdf',
      color: 'from-emerald-500 to-emerald-700'
    },
    {
      name: 'PDF to PPT',
      description: 'Convert PDF document pages into editable slides.',
      path: '/pdf-to-ppt',
      icon: ArrowRightLeft,
      category: 'from-pdf',
      color: 'from-rose-500 to-orange-600'
    },
    {
      name: 'PDF to JPG',
      description: 'Convert PDF pages into high-resolution JPG images.',
      path: '/pdf-to-jpg',
      icon: Image,
      category: 'from-pdf',
      color: 'from-pink-500 to-purple-600'
    },
    {
      name: 'PDF to PNG',
      description: 'Convert PDF pages into transparent PNG raster images.',
      path: '/pdf-to-png',
      icon: Image,
      category: 'from-pdf',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      name: 'PDF to PDF/A',
      description: 'Convert PDF documents to ISO-compliant PDF/A format for long-term archiving.',
      path: '/pdf-to-pdfa',
      icon: FileText,
      category: 'from-pdf',
      color: 'from-slate-500 to-slate-700'
    },

    // More
    {
      name: 'Unlock PDF',
      description: 'Remove security constraints and owner password locks from PDFs.',
      path: '/unlock-pdf',
      icon: LockOpen,
      category: 'organize',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      name: 'Protect PDF',
      description: 'Encrypt your PDF with a password and set user access permissions.',
      path: '/protect-pdf',
      icon: KeyRound,
      category: 'organize',
      badge: 'Security',
      color: 'from-rose-500 to-orange-500'
    },
    {
      name: 'Flatten PDF',
      description: 'Flatten interactive form fields into non-editable raster/vector objects.',
      path: '/flatten-pdf',
      icon: Scaling,
      category: 'organize',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      name: 'PDF Converter',
      description: 'Convert files of all formats into PDF, or turn PDFs into office documents.',
      path: '/pdf-converter',
      icon: ArrowRightLeft,
      category: 'to-pdf',
      badge: 'All-in-one',
      color: 'from-red-500 to-rose-600'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Hero Section (Compact & Light Theme) */}
      <section className="text-center space-y-3 max-w-4xl mx-auto pt-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display text-slate-900 leading-tight">
          The Premium, Private <br />
          <span className="bg-gradient-to-r from-primary-600 via-red-500 to-primary-500 bg-clip-text text-transparent">PDF Utility Suite</span>
        </h1>
        
        <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          No file limits. No server uploads. Process, convert, rotate, and encrypt your PDF files directly inside your browser with absolute speed and safety.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-6">
          <div className="flex items-center space-x-2 bg-white border border-slate-200/80 rounded-xl p-2.5 text-left shadow-sm">
            <Shield className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">100% Secure & Private</span>
          </div>
          <div className="flex items-center space-x-2 bg-white border border-slate-200/80 rounded-xl p-2.5 text-left shadow-sm">
            <Zap className="h-4.5 w-4.5 text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">Lightning-Fast Rendering</span>
          </div>
          <div className="flex items-center space-x-2 bg-white border border-slate-200/80 rounded-xl p-2.5 text-left shadow-sm">
            <CheckCircle className="h-4.5 w-4.5 text-primary-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">Free, No Account Needed</span>
          </div>
        </div>
      </section>

      {/* Tool Categories Carousel Layout */}
      <div className="space-y-12 pb-8">
        {[
          { id: 'ai', title: 'AI PDF Tools', desc: 'Smart document analysis and generation' },
          { id: 'to-pdf', title: 'Convert to PDF', desc: 'Turn files, images, and documents into PDFs' },
          { id: 'from-pdf', title: 'Convert from PDF', desc: 'Extract PDFs into editable office formats' },
          { id: 'organize', title: 'Organize & Utility', desc: 'Merge, split, and manipulate PDF pages' },
          { id: 'edit', title: 'View & Edit', desc: 'Annotate, sign, secure, and modify PDFs' },
        ].map(category => {
          const categoryTools = tools.filter(t => t.category === category.id);
          
          return (
            <section key={category.id} className="space-y-4 animate-in fade-in duration-500">
              <div className="flex items-end justify-between px-1">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight">
                    {category.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">{category.desc}</p>
                </div>
              </div>
              
              {/* Horizontal Scroll Container */}
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-1">
                {categoryTools.map(tool => {
                  const IconComponent = tool.icon;
                  return (
                    <Link
                      key={tool.name}
                      to={tool.path}
                      className="group relative flex flex-col justify-between p-5 rounded-xl border border-slate-200 bg-white hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1 shadow-sm shrink-0 w-[280px] md:w-[320px] snap-start"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className={`p-2.5 rounded-lg bg-gradient-to-tr ${tool.color} text-white shadow-lg`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          {tool.badge && (
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              tool.badge === 'Security' 
                                ? 'bg-rose-50 text-rose-700 border border-rose-150' 
                                : 'bg-primary-50 text-primary-750 border border-primary-100'
                            }`}>
                              {tool.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-bold text-base text-slate-900 mt-4 group-hover:text-primary-600 transition-colors">
                          {tool.name}
                        </h3>
                        
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center text-xs font-bold text-primary-600 group-hover:text-primary-700 group-hover:translate-x-1.5 transition-all duration-300">
                        <span>Open Tool</span>
                        <span className="ml-1">&rarr;</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Trust Copywriter Block */}
      <section className="glass-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight text-slate-900">
            Why choose browser-based client-side processing?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Conventional PDF conversion websites require uploading your confidential PDFs, documents, invoices, or legal contracts to their servers. This presents critical data leakage risks.
          </p>
          <p className="text-sm text-slate-650 leading-relaxed">
            <strong>Word To PDF Convertor</strong> executes operations directly inside your web browser. Utilizing modern WebAssembly compiled libraries, documents are processed directly inside your local memory buffer.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "No Size Limitations", text: "Process files of any size without worrying about upload quotas." },
            { title: "Instant Generation", text: "Save time by avoiding upload/download network delays." },
            { title: "Enterprise Grade Privacy", text: "Comply with HIPAA, GDPR, and organizational privacy policies." },
            { title: "Completely Free", text: "No subscriptions, sign-ups, or annoying watermark restrictions." }
          ].map(card => (
            <div key={card.title} className="p-4 rounded-lg border border-slate-150 bg-slate-50/50 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm">{card.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8">
        <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight text-slate-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            { q: "Is Word To PDF Convertor completely free?", a: "Yes, all our PDF tools are 100% free to use. There are no hidden fees, subscriptions, or daily limits." },
            { q: "Are my files safe and secure?", a: "Absolutely. We use local WebAssembly technology, meaning your files are processed entirely inside your browser and are never uploaded to any remote server." },
            { q: "Do you add watermarks to my PDFs?", a: "No. Your generated and edited documents remain completely clean and professional without any third-party branding." },
            { q: "Does it work on mobile devices?", a: "Yes, our tools are fully responsive and work smoothly across iOS, Android, macOS, and Windows without needing any app installations." }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-primary-300 transition-colors">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-start">
                <FileQuestion className="w-4 h-4 text-primary-500 mr-2 shrink-0 mt-0.5" />
                {faq.q}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;
