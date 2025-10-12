import React from 'react';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          {actionLabel && onAction && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onAction}
                className="btn-primary flex items-center gap-2 justify-center"
              >
                <Plus className="w-4 h-4" />
                {actionLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;