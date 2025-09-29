import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Modal from '../../../components/ui/Modal';
import Typography from '../../../components/ui/Typography';

const BookingCard = ({ booking, onExtend, onCancel, onRate }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState('');
  
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (booking?.status === 'active' && booking?.endTime) {
      const updateTimer = () => {
        const now = new Date();
        const end = new Date(booking.endTime);
        const diff = end - now;

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else {
          setTimeRemaining('Expired');
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 60000);
      return () => clearInterval(interval);
    }
  }, [booking?.endTime, booking?.status]);

  

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'upcoming':
        return 'bg-warning text-warning-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleGetDirections = () => {
    const { lat, lng } = booking?.facility?.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const handleViewQR = () => {
    // In a real app, this would show a QR code modal
    alert(`QR Code for booking ${booking?.id}`);
  };

  const handleRebook = () => {
    navigate('/facility-details-floor-selection', {
      state: { facilityId: booking?.facility?.id }
    });
  };

  const handleCancel = () => {
    onCancel(booking?.id);
  };


  return (
    <div
      id={`booking-${booking?.id}`}
      className="card-container bg-card border border-border rounded-lg overflow-hidden"
    >
      {/* Compact Header - Always Visible */}
      <div
        className="p-3 sm:p-4 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Vehicle Image */}
            <div className="w-12 h-8 sm:w-16 sm:h-10 overflow-hidden rounded-lg flex-shrink-0">
              {booking?.vehicleImage ? (
                <Image
                  src={booking?.vehicleImage}
                  alt={booking?.vehicleType}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Icon name={booking?.actualVehicleType === 'two-wheeler' ? 'Bike' : 'Car'} size={16} className="text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                {booking?.vehicle?.name || booking?.vehicle?.model || booking?.vehicle?.label || booking?.vehicleType || 'Vehicle'}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {booking?.facility?.name || 'Location'} • {booking?.slotLocation || booking?.slot?.location || 'Parking Slot'}
              </p>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground truncate">
                  Booked: {new Date(booking.createdAt || booking.startTime)?.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm font-medium text-primary truncate">
                  {new Date(booking.createdAt || booking.startTime)?.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Status and Price */}
          <div className="text-right flex-shrink-0 ml-2">
            <div className="flex items-center gap-2 justify-end mb-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking?.status)} whitespace-nowrap`}>
                {booking?.status?.charAt(0)?.toUpperCase() + booking?.status?.slice(1)}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              ₹{booking?.isExtended && booking?.extensionCost ? 
                ((booking?.totalAmount || 0) + (booking?.extensionCost || 0)).toFixed(2) : 
                booking?.totalAmount}
            </p>
            {booking?.status === 'active' && timeRemaining && (
              <p className="text-xs text-primary font-medium">{timeRemaining} left</p>
            )}
          </div>

          {/* Expand Icon - Removed as per request to not show arrow button */}
          {/* <div className="ml-2 flex-shrink-0">
            <Icon
              name={isExpanded ? "ChevronUp" : "ChevronDown"}
              size={16}
              className="text-muted-foreground"
            />
          </div> */}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border">
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            {/* Booking Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 text-sm font-medium flex items-center gap-2">
                  <Icon name="Calendar" size={16} className="text-blue-600" />
                  Booked Time
                </span>
                <span className="text-blue-900 font-semibold text-base">
                  {new Date(booking.createdAt || booking.startTime)?.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {new Date(booking.createdAt || booking.startTime)?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* Facility Details */}
            <div>
              <h4 className="font-medium text-foreground text-sm mb-2">Facility</h4>
              <p className="text-sm text-foreground">{booking?.facility?.name}</p>
              <p className="text-xs text-muted-foreground">{booking?.facility?.address}</p>
            </div>

            {/* Pricing Summary */}
            {booking?.isExtended && booking?.extensionCost && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-green-800 text-sm mb-2 flex items-center gap-2">
                  <Icon name="DollarSign" size={16} className="text-green-600" />
                  Pricing Summary
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Original Amount:</span>
                    <span className="text-green-800">₹{(booking?.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Extension Cost:</span>
                    <span className="text-green-800">₹{(booking?.extensionCost || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-1 border-t border-green-300">
                    <span className="text-green-800">Total Amount:</span>
                    <span className="text-green-900 text-base">₹{((booking?.totalAmount || 0) + (booking?.extensionCost || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Slot Details */}
            <div className="bg-muted rounded-lg p-2 sm:p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Slot Location</p>
                  <p className="text-sm font-medium text-foreground">{booking?.slotLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium text-foreground">{booking?.duration}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Slot Timing</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-1">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium">Start Time</p>
                        <p className="text-blue-900 font-semibold">
                          {new Date(booking.startTime)?.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                        <p className="text-xs text-blue-600">
                          {new Date(booking.startTime)?.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-700 font-medium">End Time</p>
                        <p className="text-blue-900 font-semibold">
                          {new Date(booking.endTime)?.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                        <p className="text-xs text-blue-600">
                          {new Date(booking.endTime)?.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <p className="text-xs text-blue-600">
                        Total Duration: <span className="font-medium">{booking?.duration}</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Booking #{booking?.id} • Booked: {new Date(booking.createdAt || booking.startTime)?.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                  {booking.isExtended && booking.extensionTime && (
                    <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded">
                      <p className="text-xs text-warning font-medium">
                        Extended +{booking.extensionTime}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Original: {booking.originalDuration} → Total: {booking.totalDuration}
                      </p>
                      {booking.extensionCost && (
                        <p className="text-xs text-warning font-medium mt-1">
                          Extension Cost: ₹{booking.extensionCost.toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {/* Vehicle Details */}
                <div>
                  <p className="text-xs text-muted-foreground">Vehicle</p>
                  <p className="text-sm font-medium text-foreground">
                    {booking?.vehicle?.name || booking?.vehicle?.model || booking?.vehicleType || 'Vehicle'}
                  </p>
                  {(booking?.vehicle?.category || booking?.vehicleCategory) && (
                    <p className="text-xs text-muted-foreground">{booking?.vehicle?.category || booking?.vehicleCategory}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {booking?.status === 'active' && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleViewQR}
                    iconName="QrCode"
                    iconPosition="left"
                    className="w-full sm:flex-1"
                  >
                    QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExtend(booking?.id)}
                    iconName="Clock"
                    iconPosition="left"
                    className="w-full sm:flex-1"
                  >
                    Extend
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetDirections}
                    iconName="Navigation"
                    iconPosition="left"
                    className="w-full sm:flex-1"
                  >
                    Directions
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancel}
                    iconName="X"
                    iconPosition="left"
                    className="w-full sm:flex-1"
                  >
                    Cancel
                  </Button>
                </>
              )}

              {booking?.status === 'upcoming' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/slot-selection-booking', { state: { bookingId: booking?.id } })}
                    iconName="Edit"
                    iconPosition="left"
                    className="w-full sm:flex-1"
                  >
                    Modify
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetDirections}
                    iconName="Navigation"
                    iconPosition="left"
                    className="w-full sm:flex-1"
                  >
                    Directions
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancel}
                    iconName="X"
                    iconPosition="left"
                    className="w-full sm:flex-1"
                  >
                    Cancel
                  </Button>
                </>
              )}

              {booking?.status === 'completed' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRebook}
                    iconName="RotateCcw"
                    iconPosition="left"
                    className="w-full sm:flex-1"
                  >
                    Book Again
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(booking?.receiptUrl, '_blank')}
                    iconName="Download"
                    iconPosition="left"
                    className="w-full sm:flex-1"
                  >
                    Receipt
                  </Button>
                  {!booking?.rated && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onRate(booking?.id)}
                      iconName="Star"
                      iconPosition="left"
                      className="w-full sm:flex-1"
                    >
                      Rate
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
