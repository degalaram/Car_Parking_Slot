import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const DateTimeSelector = ({
  selectedDateTime,
  onDateTimeChange,
  duration,
  onDurationChange,
  className = ''
}) => {
  const [selectedDate, setSelectedDate] = useState(
    selectedDateTime?.date || new Date()?.toISOString()?.split('T')?.[0]
  );
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  const [selectedEndHour, setSelectedEndHour] = useState('11');
  const [selectedEndMinute, setSelectedEndMinute] = useState('00');
  const [selectedEndPeriod, setSelectedEndPeriod] = useState('AM');
  const [useManualEndTime, setUseManualEndTime] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(duration || 2);

  // Convert hour/minute/period to 24-hour format
  const convertTo24Hour = (hour, minute, period) => {
    let h = parseInt(hour, 10);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minute}`;
  };

  // Format time display for better readability
  const formatDisplayTime = (hour, minute, period) => {
    return `${hour}:${minute} ${period}`;
  };

  // Format end time with consistent formatting
  const formatEndTime = (endDateTime) => {
    if (!endDateTime) return '';
    const hour = endDateTime.getHours();
    const minute = endDateTime.getMinutes().toString().padStart(2, '0');
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour.toString().padStart(2, '0')}:${minute} ${period}`;
  };

  const selectedTime = convertTo24Hour(selectedHour, selectedMinute, selectedPeriod);
  const selectedEndTime = useManualEndTime
    ? convertTo24Hour(selectedEndHour, selectedEndMinute, selectedEndPeriod)
    : null;

  // Generate hour options (1-12)
  const generateHourOptions = () => {
    const hours = [];
    for (let i = 1; i <= 12; i++) {
      const hourStr = i.toString().padStart(2, '0');
      hours.push({ value: hourStr, label: hourStr });
    }
    return hours;
  };

  // Generate minute options (00, 15, 30, 45)
  const generateMinuteOptions = () => {
    const minutes = [];
    for (let i = 0; i < 60; i += 15) {
      const minuteStr = i.toString().padStart(2, '0');
      minutes.push({ value: minuteStr, label: minuteStr });
    }
    return minutes;
  };

  // Generate time slots (15-minute intervals for more precision)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour?.toString()?.padStart(2, '0')}:${minute?.toString()?.padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`)?.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        slots?.push({
          value: timeString,
          label: displayTime
        });
      }
    }
    return slots;
  };

  // Duration options with minutes
  const durationOptions = [
    { value: 0.25, label: '15 Minutes' },
    { value: 0.5, label: '30 Minutes' },
    { value: 0.75, label: '45 Minutes' },
    { value: 1, label: '1 Hour' },
    { value: 1.25, label: '1 Hour 15 Minutes' },
    { value: 1.5, label: '1 Hour 30 Minutes' },
    { value: 1.75, label: '1 Hour 45 Minutes' },
    { value: 2, label: '2 Hours' },
    { value: 2.5, label: '2 Hours 30 Minutes' },
    { value: 3, label: '3 Hours' },
    { value: 4, label: '4 Hours' },
    { value: 6, label: '6 Hours' },
    { value: 8, label: '8 Hours' },
    { value: 12, label: '12 Hours' },
    { value: 24, label: '24 Hours (Full Day)' }
  ];

  const timeSlots = generateTimeSlots();

  // Calculate end time
  const calculateEndTime = (startDate, startTime, durationHours) => {
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + (durationHours * 60 * 60 * 1000));
    return endDateTime;
  };

  const endDateTime = useManualEndTime && selectedEndTime
    ? new Date(`${selectedDate}T${selectedEndTime}`)
    : calculateEndTime(selectedDate, selectedTime, selectedDuration);

  // Update parent component when values change
  useEffect(() => {
    const startDateTime = new Date(`${selectedDate}T${selectedTime}`);

    // Calculate duration if using manual end time
    let calculatedDuration = selectedDuration;
    let durationInMinutes = selectedDuration * 60;
    
    if (useManualEndTime && selectedEndTime) {
      const endDateTime = new Date(`${selectedDate}T${selectedEndTime}`);
      const durationMs = endDateTime - startDateTime;
      calculatedDuration = Math.max(0, durationMs / (1000 * 60 * 60)); // Convert to hours
      durationInMinutes = Math.max(0, durationMs / (1000 * 60)); // Convert to minutes
    }

    onDateTimeChange({
      date: selectedDate,
      time: selectedTime,
      startDateTime,
      endDateTime,
      duration: calculatedDuration,
      durationInMinutes: Math.round(durationInMinutes),
      useManualEndTime,
      manualEndTime: useManualEndTime ? selectedEndTime : null
    });
    onDurationChange(calculatedDuration);
  }, [selectedDate, selectedTime, selectedDuration, useManualEndTime, selectedEndHour, selectedEndMinute, selectedEndPeriod, selectedEndTime]);

  // Quick time selection
  const quickTimeOptions = [
    { label: 'Now', time: new Date()?.toTimeString()?.slice(0, 5) },
    { label: '9:00 AM', time: '09:00' },
    { label: '12:00 PM', time: '12:00' },
    { label: '3:00 PM', time: '15:00' },
    { label: '6:00 PM', time: '18:00' }
  ];

  const handleQuickTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Get minimum date (today)
  const today = new Date()?.toISOString()?.split('T')?.[0];
  const maxDate = new Date();
  maxDate?.setDate(maxDate?.getDate() + 30); // 30 days from now
  const maxDateString = maxDate?.toISOString()?.split('T')?.[0];

  // Check if selected time is in the past for today
  const isTimeInPast = () => {
    if (selectedDate === today) {
      const now = new Date();
      const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
      return selectedDateTime < now;
    }
    return false;
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Icon name="Calendar" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Select Date & Time</h3>
        </div>

        {/* Date Selection */}
        <div className="space-y-4">
          <Input
            type="date"
            label="Parking Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e?.target?.value)}
            min={today}
            max={maxDateString}
            required
          />

          {/* Manual Time Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Start Time</label>

            {/* Start Time Selectors */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <input
                  type="text"
                  value={selectedHour}
                  onChange={(e) => {
                    const input = e.target.value;
                    
                    // Allow empty or up to 2 digits
                    if (input === '' || /^\d{1,2}$/.test(input)) {
                      if (input === '') {
                        setSelectedHour('');
                      } else {
                        const numValue = parseInt(input, 10);
                        if (numValue >= 1 && numValue <= 12) {
                          setSelectedHour(input);
                        } else if (input.length === 1) {
                          // Allow single digit input for typing
                          setSelectedHour(input);
                        }
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setSelectedHour('01');
                    } else {
                      const numValue = parseInt(value, 10);
                      if (numValue >= 1 && numValue <= 12) {
                        setSelectedHour(numValue.toString().padStart(2, '0'));
                      } else {
                        setSelectedHour('01');
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    // Allow backspace, delete, tab, escape, enter
                    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                        (e.keyCode === 65 && e.ctrlKey === true) ||
                        (e.keyCode === 67 && e.ctrlKey === true) ||
                        (e.keyCode === 86 && e.ctrlKey === true) ||
                        (e.keyCode === 88 && e.ctrlKey === true)) {
                      return;
                    }
                    // Ensure that it is a number and stop the keypress
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary text-center"
                  placeholder="01"
                  maxLength="2"
                />
                <div className="text-xs text-muted-foreground text-center mt-1">Hour (01-12)</div>
              </div>
              <div>
                <input
                  type="text"
                  value={selectedMinute}
                  onChange={(e) => {
                    const input = e.target.value;
                    
                    // Allow empty or up to 2 digits
                    if (input === '' || /^\d{1,2}$/.test(input)) {
                      if (input === '') {
                        setSelectedMinute('');
                      } else {
                        const numValue = parseInt(input, 10);
                        if (numValue >= 0 && numValue <= 59) {
                          setSelectedMinute(input);
                        } else if (input.length === 1) {
                          // Allow single digit input for typing
                          setSelectedMinute(input);
                        }
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setSelectedMinute('00');
                    } else {
                      const numValue = parseInt(value, 10);
                      if (numValue >= 0 && numValue <= 59) {
                        setSelectedMinute(numValue.toString().padStart(2, '0'));
                      } else {
                        setSelectedMinute('00');
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    // Allow backspace, delete, tab, escape, enter
                    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                        (e.keyCode === 65 && e.ctrlKey === true) ||
                        (e.keyCode === 67 && e.ctrlKey === true) ||
                        (e.keyCode === 86 && e.ctrlKey === true) ||
                        (e.keyCode === 88 && e.ctrlKey === true)) {
                      return;
                    }
                    // Ensure that it is a number and stop the keypress
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary text-center"
                  placeholder="00"
                  maxLength="2"
                />
                <div className="text-xs text-muted-foreground text-center mt-1">Minute (00-59)</div>
              </div>
              <div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
                <div className="text-xs text-muted-foreground text-center mt-1">Period</div>
              </div>
            </div>

            {/* End Time Selection Toggle */}
            <div className="flex items-center gap-2 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useManualEndTime}
                  onChange={(e) => setUseManualEndTime(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">Set custom end time</span>
              </label>
            </div>

            {/* Manual End Time Selection */}
            {useManualEndTime && (
              <div className="space-y-3 mt-3">
                <label className="text-sm font-medium text-foreground">End Time</label>

                {/* End Time Selectors */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      value={selectedEndHour}
                      onChange={(e) => {
                        const input = e.target.value;
                        
                        // Allow empty or up to 2 digits
                        if (input === '' || /^\d{1,2}$/.test(input)) {
                          if (input === '') {
                            setSelectedEndHour('');
                          } else {
                            const numValue = parseInt(input, 10);
                            if (numValue >= 1 && numValue <= 12) {
                              setSelectedEndHour(input);
                            } else if (input.length === 1) {
                              // Allow single digit input for typing
                              setSelectedEndHour(input);
                            }
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setSelectedEndHour('01');
                        } else {
                          const numValue = parseInt(value, 10);
                          if (numValue >= 1 && numValue <= 12) {
                            setSelectedEndHour(numValue.toString().padStart(2, '0'));
                          } else {
                            setSelectedEndHour('01');
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Allow backspace, delete, tab, escape, enter
                        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                            (e.keyCode === 65 && e.ctrlKey === true) ||
                            (e.keyCode === 67 && e.ctrlKey === true) ||
                            (e.keyCode === 86 && e.ctrlKey === true) ||
                            (e.keyCode === 88 && e.ctrlKey === true)) {
                          return;
                        }
                        // Ensure that it is a number and stop the keypress
                        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary text-center"
                      placeholder="01"
                      maxLength="2"
                    />
                    <div className="text-xs text-muted-foreground text-center mt-1">Hour (01-12)</div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={selectedEndMinute}
                      onChange={(e) => {
                        const input = e.target.value;
                        
                        // Allow empty or up to 2 digits
                        if (input === '' || /^\d{1,2}$/.test(input)) {
                          if (input === '') {
                            setSelectedEndMinute('');
                          } else {
                            const numValue = parseInt(input, 10);
                            if (numValue >= 0 && numValue <= 59) {
                              setSelectedEndMinute(input);
                            } else if (input.length === 1) {
                              // Allow single digit input for typing
                              setSelectedEndMinute(input);
                            }
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setSelectedEndMinute('00');
                        } else {
                          const numValue = parseInt(value, 10);
                          if (numValue >= 0 && numValue <= 59) {
                            setSelectedEndMinute(numValue.toString().padStart(2, '0'));
                          } else {
                            setSelectedEndMinute('00');
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Allow backspace, delete, tab, escape, enter
                        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                            (e.keyCode === 65 && e.ctrlKey === true) ||
                            (e.keyCode === 67 && e.ctrlKey === true) ||
                            (e.keyCode === 86 && e.ctrlKey === true) ||
                            (e.keyCode === 88 && e.ctrlKey === true)) {
                          return;
                        }
                        // Ensure that it is a number and stop the keypress
                        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary text-center"
                      placeholder="00"
                      maxLength="2"
                    />
                    <div className="text-xs text-muted-foreground text-center mt-1">Minute (00-59)</div>
                  </div>
                  <div>
                    <select
                      value={selectedEndPeriod}
                      onChange={(e) => setSelectedEndPeriod(e.target.value)}
                      className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <div className="text-xs text-muted-foreground text-center mt-1">Period</div>
                  </div>
                </div>
              </div>
            )}

            {/* Time Preview */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-3">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Selected Time Range</div>
                <div className="text-lg font-mono font-bold text-primary">
                  {formatDisplayTime(selectedHour, selectedMinute, selectedPeriod)} - {formatEndTime(endDateTime)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(() => {
                    if (useManualEndTime) {
                      const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
                      const endDateTime = new Date(`${selectedDate}T${selectedEndTime}`);
                      const durationMs = endDateTime - startDateTime;
                      const actualMinutes = Math.max(0, Math.round(durationMs / (1000 * 60)));
                      
                      if (actualMinutes < 60) {
                        return `Duration: ${actualMinutes} Minutes`;
                      } else if (actualMinutes === 60) {
                        return 'Duration: 1 Hour';
                      } else if (actualMinutes % 60 === 0) {
                        return `Duration: ${Math.floor(actualMinutes / 60)} Hours`;
                      } else {
                        const hours = Math.floor(actualMinutes / 60);
                        const mins = actualMinutes % 60;
                        return `Duration: ${hours} Hour${hours > 1 ? 's' : ''} ${mins} Minutes`;
                      }
                    } else {
                      const actualMinutes = Math.round(selectedDuration * 60);
                      if (actualMinutes < 60) {
                        return `Duration: ${actualMinutes} Minutes`;
                      } else if (actualMinutes === 60) {
                        return 'Duration: 1 Hour';
                      } else if (actualMinutes % 60 === 0) {
                        return `Duration: ${Math.floor(actualMinutes / 60)} Hours`;
                      } else {
                        const hours = Math.floor(actualMinutes / 60);
                        const mins = actualMinutes % 60;
                        return `Duration: ${hours} Hour${hours > 1 ? 's' : ''} ${mins} Minutes`;
                      }
                    }
                  })()}
                </div>
              </div>
            </div>


          </div>

          {/* Duration Selection - Only show if not using manual end time */}
          {!useManualEndTime && (
            <Select
              label="Parking Duration"
              options={durationOptions}
              value={selectedDuration}
              onChange={setSelectedDuration}
              placeholder="Select duration"
            />
          )}
        </div>

        {/* Booking Summary */}
        <div className="bg-muted/20 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-foreground">Booking Summary</h4>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Start</div>
              <div className="font-medium text-foreground">
                {new Date(`${selectedDate}T${selectedTime}`)?.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="text-muted-foreground">
                {formatDisplayTime(selectedHour, selectedMinute, selectedPeriod)}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground mb-1">End</div>
              <div className="font-medium text-foreground">
                {endDateTime?.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="text-muted-foreground">
                {formatEndTime(endDateTime)}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Duration</span>
              <span className="font-medium text-foreground">
                {(() => {
                  let actualDuration = selectedDuration;
                  let actualMinutes = selectedDuration * 60;
                  
                  if (useManualEndTime && selectedEndTime) {
                    const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
                    const endDateTime = new Date(`${selectedDate}T${selectedEndTime}`);
                    const durationMs = endDateTime - startDateTime;
                    actualDuration = Math.max(0, durationMs / (1000 * 60 * 60));
                    actualMinutes = Math.max(0, durationMs / (1000 * 60));
                  }
                  
                  const roundedMinutes = Math.round(actualMinutes);
                  
                  if (roundedMinutes < 60) {
                    return `${roundedMinutes} Minutes`;
                  } else if (roundedMinutes === 60) {
                    return '1 Hour';
                  } else if (roundedMinutes % 60 === 0) {
                    return `${Math.floor(roundedMinutes / 60)} Hours`;
                  } else {
                    const hours = Math.floor(roundedMinutes / 60);
                    const mins = roundedMinutes % 60;
                    return `${hours} Hour${hours > 1 ? 's' : ''} ${mins} Minutes`;
                  }
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Time Validation Warning */}
        {isTimeInPast() && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-warning">Invalid Time Selection</div>
                <div className="text-warning/80">
                  Please select a future time for today's bookings.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimeSelector;
