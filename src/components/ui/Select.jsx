import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const Select = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option',
  label = '',
  error = '',
  disabled = false,
  className = '',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`
          relative w-full bg-white border border-gray-300 rounded-lg px-3 py-3 cursor-pointer
          transition-all duration-200 min-h-[48px] flex items-center
          text-base select-none touch-manipulation
          ${error ? 'border-red-500' : 'border-gray-300 hover:border-blue-500 focus-within:border-blue-500'}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-gray-50 active:bg-gray-100'}
          ${isOpen ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm' : ''}
        `}
        onClick={toggleDropdown}
        onTouchStart={(e) => e.preventDefault()}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <span className={`flex-1 text-left truncate ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon
          name="ChevronDown"
          size={20}
          className={`text-gray-400 transition-transform ml-2 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 mt-1 z-50 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden max-h-60"
          style={{ 
            zIndex: 9999,
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            WebkitOverflowScrolling: 'touch'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {options.length > 5 && (
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: '16px' }}
                autoFocus
              />
            </div>
          )}

          <div 
            className="overflow-y-auto overscroll-contain max-h-48"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`
                    px-4 py-3 cursor-pointer transition-colors text-base touch-manipulation
                    hover:bg-gray-100 active:bg-gray-200 min-h-[48px] flex items-center
                    ${option.value === value ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500' : 'text-gray-900'}
                  `}
                  onClick={() => handleSelect(option.value)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleSelect(option.value);
                  }}
                  role="option"
                  aria-selected={option.value === value}
                  style={{ 
                    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0.1)',
                    fontSize: '16px'
                  }}
                >
                  <span className="truncate flex-1">{option.label}</span>
                  {option.value === value && (
                    <Icon name="Check" size={14} className="ml-2 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 min-h-[44px] flex items-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
