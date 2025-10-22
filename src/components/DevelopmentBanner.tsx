import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DevelopmentBanner: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="flex items-center justify-center gap-2 text-yellow-800">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">
          Platform is under development - Some features may not work as expected
        </span>
      </div>
    </div>
  );
};

export default DevelopmentBanner;