import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="bg-grid flex min-h-svh flex-col bg-base-100 text-base-content">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 md:px-6 md:py-14">{children}</main>

      <Footer />
    </div>
  );
}
export default Layout;
