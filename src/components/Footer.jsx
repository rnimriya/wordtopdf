import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200/60 text-slate-500 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        
        {/* Brand Column */}
        <div className="space-y-3 lg:col-span-1">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-50 text-primary-500">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-base text-slate-900">
              91PDF<span className="text-primary-500">Converter</span>
            </span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Fast, secure, and free online PDF tools. All operations are executed directly inside your browser—keeping your files 100% private.
          </p>
          <div className="flex items-center space-x-2 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-250/60 rounded-lg p-2 w-fit">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Files never upload to servers.</span>
          </div>
        </div>

        {/* Convert to PDF */}
        <div>
          <h4 className="font-display font-bold text-slate-900 mb-2 text-[11px] uppercase tracking-wider">Convert to PDF</h4>
          <ul className="space-y-1 text-xs">
            <li><Link to="/convert/word-to-pdf" className="hover:text-primary-600 transition-colors">Word to PDF</Link></li>
            <li><Link to="/convert/excel-to-pdf" className="hover:text-primary-600 transition-colors">Excel to PDF</Link></li>
            <li><Link to="/convert/ppt-to-pdf" className="hover:text-primary-600 transition-colors">PPT to PDF</Link></li>
            <li><Link to="/convert/jpg-to-pdf" className="hover:text-primary-600 transition-colors">JPG to PDF</Link></li>
            <li><Link to="/convert/autocad-to-pdf" className="hover:text-primary-600 transition-colors">AutoCAD to PDF</Link></li>
            <li><Link to="/convert/openoffice-to-pdf" className="hover:text-primary-600 transition-colors">OpenOffice to PDF</Link></li>
            <li><Link to="/convert/ebooks-to-pdf" className="hover:text-primary-600 transition-colors">eBooks to PDF</Link></li>
            <li><Link to="/convert/iwork-to-pdf" className="hover:text-primary-600 transition-colors">iWork to PDF</Link></li>
            <li><Link to="/html-to-pdf" className="hover:text-primary-600 transition-colors">HTML to PDF</Link></li>
            <li><Link to="/convert/text-to-pdf" className="hover:text-primary-600 transition-colors">Text to PDF</Link></li>
            <li><Link to="/convert/rtf-to-pdf" className="hover:text-primary-600 transition-colors">RTF to PDF</Link></li>
            <li><Link to="/convert/odt-to-pdf" className="hover:text-primary-600 transition-colors">ODT to PDF</Link></li>
          </ul>
        </div>

        {/* Convert from PDF */}
        <div>
          <h4 className="font-display font-bold text-slate-900 mb-2 text-[11px] uppercase tracking-wider">Convert From</h4>
          <ul className="space-y-1 text-xs">
            <li><Link to="/convert/pdf-to-word" className="hover:text-primary-600 transition-colors">PDF to Word</Link></li>
            <li><Link to="/convert/pdf-to-excel" className="hover:text-primary-600 transition-colors">PDF to Excel</Link></li>
            <li><Link to="/convert/pdf-to-ppt" className="hover:text-primary-600 transition-colors">PDF to PPT</Link></li>
            <li><Link to="/convert/pdf-to-jpg" className="hover:text-primary-600 transition-colors">PDF to JPG</Link></li>
            <li><Link to="/convert/pdf-to-png" className="hover:text-primary-600 transition-colors">PDF to PNG</Link></li>
            <li><Link to="/extract-images" className="hover:text-primary-600 transition-colors">Extract Images</Link></li>
            <li><Link to="/convert/pdf-to-pdfa" className="hover:text-primary-600 transition-colors">PDF to PDF/A</Link></li>
            <li><Link to="/pdf-scanner" className="hover:text-primary-600 transition-colors">PDF Scanner</Link></li>
            <li><Link to="/ocr-pdf" className="hover:text-primary-600 transition-colors">PDF OCR</Link></li>
          </ul>
        </div>

        {/* Merge & Organize */}
        <div>
          <h4 className="font-display font-bold text-slate-900 mb-2 text-[11px] uppercase tracking-wider">Organize & Page</h4>
          <ul className="space-y-1 text-xs">
            <li><Link to="/merge-pdf" className="hover:text-primary-600 transition-colors">Merge PDF</Link></li>
            <li><Link to="/split-pdf" className="hover:text-primary-600 transition-colors">Split PDF</Link></li>
            <li><Link to="/organize-pdf" className="hover:text-primary-600 transition-colors">Organize PDF</Link></li>
            <li><Link to="/delete-pdf-pages" className="hover:text-primary-600 transition-colors">Delete PDF Pages</Link></li>
            <li><Link to="/extract-pdf-pages" className="hover:text-primary-600 transition-colors">Extract PDF Pages</Link></li>
            <li><Link to="/rotate-pdf" className="hover:text-primary-600 transition-colors">Rotate PDF</Link></li>
            <li><Link to="/number-pages" className="hover:text-primary-600 transition-colors">Number Pages</Link></li>
            <li><Link to="/crop-pdf" className="hover:text-primary-600 transition-colors">Crop PDF</Link></li>
          </ul>
        </div>

        {/* PDF Security */}
        <div>
          <h4 className="font-display font-bold text-slate-900 mb-2 text-[11px] uppercase tracking-wider">Security & Sign</h4>
          <ul className="space-y-1 text-xs">
            <li><Link to="/protect-pdf" className="hover:text-primary-600 transition-colors">Protect PDF</Link></li>
            <li><Link to="/unlock-pdf" className="hover:text-primary-600 transition-colors">Unlock PDF</Link></li>
            <li><Link to="/redact-pdf" className="hover:text-primary-600 transition-colors">Redact PDF</Link></li>
            <li><Link to="/watermark-pdf" className="hover:text-primary-600 transition-colors">Watermark PDF</Link></li>
            <li><Link to="/sign-pdf" className="hover:text-primary-600 transition-colors">Sign PDF</Link></li>
            <li><Link to="/request-signatures" className="hover:text-primary-600 transition-colors">Request Signatures</Link></li>
            <li><Link to="/pdf-form-filler" className="hover:text-primary-600 transition-colors">PDF Form Filler</Link></li>
            <li><Link to="/share-pdf" className="hover:text-primary-600 transition-colors">Share PDF</Link></li>
          </ul>
        </div>

        {/* PDF Tools & AI */}
        <div>
          <h4 className="font-display font-bold text-slate-900 mb-2 text-[11px] uppercase tracking-wider">Tools & AI</h4>
          <ul className="space-y-1 text-xs">
            <li><Link to="/pdf-converter" className="hover:text-primary-600 transition-colors">PDF Converter</Link></li>
            <li><Link to="/compress-pdf" className="hover:text-primary-600 transition-colors">Compress PDF</Link></li>
            <li><Link to="/flatten-pdf" className="hover:text-primary-600 transition-colors">Flatten PDF</Link></li>
            <li><Link to="/repair-pdf" className="hover:text-primary-600 transition-colors">Repair PDF</Link></li>
            <li><Link to="/print-ready-pdf" className="hover:text-primary-600 transition-colors">Print-Ready PDF</Link></li>
            <li><Link to="/edit-pdf" className="hover:text-primary-600 transition-colors">Edit PDF</Link></li>
            <li><Link to="/pdf-annotator" className="hover:text-primary-600 transition-colors">PDF Annotator</Link></li>
            <li><Link to="/pdf-reader" className="hover:text-primary-600 transition-colors">PDF Reader</Link></li>
            <li><Link to="/ai-pdf-assistant" className="hover:text-primary-600 transition-colors">AI PDF Assistant</Link></li>
            <li><Link to="/chat-with-pdf" className="hover:text-primary-600 transition-colors">Chat with PDF</Link></li>
            <li><Link to="/ai-pdf-summarizer" className="hover:text-primary-600 transition-colors">AI PDF Summarizer</Link></li>
            <li><Link to="/translate-pdf" className="hover:text-primary-600 transition-colors">Translate PDF</Link></li>
            <li><Link to="/ai-question-generator" className="hover:text-primary-600 transition-colors">AI Question Gen</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs space-y-4 md:space-y-0">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link to="/about" className="hover:text-primary-600 transition-colors font-medium">About Us</Link>
          <Link to="/contact" className="hover:text-primary-600 transition-colors font-medium">Contact</Link>
          <Link to="/privacy" className="hover:text-primary-600 transition-colors font-medium">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary-600 transition-colors font-medium">Terms of Service</Link>
          <Link to="/sitemap" className="hover:text-primary-600 transition-colors font-medium">Sitemap</Link>
          <a href="/blog" className="hover:text-primary-600 transition-colors font-medium">Blog</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Word To PDF Convertor. All rights reserved. Built client-side for absolute privacy.</p>
      </div>
    </footer>
  );
}

export default Footer;
