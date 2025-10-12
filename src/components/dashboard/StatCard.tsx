import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'primary' | 'green' | 'blue' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    primary: 'text-primary-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${colorClasses[color]}`} />
      </div>
    </div>
  );
};

export default StatCard;