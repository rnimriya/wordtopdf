"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, ChevronDown, Cpu, FileText, ArrowRightLeft, FileSliders, LayoutGrid, LogOut, User } from 'lucide-react';

function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname = usePathname();

  // Close menus on path changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const megamenuColumns = [
    {
      title: 'Convert to PDF',
      bgColor: 'bg-red-50 text-primary-500',
      links: [
        { name: 'Word to PDF', path: '/word-to-pdf', iconText: 'DOC', iconBg: 'bg-blue-50 text-blue-600 border border-blue-100' },
        { name: 'Excel to PDF', path: '/excel-to-pdf', iconText: 'XLS', iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
        { name: 'PPT to PDF', path: '/ppt-to-pdf', iconText: 'PPT', iconBg: 'bg-orange-50 text-orange-600 border border-orange-100' },
        { name: 'JPG to PDF', path: '/jpg-to-pdf', iconText: 'JPG', iconBg: 'bg-rose-50 text-rose-600 border border-rose-100' },
        { name: 'AutoCAD to PDF', path: '/autocad-to-pdf', iconText: 'CAD', iconBg: 'bg-cyan-50 text-cyan-600 border border-cyan-100' },
        { name: 'OpenOffice to PDF', path: '/openoffice-to-pdf', iconText: 'ODT', iconBg: 'bg-sky-50 text-sky-600 border border-sky-100' },
        { name: 'eBooks to PDF', path: '/ebooks-to-pdf', iconText: 'PUB', iconBg: 'bg-violet-50 text-violet-600 border border-violet-100' },
        { name: 'iWork to PDF', path: '/iwork-to-pdf', iconText: 'KEY', iconBg: 'bg-amber-50 text-amber-600 border border-amber-100' },
        { name: 'HTML to PDF', path: '/html-to-pdf', iconText: 'HTM', iconBg: 'bg-purple-50 text-purple-600 border border-purple-100' },
        { name: 'Text to PDF', path: '/text-to-pdf', iconText: 'TXT', iconBg: 'bg-slate-150 text-slate-600 border border-slate-200' },
        { name: 'RTF to PDF', path: '/rtf-to-pdf', iconText: 'RTF', iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100' },
        { name: 'ODT to PDF', path: '/odt-to-pdf', iconText: 'ODT', iconBg: 'bg-teal-50 text-teal-600 border border-teal-100' },
      ]
    },
    {
      title: 'Convert from PDF',
      bgColor: 'bg-blue-50 text-blue-500',
      links: [
        { name: 'PDF to Word', path: '/pdf-to-word', iconText: 'DOC', iconBg: 'bg-blue-50 text-blue-600 border border-blue-100' },
        { name: 'PDF to Excel', path: '/pdf-to-excel', iconText: 'XLS', iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
        { name: 'PDF to PPT', path: '/pdf-to-ppt', iconText: 'PPT', iconBg: 'bg-orange-50 text-orange-600 border border-orange-100' },
        { name: 'PDF to JPG', path: '/pdf-to-jpg', iconText: 'JPG', iconBg: 'bg-rose-50 text-rose-600 border border-rose-100' },
        { name: 'PDF to PNG', path: '/pdf-to-png', iconText: 'PNG', iconBg: 'bg-pink-50 text-pink-600 border border-pink-100' },
        { name: 'Extract Images', path: '/extract-images', iconText: 'IMG', iconBg: 'bg-purple-50 text-purple-600 border border-purple-100' },
        { name: 'PDF to PDF/A', path: '/pdf-to-pdfa', iconText: 'PDF/A', iconBg: 'bg-slate-150 text-slate-700 border border-slate-200' },
        { name: 'PDF Scanner', path: '/pdf-scanner', iconText: 'SCN', iconBg: 'bg-teal-50 text-teal-600 border border-teal-100' },
        { name: 'PDF OCR', path: '/ocr-pdf', iconText: 'OCR', iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100' },
      ]
    },
    {
      title: 'Merge and Split',
      bgColor: 'bg-emerald-50 text-emerald-500',
      links: [
        { name: 'Merge PDF', path: '/merge-pdf', iconText: 'MRG', iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
        { name: 'Split PDF', path: '/split-pdf', iconText: 'SPL', iconBg: 'bg-rose-50 text-rose-600 border border-rose-100' },
        { name: 'Organize PDF', path: '/organize-pdf', iconText: 'ORG', iconBg: 'bg-violet-50 text-violet-600 border border-violet-100' },
        { name: 'Delete PDF Pages', path: '/delete-pdf-pages', iconText: 'DEL', iconBg: 'bg-red-50 text-red-650 border border-red-100' },
        { name: 'Extract PDF Pages', path: '/extract-pdf-pages', iconText: 'EXT', iconBg: 'bg-amber-50 text-amber-600 border border-amber-100' },
        { name: 'Rotate PDF', path: '/rotate-pdf', iconText: 'ROT', iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100' },
        { name: 'Number Pages', path: '/number-pages', iconText: 'NUM', iconBg: 'bg-blue-50 text-blue-600 border border-blue-100' },
        { name: 'Crop PDF', path: '/crop-pdf', iconText: 'CRP', iconBg: 'bg-cyan-50 text-cyan-600 border border-cyan-100' },
      ]
    },
    {
      title: 'PDF Security',
      bgColor: 'bg-orange-50 text-orange-500',
      links: [
        { name: 'Protect PDF', path: '/protect-pdf', iconText: 'SEC', iconBg: 'bg-red-50 text-red-650 border border-red-105' },
        { name: 'Unlock PDF', path: '/unlock-pdf', iconText: 'UNL', iconBg: 'bg-emerald-50 text-emerald-650 border border-emerald-105' },
        { name: 'Redact PDF', path: '/redact-pdf', iconText: 'RED', iconBg: 'bg-slate-900 text-slate-100 border border-slate-800' },
        { name: 'Watermark PDF', path: '/watermark-pdf', iconText: 'WTR', iconBg: 'bg-sky-50 text-sky-600 border border-sky-100' },
        { name: 'Sign PDF', path: '/sign-pdf', iconText: 'SGN', iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100' },
        { name: 'Request Signatures', path: '/request-signatures', iconText: 'REQ', iconBg: 'bg-violet-50 text-violet-600 border border-violet-100' },
        { name: 'PDF Form Filler', path: '/pdf-form-filler', iconText: 'FIL', iconBg: 'bg-amber-50 text-amber-600 border border-amber-100' },
        { name: 'Share PDF', path: '/share-pdf', iconText: 'SHR', iconBg: 'bg-blue-50 text-blue-600 border border-blue-100' },
      ]
    },
    {
      title: 'PDF Tools & AI',
      bgColor: 'bg-purple-50 text-purple-500',
      links: [
        { name: 'PDF Converter', path: '/pdf-converter', iconText: 'CNV', iconBg: 'bg-gradient-to-tr from-primary-600 to-red-500 text-white' },
        { name: 'Compress PDF', path: '/compress-pdf', iconText: 'CMP', iconBg: 'bg-amber-50 text-amber-650 border border-amber-100' },
        { name: 'Flatten PDF', path: '/flatten-pdf', iconText: 'FLT', iconBg: 'bg-blue-50 text-blue-600 border border-blue-100' },
        { name: 'Repair PDF', path: '/repair-pdf', iconText: 'RPR', iconBg: 'bg-rose-50 text-rose-600 border border-rose-100' },
        { name: 'Print-Ready PDF', path: '/print-ready-pdf', iconText: 'PRN', iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
        { name: 'Edit PDF', path: '/edit-pdf', iconText: 'EDT', iconBg: 'bg-violet-50 text-violet-600 border border-violet-100' },
        { name: 'PDF Annotator', path: '/pdf-annotator', iconText: 'ANT', iconBg: 'bg-pink-50 text-pink-600 border border-pink-100' },
        { name: 'PDF Reader', path: '/pdf-reader', iconText: 'RDR', iconBg: 'bg-sky-50 text-sky-600 border border-sky-100' },
        { name: 'AI PDF Assistant', path: '/ai-pdf-assistant', iconText: 'AI', iconBg: 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100' },
        { name: 'Chat with PDF', path: '/chat-with-pdf', iconText: 'CHT', iconBg: 'bg-cyan-50 text-cyan-600 border border-cyan-100' },
        { name: 'AI PDF Summarizer', path: '/ai-pdf-summarizer', iconText: 'SUM', iconBg: 'bg-teal-50 text-teal-600 border border-teal-100' },
        { name: 'Translate PDF', path: '/translate-pdf', iconText: 'TRN', iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100' },
        { name: 'AI Question Gen', path: '/ai-question-generator', iconText: 'QGN', iconBg: 'bg-orange-50 text-orange-600 border border-orange-100' },
      ]
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/80 shadow-sm animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-primary-600 to-red-500 shadow-md shadow-primary-500/25 group-hover:scale-105 active:scale-95 transition-all duration-300">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-slate-900 group-hover:text-primary-500 transition-colors">
              Word To PDF <span className="text-primary-500">Convertor</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            
            {/* All Tools Trigger */}
            <div 
              onMouseEnter={() => setActiveDropdown('all-tools')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => handleDropdown('all-tools')}
                className={`flex items-center space-x-1.5 px-2.5 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-colors ${activeDropdown === 'all-tools' ? 'text-primary-600 bg-slate-100' : 'text-slate-650 hover:text-slate-950 hover:bg-slate-50'}`}
              >
                <LayoutGrid className="h-4 w-4 text-primary-500" />
                <span>All Tools</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Direct Navbar Links */}
            {[
              { name: 'Convert', path: '/pdf-converter' },
              { name: 'Merge', path: '/merge-pdf' },
              { name: 'Split', path: '/split-pdf' },
              { name: 'Protect', path: '/protect-pdf' },
              { name: 'Unlock', path: '/unlock-pdf' },
              { name: 'Compress', path: '/compress-pdf' },
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-2.5 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-colors ${
                  pathname === link.path 
                    ? 'text-primary-600 bg-slate-100/80 shadow-sm' 
                    : 'text-slate-650 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}



            {/* Pricing */}
            <Link
              href="/pricing"
              className={`px-2.5 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-colors ${
                pathname === '/pricing' 
                  ? 'text-primary-600 bg-slate-100/80 shadow-sm' 
                  : 'text-slate-650 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              Pricing
            </Link>

            {/* Auth Buttons */}
            {status === 'loading' ? (
              <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse shrink-0"></div>
            ) : session ? (
              <div className="flex items-center space-x-2 xl:space-x-3 shrink-0">
                <Link
                  href="/dashboard"
                  className="px-3.5 py-2 rounded-lg text-xs xl:text-sm font-bold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all shrink-0"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 shrink-0">
                <Link
                  href="/login"
                  className="px-3 py-2 text-xs xl:text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup"
                  className="px-3.5 py-2 rounded-lg text-xs xl:text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/15 shrink-0"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Mobile Menu */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-width Megamenu Dropdown */}
      {activeDropdown === 'all-tools' && (
        <div 
          className="hidden lg:block absolute top-[80px] left-0 right-0 w-full bg-white border-b border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-1.5 duration-200 z-50 border-t-[8px] border-t-transparent"
          onMouseEnter={() => setActiveDropdown('all-tools')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-5 gap-6">
            {megamenuColumns.map((col) => (
              <div key={col.title} className="space-y-4">
                <h4 className="font-display font-extrabold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2.5">
                  {col.title}
                </h4>
                <div className="flex flex-col space-y-1">
                  {col.links.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      className="flex items-center space-x-3 px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 hover:translate-x-0.5"
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-extrabold shrink-0 select-none shadow-sm ${link.iconBg}`}>
                        {link.iconText}
                      </span>
                      <span className="truncate">{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-3 shadow-xl max-h-[85vh] overflow-y-auto">
          
          {/* Direct Mobile Links */}
          <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-3 mb-1">
            {[
              { name: 'Convert PDF', path: '/pdf-converter' },
              { name: 'Merge PDF', path: '/merge-pdf' },
              { name: 'Split PDF', path: '/split-pdf' },
              { name: 'Protect PDF', path: '/protect-pdf' },
              { name: 'Unlock PDF', path: '/unlock-pdf' },
              { name: 'Compress PDF', path: '/compress-pdf' },
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="block text-center py-2 px-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-100"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Categorized Tools (Accordions) */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              All Tool Categories
            </div>
            {megamenuColumns.map((col) => (
              <div key={col.title} className="border-b border-slate-50 pb-1">
                <button
                  onClick={() => handleDropdown(col.title)}
                  className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 focus:outline-none"
                >
                  <span>{col.title}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transform transition-transform ${activeDropdown === col.title ? 'rotate-180 text-primary-500' : 'text-slate-400'}`} />
                </button>
                {activeDropdown === col.title && (
                  <div className="pl-3 pr-2 py-1.5 bg-slate-50/50 rounded-xl border border-slate-100 mt-0.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    {col.links.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className="flex items-center space-x-2 px-2.5 py-1 text-[11px] font-semibold text-slate-650 hover:text-primary-650 transition-colors"
                      >
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[7px] font-extrabold shrink-0 select-none ${link.iconBg}`}>
                          {link.iconText}
                        </span>
                        <span className="truncate">{link.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>


          
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link
              href="/pricing"
              className="block w-full py-2 px-3 text-xs font-bold text-slate-650 hover:text-slate-900 rounded-xl"
            >
              Pricing Plans
            </Link>
            
            {status === 'loading' ? (
              <div className="h-10 w-full bg-slate-50 rounded-xl animate-pulse"></div>
            ) : session ? (
              <div className="space-y-2 pt-1">
                <Link
                  href="/dashboard"
                  className="block text-center w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-bold rounded-xl"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block text-center w-full px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-bold rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  className="block text-center py-2.5 px-4 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup"
                  className="block text-center py-2.5 px-4 bg-primary-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
