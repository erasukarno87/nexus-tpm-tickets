
import React from 'react';
import { ThreeBackground } from './ThreeBackground';

export const ModernBackground = () => {
  return (
    <>
      <ThreeBackground />
      
      {/* Dynamic overlay gradients for enhanced visual appeal */}
      <div className="fixed inset-0 -z-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-transparent" />
        
        {/* Enhanced animated gradient overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          background: `
            radial-gradient(circle at 25% 25%, rgba(96, 165, 250, 0.1) 0%, transparent 60%),
            radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.05) 0%, transparent 70%)
          `,
          backgroundSize: '100% 100%',
          animation: 'float 20s ease-in-out infinite'
        }} />
      </div>
    </>
  );
};
