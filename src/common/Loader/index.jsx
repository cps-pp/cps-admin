'use client';
import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // fade in
    const timeout = setTimeout(() => setIsVisible(true), 300);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm dark:bg-boxdark/50 pointer-events-none transition-opacity duration-500"></div>

      <div className="relative z-10 flex flex-col items-center space-y-4">
        <div
          className="h-20 w-20 animate-spin rounded-full border-8 border-primary border-b-transparent"
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        ></div>
        <p className="text-md font-medium text-black dark:text-white">
          ກຳລັງດຳເນີນການ...
        </p>
      </div>
    </div>
  );
};

export default Loader;
