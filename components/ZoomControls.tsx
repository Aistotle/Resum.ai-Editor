import React from 'react';
import { ZoomInIcon, ZoomOutIcon } from './Icons';

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  t: (key: string) => string;
  isControlPanelOpen: boolean;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ zoomLevel, onZoomChange, t, isControlPanelOpen }) => {
  const handleZoom = (amount: number) => {
    onZoomChange(Math.max(50, Math.min(150, zoomLevel + amount)));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onZoomChange(parseInt(e.target.value, 10));
  };

  // max-w-md is 28rem. right-6 is 1.5rem. So we need to shift by 28rem.
  return (
    <div className={`fixed bottom-6 z-10 flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ${isControlPanelOpen ? 'right-[calc(28rem+1.5rem)]' : 'right-6'}`}>
      <button
        onClick={() => handleZoom(-10)}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('zoomOut')}
      >
        <ZoomOutIcon className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 w-32">
        <input
          type="range"
          min="50"
          max="150"
          step="10"
          value={zoomLevel}
          onChange={handleSliderChange}
          className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <button
        onClick={() => handleZoom(10)}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('zoomIn')}
      >
        <ZoomInIcon className="w-5 h-5" />
      </button>

      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 w-10 text-center">
        {zoomLevel}%
      </span>
    </div>
  );
};

export default ZoomControls;
