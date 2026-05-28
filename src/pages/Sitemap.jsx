import React from 'react';
import { Link } from 'react-router-dom';
import { Map, FileText, Settings, Wand2, ArrowRight } from 'lucide-react';

const Sitemap = () => {
  const sections = [
    {
      title: 'Core PDF Utilities',
      icon: <Settings className="w-5 h-5 text-blue-500" />,
      links: [
        { path: '/merge-pdf', label: 'Merge PDF' },
        { path: '/split-pdf', label: 'Split PDF' },
        { path: '/compress-pdf', label: 'Compress PDF' },
        { path: '/rotate-pdf', label: 'Rotate PDF' },
        { path: '/protect-pdf', label: 'Protect PDF' },
        { path: '/unlock-pdf', label: 'Unlock PDF' },
        { path: '/organize-pdf', label: 'Organize PDF' },
      ],
    },
    {
      title: 'Convert from PDF',
      icon: <FileText className="w-5 h-5 text-red-500" />,
      links: [
        { path: '/pdf-to-word', label: 'PDF to Word' },
        { path: '/pdf-to-excel', label: 'PDF to Excel' },
        { path: '/pdf-to-jpg', label: 'PDF to JPG' },
        { path: '/pdf-to-png', label: 'PDF to PNG' },
        { path: '/pdf-to-ppt', label: 'PDF to PPT' },
        { path: '/pdf-to-pdfa', label: 'PDF to PDF/A' },
      ],
    },
    {
      title: 'Convert to PDF',
      icon: <FileText className="w-5 h-5 text-emerald-500" />,
      links: [
        { path: '/word-to-pdf', label: 'Word to PDF' },
        { path: '/excel-to-pdf', label: 'Excel to PDF' },
        { path: '/ppt-to-pdf', label: 'PPT to PDF' },
        { path: '/jpg-to-pdf', label: 'JPG to PDF' },
        { path: '/text-to-pdf', label: 'Text to PDF' },
      ],
    },
    {
      title: 'AI & Advanced Tools',
      icon: <Wand2 className="w-5 h-5 text-purple-500" />,
      links: [
        { path: '/ai-pdf-assistant', label: 'AI PDF Assistant' },
        { path: '/chat-with-pdf', label: 'Chat with PDF' },
        { path: '/ai-pdf-summarizer', label: 'AI PDF Summarizer' },
        { path: '/translate-pdf', label: 'Translate PDF' },
        { path: '/ocr-pdf', label: 'OCR PDF' },
        { path: '/extract-images', label: 'Extract Images' },
        { path: '/repair-pdf', label: 'Repair PDF' },
      ],
    },
    {
      title: 'Company & Support',
      icon: <Map className="w-5 h-5 text-slate-500" />,
      links: [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About Us' },
        { path: '/contact', label: 'Contact' },
        { path: '/privacy', label: 'Privacy Policy' },
        { path: '/terms', label: 'Terms of Service' },
      ],
    }
  ];

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-4 mb-12 mt-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Sitemap
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
          Navigate quickly to any PDF tool or page across our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-50">
              <div className="bg-slate-50 p-2 rounded-lg">
                {section.icon}
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                {section.title}
              </h2>
            </div>
            
            <ul className="space-y-3">
              {section.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <Link 
                    to={link.path}
                    className="group flex items-center text-slate-600 hover:text-[#E74C3C] transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 ease-out text-[#E74C3C]" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sitemap;
