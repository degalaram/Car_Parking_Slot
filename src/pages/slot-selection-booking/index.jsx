import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import BookingProgressHeader from '../../components/ui/BookingProgressHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import BookingFloatingActions from '../../components/ui/BookingFloatingActions';

// Import all components
import FloorLayoutVisualization from './components/FloorLayoutVisualization';
import VehicleSelector from './components/VehicleSelector';
import DateTimeSelector from './components/DateTimeSelector';
import PricingCalculator from './components/PricingCalculator';
import SlotDetailsPanel from './components/SlotDetailsPanel';
import AlternativeSlotSuggestions from './components/AlternativeSlotSuggestions';

const SlotSelectionBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Debug logging for state changes
  useEffect(() => {
    console.log('SlotSelection - Selected vehicle state changed:', selectedVehicle);
  }, [selectedVehicle]);
  const [selectedDateTime, setSelectedDateTime] = useState({
    date: new Date()?.toISOString()?.split('T')?.[0],
    time: '09:00',
    duration: 2
  });
  const [duration, setDuration] = useState(2);
  const [pricingInfo, setPricingInfo] = useState(null);
  const [isQuickBooking, setIsQuickBooking] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  // State for the complete booking data
  const [bookingData, setBookingData] = useState({});

  // 30 Hyderabad locations
  const hyderabadLocations = [
    { id: 1, name: 'Hitech City Hub', address: 'Financial District, Hitech City, Hyderabad', lat: 17.4435, lng: 78.3772 },
    { id: 2, name: 'Gachibowli Arena', address: 'IT Hub, Gachibowli, Hyderabad', lat: 17.4400, lng: 78.3482 },
    { id: 3, name: 'Madhapur Center', address: 'HITEC City, Madhapur, Hyderabad', lat: 17.4481, lng: 78.3915 },
    { id: 4, name: 'Jubilee Hills Plaza', address: 'Jubilee Hills Road No.36, Hyderabad', lat: 17.4305, lng: 78.4059 },
    { id: 5, name: 'Banjara Hills Parking', address: 'Road No.12, Banjara Hills, Hyderabad', lat: 17.4123, lng: 78.4439 },
    { id: 6, name: 'Secunderabad Plaza', address: 'SP Road, Secunderabad, Hyderabad', lat: 17.5040, lng: 78.5440 },
    { id: 7, name: 'Begumpet Parking', address: 'Airport Road, Begumpet, Hyderabad', lat: 17.4520, lng: 78.4636 },
    { id: 8, name: 'Kukatpally Center', address: 'JNTU, Kukatpally, Hyderabad', lat: 17.4840, lng: 78.4071 },
    { id: 9, name: 'Kondapur Hub', address: 'Botanical Garden, Kondapur, Hyderabad', lat: 17.4615, lng: 78.3436 },
    { id: 10, name: 'Miyapur Complex', address: 'Metro Station, Miyapur, Hyderabad', lat: 17.5108, lng: 78.3409 },
    { id: 11, name: 'Ameerpet', address: 'Ameerpet, Hyderabad', lat: 17.4374, lng: 78.4482 },
    { id: 12, name: 'SR Nagar', address: 'SR Nagar, Hyderabad', lat: 17.4431, lng: 78.4482 },
    { id: 13, name: 'Punjagutta', address: 'Punjagutta, Hyderabad', lat: 17.4274, lng: 78.4594 },
    { id: 14, name: 'Somajiguda', address: 'Somajiguda, Hyderabad', lat: 17.4239, lng: 78.4738 },
    { id: 15, name: 'Abids', address: 'Abids, Hyderabad', lat: 17.3616, lng: 78.4747 },
    { id: 16, name: 'Koti', address: 'Koti, Hyderabad', lat: 17.3679, lng: 78.4719 },
    { id: 17, name: 'Charminar', address: 'Charminar, Hyderabad', lat: 17.3616, lng: 78.4747 },
    { id: 18, name: 'Dilsukhnagar', address: 'Dilsukhnagar, Hyderabad', lat: 17.3687, lng: 78.5240 },
    { id: 19, name: 'LB Nagar', address: 'LB Nagar, Hyderabad', lat: 17.3525, lng: 78.5520 },
    { id: 20, name: 'Uppal', address: 'Uppal, Hyderabad', lat: 17.4065, lng: 78.5691 },
    { id: 21, name: 'Kompally', address: 'Kompally, Hyderabad', lat: 17.5431, lng: 78.4897 },
    { id: 22, name: 'Nizampet', address: 'Nizampet, Hyderabad', lat: 17.5079, lng: 78.3898 },
    { id: 23, name: 'Manikonda', address: 'Manikonda, Hyderabad', lat: 17.4022, lng: 78.3400 },
    { id: 24, name: 'Tolichowki', address: 'Tolichowki, Hyderabad', lat: 17.3914, lng: 78.4081 },
    { id: 25, name: 'Mehdipatnam', address: 'Mehdipatnam, Hyderabad', lat: 17.3971, lng: 78.4398 },
    { id: 26, name: 'Lakdikapool', address: 'Lakdikapool, Hyderabad', lat: 17.3953, lng: 78.4636 },
    { id: 27, name: 'Nampally', address: 'Nampally, Hyderabad', lat: 17.3753, lng: 78.4744 },
    { id: 28, name: 'Paradise Circle', address: 'Paradise Circle, Hyderabad', lat: 17.4398, lng: 78.4983 },
    { id: 29, name: 'Tarnaka', address: 'Tarnaka, Hyderabad', lat: 17.4284, lng: 78.5204 },
    { id: 30, name: 'Nacharam', address: 'Nacharam, Hyderabad', lat: 17.4284, lng: 78.5647 }
  ];

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showParkingSlots, setShowParkingSlots] = useState(false);

  // Handle URL parameters and state for direct navigation
  useEffect(() => {
    console.log('Slot selection page loaded with state:', location?.state); // Debug log

    const urlParams = new URLSearchParams(window.location.search);
    const locationName = urlParams.get('location');
    const cityName = urlParams.get('city');

    // Check if facility info is passed from state (highest priority)
    if (location?.state?.facilityInfo) {
      console.log('Using facility info from state:', location.state.facilityInfo); // Debug log
      const facilityInfo = location.state.facilityInfo;
      const newLocation = {
        id: facilityInfo.id || Date.now(),
        name: facilityInfo.name,
        address: facilityInfo.address,
        lat: facilityInfo.lat || facilityInfo.location?.lat || 17.3850,
        lng: facilityInfo.lng || facilityInfo.location?.lng || 78.4867
      };
      setSelectedLocation(newLocation);
      setShowParkingSlots(true);
    } 
    // Handle direct navigation from home page
    else {
      console.log('Creating new location from URL params or fallback'); // Debug log
      // Always set a selected location to show parking slots
      const placeName = locationName || 'Hitech City'; // Default fallback
      const foundLocation = hyderabadLocations.find(loc => 
        loc.name.toLowerCase().includes(placeName.toLowerCase())
      );

      if (foundLocation) {
        setSelectedLocation(foundLocation);
      } else {
        // Create a location based on the place name
        const newLocation = {
          id: Date.now(),
          name: placeName,
          address: `${placeName}, ${cityName === 'bangalore' ? 'Bangalore' : 'Hyderabad'}`,
          lat: cityName === 'bangalore' ? 12.9716 + (Math.random() - 0.5) * 0.1 : 17.3850 + (Math.random() - 0.5) * 0.1,
          lng: cityName === 'bangalore' ? 77.5946 + (Math.random() - 0.5) * 0.1 : 78.4867 + (Math.random() - 0.5) * 0.1
        };
        setSelectedLocation(newLocation);
      }

      // Always show parking slots when coming from home page
      setShowParkingSlots(true);
    }
  }, [location?.state]);

  // Get facility info from previous page or selected location
  const facilityInfo = selectedLocation ? {
    id: selectedLocation.id,
    name: selectedLocation.name,
    address: selectedLocation.address,
    lat: selectedLocation.lat,
    lng: selectedLocation.lng,
    location: { lat: selectedLocation.lat, lng: selectedLocation.lng }
  } : location?.state?.facilityInfo || {
    name: 'Select Location',
    address: 'Choose a location in Hyderabad'
  };

  // Handle slot selection - Enhanced logging
  const handleSlotSelect = (slot) => {
    console.log('SlotSelection - handleSlotSelect called with:', slot);
    
    if (!slot) {
      console.warn('SlotSelection - No slot data provided');
      return;
    }
    
    // Ensure slot has all required fields
    const completeSlot = {
      ...slot,
      id: slot.id || slot.slotNumber || `slot-${Date.now()}`,
      slotNumber: slot.slotNumber || slot.id || '1',
      location: slot.location || `${slot.floorId === 1 ? '1st' : slot.floorId === 2 ? '2nd' : '3rd'} Floor ${slot.row || 'A'} Row ${slot.slotNumber || slot.id || '1'}th Parking Slot`,
      status: slot.status || 'available',
      walkingDistance: slot.walkingDistance || Math.floor(Math.random() * 100) + 50,
      floorId: slot.floorId || selectedFloor
    };
    
    console.log('SlotSelection - Setting complete slot data:', completeSlot);
    setSelectedSlot(completeSlot);
    setShowAlternatives(false);
    console.log('SlotSelection - Selected slot updated successfully');
  };

  // Handle vehicle change - Enhanced with better state management
  const handleVehicleChange = (vehicle) => {
    console.log('SlotSelection - Received vehicle data:', vehicle); // Debug log
    
    // Only proceed if we have valid vehicle data
    if (!vehicle || !vehicle.type) {
      console.log('SlotSelection - Invalid vehicle data received'); 
      return;
    }
    
    setSelectedVehicle(vehicle);
    
    // Reset slot selection when vehicle type changes
    if (selectedSlot && selectedSlot?.vehicleType !== vehicle?.vehicleType) {
      setSelectedSlot(null);
    }
    
    // Store complete vehicle data for booking
    setBookingData(prev => ({
      ...prev,
      vehicle: vehicle
    }));
    
    console.log('SlotSelection - Vehicle updated, current vehicle:', vehicle);
  };

  // Handle date/time change
  const handleDateTimeChange = (dateTime) => {
    setSelectedDateTime(dateTime);
  };

  // Handle pricing update
  const handlePriceChange = (pricing) => {
    setPricingInfo(pricing);
  };

  // Handle location selection
  const handleLocationSelect = (locationId) => {
    const location = hyderabadLocations.find(loc => loc.id === parseInt(locationId));
    setSelectedLocation(location);
    setShowParkingSlots(!!location);
    setSelectedSlot(null); // Reset slot when location changes
  };

  // Handle booking toggle
  const handleBookingToggle = () => {
    setIsQuickBooking(!isQuickBooking);
  };

  // Handle proceed to payment - Enhanced validation and data handling
  const handleProceedToPayment = () => {
    console.log('=== PROCEED TO PAYMENT CLICKED ===');
    console.log('Selected Location:', selectedLocation);
    console.log('Facility Info:', facilityInfo);
    console.log('Selected Slot:', selectedSlot);
    console.log('Pricing Info:', pricingInfo);
    console.log('Selected Vehicle:', selectedVehicle);
    console.log('Selected DateTime:', selectedDateTime);
    console.log('Current URL:', window.location.href);
    console.log('Navigate function available:', typeof navigate === 'function');

    // Enhanced validation with more specific error messages
    if (!selectedVehicle || !selectedVehicle.type) {
      console.error('Validation failed: No vehicle selected');
      alert('Please select a vehicle type before proceeding.');
      return;
    }

    if (!selectedSlot) {
      console.error('Validation failed: No slot selected');
      alert('Please select a parking slot before proceeding.');
      return;
    }

    // Ensure we have proper facility info - prioritize selectedLocation over facilityInfo
    const actualFacilityInfo = selectedLocation || facilityInfo;
    
    if (!actualFacilityInfo || actualFacilityInfo.name === 'Select Location') {
      console.error('Validation failed: No location selected');
      alert('Please select a location before proceeding.');
      return;
    }

    console.log('All validations passed, proceeding with navigation...');

    // Create proper slot data with better fallbacks
    const slotData = {
      location: selectedSlot?.location || `${selectedFloor === 1 ? '1st' : selectedFloor === 2 ? '2nd' : '3rd'} Floor A Row 1st Parking Slot`,
      floor: selectedFloor === 1 ? '1st Floor' : selectedFloor === 2 ? '2nd Floor' : '3rd Floor',
      row: 'A Row',
      number: selectedSlot?.slotNumber || selectedSlot?.id || '1',
      type: selectedSlot?.status === 'available' ? 'Standard' : 'Premium'
    };

    // Use actual pricing or fallback
    const actualPricing = pricingInfo || {
      totalCost: 50,
      baseRate: 45,
      serviceFee: 2.50,
      tax: 2.50
    };

    // Create complete booking data with all required fields
    const completeBookingData = {
      facility: {
        id: actualFacilityInfo?.id || Date.now(),
        name: actualFacilityInfo?.name || 'Hitech City Hub',
        address: actualFacilityInfo?.address || 'Financial District, Hitech City, Hyderabad',
        location: { 
          lat: actualFacilityInfo?.lat || 17.3850, 
          lng: actualFacilityInfo?.lng || 78.4867 
        },
        rating: actualFacilityInfo?.rating || 4.8,
        reviews: actualFacilityInfo?.reviews || 324
      },
      slot: slotData,
      vehicle: {
        type: selectedVehicle.type || selectedVehicle.name || 'Four Wheeler',
        vehicleType: selectedVehicle.vehicleType || 'four-wheeler',
        model: selectedVehicle.model || selectedVehicle.name || selectedVehicle.type || 'Vehicle Model',
        name: selectedVehicle.name || selectedVehicle.model || selectedVehicle.type || 'Vehicle',
        label: selectedVehicle.label || selectedVehicle.name || selectedVehicle.type || 'Vehicle',
        image: selectedVehicle.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        category: selectedVehicle.category || selectedVehicle.type || 'Vehicle'
      },
      checkIn: {
        date: selectedDateTime?.date || new Date().toISOString().split('T')[0],
        time: selectedDateTime?.time || '09:00'
      },
      checkOut: {
        date: selectedDateTime?.date || new Date().toISOString().split('T')[0],
        time: (() => {
          const currentDate = selectedDateTime?.date || new Date().toISOString().split('T')[0];
          const currentTime = selectedDateTime?.time || '09:00';
          const currentDuration = selectedDateTime?.duration || duration;
          const startTime = new Date(`${currentDate}T${currentTime}`);
          const endTime = new Date(startTime.getTime() + currentDuration * 60 * 60 * 1000);
          return endTime.toTimeString().slice(0, 5);
        })()
      },
      duration: `${selectedDateTime?.duration || duration} hours`,
      pricing: actualPricing,
      isQuickBooking: isQuickBooking || false
    };

    // Debug log to verify all data
    console.log('Complete booking data being passed:', completeBookingData);
    console.log('Facility data valid:', !!completeBookingData.facility.name);
    console.log('Vehicle data valid:', !!completeBookingData.vehicle.type);
    console.log('Slot data valid:', !!completeBookingData.slot.location);

    // Store booking data in localStorage as backup
    try {
      localStorage.setItem('pendingBookingData', JSON.stringify(completeBookingData));
      console.log('Booking data stored in localStorage successfully');
    } catch (error) {
      console.error('Failed to store booking data in localStorage:', error);
    }

    // Navigate with proper error handling
    try {
      console.log('=== NAVIGATING TO PAYMENT PAGE ===');
      console.log('Using React Router navigate with state:', completeBookingData);
      
      navigate('/booking-confirmation-payment', {
        state: { bookingData: completeBookingData },
        replace: false
      });
      
      console.log('Navigation call completed successfully');
    } catch (error) {
      console.error('Navigation failed:', error);
      alert('Navigation failed: ' + error.message);
    }
  };

  // Show alternatives when slot becomes unavailable
  useEffect(() => {
    if (selectedSlot && selectedSlot?.status === 'reserved') {
      setShowAlternatives(true);
    }
  }, [selectedSlot]);

  // WebSocket simulation for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time slot status updates
      if (selectedSlot && Math.random() < 0.1) { // 10% chance of status change
        const newStatus = Math.random() < 0.5 ? 'available' : 'ending-soon';
        setSelectedSlot(prev => ({
          ...prev,
          status: newStatus,
          endTime: newStatus === 'ending-soon' ? new Date(Date.now() + Math.random() * 3600000) : null
        }));
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [selectedSlot]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BookingProgressHeader />
      {/* Main Content */}
      <div className="container-app py-6 pb-24 lg:pb-6">
        {/* Facility Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Select Your Parking Slot
          </h1>
          <p className="text-muted-foreground">
            {facilityInfo?.name} • {facilityInfo?.address}
          </p>
        </div>

        {/* Responsive Layout - Single FloorLayoutVisualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6">
          {/* Floor Layout - Full width on mobile, 70% on desktop */}
          <div className="lg:col-span-8 order-3 lg:order-1">
            <div className="space-y-6">
              <FloorLayoutVisualization
                selectedFloor={selectedFloor}
                onFloorChange={setSelectedFloor}
                selectedSlot={selectedSlot}
                onSlotSelect={handleSlotSelect}
                vehicleType={selectedVehicle?.vehicleType}
                className="overflow-hidden"
              />

              {/* Alternative Suggestions */}
              {showAlternatives && (
                <AlternativeSlotSuggestions
                  selectedSlot={selectedSlot}
                  vehicleType={selectedVehicle?.vehicleType}
                  dateTime={selectedDateTime}
                  onSlotSelect={handleSlotSelect}
                />
              )}
            </div>
          </div>

          {/* Controls Column - Stack on mobile, sidebar on desktop */}
          <div className="lg:col-span-4 order-2 lg:order-2 space-y-3 lg:space-y-6">
            {/* Vehicle Selection */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <VehicleSelector
                selectedVehicle={selectedVehicle}
                onVehicleChange={handleVehicleChange}
                className="lg:p-0"
              />
            </div>

            {/* Date & Time */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-3 lg:p-4">
                <DateTimeSelector
                  selectedDateTime={selectedDateTime}
                  onDateTimeChange={handleDateTimeChange}
                  duration={duration}
                  onDurationChange={setDuration}
                />
              </div>
            </div>

            {/* Pricing - Show when slot selected */}
            {selectedSlot && (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <PricingCalculator
                  selectedSlot={selectedSlot}
                  vehicleType={selectedVehicle?.vehicleType}
                  duration={duration}
                  dateTime={selectedDateTime}
                  onPriceChange={handlePriceChange}
                />
              </div>
            )}

            {/* Slot Details Panel */}
            {selectedSlot && (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <SlotDetailsPanel
                  selectedSlot={selectedSlot}
                  vehicleInfo={selectedVehicle}
                  dateTime={selectedDateTime}
                  pricingInfo={pricingInfo}
                  onBookingToggle={handleBookingToggle}
                  isQuickBooking={isQuickBooking}
                  onProceedToPayment={handleProceedToPayment}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile-specific sections */}
        <div className="lg:hidden space-y-3 order-1">
          {/* Location Selection for Mobile when no location is selected */}
          {!selectedLocation && (
            <div className="bg-card border border-border rounded-lg p-3">
              <h3 className="font-semibold text-foreground mb-2 text-sm">Select Location</h3>
              <select
                onChange={(e) => handleLocationSelect(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                defaultValue=""
              >
                <option value="" disabled>Choose a location in Hyderabad</option>
                {hyderabadLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Location Info Mobile - Show when location is selected */}
          {(selectedLocation || facilityInfo?.name !== 'Select Location') && (
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="MapPin" size={14} className="text-primary flex-shrink-0" />
                <h3 className="font-medium text-foreground text-sm truncate">{selectedLocation?.name || facilityInfo?.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground truncate">{selectedLocation?.address || facilityInfo?.address}</p>
            </div>
          )}
        </div>

        


        {/* Mobile Bottom Action Bar - Enhanced */}
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-110 bg-card border-t border-border shadow-lg">
          <div className="p-4">
            {selectedSlot && selectedVehicle ? (
              <>
                {/* Quick Summary */}
                <div className="mb-3 text-center">
                  <div className="text-xs text-muted-foreground">
                    {selectedSlot.location} • {selectedLocation?.name || facilityInfo?.name}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {pricingInfo?.totalCost ? 
                      `₹${pricingInfo?.totalCost?.toFixed(0)}` 
                      : '₹50'} for {duration} hours
                  </div>
                </div>

                <button
                  onClick={() => {
                    console.log('=== MOBILE BOTTOM BUTTON CLICKED ===');
                    console.log('Selected Slot exists:', !!selectedSlot);
                    console.log('Selected Vehicle exists:', !!selectedVehicle);
                    console.log('Pricing Info exists:', !!pricingInfo);
                    console.log('Location exists:', !!selectedLocation);
                    
                    if (selectedSlot && selectedVehicle) {
                      console.log('All requirements met, calling handleProceedToPayment');
                      handleProceedToPayment();
                    } else {
                      const missingItems = [];
                      if (!selectedVehicle) missingItems.push('vehicle');
                      if (!selectedSlot) missingItems.push('parking slot');
                      
                      alert(`Please select: ${missingItems.join(' and ')} before proceeding.`);
                    }
                  }}
                  disabled={selectedSlot?.status === 'reserved'}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors touch-target"
                >
                  {selectedSlot?.status === 'reserved' ? 'Slot Unavailable' : 'Proceed to Payment'}
                </button>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="text-sm text-muted-foreground">
                  {!selectedLocation ? 'Select a location to continue' :
                   !selectedVehicle ? 'Select your vehicle type first' :
                   !selectedSlot ? 'Choose a parking slot' : 'Loading...'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Navigation */}
      <BottomTabNavigation />
      <BookingFloatingActions />
    </div>
  );
};

export default SlotSelectionBooking;
