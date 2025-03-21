import React from 'react';
import { Home, RefreshCw, AlertCircle } from 'lucide-react';

function NotFound() {
  return (
    <div className="flex items-center justify-center  p-4">
      {/* Main Container */}
      <div className="relative max-w-lg w-full mx-auto">
        {/* Glass Card */}
        <div className="backdrop-blur-lg bg-white/10 rounded-xl shadow-xl overflow-hidden border border-white/20">
          <div className="h-1 bg-gradient-to-r from-cyan-400 to-primary animate-pulse"></div>
          
          {/* Main Content */}
          <div className="p-8 sm:p-10">
            {/* 3D Styled Error Code */}
            <div className="relative flex justify-center mb-6">
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse drop-shadow-lg">404</h1>
              <div className="absolute -top-6 -right-6">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping opacity-50">
                    <AlertCircle size={32} className="text-red-400" />
                  </div>
                  <AlertCircle size={32} className="text-red-400" />
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Page Not Found</h2>
              <p className="text-gray-300 max-w-md mx-auto">
                The page you're looking for has drifted into the digital void. Don't worry, we'll help you find your way back.
              </p>
            </div>
            
            {/* Animated Separator */}
            <div className="flex justify-center my-8">
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-primary animate-pulse"></div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <a 
                href="/dashboard" 
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Home className="h-5 w-5 group-hover:animate-bounce" />
                <span>Dashboard</span>
              </a>
              {/* <a 
                href="/" 
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-medium rounded-xl hover:from-pink-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <RefreshCw className="h-5 w-5 group-hover:animate-spin" />
                <span>Try Again</span>
              </a> */}
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        {/* <div className="absolute -z-10 -top-20 -left-20 w-25 h-25 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -z-10 top-10 -right-30 w-35 h-35 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -z-10 -bottom-20 left-20 w-35 h-35 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div> */}
      </div>
    </div>
  );
}

// You'll need to add this CSS to your global stylesheet for the blob animations
// Add this comment for reference:
/*
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
*/

export default NotFound;