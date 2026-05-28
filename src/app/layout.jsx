import '../index.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Word To PDF Convertor',
  description: 'Free, secure, browser-based PDF tools.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* We can place generic tags here or let Next handle it via metadata */}
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-20 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
