import { useState } from "react";
import EventUpdateInfo from "./EventUpdateInfo";
import { Info } from "lucide-react";

export default function EventStatusIndicators() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center space-x-4 pb-5 relative">
      {/* Status Indicators */}
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded"></div>
        <span className="text-red-700 font-semibold text-sm">Passed</span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded"></div>
        <span className="text-green-700 font-semibold text-sm">On-Going</span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
        <span className="text-yellow-700 font-semibold text-sm">Up-Coming</span>
      </div>

      {/* Info Button with Tooltip */}
      <div className="relative">
        <button
          className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-200 transition relative animate-pulse-shadow"
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <Info size={16} />
        </button>

        {showTooltip && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-gray-800 text-gray-100 text-sm rounded shadow-lg p-3 z-50"
            style={{ zIndex: 9999 }}
          >
            <EventUpdateInfo />
          </div>
        )}
      </div>
    </div>
  );
}
