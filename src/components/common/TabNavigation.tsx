import React from "react";
import { LucideIcon } from "lucide-react";

interface Tab {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;



