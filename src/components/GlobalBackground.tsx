
import React from 'react';
import { ThreeBackground } from './ThreeBackground';

export const GlobalBackground = () => {
  return (
    <>
      <ThreeBackground />
      
      {/* Dynamic overlay gradients for better text readability */}
      <div className="fixed inset-0 -z-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-transparent" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(96, 165, 250, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)
          `,
          backgroundSize: '100% 100%',
          animation: 'float 15s ease-in-out infinite'
        }} />
      </div>
    </>
  );
};
