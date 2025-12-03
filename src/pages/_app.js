import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/index.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
