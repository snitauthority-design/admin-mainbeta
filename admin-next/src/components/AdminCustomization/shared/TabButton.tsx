import React from 'react';

interface TabButtonProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ id, label, icon, activeTab, onTabChange }) => (
  <button
    onClick={() => onTabChange(id)}
    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
      activeTab === id
        ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    {icon} {label}
  </button>
);

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  children, 
  variant = '', 
  className = '', 
  ...props 
}) => (
  <button
    className={`px-4 py-2 rounded-lg text-sm font-bold ${variant} ${className}`}
    {...props}
  >
    {children}
  </button>
);
