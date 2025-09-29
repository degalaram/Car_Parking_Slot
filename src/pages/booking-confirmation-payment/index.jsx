
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BookingProgressHeader from '../../components/ui/BookingProgressHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import BookingFloatingActions from '../../components/ui/BookingFloatingActions';
import BookingSummaryCard from './components/BookingSummaryCard';
import PricingBreakdown from './components/PricingBreakdown';
import PaymentMethodSection from './components/PaymentMethodSection';
import BookingTermsSection from './components/BookingTermsSection';
import BookingConfirmationButton from './components/BookingConfirmationButton';

const BookingConfirmationPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card_1');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get booking data from various sources
  useEffect(() => {
    const getBookingData = () => {
      console.log('BookingConfirmationPayment - Starting data retrieval...');
      console.log('Navigation state:', location?.state);
      
      let actualBookingData = null;

      try {
        // Priority 1: Check location state
        if (location?.state?.bookingData) {
          actualBookingData = location.state.bookingData;
          console.log('BookingConfirmationPayment - Found data in navigation state');
        }
        
        // Priority 2: Check localStorage
        if (!actualBookingData) {
          try {
            const storedData = localStorage.getItem('pendingBookingData');
            if (storedData) {
              actualBookingData = JSON.parse(storedData);
              console.log('BookingConfirmationPayment - Retrieved data from localStorage');
            }
          } catch (storageError) {
            console.error('Failed to retrieve booking data from localStorage:', storageError);
          }
        }

        // Priority 3: Create fallback data to prevent errors
        if (!actualBookingData) {
          console.warn('No booking data found, creating fallback data');
          const now = new Date();
          const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
          const endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
          
          actualBookingData = {
            facility: {
              id: Date.now(),
              name: 'Hitech City Hub',
              address: 'Financial District, Hitech City, Hyderabad',
              location: { lat: 17.3850, lng: 78.4867 },
              rating: 4.8,
              reviews: 324
            },
            slot: {
              location: '1st Floor A Row 1st Parking Slot',
              floor: '1st Floor',
              row: 'A Row',
              number: '1',
              type: 'Standard'
            },
            vehicle: {
              name: 'Selected Vehicle',
              model: 'Selected Vehicle',
              type: 'Vehicle Type',
              category: 'Vehicle Category',
              vehicleType: 'two-wheeler',
              label: 'Selected Vehicle',
              image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
            },
            checkIn: {
              date: now.toISOString().split('T')[0],
              time: currentTime
            },
            checkOut: {
              date: now.toISOString().split('T')[0],
              time: endTimeString
            },
            duration: '2 hours',
            pricing: {
              totalCost: 200,
              baseRate: 180,
              serviceFee: 10.00,
              tax: 10.00
            },
            isQuickBooking: false
          };
        }

        console.log('BookingConfirmationPayment - Final booking data:', actualBookingData);
        setBookingData(actualBookingData);
        setError(null);
        
      } catch (error) {
        console.error('Error processing booking data:', error);
        setError('Failed to load booking data');
        
        // Set fallback data even on error
        const errorFallbackTime = new Date();
        const errorCurrentTime = `${errorFallbackTime.getHours().toString().padStart(2, '0')}:${errorFallbackTime.getMinutes().toString().padStart(2, '0')}`;
        const errorEndTime = new Date(errorFallbackTime.getTime() + 2 * 60 * 60 * 1000);
        const errorEndTimeString = `${errorEndTime.getHours().toString().padStart(2, '0')}:${errorEndTime.getMinutes().toString().padStart(2, '0')}`;
        
        setBookingData({
          facility: {
            id: Date.now(),
            name: 'Hitech City Hub',
            address: 'Financial District, Hitech City, Hyderabad',
            location: { lat: 17.3850, lng: 78.4867 },
            rating: 4.8,
            reviews: 324
          },
          slot: {
            location: '1st Floor A Row 1st Parking Slot',
            floor: '1st Floor',
            row: 'A Row',
            number: '1',
            type: 'Standard'
          },
          vehicle: {
            name: 'Selected Vehicle',
            model: 'Selected Vehicle',
            type: 'Vehicle Type',
            category: 'Vehicle Category',
            vehicleType: 'two-wheeler',
            label: 'Selected Vehicle',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
          },
          checkIn: {
            date: errorFallbackTime.toISOString().split('T')[0],
            time: errorCurrentTime
          },
          checkOut: {
            date: errorFallbackTime.toISOString().split('T')[0],
            time: errorEndTimeString
          },
          duration: '2 hours',
          pricing: {
            totalCost: 200,
            baseRate: 180,
            serviceFee: 10.00,
            tax: 10.00
          },
          isQuickBooking: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Get booking data immediately
    getBookingData();
  }, [location?.state]);

  // Use actual pricing data from booking data instead of hard-coded values
  const getActualPricingData = () => {
    const actualPricing = bookingData?.pricing;
    
    if (actualPricing) {
      console.log('Using actual pricing data from slot selection:', actualPricing);
      
      // Use the actual calculated values from pricing breakdown
      const baseRate = actualPricing.subtotal || actualPricing.baseCost || 0;
      const serviceFee = actualPricing.serviceFee || 0;
      const tax = actualPricing.taxes || 0;
      const total = actualPricing.totalCost || 0;
      
      // Get actual duration in minutes
      const actualMinutes = actualPricing.actualMinutes || 0;
      let durationDisplay = "0 minutes";
      
      if (actualMinutes < 60) {
        durationDisplay = `${actualMinutes} minutes`;
      } else if (actualMinutes === 60) {
        durationDisplay = '1 hour';
      } else if (actualMinutes % 60 === 0) {
        durationDisplay = `${Math.floor(actualMinutes / 60)} hours`;
      } else {
        const hours = Math.floor(actualMinutes / 60);
        const mins = actualMinutes % 60;
        durationDisplay = `${hours}h ${mins}m`;
      }
      
      return {
        baseRate: baseRate,
        timeAdjustment: actualPricing.timeAdjustment || 0,
        vehicleFee: actualPricing.vehicleFee || 0,
        discounts: actualPricing.applicableDiscounts || [],
        subtotal: baseRate,
        serviceFee: serviceFee,
        tax: tax,
        taxRate: 18,
        total: total,
        totalSavings: actualPricing.savings || 0,
        duration: durationDisplay,
        actualMinutes: actualMinutes
      };
    }
    
    // Fallback pricing only if no data is available
    console.warn('No pricing data available, using fallback pricing');
    return {
      baseRate: 45.00,
      timeAdjustment: 5.00,
      vehicleFee: 0.00,
      discounts: [],
      subtotal: 37.50,
      serviceFee: 2.50,
      tax: 3.20,
      taxRate: 8.5,
      total: 43.20,
      totalSavings: 0,
      duration: bookingData?.duration || "2 hours"
    };
  };

  const pricingData = getActualPricingData();

  // Validate form whenever payment method or terms change
  useEffect(() => {
    const isPaymentMethodSelected = selectedPaymentMethod !== '';
    const areTermsAccepted = termsAccepted;
    setIsFormValid(isPaymentMethodSelected && areTermsAccepted);
  }, [selectedPaymentMethod, termsAccepted]);

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleTermsAcceptance = (accepted) => {
    setTermsAccepted(accepted);
  };

  const handleConfirmBooking = async () => {
    try {
      setIsProcessing(true);

      const currentTime = new Date();
      const startDateTime = bookingData?.checkIn?.date && bookingData?.checkIn?.time 
        ? new Date(`${bookingData.checkIn.date}T${bookingData.checkIn.time}:00`)
        : currentTime;
      const endDateTime = bookingData?.checkOut?.date && bookingData?.checkOut?.time 
        ? new Date(`${bookingData.checkOut.date}T${bookingData.checkOut.time}:00`)
        : new Date(startDateTime.getTime() + 4 * 60 * 60 * 1000);

      const newBooking = {
        id: `BK${Date.now().toString().slice(-6)}`,
        facility: bookingData?.facility || {
          id: Date.now(),
          name: 'Selected Location',
          address: 'Selected Address',
          location: { lat: 17.3850, lng: 78.4867 },
          rating: 4.8,
          reviews: 324
        },
        slotLocation: bookingData?.slot?.location || 'Floor 1 A Row 1st Parking Slot',
        slot: bookingData?.slot || {
          location: 'Floor 1 A Row 1st Parking Slot',
          floor: '1st Floor',
          row: 'A Row',
          number: '1',
          type: 'Standard'
        },
        vehicleType: bookingData?.vehicle?.name || bookingData?.vehicle?.model || bookingData?.vehicle?.type || 'Selected Vehicle',
        vehicleImage: bookingData?.vehicle?.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        actualVehicleType: bookingData?.vehicle?.vehicleType || 'four-wheeler',
        vehicleCategory: bookingData?.vehicle?.category || bookingData?.vehicle?.type || 'Vehicle',
        vehicle: bookingData?.vehicle || {
          name: 'Selected Vehicle',
          model: 'Selected Vehicle',
          type: 'Vehicle',
          category: 'Vehicle',
          vehicleType: 'four-wheeler',
          label: 'Selected Vehicle',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
        },
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        duration: bookingData?.duration || '2 hours',
        checkIn: {
          date: bookingData?.checkIn?.date || new Date().toISOString().split('T')[0],
          time: bookingData?.checkIn?.time || '09:00',
          fullDateTime: startDateTime.toISOString()
        },
        checkOut: {
          date: bookingData?.checkOut?.date || new Date().toISOString().split('T')[0], 
          time: bookingData?.checkOut?.time || '11:00',
          fullDateTime: endDateTime.toISOString()
        },
        totalAmount: pricingData?.total || 43.20,
        status: 'active',
        receiptUrl: '#',
        createdAt: currentTime.toISOString(),
        paymentMethod: selectedPaymentMethod,
        isQuickBooking: bookingData?.isQuickBooking || false
      };

      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      const updatedBookings = [newBooking, ...existingBookings];
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));

      // Trigger storage event for real-time updates
      window.dispatchEvent(new Event('bookingUpdate'));

      // Set booking ID and show success popup
      setBookingId(newBooking.id);
      setShowSuccessPopup(true);

      // Auto-close popup after 3 seconds and navigate
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/my-bookings-dashboard', {
          state: {
            initialTab: 'active',
            newBookingId: newBooking.id
          }
        });
      }, 3000);
    } catch (error) {
      console.error('Booking confirmation error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Show error state with fallback content
  if (error && !bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading your booking details.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/slot-selection-booking')}
              className="w-full"
            >
              Go Back to Booking
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      <BookingProgressHeader />
      
      {/* Main Content */}
      <main className="container-app py-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title - Mobile */}
          <div className="lg:hidden mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Confirm & Pay</h1>
            <p className="text-muted-foreground">Review your booking details and complete payment</p>
          </div>

          {/* Responsive Layout */}
          <div className="lg:grid lg:grid-cols-5 lg:gap-8">
            {/* Left Column - Booking Summary (Desktop only) */}
            <div className="hidden lg:block lg:col-span-2 space-y-6">
              {/* Page Title - Desktop */}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Confirm & Pay</h1>
                <p className="text-muted-foreground">Review your booking details and complete payment</p>
              </div>

              <BookingSummaryCard bookingData={bookingData} />
              <PricingBreakdown pricingData={pricingData} />
            </div>

            {/* Right Column - Payment & Terms (Desktop) / Full Content (Mobile) */}
            <div className="lg:col-span-3 space-y-6 mt-6 lg:mt-0">
              {/* Mobile Only Components */}
              <div className="lg:hidden space-y-6">
                <BookingSummaryCard bookingData={bookingData} />
                <PricingBreakdown pricingData={pricingData} />
              </div>

              {/* Payment & Terms - Both Mobile and Desktop */}
              <PaymentMethodSection
                onPaymentMethodChange={handlePaymentMethodChange}
                selectedMethod={selectedPaymentMethod}
              />

              <BookingTermsSection
                onTermsAcceptance={handleTermsAcceptance}
                termsAccepted={termsAccepted}
              />

              <BookingConfirmationButton
                isValid={isFormValid}
                totalAmount={pricingData?.total}
                onConfirmBooking={handleConfirmBooking}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Navigation */}
      <BottomTabNavigation />
      <BookingFloatingActions />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-4 sm:p-6 text-center animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="Check" size={24} className="text-green-600" />
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              🎉 Booking Confirmed!
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Your parking slot has been successfully booked
            </p>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600 mb-1">Booking ID</p>
              <p className="font-mono font-semibold text-gray-800">{bookingId}</p>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Redirecting to your bookings dashboard...
            </p>

            <button
              onClick={() => {
                setShowSuccessPopup(false);
                navigate('/my-bookings-dashboard', {
                  state: {
                    initialTab: 'active',
                    newBookingId: bookingId
                  }
                });
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to My Bookings
            </button>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                You will receive a confirmation email with your booking details and QR code for facility access.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingConfirmationPayment;
