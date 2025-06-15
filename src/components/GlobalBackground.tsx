
import React from 'react';

export const GlobalBackground = () => {
  return (
    <>
      {/* Simple gradient background */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          }}
        />
      </div>
      
      {/* Overlay gradients for better text readability on all pages */}
      <div className="fixed inset-0 -z-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-purple-900/20" />
        
        {/* Subtle animated dots pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(96, 165, 250, 0.05) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)`,
          backgroundSize: '200px 200px, 180px 180px',
          animation: 'float 20s ease-in-out infinite'
        }} />
      </div>
    </>
  );
};
