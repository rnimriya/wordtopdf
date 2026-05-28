import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Pages
const Home = React.lazy(() => import('./pages/Home.jsx'));
const MergePdf = React.lazy(() => import('./pages/MergePdf.jsx'));
const RotatePdf = React.lazy(() => import('./pages/RotatePdf.jsx'));
const ProtectPdf = React.lazy(() => import('./pages/ProtectPdf.jsx'));
const CompressPdf = React.lazy(() => import('./pages/CompressPdf.jsx'));
const ExtractImages = React.lazy(() => import('./pages/ExtractImages.jsx'));
const OcrPdf = React.lazy(() => import('./pages/OcrPdf.jsx'));
const HtmlToPdf = React.lazy(() => import('./pages/HtmlToPdf.jsx'));

// AI Pages
const AiAssistant = React.lazy(() => import('./pages/AiAssistant.jsx'));
const ChatPdf = React.lazy(() => import('./pages/ChatPdf.jsx'));
const SummarizePdf = React.lazy(() => import('./pages/SummarizePdf.jsx'));
const TranslatePdf = React.lazy(() => import('./pages/TranslatePdf.jsx'));
const QuestionGen = React.lazy(() => import('./pages/QuestionGen.jsx'));

// Organize Pages
const SplitPdf = React.lazy(() => import('./pages/SplitPdf.jsx'));
const DeletePages = React.lazy(() => import('./pages/DeletePages.jsx'));
const ExtractPages = React.lazy(() => import('./pages/ExtractPages.jsx'));
const OrganizePdf = React.lazy(() => import('./pages/OrganizePdf.jsx'));

// View & Edit Pages
const EditPdf = React.lazy(() => import('./pages/EditPdf.jsx'));
const PdfAnnotator = React.lazy(() => import('./pages/PdfAnnotator.jsx'));
const PdfReader = React.lazy(() => import('./pages/PdfReader.jsx'));
const NumberPages = React.lazy(() => import('./pages/NumberPages.jsx'));
const CropPdf = React.lazy(() => import('./pages/CropPdf.jsx'));
const RedactPdf = React.lazy(() => import('./pages/RedactPdf.jsx'));
const WatermarkPdf = React.lazy(() => import('./pages/WatermarkPdf.jsx'));
const FormFiller = React.lazy(() => import('./pages/FormFiller.jsx'));
const SharePdf = React.lazy(() => import('./pages/SharePdf.jsx'));
const SignPdf = React.lazy(() => import('./pages/SignPdf.jsx'));
const RequestSignatures = React.lazy(() => import('./pages/RequestSignatures.jsx'));

// Convert from PDF
const PdfToWord = React.lazy(() => import('./pages/Convert/PdfToWord.jsx'));
const PdfToExcel = React.lazy(() => import('./pages/Convert/PdfToExcel.jsx'));
const PdfToJpg = React.lazy(() => import('./pages/Convert/PdfToJpg.jsx'));
const PdfToPng = React.lazy(() => import('./pages/Convert/PdfToPng.jsx'));
const PdfToPpt = React.lazy(() => import('./pages/Convert/PdfToPpt.jsx'));

// Convert to PDF
const WordToPdf = React.lazy(() => import('./pages/Convert/WordToPdf.jsx'));
const ExcelToPdf = React.lazy(() => import('./pages/Convert/ExcelToPdf.jsx'));
const PptToPdf = React.lazy(() => import('./pages/Convert/PptToPdf.jsx'));
const JpgToPdf = React.lazy(() => import('./pages/Convert/JpgToPdf.jsx'));
const TextToPdf = React.lazy(() => import('./pages/Convert/TextToPdf.jsx'));
const RtfToPdf = React.lazy(() => import('./pages/Convert/RtfToPdf.jsx'));
const OdtToPdf = React.lazy(() => import('./pages/Convert/OdtToPdf.jsx'));
const PdfScanner = React.lazy(() => import('./pages/PdfScanner.jsx'));
const AutocadToPdf = React.lazy(() => import('./pages/Convert/AutocadToPdf.jsx'));
const OpenOfficeToPdf = React.lazy(() => import('./pages/Convert/OpenOfficeToPdf.jsx'));
const EbooksToPdf = React.lazy(() => import('./pages/Convert/EbooksToPdf.jsx'));
const IworkToPdf = React.lazy(() => import('./pages/Convert/IworkToPdf.jsx'));
const PdfToPdfa = React.lazy(() => import('./pages/Convert/PdfToPdfa.jsx'));

