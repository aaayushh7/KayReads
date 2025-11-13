'use client';

import React from 'react';
import Lottie from 'lottie-react';

export default function LoadingAnimation({ size = 120 }: { size?: number }) {
  const [animationData, setAnimationData] = React.useState(null);

  React.useEffect(() => {
    fetch('/loading-animation.lottie')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(() => {
        // Fallback if animation doesn't load
        console.log('Animation file not found, using fallback');
      });
  }, []);

  if (!animationData) {
    // Fallback to simple loading indicator
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-dusty/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-dusty border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size }}>
      <Lottie 
        animationData={animationData} 
        loop={true}
        autoplay={true}
      />
    </div>
  );
}

