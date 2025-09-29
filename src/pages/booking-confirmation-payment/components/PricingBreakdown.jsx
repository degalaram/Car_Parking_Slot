
import React from 'react';
import Icon from '../../../components/AppIcon';

const PricingBreakdown = ({ pricingData }) => {
  const {
    baseRate = 45.00,
    timeAdjustment = 5.00,
    vehicleFee = 0.00,
    discounts = [],
    subtotal = 37.50,
    serviceFee = 2.50,
    tax = 3.20,
    taxRate = 8.5,
    total = 43.20,
    totalSavings = 12.50,
    duration = "2 hours"
  } = pricingData || {};

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">Pricing Breakdown</h3>
        <p className="text-sm text-muted-foreground">Detailed cost calculation for {duration}</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Base Pricing */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Base rate ({duration})</span>
            <span className="font-medium text-foreground">₹{baseRate.toFixed(2)}</span>
          </div>
          
          {timeAdjustment > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Time adjustment</span>
              <span className="font-medium text-foreground">+₹{timeAdjustment.toFixed(2)}</span>
            </div>
          )}
          
          {vehicleFee > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Vehicle fee</span>
              <span className="font-medium text-foreground">+₹{vehicleFee.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Discounts */}
        {discounts && discounts.length > 0 && (
          <div className="space-y-3 border-t border-border pt-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Icon name="Tag" size={14} className="text-green-600" />
              Applied Discounts
            </h4>
            {discounts.map((discount, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-green-600">{discount.name}</span>
                <span className="font-medium text-green-600">-₹{discount.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Subtotal */}
        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">Subtotal</span>
            <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Fees and Taxes */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Service fee</span>
            <span className="font-medium text-foreground">₹{serviceFee.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tax ({taxRate}%)</span>
            <span className="font-medium text-foreground">₹{tax.toFixed(2)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t-2 border-primary/20 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-foreground">Total Amount</span>
            <span className="text-lg font-bold text-primary">₹{total.toFixed(2)}</span>
          </div>
          
          {totalSavings > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600">You saved</span>
              <span className="text-sm font-medium text-green-600">₹{totalSavings.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Payment Info */}
        <div className="bg-muted/20 rounded-lg p-3 mt-4">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Payment Information</p>
              <p>• Full payment is required to confirm booking</p>
              <p>• Refunds processed within 3-5 business days</p>
              <p>• Receipt will be sent via email</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingBreakdown;
