import{j as e}from"./main-Km-AAsVB.js";import{e as a}from"./vendor-XsA2aSF3.js";import{T as R}from"./ToolLayout-Bi5fIwB3.js";import{c as I}from"./excelParser-DW5v_T8o.js";import{h as G,E as $}from"./jspdf-C8O79bco.js";import{c as z}from"./confetti.module-B5JVzsfH.js";import{r as P,u as A}from"./icons-DLZuS38b.js";import"./pdfjs-CM4jpWHB.js";function V(){const[p,v]=a.useState(null),[o,f]=a.useState([]),[u,g]=a.useState(0),[y,j]=a.useState(!1),[E,l]=a.useState(0),[k,i]=a.useState(""),[C,n]=a.useState(""),[D,N]=a.useState(!1),c=a.useRef(null),F=async t=>{v(t),i(""),n(""),f([]),g(0),N(!0);try{const s=await t.arrayBuffer(),{sheets:r}=await I(s);f(r)}catch(s){console.error(s),n("Could not parse Excel document: "+s.message)}finally{N(!1)}};a.useEffect(()=>{if(o.length>0&&c.current){const t=o[u],s=c.current,r=s.contentDocument||s.contentWindow.document,d=`
        <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              color: #1e293b;
              padding: 20px;
              background: #ffffff;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 8px;
              text-align: left;
              font-size: 11px;
              white-space: nowrap;
            }
            th {
              background-color: #f1f5f9;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
          </style>
        </head>
        <body>
          <h2>Sheet: ${t.name}</h2>
          <div style="overflow-x: auto;">
            ${t.html}
          </div>
        </body>
        </html>
      `;r.open(),r.write(d),r.close()}},[o,u]);const M=()=>{v(null),f([]),g(0),i(""),n("")},T=async()=>{if(!(!p||o.length===0)){j(!0),n(""),i(""),l(20);try{const t=c.current;if(!t)throw new Error("Preview sandbox is not initialized.");const s=t.contentDocument.body;l(40);const r=await G(s,{scale:2,useCORS:!0,logging:!1,backgroundColor:"#ffffff"});l(70);const d=r.toDataURL("image/png"),x=new $("p","mm","a4"),b=210,S=295,h=r.height*b/r.width;let m=h,w=0;for(x.addImage(d,"PNG",0,w,b,h),m-=S,l(85);m>=0;)w=m-h,x.addPage(),x.addImage(d,"PNG",0,w,b,h),m-=S;x.save(`${p.name.replace(".xlsx","").replace(".xls","")}.pdf`),l(100),i("Excel sheet successfully converted to PDF! Download initialized."),z({particleCount:100,spread:60,origin:{y:.6}})}catch(t){console.error(t),n("Conversion failed: "+t.message)}finally{j(!1)}}},L=e.jsxs("div",{className:"space-y-4",children:[o.length>1&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-semibold uppercase tracking-wider text-slate-400 block",children:"Select Sheet"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:o.map((t,s)=>e.jsx("button",{type:"button",onClick:()=>g(s),disabled:y,className:`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${u===s?"bg-primary-600 text-white shadow-md":"text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900/30"}`,children:t.name},t.name))})]}),e.jsxs("div",{className:"p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold flex items-center gap-2",children:[e.jsx(P,{className:"h-4 w-4"}),e.jsx("span",{children:"SheetJS Workbook Matrix Render"})]}),e.jsx("p",{className:"text-[11px] text-slate-500 leading-relaxed",children:"This converter parses the binary workbook and extracts tabular ranges client-side, compiling cells into standard vector page snapshots before exporting the PDF file."})]}),H=e.jsxs("div",{className:"prose prose-invert max-w-none space-y-6",children:[e.jsx("h2",{className:"text-2xl font-bold font-display text-white",children:"Convert Excel workbooks to PDF documents securely"}),e.jsx("p",{className:"text-slate-400",children:"Converting spreadsheet ranges (.xlsx/.xls) to printable PDF sheets is essential when sharing financial updates, ledger charts, or tables. Most online sites require uploading your files, which exposes corporate details. Our converter translates files client-side, maintaining complete data safety."}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 pt-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-bold text-white text-sm",children:"Automated Grid Layouts"}),e.jsx("p",{className:"text-xs text-slate-500",children:"SheetJS reads sheet rows, formatting them as HTML table layouts. The layout parses cell paddings, border grids, and text colors and exports them directly into PDF page layers."})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-bold text-white text-sm",children:"Secure Client Sandbox"}),e.jsx("p",{className:"text-xs text-slate-500",children:"No network data egress. The sheet processing operates locally inside your computer browser memory, ensuring compliance with strict compliance standards."})]})]})]});return e.jsx(R,{title:"Convert Excel to PDF",description:"Convert Microsoft Excel (.xlsx/.xls) spreadsheet grids into clean PDF documents client-side.",icon:P,file:p,onFileSelect:F,onClear:M,controls:L,onExecute:T,isExecuting:y,progress:E,successMessage:k,errorMessage:C,seoContent:H,accept:".xlsx,.xls,.csv",preview:o.length>0?e.jsxs("div",{className:"flex flex-col space-y-3 w-full",children:[e.jsx("h4",{className:"text-xs font-semibold text-slate-400 uppercase tracking-wider",children:"Document Preview"}),e.jsx("div",{className:"border border-slate-800 rounded-xl bg-white overflow-hidden w-full h-[360px] shadow-inner",children:e.jsx("iframe",{ref:c,title:"Excel Preview Sandbox",className:"w-full h-full border-none"})})]}):D?e.jsxs("div",{className:"flex flex-col items-center justify-center p-12 text-primary-500 space-y-2",children:[e.jsx(A,{className:"h-8 w-8 animate-spin"}),e.jsx("span",{className:"text-xs text-slate-400",children:"Parsing spreadsheet cell matrices..."})]}):null})}export{V as default};
