import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import GlobalSearchHeader from '../../components/ui/GlobalSearchHeader';
import { useTheme } from '../../contexts/ThemeContext';
// Removed: import CitySelector from '../../components/ui/CitySelector';
// Removed unused lucide-react imports - using Icon component instead

// Mock data for parking areas by city
const cityParkingData = {
  hyderabad: [
    { id: 1, name: 'Gachibowli Arena', slots: 45, price: '₹8/hr', distance: '0.3 km' },
    { id: 2, name: 'Hitech City Hub', slots: 12, price: '₹6/hr', distance: '0.7 km' },
    { id: 3, name: 'Secunderabad Plaza', slots: 78, price: '₹10/hr', distance: '1.2 km' },
    { id: 4, name: 'Kukatpally Center', slots: 156, price: '₹5/hr', distance: '1.8 km' },
    { id: 5, name: 'Banjara Hills Parking', slots: 234, price: '₹15/hr', distance: '2.5 km' },
    { id: 6, name: 'HITEX Exhibition Center', slots: 23, price: '₹4/hr', distance: '3.1 km' },
    { id: 7, name: 'Lingampally Lot', slots: 50, price: '₹7/hr', distance: '3.5 km' },
    { id: 8, name: 'Begumpet Parking', slots: 60, price: '₹9/hr', distance: '4.0 km' }
  ],
  bangalore: [
    { id: 1, name: 'Koramangala Plaza', slots: 85, price: '₹12/hr', distance: '0.4 km', coordinates: { lat: 12.9352, lng: 77.6245 } },
    { id: 2, name: 'Indiranagar Hub', slots: 67, price: '₹10/hr', distance: '0.8 km', coordinates: { lat: 12.9784, lng: 77.6408 } },
    { id: 3, name: 'Whitefield Center', slots: 123, price: '₹8/hr', distance: '1.5 km', coordinates: { lat: 12.9698, lng: 77.7500 } },
    { id: 4, name: 'Electronic City Mall', slots: 189, price: '₹6/hr', distance: '2.1 km', coordinates: { lat: 12.8456, lng: 77.6603 } },
    { id: 5, name: 'BTM Layout Complex', slots: 98, price: '₹9/hr', distance: '1.7 km', coordinates: { lat: 12.9165, lng: 77.6101 } },
    { id: 6, name: 'MG Road Station', slots: 45, price: '₹15/hr', distance: '2.8 km', coordinates: { lat: 12.9759, lng: 77.6039 } },
    { id: 7, name: 'HSR Layout Center', slots: 76, price: '₹11/hr', distance: '2.3 km', coordinates: { lat: 12.9081, lng: 77.6476 } },
    { id: 8, name: 'Marathahalli Junction', slots: 134, price: '₹7/hr', distance: '3.0 km', coordinates: { lat: 12.9591, lng: 77.6974 } }
  ]
};

const cityPopularPlaces = {
  hyderabad: [
    { name: 'Hitech City', rating: 4.5, spots: 150, price: 8 },
    { name: 'Gachibowli', rating: 4.3, spots: 120, price: 6 },
    { name: 'Madhapur', rating: 4.2, spots: 180, price: 10 },
    { name: 'Jubilee Hills', rating: 4.6, spots: 90, price: 12 },
    { name: 'Banjara Hills', rating: 4.4, spots: 200, price: 15 },
    { name: 'Secunderabad', rating: 4.1, spots: 160, price: 7 },
    { name: 'Begumpet', rating: 4.0, spots: 110, price: 9 },
    { name: 'Kukatpally', rating: 4.3, spots: 140, price: 5 },
    { name: 'Kondapur', rating: 4.2, spots: 130, price: 8 },
    { name: 'Miyapur', rating: 4.1, spots: 100, price: 6 },
    { name: 'Ameerpet', rating: 4.5, spots: 170, price: 11 },
    { name: 'SR Nagar', rating: 4.0, spots: 95, price: 9 },
    { name: 'Punjagutta', rating: 4.3, spots: 125, price: 10 },
    { name: 'Somajiguda', rating: 4.4, spots: 145, price: 13 },
    { name: 'Abids', rating: 3.9, spots: 80, price: 7 },
    { name: 'Lakdikapul', rating: 4.1, spots: 105, price: 8 },
    { name: 'Mehdipatnam', rating: 4.0, spots: 115, price: 6 },
    { name: 'Tolichowki', rating: 4.2, spots: 135, price: 9 },
    { name: 'Manikonda', rating: 4.3, spots: 155, price: 7 },
    { name: 'Nanakramguda', rating: 4.1, spots: 120, price: 8 }
  ],
  bangalore: [
    { name: 'Koramangala', rating: 4.6, spots: 180, price: 12 },
    { name: 'Indiranagar', rating: 4.4, spots: 165, price: 10 },
    { name: 'Whitefield', rating: 4.3, spots: 210, price: 8 },
    { name: 'Electronic City', rating: 4.2, spots: 195, price: 6 },
    { name: 'BTM Layout', rating: 4.1, spots: 145, price: 9 },
    { name: 'Jayanagar', rating: 4.5, spots: 130, price: 11 },
    { name: 'MG Road', rating: 4.7, spots: 85, price: 15 },
    { name: 'HSR Layout', rating: 4.4, spots: 160, price: 11 },
    { name: 'Marathahalli', rating: 4.2, spots: 175, price: 7 },
    { name: 'Sarjapur Road', rating: 4.3, spots: 155, price: 8 },
    { name: 'Banashankari', rating: 4.1, spots: 125, price: 7 },
    { name: 'Rajajinagar', rating: 4.0, spots: 110, price: 8 },
    { name: 'Malleshwaram', rating: 4.3, spots: 120, price: 9 },
    { name: 'Basavanagudi', rating: 4.2, spots: 100, price: 8 },
    { name: 'Commercial Street', rating: 4.4, spots: 75, price: 14 },
    { name: 'Brigade Road', rating: 4.5, spots: 90, price: 13 },
    { name: 'UB City Mall', rating: 4.6, spots: 65, price: 16 },
    { name: 'Forum Mall', rating: 4.3, spots: 140, price: 10 },
    { name: 'Phoenix MarketCity', rating: 4.4, spots: 220, price: 9 },
    { name: 'Orion Mall', rating: 4.2, spots: 185, price: 8 }
  ]
};

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
          name: 'Downtown Mall Parking',
          address: '123 Main Street, Downtown',
          location: { lat: 40.7128, lng: -74.0060 }
        },
        slotLocation: '2nd Floor B Row 15th Parking Slot',
        vehicleType: 'Mahindra XUV700',
        vehicleImage: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000)?.toISOString(),
        duration: '4 Hours',
        totalAmount: 25.00,
        status: 'active',
        receiptUrl: '#'
      },
      {
        id: 'BK002',
        facility: {
          id: 'fac-002',
          name: 'City Airport Terminal 1',
          address: '456 Airport Blvd, Terminal 1',
          location: { lat: 40.6892, lng: -74.1745 }
        },
        slotLocation: '1st Floor A Row 8th Parking Slot',
        vehicleType: 'Honda Activa 6G',
        vehicleImage: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString(),
        endTime: new Date(Date.now() + 28 * 60 * 60 * 1000)?.toISOString(),
        duration: '4 Hours',
        totalAmount: 15.00,
        status: 'upcoming',
        receiptUrl: '#'
      }
    ];
  };

  const [selectedCity, setSelectedCity] = useState('hyderabad'); // Track selected city
  const [selectedArea, setSelectedArea] = useState(null);
  const [showAreaDetails, setShowAreaDetails] = useState(false);
  const [bookingsData, setBookingsData] = useState(getBookingsFromStorage());
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    if (!isAuthenticated || !userEmail) {
      navigate('/user-authentication');
      return;
    }

    setUser({
      email: userEmail,
      name: userName || 'User'
    });
  }, [navigate]);

  // Update bookings data in real-time
  useEffect(() => {
    const updateBookings = () => {
      const latestBookings = getBookingsFromStorage();
      setBookingsData(latestBookings);
    };

    // Check immediately
    updateBookings();

    // Listen for booking updates
    const handleBookingUpdate = () => {
      updateBookings();
    };

    // Set up event listeners for real-time updates
    window.addEventListener('bookingUpdate', handleBookingUpdate);
    window.addEventListener('storage', handleBookingUpdate);

    // Check for booking updates every 2 seconds
    const interval = setInterval(updateBookings, 2000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('bookingUpdate', handleBookingUpdate);
      window.removeEventListener('storage', handleBookingUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userVehicle');
    localStorage.removeItem('tempPassword');
    navigate('/user-authentication');
  };

  const handleCityChange = (cityValue) => {
    setSelectedCity(cityValue);
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setShowAreaDetails(true);
  };

  const handleQuickBook = (area) => {
    navigate('/location-search-map', {
      state: {
        selectedArea: area,
        quickBooking: true
      }
    });
  };

  const handlePlaceClick = (placeName) => {
    // Navigate to slot selection with the selected place
    // Create a facility info object for proper navigation
    const baseCoords = selectedCity === 'hyderabad' ? 
      { lat: 17.3850, lng: 78.4867 } : 
      { lat: 12.9716, lng: 77.5946 };

    const facilityInfo = {
      id: Date.now(),
      name: `${placeName} Parking Complex`,
      address: `${placeName}, ${selectedCity === 'hyderabad' ? 'Hyderabad' : 'Bangalore'}`,
      lat: baseCoords.lat + (Math.random() - 0.5) * 0.1,
      lng: baseCoords.lng + (Math.random() - 0.5) * 0.1,
      location: {
        lat: baseCoords.lat + (Math.random() - 0.5) * 0.1,
        lng: baseCoords.lng + (Math.random() - 0.5) * 0.1
      },
      rating: 4.2,
      reviews: 150,
      totalSlots: 200
    };

    console.log('Navigating with facility info:', facilityInfo); // Debug log

    navigate('/slot-selection-booking', {
      state: {
        facilityInfo: facilityInfo
      }
    });
  };

  // Get current city data
  const currentParkingAreas = cityParkingData[selectedCity] || cityParkingData.hyderabad;
  const currentPopularPlaces = cityPopularPlaces[selectedCity] || cityPopularPlaces.hyderabad;
  const cityDisplayName = selectedCity === 'hyderabad' ? 'Hyderabad' : 'Bangalore';

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 sm:pb-20 lg:pb-4">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-foreground truncate">ParkSlot Pro</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Find parking instantly</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="relative p-2 hover:bg-muted rounded-lg transition-colors group"
                title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              >
                <Icon 
                  name={theme === 'light' ? 'Sun' : 'Moon'} 
                  size={20} 
                  className="text-muted-foreground group-hover:text-foreground transition-colors" 
                />
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 hover:bg-muted rounded-lg transition-colors p-1.5"
                >
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} />
                  </div>
                  <span className="text-sm font-medium text-foreground hidden sm:block">Profile</span>
                  <Icon name="ChevronDown" size={16} className="text-muted-foreground hidden sm:block" />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate('/profile');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        <Icon name="User" size={16} />
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate('/profile');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        <Icon name="Settings" size={16} />
                        Settings
                      </button>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <Icon name="LogOut" size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 xl:w-96 border-r border-border bg-card overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Welcome Section */}
            <div className="flex-shrink-0 p-4 xl:p-6 border-b border-border">
              <div className="text-center">
                <div className="w-12 h-12 xl:w-16 xl:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 xl:mb-4">
                  <Icon name="User" size={24} className="xl:w-8 xl:h-8 text-primary" />
                </div>
                <h2 className="text-lg xl:text-xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h2>
                <p className="text-muted-foreground text-sm">Ready to find your perfect parking spot?</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-shrink-0 p-4 xl:p-6 border-b border-border">
              <h3 className="font-medium text-foreground mb-3 xl:mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3 xl:gap-4">
                <button
                  onClick={() => navigate('/my-bookings-dashboard', {
                    state: { initialTab: 'active' }
                  })}
                  className="card-container text-center p-2 sm:p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer min-h-[80px] flex flex-col justify-center"
                >
                  <div className="responsive-text-xl font-bold text-primary truncate">
                    {bookingsData?.filter(b => b?.status === 'active')?.length || 0}
                  </div>
                  <div className="responsive-text-xs text-muted-foreground truncate">Active Bookings</div>
                </button>
                <button
                  onClick={() => navigate('/my-bookings-dashboard', {
                    state: { initialTab: 'all' }
                  })}
                  className="card-container text-center p-2 sm:p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer min-h-[80px] flex flex-col justify-center"
                >
                  <div className="responsive-text-xl font-bold text-success truncate">
                    {bookingsData?.length || 0}
                  </div>
                  <div className="responsive-text-xs text-muted-foreground truncate">Total Bookings</div>
                </button>
              </div>
            </div>

            {/* My Bookings */}
            <div className="flex-1 p-4 xl:p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-3 xl:mb-4">
                <h3 className="font-medium text-foreground">My Bookings</h3>
                <button
                  onClick={() => navigate('/my-bookings-dashboard')}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2 xl:space-y-3">
                {bookingsData?.slice(0, 3)?.map((booking) => (
                  <button
                    key={booking?.id}
                    onClick={() => navigate('/my-bookings-dashboard')}
                    className="w-full text-left p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        booking?.status === 'active' ? 'bg-success' :
                        booking?.status === 'upcoming' ? 'bg-warning' :
                        'bg-muted-foreground'
                      }`}></div>
                      <div className="card-content">
                        <p className="responsive-text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {booking?.facility?.name}
                        </p>
                        <p className="responsive-text-xs text-muted-foreground truncate">
                          {booking?.slotLocation} • {booking?.vehicleType}
                          {booking?.actualVehicleType && ` (${booking.actualVehicleType === 'two-wheeler' ? 'Two-wheeler' : 'Four-wheeler'})`}
                        </p>
                        <p className="responsive-text-xs text-muted-foreground truncate">
                          {booking?.status === 'active' ? 'Active now' :
                           booking?.status === 'upcoming' ? 'Upcoming' :
                           'Completed'} • ${booking?.totalAmount}
                        </p>
                      </div>
                    </div>
                  </button>
                )) || (
                  <div className="text-center py-6 xl:py-8">
                    <Icon name="Calendar" size={40} className="xl:w-12 xl:h-12 text-muted-foreground mx-auto mb-3 xl:mb-4" />
                    <p className="text-muted-foreground text-sm">No bookings yet</p>
                    <p className="text-muted-foreground text-xs">Start booking to see your reservations here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto">
          {/* Welcome Message */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Welcome to ParkSlot Pro</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Your smart parking solution starts here</p>
            </div>

            {/* City Selector */}
            <div className="flex-shrink-0">
              <div className="bg-card border border-border rounded-lg p-4 min-w-[200px]">
                <h3 className="text-sm font-medium text-foreground mb-3">Select City</h3>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="hyderabad">Hyderabad</option>
                  <option value="bangalore">Bangalore</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Find Parking */}
            <button
              onClick={() => navigate('/location-search-map')}
              className="card-container group bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-md transition-all duration-200 hover:bg-card/80 focus-ring text-left w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Icon name="Search" size={20} className="md:w-6 md:h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">Find Parking</h3>
                  <p className="text-sm text-muted-foreground truncate">Search for available parking spots</p>
                </div>
              </div>
            </button>

            {/* Quick Book */}
            <button
              onClick={() => navigate('/slot-selection-booking')}
              className="card-container group bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-md transition-all duration-200 hover:bg-card/80 focus-ring text-left w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-warning/10 rounded-lg flex items-center justify-center group-hover:bg-warning/20 transition-colors flex-shrink-0">
                  <Icon name="Clock" size={20} className="md:w-6 md:h-6 text-warning" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-warning transition-colors truncate">Quick Book</h3>
                  <p className="text-sm text-muted-foreground truncate">Book a spot in your favorite location</p>
                </div>
              </div>
            </button>
          </div>

          {/* Nearby Parking Areas */}
          <div className="bg-card rounded-lg sm:rounded-xl shadow-lg border border-border p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Nearby Parking Locations</h3>
              <button
                onClick={() => navigate('/location-search-map')}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                View All
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {currentParkingAreas?.slice(0, 8)?.map((area) => (
                <button
                  key={area.id}
                  onClick={() => handlePlaceClick(area.name)}
                  className="w-full text-left p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon name="MapPin" size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{area.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{area.distance} away</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-success">{area.slots} slots</div>
                      <div className="text-sm font-semibold text-foreground">{area.price}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Places */}
          <div className="bg-card rounded-lg sm:rounded-xl shadow-lg border border-border p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Popular Places in {cityDisplayName}</h3>
              <button
                onClick={() => navigate('/location-search-map')}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                View All
              </button>
            </div>
            {/* Mobile: Single column layout */}
            <div className="block sm:hidden space-y-2 max-h-[300px] overflow-y-auto overscroll-y-contain" style={{WebkitOverflowScrolling: "touch"}}>
              {currentPopularPlaces?.slice(0, 10)?.map((place, index) => (
                <button
                  key={`${place.name}-${index}`}
                  onClick={() => handlePlaceClick(place.name)}
                  className="w-full text-left p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon name="MapPin" size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{place.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Icon name="Star" size={12} className="text-yellow-500" />
                            <span className="text-xs text-muted-foreground">{place.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-success font-medium">{place.spots} spots</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-primary">₹{place.price}/hr</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {/* Desktop: Grid layout */}
            <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 max-h-[300px] overflow-y-auto overscroll-y-contain" style={{WebkitOverflowScrolling: "touch"}}>
              {currentPopularPlaces?.slice(0, 20)?.map((place, index) => (
                <button
                  key={`${place.name}-${index}`}
                  onClick={() => handlePlaceClick(place.name)}
                  className="card-container text-left p-2 bg-muted rounded-lg min-h-[70px] flex items-center gap-2 hover:bg-muted/80 transition-colors"
                >
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="MapPin" size={12} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-foreground truncate">{place.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-success font-medium">
                        {place.spots}
                      </span>
                      <span className="text-xs text-primary">
                        ₹{place.price}/hr
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        
      </div>

      {/* Bottom Navigation */}
      <BottomTabNavigation />

      {/* Area Details Modal */}
      {showAreaDetails && selectedArea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">{selectedArea.name}</h3>
              <button
                onClick={() => setShowAreaDetails(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6">
              <div className="card-container flex items-center justify-between p-2 sm:p-3 bg-muted rounded-lg">
                <span className="responsive-text-sm text-muted-foreground truncate">Available Slots</span>
                <span className="responsive-text-sm font-semibold text-foreground flex-shrink-0 ml-2">{selectedArea.slots}</span>
              </div>
              <div className="card-container flex items-center justify-between p-2 sm:p-3 bg-muted rounded-lg">
                <span className="responsive-text-sm text-muted-foreground truncate">Price</span>
                <span className="responsive-text-sm font-semibold text-foreground flex-shrink-0 ml-2">{selectedArea.price}</span>
              </div>
              <div className="card-container flex items-center justify-between p-2 sm:p-3 bg-muted rounded-lg">
                <span className="responsive-text-sm text-muted-foreground truncate">Distance</span>
                <span className="responsive-text-sm font-semibold text-foreground flex-shrink-0 ml-2">{selectedArea.distance}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAreaDetails(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowAreaDetails(false);
                  navigate('/slot-selection-booking');
                }}
                className="flex-1"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;