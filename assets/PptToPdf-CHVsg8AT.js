import{j as e}from"./main-Km-AAsVB.js";import{e as n}from"./vendor-XsA2aSF3.js";import{T as X}from"./ToolLayout-Bi5fIwB3.js";import{E as A,h as B}from"./jspdf-C8O79bco.js";import{c as R}from"./confetti.module-B5JVzsfH.js";import{B as D,u as W}from"./icons-DLZuS38b.js";function Y(){const[u,P]=n.useState(null),[a,g]=n.useState([]),[w,p]=n.useState(0),[j,N]=n.useState(!1),[E,b]=n.useState(0),[T,x]=n.useState(""),[k,d]=n.useState(""),[F,S]=n.useState(!1),m=n.useRef(null),z=async t=>{P(t),x(""),d(""),g([]),p(0),S(!0);try{if(!window.JSZip)throw new Error("ZIP library (JSZip) failed to load.");const s=await t.arrayBuffer(),r=await window.JSZip.loadAsync(s),i=[];if(r.forEach((l,c)=>{l.startsWith("ppt/slides/slide")&&l.endsWith(".xml")&&i.push(c)}),i.sort((l,c)=>{const f=parseInt(l.name.match(/\d+/)[0]),h=parseInt(c.name.match(/\d+/)[0]);return f-h}),i.length===0)throw new Error("No presentation slides identified inside PPTX file structure.");const o=[],y=new DOMParser;for(const l of i){const c=await l.async("text"),h=y.parseFromString(c,"text/xml").getElementsByTagName("a:t"),C=[];for(let v=0;v<h.length;v++)C.push(h[v].textContent);o.push({name:`Slide ${o.length+1}`,text:C.join(" ").trim()||"No text content identified on slide."})}g(o)}catch(s){console.error(s),d("Could not parse PPTX presentation: "+s.message)}finally{S(!1)}};n.useEffect(()=>{if(a.length>0&&m.current){const t=a[w],s=m.current,r=s.contentDocument||s.contentWindow.document,i=`
        <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              color: #334155;
              padding: 40px;
              background: #f8fafc;
              margin: 0;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              box-sizing: border-box;
            }
            .slide-card {
              border: 1px solid #e2e8f0;
              background: #ffffff;
              border-radius: 12px;
              padding: 30px;
              height: calc(100vh - 80px);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              box-sizing: border-box;
            }
            h1 {
              font-size: 24pt;
              font-weight: bold;
              color: #4f46e5;
              margin-top: 0;
              margin-bottom: 20px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 10px;
            }
            p {
              font-size: 14pt;
              line-height: 1.6;
              margin-bottom: 0;
              text-align: left;
              flex-grow: 1;
            }
            .footer {
              font-size: 10pt;
              color: #94a3b8;
              text-align: right;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="slide-card">
            <h1>${t.name}</h1>
            <p>${t.text}</p>
            <div class="footer">${t.name} of ${a.length}</div>
          </div>
        </body>
        </html>
      `;r.open(),r.write(i),r.close()}},[a,w]);const M=()=>{P(null),g([]),p(0),x(""),d("")},L=async()=>{if(!(!u||a.length===0)){N(!0),d(""),x(""),b(10);try{const t=new A("l","mm","a4"),s=297,r=210,i=m.current;if(!i)throw new Error("Preview sandbox is not initialized.");for(let o=0;o<a.length;o++){p(o),await new Promise(f=>setTimeout(f,300));const y=i.contentDocument.body,c=(await B(y,{scale:1.5,useCORS:!0,logging:!1,backgroundColor:"#f8fafc"})).toDataURL("image/png");o>0&&t.addPage(),t.addImage(c,"PNG",0,0,s,r),b(Math.round(10+o/a.length*80))}t.save(`${u.name.replace(".pptx","")}.pdf`),b(100),x("PowerPoint slides converted to PDF successfully! Download initialized."),R({particleCount:100,spread:60,origin:{y:.6}})}catch(t){console.error(t),d("Conversion failed: "+t.message)}finally{N(!1)}}},I=e.jsxs("div",{className:"space-y-4",children:[a.length>1&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-semibold uppercase tracking-wider text-slate-400 block",children:"Select Slide"}),e.jsx("div",{className:"flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1",children:a.map((t,s)=>e.jsx("button",{type:"button",onClick:()=>p(s),disabled:j,className:`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${w===s?"bg-primary-600 text-white shadow-md":"text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900/30"}`,children:t.name},t.name))})]}),e.jsxs("div",{className:"p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 text-primary-400 text-xs font-semibold flex items-center gap-2",children:[e.jsx(D,{className:"h-4 w-4"}),e.jsx("span",{children:"Landscape slide layout extraction"})]}),e.jsx("p",{className:"text-[11px] text-slate-500 leading-relaxed",children:"This converter unzips the presentation XML slides, extracts text paragraphs client-side, and compiles pages landscape-style into standard PDF slides."})]}),$=e.jsxs("div",{className:"prose prose-invert max-w-none space-y-6",children:[e.jsx("h2",{className:"text-2xl font-bold font-display text-white",children:"Convert PowerPoint slides to PDF landscape documents"}),e.jsx("p",{className:"text-slate-400",children:"Converting PowerPoint deck files (.pptx) into printable PDFs is essential for pitching documents or class handouts. Our converter reads presentation XML nodes client-side inside your browser sandbox, guaranteeing that your deck remains secure and confidential."}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 pt-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-bold text-white text-sm",children:"Slide Layout Generation"}),e.jsx("p",{className:"text-xs text-slate-500",children:"The script unzips PPTX shapes, extracts slide structures, and compiles paragraphs. Pages are rendered landscape-style onto A4 PDF sheets, ready for presenting."})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-bold text-white text-sm",children:"Complete Data Privacy"}),e.jsx("p",{className:"text-xs text-slate-500",children:"No servers are utilized. Your sales deck files, pitch ideas, or lecture slides remain private inside your local client machine."})]})]})]});return e.jsx(X,{title:"Convert PPT to PDF",description:"Convert Microsoft PowerPoint (.pptx) deck slide files into PDF documents client-side.",icon:D,file:u,onFileSelect:z,onClear:M,controls:I,onExecute:L,isExecuting:j,progress:E,successMessage:T,errorMessage:k,seoContent:$,accept:".pptx",preview:a.length>0?e.jsxs("div",{className:"flex flex-col space-y-3 w-full",children:[e.jsx("h4",{className:"text-xs font-semibold text-slate-400 uppercase tracking-wider",children:"Slide Preview"}),e.jsx("div",{className:"border border-slate-800 rounded-xl bg-white overflow-hidden w-full h-[360px] shadow-inner",children:e.jsx("iframe",{ref:m,title:"PPT Preview Sandbox",className:"w-full h-full border-none"})})]}):F?e.jsxs("div",{className:"flex flex-col items-center justify-center p-12 text-primary-500 space-y-2",children:[e.jsx(W,{className:"h-8 w-8 animate-spin"}),e.jsx("span",{className:"text-xs text-slate-400",children:"Parsing slide vector XML files..."})]}):null})}export{Y as default};
