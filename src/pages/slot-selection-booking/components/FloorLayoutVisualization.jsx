import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FloorLayoutVisualization = ({ 
  selectedFloor, 
  onFloorChange, 
  selectedSlot, 
  onSlotSelect,
  vehicleType,
  className = '' 
}) => {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [clickedSlot, setClickedSlot] = useState(null); // State to track the clicked slot

  // State for the modal
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedSlotForModal, setSelectedSlotForModal] = useState(null);

  // Mock floor data with hierarchical slot identification
  const floors = [
    { id: 1, name: '1st Floor', totalSlots: 120, availableSlots: 45 },
    { id: 2, name: '2nd Floor', totalSlots: 120, availableSlots: 67 },
    { id: 3, name: '3rd Floor', totalSlots: 100, availableSlots: 23 }
  ];

  // Generate mock slot data for selected floor
  const generateSlotData = (floorId) => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const slotsPerRow = floorId === 3 ? 16 : 20;
    const slots = [];

    rows?.forEach((row, rowIndex) => {
      for (let slotNum = 1; slotNum <= slotsPerRow; slotNum++) {
        const slotId = `${floorId}-${row}-${slotNum}`;
        const random = Math.random();

        // Determine slot status based on random probability - reduced reserved slots
        let status = 'available';
        if (random < 0.1) status = 'reserved';         // Only 10% reserved (was 30%)
        else if (random < 0.15) status = 'ending-soon'; // 5% ending soon
        else if (random < 0.18) status = 'maintenance';  // 3% maintenance

        // Vehicle compatibility - show all slots as available when no vehicle type is selected
        const isCompatible = !vehicleType || // If no vehicle type selected, show all as compatible
          (vehicleType === 'two-wheeler' ? 
            (rowIndex >= 4) : // Two-wheelers in rows E, F
            (rowIndex < 4));  // Four-wheelers in rows A, B, C, D

        slots?.push({
          id: slotId,
          floorId,
          row,
          slotNumber: slotNum,
          status: isCompatible ? status : 'incompatible',
          vehicleType: vehicleType, // Always pass the selected vehicle type
          location: `${floorId === 1 ? '1st' : floorId === 2 ? '2nd' : '3rd'} Floor ${row} Row ${slotNum}${slotNum === 1 ? 'st' : slotNum === 2 ? 'nd' : slotNum === 3 ? 'rd' : 'th'} Parking Slot`,
          walkingDistance: Math.floor(Math.random() * 150) + 50, // 50-200 meters
          amenities: ['CCTV', 'Lighting', random > 0.5 ? 'EV Charging' : null]?.filter(Boolean),
          endTime: status === 'ending-soon' ? new Date(Date.now() + Math.random() * 3600000) : null
        });
      }
    });

    return slots;
  };

  const [slotData, setSlotData] = useState(generateSlotData(selectedFloor));

  useEffect(() => {
    setSlotData(generateSlotData(selectedFloor));
  }, [selectedFloor, vehicleType]);

  const getSlotColor = (slot) => {
    switch (slot?.status) {
      case 'available':
        return 'bg-success hover:bg-success/80 border-success';
      case 'reserved':
        return 'bg-destructive border-destructive cursor-not-allowed';
      case 'ending-soon':
        return 'bg-warning hover:bg-warning/80 border-warning';
      case 'maintenance':
        return 'bg-muted border-muted cursor-not-allowed';
      case 'incompatible':
        return 'bg-muted/50 border-muted cursor-not-allowed opacity-50';
      default:
        return 'bg-muted border-muted';
    }
  };

  const getSlotIcon = (slot) => {
    if (slot?.status === 'incompatible') return null;
    if (vehicleType === 'two-wheeler') return 'Bike';
    return 'Car';
  };

  // Handle slot selection with modal
  const handleSlotClick = (slot) => {
    console.log('FloorLayout - Slot clicked:', slot);
    if (slot.status === 'available' || slot.status === 'ending-soon') {
      setSelectedSlotForModal(slot);
      setShowSelectionModal(true);
    }
  };

  // Confirm slot selection
  const handleConfirmSlotSelection = () => {
    console.log('FloorLayout - Confirming slot selection:', selectedSlotForModal);
    if (selectedSlotForModal) {
      // Ensure we pass complete slot data
      const completeSlotData = {
        ...selectedSlotForModal,
        slotNumber: selectedSlotForModal.slotNumber || selectedSlotForModal.id,
        location: selectedSlotForModal.location || `${selectedFloor === 1 ? '1st' : selectedFloor === 2 ? '2nd' : '3rd'} Floor ${selectedSlotForModal.row || 'A'} Row ${selectedSlotForModal.slotNumber || selectedSlotForModal.id}th Parking Slot`,
        floorId: selectedFloor,
        walkingDistance: selectedSlotForModal.walkingDistance || Math.floor(Math.random() * 100) + 50
      };

      console.log('FloorLayout - Passing complete slot data:', completeSlotData);
      onSlotSelect(completeSlotData);
      setShowSelectionModal(false);
      setSelectedSlotForModal(null);
    }
  };

  const currentFloor = floors?.find(f => f?.id === selectedFloor);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      {/* Floor Selection Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Floor Layout</h3>
          <div className="text-sm text-muted-foreground">
            {currentFloor?.availableSlots} of {currentFloor?.totalSlots} available
          </div>
        </div>

        {/* Floor Tabs */}
        <div className="flex gap-2">
          {floors?.map((floor) => (
            <Button
              key={floor?.id}
              variant={selectedFloor === floor?.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onFloorChange(floor?.id);
                setClickedSlot(null); // Clear selected slot when changing floor
              }}
              className="flex-1"
            >
              <div className="text-center">
                <div className="font-medium">{floor?.name}</div>
                <div className="text-xs opacity-80">{floor?.availableSlots} free</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded border"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded border"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded border"></div>
            <span>Ending Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted rounded border"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted/50 rounded border opacity-50"></div>
            <span>Incompatible</span>
          </div>
        </div>
      </div>
      {/* Slot Grid */}
      <div className="p-4">
        <div className="space-y-6">
          {rows?.map((row) => {
            const rowSlots = slotData?.filter(slot => slot?.row === row);
            const isVehicleCompatibleRow = vehicleType === 'two-wheeler' ? 
              ['E', 'F']?.includes(row) : 
              ['A', 'B', 'C', 'D']?.includes(row);

            return (
              <div key={row} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-sm font-medium">
                    {row}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Row {row} - {isVehicleCompatibleRow ? 
                      (vehicleType === 'two-wheeler' ? 'Two Wheeler' : 'Four Wheeler') : 
                      'Not Compatible'
                    }
                  </div>
                </div>
                <div className="overflow-x-auto pb-8">
                  <div 
                    className="grid gap-3 sm:gap-4 min-w-full"
                    style={{
                      gridTemplateColumns: `repeat(${rowSlots?.length || 20}, minmax(40px, 1fr))`,
                      maxWidth: '100%',
                      width: 'max-content'
                    }}
                  >
                    {rowSlots?.map((slot) => (
                      <button
                        key={slot?.id}
                        onClick={() => handleSlotClick(slot)}
                        onMouseEnter={() => setHoveredSlot(slot)}
                        onMouseLeave={() => setHoveredSlot(null)}
                        className={`
                          relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center flex-shrink-0
                          ${getSlotColor(slot)}
                          ${selectedSlot?.id === slot?.id ? 'ring-2 ring-primary ring-offset-1 scale-105' : ''}
                          ${slot?.status === 'available' || slot?.status === 'ending-soon' ? 'hover:scale-110' : ''}
                          ${clickedSlot?.id === slot?.id ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50 border-blue-500 scale-105' : ''}
                        `}
                        disabled={slot?.status === 'reserved' || slot?.status === 'maintenance' || slot?.status === 'incompatible'}
                        title={slot?.location}
                      >
                        {getSlotIcon(slot) && (
                          <Icon 
                            name={getSlotIcon(slot)} 
                            size={14} 
                            className="text-white"
                          />
                        )}
                        <span className="absolute -bottom-6 text-xs font-mono text-foreground bg-background/80 px-1 rounded whitespace-nowrap">
                          {slot?.slotNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Tooltip */}
        {hoveredSlot && (
          <div className="fixed z-50 bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border border-border pointer-events-none">
            <div className="font-medium">{hoveredSlot?.location}</div>
            <div className="text-sm text-muted-foreground">
              Walking distance: {hoveredSlot?.walkingDistance}m
            </div>
            {hoveredSlot?.amenities?.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Amenities: {hoveredSlot?.amenities?.join(', ')}
              </div>
            )}
            {hoveredSlot?.endTime && (
              <div className="text-sm text-warning">
                Available in: {Math.ceil((hoveredSlot?.endTime - new Date()) / 60000)} min
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slot Selection Modal */}
      {showSelectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card p-6 rounded-lg shadow-xl border border-border max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Confirm Slot Selection</h3>
              <button onClick={() => { setShowSelectionModal(false); setSelectedSlotForModal(null); }} className="text-muted-foreground hover:text-foreground">
                &times;
              </button>
            </div>
            {selectedSlotForModal && (
              <>
                <p className="text-sm text-foreground/80 mb-2">
                  You are about to select:
                </p>
                <p className="font-medium text-primary mb-4">
                  {selectedSlotForModal.location}
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => { setShowSelectionModal(false); setSelectedSlotForModal(null); }} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmSlotSelection} className="flex-1">
                    Confirm
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Select Slot Button (if not using modal) - This part might need adjustment based on UI flow */}
      {/* The logic is now primarily driven by the modal, so this might be redundant or need to be integrated differently */}
      {clickedSlot && !showSelectionModal && (
        <div className="mt-6 p-4 bg-primary/10 border-2 border-primary rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-primary text-lg">
                Slot {clickedSlot.id} Selected
              </h4>
              <p className="text-sm text-foreground/80">
                {clickedSlot.location}
              </p>
            </div>
            <div className="text-xs text-primary font-medium bg-primary/20 px-2 py-1 rounded">
              {clickedSlot.status === 'available' ? 'Available Now' : 'Available Soon'}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setClickedSlot(null)}
              className="flex-1 px-4 py-3 border-2 border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSlotSelection} // Use the modal confirmation handler
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-sm"
            >
              Select This Slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorLayoutVisualization;
