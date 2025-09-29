import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import BookingCard from './components/BookingCard';
import QuickBookingWidget from './components/QuickBookingWidget';
import BookingTabs from './components/BookingTabs';
import EmptyState from './components/EmptyState';
import SearchAndFilter from './components/SearchAndFilter';
import EmergencyContact from './components/EmergencyContact';
import ExtendTimeModal from './components/ExtendTimeModal';
import CancellationModal from '../../components/ui/CancellationModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MyBookingsDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location?.state?.initialTab || 'active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedBookingForExtend, setSelectedBookingForExtend] = useState(null);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Get bookings from localStorage or use mock data
  const getBookingsFromStorage = () => {
    const storedBookings = localStorage.getItem('userBookings');
    if (storedBookings) {
      return JSON.parse(storedBookings);
    }
    return [
      {
        id: 'BK001',
        facility: {
          id: 'fac-001',
          name: 'Hitech City Hub',
          address: 'Financial District, Hitech City, Hyderabad',
          location: { lat: 17.4435, lng: 78.3772 }
        },
        slotLocation: '1st Floor A Row 13th Parking Slot',
        vehicleType: 'Honda Activa 6G',
        vehicleImage: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg',
        actualVehicleType: 'two-wheeler',
        vehicleCategory: 'Scooter',
        vehicle: {
          name: 'Honda Activa 6G',
          model: 'Activa 6G',
          category: 'Scooter',
          vehicleType: 'two-wheeler',
          image: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'
        },
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() + 8 * 60 * 60 * 1000)?.toISOString(),
        duration: '9 Hours',
        totalAmount: 43.20,
        status: 'active',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      },
      {
        id: 'BK002',
        facility: {
          id: 'fac-002',
          name: 'Gachibowli Arena',
          address: 'IT Hub, Gachibowli, Hyderabad',
          location: { lat: 17.4400, lng: 78.3482 }
        },
        slotLocation: '2nd Floor B Row 25th Parking Slot',
        vehicleType: 'Maruti Swift Dzire',
        vehicleImage: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg',
        actualVehicleType: 'four-wheeler',
        vehicleCategory: 'Sedan',
        vehicle: {
          name: 'Maruti Swift Dzire',
          model: 'Swift Dzire',
          category: 'Sedan',
          vehicleType: 'four-wheeler',
          image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg'
        },
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000)?.toISOString(),
        duration: '4 Hours',
        totalAmount: 28.50,
        status: 'upcoming',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      },
      {
        id: 'BK011',
        facility: {
          id: 'fac-011',
          name: 'Phoenix Mall Hyderabad',
          address: 'Banjara Hills, Hyderabad',
          location: { lat: 17.4123, lng: 78.4456 }
        },
        slotLocation: '3rd Floor C Row 18th Parking Slot',
        vehicleType: 'Honda City',
        vehicleImage: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg',
        actualVehicleType: 'four-wheeler',
        vehicleCategory: 'Sedan',
        vehicle: {
          name: 'Honda City',
          model: 'City',
          category: 'Sedan',
          vehicleType: 'four-wheeler',
          image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg'
        },
        startTime: new Date(Date.now() + 12 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() + 18 * 60 * 60 * 1000)?.toISOString(),
        duration: '6 Hours',
        totalAmount: 45.00,
        status: 'upcoming',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      },
      {
        id: 'BK012',
        facility: {
          id: 'fac-012',
          name: 'Inorbit Mall Hyderabad',
          address: 'HITEC City, Madhapur, Hyderabad',
          location: { lat: 17.4456, lng: 78.3731 }
        },
        slotLocation: 'Basement 1 A Row 12th Parking Slot',
        vehicleType: 'Yamaha FZ',
        vehicleImage: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg',
        actualVehicleType: 'two-wheeler',
        vehicleCategory: 'Sport Bike',
        vehicle: {
          name: 'Yamaha FZ',
          model: 'FZ v3.0',
          category: 'Sport Bike',
          vehicleType: 'two-wheeler',
          image: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'
        },
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() + 28 * 60 * 60 * 1000)?.toISOString(),
        duration: '4 Hours',
        totalAmount: 20.00,
        status: 'upcoming',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      },
      {
        id: 'BK003',
        facility: {
          id: 'fac-003',
          name: 'Grand Hotel Parking',
          address: '789 Luxury Ave, Hotel District',
          location: { lat: 40.7589, lng: -73.9851 }
        },
        slotLocation: 'Ground Floor Premium Section A5',
        vehicleType: 'BMW X3',
        vehicleImage: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
        actualVehicleType: 'four-wheeler',
        vehicleCategory: 'SUV',
        vehicle: {
          name: 'BMW X3',
          model: 'X3',
          category: 'Luxury SUV',
          vehicleType: 'four-wheeler',
          image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg'
        },
        startTime: new Date(Date.now() - 72 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() - 60 * 60 * 60 * 1000)?.toISOString(),
        duration: '12 Hours',
        totalAmount: 85.00,
        status: 'completed',
        rated: false,
        createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      },
      {
        id: 'BK004',
        facility: {
          id: 'fac-004',
          name: 'Airport Terminal 2 Parking',
          address: '321 Airport Way, Terminal 2',
          location: { lat: 40.6413, lng: -73.7781 }
        },
        slotLocation: '3rd Floor Long Stay C Row 45th',
        vehicleType: 'Hyundai Creta',
        vehicleImage: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
        actualVehicleType: 'four-wheeler',
        vehicleCategory: 'Compact SUV',
        vehicle: {
          name: 'Hyundai Creta',
          model: 'Creta',
          category: 'Compact SUV',
          vehicleType: 'four-wheeler',
          image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg'
        },
        startTime: new Date(Date.now() + 48 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() + 120 * 60 * 60 * 1000)?.toISOString(),
        duration: '72 Hours',
        totalAmount: 180.00,
        status: 'upcoming',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      },
      {
        id: 'BK005',
        facility: {
          id: 'fac-005',
          name: 'Metro Station Parking',
          address: '654 Metro Plaza, Transport Hub',
          location: { lat: 40.7306, lng: -73.9352 }
        },
        slotLocation: 'Level 1 Two Wheeler Zone T12',
        vehicleType: 'Yamaha R15 V4',
        vehicleImage: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg',
        actualVehicleType: 'two-wheeler',
        vehicleCategory: 'Sport Bike',
        vehicle: {
          name: 'Yamaha R15 V4',
          model: 'R15 V4',
          category: 'Sport Bike',
          vehicleType: 'two-wheeler',
          image: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'
        },
        startTime: new Date(Date.now() - 120 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() - 114 * 60 * 60 * 1000)?.toISOString(),
        duration: '6 Hours',
        totalAmount: 18.00,
        status: 'completed',
        rated: true,
        createdAt: new Date(Date.now() - 144 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      },
      {
        id: 'BK006',
        facility: {
          id: 'fac-006',
          name: 'Office Complex Parking',
          address: '987 Corporate Square, Business Bay',
          location: { lat: 40.7614, lng: -73.9776 }
        },
        slotLocation: 'Basement 2 Reserved Slot R-08',
        vehicleType: 'Tesla Model 3',
        vehicleImage: 'https://images.pexels.com/photos/193991/pexels-photo-193991.jpeg',
        actualVehicleType: 'four-wheeler',
        vehicleCategory: 'Electric Sedan',
        vehicle: {
          name: 'Tesla Model 3',
          model: 'Model 3',
          category: 'Electric Sedan',
          vehicleType: 'four-wheeler',
          image: 'https://images.pexels.com/photos/193991/pexels-photo-193991.jpeg'
        },
        startTime: new Date(Date.now() - 168 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() - 160 * 60 * 60 * 1000)?.toISOString(),
        duration: '8 Hours',
        totalAmount: 55.00,
        status: 'completed',
        rated: true,
        createdAt: new Date(Date.now() - 192 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      },
      {
        id: 'BK007',
        facility: {
          id: 'fac-007',
          name: 'Stadium Event Parking',
          address: '555 Sports Complex Dr, Arena District',
          location: { lat: 40.7505, lng: -73.9934 }
        },
        slotLocation: 'Outdoor Lot Section E Row 15',
        vehicleType: 'Royal Enfield Classic',
        vehicleImage: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg',
        actualVehicleType: 'two-wheeler',
        vehicleCategory: 'Cruiser',
        vehicle: {
          name: 'Royal Enfield Classic',
          model: 'Classic 350',
          category: 'Cruiser',
          vehicleType: 'two-wheeler',
          image: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'
        },
        startTime: new Date(Date.now() - 240 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() - 235 * 60 * 60 * 1000)?.toISOString(),
        duration: '5 Hours',
        totalAmount: 22.50,
        status: 'completed',
        rated: false,
        createdAt: new Date(Date.now() - 264 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      },
      {
        id: 'BK008',
        facility: {
          id: 'fac-008',
          name: 'Hospital Emergency Parking',
          address: '333 Medical Center Rd, Health District',
          location: { lat: 40.7831, lng: -73.9712 }
        },
        slotLocation: 'Emergency Zone Quick Access A1',
        vehicleType: 'Honda City',
        vehicleImage: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg',
        actualVehicleType: 'four-wheeler',
        vehicleCategory: 'Sedan',
        vehicle: {
          name: 'Honda City',
          model: 'City',
          category: 'Sedan',
          vehicleType: 'four-wheeler',
          image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg'
        },
        startTime: new Date(Date.now() - 312 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() - 309 * 60 * 60 * 1000)?.toISOString(),
        duration: '3 Hours',
        totalAmount: 35.00,
        status: 'completed',
        rated: true,
        createdAt: new Date(Date.now() - 336 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      },
      {
        id: 'BK009',
        facility: {
          id: 'fac-009',
          name: 'Koramangala Mall Parking',
          address: 'Forum Mall, Koramangala, Bangalore',
          location: { lat: 12.9352, lng: 77.6245 }
        },
        slotLocation: '2nd Floor Mall Parking B12',
        vehicleType: 'TVS Apache RTR 160',
        vehicleImage: '/attached_assets/tvs_apache_black.jpg',
        actualVehicleType: 'two-wheeler',
        vehicleCategory: 'Sport Bike',
        vehicle: {
          name: 'TVS Apache RTR 160',
          model: 'Apache RTR 160',
          category: 'Sport Bike',
          vehicleType: 'two-wheeler',
          image: '/attached_assets/tvs_apache_black.jpg'
        },
        startTime: new Date(Date.now() - 48 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() - 44 * 60 * 60 * 1000)?.toISOString(),
        duration: '4 Hours',
        totalAmount: 25.60,
        status: 'completed',
        rated: false,
        createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      },
      {
        id: 'BK010',
        facility: {
          id: 'fac-010',
          name: 'Whitefield Tech Park',
          address: 'ITPL Main Road, Whitefield, Bangalore',
          location: { lat: 12.9698, lng: 77.7500 }
        },
        slotLocation: 'Basement 1 Corporate Zone C25',
        vehicleType: 'Maruti Baleno',
        vehicleImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
        actualVehicleType: 'four-wheeler',
        vehicleCategory: 'Hatchback',
        vehicle: {
          name: 'Maruti Baleno',
          model: 'Baleno',
          category: 'Hatchback',
          vehicleType: 'four-wheeler',
          image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop'
        },
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() + 32 * 60 * 60 * 1000)?.toISOString(),
        duration: '8 Hours',
        totalAmount: 95.00,
        status: 'upcoming',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)?.toISOString(),
        receiptUrl: '#'
      }
    ];
  };

  const [bookings, setBookings] = useState(getBookingsFromStorage());

  // Check for new bookings from localStorage
  useEffect(() => {
    const checkForNewBookings = () => {
      const storedBookings = localStorage.getItem('userBookings');
      if (storedBookings) {
        const newBookings = JSON.parse(storedBookings);
        setBookings(newBookings);
      }
    };

    // Check immediately
    checkForNewBookings();

    // Listen for booking updates
    const handleBookingUpdate = () => {
      checkForNewBookings();
    };

    // Set up event listener for real-time updates
    window.addEventListener('bookingUpdate', handleBookingUpdate);
    window.addEventListener('storage', handleBookingUpdate);

    // Set up interval to check for new bookings
    const interval = setInterval(checkForNewBookings, 2000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('bookingUpdate', handleBookingUpdate);
      window.removeEventListener('storage', handleBookingUpdate);
    };
  }, []);

  // Handle initial tab and new booking highlighting
  useEffect(() => {
    if (location?.state?.newBookingId) {
      // Highlight the new booking only when first visiting the page
      const isFirstVisit = sessionStorage.getItem(`highlighted-${location.state.newBookingId}`) !== 'true';
      if (isFirstVisit) {
        setTimeout(() => {
          const bookingElement = document.getElementById(`booking-${location.state.newBookingId}`);
          if (bookingElement) {
            bookingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            bookingElement.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            sessionStorage.setItem(`highlighted-${location.state.newBookingId}`, 'true');
            setTimeout(() => {
              bookingElement.style.backgroundColor = '';
            }, 3000);
          }
        }, 500);
      }
    }
  }, [location?.state?.newBookingId]);

  // Filter bookings based on active tab
  const getBookingsByStatus = (status) => {
    // First apply status filter to all bookings
    let statusFilteredBookings;
    if (status === 'all') {
      statusFilteredBookings = bookings;
    } else {
      statusFilteredBookings = bookings?.filter(booking => booking?.status === status) || [];
    }

    // Then apply search and other filters to status-filtered bookings
    let finalBookings = [...statusFilteredBookings];

    // Apply search filter
    if (searchQuery) {
      finalBookings = finalBookings?.filter(booking =>
        booking?.facility?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        booking?.id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        booking?.slotLocation?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply facility filter (IMPORTANT: was missing in previous version)
    if (filters?.facility) {
      finalBookings = finalBookings?.filter(booking =>
        booking?.facility?.id === filters?.facility
      );
    }

    // Apply location filter
    if (filters?.location) {
      finalBookings = finalBookings?.filter(booking => {
        const facilityAddress = booking?.facility?.address?.toLowerCase() || '';
        const facilityName = booking?.facility?.name?.toLowerCase() || '';
        const locationFilter = filters?.location?.toLowerCase();
        
        if (locationFilter === 'hyderabad') {
          return facilityAddress.includes('hyderabad') || facilityName.includes('hyderabad') ||
                 facilityAddress.includes('hitech') || facilityAddress.includes('gachibowli') ||
                 facilityAddress.includes('jubilee') || facilityAddress.includes('banjara') ||
                 facilityAddress.includes('secunderabad') || facilityAddress.includes('begumpet') ||
                 facilityAddress.includes('kukatpally') || facilityAddress.includes('kondapur') ||
                 facilityAddress.includes('miyapur') || facilityAddress.includes('ameerpet') ||
                 facilityAddress.includes('madhapur') || facilityAddress.includes('financial district') ||
                 facilityName.includes('hitech') || facilityName.includes('gachibowli');
        } else if (locationFilter === 'bangalore') {
          return facilityAddress.includes('bangalore') || facilityName.includes('bangalore') ||
                 facilityAddress.includes('bengaluru') || facilityName.includes('bengaluru') ||
                 facilityAddress.includes('koramangala') || facilityAddress.includes('whitefield') ||
                 facilityAddress.includes('electronic city') || facilityAddress.includes('indiranagar') ||
                 facilityAddress.includes('btm') || facilityAddress.includes('jayanagar') ||
                 facilityAddress.includes('marathahalli') || facilityAddress.includes('sarjapur') ||
                 facilityAddress.includes('itpl') || facilityName.includes('koramangala') ||
                 facilityName.includes('whitefield');
        } else if (locationFilter === 'delhi') {
          return facilityAddress.includes('delhi') || facilityName.includes('delhi') ||
                 facilityAddress.includes('new delhi') || facilityAddress.includes('connaught') ||
                 facilityAddress.includes('karol bagh') || facilityAddress.includes('lajpat') ||
                 facilityAddress.includes('chandni chowk') || facilityAddress.includes('india gate');
        } else if (locationFilter === 'mumbai') {
          return facilityAddress.includes('mumbai') || facilityName.includes('mumbai') ||
                 facilityAddress.includes('bandra') || facilityAddress.includes('andheri') ||
                 facilityAddress.includes('powai') || facilityAddress.includes('colaba') ||
                 facilityAddress.includes('worli');
        }
        return false;
      });
    }

    // Apply vehicle type filter
    if (filters?.vehicleType) {
      finalBookings = finalBookings?.filter(booking =>
        booking?.actualVehicleType?.toLowerCase() === filters?.vehicleType?.toLowerCase() ||
        booking?.vehicleType?.toLowerCase().includes(filters?.vehicleType?.toLowerCase())
      );
    }

    // Apply date range filter
    if (filters?.dateRange) {
      const now = new Date();
      finalBookings = finalBookings?.filter(booking => {
        const bookingDate = new Date(booking.startTime);
        switch (filters?.dateRange) {
          case 'today':
            return bookingDate?.toDateString() === now?.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return bookingDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return bookingDate >= monthAgo;
          case 'quarter':
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            return bookingDate >= quarterAgo;
          default:
            return true;
        }
      });
    }

    return finalBookings;
  };

  // Get booking counts for tabs (use all bookings, not filtered)
  const bookingCounts = {
    active: bookings?.filter(b => b?.status === 'active')?.length || 0,
    upcoming: bookings?.filter(b => b?.status === 'upcoming')?.length || 0,
    completed: bookings?.filter(b => b?.status === 'completed')?.length || 0
  };

  // Get booking counts for tabs (use all bookings, not filtered)

  // Handle search - just update state, useMemo will handle the filtering
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle filters - just update state, useMemo will handle the filtering  
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({});
  };

  // Pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Booking actions
  const handleExtendBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      // Store current scroll position
      sessionStorage.setItem('bookingScrollPosition', window.scrollY.toString());
      setSelectedBookingForExtend(booking);
      setExtendModalOpen(true);
    }
  };

  const handleSaveExtension = async (updatedBooking) => {
    try {
      // Update the booking in state
      const updatedBookings = bookings.map(booking =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      );
      
      setBookings(updatedBookings);
      
      // Update localStorage
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      
      // Trigger storage event for real-time updates
      window.dispatchEvent(new Event('bookingUpdate'));
      
      // Close modal and restore scroll position
      setExtendModalOpen(false);
      setSelectedBookingForExtend(null);
      
      // Restore scroll position
      setTimeout(() => {
        const scrollPosition = sessionStorage.getItem('bookingScrollPosition');
        if (scrollPosition) {
          window.scrollTo(0, parseInt(scrollPosition));
          sessionStorage.removeItem('bookingScrollPosition');
        }
      }, 100);
      
      // Show success message
      alert('Booking extended successfully!');
    } catch (error) {
      console.error('Error saving extension:', error);
      throw error;
    }
  };

  const handleCancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    setSelectedBookingForCancel(booking);
    setShowCancellationModal(true);
  };

  const confirmCancellation = async () => {
    if (!selectedBookingForCancel) return;
    
    setIsCancelling(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove the booking from the list (delete it completely)
    const updatedBookings = bookings.filter(booking => booking.id !== selectedBookingForCancel.id);
    
    // Update state
    setBookings(updatedBookings);
    
    // Update localStorage
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new Event('bookingUpdate'));
    
    // Close modal and reset state
    setIsCancelling(false);
    setShowCancellationModal(false);
    setSelectedBookingForCancel(null);
  };

  const handleRateBooking = (bookingId) => {
    alert(`Rating booking ${bookingId}`);
    setBookings(prev => prev?.map(booking =>
      booking?.id === bookingId
        ? { ...booking, rated: true }
        : booking
    ));
  };

  // Enhanced tab change handler with state reset
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    
    // Clear and reset filters when switching tabs to ensure clean state
    if (newTab !== activeTab) {
      setSearchQuery('');
      setFilters({});
    }
  };

  // Memoized current bookings calculation to ensure it updates when activeTab changes
  const currentBookings = useMemo(() => {
    return getBookingsByStatus(activeTab);
  }, [activeTab, bookings, filters, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container-app px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Back to Home"
              >
                <Icon name="ArrowLeft" size={20} className="text-foreground" />
              </button>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center lg:hidden">
                <Icon name="Calendar" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">My Bookings</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Manage your parking reservations</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                iconName={isRefreshing ? "Loader2" : "RefreshCw"}
                className={isRefreshing ? "animate-spin" : ""}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/location-search-map')}
                iconName="Plus"
                iconPosition="left"
                className="hidden sm:flex"
              >
                New Booking
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="container-app py-4 sm:py-6 pb-20 lg:pb-6 px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4 sm:space-y-6">
            {/* Quick Booking Widget */}
            <QuickBookingWidget />

            {/* Search and Filter */}
            <SearchAndFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
              onClearFilters={handleClearFilters}
            />

            {/* Booking Tabs */}
            <BookingTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              bookingCounts={bookingCounts}
            />

            {/* Bookings List */}
            <div className="space-y-4">
              {currentBookings && currentBookings.length > 0 ? (
                currentBookings.map((booking) => (
                  <BookingCard
                    key={`${booking?.id}-${activeTab}`}
                    booking={booking}
                    onExtend={handleExtendBooking}
                    onCancel={handleCancelBooking}
                    onRate={handleRateBooking}
                  />
                ))
              ) : (
                <EmptyState type={activeTab} />
              )}
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-4 lg:space-y-6">
            {/* Emergency Contact */}
            <EmergencyContact />

            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Bookings</span>
                  <span className="font-medium text-foreground">{bookings?.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-medium text-foreground">
                    ${bookings?.reduce((sum, b) => sum + b?.totalAmount, 0)?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg. Duration</span>
                  <span className="font-medium text-foreground">4.5 hours</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Booking confirmed</p>
                    <p className="text-xs text-muted-foreground">Downtown Mall - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Payment processed</p>
                    <p className="text-xs text-muted-foreground">$25.00 - 3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Slot reserved</p>
                    <p className="text-xs text-muted-foreground">Airport Terminal - 1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <BottomTabNavigation />

      {/* Extend Time Modal */}
      <ExtendTimeModal
        isOpen={extendModalOpen}
        onClose={() => {
          setExtendModalOpen(false);
          setSelectedBookingForExtend(null);
        }}
        booking={selectedBookingForExtend}
        onSave={handleSaveExtension}
      />

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={showCancellationModal}
        onClose={() => {
          setShowCancellationModal(false);
          setSelectedBookingForCancel(null);
        }}
        onConfirm={confirmCancellation}
        booking={selectedBookingForCancel}
        isProcessing={isCancelling}
      />
    </div>
  );
};

export default MyBookingsDashboard;
