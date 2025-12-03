// pages/_app.js
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '../styles/index.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default MyApp;