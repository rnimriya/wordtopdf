(()=>{var e={};e.id=1306,e.ids=[1306],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},78893:e=>{"use strict";e.exports=require("buffer")},17702:e=>{"use strict";e.exports=require("events")},92048:e=>{"use strict";e.exports=require("fs")},32615:e=>{"use strict";e.exports=require("http")},35240:e=>{"use strict";e.exports=require("https")},85807:e=>{"use strict";e.exports=require("module")},19801:e=>{"use strict";e.exports=require("os")},55315:e=>{"use strict";e.exports=require("path")},76162:e=>{"use strict";e.exports=require("stream")},17360:e=>{"use strict";e.exports=require("url")},21764:e=>{"use strict";e.exports=require("util")},71568:e=>{"use strict";e.exports=require("zlib")},93414:()=>{},3377:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>c,routeModule:()=>f,tree:()=>d}),r(36918),r(11065),r(35866);var s=r(23191),o=r(88716),a=r(37922),i=r.n(a),n=r(95231),l={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);r.d(t,l);let d=["",{children:["word-to-pdf",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,36918)),"G:\\Latest Project\\pdf\\src\\app\\word-to-pdf\\page.jsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,11065)),"G:\\Latest Project\\pdf\\src\\app\\layout.jsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,35866,23)),"next/dist/client/components/not-found-error"]}],c=["G:\\Latest Project\\pdf\\src\\app\\word-to-pdf\\page.jsx"],p="/word-to-pdf/page",u={require:r,loadChunk:()=>Promise.resolve()},f=new s.AppPageRouteModule({definition:{kind:o.x.APP_PAGE,page:"/word-to-pdf/page",pathname:"/word-to-pdf",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},2788:(e,t,r)=>{Promise.resolve().then(r.bind(r,28585))},77243:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});let s=(0,r(62881).Z)("ArrowRightLeft",[["path",{d:"m16 3 4 4-4 4",key:"1x1c3m"}],["path",{d:"M20 7H4",key:"zbl0bi"}],["path",{d:"m8 21-4-4 4-4",key:"h9nckh"}],["path",{d:"M4 17h16",key:"g4d7ey"}]])},28585:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>f});var s=r(10326),o=r(17577),a=r(77243),i=r(36283),n=r(77506),l=r(22326),d=r(52151),c=r(39642),p=r(87296),u=r(11896);let f=function(){let[e,t]=(0,o.useState)(null),[r,f]=(0,o.useState)(""),[m,h]=(0,o.useState)(!1),[x,g]=(0,o.useState)(0),[w,b]=(0,o.useState)(""),[y,v]=(0,o.useState)(""),[j,P]=(0,o.useState)(!1),N=(0,o.useRef)(null),k=async e=>{t(e),b(""),v(""),f(""),P(!0);try{let t=await e.arrayBuffer(),r=await (0,d.f)(t),s=`
        <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              color: #1e293b;
              padding: 20px;
              background: #ffffff;
              line-height: 1.5;
            }
            h1 { font-size: 18pt; font-weight: bold; margin-bottom: 12pt; color: #0f172a; }
            h2 { font-size: 14pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; color: #1e293b; }
            p { font-size: 10pt; margin-bottom: 8pt; text-align: justify; }
            table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
            th, td { border: 1px solid #e2e8f0; padding: 6px; text-align: left; font-size: 9.5pt; }
            th { background-color: #f8fafc; font-weight: bold; }
          </style>
        </head>
        <body>
          ${r}
        </body>
        </html>
      `;f(s)}catch(e){console.error(e),v("Could not render Word document preview: "+e.message)}finally{P(!1)}},M=async()=>{if(e&&r){h(!0),v(""),b(""),g(20);try{let t=N.current;if(!t)throw Error("Preview sandbox is not initialized.");let r=t.contentDocument.body;g(40);let s=await (0,c.default)(r,{scale:2,useCORS:!0,logging:!1,backgroundColor:"#ffffff"});g(70);let o=s.toDataURL("image/png"),a=new p.jsPDF("p","mm","a4"),i=210*s.height/s.width,n=i,l=0;for(a.addImage(o,"PNG",0,l,210,i),n-=295,g(85);n>=0;)l=n-i,a.addPage(),a.addImage(o,"PNG",0,l,210,i),n-=295;a.save(`${e.name.replace(".docx","")}.pdf`),g(100),b("Word document converted to PDF successfully! Download initialized."),(0,u.Z)({particleCount:100,spread:60,origin:{y:.6}})}catch(e){console.error(e),v("Conversion failed: "+e.message)}finally{h(!1)}}},q=(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("div",{className:"p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 text-primary-400 text-xs font-semibold flex items-center gap-2",children:[s.jsx(a.Z,{className:"h-4 w-4"}),s.jsx("span",{children:"Mammoth XML Conversion Engine"})]}),s.jsx("p",{className:"text-[11px] text-slate-500 leading-relaxed",children:"This converter parses the Microsoft Word XML hierarchy directly in the browser, rendering the document's structure to a clean vector canvas snapshot before outputting the PDF file."})]}),C=(0,s.jsxs)("div",{className:"prose prose-invert max-w-none space-y-6",children:[s.jsx("h2",{className:"text-2xl font-bold font-display text-white",children:"Convert Microsoft Word documents to PDF locally"}),s.jsx("p",{className:"text-slate-400",children:"Converting Word (.docx) files to PDFs is the standard way to protect report formatting before distribution. Most online sites require uploading your files, which exposes your corporate data. Our converter translates files client-side using Mammoth.js and html2canvas, securing absolute data safety."}),(0,s.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 pt-4",children:[(0,s.jsxs)("div",{className:"space-y-2",children:[s.jsx("h4",{className:"font-bold text-white text-sm",children:"HTML-to-Canvas Conversion"}),s.jsx("p",{className:"text-xs text-slate-500",children:"Mammoth.js parses Word styles and tables to clean HTML. The HTML is rendered inside an isolated iframe sandbox and printed directly to high-fidelity PDF pages in the browser."})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[s.jsx("h4",{className:"font-bold text-white text-sm",children:"Private & Confidential"}),s.jsx("p",{className:"text-xs text-slate-500",children:"All memory allocations are confined to your local hardware thread, making this converter ideal for secure organizational files."})]})]})]});return s.jsx(l.Z,{title:"Convert Word to PDF",description:"Convert Microsoft Word (.docx) documents into standard PDF format client-side.",icon:i.Z,file:e,onFileSelect:k,onClear:()=>{t(null),f(""),b(""),v("")},controls:q,onExecute:M,isExecuting:m,progress:x,successMessage:w,errorMessage:y,seoContent:C,accept:".docx",preview:r?(0,s.jsxs)("div",{className:"flex flex-col space-y-3 w-full",children:[s.jsx("h4",{className:"text-xs font-semibold text-slate-400 uppercase tracking-wider",children:"Document Preview"}),s.jsx("div",{className:"border border-slate-800 rounded-xl bg-white overflow-hidden w-full h-[360px] shadow-inner",children:s.jsx("iframe",{ref:N,title:"Word Preview Sandbox",className:"w-full h-full border-none"})})]}):j?(0,s.jsxs)("div",{className:"flex flex-col items-center justify-center p-12 text-primary-500 space-y-2",children:[s.jsx(n.Z,{className:"h-8 w-8 animate-spin"}),s.jsx("span",{className:"text-xs text-slate-400",children:"Parsing Word document structures..."})]}):null})}},36918:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});let s=(0,r(68570).createProxy)(String.raw`G:\Latest Project\pdf\src\app\word-to-pdf\page.jsx#default`)},52151:(e,t,r)=>{"use strict";r.d(t,{CU:()=>n,f:()=>a,rS:()=>i});var s=r(62198),o=r(52288);async function a(e){try{return(await s.convertToHtml({arrayBuffer:e})).value}catch(e){throw console.error("Mammoth error:",e),Error("Failed to parse Word document format.")}}function i(e){return new Blob([`\uFEFF
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>Exported PDF Text</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 1in;
        }
        h1 { font-size: 20pt; font-weight: bold; margin-bottom: 12pt; color: #1e293b; }
        h2 { font-size: 16pt; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; color: #475569; }
        p { font-size: 11pt; margin-bottom: 10pt; text-align: justify; }
        table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 10pt; }
        th { background-color: #f1f5f9; font-weight: bold; }
        .page-break { page-break-after: always; }
      </style>
    </head>
    <body>
      ${e}
    </body>
    </html>
  `],{type:"application/msword;charset=utf-8"})}async function n(e,t){if(!e)throw Error("No file specified.");let r=await e.arrayBuffer(),s=o.getDocument({data:r}),a=await s.promise,i=a.numPages,n=[];for(let e=1;e<=i;e++){let r=await a.getPage(e),s=(await r.getTextContent()).items,o={};s.forEach(e=>{let t=Math.round(e.transform[5]);o[t]||(o[t]=[]),o[t].push(e)});let l=Object.keys(o).sort((e,t)=>t-e).map(e=>o[e].sort((e,t)=>e.transform[4]-t.transform[4]).map(e=>e.str).join(" "));n.push(l.join("\n")),t&&t(Math.round(e/i*100))}return{text:n.join("\n\n--- Page Break ---\n\n"),pages:n}}o.GlobalWorkerOptions.workerSrc="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js"}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[9099,9090,1896,2207,7296,9642,2198,1455,2326],()=>r(3377));module.exports=s})();