// More Pages
const UnlockPdf = React.lazy(() => import('./pages/UnlockPdf.jsx'));
const FlattenPdf = React.lazy(() => import('./pages/FlattenPdf.jsx'));
const PdfConverter = React.lazy(() => import('./pages/PdfConverter.jsx'));
const RepairPdf = React.lazy(() => import('./pages/RepairPdf.jsx'));
const PrintReadyPdf = React.lazy(() => import('./pages/PrintReadyPdf.jsx'));

// Static/Company pages
const About = React.lazy(() => import('./pages/About.jsx'));
const Contact = React.lazy(() => import('./pages/Contact.jsx'));
const Privacy = React.lazy(() => import('./pages/Privacy.jsx'));
const Terms = React.lazy(() => import('./pages/Terms.jsx'));
const Sitemap = React.lazy(() => import('./pages/Sitemap.jsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'));

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                
                {/* Core PDF Utilities */}
                <Route path="/merge-pdf" element={<MergePdf />} />
                <Route path="/rotate-pdf" element={<RotatePdf />} />
                <Route path="/protect-pdf" element={<ProtectPdf />} />
                <Route path="/compress-pdf" element={<CompressPdf />} />
                <Route path="/extract-images" element={<ExtractImages />} />
                <Route path="/ocr-pdf" element={<OcrPdf />} />
                
                {/* AI PDF Tools */}
                <Route path="/ai-pdf-assistant" element={<AiAssistant />} />
                <Route path="/chat-with-pdf" element={<ChatPdf />} />
                <Route path="/ai-pdf-summarizer" element={<SummarizePdf />} />
                <Route path="/translate-pdf" element={<TranslatePdf />} />
                <Route path="/ai-question-generator" element={<QuestionGen />} />

                {/* Organize PDF Tools */}
                <Route path="/split-pdf" element={<SplitPdf />} />
                <Route path="/delete-pdf-pages" element={<DeletePages />} />
                <Route path="/extract-pdf-pages" element={<ExtractPages />} />
                <Route path="/organize-pdf" element={<OrganizePdf />} />

                {/* View & Edit Tools */}
                <Route path="/edit-pdf" element={<EditPdf />} />
                <Route path="/pdf-annotator" element={<PdfAnnotator />} />
                <Route path="/pdf-reader" element={<PdfReader />} />
                <Route path="/number-pages" element={<NumberPages />} />
                <Route path="/crop-pdf" element={<CropPdf />} />
                <Route path="/redact-pdf" element={<RedactPdf />} />
                <Route path="/watermark-pdf" element={<WatermarkPdf />} />
                <Route path="/pdf-form-filler" element={<FormFiller />} />
                <Route path="/share-pdf" element={<SharePdf />} />
                <Route path="/sign-pdf" element={<SignPdf />} />
                <Route path="/request-signatures" element={<RequestSignatures />} />

                {/* Convert from PDF */}
                <Route path="/pdf-to-word" element={<PdfToWord />} />
                <Route path="/pdf-to-excel" element={<PdfToExcel />} />
                <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
                <Route path="/pdf-to-png" element={<PdfToPng />} />
                <Route path="/pdf-to-ppt" element={<PdfToPpt />} />
                
                {/* Convert to PDF */}
                <Route path="/word-to-pdf" element={<WordToPdf />} />
                <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
                <Route path="/ppt-to-pdf" element={<PptToPdf />} />
                <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
                <Route path="/text-to-pdf" element={<TextToPdf />} />
                <Route path="/rtf-to-pdf" element={<RtfToPdf />} />
                <Route path="/odt-to-pdf" element={<OdtToPdf />} />
                <Route path="/pdf-scanner" element={<PdfScanner />} />
                <Route path="/autocad-to-pdf" element={<AutocadToPdf />} />
                <Route path="/openoffice-to-pdf" element={<OpenOfficeToPdf />} />
                <Route path="/ebooks-to-pdf" element={<EbooksToPdf />} />
                <Route path="/iwork-to-pdf" element={<IworkToPdf />} />
                <Route path="/pdf-to-pdfa" element={<PdfToPdfa />} />

                {/* More */}
                <Route path="/unlock-pdf" element={<UnlockPdf />} />
                <Route path="/flatten-pdf" element={<FlattenPdf />} />
                <Route path="/pdf-converter" element={<PdfConverter />} />
                <Route path="/repair-pdf" element={<RepairPdf />} />
                <Route path="/print-ready-pdf" element={<PrintReadyPdf />} />
                
                {/* Generic Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/sitemap" element={<Sitemap />} />
                
                {/* 404 Catch-All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
