
import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingSummaryCard = ({ bookingData }) => {
  // Handle null/undefined bookingData with fallbacks
  const facility = bookingData?.facility || {
    name: 'Selected Location',
    address: 'Selected Address',
    rating: 4.8,
    reviews: 324
  };

  const slot = bookingData?.slot || {
    location: '1st Floor A Row 1st Parking Slot',
    floor: '1st Floor',
    row: 'A Row',
    number: '1',
    type: 'Standard'
  };

  const vehicle = bookingData?.vehicle || {
    name: 'Selected Vehicle',
    model: 'Vehicle Model',
    type: 'Vehicle',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
  };

  const checkIn = bookingData?.checkIn || {
    date: new Date().toISOString().split('T')[0],
    time: '09:00'
  };

  const checkOut = bookingData?.checkOut || {
    date: new Date().toISOString().split('T')[0],
    time: '11:00'
  };

  const duration = bookingData?.duration || '2 hours';

  // Format dates safely
  const formatDate = (dateStr, timeStr) => {
    try {
      if (!dateStr || !timeStr) return 'Not specified';
      const date = new Date(`${dateStr}T${timeStr}`);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (timeStr) => {
    try {
      if (!timeStr) return 'Not specified';
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return timeStr || 'Invalid time';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">Booking Summary</h3>
        <p className="text-sm text-muted-foreground">Review your parking details</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Facility Information */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-primary" />
            Parking Facility
          </h4>
          <div className="bg-muted/20 rounded-lg p-3 space-y-2">
            <div>
              <p className="font-medium text-foreground">{facility.name}</p>
              <p className="text-sm text-muted-foreground">{facility.address}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
                <span className="font-medium">{facility.rating}</span>
              </div>
              <span className="text-muted-foreground">({facility.reviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Slot Information */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Car" size={16} className="text-primary" />
            Parking Slot
          </h4>
          <div className="bg-muted/20 rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">{slot.location}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium text-foreground">{slot.type}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Truck" size={16} className="text-primary" />
            Vehicle Details
          </h4>
          <div className="bg-muted/20 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                <img
                  src={vehicle.image}
                  alt={vehicle.name || vehicle.model || 'Vehicle'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop';
                  }}
                />
              </div>
              <div>
                <p className="font-medium text-foreground">{vehicle.name || vehicle.model || 'Selected Vehicle'}</p>
                <p className="text-sm text-muted-foreground">{vehicle.type || 'Vehicle Type'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date & Time Information */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Clock" size={16} className="text-primary" />
            Date & Time
          </h4>
          <div className="bg-muted/20 rounded-lg p-3 space-y-3">
            {/* Current Time Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 text-sm font-medium">Current Time</span>
                <span className="text-blue-900 font-semibold">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZoneName: 'short'
                  })}
                </span>
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Check-in</p>
                <p className="font-medium text-foreground">{formatDate(checkIn.date, checkIn.time)}</p>
                <p className="text-sm text-muted-foreground">{formatTime(checkIn.time)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Check-out</p>
                <p className="font-medium text-foreground">{formatDate(checkOut.date, checkOut.time)}</p>
                <p className="text-sm text-muted-foreground">{formatTime(checkOut.time)}</p>
              </div>
            </div>
            
            {/* Full Time Range Display */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Booking Time Range</p>
                <p className="font-semibold text-foreground text-base">
                  {formatTime(checkIn.time)} - {formatTime(checkOut.time)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  on {formatDate(checkIn.date, checkIn.time)}
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">{duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryCard;
