
import React from 'react';
import { PlatformMode } from '../types';

interface ModeToggleProps {
  currentMode: PlatformMode;
  onToggle: (mode: PlatformMode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ currentMode, onToggle }) => {
  return (
    <div className="flex p-1 bg-gray-200 rounded-lg shadow-inner">
      <button
        onClick={() => onToggle(PlatformMode.B2B)}
        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
          currentMode === PlatformMode.B2B 
            ? 'bg-white text-primary-600 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Wholesale
      </button>
      <button
        onClick={() => onToggle(PlatformMode.B2C)}
        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
          currentMode === PlatformMode.B2C 
            ? 'bg-white text-primary-600 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Retail
      </button>
    </div>
  );
};

export default ModeToggle;
