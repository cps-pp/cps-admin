import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm dark:bg-boxdark/50 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center space-y-4  ">
        <div
          className="h-30 w-30 animate-spin rounded-full border-8 border-primary border-b-transparent"
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
