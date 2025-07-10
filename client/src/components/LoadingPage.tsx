import React from 'react';

interface LoadingPageProps {
  onLoadingComplete: () => void;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ onLoadingComplete }) => {
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Give fade out animation time to complete
      setTimeout(() => {
        onLoadingComplete();
      }, 500);
    }, 2500); // 2.5 seconds of loading animation

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className={`fixed inset-0 bg-black flex items-center justify-center z-50 loading-page ${isExiting ? 'loading-page-exit' : ''}`}>
      <div className="flex flex-col items-center">
        {/* Main Logo Animation */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center space-x-1 mb-2">
            <span className="text-[#0d6efd] text-6xl font-bold logo-text-remi">Rémi</span>
            <span className="text-[#f89422] text-6xl font-bold logo-text-guillette">Guillette</span>
          </div>
          <p className="text-[#f89422] text-3xl font-semibold whitespace-nowrap logo-text-groupe">Groupe</p>
          <p className="text-[#f89422] text-2xl font-semibold whitespace-nowrap logo-text-group">Group</p>
        </div>

        {/* Loading Animation */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#0d6efd] rounded-full loading-dot-1"></div>
          <div className="w-3 h-3 bg-[#f89422] rounded-full loading-dot-2"></div>
          <div className="w-3 h-3 bg-[#0d6efd] rounded-full loading-dot-3"></div>
        </div>

        <p className="text-white text-sm mt-4 loading-text">Loading...</p>
      </div>
    </div>
  );
};