import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, SettingsIcon, RotateCwIcon } from 'lucide-react';

const VehicleSelector = ({ onVehicleChange }) => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  
  // Debug logging for state changes
  useEffect(() => {
    console.log('VehicleSelector - State changed:', { selectedType, selectedModel });
  }, [selectedType, selectedModel]);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const typeDropdownRef = useRef(null);
  const modelDropdownRef = useRef(null);

  const vehicleTypes = [
    'Two Wheeler',
    'Four Wheeler',
    'Commercial Vehicle'
  ];

  const vehicleModels = {
    'Two Wheeler': ['Honda Activa', 'Bajaj Pulsar', 'Royal Enfield', 'TVS Apache', 'Yamaha FZ', 'Other Bikes'],
    'Four Wheeler': ['Maruti Swift', 'Hyundai i20', 'Toyota Innova', 'Honda City', 'Tata Nexon', 'Other Cars'],
    'Commercial Vehicle': ['Tata Ace', 'Mahindra Bolero Pickup', 'Ashok Leyland Partner']
  };

  // Specific model images - organized by vehicle type with actual bike images
  const modelImages = {
    // Two Wheeler Models - Using specific uploaded bike images
    'Honda Activa': [
      '/attached_assets/honda_activa_blue.jpg',
      '/attached_assets/download_1758784421583.jpg',
      '/attached_assets/download_1758784454326.jpg'
    ],
    'Bajaj Pulsar': [
      '/attached_assets/bajaj_pulsar_blue.jpg',
      '/attached_assets/download_1758784517645.jpg',
      '/attached_assets/download_1758784567473.jpg'
    ],
    'Royal Enfield': [
      '/attached_assets/royal_enfield_classic.jpg',
      '/attached_assets/download_1758784583124.jpg',
      '/attached_assets/download_1759081322589.jpg'
    ],
    'TVS Apache': [
      '/attached_assets/tvs_apache_black.jpg',
      '/attached_assets/download_1758784517645.jpg',
      '/attached_assets/download_1758784567473.jpg'
    ],
    'Yamaha FZ': [
      '/attached_assets/yamaha_r15_red.jpg',
      '/attached_assets/c0fcf5bf-856b-4577-8d19-482be583214c_1759081437190.jpg',
      '/attached_assets/download_1758784583124.jpg'
    ],
    'Other Bikes': [
      '/attached_assets/vespa_red_classic.jpg',
      '/attached_assets/download_1758784576189.jpg',
      '/attached_assets/download_1759081556682.jpg'
    ],

    // Four Wheeler Models
    'Maruti Swift': [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549399872-f6b6b5e28c91?w=800&h=600&fit=crop'
    ],
    'Hyundai i20': [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593979999838-4eb7e6e1b508?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
    ],
    'Toyota Innova': [
      'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581540222194-0def2dda94b8?w=800&h=600&fit=crop'
    ],
    'Honda City': [
      'https://images.unsplash.com/photo-1549399872-f6b6b5e28c91?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop'
    ],
    'Tata Nexon': [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593979999838-4eb7e6e1b508?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    ],
    'Other Cars': [
      'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'
    ],

    // Commercial Vehicle Models
    'Tata Ace': [
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    'Mahindra Bolero Pickup': [
      'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop'
    ],
    'Ashok Leyland Partner': [
      'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800&h=600&fit=crop'
    ]
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsTypeOpen(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target)) {
        setIsModelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeSelect = (type) => {
    console.log('VehicleSelector - Type selected:', type);
    setSelectedType(type);
    setSelectedModel(''); // Reset model when type changes
    setIsTypeOpen(false);
    resetImageState(); // Reset image state
    
    // Immediately pass basic vehicle data even without model
    const vehicleTypeMapping = {
      'Two Wheeler': 'two-wheeler',
      'Four Wheeler': 'four-wheeler',
      'Commercial Vehicle': 'commercial-vehicle'
    };
    
    const basicVehicleData = {
      type: type,
      model: '',
      name: type,
      label: type,
      vehicleType: vehicleTypeMapping[type] || 'two-wheeler',
      category: type,
      image: null
    };
    
    console.log('VehicleSelector - Calling onVehicleChange with:', basicVehicleData);
    if (onVehicleChange) {
      onVehicleChange(basicVehicleData);
    } else {
      console.error('VehicleSelector - onVehicleChange is not defined!');
    }
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setIsModelOpen(false);
    resetImageState(); // Reset image state

    const vehicleTypeMapping = {
      'Two Wheeler': 'two-wheeler',
      'Four Wheeler': 'four-wheeler',
      'Commercial Vehicle': 'commercial-vehicle'
    };

    const vehicleData = {
      type: selectedType,
      model: model,
      name: model,
      label: model,
      vehicleType: vehicleTypeMapping[selectedType] || 'two-wheeler',
      category: selectedType,
      image: getCurrentImage() || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    };

    console.log('VehicleSelector - Selected vehicle data:', vehicleData); // Debug log

    if (onVehicleChange) {
      onVehicleChange(vehicleData);
    }
  };

  const start360Rotation = () => {
    if (isRotating) return;

    setIsRotating(true);
    const duration = 3000; // 3 seconds for full rotation
    const steps = 60; // Number of steps for smooth animation
    const stepDuration = duration / steps;
    const stepRotation = 360 / steps;

    let currentStep = 0;
    const rotationInterval = setInterval(() => {
      currentStep++;
      setRotation(prev => (prev + stepRotation) % 360);

      if (currentStep >= steps) {
        clearInterval(rotationInterval);
        setIsRotating(false);
        setRotation(0);
      }
    }, stepDuration);
  };

  const getCurrentImage = () => {
    // Only show images when a specific model is selected
    if (selectedModel && modelImages[selectedModel]) {
      const imageArray = modelImages[selectedModel];
      return imageArray[currentImageIndex % imageArray.length];
    }
    return null;
  };

  const handleImageError = () => {
    if (selectedModel && modelImages[selectedModel]) {
      const imageArray = modelImages[selectedModel];
      if (currentImageIndex < imageArray.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
      } else {
        setImageError(true);
      }
    }
  };

  const resetImageState = () => {
    setCurrentImageIndex(0);
    setImageError(false);
  };

  return (
    <div className={`bg-card border border-border rounded-xl p-2 sm:p-3 shadow-sm relative transition-all duration-300 ${
      isModelOpen ? 'min-h-[450px]' : selectedModel && getCurrentImage() && !imageError ? 'min-h-[350px]' : 'min-h-[280px]'
    }`}>
      <div className="space-y-2 sm:space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            Vehicle Details
          </h3>
        </div>

        {/* Vehicle Type Selector */}
        <div className="space-y-1 sm:space-y-2">
          <label className="block text-xs font-medium text-foreground">
            Vehicle Type
          </label>
          <div
            ref={typeDropdownRef}
            className="vehicle-dropdown-container relative z-[100]"
          >
            <button
              type="button"
              onClick={() => {
                setIsTypeOpen(!isTypeOpen);
                setIsModelOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2
                       border-2 border-border rounded-lg bg-input text-foreground
                       hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20
                       transition-all duration-200 min-h-[36px] shadow-sm"
            >
              <span className={`text-xs sm:text-sm truncate pr-2 ${!selectedType ? 'text-muted-foreground' : ''}`}>
                {selectedType || 'Select vehicle type'}
              </span>
              <ChevronDownIcon
                className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${
                  isTypeOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isTypeOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 z-[101]
                            bg-white border-2 border-primary/30 rounded-lg shadow-2xl
                            max-h-48 overflow-y-auto"
                   style={{
                     position: 'absolute',
                     transform: 'translateZ(0)',
                     willChange: 'transform'
                   }}
              >
                {vehicleTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className="w-full px-3 py-2.5 text-left text-sm font-medium text-foreground
                             hover:bg-primary/5 hover:text-primary transition-colors duration-150
                             border-b border-border/50 last:border-b-0
                             min-h-[40px] flex items-center"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Model Selector - Only show when vehicle type is selected */}
        {selectedType && (
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-xs font-medium text-foreground">
              Vehicle Model
            </label>
            <div
              ref={modelDropdownRef}
              className="vehicle-model-dropdown-container relative z-[90]"
            >
              <button
                type="button"
                onClick={() => {
                  setIsModelOpen(!isModelOpen);
                  setIsTypeOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2
                           border-2 border-primary/20 bg-input text-foreground
                           hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20
                           transition-all duration-200 min-h-[36px] shadow-sm rounded-lg"
              >
                <span className={`text-xs sm:text-sm truncate pr-2 ${!selectedModel ? 'text-muted-foreground' : ''}`}>
                  {selectedModel || `Choose your ${selectedType.toLowerCase()}`}
                </span>
                <ChevronDownIcon
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${
                    isModelOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isModelOpen && vehicleModels[selectedType] && (
                <div className="absolute left-0 right-0 top-full mt-1 z-[91]
                              bg-white border-2 border-primary/30 rounded-lg shadow-2xl
                              max-h-64 overflow-y-auto"
                     style={{
                       position: 'absolute',
                       transform: 'translateZ(0)',
                       willChange: 'transform'
                     }}
                >
                  {vehicleModels[selectedType].map((model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => handleModelSelect(model)}
                      className="w-full px-4 py-3.5 text-left text-sm font-semibold text-foreground
                               hover:bg-primary/5 hover:text-primary transition-colors duration-150
                               border-b border-border/50 last:border-b-0
                               min-h-[48px] flex items-center"
                    >
                      {model}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vehicle Image Display - Only show when specific model is selected */}
        {selectedModel && (
          <div className="space-y-1.5">
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm sm:text-base font-semibold text-gray-800">Vehicle Preview</h4>
                <button
                  onClick={start360Rotation}
                  disabled={isRotating}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-primary text-white rounded-md hover:bg-primary/90
                           disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <RotateCwIcon
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${isRotating ? 'animate-spin' : ''}`}
                  />
                  <span className="text-xs sm:text-sm font-medium">
                    {isRotating ? 'Rotating...' : '360° View'}
                  </span>
                </button>
              </div>

              <div className={`relative w-full rounded-lg overflow-hidden bg-white shadow-inner ${
                getCurrentImage() && !imageError ? 'h-32 sm:h-40' : 'h-20 sm:h-28'
              }`}>
                {!imageError && getCurrentImage() ? (
                  <img
                    src={getCurrentImage()}
                    alt={selectedModel}
                    className="w-full h-full object-cover transition-transform duration-100 ease-linear"
                    style={{
                      transform: `rotateY(${rotation}deg)`,
                      transformStyle: 'preserve-3d'
                    }}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center text-gray-500">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">Vehicle Image</p>
                      <p className="text-xs">{selectedModel}</p>
                    </div>
                  </div>
                )}

                {/* Rotation indicator */}
                {isRotating && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3">
                      <RotateCwIcon className="w-6 h-6 text-primary animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2 text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  {selectedModel} ({selectedType})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Selected Vehicle Summary */}
        {selectedType && selectedModel && (
          <div className="p-2 bg-gradient-to-r from-primary/5 to-primary/10 border-2 border-primary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-primary/80 mb-1">Selected Vehicle</p>
                <p className="text-sm sm:text-base font-semibold text-primary">
                  {selectedModel}
                </p>
                <p className="text-xs text-primary/70">
                  {selectedType}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleSelector;
