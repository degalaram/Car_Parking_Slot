import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const CitySelector = ({ selectedCity, onCityChange, className = '', cities }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Default cities if not provided as prop
  const defaultCities = [
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
        { name: 'SR Nagar', coordinates: { lat: 17.4398, lng: 78.4482 } },
        { name: 'Punjagutta', coordinates: { lat: 17.4326, lng: 78.4594 } },
        { name: 'Somajiguda', coordinates: { lat: 17.4195, lng: 78.4547 } },
        { name: 'Abids', coordinates: { lat: 17.3907, lng: 78.4865 } }
      ]
    },
    {
      value: 'bangalore',
      label: 'Bangalore',
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
        { name: 'JP Nagar', coordinates: { lat: 12.9082, lng: 77.5854 } }
      ]
    },
    {
      value: 'delhi',
      label: 'Delhi',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      icon: 'MapPin',
      areas: [
        { name: 'Connaught Place', coordinates: { lat: 28.6304, lng: 77.2177 } },
        { name: 'Karol Bagh', coordinates: { lat: 28.6519, lng: 77.1909 } },
        { name: 'Lajpat Nagar', coordinates: { lat: 28.5678, lng: 77.2432 } },
        { name: 'Chandni Chowk', coordinates: { lat: 28.6506, lng: 77.2303 } },
        { name: 'India Gate', coordinates: { lat: 28.6129, lng: 77.2295 } }
      ]
    },
    {
      value: 'mumbai',
      label: 'Mumbai',
      coordinates: { lat: 19.0760, lng: 72.8777 },
      icon: 'MapPin',
      areas: [
        { name: 'Bandra', coordinates: { lat: 19.0596, lng: 72.8295 } },
        { name: 'Andheri', coordinates: { lat: 19.1136, lng: 72.8697 } },
        { name: 'Powai', coordinates: { lat: 19.1176, lng: 72.9060 } },
        { name: 'Colaba', coordinates: { lat: 18.9067, lng: 72.8147 } },
        { name: 'Worli', coordinates: { lat: 19.0176, lng: 72.8187 } }
      ]
    }
  ];

  const citiesData = cities || defaultCities;

  const handleCityChange = (cityValue) => {
    const city = citiesData.find(c => c.value === cityValue);
    if (city) {
      onCityChange(city);
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative w-full max-w-[180px] ${className}`}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-left flex items-center justify-between"
      >
        <span>{selectedCity?.label || citiesData[0].label}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Scrollable Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto">
          {citiesData.map((city) => (
            <button
              key={city.value}
              onClick={() => handleCityChange(city.value)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                selectedCity?.value === city.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{city.label}</span>
                {city.areas && (
                  <span className="text-xs text-gray-500">
                    {city.areas.length} areas
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySelector;