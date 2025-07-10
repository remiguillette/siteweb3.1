import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-black text-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="w-full">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
