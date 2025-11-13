'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoadingAnimation({ size = 120 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <DotLottieReact
        src="/loading-animation.lottie"
        loop
        autoplay
        speed={1.5}
        style={{ width: size, height: size }}
      />
    </div>
  );
}

