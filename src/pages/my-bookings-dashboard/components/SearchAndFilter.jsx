import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SearchAndFilter = ({ onSearch, onFilter, onClearFilters }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const vehicleTypeOptions = [
    { value: '', label: 'All Vehicles' },
    { value: 'two-wheeler', label: 'Two Wheeler' },
    { value: 'four-wheeler', label: 'Four Wheeler' },
    { value: 'commercial-vehicle', label: 'Commercial Vehicle' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'bangalore', label: 'Bangalore' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (newFilters = {}) => {
    const filters = {
      dateRange: newFilters.dateRange !== undefined ? newFilters.dateRange : selectedDateRange,
      vehicleType: newFilters.vehicleType !== undefined ? newFilters.vehicleType : selectedVehicleType,
      location: newFilters.location !== undefined ? newFilters.location : selectedLocation
    };
    onFilter(filters);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDateRange('');
    setSelectedVehicleType('');
    setSelectedLocation('');
    setIsFilterExpanded(false);
    onClearFilters();
  };

  const hasActiveFilters = selectedDateRange || selectedVehicleType || selectedLocation;

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Input
          type="search"
          placeholder="Search bookings by facility name, booking ID..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
        <Icon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          iconName="Filter"
          iconPosition="left"
        >
          Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
              {(selectedDateRange ? 1 : 0) + (selectedVehicleType ? 1 : 0) + (selectedLocation ? 1 : 0)}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            iconName="X"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isFilterExpanded && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Select
              label="Location"
              options={locationOptions}
              value={selectedLocation}
              onChange={(value) => {
                setSelectedLocation(value);
                handleFilterChange({ location: value });
              }}
            />
            <Select
              label="Vehicle Type"
              options={vehicleTypeOptions}
              value={selectedVehicleType}
              onChange={(value) => {
                setSelectedVehicleType(value);
                handleFilterChange({ vehicleType: value });
              }}
            />
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={selectedDateRange}
              onChange={(value) => {
                setSelectedDateRange(value);
                handleFilterChange({ dateRange: value });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;