import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalSearchHeader from '../../components/ui/GlobalSearchHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import BookingFloatingActions from '../../components/ui/BookingFloatingActions';
import SearchFilters from './components/SearchFilters';
import FacilityList from './components/FacilityList';

const LocationSearchMap = () => {
  const location = useLocation();
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Import the cities array to get the full city object with areas
  const cities = [
    {
      value: 'hyderabad',
      label: 'Hyderabad',
      coordinates: { lat: 17.3850, lng: 78.4867 },
      icon: 'MapPin',
      areas: [
        { name: 'Hitech City', coordinates: { lat: 17.4435, lng: 78.3772 } },
        { name: 'Gachibowli', coordinates: { lat: 17.4400, lng: 78.3482 } },
        { name: 'Madhapur', coordinates: { lat: 17.4481, lng: 78.3915 } },
        { name: 'Jubilee Hills', coordinates: { lat: 17.4305, lng: 78.4059 } },
        { name: 'Banjara Hills', coordinates: { lat: 17.4123, lng: 78.4439 } },
        { name: 'Secunderabad', coordinates: { lat: 17.5040, lng: 78.5440 } },
        { name: 'Begumpet', coordinates: { lat: 17.4520, lng: 78.4636 } },
        { name: 'Kukatpally', coordinates: { lat: 17.4840, lng: 78.4071 } },
        { name: 'Kondapur', coordinates: { lat: 17.4615, lng: 78.3677 } },
        { name: 'Miyapur', coordinates: { lat: 17.4953, lng: 78.3584 } },
        { name: 'Ameerpet', coordinates: { lat: 17.4369, lng: 78.4482 } },
        { name: 'Somajiguda', coordinates: { lat: 17.4195, lng: 78.4547 } },
        { name: 'Abids', coordinates: { lat: 17.3907, lng: 78.4865 } },
        { name: 'Koti', coordinates: { lat: 17.3748, lng: 78.4849 } },
        { name: 'Dilsukhnagar', coordinates: { lat: 17.3688, lng: 78.5246 } },
        { name: 'LB Nagar', coordinates: { lat: 17.3421, lng: 78.5515 } },
        { name: 'Uppal', coordinates: { lat: 17.4062, lng: 78.5562 } },
        { name: 'Kompally', coordinates: { lat: 17.5454, lng: 78.4897 } },
        { name: 'Nizampet', coordinates: { lat: 17.5063, lng: 78.3959 } },
        { name: 'Bachupally', coordinates: { lat: 17.5373, lng: 78.3664 } },
        { name: 'Madinaguda', coordinates: { lat: 17.4984, lng: 78.3896 } },
        { name: 'Chandanagar', coordinates: { lat: 17.4953, lng: 78.3424 } },
        { name: 'Charminar', coordinates: { lat: 17.3616, lng: 78.4747 } },
        { name: 'Tolichowki', coordinates: { lat: 17.4108, lng: 78.4167 } },
        { name: 'Mehdipatnam', coordinates: { lat: 17.4048, lng: 78.4343 } },
        { name: 'Lakdikapul', coordinates: { lat: 17.4072, lng: 78.4620 } },
        { name: 'Nampally', coordinates: { lat: 17.3830, lng: 78.4731 } },
        { name: 'Malakpet', coordinates: { lat: 17.3831, lng: 78.5073 } },
        { name: 'Tarnaka', coordinates: { lat: 17.4203, lng: 78.5382 } },
        { name: 'Habsiguda', coordinates: { lat: 17.4286, lng: 78.5489 } }
      ]
    },
    {
      value: 'bengaluru',
      label: 'Bengaluru',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      icon: 'MapPin',
      areas: [
        { name: 'Koramangala', coordinates: { lat: 12.9352, lng: 77.6245 } },
        { name: 'Indiranagar', coordinates: { lat: 12.9784, lng: 77.6408 } },
        { name: 'Whitefield', coordinates: { lat: 12.9698, lng: 77.7500 } },
        { name: 'Electronic City', coordinates: { lat: 12.8456, lng: 77.6603 } },
        { name: 'BTM Layout', coordinates: { lat: 12.9165, lng: 77.6101 } },
        { name: 'Jayanagar', coordinates: { lat: 12.9237, lng: 77.5828 } },
        { name: 'MG Road', coordinates: { lat: 12.9759, lng: 77.6039 } },
        { name: 'HSR Layout', coordinates: { lat: 12.9081, lng: 77.6476 } },
        { name: 'Marathahalli', coordinates: { lat: 12.9591, lng: 77.6974 } },
        { name: 'Sarjapur Road', coordinates: { lat: 12.9010, lng: 77.6874 } },
        { name: 'Banashankari', coordinates: { lat: 12.9250, lng: 77.5678 } },
        { name: 'Rajajinagar', coordinates: { lat: 12.9916, lng: 77.5554 } },
        { name: 'Malleshwaram', coordinates: { lat: 12.9940, lng: 77.5746 } },
        { name: 'Basavanagudi', coordinates: { lat: 12.9420, lng: 77.5737 } },
        { name: 'JP Nagar', coordinates: { lat: 12.9082, lng: 77.5854 } },
        { name: 'Bannerghatta Road', coordinates: { lat: 12.8886, lng: 77.6006 } },
        { name: 'Silk Board', coordinates: { lat: 12.9178, lng: 77.6226 } },
        { name: 'Domlur', coordinates: { lat: 12.9609, lng: 77.6389 } },
        { name: 'CV Raman Nagar', coordinates: { lat: 12.9786, lng: 77.6630 } },
        { name: 'Banaswadi', coordinates: { lat: 13.0116, lng: 77.6533 } },
        { name: 'Hebbal', coordinates: { lat: 13.0358, lng: 77.5970 } },
        { name: 'Yeshwantpur', coordinates: { lat: 13.0284, lng: 77.5547 } },
        { name: 'Peenya', coordinates: { lat: 13.0297, lng: 77.5208 } },
        { name: 'Vijayanagar', coordinates: { lat: 12.9716, lng: 77.5370 } },
        { name: 'Cunningham Road', coordinates: { lat: 12.9876, lng: 77.5934 } },
        { name: 'Commercial Street', coordinates: { lat: 12.9837, lng: 77.6082 } },
        { name: 'Brigade Road', coordinates: { lat: 12.9734, lng: 77.6079 } },
        { name: 'Richmond Road', coordinates: { lat: 12.9590, lng: 77.6008 } },
        { name: 'Residency Road', coordinates: { lat: 12.9658, lng: 77.6067 } },
        { name: 'Ulsoor', coordinates: { lat: 12.9810, lng: 77.6207 } }
      ]
    }
  ];

  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    vehicleType: 'all',
    priceRange: 'all',
    distance: '5',
    amenities: []
  });

  // Generate realistic parking facilities based on selected city (show only 8 initially)
  const generateCityFacilities = (city, showAll = false) => {
    if (!city?.areas) return [];

    const facilityTypes = ['Mall', 'Plaza', 'Tower', 'Complex', 'Center', 'Hub', 'Park', 'Gate'];
    const amenityOptions = ['covered', 'security', 'ev_charging', 'valet', 'handicap'];

    const areasToShow = showAll ? city.areas : city.areas.slice(0, 8);

    return areasToShow.map((area, index) => ({
      id: index + 1,
      name: `${area.name} ${facilityTypes[index % facilityTypes.length]}`,
      address: `${area.name}, ${city.label}`,
      image: `https://images.unsplash.com/photo-${1506905925346 + index}?w=400&h=300&fit=crop`,
      distance: Math.round((Math.random() * 4 + 0.5) * 10) / 10,
      hourlyRate: Math.floor(Math.random() * 15) + 5,
      originalRate: Math.floor(Math.random() * 10) + 20,
      availableSlots: Math.floor(Math.random() * 200) + 10,
      totalSlots: Math.floor(Math.random() * 300) + 50,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 500) + 50,
      amenities: amenityOptions.slice(0, Math.floor(Math.random() * 3) + 1),
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 25) + 10 : null,
      coordinates: {
        lat: area.coordinates.lat + (Math.random() - 0.5) * 0.01,
        lng: area.coordinates.lng + (Math.random() - 0.5) * 0.01
      },
      area: area.name
    }));
  };

  // Helper function to generate facilities for a specific area
  const generateAreaSpecificFacilities = (area, city) => {
    const facilityTypes = ['Mall', 'Plaza', 'Tower', 'Complex', 'Center', 'Hub', 'Park', 'Gate'];
    const amenityOptions = ['covered', 'security', 'ev_charging', 'valet', 'handicap'];

    return [{
      id: Math.floor(Math.random() * 1000),
      name: `${area.name} ${facilityTypes[Math.floor(Math.random() * facilityTypes.length)]}`,
      address: `${area.name}, ${city.label}`,
      image: `https://images.unsplash.com/photo-${1506905925346 + Math.floor(Math.random() * 10)}?w=400&h=300&fit=crop`,
      distance: Math.round((Math.random() * 4 + 0.5) * 10) / 10,
      hourlyRate: Math.floor(Math.random() * 15) + 5,
      originalRate: Math.floor(Math.random() * 10) + 20,
      availableSlots: Math.floor(Math.random() * 200) + 10,
      totalSlots: Math.floor(Math.random() * 300) + 50,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 500) + 50,
      amenities: amenityOptions.slice(0, Math.floor(Math.random() * 3) + 1),
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 25) + 10 : null,
      coordinates: {
        lat: area.coordinates.lat + (Math.random() - 0.5) * 0.01,
        lng: area.coordinates.lng + (Math.random() - 0.5) * 0.01
      },
      area: area.name
    }];
  };

  const [facilities, setFacilities] = useState(() => generateCityFacilities(selectedCity));

  // Initialize user location from navigation state or get current location
  useEffect(() => {
    if (location?.state?.userLocation) {
      setUserLocation(location?.state?.userLocation);
    } else if (location?.state?.searchNearby) {
      // Auto-request location for nearby search
      if (navigator.geolocation) {
        navigator.geolocation?.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position?.coords?.latitude,
              lng: position?.coords?.longitude
            });
          },
          (error) => {
            console.error('Location access denied:', error);
          }
        );
      }
    }
  }, [location?.state]);

  const handleLocationSearch = (query) => {
    setLoading(true);

    // Simulate search API call
    setTimeout(() => {
      if (typeof query === 'object' && query?.lat && query?.lng) {
        // Location coordinates provided
        setUserLocation(query);
      } else {
        // Text search - find matching area and generate facilities for that area
        const searchTerm = query.toLowerCase();
        const matchingArea = selectedCity?.areas?.find(area => 
          area.name.toLowerCase().includes(searchTerm)
        );

        if (matchingArea) {
          // Generate facilities specifically for the searched area
          const areaFacilities = generateAreaSpecificFacilities(matchingArea, selectedCity);
          setFacilities(areaFacilities);
          // Center map on the searched area
          setUserLocation(matchingArea.coordinates);
        } else {
          // If no specific area found, search all areas and generate comprehensive results
          const matchingAreas = selectedCity?.areas?.filter(area =>
            area.name.toLowerCase().includes(searchTerm)
          );

          if (matchingAreas && matchingAreas.length > 0) {
            // Generate facilities for all matching areas
            const allMatchingFacilities = matchingAreas.flatMap(area => 
              generateAreaSpecificFacilities(area, selectedCity)
            );
            setFacilities(allMatchingFacilities);
            // Center on first matching area
            setUserLocation(matchingAreas[0].coordinates);
          } else {
            // Fallback: regenerate all facilities and filter by search term
            const allFacilities = generateCityFacilities(selectedCity);
            const searchResults = allFacilities.filter(facility =>
              facility.name.toLowerCase().includes(searchTerm) ||
              facility.address.toLowerCase().includes(searchTerm) ||
              facility.area.toLowerCase().includes(searchTerm)
            );
            setFacilities(searchResults.length > 0 ? searchResults : allFacilities);
          }
        }

        console.log('Searching for:', query);
      }
      setLoading(false);
    }, 1000);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Apply filters to facilities list
  };

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate refresh API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  const handleSortChange = (sortBy) => {
    // Sorting is handled in FacilityList component
    console.log('Sort by:', sortBy);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setSelectedPlace(null); // Clear selected place when city changes
    setUserLocation(null); // Clear user location when city changes
    setFacilities(generateCityFacilities(city)); // Generate new facilities for selected city
  };

  const handlePlaceChange = (place) => {
    setSelectedPlace(place);
    if (place) {
      // Generate facilities for the selected place
      const areaFacilities = generateAreaSpecificFacilities(place, selectedCity);
      setFacilities(areaFacilities);
      // Center map on the selected place
      setUserLocation(place.coordinates);
    } else {
      // Show all facilities for the city
      setFacilities(generateCityFacilities(selectedCity));
      setUserLocation(null);
    }
  };

  const filteredFacilities = facilities?.filter(facility => {
    // Apply filters
    if (filters?.vehicleType !== 'all') {
      // Vehicle type filtering logic would go here
    }

    if (filters?.priceRange !== 'all') {
      const [min, max] = filters?.priceRange?.split('-')?.map(Number);
      if (max) {
        if (facility?.hourlyRate < min || facility?.hourlyRate > max) return false;
      } else if (filters?.priceRange === '15+') {
        if (facility?.hourlyRate < 15) return false;
      }
    }

    if (filters?.distance) {
      const maxDistance = parseFloat(filters?.distance);
      if (facility?.distance > maxDistance) return false;
    }

    if (filters?.amenities && filters?.amenities?.length > 0) {
      const hasRequiredAmenities = filters?.amenities?.every(amenity => 
        facility?.amenities?.includes(amenity)
      );
      if (!hasRequiredAmenities) return false;
    }

    return true;
  });

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <GlobalSearchHeader 
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          onLocationSearch={handleLocationSearch}
        />
      </div>

      {/* Search Filters */}
      <div className="border-b border-border flex-shrink-0">
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onLocationSearch={handleLocationSearch}
          className="border-0 rounded-none py-2"
        />
      </div>

      {/* Main Content - Full Width Facility List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <FacilityList
            facilities={filteredFacilities}
            loading={loading}
            onRefresh={handleRefresh}
            onSortChange={handleSortChange}
            selectedCity={selectedCity}
            selectedPlace={selectedPlace}
            onPlaceChange={handlePlaceChange}
          />
        </div>
      </div>

      {/* Booking Floating Actions */}
      <BookingFloatingActions />
      {/* Bottom Tab Navigation */}
      <BottomTabNavigation />
    </div>
  );
};

export default LocationSearchMap;