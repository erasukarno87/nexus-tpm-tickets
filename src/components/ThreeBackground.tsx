
import React from 'react';

export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div 
        className="w-full h-full"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        }}
      />
    </div>
  );
};
