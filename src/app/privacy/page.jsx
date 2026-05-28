"use client";

import React from 'react';

function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-display">
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-sm">
          Last updated: March 10, 2025
        </p>
      </div>

      {/* Main Content */}
      <div className="glass-card p-8 md:p-12 space-y-6 text-sm text-slate-300 leading-relaxed">
        <p>
          This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
        </p>
        <p>
          We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-2 font-display">Interpretation and Definitions</h2>
        
        <h3 className="text-md font-bold text-white mt-4">Interpretation</h3>
        <p>
          The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        </p>

        <h3 className="text-md font-bold text-white mt-4">Definitions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to PDF Converter.</li>
          <li><strong>Service</strong> refers to the Website.</li>
          <li><strong>Website</strong> refers to Word To PDF Convertor, accessible from <a href="https://wordtopdfconvertor.in" className="text-primary-400 hover:underline">https://wordtopdfconvertor.in</a>.</li>
          <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-2 font-display">Data Collection and Processing</h2>
        <p>
          A core principle of Word To PDF Convertor is that **document processing takes place entirely client-side in the user's web browser.**
        </p>
        <p>
          When you upload files (such as PDFs, Word documents, Excel sheets, or image files) to compile, merge, rotate, encrypt, or convert, **these files are never transmitted to external cloud servers.** The file processing is executed locally in your browser memory buffer (using client-side scripts and WebAssembly). Therefore, we do not collect, store, or share your document contents.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-2 font-display">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, You can contact us:
        </p>
        <ul className="list-disc pl-6">
          <li>By email: <a href="mailto:contact@wordtopdfconvertor.in" className="text-primary-400 hover:underline">contact@wordtopdfconvertor.in</a></li>
        </ul>
      </div>

    </div>
  );
}

export default Privacy;
