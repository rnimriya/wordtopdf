import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, ArrowLeft, RefreshCw, Loader2, X, Sparkles, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Dropzone from './Dropzone.jsx';

function ToolLayout({
  title,
  description,
  icon: Icon,
  file,
  onFileSelect,
  onClear,
  preview,
  controls,
  onExecute,
  isExecuting,
  progress = 0,
  successMessage,
  errorMessage,
  seoContent,
  multiple = false,
  accept = ".pdf",
  children
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);
  
  // SaaS Usage Tracker & Gating States
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalReason, setModalReason] = useState('limit'); // 'limit-local', 'limit-server', 'pro-only', 'file-size'
  const [localConversionsToday, setLocalConversionsToday] = useState(0);
  const [serverUsage, setServerUsage] = useState(null);

  // Determine if it is a Pro-only tool (AI assistants and PDF OCR)
  const isAiTool = title.toLowerCase().includes('ai') || 
                   title.toLowerCase().includes('chat') || 
                   title.toLowerCase().includes('summariz') || 
                   title.toLowerCase().includes('question') || 
                   title.toLowerCase().includes('translate');
  const isOcr = title.toLowerCase().includes('ocr');
  const isProOnly = isAiTool || isOcr;

  // File size ceilings
  const isPro = session?.user?.subscriptionStatus === 'active';
  const maxFileSizeMB = isPro ? 250 : (session ? 20 : 10);

  // Sync usage configurations on load or execution change
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const localData = JSON.parse(localStorage.getItem('pdf_conversions') || '{}');
    if (localData.date === todayStr) {
      setLocalConversionsToday(localData.count || 0);
    } else {
      setLocalConversionsToday(0);
    }

    if (session) {
      fetch('/api/usage/check')
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setServerUsage(data);
          }
        })
        .catch(err => console.error("Error checking usage:", err));
    }
  }, [session, isExecuting]);

  // Handle conversion execution checking
  const handleExecuteClick = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // 1. Pro feature gate
    if (isProOnly && !isPro) {
      setModalReason('pro-only');
      setShowUpgradeModal(true);
      return;
    }

    // 2. File size ceiling gate
    if (file) {
      const filesArray = Array.isArray(file) ? file : [file];
      for (const f of filesArray) {
        const fileSizeMB = f.size / 1024 / 1024;
        if (fileSizeMB > maxFileSizeMB) {
          setModalReason('file-size');
          setShowUpgradeModal(true);
          return;
        }
      }
    }

    // 3. Conversion count gate
    if (session) {
      const count = serverUsage ? serverUsage.count : 0;
      const limit = isPro ? 999999 : 5;
      
      if (count >= limit) {
        setModalReason('limit-server');
        setShowUpgradeModal(true);
        return;
      }

      // Track server-side increment
      try {
        const res = await fetch('/api/usage/increment', { method: 'POST' });
        const data = await res.json();
        if (!res.ok || !data.allowed) {
          setModalReason('limit-server');
          setShowUpgradeModal(true);
          return;
        }
        setServerUsage(prev => prev ? { ...prev, count: data.count } : null);
      } catch (err) {
        console.error("Failed to increment usage:", err);
      }
    } else {
      if (localConversionsToday >= 3) {
        setModalReason('limit-local');
        setShowUpgradeModal(true);
        return;
      }

      // Record local usage increment
      const todayStr = new Date().toISOString().split('T')[0];
      const localData = { date: todayStr, count: localConversionsToday + 1 };
      localStorage.setItem('pdf_conversions', JSON.stringify(localData));
      setLocalConversionsToday(localConversionsToday + 1);
    }

    if (onExecute) {
      onExecute();
    }
  };

  // Dynamic step instructions helper for copywriting
  const getStepGuideData = (titleStr) => {
    const t = titleStr.toLowerCase();
    if (t.includes('merge')) {
      return {
        action: 'merge PDF files',
        step1Title: 'Upload Documents',
        step1Desc: 'Select or drag-and-drop the multiple PDF files you want to combine. You can add more files at any point.',
        step2Title: 'Arrange Order',
        step2Desc: 'Reorder the pages or files to set your preferred final sequence. For large print merges, verify page size compatibility (A4 vs US Letter) to ensure uniform printing.',
        step3Title: 'Merge & Save',
        step3Desc: 'Click the convert button. Your combined PDF will be compiled in local memory and downloaded instantly, keeping all layout streams intact.'
      };
    } else if (t.includes('rotate')) {
      return {
        action: 'rotate PDF pages',
        step1Title: 'Select PDF',
        step1Desc: 'Upload the PDF document that needs rotation adjustments from your local drive.',
        step2Title: 'Choose Angles',
        step2Desc: 'Select individual pages or rotate all pages to match your preferred orientation. Essential for aligning scanned landscapes or upside-down mobile scans.',
        step3Title: 'Apply & Save',
        step3Desc: 'Click convert. Your newly oriented document is rewritten in memory and downloaded without re-compressing underlying image streams.'
      };
    } else if (t.includes('protect')) {
      return {
        action: 'protect PDF files',
        step1Title: 'Upload PDF',
        step1Desc: 'Upload the sensitive document you wish to encrypt with a password.',
        step2Title: 'Set Password',
        step2Desc: 'Enter a strong open password to apply standard AES/RC4 encryption. Note: We operate a zero-upload model, so write it down safely; we cannot recover passwords.',
        step3Title: 'Secure File',
        step3Desc: 'Confirm settings. Your file is encrypted in-browser and downloaded safely, locking copying, editing, or printing based on your chosen rules.'
      };
    } else if (t.includes('compress')) {
      return {
        action: 'compress PDF sizes',
        step1Title: 'Upload PDF',
        step1Desc: 'Select the large PDF file you want to compress and optimize for web sharing.',
        step2Title: 'Choose Level',
        step2Desc: 'Choose your preferred optimization level. Recommended compression scales image resolutions to 150 DPI and wipes metadata without sacrificing text sharpness.',
        step3Title: 'Save Smaller PDF',
        step3Desc: 'Download your optimized, light PDF directly in seconds, bypassing long network upload and download cycles.'
      };
    } else if (t.includes('ocr')) {
      return {
        action: 'perform OCR on PDF',
        step1Title: 'Upload Scanned PDF',
        step1Desc: 'Select the scanned PDF or image containing text you want to extract.',
        step2Title: 'Run OCR',
        step2Desc: 'Configure language options and run local optical character recognition. Clean typefaces yield near-perfect text extraction; handwritten notes or cursive styles may vary.',
        step3Title: 'Save Text',
        step3Desc: 'Instantly download your extracted text contents as an editable file or copy it straight to your clipboard.'
      };
    } else if (t.includes('extract image')) {
      return {
        action: 'extract images from PDF',
        step1Title: 'Upload PDF',
        step1Desc: 'Upload the PDF containing embedded raster images you want to extract.',
        step2Title: 'Select Format',
        step2Desc: 'Let the client engine scan pages and prepare images for extraction. This extracts raw embedded bitmap assets without lossy re-rendering, retaining original DPI.',
        step3Title: 'Download Zip',
        step3Desc: 'Download the extracted images packed in a convenient ZIP archive directly to your downloads directory.'
      };
    } else if (t.includes('word to pdf')) {
      return {
        action: 'convert Word to PDF',
        step1Title: 'Upload DOCX',
        step1Desc: 'Select the Microsoft Word (.docx) document from your device.',
        step2Title: 'Format Page',
        step2Desc: 'Verify layout alignment. Our client library parses document styles and margins; we recommend reviewing double columns or custom page breaks to avoid trailing empty spaces.',
        step3Title: 'Download PDF',
        step3Desc: 'Get your professionally formatted PDF document immediately, with embedded styles and hyperlinked text preserved.'
      };
    } else if (t.includes('excel to pdf')) {
      return {
        action: 'convert Excel to PDF',
        step1Title: 'Upload XLSX',
        step1Desc: 'Choose the spreadsheet workbook (.xlsx) to convert.',
        step2Title: 'Align Grid',
        step2Desc: 'Our engine parses sheet grids to render clean table structures. For wide tables, toggle landscape layout or shrink column widths to keep layout columns inline.',
        step3Title: 'Download PDF',
        step3Desc: 'Download the converted spreadsheet layout as a printable PDF file, complete with page numbering.'
      };
    } else if (t.includes('ppt to pdf')) {
      return {
        action: 'convert PPT to PDF',
        step1Title: 'Upload PPTX',
        step1Desc: 'Select the PowerPoint presentation (.pptx) file.',
        step2Title: 'Prepare Slides',
        step2Desc: 'Convert vector slide layouts in memory, preserving design alignment. Note that dynamic transition animations will compile as static slide layers.',
        step3Title: 'Download PDF',
        step3Desc: 'Download high-quality slides saved as a page-by-page PDF, suitable for digital distribution and presenting.'
      };
    } else if (t.includes('jpg to pdf') || t.includes('png to pdf') || t.includes('image to pdf')) {
      return {
        action: 'convert images to PDF',
        step1Title: 'Select Images',
        step1Desc: 'Upload the photos or image files you want to compile into a single document.',
        step2Title: 'Order & Spacing',
        step2Desc: 'Reorder images and set page margins. Match page fit to portrait or landscape depending on the image aspect ratios to prevent clipping.',
        step3Title: 'Save PDF',
        step3Desc: 'Compile images and download your clean PDF file immediately, with full resolution preserved.'
      };
    } else if (t.includes('text to pdf')) {
      return {
        action: 'convert text to PDF',
        step1Title: 'Enter Text',
        step1Desc: 'Type or paste plain text blocks directly into the input fields.',
        step2Title: 'Configure Font',
        step2Desc: 'Choose text wrapping margins and monospace formatting parameters. Monospace is recommended for code snippets or structured logs.',
        step3Title: 'Download PDF',
        step3Desc: 'Generate the PDF document client-side and download it in seconds, with proper word-wrapping applied.'
      };
    } else if (t.includes('html to pdf')) {
      return {
        action: 'convert HTML to PDF',
        step1Title: 'Input HTML Code',
        step1Desc: 'Type webpage URLs or paste custom HTML code blocks.',
        step2Title: 'Render Layout',
        step2Desc: 'Capture coordinates and prepare responsive print styles. Complex animations or dynamic widgets may render as static screenshots; confirm media query print styles.',
        step3Title: 'Download PDF',
        step3Desc: 'Download your high-fidelity, rendered webpage as a clean PDF, with clickable links preserved.'
      };
    } else if (t.includes('pdf to word')) {
      return {
        action: 'convert PDF to Word',
        step1Title: 'Select PDF',
        step1Desc: 'Upload the PDF document you want to edit in Microsoft Word.',
        step2Title: 'Extract Text',
        step2Desc: 'Wait for the browser engine to parse rows, columns, and characters. Converting complex nested data tables or mathematical formulas may require alignment review post-conversion.',
        step3Title: 'Download DOCX',
        step3Desc: 'Save the output as a fully editable Word file directly to your system, ready for Microsoft Office editing.'
      };
    } else if (t.includes('pdf to excel')) {
      return {
        action: 'convert PDF to Excel',
        step1Title: 'Upload PDF File',
        step1Desc: 'Upload the PDF file containing data grids or tables.',
        step2Title: 'Parse Grid',
        step2Desc: 'The processor automatically groups text segments into rows and columns. Merged cells or overlapping text blocks may require columns review in your spreadsheet software.',
        step3Title: 'Download XLSX',
        step3Desc: 'Download the compiled spreadsheets for further analysis, with numbers and tables mapped into cells.'
      };
    } else if (t.includes('pdf to ppt')) {
      return {
        action: 'convert PDF to PPT',
        step1Title: 'Select PDF',
        step1Desc: 'Choose the PDF presentation pages you want to edit.',
        step2Title: 'Create Slides',
        step2Desc: 'Our layout engine transforms pages into slides with editable elements. Vector paths are preserved, but embedded page animations are omitted.',
        step3Title: 'Download PPTX',
        step3Desc: 'Save presentation files and edit in Microsoft PowerPoint, with layouts restructured into slides.'
      };
    } else if (t.includes('pdf to jpg') || t.includes('pdf to png')) {
      return {
        action: 'convert PDF to images',
        step1Title: 'Upload PDF',
        step1Desc: 'Upload the PDF document you wish to convert into image files.',
        step2Title: 'Select Resolution',
        step2Desc: 'Select target pages and set output format to JPG or PNG. Ideal for creating fast previews or isolating high-resolution page grids.',
        step3Title: 'Save ZIP',
        step3Desc: 'Download rendered pages as high-resolution images or a ZIP archive directly.'
      };
    }

    // Default fallback
    return {
      action: 'process PDF documents',
      step1Title: 'Upload Files',
      step1Desc: 'Select or drag-and-drop the documents you want to process.',
      step2Title: 'Configure Settings',
      step2Desc: 'Adjust compliance options and output settings. Double-check layout flows and fonts for optimal browser-based compilation.',
      step3Title: 'Download File',
      step3Desc: 'Wait for local browser compilation and save your document.'
    };
  };

  const stepGuide = getStepGuideData(title);

  const getFaqs = (titleStr) => {
    const t = titleStr.toLowerCase();
    const action = getStepGuideData(titleStr).action;
    
    if (t.includes('merge')) {
      return [
        { q: 'How many PDF files can I merge at once?', a: 'There are no limitations on the number of files. You can upload and compile as many documents as your browser memory can hold.' },
        { q: 'Will the merged PDF lose document quality?', a: 'No. Our client-side script parses original vector and image page nodes directly without re-rendering, retaining 100% of the original text format and image quality.' },
        { q: 'Can I reorder files after uploading them?', a: 'Yes. You can visually arrange documents in the exact order you want them merged using the list management controls.' },
        { q: 'Is it safe to merge confidential documents here?', a: 'Completely. Because all merging scripts run locally inside your browser cache, your private records never upload to any server.' },
        { q: 'Do you support encrypted or password-protected PDFs?', a: 'You must unlock password-protected files before merging. Try our Unlock PDF tool first.' },
        { q: 'How long does the merging process take?', a: 'Merging takes only a few seconds as it runs on local CPU memory, bypassing network upload bottlenecks.' },
        { q: 'Does this tool work offline?', a: 'Yes. Once loaded, you can turn off your internet connection and merge files completely offline.' },
        { q: 'Can I merge other file formats like Word directly?', a: 'No, they must be PDFs first. You can convert Word documents using our Word to PDF tool, then merge them here.' }
      ];
    } else if (t.includes('split')) {
      return [
        { q: 'How does splitting a PDF work?', a: 'Our engine extracts specific page indices or ranges and saves them as a new, standalone PDF file.' },
        { q: 'Can I split a PDF into single-page documents?', a: 'Yes. You can extract individual pages separately or split all pages into individual files.' },
        { q: 'Will split files retain links and bookmarks?', a: 'Yes. Internal page links, text formatting, and original vector paths are preserved inside the extracted pages.' },
        { q: 'Can I split password-protected PDFs?', a: 'You must decrypt the file using your password first before splitting. Use our Unlock PDF tool for this.' },
        { q: 'Are my split files saved on your servers?', a: 'No. The splitting runs client-side in your browser sandbox, keeping your documents 100% private.' },
        { q: 'What is the maximum file size I can split?', a: 'There are no limits. Large files can be split depending on your local device RAM capacity.' },
        { q: 'Is this tool completely free?', a: 'Yes, all split configurations are free with no watermarks or registration required.' },
        { q: 'Does it support offline processing?', a: 'Yes. The extraction code runs offline in your browser cache.' }
      ];
    } else if (t.includes('compress')) {
      return [
        { q: 'How does the PDF compressor work without losing quality?', a: 'Our tool optimizes PDF resources by downscaling high-resolution images to 150 DPI and removing redundant metadata objects.' },
        { q: 'What are the compression levels available?', a: 'You can choose between Recommended (great balance of quality and size), Extreme (maximum size reduction), and Low compression (high quality).' },
        { q: 'Will the compressed PDF have blurry images?', a: 'No. Recommended compression preserves crisp readability for text and images while cutting file size up to 70%.' },
        { q: 'Can I compress scanned document PDFs?', a: 'Yes. Scanned pages are optimized by compressing their underlying image components directly.' },
        { q: 'Is there a limit on file sizes for compression?', a: 'No limit. Since processing runs locally inside your browser memory, you can compress very large PDFs.' },
        { q: 'Are my private documents safe here?', a: 'Yes. Your files never upload to a server. All compression is executed 100% client-side.' },
        { q: 'Can I compress files offline?', a: 'Yes, all scripts operate locally in your browser cache and do not require internet access.' },
        { q: 'Does this tool add watermarks?', a: 'No. The downloaded output is clean and free of watermarks.' }
      ];
    } else if (t.includes('protect') || t.includes('encrypt')) {
      return [
        { q: 'How strong is the PDF encryption?', a: 'We utilize standard 128-bit AES encryption to lock and password-protect your PDF document layers.' },
        { q: 'Can anyone open my protected PDF without the password?', a: 'No. The document remains strongly encrypted. Only users with the correct open password can access content.' },
        { q: 'What happens if I lose the password to my protected PDF?', a: 'Because we operate on a zero-upload private model, we do not store passwords. We cannot recover lost passwords.' },
        { q: 'Can I set restrictions like preventing copying or printing?', a: 'Yes. Our tools allow you to configure custom user permissions to lock copying and printing.' },
        { q: 'Is it safe to type my sensitive passwords here?', a: 'Yes, because password stamping happens locally inside your browser. No passwords are sent over the web.' },
        { q: 'Can I encrypt PDF files offline?', a: 'Yes, the encryption scripts run completely offline.' },
        { q: 'Do you charge for locking documents?', a: 'No, our security utilities are 100% free with no caps.' },
        { q: 'Can I protect multiple PDFs at once?', a: 'No, you must set passwords for files individually to ensure custom security.' }
      ];
    } else if (t.includes('unlock')) {
      return [
        { q: 'Can I unlock a PDF if I do not know the password?', a: 'No. You must enter the correct owner password to decrypt and unlock the document.' },
        { q: 'Is it legal to unlock PDF files here?', a: 'Yes, provided you are the legal owner or have permission from the document author to decrypt it.' },
        { q: 'Will unlocking a PDF remove all permissions?', a: 'Yes, it removes open passwords and print, edit, or copy restrictions permanently.' },
        { q: 'Is my password sent to your servers?', a: 'No. Decryption is performed entirely inside your browser memory. We never see or store your passwords.' },
        { q: 'Does this tool work on mobile devices?', a: 'Yes, you can unlock PDFs on iOS, Android, macOS, and Windows browsers.' },
        { q: 'Are there file size limitations?', a: 'No. Processing is limited only by your browser RAM.' },
        { q: 'Can I unlock scanned files?', a: 'Yes, scanned and encrypted PDFs are supported.' },
        { q: 'Does it support offline decryption?', a: 'Yes. Once loaded, you can decrypt files completely offline.' }
      ];
    } else if (t.includes('rotate')) {
      return [
        { q: 'Can I rotate single pages instead of the whole document?', a: 'Yes. You can rotate individual pages 90, 180, or 270 degrees, or apply the rotation to all pages.' },
        { q: 'Will the document text remain searchable after rotation?', a: 'Yes. Rotation only modifies layout viewport coordinate matrix indicators, preserving text nodes.' },
        { q: 'Can I rotate scanned PDFs?', a: 'Yes, the layout coordinates are adjusted so scanned images appear in the correct orientation.' },
        { q: 'Are rotated files stored on your server?', a: 'No. Files are rotated in your browser sandbox, ensuring absolute document privacy.' },
        { q: 'Can I undo rotation before saving?', a: 'Yes, you can click rotation controls to adjust orientation as needed before compiling.' },
        { q: 'Does it work offline?', a: 'Yes, rotation scripts operate locally.' },
        { q: 'Is there a limit on page counts?', a: 'No. You can rotate documents with hundreds of pages.' },
        { q: 'Does it add any watermarks?', a: 'No, it is free of watermarks.' }
      ];
    } else if (t.includes('ocr')) {
      return [
        { q: 'How does the browser-based OCR tool work?', a: 'Our OCR engine uses WebAssembly-compiled character recognition libraries to extract text directly within your browser.' },
        { q: 'Is my scanned document sent to any server for processing?', a: 'No, never. The text recognition runs entirely on your local machine, ensuring absolute privacy.' },
        { q: 'What languages does the OCR tool support?', a: 'We support English, Spanish, French, German, Chinese, Japanese, and over 50 other languages.' },
        { q: 'Can I convert scanned PDFs to searchable PDF documents?', a: 'Yes, our OCR tool extracts text and overlays it transparently onto the PDF so it becomes fully searchable.' },
        { q: 'Will the output text preserve the original document layout?', a: 'Yes, our layout engine maps coordinates to position recognized text blocks exactly where they were in the scan.' },
        { q: 'What is the maximum page limit for local OCR?', a: 'We recommend processing up to 30 pages at once to prevent browser memory limits on lower-end devices.' },
        { q: 'Does it recognize handwritten text?', a: 'It is highly optimized for printed typefaces. Clear handwriting is recognized, but script styles may vary in accuracy.' },
        { q: 'Is this OCR tool free to use?', a: 'Yes, it is completely free with no registration requirements or daily limits.' }
      ];
    } else if (t.includes('watermark')) {
      return [
        { q: 'Can I add both text and image watermarks?', a: 'Yes. You can type custom text watermarks or upload images, such as company logos, to place on your document pages.' },
        { q: 'Is it possible to adjust the watermark opacity?', a: 'Yes, you can configure the transparency from 10% to 100% to ensure it does not block the underlying text.' },
        { q: 'Can I choose which pages will display the watermark?', a: 'Yes. You can apply it to all pages, odd/even pages only, or define specific page ranges.' },
        { q: 'Are watermarks permanently stamped into the document?', a: 'Yes. The stamping merges directly into the PDF content stream, making it highly secure and difficult to remove.' },
        { q: 'Does my uploaded watermark logo image leave my device?', a: 'No. All rendering and layout placement are performed locally within your browser sandbox.' },
        { q: 'Can I rotate the text watermark?', a: 'Yes, you can adjust the rotation angle from -90 to +90 degrees to lay text diagonally.' },
        { q: 'What font options do you support for text watermarks?', a: 'We support standard high-compatibility fonts like Helvetica, Times, and Courier in bold and italic.' },
        { q: 'Does Word To PDF Convertor add its own watermarks to my files?', a: 'No. Your compiled outputs remain entirely clean, professional, and free of any third-party branding.' }
      ];
    } else if (t.includes('repair')) {
      return [
        { q: 'How does client-side PDF repair work?', a: 'Our tool scans the file structure, reconstructs corrupted cross-reference tables (xref), and fixes trailer offsets locally.' },
        { q: 'Can you fix every corrupted PDF file?', a: 'We can fix syntax issues, trailing byte errors, and page tree mismatches. Files with overwritten or completely missing data streams cannot be restored.' },
        { q: 'Will my repaired files be sent to a server?', a: 'No. The repair algorithms execute 100% within your local browser sandbox, securing your documents.' },
        { q: 'Why do PDF documents get corrupted?', a: 'Interrupted downloads, network drops, server transfer errors, or crashes during saving are common causes.' },
        { q: 'Do you support repairing encrypted PDFs?', a: 'The file must be decrypted first, or you must supply the password to parse and repair its stream elements.' },
        { q: 'Will repairing a PDF change its contents or styling?', a: 'No. We only rebuild the document structure to make the existing content readable by standard PDF viewers.' },
        { q: 'Is there a size limit for PDF repair?', a: 'There are no strict limits, but files over 100MB may take longer to process depending on device RAM.' },
        { q: 'Is this repair utility free?', a: 'Yes. All file recovery options are completely free and open to use.' }
      ];
    } else if (t.includes('organize') || t.includes('delete') || t.includes('extract pages')) {
      return [
        { q: 'How do I reorder pages inside a PDF?', a: 'You can visually drag-and-drop page thumbnails to rearrange them in the exact sequence you want.' },
        { q: 'Can I delete multiple pages at once?', a: 'Yes. Select the checkboxes on the page thumbnails you wish to delete and click the remove action.' },
        { q: 'Can I rotate single pages while organizing?', a: 'Yes. Each thumbnail has individual rotation controls to adjust single pages without affecting the rest.' },
        { q: 'How do I extract specific pages into a new file?', a: 'Choose the page numbers you want, click extract, and they will compile into a standalone document.' },
        { q: 'Are my files uploaded during page reorganization?', a: 'No. Page restructuring is completed in-memory inside your browser, ensuring total privacy.' },
        { q: 'What happens to internal links and forms after reordering?', a: 'Interactive links and form elements are automatically re-mapped to their new page indices.' },
        { q: 'Can I compile and organize pages from different PDFs?', a: 'Yes. You can upload multiple files, combine their pages, and sort them together.' },
        { q: 'Is there a limit to how many pages I can manage?', a: 'No. The visual grid can handle document lengths of several hundred pages smoothly.' }
      ];
    } else if (t.includes('autocad') || t.includes('dwg')) {
      return [
        { q: 'Which AutoCAD formats are supported?', a: 'We convert DWG, DXF, and DWF CAD extensions directly into standard vector PDFs.' },
        { q: 'Do I need AutoCAD software installed to use this tool?', a: 'No. Our client-side rendering library parses CAD layers without requiring external software.' },
        { q: 'Will the converted PDF preserve AutoCAD layers?', a: 'Yes. Our high-fidelity parser maps CAD layers to PDF document layers so they remain togglable.' },
        { q: 'Is my engineering drawing secure from being uploaded?', a: 'Yes. All AutoCAD parsing scripts run locally in-browser. Your designs never touch our servers.' },
        { q: 'Can I convert multiple layout viewports?', a: 'We convert the main model space and all active layouts to separate pages in the PDF file.' },
        { q: 'Does the tool support custom color mapping?', a: 'Yes. You can choose to export layout lines in full color or monochrome (grayscale/black-and-white).' },
        { q: 'What is the maximum file size for CAD conversions?', a: 'We recommend CAD files under 50MB for smooth client-side loading.' },
        { q: 'Is the converted PDF scale-accurate?', a: 'Yes. Vector line geometries and drawing scale ratios are preserved during the layout conversion.' }
      ];
    } else if (t.includes('ebook') || t.includes('epub') || t.includes('mobi')) {
      return [
        { q: 'What eBook formats can I convert to PDF?', a: 'We support EPUB, MOBI, AZW3, and FB2 eBook formats.' },
        { q: 'Will the converted PDF keep the eBook styling?', a: 'Yes. We parse CSS files and HTML tags to keep fonts, margins, and page breaks as close to the original as possible.' },
        { q: 'Does it convert book images and cover art?', a: 'Yes. Cover images and embedded graphics are converted and rendered inside the PDF pages.' },
        { q: 'Are my personal books uploaded to your servers?', a: 'No. The conversion executes entirely within your browser cache, keeping your library private.' },
        { q: 'Can I choose the page size for the output PDF?', a: 'Yes. You can select standard sizes like A4, A5, US Letter, or match standard e-Reader screen dimensions.' },
        { q: 'Will the table of contents remain clickable?', a: 'Yes. Internal book links and Table of Contents tags are translated to PDF outline bookmarks.' },
        { q: 'Do you support DRM-protected eBooks?', a: 'No. We cannot parse DRM-protected files. eBooks must be DRM-free to convert.' },
        { q: 'Is this eBook converter free?', a: 'Yes, it is 100% free with no limits on the number of books converted.' }
      ];
    } else if (t.includes('iwork') || t.includes('pages') || t.includes('key')) {
      return [
        { q: 'Can I convert Apple iWork files to PDF on Windows?', a: 'Yes. Our tool converts Apple Pages, Keynote, and Numbers layouts on any system using a standard web browser.' },
        { q: 'Do I need an Apple iCloud account to convert files?', a: 'No. The converter parses zip containers of iWork documents inside the browser without cloud APIs.' },
        { q: 'Will Keynote animations be converted?', a: 'Transitions and animations are static. Each slide compiles to a PDF page.' },
        { q: 'Are the document fonts preserved?', a: 'We use standard web font fallbacks to match iWork fonts as closely as possible.' },
        { q: 'Is it safe to convert business spreadsheets here?', a: 'Absolutely. Your sensitive sheets never leave your device.' },
        { q: 'Can I convert multiple Pages files at once?', a: 'Yes, multiple file queue uploads are fully supported.' },
        { q: 'Does it support page margins set in Pages?', a: 'Yes, layout geometries are parsed and mapped accurately.' },
        { q: 'Is this service free to use?', a: 'Yes, 100% free with no subscription.' }
      ];
    } else if (t.includes('html to pdf') || t.includes('html')) {
      return [
        { q: 'How does HTML to PDF conversion work?', a: 'You can paste raw HTML codes or enter a URL. The browser captures layout styles to print a high-quality PDF.' },
        { q: 'Will the PDF look exactly like the webpage?', a: 'Yes, media query print stylesheets are rendered for accurate document capture.' },
        { q: 'Can I convert password-protected web pages?', a: 'For private pages, we recommend copying the raw HTML code and pasting it here.' },
        { q: 'Does it support Javascript rendering?', a: 'Yes, we wait for dynamic styles and scripts to load before compiling the layout.' },
        { q: 'Are my URLs logged on your server?', a: 'No, web calls and captures run entirely within your local client sandbox.' },
        { q: 'Can I customize page orientation (landscape/portrait)?', a: 'Yes, options for orientation and margins are configurable.' },
        { q: 'Does it support CSS background colors and images?', a: 'Yes, you can toggle background printing in options.' },
        { q: 'Is it free?', a: 'Yes, all HTML conversions are completely free.' }
      ];
    } else if (t.includes('pdf/a') || t.includes('pdfa')) {
      return [
        { q: 'What is PDF/A and why is it used?', a: 'PDF/A is an ISO-standardized version of PDF designed for long-term digital archiving, removing dynamic/external features.' },
        { q: 'Which PDF/A profiles do you support?', a: 'We support PDF/A-1b, PDF/A-2b, and PDF/A-3b standards.' },
        { q: 'Will converting to PDF/A change the document contents?', a: 'No, but it embeds color spaces, removes external references, and embeds all fonts.' },
        { q: 'Is my PDF/A conversion secure?', a: 'Yes, the conversion runs entirely in-browser. Your files are not uploaded.' },
        { q: 'Will forms and javascript remain active?', a: 'No, PDF/A forbids interactive scripts, so forms are flattened to ensure durability.' },
        { q: 'Does it support OCR during PDF/A conversion?', a: 'You can run our OCR tool first to embed search text, then convert to PDF/A.' },
        { q: 'Does PDF/A support compression?', a: 'Yes, embedded structures are compressed to save storage space.' },
        { q: 'Is this tool free?', a: 'Yes, completely free.' }
      ];
    } else if (t.includes('scanner')) {
      return [
        { q: 'How does the PDF Scanner tool work?', a: 'It accesses your device webcam or camera to snap photos of documents and compiles them.' },
        { q: 'Is the video feed sent to a server?', a: 'No, the camera stream is processed locally. We never record or upload your feed.' },
        { q: 'Does it have auto-border detection?', a: 'Yes, our client-side computer vision algorithm detects document edges and crops automatically.' },
        { q: 'Can I scan multiple pages into one PDF?', a: 'Yes. You can snap pages sequentially, reorder them, and download them as a single PDF.' },
        { q: 'Are scanned images optimized for readability?', a: 'Yes, we apply filters like grayscale, high-contrast, and document-cleanup.' },
        { q: 'Does it work on mobile phones?', a: 'Yes, it is fully optimized for mobile camera viewports.' },
        { q: 'Can I extract text from scans?', a: 'Yes. After scanning, you can run OCR to extract editable text.' },
        { q: 'Is this tool free?', a: 'Yes, completely free.' }
      ];
    } else if (t.includes('edit') || t.includes('annotator')) {
      return [
        { q: 'How do I edit text inside a PDF?', a: 'You can click on text boxes to edit text, or add new text blocks anywhere on the page.' },
        { q: 'Can I draw freehand on the PDF?', a: 'Yes, we provide drawing pencils and highlighters with customizable colors and widths.' },
        { q: 'Are my edits secure?', a: 'Yes. Edits are rendered on local canvas overlays, ensuring no files upload to servers.' },
        { q: 'Can I add shapes like arrows and rectangles?', a: 'Yes, a full suite of vector shapes is available to highlight contents.' },
        { q: 'Can I insert images into the PDF?', a: 'Yes, you can upload JPG/PNG images and place/resize them on any page.' },
        { q: 'Does it support editing scanned PDFs?', a: 'You can annotate and draw on scanned files, and write new text over them.' },
        { q: 'Does it work offline?', a: 'Yes, the annotation suite works completely offline.' },
        { q: 'Is it free?', a: 'Yes, fully free with no watermarks.' }
      ];
    } else if (t.includes('word') && t.includes('to')) {
      return [
        { q: 'Will my Word document layout remain the same in PDF?', a: 'Yes. We preserve layouts, fonts, paragraphs, and tables as closely as possible during conversion.' },
        { q: 'Do I need Microsoft Office installed?', a: 'No. All rendering is completed by browser-based javascript libraries without requiring Office.' },
        { q: 'Does this tool support DOC and DOCX formats?', a: 'Yes, both .doc and .docx files are fully supported.' },
        { q: 'Is my document text safe from leaks?', a: 'Yes. Conversion takes place locally inside your browser cache. No files are uploaded.' },
        { q: 'How fast is the conversion?', a: 'Conversions are near-instant since there are no upload or download delays.' },
        { q: 'Can I convert Word files offline?', a: 'Yes, once loaded, the conversion works completely offline.' },
        { q: 'Does it support images inside Word files?', a: 'Yes, images are converted and embedded inside the PDF pages.' },
        { q: 'Is this converter free?', a: 'Yes, 100% free with no watermarks.' }
      ];
    } else if (t.includes('to') && (t.includes('word') || t.includes('excel') || t.includes('ppt') || t.includes('jpg') || t.includes('png'))) {
      return [
        { q: `How does PDF to ${titleStr.split('to')[1] ? titleStr.split('to')[1].trim().toUpperCase() : 'format'} conversion work?`, a: `Our client-side engine extracts texts, tables, and image layers from the PDF and compiles them into the selected format.` },
        { q: 'Will the formatting of the PDF be preserved?', a: 'We preserve headers, spacing, and structural tables to keep your documents editable.' },
        { q: 'Can I convert scanned PDFs into editable text?', a: 'Yes, scanned PDFs will convert as images. To extract text, use our PDF OCR tool instead.' },
        { q: 'Are my private PDFs safe from server uploads?', a: 'Absolutely. All parser scripts run locally, ensuring total document privacy.' },
        { q: 'What formats can I export to?', a: 'You can convert PDFs to DOCX, XLSX, PPTX, JPG, and PNG files.' },
        { q: 'Does it work offline?', a: 'Yes, the client-side parsing script runs offline.' },
        { q: 'Are there daily conversion caps?', a: 'No, conversion is unlimited and free.' },
        { q: 'Can I extract images from the PDF separately?', a: 'Yes. Use our Extract Images tool to pull raw raster images.' }
      ];
    } else if (t.includes('ai') || t.includes('chat') || t.includes('summarize')) {
      return [
        { q: 'Is my PDF text private when analyzed by AI tools?', a: 'Yes. We extract texts locally in your browser. All analysis vectors are processed client-side.' },
        { q: 'Do you upload my PDF to cloud AI databases?', a: 'No. The AI engine processes context questions locally using cached model responses.' },
        { q: 'Are there page limits for AI summarization?', a: 'We support documents up to 100 pages to avoid local memory bottlenecks.' },
        { q: 'Can the AI understand scanned PDFs?', a: 'You must run OCR on scanned PDFs first so text layers are readable.' },
        { q: 'Is this service free to use?', a: 'Yes, all our AI PDF assistants are free.' },
        { q: 'Can I copy the AI generated outlines?', a: 'Yes, summaries and generated outlines can be copied to your clipboard.' },
        { q: 'Does it store my chat logs?', a: 'No. Chat logs are held in temporary memory and wiped clean on page refresh.' },
        { q: 'What languages does the AI support?', a: 'The AI helper reads and responds in over 50+ international languages.' }
      ];
    } else if (t.includes('sign') || t.includes('signature')) {
      return [
        { q: 'Are digital signatures created here legally binding?', a: 'Yes, our electronic signatures comply with standard e-signing regulations.' },
        { q: 'Does the tool save my drawn signature on a server?', a: 'No. Signatures are drawn on a local HTML5 canvas and stamped directly onto the PDF in browser memory.' },
        { q: 'Can I upload an image of my handwritten signature?', a: 'Yes. You can upload signature image files and stamp them with adjustable opacity.' },
        { q: 'Can I request other people to sign my documents?', a: 'Yes. Use our Request Signatures page to prepare placeholder fields.' },
        { q: 'Is the signed PDF clean of watermarks?', a: 'Yes. Stamped PDFs are completely free of branding.' },
        { q: 'Does it work on mobile touchscreens?', a: 'Yes, you can draw your signature easily using your finger or stylus on mobile screens.' },
        { q: 'Can I sign documents offline?', a: 'Yes, signing scripts run locally.' },
        { q: 'How many signatures can I add?', a: 'You can add multiple signatures to any page of the PDF.' }
      ];
    }
    
    return [
      { q: `Is it safe to use this online tool to ${action}?`, a: `Yes, Word To PDF Convertor is 100% secure. All document processing takes place directly inside your web browser's local sandbox memory using client-side WebAssembly execution. Your private data is never sent over the network to any third-party server.` },
      { q: `Does Word To PDF Convertor upload my files to any server?`, a: `No, never. Unlike other online converters, Word To PDF Convertor operates on a zero-upload model. Your files remain entirely on your local machine, rendering in-memory buffer grids, which completely eliminates data leakage risk.` },
      { q: `Are there file size limitations when I ${action}?`, a: `No. Since processing happens client-side utilizing your browser's memory and CPU resources, we impose no artificial file size limits or upload caps. You can process large files easily depending on your machine's hardware capability.` },
      { q: `Do I need to sign up or create an account to use this utility?`, a: `No sign-up or registry is required. All converters and PDF editors on Word To PDF Convertor are fully accessible, open, and free for all users with no daily caps or subscriptions.` },
      { q: `Does this ${titleStr} tool add any watermarks?`, a: `No, we do not add any branding, logo overlays, or watermarks to your processed documents. The downloaded outputs remain clean and professional.` },
      { q: `What technology powers the client-side conversions?`, a: `We utilize modern compiled web technologies such as WebAssembly (Wasm), pdf-lib for structure writing, pdfjs-dist for viewport rendering, and standard browser Canvas APIs. This ensures native performance right in your browser.` },
      { q: `Can I use this tool on my smartphone or tablet?`, a: `Absolutely. Word To PDF Convertor is responsive and works smoothly across mobile Safari, Chrome, and desktop viewports, executing in-browser scripts on iOS, Android, macOS, and Windows.` },
      { q: `Can I use this tool offline?`, a: `Yes! Once the webpage is loaded, all processing scripts reside in your local browser cache. You can disconnect your internet connection and continue using the tools safely offline.` }
    ];
  };

  const getRelatedTools = (titleStr) => {
    const t = titleStr.toLowerCase();
    if (t.includes('word') || t.includes('excel') || t.includes('ppt') || t.includes('html') || t.includes('autocad') || t.includes('ebook') || t.includes('iwork') || t.includes('openoffice')) {
      return [
        { title: 'Merge PDF Documents', description: 'Combine multiple PDF files into one clean document.', link: '/merge-pdf' },
        { title: 'Compress PDF Size', description: 'Shrink and optimize your output PDF file size online.', link: '/compress-pdf' }
      ];
    }
    if (t.includes('merge')) {
      return [
        { title: 'Compress PDF Size', description: 'Optimize and reduce size of your compiled PDF document.', link: '/compress-pdf' },
        { title: 'Split PDF Pages', description: 'Extract pages or split your merged PDF into separate files.', link: '/split-pdf' }
      ];
    }
    if (t.includes('compress')) {
      return [
        { title: 'Protect PDF Security', description: 'Encrypt and lock your compressed PDF with strong passwords.', link: '/protect-pdf' },
        { title: 'Merge PDF Documents', description: 'Combine your compressed files into a single document.', link: '/merge-pdf' }
      ];
    }
    if (t.includes('protect') || t.includes('unlock')) {
      return [
        { title: 'Sign PDF Electronic', description: 'Draw, type, or stamp your digital signature on files.', link: '/sign-pdf' },
        { title: 'Compress PDF Size', description: 'Shrink your secure PDF files down for easy email sharing.', link: '/compress-pdf' }
      ];
    }
    if (t.includes('ocr') || t.includes('scan') || t.includes('translate')) {
      return [
        { title: 'Edit PDF Document', description: 'Annotate, draw, write text, and modify PDF pages.', link: '/edit-pdf' },
        { title: 'PDF Scanner Tool', description: 'Scan paper documents from camera and compile to PDF.', link: '/pdf-scanner' }
      ];
    }
    if (t.includes('edit') || t.includes('annotate') || t.includes('redact') || t.includes('sign') || t.includes('watermark')) {
      return [
        { title: 'Flatten PDF Fields', description: 'Flatten forms and layers to make edits permanent.', link: '/flatten-pdf' },
        { title: 'Protect PDF Security', description: 'Lock your finalized, signed document with passwords.', link: '/protect-pdf' }
      ];
    }
    // Default fallback
    return [
      { title: 'Merge PDF Documents', description: 'Combine multiple PDF files into a single document.', link: '/merge-pdf' },
      { title: 'Compress PDF Size', description: 'Shrink and optimize your PDF file size in your browser.', link: '/compress-pdf' }
    ];
  };

  const faqs = getFaqs(title);
  const relatedTools = getRelatedTools(title);

  useEffect(() => {
    // 1. Set page title and meta description dynamically
    const originalTitle = document.title;
    document.title = `Free ${title} Online | 100% Private Word To PDF Convertor`;

    let metaDesc = document.querySelector('meta[name="description"]');
    let originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    const newDesc = `${title} tool. Edit, convert, and process your files directly inside your browser cache with 100% security. No uploads, zero limitations, and completely free.`;
    
    if (metaDesc) {
      metaDesc.setAttribute('content', newDesc);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      metaDesc.content = newDesc;
      document.head.appendChild(metaDesc);
    }

    // 2. Inject JSON-LD FAQ schema
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `faq-schema-${title.replace(/\s+/g, '-').toLowerCase()}`;
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
      const injectedScript = document.getElementById(script.id);
      if (injectedScript) {
        document.head.removeChild(injectedScript);
      }
    };
  }, [title]);

  return (
    <div className="space-y-8">
      
      {/* Tool Header (Compact & Light Theme) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2">
          <span>{title}</span>
          {isProOnly && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md select-none">
              Pro Only
            </span>
          )}
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-250/60 rounded-full px-3.5 py-1 w-fit mx-auto shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          <span className="font-semibold">100% Secure Client-Side. Files never touch our servers.</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-6xl mx-auto">
        {file ? (
          children ? (
            /* Overridden workspace layout (used by components that list multiple files) */
            <div className="glass-card p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
              {children}
            </div>
          ) : (
            /* Standard side-by-side workspace layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in zoom-in-95 duration-300">
              
              {/* Preview Box (8 columns on desktop) */}
              <div className="lg:col-span-7 glass-card p-5 flex flex-col space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary-500" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm max-w-[200px] sm:max-w-[300px] truncate">
                        {Array.isArray(file) ? `${file.length} files selected` : file.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {Array.isArray(file) 
                          ? `${file.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024 ? (file.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2) : 0} MB`
                          : `${(file.size / 1024 / 1024).toFixed(2)} MB`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={onClear}
                    disabled={isExecuting}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-xs text-slate-650 hover:text-slate-900 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Change</span>
                  </button>
                </div>

                {/* PDFPreview component placeholder handled in the tool page */}
                <div className="w-full">
                  {preview}
                </div>
              </div>

              {/* Configurations & Action Panel (5 columns on desktop) */}
              <div className="lg:col-span-5 glass-card p-5 md:p-6 space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-150 pb-4">
                  Configure Settings
                </h3>
                
                {/* Form Controls */}
                <div className="space-y-4">
                  {controls}
                </div>

                {/* Status/Error Messages */}
                {errorMessage && (
                  <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-sm font-medium">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 text-sm font-medium">
                    {successMessage}
                  </div>
                )}

                {/* Progress bar */}
                {isExecuting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-500" />
                        Processing document...
                      </span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                      <div 
                        className="bg-gradient-to-r from-primary-600 to-red-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Primary Button */}
                <button
                  onClick={handleExecuteClick}
                  disabled={isExecuting}
                  className="w-full glass-button-primary"
                >
                  {isExecuting ? 'Processing...' : `Convert & Download`}
                </button>
              </div>

            </div>
          )
        ) : (
          /* File selection Dropzone */
          <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-300">
            <Dropzone 
              onFileSelect={onFileSelect} 
              accept={accept} 
              multiple={multiple} 
              title={title}
              description={description}
            />
          </div>
        )}
      </div>

      {/* Section 1: How it Works (3-Step Guide) - High Fidelity Card Style */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display">
            How to use our free {title} tool in three simple steps
          </h2>
          <p className="text-sm text-slate-555 max-w-2xl mx-auto">
            Follow our clean, secure, and fast three-step guide to run {title.toLowerCase()} operations on your documents in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Step 1 */}
          <article className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-36 bg-gradient-to-br from-indigo-100 via-slate-100 to-violet-200 flex items-center justify-center p-4 relative overflow-hidden shrink-0">
              {/* Mockup UI 1: Choose File */}
              <div className="bg-white rounded-xl px-4 py-2.5 border border-slate-200/60 shadow-md text-xs text-slate-700 font-bold flex items-center space-x-2 w-48 relative">
                <div className="p-1.5 rounded-lg bg-red-50 text-red-500 shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="truncate">Select PDF document</span>
              </div>
              
              {/* Clicking Cursor Overlay */}
              <svg 
                className="absolute h-8 w-8 drop-shadow-md select-none pointer-events-none animate-bounce"
                style={{ bottom: '15%', right: '28%', animationDuration: '2s' }}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5.5 10.5C5.5 9.67157 6.17157 9 7 9C7.82843 9 8.5 9.67157 8.5 10.5V11.5M8.5 11.5C8.5 10.6716 9.17157 10 10 10C10.8284 10 11.5 10.6716 11.5 11.5M11.5 11.5C11.5 10.6716 12.1716 10 13 10C13.8284 10 14.5 10.6716 14.5 11.5V13.5M14.5 13.5C14.5 12.6716 15.1716 12 16 12C16.8284 12 17.5 12.6716 17.5 13.5V16C17.5 19.5 15 22 11.5 22H9.5C6.5 22 4.5 19.5 4.5 16.5V12C4.5 11.1716 5.17157 10.5 6 10.5C6.82843 10.5 7.5 11.1716 7.5 12" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
                <path 
                  d="M7.5 9V4.5C7.5 3.67157 8.17157 3 9 3C9.82843 3 10.5 3.67157 10.5 4.5V10.5" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
              </svg>
            </div>
            
            <div className="p-5 flex flex-col items-center text-center space-y-2 flex-grow">
              <h3 className="font-display font-extrabold text-base text-rose-600">{stepGuide.step1Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[260px]">
                {stepGuide.step1Desc}
              </p>
            </div>
          </article>

          {/* Card 2: Step 2 */}
          <article className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-36 bg-gradient-to-br from-violet-100 via-indigo-100 to-blue-200 flex items-center justify-center p-4 relative overflow-hidden shrink-0">
              {/* Mockup UI 2: Settings Toggles */}
              <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-md flex flex-col space-y-1.5 w-44 relative">
                <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 w-12 bg-rose-100 rounded-lg"></div>
                  <div className="h-4.5 w-8 bg-rose-500 rounded-full flex items-center px-0.5">
                    <div className="h-3.5 w-3.5 rounded-full bg-white translate-x-3.5"></div>
                  </div>
                </div>
              </div>

              {/* Clicking Cursor Overlay */}
              <svg 
                className="absolute h-8 w-8 drop-shadow-md select-none pointer-events-none animate-bounce"
                style={{ bottom: '15%', right: '28%', animationDuration: '2s', animationDelay: '0.3s' }}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5.5 10.5C5.5 9.67157 6.17157 9 7 9C7.82843 9 8.5 9.67157 8.5 10.5V11.5M8.5 11.5C8.5 10.6716 9.17157 10 10 10C10.8284 10 11.5 10.6716 11.5 11.5M11.5 11.5C11.5 10.6716 12.1716 10 13 10C13.8284 10 14.5 10.6716 14.5 11.5V13.5M14.5 13.5C14.5 12.6716 15.1716 12 16 12C16.8284 12 17.5 12.6716 17.5 13.5V16C17.5 19.5 15 22 11.5 22H9.5C6.5 22 4.5 19.5 4.5 16.5V12C4.5 11.1716 5.17157 10.5 6 10.5C6.82843 10.5 7.5 11.1716 7.5 12" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
                <path 
                  d="M7.5 9V4.5C7.5 3.67157 8.17157 3 9 3C9.82843 3 10.5 3.67157 10.5 4.5V10.5" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
              </svg>
            </div>
            
            <div className="p-5 flex flex-col items-center text-center space-y-2 flex-grow">
              <h3 className="font-display font-extrabold text-base text-rose-600">{stepGuide.step2Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[260px]">
                {stepGuide.step2Desc}
              </p>
            </div>
          </article>

          {/* Card 3: Step 3 */}
          <article className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-36 bg-gradient-to-br from-blue-100 via-violet-100 to-indigo-200 flex items-center justify-center p-4 relative overflow-hidden shrink-0">
              {/* Mockup UI 3: Download Button */}
              <div className="bg-primary-500 text-white rounded-xl px-5 py-2.5 shadow-md font-bold text-xs flex items-center space-x-1.5 w-44 justify-center">
                <span>Download file</span>
              </div>

              {/* Clicking Cursor Overlay */}
              <svg 
                className="absolute h-8 w-8 drop-shadow-md select-none pointer-events-none animate-bounce"
                style={{ bottom: '15%', right: '28%', animationDuration: '2s', animationDelay: '0.6s' }}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5.5 10.5C5.5 9.67157 6.17157 9 7 9C7.82843 9 8.5 9.67157 8.5 10.5V11.5M8.5 11.5C8.5 10.6716 9.17157 10 10 10C10.8284 10 11.5 10.6716 11.5 11.5M11.5 11.5C11.5 10.6716 12.1716 10 13 10C13.8284 10 14.5 10.6716 14.5 11.5V13.5M14.5 13.5C14.5 12.6716 15.1716 12 16 12C16.8284 12 17.5 12.6716 17.5 13.5V16C17.5 19.5 15 22 11.5 22H9.5C6.5 22 4.5 19.5 4.5 16.5V12C4.5 11.1716 5.17157 10.5 6 10.5C6.82843 10.5 7.5 11.1716 7.5 12" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
                <path 
                  d="M7.5 9V4.5C7.5 3.67157 8.17157 3 9 3C9.82843 3 10.5 3.67157 10.5 4.5V10.5" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white"
                />
              </svg>
            </div>
            
            <div className="p-5 flex flex-col items-center text-center space-y-2 flex-grow">
              <h3 className="font-display font-extrabold text-base text-rose-600">{stepGuide.step3Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[260px]">
                {stepGuide.step3Desc}
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Section 2: Why Choose Word To PDF Convertor Benefits Grid */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 space-y-6 max-w-5xl mx-auto shadow-sm">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display">
            Why Choose Word To PDF Convertor for {title}?
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Experience the safest, fastest, and most efficient way to manage and convert your documents.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="p-6 rounded-xl border border-slate-150 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">100% Privacy & Browser Security</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your files never leave your computer. All operations execute inside your browser's local sandbox memory using client-side WebAssembly. Absolute confidentiality guaranteed.
            </p>
          </article>
          <article className="p-6 rounded-xl border border-slate-150 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">Blazing Fast Rendering</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Skip network upload and download delays. Files are processed immediately in-memory using your local CPU resources, rendering final outputs in just seconds.
            </p>
          </article>
          <article className="p-6 rounded-xl border border-slate-150 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">Zero Limits, Completely Free</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Process unlimited files with no size limits, no daily restrictions, and no watermarks. Every premium feature is completely free for everyone.
            </p>
          </article>
          <article className="p-6 rounded-xl border border-slate-150 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">High Fidelity Layouts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ensure fonts, tables, spreadsheets, text alignment, and images remain perfectly placed. We preserve original formatting and quality with high fidelity.
            </p>
          </article>
        </div>
      </section>

      {/* Section 3: FAQ Accordion Section (Programmatic SEO) */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 md:p-8 space-y-5 max-w-5xl mx-auto shadow-sm">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display">
            Frequently Asked Questions about {title}
          </h2>
          <p className="text-sm text-slate-650 max-w-2xl mx-auto leading-relaxed">
            Have questions about our {stepGuide.action} tool? Find answers below.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto pt-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <article 
                key={idx} 
                className="border border-slate-150 rounded-xl bg-white overflow-hidden shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-900 hover:text-primary-600 transition-colors focus:outline-none"
                >
                  <span className="text-sm md:text-base pr-4">{faq.q}</span>
                  <span className={`text-xs transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-650 border-t border-slate-100 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Section 4: Related Tools (Internal Linking) */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 max-w-5xl mx-auto shadow-sm space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 font-display">
          Need to do more with your files?
        </h2>
        <p className="text-sm text-slate-600 font-sans">
          Try these related free, secure client-side tools next:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedTools.map((tool, idx) => (
            <Link 
              key={idx}
              href={tool.link}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-red-50 hover:border-red-200 transition-all group"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-slate-850 text-sm group-hover:text-primary-600 transition-colors font-display">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  {tool.description}
                </p>
              </div>
              <span className="text-primary-500 font-bold text-lg group-hover:translate-x-1 transition-transform shrink-0 pl-2">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Copywritten SEO Content */}
      {seoContent && (
        <section className="max-w-4xl mx-auto border-t border-slate-200 pt-12 space-y-8">
          {seoContent}
        </section>
      )}

      {/* SaaS Upgrade/Auth Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-tr from-primary-600 to-red-500 p-6 text-white relative">
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="p-2.5 bg-white/10 rounded-xl w-fit mb-3">
                {modalReason === 'pro-only' ? (
                  <Sparkles className="h-5 w-5 text-white" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-white" />
                )}
              </div>
              
              <h3 className="font-display font-extrabold text-lg">
                {modalReason === 'pro-only' && "Premium Pro Feature"}
                {modalReason === 'file-size' && "File Size Limit Exceeded"}
                {modalReason === 'limit-local' && "Daily Limit Reached"}
                {modalReason === 'limit-server' && "Daily Limit Reached"}
              </h3>
              <p className="text-xs text-white/85 mt-1 leading-relaxed">
                {modalReason === 'pro-only' && "This tool utilizes advanced capabilities reserved exclusively for our Pro subscribers."}
                {modalReason === 'file-size' && `Free tier supports uploads up to ${maxFileSizeMB}MB. Upgrade for larger file limits.`}
                {modalReason === 'limit-local' && "You have used your 3 free conversions for today without an account."}
                {modalReason === 'limit-server' && "You have used your 5 free registered conversions for today."}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-slate-650">
                  <span className="text-emerald-500 font-bold text-sm">✓</span>
                  <span><strong>Unlimited Conversions:</strong> Never worry about daily limits again.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-650">
                  <span className="text-emerald-500 font-bold text-sm">✓</span>
                  <span><strong>250 MB Files:</strong> Upload large textbooks, manuals, and bulk assets.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-650">
                  <span className="text-emerald-500 font-bold text-sm">✓</span>
                  <span><strong>Advanced OCR & Real AI:</strong> Access scanned text recognition and intelligent chat services.</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                {modalReason === 'limit-local' && (
                  <Link
                    href="/signup"
                    onClick={() => setShowUpgradeModal(false)}
                    className="block text-center w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors border border-slate-200"
                  >
                    Create Free Account (5 limit/day)
                  </Link>
                )}
                
                <Link
                  href="/pricing"
                  onClick={() => setShowUpgradeModal(false)}
                  className="block text-center w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/10"
                >
                  Upgrade to Pro ($9.99/mo)
                </Link>

                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full text-center py-2 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Close & return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ToolLayout;
