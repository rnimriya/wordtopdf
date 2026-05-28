import{j as e}from"./main-CnWqqPsA.js";import{e as s}from"./vendor-XsA2aSF3.js";import{T as S}from"./ToolLayout-CD_Hviri.js";import{E}from"./jspdf-C8O79bco.js";import{c as C}from"./confetti.module-B5JVzsfH.js";import{q as F}from"./icons-DLZuS38b.js";const A=`CONTRACT SUMMARY & AGREEMENT
----------------------------

Date: May 28, 2026

This document serves as the formal agreement between the Project Sponsor and Developer regarding the final delivery parameters of the PDF utility software platform.

1. Scope of Work
The Developer is tasked with transitioning 20+ frontend mock simulations into fully functional client-side document processing widgets.

2. Deliverable Quality Standards
All widgets must utilize local browser memory sandboxes (via WebAssembly libraries like pdf-lib, pdfjs-dist, and Tesseract.js) to guarantee 100% data safety.

3. Signature
Project Sponsor: ________________________
Developer:       ________________________`;function I(){const[o,m]=s.useState(A),[x,u]=s.useState(!1),[_,n]=s.useState(0),[y,d]=s.useState(""),[w,r]=s.useState(""),i=s.useRef(null);s.useEffect(()=>{if(i.current){const t=i.current.contentDocument||i.current.contentWindow.document,f=`
        <html>
        <head>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 11.5pt;
              line-height: 1.5;
              color: #1e293b;
              padding: 25px;
              white-space: pre-wrap;
              background: #ffffff;
            }
          </style>
        </head>
        <body>${o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br/>")}</body>
        </html>
      `;t.open(),t.write(f),t.close()}},[o]);const b=()=>{m(""),d(""),r("")},v=async()=>{if(!o.trim()){r("Please write some text to compile.");return}u(!0),r(""),d(""),n(30);try{const t=new E("p","mm","a4"),a=20,N=210-a*2;t.setFont("courier","normal"),t.setFontSize(11);const D=o.split(`
`),p=[];D.forEach(c=>{if(c.trim()==="")p.push("");else{const g=t.splitTextToSize(c,N);p.push(...g)}}),n(60);let l=a;const P=295-a,h=6;p.forEach((c,g)=>{l+h>P&&(t.addPage(),l=a),t.text(c,a,l),l+=h}),n(90),t.save(`text-document-${Date.now()}.pdf`),n(100),d("Text successfully compiled to A4 PDF document! Download initiated."),C({particleCount:80,spread:60,origin:{y:.6}})}catch(t){console.error(t),r("Conversion failed: "+t.message)}finally{u(!1)}},j=e.jsx("div",{className:"space-y-4",children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-semibold uppercase tracking-wider text-slate-400 block",children:"Document Content"}),e.jsx("textarea",{value:o,onChange:t=>m(t.target.value),disabled:x,placeholder:"Type or paste plain text documents here...",className:"w-full h-[280px] p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-xs font-mono focus:outline-none resize-none"})]})}),T=e.jsxs("div",{className:"prose prose-invert max-w-none space-y-6",children:[e.jsx("h2",{className:"text-2xl font-bold font-display text-white",children:"Generate formatted PDF files from plain text locally"}),e.jsx("p",{className:"text-slate-400",children:"If you have code files, text agreements, email transcripts, or lists that you need to convert into clean, standard A4 PDFs, this plain text converter handles formatting details in the browser. Wrap lines automatically, set custom monospace layouts, and export."}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 pt-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-bold text-white text-sm",children:"Monospace Alignment"}),e.jsx("p",{className:"text-xs text-slate-500",children:"The compiler outputs clean, grid-aligned text spacing using a standardized Courier monospace typeface, ideal for reports, logs, and summaries."})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-bold text-white text-sm",children:"Data Isolation"}),e.jsx("p",{className:"text-xs text-slate-500",children:"No external servers compile your inputs. The PDF document is written in memory inside your browser window context."})]})]})]});return e.jsx(S,{title:"Convert Text to PDF",description:"Write or paste plain text content and convert it into a standard A4 PDF document.",icon:F,file:o?!0:null,onFileSelect:()=>{},onClear:b,controls:j,onExecute:v,isExecuting:x,progress:_,successMessage:y,errorMessage:w,seoContent:T,preview:e.jsxs("div",{className:"flex flex-col space-y-3 w-full",children:[e.jsx("h4",{className:"text-xs font-semibold text-slate-400 uppercase tracking-wider",children:"Document Preview"}),e.jsx("div",{className:"border border-slate-800 rounded-xl bg-white overflow-hidden w-full h-[360px] shadow-inner",children:e.jsx("iframe",{ref:i,title:"Text Preview Sandbox",className:"w-full h-full border-none"})})]})})}export{I as default};
