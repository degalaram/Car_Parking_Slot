import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExtendTimeModal = ({ isOpen, onClose, booking, onSave }) => {
  const [newEndTime, setNewEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (booking && isOpen) {
      const currentEndTime = new Date(booking.endTime);
      const timeString = currentEndTime.toTimeString().slice(0, 5); // HH:MM format
      setNewEndTime(timeString);
    }
  }, [booking, isOpen]);

  const handleSave = async () => {
    if (!newEndTime || !booking) return;

    setIsLoading(true);

    try {
      const originalEnd = new Date(booking.endTime);
      const originalStart = new Date(booking.startTime);

      // Create new end time with same date but new time
      const [hours, minutes] = newEndTime.split(':');
      const newEnd = new Date(originalEnd);
      newEnd.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Calculate durations
      const originalDuration = Math.round((originalEnd - originalStart) / (1000 * 60)); // minutes
      const newDuration = Math.round((newEnd - originalStart) / (1000 * 60)); // minutes
      const extensionTime = newDuration - originalDuration;

      if (extensionTime <= 0) {
        alert('New end time must be later than current end time');
        return;
      }

      // Calculate pricing based on vehicle type and extension time
      const calculateExtensionPrice = () => {
        const extensionMinutes = Math.ceil(extensionTime); // Use actual minutes for calculation
        const vehicleType = booking.actualVehicleType || booking.vehicleCategory?.toLowerCase() || 'two-wheeler';

        // Base rates per hour by vehicle type
        const baseRatesPerHour = {
          'two-wheeler': 8.0,
          'four-wheeler': 15.0,
          'commercial-vehicle': 25.0,
          'scooter': 8.0,
          'sport bike': 10.0,
          'cruiser': 10.0,
          'sedan': 15.0,
          'suv': 20.0,
          'luxury suv': 25.0,
          'compact suv': 18.0,
          'electric sedan': 18.0
        };

        // Get appropriate rate per hour and calculate rate per minute
        let hourlyRate = baseRatesPerHour[vehicleType.toLowerCase()] || 
                        (vehicleType.includes('two') || vehicleType.includes('bike') || vehicleType.includes('scooter') ? 8.0 : 15.0);
        const ratePerMinute = hourlyRate / 60;

        // Time-of-day multiplier (peak hours cost more)
        const currentHour = new Date().getHours();
        const isPeakHours = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 19);
        const timeMultiplier = isPeakHours ? 1.3 : 1.0; // 30% increase during peak hours

        const tierDescription = `Booking Tier (${vehicleType})`;
        const hourlyEquivalentRate = hourlyRate * timeMultiplier; // Rate per hour during peak if applicable

        const baseExtensionCost = extensionMinutes * ratePerMinute * timeMultiplier;
        const serviceFee = baseExtensionCost * 0.05; // 5% service fee
        const tax = (baseExtensionCost + serviceFee) * 0.08; // 8% tax
        const totalExtensionCost = baseExtensionCost + serviceFee + tax;

        return {
          extensionMinutes,
          ratePerMinute,
          hourlyRate,
          hourlyEquivalentRate,
          baseExtensionCost: parseFloat(baseExtensionCost.toFixed(2)),
          serviceFee: parseFloat(serviceFee.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          totalExtensionCost: parseFloat(totalExtensionCost.toFixed(2)),
          isPeakHours,
          tierDescription
        };
      };

      const pricingInfo = calculateExtensionPrice();

      // Format duration display
      const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) {
          return `${hours}h ${mins}m`;
        } else if (hours > 0) {
          return `${hours}h`;
        } else {
          return `${mins}m`;
        }
      };

      const updatedBooking = {
        ...booking,
        endTime: newEnd.toISOString(),
        duration: formatDuration(newDuration),
        originalDuration: formatDuration(originalDuration),
        extensionTime: formatDuration(extensionTime),
        totalDuration: formatDuration(newDuration),
        totalAmount: (booking.totalAmount || 0) + pricingInfo.totalExtensionCost,
        extensionCost: pricingInfo.totalExtensionCost,
        isExtended: true,
        extensionHistory: [
          ...(booking.extensionHistory || []),
          {
            originalEndTime: booking.endTime,
            newEndTime: newEnd.toISOString(),
            extensionMinutes: extensionTime,
            extensionCost: pricingInfo.totalExtensionCost,
            pricingBreakdown: pricingInfo,
            extendedAt: new Date().toISOString()
          }
        ]
      };

      await onSave(updatedBooking);
      onClose();
    } catch (error) {
      console.error('Error extending booking:', error);
      alert('Failed to extend booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !booking) return null;

  const originalEndTime = new Date(booking.endTime);
  const currentTimeString = originalEndTime.toTimeString().slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 pb-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">Extend Booking Time</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Icon name="X" size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6">

        {/* Booking Details */}
        <div className="bg-muted/20 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-foreground mb-3">Current Booking</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="text-foreground font-medium">{booking.slotLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vehicle:</span>
              <span className="text-foreground font-medium">{booking.vehicleType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Time:</span>
              <span className="text-foreground font-medium">
                {new Date(booking.startTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current End Time:</span>
              <span className="text-foreground font-medium">
                {originalEndTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Duration:</span>
              <span className="text-foreground font-medium">{booking.duration}</span>
            </div>
          </div>
        </div>

        {/* Time Extension */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              New End Time
            </label>
            <input
              type="time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              min={currentTimeString}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select a time after {originalEndTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>

          {/* Extension Preview */}
          {newEndTime && newEndTime > currentTimeString && (
            <div className="space-y-3">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <h5 className="font-medium text-primary mb-2">Extension Summary</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Duration:</span>
                    <span className="text-foreground">{booking.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extension Time:</span>
                    <span className="text-primary font-medium">
                      {(() => {
                        const [hours, minutes] = newEndTime.split(':');
                        const newEnd = new Date(originalEndTime);
                        newEnd.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        const extensionMinutes = Math.round((newEnd - originalEndTime) / (1000 * 60));
                        const extHours = Math.floor(extensionMinutes / 60);
                        const extMins = extensionMinutes % 60;
                        if (extHours > 0 && extMins > 0) {
                          return `+${extHours}h ${extMins}m`;
                        } else if (extHours > 0) {
                          return `+${extHours}h`;
                        } else {
                          return `+${extMins}m`;
                        }
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-foreground">Total Duration:</span>
                    <span className="text-primary">
                      {(() => {
                        const originalStart = new Date(booking.startTime);
                        const [hours, minutes] = newEndTime.split(':');
                        const newEnd = new Date(originalEndTime);
                        newEnd.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        const totalMinutes = Math.round((newEnd - originalStart) / (1000 * 60));
                        const totalHours = Math.floor(totalMinutes / 60);
                        const totalMins = totalMinutes % 60;
                        if (totalHours > 0 && totalMins > 0) {
                          return `${totalHours}h ${totalMins}m`;
                        } else if (totalHours > 0) {
                          return `${totalHours}h`;
                        } else {
                          return `${totalMins}m`;
                        }
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h5 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <Icon name="DollarSign" size={16} className="text-green-600" />
                  Extension Pricing
                </h5>
                <div className="space-y-1 text-sm">
                  {(() => {
                    const [hours, minutes] = newEndTime.split(':');
                    const newEnd = new Date(originalEndTime);
                    newEnd.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                    const extensionMinutes = Math.round((newEnd - originalEndTime) / (1000 * 60));
                    const extensionHours = Math.ceil(extensionMinutes / 60);
                    const vehicleType = booking.actualVehicleType || booking.vehicleCategory?.toLowerCase() || 'two-wheeler';

                    // Base rates per hour by vehicle type
                    const baseRatesPerHour = {
                      'two-wheeler': 8.0,
                      'four-wheeler': 15.0,
                      'commercial-vehicle': 25.0,
                      'scooter': 8.0,
                      'sport bike': 10.0,
                      'cruiser': 10.0,
                      'sedan': 15.0,
                      'suv': 20.0,
                      'luxury suv': 25.0,
                      'compact suv': 18.0,
                      'electric sedan': 18.0
                    };

                    let hourlyRate = baseRatesPerHour[vehicleType.toLowerCase()] || 
                                    (vehicleType.includes('two') || vehicleType.includes('bike') || vehicleType.includes('scooter') ? 8.0 : 15.0);
                    const ratePerMinute = hourlyRate / 60;

                    // Time-of-day multiplier
                    const currentHour = new Date().getHours();
                    const isPeakHours = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 19);
                    const timeMultiplier = isPeakHours ? 1.3 : 1.0;

                    const tierDescription = `Booking Tier (${vehicleType})`;
                    const hourlyEquivalentRate = hourlyRate * timeMultiplier;

                    const baseExtensionCost = extensionMinutes * ratePerMinute * timeMultiplier;
                    const serviceFee = baseExtensionCost * 0.05;
                    const tax = (baseExtensionCost + serviceFee) * 0.08;
                    const totalExtensionCost = baseExtensionCost + serviceFee + tax;

                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-green-700">{tierDescription}:</span>
                          <span className="text-green-800 text-xs">₹{ratePerMinute.toFixed(2)}/min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Duration ({extensionMinutes} min @ ₹{hourlyEquivalentRate}/h{isPeakHours ? ' peak' : ''}):</span>
                          <span className="text-green-800">₹{baseExtensionCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Service Fee (5%):</span>
                          <span className="text-green-800">₹{serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Tax (8%):</span>
                          <span className="text-green-800">₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-1 border-t border-green-300">
                          <span className="text-green-800">Extension Cost:</span>
                          <span className="text-green-900 text-base">₹{totalExtensionCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-green-800">New Total Amount:</span>
                          <span className="text-green-900 text-base">₹{((booking.totalAmount || 0) + totalExtensionCost).toFixed(2)}</span>
                        </div>
                        {isPeakHours && (
                          <div className="text-xs text-green-600 mt-1">
                            * Peak hours pricing (+30%) applied (8-10 AM, 5-7 PM)
                          </div>
                        )}
                        {extensionMinutes > 15 && (
                          <div className="text-xs text-green-600 mt-1">
                            * Extended duration pricing applied
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Fixed Actions at Bottom */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-border">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!newEndTime || newEndTime <= currentTimeString || isLoading}
              iconName={isLoading ? "Loader2" : "Clock"}
              iconPosition="left"
            >
              {isLoading ? 'Saving...' : 'Save Extension'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendTimeModal;