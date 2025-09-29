import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickBookingWidget = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [duration, setDuration] = useState('');

  const locations = [
    { value: 'downtown', label: 'Downtown Plaza' },
    { value: 'metro', label: 'Metro Center' },
    { value: 'mall', label: 'City Mall' },
    { value: 'airport', label: 'Airport Express' }
  ];

  const vehicleTypes = [
    { value: 'car', label: 'Car' },
    { value: 'bike', label: 'Motorcycle' },
    { value: 'suv', label: 'SUV' },
    { value: 'truck', label: 'Truck' }
  ];

  const durations = [
    { value: '1', label: '1 Hour' },
    { value: '2', label: '2 Hours' },
    { value: '4', label: '4 Hours' },
    { value: '8', label: '8 Hours' },
    { value: 'day', label: 'Full Day' }
  ];

  const handleQuickBook = () => {
    if (selectedLocation && vehicleType && duration) {
      navigate('/slot-selection-booking', {
        state: {
          location: selectedLocation,
          vehicleType,
          duration
        }
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl mobile-card text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="Zap" size={16} className="sm:w-5 sm:h-5" color="white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base sm:text-lg truncate">Quick Booking</h3>
          <p className="text-white/80 text-xs sm:text-sm truncate">Book your next parking spot</p>
        </div>
      </div>

      <div className="space-y-3">
        <Select
          options={locations}
          value={selectedLocation}
          onChange={setSelectedLocation}
          placeholder="Select location"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm sm:text-base"
        />

        <Select
          options={vehicleTypes}
          value={vehicleType}
          onChange={setVehicleType}
          placeholder="Vehicle type"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm sm:text-base"
        />

        <Select
          options={durations}
          value={duration}
          onChange={setDuration}
          placeholder="Duration"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm sm:text-base"
        />

        <Button
          onClick={handleQuickBook}
          disabled={!selectedLocation || !vehicleType || !duration}
          className="w-full bg-white text-primary hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base mobile-button touch-target"
          iconName="Search"
          iconPosition="left"
        >
          Find Available Slots
        </Button>
      </div>
    </div>
  );
};

export default QuickBookingWidget;