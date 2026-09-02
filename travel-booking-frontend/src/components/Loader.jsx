import React from 'react';
import { createPortal } from 'react-dom';

const Loader = ({ message = 'Authenticating...' }) => {
  const content = (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      {/* Animated Spinner using pure CSS / Inline styles */}
      <div className="custom-spinner" />

      {message && (
        <p className="mt-6 text-xs sm:text-sm font-bold text-cyan-400 tracking-widest uppercase animate-pulse">
          {message}
        </p>
      )}

      {/* Embedded keyframe styles so no external packages are needed */}
      <style>{`
        .custom-spinner {
          width: 44.8px;
          height: 44.8px;
          color: #38bdf8;
          position: relative;
          background: radial-gradient(11.2px, currentColor 94%, #0000);
        }
        .custom-spinner::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(10.08px at bottom right, #0000 94%, currentColor) top left,
            radial-gradient(10.08px at bottom left, #0000 94%, currentColor) top right,
            radial-gradient(10.08px at top right, #0000 94%, currentColor) bottom left,
            radial-gradient(10.08px at top left, #0000 94%, currentColor) bottom right;
          background-size: 22.4px 22.4px;
          background-repeat: no-repeat;
          animation: loader-spin 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
        }
        @keyframes loader-spin {
          33% {
            inset: -11.2px;
            transform: rotate(0deg);
          }
          66% {
            inset: -11.2px;
            transform: rotate(90deg);
          }
          100% {
            inset: 0;
            transform: rotate(90deg);
          }
        }
      `}</style>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
};

export default Loader;