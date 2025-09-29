import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const CancellationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  booking,
  isProcessing = false 
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-4 sm:p-6 text-center animate-fade-in">
        {/* Header with Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={24} className="text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
          Cancel Booking?
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to cancel this booking?
        </p>

        {/* Booking Details */}
        <div className="bg-muted rounded-lg p-3 mb-4 text-left">
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">{booking.facility.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Slot</p>
              <p className="text-sm font-medium text-foreground">{booking.slotLocation}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-sm font-medium text-foreground">${booking.totalAmount}</p>
            </div>
          </div>
        </div>

        {/* Warning message */}
        <p className="text-destructive text-sm mb-6 font-medium">
          This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1"
          >
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Icon name="Loader" size={16} className="animate-spin mr-2" />
                Cancelling...
              </>
            ) : (
              'Cancel Booking'
            )}
          </Button>
        </div>

        {/* Additional info */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Cancellation may be subject to terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;