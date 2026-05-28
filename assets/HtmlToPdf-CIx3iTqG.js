import{j as e}from"./main-Km-AAsVB.js";import{e as o}from"./vendor-XsA2aSF3.js";import{T as N}from"./ToolLayout-Bi5fIwB3.js";import{h as L,E as S}from"./jspdf-C8O79bco.js";import{c as F}from"./confetti.module-B5JVzsfH.js";import{F as k}from"./icons-DLZuS38b.js";const y=`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      color: #1e293b;
      padding: 30px;
      background: #ffffff;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #4f46e5;
    }
    .title {
      font-size: 28px;
      font-weight: 700;
      margin-top: 10px;
      color: #0f172a;
    }
    .subtitle {
      font-size: 14px;
      color: #64748b;
    }
    .content {
      margin-bottom: 30px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }
    .card {
      border: 1px solid #e2e8f0;
      padding: 15px;
      border-radius: 8px;
      background: #f8fafc;
    }
    .card-title {
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 10px;
      text-align: left;
      font-size: 13px;
    }
    th {
      background-color: #f1f5f9;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">91PDFConverter</div>
    <div class="title">HTML to PDF Document</div>
    <div class="subtitle">Generated client-side inside your browser</div>
  </div>
  
  <div class="content">
    <p>This is a live preview of the HTML content. You can write custom markup, inline CSS styles, and tables, and download it instantly as a high-fidelity PDF document.</p>
    
    <div class="grid">
      <div class="card">
        <div class="card-title">Browser-Only Execution</div>
        <p style="font-size: 12px; margin: 0;">Calculated locally. Perfect for keeping secure business reports, statements, or invoices confidential.</p>
      </div>
      <div class="card">
        <div class="card-title">Fully Editable</div>
        <p style="font-size: 12px; margin: 0;">Change the text markup in the editor panel to the right and watch it update live.</p>
      </div>
    </div>
    
    <h3>Project Deliverable Scope</h3>
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Status</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Client-side compilation setup</td>
          <td style="color: #059669; font-weight: bold;">Completed</td>
          <td>High</td>
        </tr>
        <tr>
          <td>Premium dark layout design</td>
          <td style="color: #059669; font-weight: bold;">Completed</td>
          <td>High</td>
        </tr>
        <tr>
          <td>OCR PDF character extraction</td>
          <td style="color: #4f46e5; font-weight: bold;">Active</td>
          <td>Medium</td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <div class="footer">
    PDF generated via 91PDFConverter HTML compilation engine.
  </div>
</body>
</html>`;function W(){const[s,u]=o.useState(y),[g,x]=o.useState(!1),[w,a]=o.useState(0),[C,c]=o.useState(""),[P,r]=o.useState(""),p=o.useRef(null);o.useEffect(()=>{T()},[s]);const T=()=>{const t=p.current;if(!t)return;const i=t.contentDocument||t.contentWindow.document;i.open(),i.write(s),i.close()},j=()=>{u(y),c(""),r("")},H=async()=>{if(!s.trim()){r("HTML content cannot be empty.");return}x(!0),r(""),c(""),a(20);try{const t=p.current;if(!t)throw new Error("Preview sandbox is not initialized.");const i=t.contentDocument.body;a(40);const m=await L(i,{scale:2,useCORS:!0,logging:!1,backgroundColor:"#ffffff"});a(70);const b=m.toDataURL("image/png"),n=new S("p","mm","a4"),f=210,v=295,l=m.height*f/m.width;let d=l,h=0;for(n.addImage(b,"PNG",0,h,f,l),d-=v,a(85);d>=0;)h=d-l,n.addPage(),n.addImage(b,"PNG",0,h,f,l),d-=v;n.save(`html-document-${Date.now()}.pdf`),a(100),c("HTML content successfully compiled to PDF! Your download has started."),F({particleCount:100,spread:60,origin:{y:.6}})}catch(t){console.error(t),r("HTML compilation failed: "+t.message)}finally{x(!1)}},D=e.jsx("div",{className:"space-y-4",children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-semibold uppercase tracking-wider text-slate-400 block",children:"Write HTML Code"}),e.jsx("textarea",{value:s,onChange:t=>u(t.target.value),disabled:g,placeholder:"Paste or write HTML code here...",className:"w-full h-[280px] p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-xs font-mono focus:outline-none resize-none"})]})}),M=e.jsxs("div",{className:"prose prose-invert max-w-none space-y-6",children:[e.jsx("h2",{className:"text-2xl font-bold font-display text-white",children:"Convert HTML code to PDFs locally"}),e.jsx("p",{className:"text-slate-400",children:"Converting HTML layout markup to PDF format is ideal for saving website posts, reports, receipt lists, or code mockups. Our parser compiles HTML and renders it onto a virtual canvas, printing page-by-page matrices directly into a downloadable document inside your browser."}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 pt-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-bold text-white text-sm",children:"Inline CSS Styles"}),e.jsx("p",{className:"text-xs text-slate-500",children:"The converter supports inline style grids, margins, custom tables, backgrounds, and standard font declarations. Keep CSS structures clean inside the `head` tags for best accuracy."})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-bold text-white text-sm",children:"Security Assured"}),e.jsx("p",{className:"text-xs text-slate-500",children:"Traditional online converters parse HTML by rendering it on their servers, exposing your parameters and databases. This layout compiles locally on your desktop thread, ensuring absolute privacy."})]})]})]});return e.jsx(N,{title:"HTML to PDF Converter",description:"Write or paste raw HTML code, preview it live, and download it as a PDF.",icon:k,file:s?!0:null,onFileSelect:()=>{},onClear:j,controls:D,onExecute:H,isExecuting:g,progress:w,successMessage:C,errorMessage:P,seoContent:M,preview:e.jsxs("div",{className:"flex flex-col space-y-3 w-full",children:[e.jsx("h4",{className:"text-xs font-semibold text-slate-400 uppercase tracking-wider",children:"Document Preview"}),e.jsx("div",{className:"border border-slate-800 rounded-xl bg-white overflow-hidden w-full h-[360px] shadow-inner",children:e.jsx("iframe",{ref:p,title:"Preview Sandbox",className:"w-full h-full border-none"})})]})})}export{W as default};
