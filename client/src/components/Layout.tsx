import { Header } from './Header';
import { Footer } from './Footer';
import { BeaverTalkWidget } from './BeaverTalkWidget';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-black text-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="w-full" role="main">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* BeaverTalk Chat Widget */}
      <BeaverTalkWidget config={{
        baseUrl: import.meta.env.VITE_BEAVERTALK_API_URL,
        username: import.meta.env.VITE_BEAVERTALK_USERNAME,
        password: import.meta.env.VITE_BEAVERTALK_PASSWORD,
        category: 'general',
        priority: 'normal'
      }} />
    </div>
  );
};
