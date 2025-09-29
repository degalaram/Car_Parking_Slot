import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingTabs = ({ activeTab, onTabChange, bookingCounts }) => {
  const tabs = [
    {
      id: 'active',
      label: 'Active',
      icon: 'Play',
      count: bookingCounts?.active || 0
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: 'Clock',
      count: bookingCounts?.upcoming || 0
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: 'CheckCircle',
      count: bookingCounts?.completed || 0
    },
    {
      id: 'all',
      label: 'All',
      icon: 'List',
      count: (bookingCounts?.active || 0) + (bookingCounts?.upcoming || 0) + (bookingCounts?.completed || 0)
    }
  ];

  return (
    <div className="bg-card rounded-lg p-1 border border-border">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium text-xs sm:text-sm transition-all touch-target ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={tab.icon} size={16} className="flex-shrink-0" />
            <span className="truncate text-center sm:text-left">{tab.label}</span>
            {tab.count > 0 && (
              <span className={`inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 text-xs font-medium rounded-full min-w-[18px] sm:min-w-[20px] ${
                activeTab === tab.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingTabs;