import React from 'react';

function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-display">
          Terms and Conditions
        </h1>
        <p className="text-slate-400 text-sm">
          Last updated: March 10, 2025
        </p>
      </div>

      {/* Main Content */}
      <div className="glass-card p-8 md:p-12 space-y-6 text-sm text-slate-300 leading-relaxed">
        <p>
          Please read these terms and conditions carefully before using Our Service.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-2 font-display">Interpretation and Definitions</h2>
        
        <h3 className="text-md font-bold text-white mt-4">Interpretation</h3>
        <p>
          The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        </p>

        <h3 className="text-md font-bold text-white mt-4">Definitions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to PDF Converter.</li>
          <li><strong>Country</strong> refers to: New York, United States.</li>
          <li><strong>Service</strong> refers to the Website.</li>
          <li><strong>Website</strong> refers to Word To PDF Convertor, accessible from <a href="https://wordtopdfconvertor.in" className="text-primary-400 hover:underline">https://wordtopdfconvertor.in</a>.</li>
          <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-2 font-display">Acknowledgment</h2>
        <p>
          These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
        </p>
        <p>
          Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-2 font-display">Use of the Service</h2>
        <p>
          You agree to use the Service only for lawful purposes. Since document conversion and compilation operations are executed client-side on your local device, You are responsible for ensuring that you have the right to process your documents and that they comply with applicable laws.
        </p>
        <p>
          We provide the Service "AS IS" without warranty of any kind, either express or implied, including but not limited to suitability for a particular purpose or correctness of converted formats.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-2 font-display">Contact Us</h2>
        <p>
          If you have any questions about these Terms and Conditions, You can contact us:
        </p>
        <ul className="list-disc pl-6">
          <li>By email: <a href="mailto:contact@wordtopdfconvertor.in" className="text-primary-400 hover:underline">contact@wordtopdfconvertor.in</a></li>
        </ul>
      </div>

    </div>
  );
}

export default Terms;
