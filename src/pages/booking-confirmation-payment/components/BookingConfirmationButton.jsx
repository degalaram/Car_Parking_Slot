import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingConfirmationButton = ({ 
  isValid, 
  totalAmount, 
  onConfirmBooking,
  isProcessing = false, // This prop is now handled differently in the edited snippet
  disabled = false 
}) => {
  const navigate = useNavigate();
  const [isLocalProcessing, setIsLocalProcessing] = useState(false); // Renamed state for clarity
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirmBooking = async () => {
    // Added checks for isProcessing and isLocalProcessing
    if (!isValid || disabled || isProcessing || isLocalProcessing) return;

    setIsLocalProcessing(true);

    try {
      // Removed the simulated payment processing as it was likely causing issues.
      // Call parent confirmation handler
      if (onConfirmBooking) {
        await onConfirmBooking();
      }

      setIsLocalProcessing(false);
      setIsSuccess(true);

      // Show success state briefly then navigate
      setTimeout(() => {
        navigate('/my-bookings-dashboard', { 
          state: { 
            bookingConfirmed: true,
            showSuccessMessage: true 
          } 
        });
      }, 2000);

    } catch (error) {
      setIsLocalProcessing(false);
      console.error('Booking confirmation failed:', error);
      // Added an alert for user feedback on payment failure
      alert('Payment failed. Please try again.');
    }
  };

  const getButtonContent = () => {
    if (isSuccess) {
      return (
        <>
          <Icon name="CheckCircle" size={20} className="text-white" />
          Booking Confirmed!
        </>
      );
    }

    // Updated to check both isProcessing and isLocalProcessing
    if (isProcessing || isLocalProcessing) {
      return (
        <>
          <div className="animate-spin">
            <Icon name="Loader" size={20} /> {/* Changed Icon name from Loader2 to Loader */}
          </div>
          Processing Payment...
        </>
      );
    }

    return (
      <>
        <Icon name="CreditCard" size={20} />
        Confirm Booking - ₹{totalAmount?.toFixed(2) || '43.20'} {/* Added fallback for totalAmount */}
      </>
    );
  };

  const getButtonVariant = () => {
    if (isSuccess) return 'primary'; // Changed variant from 'success' to 'primary' for consistency
    // Updated to check both isProcessing and isLocalProcessing
    if (isProcessing || isLocalProcessing) return 'secondary';
    return 'primary';
  };

  return (
    <div className="space-y-4">
      {/* Security Reminder */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={20} className="text-green-600 mt-0.5" /> {/* Changed text-success to text-green-600 */}
          <div className="flex-1">
            <h4 className="text-sm font-medium text-foreground mb-1">Secure Payment Processing</h4>
            <p className="text-xs text-muted-foreground">
              Your payment information is encrypted and processed securely. 
              You will receive a confirmation email with your booking details and QR code.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Button */}
      <Button
        onClick={handleConfirmBooking}
        // Updated disabled condition
        disabled={!isValid || disabled || isProcessing || isLocalProcessing}
        variant={getButtonVariant()}
        size="lg"
        // Added className for full width, centering, and gap
        className="w-full h-14 text-lg font-semibold flex items-center justify-center gap-3 transition-all duration-200"
      >
        {getButtonContent()}
      </Button>

      {/* Terms Reminder */}
      {/* Simplified the terms reminder */}
      <p className="text-xs text-muted-foreground text-center">
        By confirming this booking, you agree to our terms and conditions.
      </p>

      {/* Success Animation Overlay */}
      {isSuccess && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"> {/* Changed z-index */}
          <div className="bg-card border border-border rounded-lg p-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"> {/* Changed bg-success/10 to bg-green-100 */}
              <Icon name="CheckCircle" size={32} className="text-green-600" /> {/* Changed text-success to text-green-600 */}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Booking Confirmed!</h3>
              <p className="text-sm text-muted-foreground">
                Redirecting to your bookings dashboard...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingConfirmationButton;